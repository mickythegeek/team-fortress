import { cn } from '@/lib/utils';
import type { Message } from '@/types/chat';
import { SourceCitation } from './SourceCitation';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
    message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div className={cn(
            'group animate-slide-up',
            isUser ? 'flex justify-end' : ''
        )}>
            <div className={cn(
                'flex gap-4 max-w-4xl',
                isUser ? 'flex-row-reverse' : ''
            )}>
                {/* Avatar */}
                <div className={cn(
                    'flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center',
                    isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-gradient-to-br from-primary/20 to-accent text-primary'
                )}>
                    {isUser ? (
                        <User className="h-4 w-4" />
                    ) : (
                        <Sparkles className="h-4 w-4" />
                    )}
                </div>

                {/* Content */}
                <div className={cn(
                    'flex-1 space-y-3',
                    isUser ? 'text-right' : ''
                )}>
                    <div className={cn(
                        'inline-block rounded-2xl px-4 py-3',
                        isUser
                            ? 'bg-primary text-primary-foreground rounded-tr-md'
                            : 'bg-card border border-chat-border rounded-tl-md'
                    )}>
                        <p className={cn(
                            'text-[15px] leading-relaxed whitespace-pre-wrap',
                            isUser ? '' : 'text-foreground'
                        )}>
                            {message.content}
                            {message.isStreaming && (
                                <span className="inline-block w-2 h-4 ml-1 bg-primary/60 animate-typing rounded-sm" />
                            )}
                        </p>
                    </div>

                    {/* Sources */}
                    {!message.isStreaming && message.sources && message.sources.length > 0 && (
                        <div className="space-y-2 animate-fade-in">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Sources
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {message.sources.map((source, index) => (
                                    <SourceCitation key={source.id} source={source} index={index + 1} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
