import React, { useEffect, useMemo, useState } from 'react';

interface MermaidDiagramProps {
  code: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code }) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');

  const renderId = useMemo(() => {
    // Mermaid requires a unique id per render call.
    return `mermaid-${Math.random().toString(36).slice(2)}`;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setError('');
      setSvg('');

      const trimmed = code.trim();
      if (!trimmed) return;

      try {
        const mod: any = await import('mermaid');
        const mermaidApi: any = mod?.default ?? mod;

        mermaidApi.initialize({
          startOnLoad: false,
          // Keep it safe when rendering user-provided Markdown.
          securityLevel: 'strict',
          theme: 'neutral',
        });

        // Mermaid v10+ returns a Promise with { svg, bindFunctions }
        const result: any = await mermaidApi.render(renderId, trimmed);
        const renderedSvg = typeof result === 'string' ? result : result?.svg;

        if (!renderedSvg) {
          throw new Error('Mermaid returned empty output');
        }

        if (!cancelled) setSvg(renderedSvg);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to render Mermaid diagram');
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [code, renderId]);

  if (error) {
    return (
      <div className="not-prose border-2 border-black bg-white p-4 shadow-hard">
        <div className="font-mono text-xs font-bold mb-2">MERMAID ERROR</div>
        <div className="text-sm text-red-600 font-mono whitespace-pre-wrap">{error}</div>
        <pre className="mt-3 bg-gray-50 border border-black/10 p-3 overflow-auto text-xs">
          {code}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="not-prose border-2 border-black bg-white p-4 shadow-hard">
        <div className="font-mono text-xs font-bold">Rendering diagram…</div>
      </div>
    );
  }

  return (
    <div className="mermaid-diagram not-prose border-2 border-black bg-white p-4 shadow-hard print:shadow-none print:border-black">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};
