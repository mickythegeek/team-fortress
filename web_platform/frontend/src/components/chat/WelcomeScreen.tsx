import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { Lock, CreditCard, Webhook, Zap } from 'lucide-react';

interface WelcomeScreenProps {
    onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
    {
        icon: Lock,
        title: 'Generate Access Token',
        description: 'OAuth 2.0, Base64 encoding, API keys',
        prompt: 'How do I generate an access token for the Interswitch API using my client ID and secret key?',
        accent: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    },
    {
        icon: CreditCard,
        title: 'Web Checkout Integration',
        description: 'Embed checkout, accept payments',
        prompt: 'How do I integrate the Interswitch Web Checkout into my website?',
        accent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    },
    {
        icon: Zap,
        title: 'Response Codes',
        description: 'Transaction status, error handling',
        prompt: 'What are the Interswitch payment response codes and what does each status mean?',
        accent: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    },
    {
        icon: Webhook,
        title: 'Webhook Notifications',
        description: 'Real-time events, callbacks',
        prompt: 'How do I set up webhooks to receive real-time transaction notifications from Interswitch?',
        accent: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full px-4 animate-fade-in">
            {/* Logo and Welcome */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-isw-red-light border border-isw-red/20 mb-5">
                    <span className="text-xs font-semibold isw-accent">INTERSWITCH API COPILOT</span>
                </div>
                <h1 className="text-3xl font-semibold text-foreground mb-3">
                    What can I help you build today?
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto text-center">
                    Ask me anything about Interswitch's payment APIs — authentication, transactions, webhooks, error codes, and more.
                </p>
            </div>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                {suggestions.map((suggestion, index) => (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion.prompt)}
                        className={cn(
                            'group flex items-start gap-3 p-4 rounded-xl text-left',
                            'bg-card border border-border hover:border-primary/30',
                            'shadow-soft hover:shadow-elevated',
                            'transition-all duration-200 hover:-translate-y-0.5'
                        )}
                    >
                        <div className={cn(
                            'flex-shrink-0 h-10 w-10 rounded-lg',
                            'flex items-center justify-center',
                            'transition-transform duration-200 group-hover:scale-110',
                            suggestion.accent
                        )}>
                            <suggestion.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {suggestion.title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {suggestion.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Capabilities hint */}
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    RAG-Powered
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Source-Cited
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-isw-red" />
                    Interswitch Docs
                </span>
            </div>
        </div>
    );
}
