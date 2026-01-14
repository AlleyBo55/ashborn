'use client';

import { Terminal } from 'lucide-react';

export default function TerminalBlock({ command, output, cwd = '~' }: { command: string, output?: string, cwd?: string }) {
    return (
        <div className="rounded-lg overflow-hidden border border-white/10 bg-[#0c0c0c] font-mono text-sm my-4 shadow-xl">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                <Terminal className="w-3 h-3 text-gray-600" />
                <span className="text-xs text-gray-600">user — -zsh</span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-2 font-mono text-xs md:text-sm">
                <div className="flex flex-wrap gap-2 text-white">
                    <span className="text-green-400 font-bold">➜</span>
                    <span className="text-cyan-400 font-bold">{cwd}</span>
                    <span className="typing-effect">{command}</span>
                </div>
                {output && (
                    <div className="text-gray-400 whitespace-pre-wrap pl-4 border-l-2 border-gray-800 ml-1 opacity-80 leading-relaxed">
                        {output}
                    </div>
                )}
            </div>
        </div>
    );
}
