import { cn } from '@/lib/utils';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    showInterswitch?: boolean;
}

export function Logo({ className, showText = true, size = 'md', showInterswitch = false }: LogoProps) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
        xl: 'h-12 w-auto',
        '2xl': 'h-14 w-auto',
    };

    const textSizeClasses = {
        sm: 'text-base',
        md: 'text-lg',
        lg: 'text-xl',
        xl: 'text-2xl',
        '2xl': 'text-3xl',
    };

    return (
        <div className={cn('flex items-center gap-2.5', className)}>
            <div className={cn(
                'relative flex items-center justify-center',
                sizeClasses[size]
            )}>
                <img
                    src="/Fortress_Logo.png"
                    alt="Fortress Logo"
                    className="h-full w-full object-contain"
                />
            </div>
            {showText && (
                <div className="flex items-center gap-2">
                    <span className={cn(
                        'font-bold tracking-tight text-foreground',
                        textSizeClasses[size]
                    )}>
                        Fortress
                    </span>
                    {showInterswitch && (
                        <>
                            <span className="text-muted-foreground/40 font-light">|</span>
                            <span className={cn(
                                'font-semibold tracking-tight isw-accent',
                                size === 'sm' ? 'text-xs' : 'text-sm'
                            )}>
                                Interswitch
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
