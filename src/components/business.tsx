// components/BusinessOpportunity.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const steps = [
    "Fill out the registration form",
    "Purchase products worth ₹499 or more (your choice)",
    "Share company benefits with others",
    "Grow your network → Earn unlimited income",
];

export default function BusinessOpportunity() {
    return (
        <section className="max-w-4xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary">Business Opportunity</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Start your journey toward financial freedom and wellness with Ayurveda.
                </p>
            </div>

            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="text-2xl text-green-700">How to Start?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start space-x-3">
                            <CheckCircle className="text-green-600 mt-1" />
                            <p className="text-muted-foreground text-base">{step}</p>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    );
}