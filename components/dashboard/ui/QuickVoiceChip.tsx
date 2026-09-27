import React from 'react';

export function QuickVoiceChip({ text, onClick }: { text: string; onClick: (t: string) => void }) {
  return (
    <button
      onClick={() => onClick(text)}
      className="cursor-pointer rounded-xl border border-primary/25 bg-primary-soft px-2.5 py-1 text-[11px] text-primary"
    >
      &quot;{text}&quot;
    </button>
  );
}
