import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DeveloperMode() {
  const { userId } = await auth();

  if (!userId) {
    return redirect('/auth/sign-in');
  } else {
    redirect('/developer-mode/my');
  }
}
