"use client";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

import { Button } from "./ui/button";

export default function AppLoader({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => setLoading(false);
        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return loading ? (
        <div className="flex justify-center items-center h-screen">
            <Button>
                <Spinner className="size-8" />
                Loading...
            </Button>
        </div>
    ) : (
        children
    );
}