"use client";

import { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
};

export function Typewriter({ text, speed = 28, startDelay = 400, className }: Props) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setShown(text);
      setDone(true);
      return;
    }
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const startTimer = setTimeout(function step() {
      i += 1;
      setShown(text.slice(0, i));
      if (i < text.length) {
        timer = setTimeout(step, speed);
      } else {
        setDone(true);
      }
    }, startDelay);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);

  return (
    <span className={done ? className : `${className ?? ""} cursor-blink`.trim()}>
      {shown}
    </span>
  );
}
