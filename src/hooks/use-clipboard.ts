import { useCallback, useEffect, useState } from 'react';

export function useClipboard({
  text,
  onCopy,
}: {
  text: string;
  onCopy?: () => void;
}) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(
    (
      e: React.MouseEvent<
        HTMLDivElement | HTMLButtonElement | HTMLTextAreaElement
      >
    ) => {
      e.stopPropagation();
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      onCopy?.();
    },
    [text, onCopy]
  );

  useEffect(() => {
    if (!isCopied) return;
    const timeout = setTimeout(() => setIsCopied(false), 600);
    return () => clearTimeout(timeout);
  }, [isCopied]);

  return { isCopied, copy };
}
