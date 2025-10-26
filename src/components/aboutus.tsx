// components/AboutUs.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AboutUs() {
    return (
        <section className="max-w-5xl mx-auto px-6 py-16 space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-bold tracking-tight text-primary">About Us</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Empowering lives through Ayurveda, sustainability, and entrepreneurship.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-700">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <ul className="list-disc list-inside space-y-2">
                            <li>Remove unemployment by offering self-employment opportunities</li>
                            <li>Protect the environment with eco-friendly products</li>
                            <li>Improve health naturally with Ayurveda</li>
                            <li>Promote Indian products proudly</li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="text-2xl text-indigo-700">Our Vision</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            To build a healthier society, a stronger economy, and a sustainable future through Ayurveda & entrepreneurship.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}