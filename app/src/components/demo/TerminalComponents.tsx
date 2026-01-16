import { ReactNode } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

interface TerminalDemoWrapperProps {
    title: string;
    tag: string;
    description: string;
    children: ReactNode;
}

export function TerminalDemoWrapper({ title, tag, description, children }: TerminalDemoWrapperProps) {
    return (
        <div className="space-y-6">
            {/* Terminal Header */}
            <div className="border-2 border-green-500/30 bg-black/80 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <span className="text-[10px] text-gray-600 ml-2">[{tag}]</span>
                </div>
                
                <div className="mb-4">
                    <span className="text-green-500">root@ashborn:~$</span>
                    <span className="text-white ml-2">./execute_{tag.toLowerCase()}.sh</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                    &gt; {title}
                </h1>
                
                <p className="text-sm text-gray-400 leading-relaxed">
                    {description}
                    <span className="animate-pulse">_</span>
                </p>
            </div>

            {/* Content */}
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
}

interface TerminalSectionProps {
    title: string;
    children: ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'error';
}

export function TerminalSection({ title, children, variant = 'default' }: TerminalSectionProps) {
    const borderColors = {
        default: 'border-white/20',
        success: 'border-green-500/30',
        warning: 'border-amber-500/30',
        error: 'border-red-500/30',
    };

    return (
        <div className={`border-2 ${borderColors[variant]} bg-black/50 p-6`}>
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="text-green-500">&gt;</span>
                {title}
            </h2>
            {children}
        </div>
    );
}

interface TerminalCodeBlockProps {
    code: string;
    language?: string;
}

export function TerminalCodeBlock({ code, language = 'bash' }: TerminalCodeBlockProps) {
    return (
        <div className="bg-black border border-green-500/30 p-4 overflow-x-auto">
            <div className="text-[10px] text-green-500/50 mb-2">[{language}]</div>
            <Highlight
                theme={themes.nightOwl}
                code={code.trim()}
                language={language as any}
            >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className="text-sm font-mono" style={{ background: 'transparent' }}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}

interface TerminalButtonProps {
    onClick: () => void;
    children: ReactNode;
    loading?: boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

export function TerminalButton({ onClick, children, loading, disabled, variant = 'primary' }: TerminalButtonProps) {
    const baseClasses = "px-6 py-3 font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
    const variantClasses = variant === 'primary' 
        ? "bg-green-500 text-black hover:bg-green-400" 
        : "bg-black border-2 border-green-500/30 text-green-400 hover:bg-green-500/10";

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses}`}
        >
            {loading ? '$ PROCESSING...' : children}
        </button>
    );
}

interface TerminalOutputProps {
    lines: string[];
    type?: 'info' | 'success' | 'error';
}

export function TerminalOutput({ lines, type = 'info' }: TerminalOutputProps) {
    const textColors = {
        info: 'text-gray-400',
        success: 'text-green-400',
        error: 'text-red-400',
    };

    return (
        <div className="bg-black border border-white/10 p-4 font-mono text-xs">
            {lines.map((line, idx) => (
                <div key={idx} className={`${textColors[type]} mb-1`}>
                    <span className="text-green-500">$</span> {line}
                </div>
            ))}
        </div>
    );
}
