import { useId } from 'react';
import type { TextareaHTMLAttributes } from 'react';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function TextArea({ label, id, className = '', ...props }: TextAreaProps) {
  const generatedId = useId();
  const textAreaId = id ?? generatedId;

  return (
    <label htmlFor={textAreaId} className="flex flex-col gap-1 text-sm font-medium text-ink">
      {label}
      <textarea
        id={textAreaId}
        className={`rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:outline focus:outline-2 focus:outline-brand ${className}`}
        {...props}
      />
    </label>
  );
}
