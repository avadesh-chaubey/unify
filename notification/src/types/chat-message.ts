import { ChatMessageType, ChatMessageStatus } from '@unifycaredigital/aem'

export interface ChatMessage {
    id: string;
    type: ChatMessageType;
    message: string;
    senderName: string;
    senderId: string;
    thumbUrl: string;
    imageUrl: string;
    fileName: string;
    time: Date;
    status: ChatMessageStatus;
    isEncrypted: boolean;
};
