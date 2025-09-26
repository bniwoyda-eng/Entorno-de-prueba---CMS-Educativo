export interface IChatPreview {
    chatId: string;
    participant: {
        id: string;
        name: string;
        avatar: string;
    },
    lastMessage: {
        id: string;
        content: string;
        timestamp: string;
        senderId: string;
    } | null;
    unreadCount: number;
}

export interface IMessagesParams {
    limit?: number;
    before?: string;
}

export interface IChatMessage {
    id: string;
    content: string;
    creation_date: string;
    read: boolean;
    sender: {
        id: string;
        fullName: string;
    };
    chat: {
        id: string;
    }
}

export interface IPaginatedMessages {
    messages: IChatMessage[];
    hasMore: boolean;
}
