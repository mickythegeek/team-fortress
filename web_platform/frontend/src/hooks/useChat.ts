import { useState, useCallback } from 'react';
import type { Message, Source, Conversation } from '@/types/chat';

const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock sources for demo
const mockSources: Source[] = [
    {
        id: '1',
        title: 'Interswitch Authentication Guide',
        url: 'https://docs.interswitchgroup.com/docs/authentication',
        snippet: 'Interswitch APIs use HMAC-SHA512 for request signing. Generate an Authorization header using your client ID and secret key...',
        favicon: '🔐'
    },
    {
        id: '2',
        title: 'Payment API Reference',
        url: 'https://docs.interswitchgroup.com/docs/payment-api',
        snippet: 'The QuickTeller Payment API allows merchants to initiate and process payments through multiple channels...',
        favicon: '💳'
    },
    {
        id: '3',
        title: 'Webhook Configuration',
        url: 'https://docs.interswitchgroup.com/docs/webhooks',
        snippet: 'Configure webhook endpoints to receive real-time notifications for transaction status updates and settlement events...',
        favicon: '🔔'
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
    "Based on the Interswitch API documentation, here's how authentication works:\n\nInterswitch uses **HMAC-SHA512** for request signing. You'll need to concatenate the HTTP method, URL, timestamp, nonce, and your client ID, then sign this string with your client secret.\n\nThe resulting signature goes into the `Authorization` header along with your client ID and the timestamp used in signing.",
    "Great question about the payment flow! Here's the QuickTeller integration process:\n\n**Step 1:** Initiate a payment request with the transaction amount, currency, and customer details.\n**Step 2:** Redirect the customer to the Interswitch payment page or use the inline checkout.\n**Step 3:** Interswitch processes the payment and sends a webhook notification.\n**Step 4:** Verify the transaction status using the Requery API endpoint.",
    "For webhook configuration with Interswitch, here's what you need to know:\n\nFirst, register your webhook URL in the Interswitch developer console. When a transaction event occurs, Interswitch sends a POST request to your endpoint with transaction details.\n\nAlways verify the webhook signature using your client secret before processing. This prevents spoofed notifications from being accepted by your system.",
];

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: '1',
            title: 'Interswitch Auth Setup',
            messages: [],
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date(Date.now() - 86400000),
        },
        {
            id: '2',
            title: 'Payment API Integration',
            messages: [],
            createdAt: new Date(Date.now() - 172800000),
            updatedAt: new Date(Date.now() - 172800000),
        },
        {
            id: '3',
            title: 'Webhook Configuration',
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
            const response = await fetch('http://localhost:8000/api/chat', {
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
