import { useState, useCallback } from 'react';
import type { Message, Source, Conversation } from '@/types/chat';

const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock sources for demo
const mockSources: Source[] = [
    {
        id: '1',
        title: 'Fortress Documentation',
        url: 'https://docs.Fortress.ai/getting-started',
        snippet: 'Fortress Intelligence provides comprehensive knowledge management solutions...',
        favicon: '📚'
    },
    {
        id: '2',
        title: 'AI Knowledge Systems Best Practices',
        url: 'https://research.ai/knowledge-systems',
        snippet: 'Modern AI knowledge systems leverage vector embeddings for semantic search...',
        favicon: '🔬'
    },
    {
        id: '3',
        title: 'Enterprise Data Management',
        url: 'https://enterprise.tech/data-management',
        snippet: 'Effective data management strategies for enterprise-scale applications...',
        favicon: '🏢'
    }
];

// Simulated streaming response
const simulateStreamingResponse = async (
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    messageId: string,
    fullResponse: string
) => {
    const words = fullResponse.split(' ');
    let currentContent = '';

    for (let i = 0; i < words.length; i++) {
        currentContent += (i === 0 ? '' : ' ') + words[i];

        setMessages(prev =>
            prev.map(msg =>
                msg.id === messageId
                    ? { ...msg, content: currentContent, isStreaming: i < words.length - 1 }
                    : msg
            )
        );

        await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40));
    }

    // Add sources after streaming completes
    setMessages(prev =>
        prev.map(msg =>
            msg.id === messageId
                ? { ...msg, isStreaming: false, sources: mockSources.slice(0, 2 + Math.floor(Math.random() * 2)) }
                : msg
        )
    );
};

const mockResponses = [
    "Based on my analysis of the available knowledge base, I can provide you with a comprehensive overview. Fortress Intelligence leverages advanced natural language processing to understand and contextualize your queries, ensuring accurate and relevant responses.\n\nThe system utilizes semantic search capabilities to identify the most pertinent information across your connected data sources, providing citations and references for transparency and verification.",
    "I've found several relevant sources that address your question. The knowledge graph indicates strong connections between the concepts you've mentioned.\n\nHere's what the analysis reveals: The integration of AI-powered search with enterprise knowledge management enables organizations to unlock valuable insights that were previously difficult to access. This approach combines the precision of structured databases with the flexibility of natural language understanding.",
    "Excellent question! Let me break this down for you based on the indexed knowledge.\n\nFirst, it's important to understand that modern AI knowledge systems operate on multiple layers: semantic understanding, contextual relevance, and source verification. Each layer contributes to the overall accuracy and usefulness of the responses you receive.\n\nThe system continuously learns from user interactions to improve response quality over time.",
];

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'Getting Started with Fortress',
            messages: [],
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date(Date.now() - 86400000),
        },
        {
            id: '2',
            title: 'Data Integration Questions',
            messages: [],
            createdAt: new Date(Date.now() - 172800000),
            updatedAt: new Date(Date.now() - 172800000),
        },
        {
            id: '3',
            title: 'API Documentation Review',
            messages: [],
            createdAt: new Date(Date.now() - 259200000),
            updatedAt: new Date(Date.now() - 259200000),
        },
    ]);
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isLoading) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        const assistantMessage: Message = {
            id: generateId(),
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            isStreaming: true,
        };

        setMessages(prev => [...prev, assistantMessage]);

        try {
            const apiUrl = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/chat` : 'http://localhost:8000/api/chat';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Bypass-Tunnel-Reminder': 'true'
                },
                body: JSON.stringify({ message: content.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();

            // Convert backend sources to frontend Source format
            const sources: Source[] = data.sources?.map((s: { file: string; excerpt: string }, index: number) => ({
                id: String(index + 1),
                title: s.file.replace('.md', '').replace(/-/g, ' '),
                url: `#source-${index}`,
                snippet: s.excerpt,
                favicon: '📄'
            })) || [];

            // Simulate streaming effect for the response
            const words = data.response.split(' ');
            let currentContent = '';

            for (let i = 0; i < words.length; i++) {
                currentContent += (i === 0 ? '' : ' ') + words[i];

                setMessages(prev =>
                    prev.map(msg =>
                        msg.id === assistantMessage.id
                            ? { ...msg, content: currentContent, isStreaming: i < words.length - 1 }
                            : msg
                    )
                );

                await new Promise(resolve => setTimeout(resolve, 15 + Math.random() * 25));
            }

            // Add sources after streaming completes
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? { ...msg, isStreaming: false, sources }
                        : msg
                )
            );
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === assistantMessage.id
                        ? {
                            ...msg,
                            content: 'Sorry, I encountered an error connecting to the AI service. Please make sure the backend is running.',
                            isStreaming: false
                        }
                        : msg
                )
            );
        }

        setIsLoading(false);
    }, [isLoading]);

    const clearChat = useCallback(() => {
        setMessages([]);
    }, []);

    const startNewConversation = useCallback(() => {
        const newConversation: Conversation = {
            id: generateId(),
            title: 'New Conversation',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setConversations(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        setMessages([]);
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        clearChat,
        conversations,
        activeConversationId,
        setActiveConversationId,
        startNewConversation,
    };
}
