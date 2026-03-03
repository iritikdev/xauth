'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';

export function IdCardBack() {
  return (
    <Card className="relative w-[350px] h-[500px] bg-white p-6 shadow-xl overflow-hidden rounded-xl">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-blue-50 opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col gap-4 text-sm text-gray-700 font-body">
        <p><strong>Address:</strong> BISARPATTI RUPAULI – 843106, Muzaffarpur</p>
        <p><strong>Sponsor ID:</strong> 851247</p>
        <p><strong>Emergency Contact:</strong> +91-XXXXXXXXXX</p>
        <div className="mt-auto flex flex-col items-center gap-2">
          <Image src="/assets/barcode.png" alt="Barcode" width={180} height={40} />
          <p className="text-xs text-gray-500 text-center">
            Property of Amaze Ayurveda Pvt. Ltd.
          </p>
        </div>
      </div>
    </Card>
  );
}