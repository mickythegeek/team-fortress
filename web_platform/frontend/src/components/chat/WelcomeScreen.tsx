import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { FileCode, Settings, Bug, BrainCircuit } from 'lucide-react';

interface WelcomeScreenProps {
    onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
    {
        icon: FileCode,
        title: 'Parse File Formats',
        description: 'Define specs for MT940, CSV, or PDF',
        prompt: 'Help me create a regex pattern to extract the transaction reference from this Description field...',
    },
    {
        icon: Settings,
        title: 'Configure Accounts',
        description: 'Set up new onboarding requirements',
        prompt: 'I need to configure a new reversible settlement account with specific filter logic...',
    },
    {
        icon: Bug,
        title: 'Debug Outstanding Items',
        description: 'Investigate why transactions aren\'t matching',
        prompt: 'Analyze why these two transactions with identical amounts aren\'t pairing up...',
    },
    {
        icon: BrainCircuit,
        title: 'Generate Matching Logic',
        description: 'Create complex One-to-Many rules',
        prompt: 'Write a matching rule that compares the transaction date within a 3-day buffer...',
    },
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full px-4 animate-fade-in">
            {/* Logo and Welcome */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-semibold text-foreground mb-3">
                    Hi there! What's on the reconciliation agenda?
                </h1>
                <p className="text-lg text-muted-foreground max-w-lg mx-auto text-center">
                    Whether it's setting up partial matching, configuring a tricky account, or finding that missing penny—I'm ready to help.
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
                            'bg-accent flex items-center justify-center',
                            'group-hover:bg-primary/10 transition-colors'
                        )}>
                            <suggestion.icon className="h-5 w-5 text-primary" />
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
                    <span className="h-2 w-2 rounded-full bg-success" />
                    Matching Wizard
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Config Wizard
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    Logic Solver
                </span>
            </div>
        </div>
    );
}
