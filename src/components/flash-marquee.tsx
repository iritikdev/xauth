// components/Marquee.tsx
import { cn } from "@/lib/utils"; // ShadCN utility
import { Card } from "@/components/ui/card"; // ShadCN component

export default function Marquee({ items }: { items: string[] }) {
    return (
        <div className="overflow-hidden whitespace-nowrap w-full ">
            <div
                className={cn(
                    "animate-marquee flex gap-4 px-4 py-2"
                )}
            >
                {items.map((item, index) => (
                    <Card key={index} className="px-4 py-2 min-w-max">
                        {item}
                    </Card>
                ))}
            </div>
        </div>
    );
}