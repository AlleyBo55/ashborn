'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CYCLES_PER_LETTER = 2;
const SHUFFLE_TIME = 50;
const CHARS = "!@#$%^&*():{};|,.<>/?~0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface ScrambleTextProps {
    text: string;
    className?: string;
    delay?: number;
    scrambleSpeed?: number;
    trigger?: boolean;
}

export default function ScrambleText({ text, className = "", delay = 0, scrambleSpeed = SHUFFLE_TIME, trigger = true }: ScrambleTextProps) {
    const [displayText, setDisplayText] = useState(text);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10px" });
    const [isScrambling, setIsScrambling] = useState(false);

    useEffect(() => {
        if (!isInView || !trigger || isScrambling) return;

        setIsScrambling(true);
        let pos = 0;

        const interval = setInterval(() => {
            const scrambled = text.split("")
                .map((char, index) => {
                    if (pos / CYCLES_PER_LETTER > index) {
                        return char;
                    }
                    const randomChar = CHARS[Math.floor(Math.random() * CHARS.length)];
                    return randomChar;
                })
                .join("");

            setDisplayText(scrambled);
            pos++;

            if (pos >= text.length * CYCLES_PER_LETTER) {
                clearInterval(interval);
                setIsScrambling(false);
                setDisplayText(text);
            }
        }, scrambleSpeed);

        return () => clearInterval(interval);
    }, [isInView, text, trigger, scrambleSpeed]);

    return (
        <span ref={ref} className={className}>
            {displayText}
        </span>
    );
}
