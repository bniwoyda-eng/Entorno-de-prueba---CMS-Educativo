import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule, EducatorModule } from 'src/exports/modules';
import { Educator } from 'src/exports/entities';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { Chat, Message } from './entities';
import { WsService } from './ws.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    AuthModule,
    EducatorModule,
    TypeOrmModule.forFeature([Chat, Message, Educator]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, WsService],
})
export class ChatModule { }
