import Image from "next/image";
import { Card } from "@/components/ui/card";

interface IdentityCardProps {
  name: string;
  email: string;
  photoUrl: string;
  idNumber?: string;
  level?: number;
}

export function IdentityCard({ name, email, photoUrl, idNumber, level }: IdentityCardProps) {
  return (
    <Card className="w-full max-w-md border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
      <div className="flex items-center p-4 bg-gray-50">
        {/* Photo */}
        <div className="relative w-20 h-20 rounded-md overflow-hidden border">
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>

        {/* Details */}
        <div className="ml-4 flex-1">
          <h2 className="text-lg font-bold">{name}</h2>
          <p className="text-sm text-gray-600">{email}</p>
          {idNumber && (
            <p className="text-xs text-gray-500">ID: {idNumber}</p>
          )}
          {level !== undefined && (
            <p className="text-xs text-gray-500">Level {level}</p>
          )}
        </div>
      </div>

      {/* Footer strip */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
        Amaze Ayurveda Pvt. Ltd.
      </div>
    </Card>
  );
}