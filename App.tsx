import React, { useState, useRef, useEffect } from 'react';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { Button } from './components/Button';
import { enhanceMarkdown } from './services/geminiService';
import { DEFAULT_MARKDOWN } from './constants';
import { ViewMode, EnhanceOptions, ToastMessage } from './types';
import { 
    Printer, 
    Upload, 
    Sparkles, 
    Trash2, 
    Columns, 
    Maximize, 
    FileText, 
    Wand2, 
    Download,
    X
} from 'lucide-react';

const App = () => {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showEnhanceMenu, setShowEnhanceMenu] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorScrollRef = useRef<HTMLTextAreaElement>(null);
  const previewScrollRef = useRef<HTMLDivElement>(null);
  const isSyncingScrollRef = useRef<'editor' | 'preview' | null>(null);

  // Handle Window Resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        if (viewMode === ViewMode.SPLIT) setViewMode(ViewMode.EDIT);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const syncScroll = (from: HTMLElement | null, to: HTMLElement | null) => {
    if (!from || !to) return;
    const fromScrollable = from.scrollHeight - from.clientHeight;
    const toScrollable = to.scrollHeight - to.clientHeight;
    if (fromScrollable <= 0 || toScrollable <= 0) return;
    const progress = from.scrollTop / fromScrollable;
    to.scrollTop = progress * toScrollable;
  };

  const handleEditorScroll: React.UIEventHandler<HTMLTextAreaElement> = () => {
    if (viewMode !== ViewMode.SPLIT) return;
    if (isSyncingScrollRef.current === 'preview') return;
    isSyncingScrollRef.current = 'editor';
    syncScroll(editorScrollRef.current, previewScrollRef.current);
    requestAnimationFrame(() => {
      isSyncingScrollRef.current = null;
    });
  };

  const handlePreviewScroll: React.UIEventHandler<HTMLDivElement> = () => {
    if (viewMode !== ViewMode.SPLIT) return;
    if (isSyncingScrollRef.current === 'editor') return;
    isSyncingScrollRef.current = 'preview';
    syncScroll(previewScrollRef.current, editorScrollRef.current);
    requestAnimationFrame(() => {
      isSyncingScrollRef.current = null;
    });
  };

  const addToast = (type: ToastMessage['type'], text: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.md') && !file.name.endsWith('.txt')) {
      addToast('error', 'Please upload a valid Markdown (.md) or Text (.txt) file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setMarkdown(content);
      addToast('success', 'File loaded successfully!');
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEnhance = async (type: EnhanceOptions['type']) => {
    setIsEnhancing(true);
    setShowEnhanceMenu(false);
    try {
      const enhanced = await enhanceMarkdown(markdown, type);
      setMarkdown(enhanced);
      addToast('success', 'Magic applied! ✨');
    } catch (error) {
      addToast('error', 'Oops! Failed to enhance content. Check your API key.');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'funky-doc.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addToast('success', 'Downloaded successfully!');
  };

  return (
    <div className="app-shell h-screen w-screen flex flex-col font-sans selection:bg-funky-pink selection:text-black bg-[#fdfbf7] overflow-hidden">
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-2 px-4 py-3 border-2 border-black shadow-hard font-bold text-sm bg-white animate-in slide-in-from-right-10 fade-in duration-300 ${
                toast.type === 'error' ? 'text-red-600 border-red-600' : 'text-black'
            }`}
          >
            {toast.type === 'success' && <Sparkles className="w-4 h-4 text-funky-yellow" />}
            {toast.type === 'error' && <X className="w-4 h-4" />}
            {toast.text}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="no-print bg-white border-b-4 border-black px-4 py-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm shrink-0 z-40">
        <div className="flex items-center gap-3 group cursor-default">
          <div className="w-10 h-10 bg-funky-pink border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center text-xl font-black group-hover:rotate-12 transition-transform">
            F
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase leading-none">Funky<span className="text-funky-cyan">Down</span></h1>
            <p className="text-xs font-mono font-bold text-gray-500 tracking-widest">EST. 2025</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
           {/* View Modes Mobile */}
           <div className="flex md:hidden bg-white border-2 border-black p-1 gap-1">
                <button 
                    onClick={() => setViewMode(ViewMode.EDIT)} 
                    className={`p-2 ${viewMode === ViewMode.EDIT ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                >
                    <FileText className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setViewMode(ViewMode.PREVIEW)} 
                    className={`p-2 ${viewMode === ViewMode.PREVIEW ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                >
                    <Maximize className="w-4 h-4" />
                </button>
           </div>
           
           {/* View Modes Desktop */}
           <div className="hidden md:flex gap-2">
                <Button 
                    variant={viewMode === ViewMode.SPLIT ? 'primary' : 'ghost'} 
                    onClick={() => setViewMode(ViewMode.SPLIT)}
                    className="px-3"
                    title="Split View"
                >
                    <Columns className="w-5 h-5" />
                </Button>
           </div>

           <div className="h-8 w-[2px] bg-black/10 mx-2 hidden md:block"></div>

           <Button variant="ghost" onClick={() => fileInputRef.current?.click()} icon={<Upload className="w-4 h-4" />}>
              Open
           </Button>
           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".md,.txt" 
              onChange={handleFileUpload} 
            />

            <div className="relative">
                <Button 
                    variant="secondary" 
                    icon={<Wand2 className="w-4 h-4" />} 
                    onClick={() => setShowEnhanceMenu(!showEnhanceMenu)}
                    isLoading={isEnhancing}
                >
                    Magic
                </Button>
                {showEnhanceMenu && (
                    <div className="absolute top-full mt-2 right-0 w-48 bg-white border-2 border-black shadow-hard z-50 flex flex-col p-1">
                         <button onClick={() => handleEnhance('grammar')} className="text-left px-3 py-2 hover:bg-funky-pink hover:font-bold border border-transparent hover:border-black text-sm transition-all">Fix Grammar</button>
                         <button onClick={() => handleEnhance('funky')} className="text-left px-3 py-2 hover:bg-funky-yellow hover:font-bold border border-transparent hover:border-black text-sm transition-all">Make it Funky</button>
                         <button onClick={() => handleEnhance('professional')} className="text-left px-3 py-2 hover:bg-funky-cyan hover:font-bold border border-transparent hover:border-black text-sm transition-all">Professionalize</button>
                         <button onClick={() => handleEnhance('summarize')} className="text-left px-3 py-2 hover:bg-funky-purple hover:text-white hover:font-bold border border-transparent hover:border-black text-sm transition-all">Summarize</button>
                    </div>
                )}
            </div>

           <Button variant="ghost" onClick={handleDownload} title="Download MD">
                <Download className="w-4 h-4" />
           </Button>

           <Button variant="accent" onClick={handlePrint} icon={<Printer className="w-4 h-4" />}>
              Print
           </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-hidden min-h-0 relative">
        <div className={`print-layout h-full min-h-0 grid gap-4 md:gap-8 transition-all duration-300 ${
            viewMode === ViewMode.SPLIT ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
            {/* Editor Side */}
          <div className={`h-full min-h-0 transition-all duration-300 no-print ${
                viewMode === ViewMode.PREVIEW ? 'hidden' : 'block'
            }`}>
             <Editor value={markdown} onChange={setMarkdown} scrollRef={editorScrollRef} onScroll={handleEditorScroll} />
            </div>

            {/* Preview Side */}
          <div className={`h-full min-h-0 transition-all duration-300 ${
                viewMode === ViewMode.EDIT ? 'hidden' : 'block'
            } print:block print:w-full print:h-auto print:overflow-visible`}>
             <Preview content={markdown} scrollRef={previewScrollRef} onScroll={handlePreviewScroll} />
            </div>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="no-print bg-black text-white py-1 px-4 text-xs font-mono flex justify-between items-center z-30 shrink-0">
            <div className="flex gap-4">
                <span>CHARS: {markdown.length}</span>
                <span>WORDS: {markdown.split(/\s+/).filter(Boolean).length}</span>
            </div>
            <div className="flex gap-4">
                 <span className="hidden md:inline text-gray-400">PRESS CTRL+P TO PRINT</span>
                 <button onClick={() => setMarkdown('')} className="hover:text-red-400 flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3 h-3" /> CLEAR
                 </button>
            </div>
      </footer>

    </div>
  );
};

export default App;