import { delay } from '@/constants/mock-api';
import { MyToolSectionView } from '@/features/developer-mode/components/my-tool-section-view';

export default async function MyToolSection() {
  await await delay(1000);

  return <MyToolSectionView />;
}
