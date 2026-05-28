"use client";

import { useState, useEffect, useRef } from "react";

interface TerminalTextProps {
  text: string;
  speed?: number;
  terminalClass?: string;
  cursorClass?: string;
}

const TerminalText = ({ text, speed = 30, terminalClass, cursorClass }: TerminalTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || done) return;
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text[i]);
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [isVisible, text, speed, done]);

  return (
    <span ref={ref} className={terminalClass || "terminal text-signal-cyan/80 text-sm"}>
      {displayed}
      {!done && <span className={cursorClass || "cursor-line"} />}
    </span>
  );
};

export default TerminalText;
