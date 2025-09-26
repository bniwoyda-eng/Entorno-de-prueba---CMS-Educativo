import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Chat, Message, User } from 'src/exports/entities';
import { EducatorService } from 'src/educator/educator.service';
import { ChatMessages, ChatPreview } from './interfaces';
import { GetMessagesQueryDto, SendMessageDto } from './dto';
import { WsService } from './ws.service';
import { Server } from 'socket.io';

@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private readonly wsService: WsService,

    private readonly educatorService: EducatorService,
  ) { }

  async getChatPreviews(user: User): Promise<ChatPreview[]> {
    // Verificar si el educador existe
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new NotFoundException('Educator not found');

    // Obtener los chats del educador
    const chats = await this.chatRepository.find({
      where: [
        { educatorOne: { id: educator.id } },
        { educatorTwo: { id: educator.id } },
      ],
      relations: ['educatorOne', 'educatorTwo', 'institution'],
    });

    const previews: ChatPreview[] = [];
    for (const chat of chats) {
      // Obtener el otro educador
      const otherEducator = chat.educatorOne.id === educator.id ? chat.educatorTwo : chat.educatorOne;

      // Obtener el último mensaje del chat
      const lastMessage = await this.messageRepository.findOne({
        where: { chat: { id: chat.id } },
        order: { creation_date: 'DESC' },
      });

      // Contar mensajes no leídos
      const unreadCount = await this.messageRepository.count({
        where: {
          chat: { id: chat.id },
          receiver: { id: educator.id },
          read: false,
        },
      });

      // Crear el preview
      previews.push({
        chatId: chat.id,
        participant: {
          id: otherEducator.id,
          name: otherEducator.fullName,
          avatar: otherEducator.profilePicture,
        },
        lastMessage: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          timestamp: lastMessage.creation_date,
          senderId: lastMessage.sender.id,
        } : null,
        unreadCount,
      });
    }

    // Ordenar los previews por fecha del último mensaje
    previews.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const dateB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return dateB - dateA; // Ordenar de más reciente a más antiguo
    });

    return previews;
  }

  async findOrCreateChat(user: User, targetEducatorId: string): Promise<Chat> {

    // Verificar si el educador origen existe
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new NotFoundException('Educator not found');
    const { id: currentEducatorId, institution } = educator;

    // No se puede crear un chat con uno mismo
    if (educator.id === targetEducatorId) throw new NotFoundException('You cannot create a chat with yourself');

    // Verificar si el educador destino existe en la misma institución
    const isColleague = await this.educatorService.existsOnInstitution(targetEducatorId, institution.id);
    if (!isColleague) throw new NotFoundException('Educator not found');

    // Ordenar los IDs de los educadores para evitar duplicados
    const [educatorOneId, educatorTwoId] = [...[currentEducatorId, targetEducatorId]].sort();

    // Verificar si el chat ya existe
    let chat = await this.chatRepository.findOne({
      where: {
        educatorOne: { id: educatorOneId },
        educatorTwo: { id: educatorTwoId },
        institution: { id: institution.id },
      },
      relations: ['educatorOne', 'educatorTwo', 'institution'],
    });

    // Si el chat no existe, crearlo
    if (!chat) {
      chat = this.chatRepository.create({
        educatorOne: { id: educatorOneId },
        educatorTwo: { id: educatorTwoId },
        institution: { id: institution.id },
      });
      await this.chatRepository.save(chat);
    }

    return chat;
  }

  async getMessagesByChatId(user: User, chatId: string, query: GetMessagesQueryDto): Promise<ChatMessages> {
    const { limit = 50, before } = query;

    // Verificar si el educador existe
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new NotFoundException('Educator not found');
    const { id: educatorId } = educator;

    // Verificar si el chat existe
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['educatorOne', 'educatorTwo', 'institution'],
    });
    if (!chat) throw new NotFoundException('Chat not found');

    // Verificar si el educador pertenece al chat
    const isEducatorOne = chat.educatorOne.id === educatorId;
    const isEducatorTwo = chat.educatorTwo.id === educatorId;
    if (!isEducatorOne && !isEducatorTwo) {
      throw new ForbiddenException('You are not allowed to access this chat');
    }

    // Armar query para obtener mensajes
    const qb = this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.chat_id = :chatId', { chatId })
      .select([
        'message.id',
        'message.content',
        'message.creation_date',
        'message.read',
        'sender.id',
      ])
      .orderBy('message.creation_date', 'DESC')
      .limit(limit + 1); // 👈 solicitamos uno más para saber si hay más

    if (before) {
      const referenceMessage = await this.messageRepository.findOne({ where: { id: before } });
      if (referenceMessage) {
        qb.andWhere('message.creation_date < :beforeDate', {
          beforeDate: referenceMessage.creation_date,
        });
      }
    }

    const rawMessages = await qb.getMany();

    const hasMore = rawMessages.length > limit;
    const messages = rawMessages.slice(0, limit).reverse(); // invertimos para orden natural

    return { messages, hasMore };
  }

  async markMessagesAsRead(user: User, chatId: string): Promise<{ updated: number }> {
    // Verificar si el educador existe
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new NotFoundException('Educator not found');
    const { id: educatorId } = educator;

    // Verificar si el chat existe
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['educatorOne', 'educatorTwo', 'institution'],
    });
    if (!chat) throw new NotFoundException('Chat not found');

    // Verificar si el educador pertenece al chat
    const isEducatorOne = chat.educatorOne.id === educatorId;
    const isEducatorTwo = chat.educatorTwo.id === educatorId;
    if (!isEducatorOne && !isEducatorTwo) {
      throw new ForbiddenException('You are not allowed to access this chat');
    }

    // Marcar mensajes como leídos
    // await this.messageRepository.update({
    //   chat: { id: chatId },
    //   receiver: { id: educatorId },
    //   read: false,
    // }, { read: true });

    const result = await this.messageRepository
      .createQueryBuilder()
      .update()
      .set({ read: true })
      .where('chat_id = :chatId', { chatId })
      .andWhere('receiver_id = :receiverId', { receiverId: educator.id })
      .andWhere('read = false')
      .execute();

    return { updated: result.affected || 0 };

  }

  async sendMessage(user: User, chatId: string, dto: SendMessageDto): Promise<Message> {

    const { message: content } = dto;

    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new NotFoundException('Educator not found');

    // Verificar si el chat existe
    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['educatorOne', 'educatorTwo', 'institution'],
    });
    if (!chat) throw new NotFoundException('Chat not found');

    // Verificar si el educador pertenece al chat
    const isEducatorOne = chat.educatorOne.id === educator.id;
    const isEducatorTwo = chat.educatorTwo.id === educator.id;
    if (!isEducatorOne && !isEducatorTwo) {
      throw new ForbiddenException('You are not allowed to access this chat');
    }

    // Determinar el receptor del mensaje
    const receiver = isEducatorOne ? chat.educatorTwo : chat.educatorOne;

    // Crear el mensaje
    const message = this.messageRepository.create({
      chat,
      sender: educator,
      receiver,
      content,
      read: false,
    });
    await this.messageRepository.save(message);

    // Enviar el mensaje al receptor a través de WebSocket (si está conectado)
    const targetSocket = this.wsService.getSocketByEducatorId(receiver.id);
    if (targetSocket) {
      this.wsService.sendMessage(targetSocket.id, message);
    }

    // Devolver el mensaje creado
    return message;
  }

}
