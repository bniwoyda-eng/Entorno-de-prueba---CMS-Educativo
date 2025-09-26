import { Message } from "../entities";

export interface ChatPreview {
    chatId: string;
    participant: {
        id: string;
        name: string;
        avatar?: string;
    };
    lastMessage: {
        id: string;
        content: string;
        timestamp: Date;
        senderId: string;
    } | null;
    unreadCount: number;
}

export interface ChatMessages {
    messages: Message[];
    hasMore: boolean;
}