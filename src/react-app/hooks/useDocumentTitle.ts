import { useEffect } from 'react';

export function useDocumentTitle(title: string, suffix: boolean = true) {
  useEffect(() => {
    const fullTitle = suffix ? `${title} | Premium Gems Lanka` : title;
    document.title = fullTitle;
  }, [title, suffix]);
}
