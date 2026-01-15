'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight01Icon, CubeIcon, Sword01Icon, SkullIcon, FlashIcon } from 'hugeicons-react';
import { useState, useEffect } from 'react';

const ComboStep = ({
    step,
    title,
    desc,
    active,
    icon: Icon
}: {
    step: number;
    title: string;
    desc: string;
    active: boolean;
    icon: any;
}) => {
    return (
        <motion.div
            animate={{
                scale: active ? 1.05 : 1,
                opacity: active ? 1 : 0.4
            }}
            className={`relative flex items-center gap-6 p-6 border-l-4 ${active ? 'border-purple-500 bg-purple-900/10' : 'border-gray-800 bg-transparent'} transition-colors duration-300`}
        >
            {/* Step Number Badge */}
            <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-md border-2 font-black italic text-xl ${active ? 'border-purple-500 text-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-gray-700 text-gray-700'
                }`}>
                <span>{step}</span>
                <span className="text-[8px] font-mono not-italic font-normal">HIT</span>
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <Icon className={`w-5 h-5 ${active ? 'text-purple-400' : 'text-gray-600'}`} />
                    <h3 className={`text-2xl font-black italic uppercase tracking-tighter ${active ? 'text-white' : 'text-gray-600'}`}>
                        {title}
                    </h3>
                </div>
                <p className="text-sm font-mono text-gray-400 max-w-md">
                    {desc}
                </p>
            </div>

            {/* Arrow Connector */}
            {step < 3 && (
                <ArrowRight01Icon className={`absolute -bottom-8 left-9 rotate-90 w-6 h-6 z-10 ${active ? 'text-purple-500' : 'text-gray-800'}`} />
            )}
        </motion.div>
    );
};

export default function SkillCombo() {
    const [activeStep, setActiveStep] = useState(1);

    // Auto-cycle through the combo
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev % 3) + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative w-full max-w-6xl mx-auto py-24 px-6 md:px-12">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Left: VS Screen / Visualizer */}
                <div className="relative order-2 lg:order-1 h-[400px] bg-black border border-gray-800 flex items-center justify-center overflow-hidden grouped-border">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

                    {/* Dynamic Visual Based on Step */}
                    <AnimatePresence mode="popLayout">
                        {activeStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
                                className="text-center"
                            >
                                <CubeIcon className="w-32 h-32 text-blue-500 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]" />
                                <h4 className="text-4xl font-black text-white italic">SHIELD UP</h4>
                                <span className="text-blue-500 font-mono text-xs">ZK-PROOF GENERATED</span>
                            </motion.div>
                        )}
                        {activeStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100, filter: "blur(10px)" }}
                                className="text-center"
                            >
                                <Sword01Icon className="w-32 h-32 text-purple-500 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]" />
                                <h4 className="text-4xl font-black text-white italic">SHADOW STRIKE</h4>
                                <span className="text-purple-500 font-mono text-xs">TRANSFER UNTRACEABLE</span>
                            </motion.div>
                        )}
                        {activeStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -50, filter: "blur(10px)" }}
                                className="text-center"
                            >
                                <div className="relative">
                                    <SkullIcon className="w-32 h-32 text-red-500 mx-auto mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]" />
                                    <FlashIcon className="absolute top-0 right-1/4 w-12 h-12 text-yellow-400 animate-bounce" />
                                </div>
                                <h4 className="text-4xl font-black text-white italic">FINISHER</h4>
                                <span className="text-red-500 font-mono text-xs">WITHDRAW TO FIAT</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Combo Counter Overlay */}
                    <div className="absolute top-4 right-4 text-right">
                        <div className="text-6xl font-black text-gray-800/50 italic leading-none">{activeStep}x</div>
                        <div className="text-xs font-bold text-gray-800/50 uppercase tracking-widest">COMBO</div>
                    </div>
                </div>

                {/* Right: The Steps */}
                <div className="order-1 lg:order-2">
                    <div className="mb-10 pl-4">
                        <h2 className="text-5xl font-black text-white italic tracking-tighter mb-2 leading-snug py-2 pr-8">
                            EXECUTE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 pr-2">COMBO</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-sm uppercase tracking-wide">
                            Perfect privacy requires a precise sequence.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <ComboStep
                            step={1}
                            title="EXTRACT"
                            icon={CubeIcon}
                            desc="Deposit assets into the Shadow Domain. Convert public tokens into shadow notes via ZK-SNARKs."
                            active={activeStep === 1}
                        />
                        <ComboStep
                            step={2}
                            title="STRIKE"
                            icon={Sword01Icon}
                            desc="Send assets internally. Zero on-chain footprints. The recipient's stealth address is the only destination."
                            active={activeStep === 2}
                        />
                        <ComboStep
                            step={3}
                            title="ARISE"
                            icon={SkullIcon}
                            desc="Withdraw to a fresh wallet. The link between source and destination is permanently severed."
                            active={activeStep === 3}
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
