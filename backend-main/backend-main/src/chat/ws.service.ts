import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { Educator, Message } from 'src/exports/entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket;
        educator: Educator;
    }
}

@Injectable()
export class WsService {
    private connectedClients: ConnectedClients = {};

    constructor(
        @InjectRepository(Educator)
        private readonly educatorRepository: Repository<Educator>
    ) { }

    async registerClient(client: Socket, userId: string) {
        const educator = await this.educatorRepository.findOneBy({ user: { id: userId } });
        if (!educator) throw new Error('Educator not found');
        this.checkUserConnection(educator);
        this.connectedClients[client.id] = {
            socket: client,
            educator
        };
        // Print connected educator
        // console.log("\x1b[32m", `🟢 Educador conectado: ${educator.fullName}`, "\x1b[0m");
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getIds(): string[] {
        return Object.keys(this.connectedClients);
    }

    getConnectedEducators(): string[] {
        const connectedClients = Object.values(this.connectedClients).map(
            (client) => client.educator.id
        );
        // console.log("\x1b[33m", `🟡 Conectados: ${connectedClients}`, "\x1b[0m");
        return connectedClients;
    }

    ggetUserFullName(socketId: string): string {
        return this.connectedClients[socketId]?.educator?.fullName ?? 'Unknown';
    }

    checkUserConnection(educator: Educator) {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];
            if (connectedClient.educator.id === educator.id) {
                connectedClient.socket.disconnect();
                break;
            }
        }
    }

    getSocketByEducatorId(educatorId: string): Socket {
        for (const clientId of Object.keys(this.connectedClients)) {
            const connectedClient = this.connectedClients[clientId];
            if (connectedClient.educator.id === educatorId) {
                return connectedClient.socket;
            }
        }
        return null;
    }

    sendMessage(socketId: string, message: Message) {
        const client = this.connectedClients[socketId];
        if (client) {
            client.socket.emit('new_message', message);
        }
    }

}
