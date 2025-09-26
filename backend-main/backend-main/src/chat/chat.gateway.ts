import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';
import { IPayload } from 'src/auth/interfaces';

@WebSocketGateway({
    cors: {
        origin: [
            'http://localhost:5173',
            'https://csm-frontend-kmoo.onrender.com'
        ],
        credentials: true,
    },
    namespace: '/'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() wss: Server;

    constructor(
        private readonly messagesWsService: WsService,
        private readonly jwtService: JwtService,
    ) { }

    async handleConnection(client: Socket) {

        // console.log("\x1b[36m", `🔵 Cliente WS conectado: ${client.id}`, "\x1b[0m");

        const token = client.handshake.headers.authentication as string;
        let payload: IPayload;

        try {
            payload = this.jwtService.verify(token);
            if (!payload) {
                client.disconnect();
                // console.log("\x1b[31m", `🔴 Cliente WS desconectado: ${client.id}`, "\x1b[0m");
                return;
            }
            await this.messagesWsService.registerClient(client, payload.id);
        } catch (error) {
            console.error('Error verifying token', error);
            client.disconnect();
            return;
        }

        this.wss.emit('clients-updated', this.messagesWsService.getConnectedEducators());
    }

    handleDisconnect(client: Socket) {
        this.messagesWsService.removeClient(client.id);
        this.wss.emit('clients-updated', this.messagesWsService.getConnectedEducators());
    }
}