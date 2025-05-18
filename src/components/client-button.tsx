'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  IconArrowRight,
  IconExternalLink,
  IconDeviceLaptop,
  IconRocket
} from '@tabler/icons-react';

type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

type IconType = 'none' | 'arrow' | 'external' | 'demo' | 'rocket';

interface ClientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconType;
  fullWidth?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ClientButton({
  text,
  href,
  variant = 'default',
  size = 'default',
  icon = 'none',
  fullWidth = false,
  isLoading = false,
  onClick,
  ...props
}: ClientButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }

    if (href) {
      if (href.startsWith('http')) {
        window.open(href, '_blank');
      } else {
        router.push(href);
      }
    }
  };

  const getIcon = () => {
    switch (icon) {
      case 'arrow':
        return <IconArrowRight className='ml-2 h-4 w-4' />;
      case 'external':
        return <IconExternalLink className='ml-2 h-4 w-4' />;
      case 'demo':
        return <IconDeviceLaptop className='ml-2 h-4 w-4' />;
      case 'rocket':
        return <IconRocket className='ml-2 h-4 w-4' />;
      default:
        return null;
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={fullWidth ? 'w-full' : ''}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        'Loading...'
      ) : (
        <>
          {text}
          {getIcon()}
        </>
      )}
    </Button>
  );
}
