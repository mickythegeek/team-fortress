export interface Source {
    id: string;
    title: string;
    url: string;
    snippet: string;
    favicon?: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    timestamp: Date;
    isStreaming?: boolean;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatSettings {
    model: string;
    temperature: number;
    maxTokens: number;
    streamingEnabled: boolean;
}
