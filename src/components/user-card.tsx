import Image from "next/image";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface UserCardProps {
  name: string;
  email: string;
  photoUrl: string;
  level?: number;
}

export function UserCard({ name, email, photoUrl, level }: UserCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition">
      <CardHeader className="flex flex-row items-center gap-4">
        
        <div>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border">
          <Image
            src={photoUrl}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <CardDescription>{email}</CardDescription>
          {level !== undefined && (
            <p className="text-xs text-muted-foreground">Level {level}</p>
          )}
        </div>
      </CardHeader>
     
    </Card>
  );
}