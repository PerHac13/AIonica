'use client';

import { Button } from '@/components/ui/button';
import { WAITLIST_FORM } from '@/constants/data';
import { useRouter } from 'next/navigation';

export function GetStartedButtons({ userId }: { userId: string | null }) {
  const router = useRouter();

  const handleGetStarted = () => {
    if (!userId) {
      router.push('/auth/sign-in');
    } else {
      router.push('/dashboard/overview');
    }
  };

  return (
    <div className='mt-6 flex flex-col items-center space-y-4'>
      <div className='flex flex-col gap-4 md:flex-row'>
        <Button
          size='lg'
          className='bg-gradient-to-r from-blue-600 to-purple-600 px-8 text-white shadow-lg hover:from-blue-700 hover:to-purple-700'
          onClick={handleGetStarted}
        >
          Explore
        </Button>
        <Button
          size='lg'
          variant='outline'
          className='border-2 px-8 hover:bg-blue-50'
          onClick={() =>
            window.open(
              'https://jotion-note-taking-app-sigma.vercel.app/preview/j57aekskp7b6ygqqfwczdp2adn7g18zr',
              '_blank'
            )
          }
        >
          Learn More
        </Button>
      </div>
      <Button
        variant='ghost'
        className='text-blue-600 underline-offset-4 hover:bg-blue-50 hover:text-blue-800 hover:underline'
        onClick={() => window.open(WAITLIST_FORM, '_blank')}
      >
        Join our waitlist →
      </Button>
    </div>
  );
}
