'use client';

import dynamic from 'next/dynamic';

const EditorClient = dynamic(() => import('./EditorClient'), {
  ssr: false
});

export default function EditorClientWrapper({ modelId }: { modelId: string }) {
  return <EditorClient modelId={modelId} />;
}
