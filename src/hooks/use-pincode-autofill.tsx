import { useEffect, useRef, useState } from "react";
import { UseFormSetValue, FieldValues, Path } from "react-hook-form";

type UsePincodeAutoFillProps<T extends FieldValues> = {
  pincode?: string;
  setValue: UseFormSetValue<T>;
};

export function usePincodeAutoFill<T extends FieldValues>({
  pincode,
  setValue,
}: UsePincodeAutoFillProps<T>) {
  const [isFetchingGeo, setIsFetchingGeo] = useState(false);
  const lastFetchedPincode = useRef<string | null>(null);

  useEffect(() => {
    if (!pincode || pincode.length !== 6) return;
    if (lastFetchedPincode.current === pincode) return;

    const controller = new AbortController();

    const fetchGeo = async () => {
      setIsFetchingGeo(true);

      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`,
          { signal: controller.signal }
        );

        const data = await res.json();
        const postOffice = data?.[0]?.PostOffice?.[0];

        if (data?.[0]?.Status === "Success" && postOffice) {
          const { District, State } = postOffice;

          // ✅ Type-safe casting using Path<T>
          setValue("district" as Path<T>, District);
          setValue("state" as Path<T>, State);

          lastFetchedPincode.current = pincode;
        }
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Pincode API Error:", error);
        }
      } finally {
        setIsFetchingGeo(false);
      }
    };

    const timeout = setTimeout(fetchGeo, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [pincode, setValue]);

  return { isFetchingGeo };
}