import React from 'react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  scrollRef?: React.RefObject<HTMLTextAreaElement>;
  onScroll?: React.UIEventHandler<HTMLTextAreaElement>;
}

export const Editor: React.FC<EditorProps> = ({ value, onChange, scrollRef, onScroll }) => {
  const handleContainerWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const textarea = scrollRef?.current;
    if (!textarea) return;

    const target = e.target as Node | null;
    if (target && textarea.contains(target)) return;

    if (textarea.scrollHeight <= textarea.clientHeight) return;
    textarea.scrollTop += e.deltaY;
  };

  return (
    <div
      className="flex flex-col h-full min-h-0 bg-white border-4 border-black shadow-hard-lg overflow-hidden group"
      onWheel={handleContainerWheel}
    >
        <div className="bg-black text-white px-4 py-2 font-mono text-sm font-bold flex justify-between items-center select-none shrink-0">
            <span>INPUT.MD</span>
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white/20"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white/20"></div>
            </div>
        </div>
      <textarea
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 w-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-white text-gray-800 placeholder-gray-400 selection:bg-funky-yellow selection:text-black overflow-auto"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="# Type something funky here..."
        spellCheck={false}
      />
    </div>
  );
};