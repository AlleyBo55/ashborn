'use client';

import { Highlight, themes } from 'prism-react-renderer';
import Copy01Icon from 'hugeicons-react/dist/esm/icons/copy_01_icon';
import CheckmarkCircle01Icon from 'hugeicons-react/dist/esm/icons/checkmark_circle_01_icon';
import { useState } from 'react';

export default function CodeBlock({ code, language = 'typescript', filename }: { code: string, language?: string, filename?: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0E0E0E] shadow-2xl my-6 group relative">
            {/* Header / Tab Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                    </div>
                    {filename && <span className="text-xs font-mono text-gray-400 opacity-60 ml-2">{filename}</span>}
                </div>
                <button
                    onClick={copyToClipboard}
                    className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
                    title="Copy Code"
                >
                    {copied ? <CheckmarkCircle01Icon className="w-3.5 h-3.5 text-green-400" /> : <Copy01Icon className="w-3.5 h-3.5" />}
                </button>
            </div>

            <Highlight theme={themes.palenight} code={code.trim()} language={language}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre className="p-5 overflow-x-auto text-sm font-mono leading-relaxed" style={{ ...style, backgroundColor: 'transparent', margin: 0 }}>
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line })} className="table-row">
                                <span className="table-cell text-right select-none text-gray-700 opacity-20 pr-4 text-xs w-8 user-select-none">{i + 1}</span>
                                <span className="table-cell">
                                    {line.map((token, key) => (
                                        <span key={key} {...getTokenProps({ token })} />
                                    ))}
                                </span>
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </div>
    );
}
