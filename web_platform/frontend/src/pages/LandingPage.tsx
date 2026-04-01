import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Zap, Shield, ArrowRight, Moon, Sun, Sparkles, Code2, Webhook, CreditCard, Terminal, BookOpen, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

// Custom hook for scroll-triggered animations
function useScrollAnimation() {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

// Animated section wrapper
function AnimatedSection({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-700 ease-out',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
                className
            )}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

// Animated code terminal that showcases Interswitch API
function APITerminal() {
    const codeLines = [
        { type: 'comment', text: '// Authenticate with Interswitch API' },
        { type: 'keyword', text: 'const' },
        { type: 'code', text: ' response = ' },
        { type: 'keyword', text: 'await' },
        { type: 'func', text: ' fetch' },
        { type: 'code', text: '(' },
        { type: 'string', text: "'https://api.interswitchng.com/passport/oauth/token'" },
        { type: 'code', text: ', {' },
        { type: 'indent', text: '' },
        { type: 'key', text: '  method' },
        { type: 'code', text: ': ' },
        { type: 'string', text: "'POST'" },
        { type: 'code', text: ',' },
        { type: 'key', text: '  headers' },
        { type: 'code', text: ': {' },
        { type: 'key', text: "    'Content-Type'" },
        { type: 'code', text: ': ' },
        { type: 'string', text: "'application/x-www-form-urlencoded'" },
        { type: 'code', text: ',' },
        { type: 'key', text: "    'Authorization'" },
        { type: 'code', text: ': ' },
        { type: 'func', text: 'getAuthHeader' },
        { type: 'code', text: '()' },
        { type: 'code', text: '  }' },
        { type: 'code', text: '});' },
    ];

    return (
        <div className="code-terminal animate-glow-pulse">
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-white/40 text-xs font-mono ml-2">interswitch-api.ts</span>
            </div>
            {/* Code content */}
            <div className="p-5 font-mono text-sm leading-relaxed overflow-hidden">
                <div className="text-white/30 text-xs mb-3">{'>'} Interswitch Payment Integration</div>
                {/* Line 1: Comment */}
                <div className="text-emerald-400/70">{codeLines[0].text}</div>
                {/* Line 2: const response = await fetch(...) */}
                <div className="mt-1">
                    <span className="text-purple-400">const</span>
                    <span className="text-white/80"> response = </span>
                    <span className="text-purple-400">await</span>
                    <span className="text-yellow-300"> fetch</span>
                    <span className="text-white/60">(</span>
                </div>
                <div className="pl-4">
                    <span className="text-green-400">'https://api.interswitchng.com/...'</span>
                    <span className="text-white/60">, {'{'}</span>
                </div>
                <div className="pl-6">
                    <span className="text-cyan-300">method</span>
                    <span className="text-white/60">: </span>
                    <span className="text-green-400">'POST'</span>
                    <span className="text-white/60">,</span>
                </div>
                <div className="pl-6">
                    <span className="text-cyan-300">headers</span>
                    <span className="text-white/60">: {'{'}</span>
                </div>
                <div className="pl-8">
                    <span className="text-cyan-300">'Authorization'</span>
                    <span className="text-white/60">: </span>
                    <span className="text-yellow-300">getHMACAuth</span>
                    <span className="text-white/60">()</span>
                </div>
                <div className="pl-6 text-white/60">{'}'}</div>
                <div className="pl-2 text-white/60">{'})'}</div>
                {/* Cursor blink */}
                <div className="mt-3 flex items-center gap-1">
                    <span className="text-white/30">{'>'}</span>
                    <div className="w-2 h-4 bg-purple-400/80 animate-typing rounded-sm" />
                </div>
            </div>
        </div>
    );
}

// Bento feature card
function BentoCard({ icon: Icon, emoji, title, description, accent, delay }: {
    icon: React.ElementType;
    emoji: string;
    title: string;
    description: string;
    accent?: string;
    delay: number;
}) {
    return (
        <AnimatedSection delay={delay}>
            <div className="group bento-card p-8 h-full relative overflow-hidden">
                {/* Subtle gradient on hover */}
                <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                    {/* Icon badge */}
                    <div className={cn(
                        'inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6',
                        'shadow-soft transition-transform duration-300 group-hover:scale-110',
                        accent || 'bg-accent'
                    )}>
                        <span className="text-2xl">{emoji}</span>
                    </div>

                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-[15px]">
                        {description}
                    </p>
                </div>
            </div>
        </AnimatedSection>
    );
}

// Step card for "How it works"
function StepCard({ number, icon: Icon, title, description, delay }: {
    number: number;
    icon: React.ElementType;
    title: string;
    description: string;
    delay: number;
}) {
    return (
        <AnimatedSection delay={delay} className="relative">
            <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center shadow-soft">
                        <Icon className="w-9 h-9 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-isw-red flex items-center justify-center text-white font-bold text-sm shadow-soft">
                        {number}
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{description}</p>
            </div>
        </AnimatedSection>
    );
}

// Sample chat preview for demo section
function ChatPreview() {
    return (
        <div className="bento-card overflow-hidden">
            {/* Chat header */}
            <div className="px-6 py-4 border-b border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-brand-purple flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-foreground">FORTRESS</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Online
                    </div>
                </div>
            </div>

            {/* Chat messages */}
            <div className="p-6 space-y-4">
                {/* User message */}
                <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl rounded-tr-md max-w-[80%] text-sm">
                        How do I authenticate with the Interswitch Payment API?
                    </div>
                </div>

                {/* AI response */}
                <div className="flex gap-3">
                    <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="bg-card border border-border/60 px-4 py-3 rounded-2xl rounded-tl-md text-sm text-foreground leading-relaxed max-w-[85%]">
                        <p>To authenticate with Interswitch APIs, you'll need to use <strong className="text-primary">HMAC-SHA512 signing</strong>. Here's the process:</p>
                        <ol className="mt-2 space-y-1 text-muted-foreground text-xs">
                            <li>1. Concatenate your <code className="px-1 py-0.5 rounded bg-muted text-[11px] font-mono">HTTP method + URL + timestamp</code></li>
                            <li>2. Sign with your client secret using HMAC-SHA512</li>
                            <li>3. Include the signature in the Authorization header</li>
                        </ol>
                        {/* Sources */}
                        <div className="mt-3 flex gap-2">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-accent/80 text-[11px] font-medium text-accent-foreground">
                                📄 authentication.md
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-isw-red-light text-[11px] font-medium isw-accent">
                                📄 security.md
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const features = [
        {
            icon: Lock,
            emoji: '🔐',
            title: 'Authentication & Tokens',
            description: 'Master OAuth 2.0 flows, InterswitchAuth signature generation, Base64 encoding, and access token management across all Interswitch services.',
            accent: 'bg-purple-100 dark:bg-purple-900/30',
        },
        {
            icon: Code2,
            emoji: '⚡',
            title: 'API Overview & Payments',
            description: 'Get started fast with RESTful endpoints and payment APIs. We solve integration pain points for individuals and businesses alike',
            accent: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            icon: Shield,
            emoji: '📊',
            title: 'Transactions & Error Codes',
            description: 'Understand response codes, transaction statuses, requery flows, 3D Secure handling, and how to debug failed API calls.',
            accent: 'bg-amber-100 dark:bg-amber-900/30',
        },
        {
            icon: Webhook,
            emoji: '🔔',
            title: 'Webhooks & Notifications',
            description: 'Configure real-time event callbacks, verify signatures, handle retries, and automate workflows triggered by transaction events.',
            accent: 'bg-emerald-100 dark:bg-emerald-900/30',
        },
    ];

    const steps = [
        {
            icon: Terminal,
            title: 'Ask about any Interswitch API',
            description: 'Type your question naturally — authentication, payments, webhooks, or anything else.',
        },
        {
            icon: BookOpen,
            title: 'AI searches the documentation',
            description: 'FORTRESS engine retrieves the most relevant sections from Interswitch\'s official API docs.',
        },
        {
            icon: Zap,
            title: 'Get accurate, cited answers',
            description: 'Receive clear responses with source citations — verify every answer against the docs.',
        },
    ];

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Logo size="xl" showInterswitch />
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="rounded-full"
                            >
                                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>
                            <Button
                                variant="gradient"
                                onClick={() => navigate('/chat')}
                                className="rounded-full px-6"
                            >
                                Try FORTRESS
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ══════════════════════════════════════════
                HERO SECTION
               ══════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                {/* Lavender gradient background — Buildathon inspired */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'var(--gradient-hero)' }}
                />

                {/* Floating decorative orbs */}
                <div className="absolute top-1/3 left-[15%] w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-[10%] w-96 h-96 bg-isw-red/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-1/2 right-[35%] w-48 h-48 bg-brand-lavender/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left — Hero text */}
                        <div className="text-center lg:text-left">
                            <AnimatedSection delay={100}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 border border-border/60 shadow-soft mb-8 backdrop-blur-sm">
                                    <span className="text-border">|</span>
                                    <span className="text-sm font-medium isw-accent">
                                        🏗️ BUILDATHON 2026
                                    </span>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={200}>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]">
                                    <span className="text-foreground">Your Copilot for</span>
                                    <br />
                                    <span className="gradient-isw-text">Interswitch APIs</span>
                                </h1>
                            </AnimatedSection>

                            <AnimatedSection delay={300}>
                                <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                                    Navigate Interswitch's API ecosystem with AI. Get instant answers about authentication, token generation, transactions, error codes, web checkout, and more. All powered by intelligent document retrieval.
                                </p>
                            </AnimatedSection>

                            <AnimatedSection delay={400}>
                                <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                                    <Button
                                        variant="gradient"
                                        size="xl"
                                        onClick={() => navigate('/chat')}
                                        className="rounded-full px-10 shadow-glow"
                                    >
                                        Try FORTRESS
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                    <Button
                                        variant="glass"
                                        size="lg"
                                        className="rounded-full px-8"
                                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        See How It Works
                                        <ChevronDown className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </AnimatedSection>
                        </div>

                        {/* Right — API Terminal */}
                        <AnimatedSection delay={400} className="hidden lg:block">
                            <div className="relative">
                                {/* Glow behind terminal */}
                                <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-transparent to-isw-red/10 rounded-3xl blur-2xl" />
                                <div className="relative">
                                    <APITerminal />
                                </div>

                                {/* Floating badges around terminal */}
                                <div className="absolute -top-4 -right-4 animate-float" style={{ animationDelay: '-1s' }}>
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card shadow-elevated border border-border/60 text-xs font-medium">
                                        <Lock className="w-3 h-3 text-primary" />
                                        <span className="text-foreground">HMAC-SHA512</span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-3 -left-6 animate-float" style={{ animationDelay: '-2.5s' }}>
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card shadow-elevated border border-border/60 text-xs font-medium">
                                        <Zap className="w-3 h-3 isw-accent" />
                                        <span className="text-foreground">Instant Answers</span>
                                    </div>
                                </div>
                                <div className="absolute top-1/2 -left-10 animate-float" style={{ animationDelay: '-4s' }}>
                                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-card shadow-elevated border border-border/60 text-xs font-medium">
                                        <Code2 className="w-3 h-3 text-emerald-500" />
                                        <span className="text-foreground">RAG-Powered</span>
                                    </div>
                                </div>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Scroll indicator */}
                    <AnimatedSection delay={600} className="mt-16 lg:mt-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <span className="text-sm">Scroll to explore</span>
                            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
                                <div className="w-1.5 h-2.5 rounded-full bg-muted-foreground animate-bounce" />
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                FEATURES — BENTO GRID
               ══════════════════════════════════════════ */}
            <section id="features" className="relative py-32 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent" />

                <div className="relative max-w-6xl mx-auto">
                    <AnimatedSection className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-isw-red-light border border-isw-red/20 mb-6">
                            <span className="text-xs font-semibold isw-accent tracking-wider uppercase">Capabilities</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            What Can It Do?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            FORTRESS knows every corner of the Interswitch API documentation
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 gap-6">
                        {features.map((feature, index) => (
                            <BentoCard
                                key={feature.title}
                                icon={feature.icon}
                                emoji={feature.emoji}
                                title={feature.title}
                                description={feature.description}
                                accent={feature.accent}
                                delay={index * 120}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                HOW IT WORKS
               ══════════════════════════════════════════ */}
            <section className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <AnimatedSection className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-primary/15 mb-6">
                            <span className="text-xs font-semibold text-primary tracking-wider uppercase">Simple Process</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Three steps between you and the answer you need
                        </p>
                    </AnimatedSection>

                    <div className="relative">
                        {/* Connection line */}
                        <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

                        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
                            {steps.map((step, index) => (
                                <StepCard
                                    key={step.title}
                                    number={index + 1}
                                    icon={step.icon}
                                    title={step.title}
                                    description={step.description}
                                    delay={index * 200}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                LIVE DEMO PREVIEW
               ══════════════════════════════════════════ */}
            <section className="relative py-32 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

                <div className="relative max-w-4xl mx-auto">
                    <AnimatedSection className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent border border-primary/15 mb-6">
                            <span className="text-xs font-semibold text-primary tracking-wider uppercase">Preview</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            See It in Action
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A glimpse of what your Interswitch integration experience looks like
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 via-transparent to-isw-red/5 rounded-[2rem] blur-xl" />
                            <div className="relative">
                                <ChatPreview />
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </section>

            {/* ══════════════════════════════════════════
                CTA SECTION
               ══════════════════════════════════════════ */}
            <section className="relative py-32 px-6">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{ background: 'var(--gradient-hero)' }}
                />

                <AnimatedSection className="relative max-w-4xl mx-auto text-center">
                    <div className="bento-card p-12 md:p-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Ready to Build with <span className="isw-accent">Interswitch</span>?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                            Stop searching through docs manually. Ask FORTRESS and get instant, cited answers about any Interswitch API.
                        </p>
                        <Button
                            variant="gradient"
                            size="xl"
                            onClick={() => navigate('/chat')}
                            className="rounded-full px-12 shadow-glow"
                        >
                            Launch FORTRESS
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </AnimatedSection>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <Logo size="sm" showInterswitch />
                    <p className="text-muted-foreground text-sm text-center md:text-right">
                        Built for <span className="font-semibold isw-accent">Interswitch Buildathon 2026</span> by Team FORTRESS
                    </p>
                </div>
            </footer>
        </div>
    );
}
