import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'amaze_partners', // Organizes photos in a folder
          public_id: `${username}_profile`, // Replaces old photo automatically
          transformation: [{ width: 500, height: 500, crop: 'limit' }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // TODO: Save result.secure_url to your Database here!
    await prisma.user.update({ where: { username }, data: { photoUrl: result.secure_url } })

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}