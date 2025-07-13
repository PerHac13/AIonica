import { auth } from '@clerk/nextjs/server';
import { dbConnect } from '@/lib/db';
import { MetaModelData } from '@/features/tools/types/schema';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import EditorClientWrapper from './EditorClientWrapper';

export default async function DeveloperModelConfigPage({
  params
}: {
  params: { id: string };
}) {
  try {
    const { id } = await params;

    const { userId } = await auth();

    if (!userId) {
      notFound();
    }

    if (!id) {
      notFound();
    }

    await dbConnect();
    const model = await MetaModelData.findOne({ modelId: id }).lean();

    if (!model) {
      notFound();
    }

    const authorIdString = model.authorId?.toString();
    const userIdString = userId?.toString();
    if (authorIdString !== userIdString) {
      notFound();
    }

    return (
      <div className='p-6'>
        <h1 className='mb-4 text-2xl font-bold'>
          Developer Config: {model.displayName}
        </h1>
        <Suspense fallback={<div>Loading editor...</div>}>
          <EditorClientWrapper modelId={id} />
        </Suspense>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
