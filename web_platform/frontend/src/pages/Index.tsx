import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { SettingsPanel } from '@/components/layout/SettingsPanel';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { WelcomeScreen } from '@/components/chat/WelcomeScreen';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const {
        messages,
        isLoading,
        sendMessage,
        conversations,
        activeConversationId,
        setActiveConversationId,
        startNewConversation,
    } = useChat();

    const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSuggestionClick = (prompt: string) => {
        sendMessage(prompt);
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <Sidebar
                    conversations={conversations}
                    activeConversationId={activeConversationId}
                    onSelectConversation={setActiveConversationId}
                    onNewConversation={startNewConversation}
                    onOpenSettings={() => setSettingsOpen(true)}
                    isCollapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            </div>

            {/* Mobile Sidebar Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 z-50 lg:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                >
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
                    <div
                        className="absolute left-0 top-0 h-full animate-slide-in-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Sidebar
                            conversations={conversations}
                            activeConversationId={activeConversationId}
                            onSelectConversation={(id) => {
                                setActiveConversationId(id);
                                setMobileSidebarOpen(false);
                            }}
                            onNewConversation={() => {
                                startNewConversation();
                                setMobileSidebarOpen(false);
                            }}
                            onOpenSettings={() => {
                                setSettingsOpen(true);
                                setMobileSidebarOpen(false);
                            }}
                            isCollapsed={false}
                            onToggleCollapse={() => setMobileSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <Header
                    onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    resolvedTheme={resolvedTheme}
                    onToggleTheme={toggleTheme}
                    isSidebarCollapsed={sidebarCollapsed}
                />

                {/* Chat Area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <ScrollArea className="flex-1">
                        <div className="max-w-4xl mx-auto px-4 py-6">
                            {messages.length === 0 ? (
                                <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
                            ) : (
                                <div className="space-y-6">
                                    {messages.map((message) => (
                                        <ChatMessage key={message.id} message={message} />
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className={cn(
                        'p-4 pb-6 border-t border-border',
                        'bg-gradient-to-t from-background via-background to-transparent'
                    )}>
                        <div className="max-w-3xl mx-auto">
                            <ChatInput
                                onSend={sendMessage}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Panel */}
            <SettingsPanel
                isOpen={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                theme={theme}
                onThemeChange={setTheme}
            />
        </div>
    );
};

export default Index;
