import { useState, useEffect } from "react";
import { toast } from "sonner";

export const useIfscAutoFill = ({ ifsc, setValue }: { ifsc: string | undefined; setValue: any }) => {

    const [isFetchingBank, setIsFetchingBank] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Basic validation: IFSC 11 characters ka hota hai
        if (!ifsc || ifsc.length !== 11) {
            setError(null);
            return;
        }

        const fetchBank = async () => {
            setIsFetchingBank(true);
            setError(null);

            try {
                const res = await fetch(`https://ifsc.razorpay.com/${ifsc.toUpperCase()}`);

                if (res.ok) {
                    const data = await res.json();
                    const details = {
                        bank: data.BANK,
                        branch: data.BRANCH,
                    };
                    setValue("branch", `${details.bank} - ${details.branch}`);
                    ;

                    toast.success("Bank Verified", {
                        description: `${details.bank}, ${details.branch}`
                    });
                } else {

                    setError("Invalid IFSC");
                    toast.error("Invalid IFSC Code");
                }
            } catch (e) {
                console.error("IFSC API Error:", e);
                setError("Service Unavailable");
            } finally {
                setIsFetchingBank(false);
            }
        };

        fetchBank();
    }, [ifsc]);

    return { isFetchingBank, error };
};