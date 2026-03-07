import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const username = formData.get('username') as string;
    const docType = formData.get('docType') as string;

    // 1. Map docType to the correct Prisma field in KycDocument model
    const fieldMapping: Record<string, string> = {
      aadhaar: "aadharUrl",
      pan: "panUrl",
      passbook: "passbookUrl"
    };

    const dbField = fieldMapping[docType];
    if (!dbField) return NextResponse.json({ error: "Invalid document type" }, { status: 400 });

    // 2. Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: `amaze_kyc/${username}`, resource_type: 'auto' },
        (error, res) => error ? reject(error) : resolve(res)
      ).end(buffer);
    });

    // 3. Update VIA USER MODEL using nested upsert
    // This targets the user and creates/updates the related KycDocument
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        kycDocument: {
          upsert: {
            create: {
              [dbField]: result.secure_url,
              status: "PENDING",
            },
            update: {
              [dbField]: result.secure_url,
              status: "PENDING",
            },
          },
        },
      },
      include: {
        kycDocument: true, // Return the updated document info
      },
    });

    return NextResponse.json({ 
      url: result.secure_url, 
      kycRecord: updatedUser.kycDocument 
    });

  } catch (error) {
    console.error("KYC_UPLOAD_ERROR:", error);
    return NextResponse.json({ error: 'Upload process failed' }, { status: 500 });
  }
}