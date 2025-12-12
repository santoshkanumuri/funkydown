import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PreviewProps {
  content: string;
  scrollRef?: React.RefObject<HTMLDivElement>;
  onScroll?: React.UIEventHandler<HTMLDivElement>;
}

export const Preview: React.FC<PreviewProps> = ({ content, scrollRef, onScroll }) => {
  const handleContainerWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    const scroller = scrollRef?.current;
    if (!scroller) return;

    const target = e.target as Node | null;
    if (target && scroller.contains(target)) return;

    if (scroller.scrollHeight <= scroller.clientHeight) return;
    scroller.scrollTop += e.deltaY;
  };

  return (
    <div
      className="h-full min-h-0 bg-white border-4 border-black shadow-hard-lg overflow-hidden flex flex-col print:border-0 print:shadow-none"
      onWheel={handleContainerWheel}
    >
         <div className="bg-funky-pink border-b-4 border-black text-black px-4 py-2 font-mono text-sm font-bold flex justify-between items-center select-none print:hidden">
            <span>PREVIEW.HTML</span>
            <div className="w-4 h-4 border-2 border-black bg-white"></div>
        </div>
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-auto p-8 md:p-12 bg-white print:p-0 print:overflow-visible">
        <div className="print-markdown prose prose-lg max-w-none prose-headings:font-sans prose-p:font-sans prose-code:font-mono">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({node, ...props}) => <h1 className="text-4xl md:text-6xl font-black mb-6 pb-4 border-b-4 border-black text-black uppercase tracking-tighter" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-8 mb-4 flex items-center gap-2 before:content-['#'] before:text-funky-pink before:mr-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-6 mb-3 text-funky-cyan uppercase tracking-wide border-l-8 border-funky-cyan pl-3" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-gray-800 leading-relaxed font-medium" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6 marker:text-funky-purple marker:text-xl" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-6 marker:font-bold marker:text-black" {...props} />,
                    li: ({node, ...props}) => <li className="ml-4" {...props} />,
                    blockquote: ({node, ...props}) => (
                        <blockquote className="my-8 pl-6 border-l-[6px] border-black bg-funky-light p-4 italic text-xl font-serif text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" {...props} />
                    ),
                    code: ({node, ...props}) => {
                        // @ts-ignore
                        const inline = props.inline
                        return inline ? (
                             <code className="bg-funky-yellow/30 px-1.5 py-0.5 rounded border border-black/10 font-bold text-sm text-black" {...props} />
                        ) : (
                             <code className="block bg-[#1e1e1e] text-funky-pink p-4 rounded-lg border-2 border-black shadow-hard text-sm overflow-x-auto my-6" {...props} />
                        )
                    },
                    pre: ({node, ...props}) => <pre className="bg-transparent p-0 m-0" {...props} />,
                    a: ({node, ...props}) => <a className="text-blue-600 font-bold underline decoration-2 decoration-funky-yellow underline-offset-4 hover:bg-funky-yellow hover:text-black transition-colors" {...props} />,
                    img: ({node, ...props}) => (
                        <div className="border-4 border-black p-2 bg-white shadow-hard inline-block transform rotate-1 hover:rotate-0 transition-transform duration-300">
                             <img className="max-w-full h-auto" {...props} />
                        </div>
                    ),
                    hr: ({node, ...props}) => <hr className="border-t-4 border-black border-dashed my-10" {...props} />,
                    table: ({node, ...props}) => <div className="overflow-x-auto mb-8"><table className="min-w-full border-2 border-black" {...props} /></div>,
                    thead: ({node, ...props}) => <thead className="bg-black text-white" {...props} />,
                    th: ({node, ...props}) => <th className="p-3 text-left font-bold border border-white/20 uppercase text-sm tracking-wider" {...props} />,
                    td: ({node, ...props}) => <td className="p-3 border-2 border-black/10 text-sm font-medium" {...props} />,
                    tr: ({node, ...props}) => <tr className="even:bg-gray-50 hover:bg-funky-yellow/10 transition-colors" {...props} />,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
