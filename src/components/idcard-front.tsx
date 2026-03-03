import Image from "next/image";
import { Card } from "@/components/ui/card";

export function IdCardFront() {
  return (
    <Card className="w-[350px] h-[500px] bg-gradient-to-br from-blue-100 to-white p-4 shadow-lg relative overflow-hidden">
      {/* Geometric background shapes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full opacity-30" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-300 rounded-full opacity-20" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <Image src="/logo.png" alt="Company Logo" width={80} height={80} />
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
          <Image src="/assets/sudhanshu.jpg" alt="Sudhanshu Kumar" width={96} height={96} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Sudhanshu Kumar</h2>
        <p className="text-sm text-gray-600">Business Associate</p>
        <p className="text-sm text-gray-500">Employee ID: 596723</p>
        <div className="absolute bottom-4 right-4">
          <Image src="/assets/qr.png" alt="QR Code" width={60} height={60} />
        </div>
      </div>
    </Card>
  );
}