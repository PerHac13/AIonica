import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function BlogCardSkeleton() {
  return (
    <Card className='overflow-hidden transition-shadow duration-200 hover:shadow-md'>
      <div className='relative'>
        <Skeleton className='h-48 w-full' />
        <div className='absolute top-3 left-3'>
          <Skeleton className='h-6 w-16 rounded-full' />
        </div>
      </div>
      <CardContent className='p-5'>
        <div className='space-y-4'>
          <Skeleton className='h-6 w-3/4' />
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-5/6' />

          <div className='flex items-center justify-between pt-2'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-8 w-8 rounded-full' />
              <Skeleton className='h-4 w-20' />
            </div>
            <Skeleton className='h-4 w-16' />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BlogListSkeleton({ count = 6 }) {
  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {Array.from({ length: count }).map((_, i) => (
        <BlogCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function BlogListWithHeaderSkeleton({ count = 6 }) {
  return (
    <div className='space-y-8'>
      <div className='flex items-center justify-between'>
        <div className='space-y-1'>
          <Skeleton className='h-8 w-48' />
          <Skeleton className='h-4 w-64' />
        </div>
        <div className='flex gap-2'>
          <Skeleton className='hidden h-10 w-24 sm:block' />
          <Skeleton className='h-10 w-10 sm:w-24' />
        </div>
      </div>

      <BlogListSkeleton count={count} />

      <div className='flex justify-center pt-6'>
        <Skeleton className='h-10 w-32' />
      </div>
    </div>
  );
}

export function BlogCategoriesSkeleton() {
  return (
    <div className='mb-8 overflow-x-auto'>
      <div className='flex gap-2 pb-2'>
        <Skeleton className='h-10 w-20 flex-shrink-0 rounded-full' />
        <Skeleton className='h-10 w-24 flex-shrink-0 rounded-full' />
        <Skeleton className='h-10 w-28 flex-shrink-0 rounded-full' />
        <Skeleton className='h-10 w-20 flex-shrink-0 rounded-full' />
        <Skeleton className='h-10 w-24 flex-shrink-0 rounded-full' />
        <Skeleton className='h-10 w-16 flex-shrink-0 rounded-full' />
      </div>
    </div>
  );
}

export function BlogPageSkeleton({ count = 9 }) {
  return (
    <section className='py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-12 text-center'>
          <Skeleton className='mx-auto h-10 w-64' />
          <div className='mx-auto mt-4 max-w-xl'>
            <Skeleton className='h-5 w-full' />
            <Skeleton className='mx-auto mt-2 h-5 w-4/5' />
          </div>
        </div>

        <BlogCategoriesSkeleton />

        <BlogListWithHeaderSkeleton count={count} />
      </div>
    </section>
  );
}
