"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface CloudinaryUploadProps {
  onUpload: (url: string, publicId: string) => void;
  buttonText?: string;
}

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function CloudinaryUpload({
  onUpload,
  buttonText = "Upload Image",
}: CloudinaryUploadProps) {
  const widgetRef = useRef<any>(null);

  const openWidget = () => {
    if (!window.cloudinary) {
      console.error("Cloudinary script not loaded");
      return;
    }

    // if (!widgetRef.current) {
    //   widgetRef.current = window.cloudinary.createUploadWidget(
    //     {
    //       cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    //       uploadPreset: "amaze_pw_receipts",
    //       sources: ["local", "camera", "url"],
    //       multiple: false,
    //       resourceType: "image",
    //       cropping: false,
    //     },
    //     (error: any, result: any) => {
    //       if (!error && result.event === "success") {
    //         onUpload(
    //           result.info.secure_url,
    //           result.info.public_id
    //         );
    //       }
    //     }
    //   );
    // }
    if (!widgetRef.current) {
  widgetRef.current = window.cloudinary.createUploadWidget(
    {
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: "amaze_pw_receipts",
      sources: ["local", "camera", "url"],
      multiple: false,
      resourceType: "image",
      cropping: false,
    },
    (error: any, result: any) => {
      if (!error && result.event === "success") {
        onUpload(
          result.info.secure_url,
          result.info.public_id
        );

        // Close widget after upload
        setTimeout(() => {
          widgetRef.current?.close();
        }, 300);
      }
    }
  );
}

    widgetRef.current.open();
  };

  return (
    <Button type="button" onClick={openWidget}>
      {buttonText}
    </Button>
  );
}