"use client";

import { useEffect, useRef } from "react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  onComplete?: (code: string) => void;
  length?: number;
  autoFocus?: boolean;
};

export default function OtpInput({
  value,
  onChange,
  onComplete,
  length = 6,
  autoFocus = true,
}: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
  }, [autoFocus]);

  const digits = value.padEnd(length, "").split("").slice(0, length);
  while (digits.length < length) digits.push("");

  function setAt(idx: number, ch: string) {
    const arr = digits.slice();
    arr[idx] = ch;
    const next = arr.join("").replace(/\s+$/, "");
    onChange(next);
    if (next.length === length && onComplete) onComplete(next);
  }

  function onInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setAt(idx, "");
      return;
    }
    if (raw.length > 1) {
      // Paste case
      const chars = raw.slice(0, length - idx).split("");
      const arr = digits.slice();
      chars.forEach((c, i) => {
        arr[idx + i] = c;
      });
      const next = arr.join("").replace(/\s+$/, "");
      onChange(next);
      const focusIdx = Math.min(idx + chars.length, length - 1);
      inputsRef.current[focusIdx]?.focus();
      if (next.length === length && onComplete) onComplete(next);
      return;
    }
    setAt(idx, raw);
    if (idx < length - 1) inputsRef.current[idx + 1]?.focus();
  }

  function onKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number,
  ) {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        setAt(idx, "");
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        setAt(idx - 1, "");
      }
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      e.preventDefault();
      inputsRef.current[idx + 1]?.focus();
    }
  }

  return (
    <div className="flex gap-2 sm:gap-2.5 justify-center" role="group">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={d}
          onChange={(e) => onInputChange(e, i)}
          onKeyDown={(e) => onKeyDown(e, i)}
          onFocus={(e) => e.target.select()}
          aria-label={`Kod hanesi ${i + 1}`}
          className="!h-14 sm:!h-16 !w-11 sm:!w-12 !rounded-[10px] !p-0 !text-center font-mono !text-[22px] sm:!text-[24px] !font-medium tabular-nums tracking-normal"
        />
      ))}
    </div>
  );
}
