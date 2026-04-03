import { useState, useEffect } from "react";

interface PincodeData {
  district: string;
  state: string;
  area?: string;
}

export function usePincode(pincode: string) {
  const [data, setData] = useState<PincodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch if pincode is exactly 6 digits (Indian Standard)
    if (pincode.length !== 6) {
      setData(null);
      setError(null);
      return;
    }

    const fetchAddress = async () => {
      setLoading(true);
      setError(null);

      try {
        // Using api.postalpincode.in for accurate Indian data
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const result = await response.json();

        if (result[0].Status === "Success") {
          const postOffice = result[0].PostOffice[0];
          setData({
            district: postOffice.District,
            state: postOffice.State,
            area: postOffice.Name, // Optional: Specific locality
          });
        } else {
          setError("Invalid Pincode. Please check again.");
          setData(null);
        }
      } catch (err) {
        setError("Failed to fetch address details.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [pincode]);

  return { data, loading, error };
}