import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading?: boolean;
    placeholder?: string;
}

export function ChatInput({ onSend, isLoading, placeholder = 'Ask Fortress anything...' }: ChatInputProps) {
    const [input, setInput] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleSubmit = () => {
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="relative">
            <div className={cn(
                'relative flex items-end gap-2 p-3 rounded-2xl',
                'bg-card border border-border shadow-soft',
                'focus-within:border-primary/50 focus-within:shadow-glow/30',
                'transition-all duration-200'
            )}>
                {/* Attachment button */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                >
                    <Paperclip className="h-4 w-4" />
                </Button>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isLoading}
                    rows={1}
                    className={cn(
                        'flex-1 resize-none bg-transparent text-foreground',
                        'placeholder:text-muted-foreground',
                        'focus:outline-none text-[15px] leading-relaxed',
                        'min-h-[24px] max-h-[200px] py-1'
                    )}
                />

                {/* Voice input button */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                >
                    <Mic className="h-4 w-4" />
                </Button>

                {/* Send button */}
                <Button
                    variant={input.trim() ? 'gradient' : 'ghost'}
                    size="icon-sm"
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className={cn(
                        'flex-shrink-0',
                        !input.trim() && 'text-muted-foreground'
                    )}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </div>

            {/* Hint text */}
            <p className="mt-2 text-center text-xs text-muted-foreground">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Shift + Enter</kbd> for new line
            </p>
        </div>
    );
}
