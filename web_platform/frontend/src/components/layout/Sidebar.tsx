import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation } from '@/types/chat';
import {
    Plus,
    MessageSquare,
    Search,
    Settings,
    ChevronLeft,
    MoreHorizontal,
    Trash2,
    Edit3,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewConversation: () => void;
    onOpenSettings: () => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export function Sidebar({
    conversations,
    activeConversationId,
    onSelectConversation,
    onNewConversation,
    onOpenSettings,
    isCollapsed,
    onToggleCollapse,
}: SidebarProps) {
    // Group conversations by date
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groupedConversations = {
        today: conversations.filter(c =>
            c.updatedAt.toDateString() === today.toDateString()
        ),
        yesterday: conversations.filter(c =>
            c.updatedAt.toDateString() === yesterday.toDateString()
        ),
        older: conversations.filter(c =>
            c.updatedAt < yesterday && c.updatedAt.toDateString() !== yesterday.toDateString()
        ),
    };

    return (
        <div className={cn(
            'flex flex-col h-full bg-sidebar border-r border-sidebar-border',
            'transition-all duration-300 ease-out',
            isCollapsed ? 'w-16' : 'w-72'
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                {!isCollapsed && <Logo size="xl" showText={false} />}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onToggleCollapse}
                    className="text-sidebar-foreground hover:text-foreground ml-auto"
                >
                    <ChevronLeft className={cn(
                        'h-4 w-4 transition-transform duration-300',
                        isCollapsed && 'rotate-180'
                    )} />
                </Button>
            </div>

            {/* New Chat Button */}
            <div className="p-3">
                <Button
                    variant={isCollapsed ? 'ghost' : 'default'}
                    size={isCollapsed ? 'icon' : 'default'}
                    onClick={onNewConversation}
                    className={cn(
                        'w-full',
                        isCollapsed && 'h-10 w-10'
                    )}
                >
                    <Plus className="h-4 w-4" />
                    {!isCollapsed && <span>New Chat</span>}
                </Button>
            </div>

            {/* Search (hidden when collapsed) */}
            {!isCollapsed && (
                <div className="px-3 mb-2">
                    <div className={cn(
                        'flex items-center gap-2 px-3 py-2 rounded-lg',
                        'bg-sidebar-accent/50 text-muted-foreground',
                        'hover:bg-sidebar-accent transition-colors cursor-pointer'
                    )}>
                        <Search className="h-4 w-4" />
                        <span className="text-sm">Search conversations...</span>
                    </div>
                </div>
            )}

            {/* Conversations List */}
            <ScrollArea className="flex-1 px-3">
                {!isCollapsed ? (
                    <div className="space-y-4 pb-4">
                        {groupedConversations.today.length > 0 && (
                            <ConversationGroup
                                title="Today"
                                conversations={groupedConversations.today}
                                activeId={activeConversationId}
                                onSelect={onSelectConversation}
                            />
                        )}
                        {groupedConversations.yesterday.length > 0 && (
                            <ConversationGroup
                                title="Yesterday"
                                conversations={groupedConversations.yesterday}
                                activeId={activeConversationId}
                                onSelect={onSelectConversation}
                            />
                        )}
                        {groupedConversations.older.length > 0 && (
                            <ConversationGroup
                                title="Previous 7 days"
                                conversations={groupedConversations.older}
                                activeId={activeConversationId}
                                onSelect={onSelectConversation}
                            />
                        )}
                    </div>
                ) : (
                    <div className="space-y-2 py-2">
                        {conversations.slice(0, 5).map(conv => (
                            <Button
                                key={conv.id}
                                variant={conv.id === activeConversationId ? 'secondary' : 'ghost'}
                                size="icon"
                                onClick={() => onSelectConversation(conv.id)}
                                className="w-10 h-10"
                            >
                                <MessageSquare className="h-4 w-4" />
                            </Button>
                        ))}
                    </div>
                )}
            </ScrollArea>

            {/* Footer */}
            <div className="p-3 border-t border-sidebar-border">
                <Button
                    variant="ghost"
                    size={isCollapsed ? 'icon' : 'default'}
                    onClick={onOpenSettings}
                    className={cn(
                        'w-full text-sidebar-foreground hover:text-foreground',
                        isCollapsed && 'h-10 w-10'
                    )}
                >
                    <Settings className="h-4 w-4" />
                    {!isCollapsed && <span>Settings</span>}
                </Button>
            </div>
        </div>
    );
}

interface ConversationGroupProps {
    title: string;
    conversations: Conversation[];
    activeId: string | null;
    onSelect: (id: string) => void;
}

function ConversationGroup({ title, conversations, activeId, onSelect }: ConversationGroupProps) {
    return (
        <div>
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
                {title}
            </h3>
            <div className="space-y-1">
                {conversations.map(conv => (
                    <div
                        key={conv.id}
                        className={cn(
                            'group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer',
                            'hover:bg-sidebar-accent transition-colors',
                            conv.id === activeId && 'bg-sidebar-accent'
                        )}
                        onClick={() => onSelect(conv.id)}
                    >
                        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="flex-1 text-sm text-sidebar-foreground truncate">
                            {conv.title}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreHorizontal className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem>
                                    <Edit3 className="h-4 w-4 mr-2" />
                                    Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </div>
        </div>
    );
}
