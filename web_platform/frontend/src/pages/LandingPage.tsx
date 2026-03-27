import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Zap, Shield, MessageSquare, Search, CheckCircle, ArrowRight, Moon, Sun, Sparkles } from 'lucide-react';
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

// Feature card component
function FeatureCard({ icon: Icon, title, description, delay }: { icon: React.ElementType; title: string; description: string; delay: number }) {
    return (
        <AnimatedSection delay={delay}>
            <div className="group relative h-full rounded-2xl p-8 glass-card hover:shadow-glow transition-all duration-500 hover:-translate-y-2">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-green/10 to-brand-navy/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                    <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-brand-navy text-primary-foreground shadow-glow">
                        <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{description}</p>
                </div>
            </div>
        </AnimatedSection>
    );
}

// Step component
function StepCard({ number, icon: Icon, title, description, delay }: { number: number; icon: React.ElementType; title: string; description: string; delay: number }) {
    return (
        <AnimatedSection delay={delay} className="relative">
            <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-purple-dark to-brand-navy flex items-center justify-center shadow-elevated">
                        <Icon className="w-9 h-9 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-brand-purple-dark font-bold text-sm shadow-soft">
                        {number}
                    </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{description}</p>
            </div>
        </AnimatedSection>
    );
}

// AI Mascot Component with floating badges
function AIMascot() {
    return (
        <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] mx-auto">
            {/* Glow effect behind mascot */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-brand-green/30 to-brand-navy/40 rounded-full blur-3xl animate-pulse scale-110" />

            {/* Main mascot container */}
            <div className="relative w-full h-full animate-float flex items-center justify-center">
                {/* Mascot Image - Large closeup */}
                <img
                    src="/src/assets/ai-mascot.png"
                    alt="AI Mascot"
                    className="w-full h-full object-contain drop-shadow-2xl"
                />

                {/* Floating badge - Brain/AI */}
                <div
                    className="absolute -top-2 -right-4 animate-float"
                    style={{ animationDelay: '-1s' }}
                >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/90 text-primary-foreground shadow-glow text-xs font-medium">
                        <Brain className="w-3 h-3" />
                        <span>RAG Based</span>
                    </div>
                </div>

                {/* Floating badge - Fast */}
                <div
                    className="absolute top-1/4 -left-8 animate-float"
                    style={{ animationDelay: '-2s' }}
                >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-brand-green/90 text-brand-purple-dark shadow-soft text-xs font-medium">
                        <Zap className="w-3 h-3" />
                        <span>Instant</span>
                    </div>
                </div>

                {/* Floating badge - Secure */}
                <div
                    className="absolute bottom-4 -right-6 animate-float"
                    style={{ animationDelay: '-3s' }}
                >
                    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-brand-navy/90 text-white shadow-soft text-xs font-medium">
                        <Shield className="w-3 h-3" />
                        <span>Trusted</span>
                    </div>
                </div>

                {/* Floating sparkles */}
                <div className="absolute top-0 left-8 animate-float" style={{ animationDelay: '-0.5s' }}>
                    <Sparkles className="w-5 h-5 text-primary/60" />
                </div>
                <div className="absolute bottom-8 left-0 animate-float" style={{ animationDelay: '-2.5s' }}>
                    <Sparkles className="w-4 h-4 text-brand-green/60" />
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
            icon: Brain,
            title: 'Intelligent Answers',
            description: 'AI-powered responses grounded in your documentation, delivering accurate and contextual information every time.',
        },
        {
            icon: Zap,
            title: 'Instant Access',
            description: 'Find information in seconds, not hours. Our intelligent search cuts through complexity to get you answers fast.',
        },
        {
            icon: Shield,
            title: 'Knowledge Base Trained',
            description: 'Answers sourced exclusively from verified internal documentation, ensuring reliability and trust.',
        },
    ];

    const steps = [
        {
            icon: MessageSquare,
            title: 'Ask your question',
            description: 'Type your query naturally, just like asking a colleague.',
        },
        {
            icon: Search,
            title: 'AI searches knowledge',
            description: 'Our AI instantly scans your entire knowledge base.',
        },
        {
            icon: CheckCircle,
            title: 'Get accurate answers',
            description: 'Receive clear, cited responses you can trust.',
        },
    ];

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Logo size="xl" />
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
                                Start Asking
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center pt-20">
                {/* Gradient Background */}
                <div
                    className="absolute inset-0 opacity-40 dark:opacity-60"
                    style={{ background: 'var(--gradient-hero)' }}
                />

                {/* Floating orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-navy/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
                <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }} />

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left side - Text content */}
                        <div className="text-center lg:text-left">
                            <AnimatedSection delay={100}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                                    <Sparkles className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium text-primary">Fortress GPT</span>
                                </div>
                            </AnimatedSection>

                            <AnimatedSection delay={200}>
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                                    <span className="text-foreground">Your AI-Powered</span>
                                    <br />
                                    <span className="text-gradient">Knowledge</span>
                                    <br />
                                    <span className="text-foreground">Assistant</span>
                                </h1>
                            </AnimatedSection>

                            <AnimatedSection delay={300}>
                                <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                                    Get instant, accurate answers from your organization's knowledge base.
                                    No more searching,just ask.
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
                                        Start Asking
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                    <Button
                                        variant="glass"
                                        size="lg"
                                        className="rounded-full px-8"
                                        onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                    >
                                        Learn More
                                    </Button>
                                </div>
                            </AnimatedSection>
                        </div>

                        {/* Right side - AI Mascot */}
                        <AnimatedSection delay={300} className="hidden lg:block">
                            <AIMascot />
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

            {/* Features Section */}
            <section id="features" className="relative py-32 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/50 to-transparent" />

                <div className="relative max-w-6xl mx-auto">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Why Choose GPT?
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Powerful features designed to transform how you access knowledge
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.title}
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                delay={index * 150}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <AnimatedSection className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Three simple steps to get the answers you need
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

            {/* CTA Section */}
            <section className="relative py-32 px-6">
                <div
                    className="absolute inset-0 opacity-30"
                    style={{ background: 'var(--gradient-hero)' }}
                />

                <AnimatedSection className="relative max-w-4xl mx-auto text-center">
                    <div className="glass-card rounded-3xl p-12 md:p-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
                            Transform how you access knowledge. Start asking questions and get instant, accurate answers.
                        </p>
                        <Button
                            variant="gradient"
                            size="xl"
                            onClick={() => navigate('/chat')}
                            className="rounded-full px-12 shadow-glow"
                        >
                            Start Asking Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </AnimatedSection>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <Logo size="sm" />
                    <p className="text-muted-foreground text-sm">
                        © {new Date().getFullYear()} Intelligence. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
