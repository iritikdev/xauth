"use client";

import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function Hero() {
    const [count, setCount] = useState(0);
    const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    useEffect(() => {
        if (!api) {
            return;
        }
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    // Use wrapper functions to safely call plugin methods
    const handleMouseEnter = () => {
        plugin.current?.stop?.();
    };
    const handleMouseLeave = () => {
        plugin.current?.reset?.();
    };

    return (
        <div className="">
            <Carousel
                plugins={[plugin.current]}
                className="w-full max-h-[650px] "
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label="Ayurveda Hero Carousel"
            >
                <div className="relative">
                    <CarouselContent>
                        {[
                            { src: "/1.jpg", alt: "Ayurveda Banner 1" },
                            { src: "/2.jpg", alt: "Ayurveda Banner 2" },
                            { src: "/3.jpg", alt: "Ayurveda Banner 3" },
                        ].map((item, index) => (
                            <CarouselItem key={index}>
                                <div className="relative w-full min-h-[100px] h-[100px]  sm:h-[350px] md:h-[400px] lg:h-[450px]">
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        fill
                                        className="object-cover"
                                        priority={index === 0}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* Overlay navigation buttons */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={cn("h-3.5 w-3.5 rounded-full border-2", {
                                    "border-primary bg-amber-700": current === index + 1,
                                })}
                            />
                        ))}
                    </div>
                    <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white shadow rounded-full" />
                    <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white shadow rounded-full" />
                </div>
            </Carousel>

        </div>
    );
}
