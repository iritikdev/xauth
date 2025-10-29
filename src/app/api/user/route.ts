import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { generateUsername } from '@/lib/gen-username';

interface RegisterRequestBody {
    name: string;
    mobile: string;
    password: string;
    username: string;
}

export async function POST(request: Request) {
    const body: RegisterRequestBody = await request.json();
    const { name, mobile, password } = body;

    // Get and increment counter
    const counter = await prisma.counter.upsert({
        where: { id: "userId" },
        update: { value: { increment: 1 } },
        create: { id: "userId", value: 1 },
    });

    const userId = counter.value;
    const username = generateUsername(userId);

    console.log('Received registration data:', body);
    console.log('Received Username data:', username);

    if (!name || !mobile || !password) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { mobile } });
    if (existingUser) {
        return NextResponse.json({ message: 'Mobile No already in use' }, { status: 400 });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: User = await prisma.user.create({
            data: {
                name,
                mobile,
                username,
                password: hashedPassword,
            },
        });
        return NextResponse.json({ message: 'User registered successfully', username, name }, { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}




interface User {
    id: string;
    name: string | null;
    mobile: string;
    username: string;
}




