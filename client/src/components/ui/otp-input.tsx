import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  numInputs: number;
  className?: string;
}

export function OtpInput({ value, onChange, numInputs, className }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numInputs);
  }, [numInputs]);

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return;

    const newValue = value.split('');
    newValue[index] = digit;
    onChange(newValue.join(''));

    // Move to next input if digit is entered
    if (digit && index < numInputs - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, numInputs);
    if (/^\d+$/.test(pastedData)) {
      onChange(pastedData);
      const nextIndex = Math.min(pastedData.length, numInputs - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn("flex space-x-3", className)}>
      {Array.from({ length: numInputs }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-lg font-semibold"
          data-testid={`otp-input-${index}`}
        />
      ))}
    </div>
  );
}
