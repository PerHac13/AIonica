import { BlogsList } from '@/constants/data';
import { BlogList } from './BlogsList';

export function BlogSectionView() {
  return <BlogList blogs={BlogsList} />;
}
