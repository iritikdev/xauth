// components/LeadershipDesignations.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const designations = [
    { icon: "⭐", title: "Star", bv: "25,000", label: "8", bonus: "5%" },
    { icon: "🌟", title: "Super Star", bv: "50,000", label: "9", bonus: "4%" },
    { icon: "💎", title: "Diamond", bv: "1,00,000", label: "10", bonus: "3%" },
    { icon: "🌠", title: "Star Diamond", bv: "2,00,000", label: "11", bonus: "2%" },
    { icon: "🎖", title: "Diplomat", bv: "5,00,000", label: "12", bonus: "1%" },
    { icon: "✨", title: "Star Diplomat", bv: "15,00,000", label: "13", bonus: "3%" },
    { icon: "💠", title: "Diamond Diplomat", bv: "40,00,000", label: "14", bonus: "2%" },
    { icon: "👑", title: "Chairman", bv: "1,00,00,000", label: "15", bonus: "1%" },
];

export default function LeadershipDesignations() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary">Leadership Designations</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    Your self-purchase + your team’s purchases = <strong>BV Growth</strong>
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {designations.map((item, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <span className="text-2xl">{item.icon}</span>
                                {item.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground space-y-2">
                            <p><strong>BV Target:</strong> ₹{item.bv}</p>
                            <p><strong>Label:</strong> {item.label}</p>
                            <p><strong>Bonus:</strong> {item.bonus}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}