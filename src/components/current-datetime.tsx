"use client";

import { useEffect, useState } from "react";

export default function CurrentDateTime() {
    const [dateTime, setDateTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            };
            const formatted = now.toLocaleString("en-US", options);
            setDateTime(formatted.replace(",", " |")); // Replace first comma with |
        };

        updateTime();
        const interval = setInterval(updateTime, 1000); // update every second
        return () => clearInterval(interval);
    }, []);

    return <div className="text-sm font-medium text-gray-700">{dateTime}</div>;
}
