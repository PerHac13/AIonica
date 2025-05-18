import { delay } from '@/constants/mock-api';
import { BlogSectionView } from '@/features/overview/components/blogs-section';

export default async function BlogSection() {
  await await delay(1000);

  return <BlogSectionView />;
}
