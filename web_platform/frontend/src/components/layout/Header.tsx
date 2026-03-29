import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Menu, Moon, Sun, Bell, HelpCircle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface HeaderProps {
    onToggleSidebar: () => void;
    resolvedTheme: 'light' | 'dark';
    onToggleTheme: () => void;
    isSidebarCollapsed: boolean;
}

export function Header({
    onToggleSidebar,
    resolvedTheme,
    onToggleTheme,
    isSidebarCollapsed
}: HeaderProps) {
    return (
        <header className={cn(
            'sticky top-0 z-40 flex items-center justify-between h-14 px-4',
            'bg-background/80 backdrop-blur-md border-b border-border',
        )}>
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={onToggleSidebar}
                    className="lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </Button>

                {/* Show logo when sidebar is collapsed */}
                {isSidebarCollapsed && (
                    <div className="hidden lg:block h-8 w-8 animate-fade-in">
                        <img src="/Fortress_Favicon.png" alt="Fortress Logo" className="h-full w-full object-contain" />
                    </div>
                )}

                {/* Breadcrumb / Context */}
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 rounded-md bg-isw-red-light text-isw-red font-medium text-xs">
                        V1.0
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {/* Help */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                            <HelpCircle className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Help & Support</TooltipContent>
                </Tooltip>

                {/* Notifications */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="relative">
                            <Bell className="h-4 w-4" />
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                </Tooltip>

                {/* Theme toggle */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon-sm" onClick={onToggleTheme}>
                            {resolvedTheme === 'dark' ? (
                                <Sun className="h-4 w-4" />
                            ) : (
                                <Moon className="h-4 w-4" />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} mode
                    </TooltipContent>
                </Tooltip>

                {/* User avatar */}
                <Button variant="ghost" size="icon-sm" className="ml-2">
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-[hsl(280,70%,60%)] flex items-center justify-center text-xs font-semibold text-primary-foreground">
                        JD
                    </div>
                </Button>
            </div>
        </header>
    );
}
