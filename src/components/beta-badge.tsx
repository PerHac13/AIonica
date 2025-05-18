import { Badge } from '@/components/ui/badge';

export function BetaBadge() {
  return (
    <Badge
      variant='outline'
      className='animate-pulse border-purple-300 bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800'
    >
      Beta Version in Development
    </Badge>
  );
}
