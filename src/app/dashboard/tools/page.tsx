import Link from 'next/link';
import { getPublishedModels } from '@/features/developer-mode/action/modelAction';
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export default async function ToolsPage() {
  const { success, models } = await getPublishedModels();

  return (
    <div className='mx-auto max-w-7xl px-6 py-10'>
      <div className='mb-8 text-center'>
        <h1 className='text-3xl font-bold tracking-tight'>Available Tools</h1>
        <p className='text-muted-foreground mt-2 text-sm sm:text-base'>
          Explore public tools published by developers. Click any card to learn
          more or use them.
        </p>
      </div>

      {!success || !models?.length ? (
        <div className='text-muted-foreground p-6 text-center'>
          No published models found.
        </div>
      ) : (
        <div className='grid gap-6 sm:grid-cols-2'>
          {models.map((model: any) => (
            <Link
              key={model.modelId}
              href={`/tools/${model.modelId}`}
              className='transition-shadow hover:shadow-lg'
            >
              <Card className='hover:border-primary h-full cursor-pointer'>
                <CardContent className='p-4'>
                  <CardTitle className='mb-1'>{model.displayName}</CardTitle>
                  <CardDescription className='text-muted-foreground text-sm'>
                    {model.slug}
                  </CardDescription>
                  <div className='text-primary mt-2 flex items-center gap-2'>
                    <span>Open Tool</span>
                    <ArrowRight size={16} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
