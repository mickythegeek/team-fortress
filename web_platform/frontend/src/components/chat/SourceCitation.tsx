import { cn } from '@/lib/utils';
import type { Source } from '@/types/chat';
import { ExternalLink } from 'lucide-react';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from '@/components/ui/hover-card';

interface SourceCitationProps {
    source: Source;
    index: number;
}

export function SourceCitation({ source, index }: SourceCitationProps) {
    return (
        <HoverCard openDelay={200}>
            <HoverCardTrigger asChild>
                <button className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg',
                    'bg-accent/50 hover:bg-accent border border-transparent hover:border-primary/20',
                    'text-xs font-medium text-accent-foreground',
                    'transition-all duration-200 hover:shadow-soft'
                )}>
                    <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                        {index}
                    </span>
                    <span className="max-w-[120px] truncate">{source.title}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </button>
            </HoverCardTrigger>
            <HoverCardContent
                align="start"
                className="w-80 p-4 bg-popover border-border shadow-elevated"
            >
                <div className="space-y-2">
                    <div className="flex items-start gap-2">
                        <span className="text-lg">{source.favicon || '📄'}</span>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground truncate">
                                {source.title}
                            </h4>
                            <p className="text-xs text-muted-foreground truncate">
                                {source.url}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {source.snippet}
                    </p>
                    <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                        Open source <ExternalLink className="h-3 w-3" />
                    </a>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
