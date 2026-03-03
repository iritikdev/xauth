import { IdCardFront } from "@/components/idcard-front";
import { IdCardBack } from "@/components/idcard-back";

export default function IdCardPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 justify-center items-center p-8">
      <IdCardFront />
      <IdCardBack />
    </div>
  );
}