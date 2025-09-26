import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { CreateChatDto, GetMessagesQueryDto, SendMessageDto } from './dto';
import { Auth, GetUser, ValidRoles } from 'src/auth';
import { ChatService } from './chat.service';
import { User } from 'src/exports/entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('chats')
@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get('previews')
  @Auth(ValidRoles.educator)
  getChatPreviews(@GetUser() user: User) {
    return this.chatService.getChatPreviews(user);
  }

  @Post()
  @Auth(ValidRoles.educator)
  findOrCreateChat(@GetUser() user: User, @Body() { educatorId }: CreateChatDto) {
    return this.chatService.findOrCreateChat(user, educatorId);
  }

  @Get(':chatId/messages')
  @Auth(ValidRoles.educator)
  getMessages(@GetUser() user: User, @Param('chatId', ParseUUIDPipe) chatId: string, @Query() query: GetMessagesQueryDto) {
    return this.chatService.getMessagesByChatId(user, chatId, query);
  }

  @Patch(':chatId/mark-as-read')
  @Auth(ValidRoles.educator)
  markMessagesAsRead(@GetUser() user: User, @Param('chatId', ParseUUIDPipe) chatId: string) {
    return this.chatService.markMessagesAsRead(user, chatId);
  }

  @Post(':chatId/send-message')
  @Auth(ValidRoles.educator)
  sendMessage(@GetUser() user: User,  @Param('chatId', ParseUUIDPipe) chatId: string, @Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(user, chatId, dto);
  }


}
