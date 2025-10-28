// components/WelcomeLetter.tsx
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const WelcomeLetter = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Card className="max-w-3xl mx-auto mt-10 p-6 shadow-lg bg-white rounded-lg">
            <CardHeader>
                <h1 className="text-2xl font-bold text-center text-green-700">Welcome Letter</h1>
            </CardHeader>
            <CardContent ref={contentRef}>
                <p className="mb-4">
                    <strong>To,</strong><br />
                    SUDHANSHU KUMAR<br />
                    BISARPATTI RUPAULI-843106<br />
                    Muzaffarpur
                </p>

                <h2 className="text-xl font-semibold mb-2 text-green-600">Welcome SUDHANSHU KUMAR!</h2>

                <p className="mb-4">
                    Congratulations on your decision to join <strong>Amaze Ayurveda Pvt. Ltd.</strong> — a vibrant and visionary platform dedicated to transforming lives through holistic wellness and entrepreneurial empowerment.
                </p>

                <p className="mb-4">
                    You are now part of a once-in-a-lifetime opportunity. Amaze Ayurveda is more than a business — it’s a movement built on trust, community, and the power of natural healing. As you embark on this journey, you’ll forge lasting friendships and become part of a support system that’s unmatched in any other industry.
                </p>

                <p className="mb-4">
                    This is your business — but you’re never alone. We’ve crafted a proven, step-by-step roadmap to help you build a thriving enterprise tailored to your lifestyle and personal goals. Whether you commit part-time or full-time, the rewards are immense for those who invest their energy and passion into building a strong foundation.
                </p>

                <p className="mb-4">
                    At Amaze Ayurveda Pvt. Ltd., our mission is simple: <strong>to inspire success and well-being in every life we touch.</strong> We believe in spreading positivity, purpose, and prosperity — and you are now a key part of that mission.
                </p>

                <div className="bg-gray-100 p-4 rounded-md mb-4">
                    <p><strong>Your ID:</strong> 596723</p>
                    <p><strong>Name:</strong> SUDHANSHU KUMAR</p>
                    <p><strong>Sponsor ID:</strong> 851247</p>
                </div>

                <p className="mb-4">
                    We’re confident that your journey with Amaze Ayurveda Pvt. Ltd. will be deeply fulfilling. You’ve taken the first step toward a future filled with growth, impact, and success.
                </p>

                <p className="font-semibold">
                    Keep striving. Keep shining. See you at the top!
                </p>

                <p className="mt-6">
                    <strong>Warm regards,</strong><br />
                    Amaze Ayurveda Pvt. Ltd.
                </p>
            </CardContent>

            <div className="text-center mt-6">
                <Button onClick={handlePrint}>Download as PDF</Button>
            </div>
        </Card>

    );
};

export default WelcomeLetter;