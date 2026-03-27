import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Moon, Sun, Monitor, Zap, Shield, Database } from 'lucide-react';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
    theme: 'light' | 'dark' | 'system';
    onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export function SettingsPanel({ isOpen, onClose, theme, onThemeChange }: SettingsPanelProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-xl">Settings</SheetTitle>
                    <SheetDescription>
                        Customize your Fortress Intelligence experience
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-8 space-y-8">
                    {/* Appearance */}
                    <section>
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Sun className="h-4 w-4 text-primary" />
                            Appearance
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">Theme</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Choose your preferred color scheme
                                    </p>
                                </div>
                                <div className="flex gap-1 p-1 rounded-lg bg-muted">
                                    {[
                                        { value: 'light', icon: Sun, label: 'Light' },
                                        { value: 'dark', icon: Moon, label: 'Dark' },
                                        { value: 'system', icon: Monitor, label: 'System' },
                                    ].map(({ value, icon: Icon, label }) => (
                                        <Button
                                            key={value}
                                            variant={theme === value ? 'default' : 'ghost'}
                                            size="sm"
                                            onClick={() => onThemeChange(value as 'light' | 'dark' | 'system')}
                                            className={cn(
                                                'h-8 px-3',
                                                theme === value && 'shadow-soft'
                                            )}
                                        >
                                            <Icon className="h-4 w-4 mr-1.5" />
                                            {label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* AI Model Settings */}
                    <section>
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Zap className="h-4 w-4 text-primary" />
                            AI Model
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">Model</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Select the AI model for responses
                                    </p>
                                </div>
                                <Select defaultValue="Fortress-pro">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fortress-pro">Fortress Pro</SelectItem>
                                        <SelectItem value="Fortress-fast">Fortress Fast</SelectItem>
                                        <SelectItem value="Fortress-research">Fortress Research</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-sm font-medium">Temperature</Label>
                                    <span className="text-xs text-muted-foreground font-mono">0.7</span>
                                </div>
                                <Slider
                                    defaultValue={[0.7]}
                                    max={1}
                                    step={0.1}
                                    className="w-full"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Lower values produce more focused responses
                                </p>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">Streaming responses</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        See responses as they're generated
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                        </div>
                    </section>

                    {/* Privacy & Security */}
                    <section>
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            Privacy & Security
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">Save chat history</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Store conversations for future reference
                                    </p>
                                </div>
                                <Switch defaultChecked />
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-sm font-medium">Share analytics</Label>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Help improve Fortress with usage data
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </div>
                    </section>

                    {/* Data Sources */}
                    <section>
                        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <Database className="h-4 w-4 text-primary" />
                            Connected Sources
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Knowledge Base', status: 'connected', count: '2,847 documents' },
                                { name: 'Research Papers', status: 'connected', count: '156 papers' },
                                { name: 'Team Wiki', status: 'syncing', count: '423 pages' },
                            ].map((source) => (
                                <div
                                    key={source.name}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{source.name}</p>
                                        <p className="text-xs text-muted-foreground">{source.count}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            'h-2 w-2 rounded-full',
                                            source.status === 'connected' ? 'bg-success' : 'bg-warning animate-pulse-soft'
                                        )} />
                                        <span className="text-xs text-muted-foreground capitalize">
                                            {source.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </SheetContent>
        </Sheet>
    );
}
