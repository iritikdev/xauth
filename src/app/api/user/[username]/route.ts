import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername } from '@/lib/actions/getUserByUsername';
import { kycSchema } from '@/lib/validations/register-user';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const username = url.pathname.split('/').pop(); // or use url.searchParams if it's a query param

    if (!username || typeof username !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid username' }), { status: 400 });
    }

    const user = await getUserByUsername(username);
    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(user), { status: 200 });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsed = kycSchema.parse(body);
        const url = new URL(req.url);
        const username = url.pathname.split('/').pop(); // or use url.searchParams if it's a query param

        if (!username || typeof username !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid username' }), { status: 400 });
        }

        // console.log("parsed data", body);
        // console.log("params", username);

        const user = await prisma.user.findFirst({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        console.log(user)

        const saved = await prisma.user.update({
            where: { username },
            data: {
                name: parsed.name,
                fatherName: parsed.fatherName,
                motherName: parsed.motherName,

                address: parsed.address,
                district: parsed.district,
                state: parsed.state,
                pincode: parsed.pincode,


                accountNo: parsed.accountNo,
                branch: parsed.branch,
                ifsc: parsed.ifsc,
                upiId: parsed.upiId,

                nomineeName: parsed.nomineeName,
                nomineeRelation: parsed.nomineeRelation,
                nomineeMobile: parsed.nomineeMobile,
                nomineeAadhaar: parsed.nomineeAadhaar,

                email: parsed.email,
                mobile: parsed.mobile,
                panNumber: parsed.panNumber,
                aadharNo: parsed.aadharNo,
            },
        });

        return NextResponse.json({ success: true, data: saved });
    } catch (error: any) {
        console.error("KYC submission error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}





// Correct Type for Next.js 15 Route Handlers
export async function PATCH(
  request: NextRequest, // Changed from Request to NextRequest
  { params }: { params: Promise<{ username: string }> } // params is now a Promise
) {
  try {
    const body = await request.json();
    
    // 1. You MUST await the params object before using it
    const { username } = await params;

    if (!username) {
      return NextResponse.json({ error: "Username missing" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: body,
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("[PATCH_ERROR]", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}