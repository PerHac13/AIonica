'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLinkIcon } from 'lucide-react';
import { Blog } from '@/types';

export function BlogList({ blogs }: { blogs: Blog[] }) {
  return (
    <div className='grid grid-cols-1 gap-4 *:cursor-pointer *:transition-all *:hover:shadow-md md:grid-cols-2 lg:grid-cols-3'>
      {blogs.map((blog) => (
        <Card
          key={blog.id}
          className='@container/card'
          onClick={() => window.open(blog.externalLink, '_blank')}
        >
          <CardHeader>
            <CardTitle className='text-xl font-semibold @[250px]/card:text-2xl'>
              {blog.title}
            </CardTitle>
            <CardDescription className='text-muted-foreground line-clamp-3 text-sm'>
              {blog.description}
            </CardDescription>
          </CardHeader>
          <CardFooter className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>By {blog.author}</span>
            <Badge variant='outline'>
              <ExternalLinkIcon className='mr-1 h-4 w-4' />
              Visit
            </Badge>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
