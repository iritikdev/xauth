'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';

export function BackButton({ label = "Back" }: { label?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  // Don't render on /dashboard
  if (pathname === '/dashboard') return null;

  return (
    <Badge variant="default" className='flex cursor-pointer py-1.5 px-3' onClick={() => router.back()}>
      <ArrowLeft className="mr-1 h-4 w-4" />
      {label}
    </Badge>
  );
}