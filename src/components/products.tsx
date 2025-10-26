// components/OurProducts.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

const products = [
    {
        title: "Food Products",
        description: "Organic grains, spices, herbal teas",
        image: "/images/food-products.jpg",
    },
    {
        title: "Kitchen Care",
        description: "Natural cleaners, eco-friendly kitchen solutions",
        image: "/images/kitchen-care.jpg",
    },
    {
        title: "Health Products",
        description: "Herbal supplements, immunity boosters",
        image: "/images/health-products.jpg",
    },
    {
        title: "Festival Products",
        description: "Eco-friendly, tradition-based items",
        image: "/images/festival-products.jpg",
    },
    {
        title: "Nursery Products",
        description: "Plant care, organic soil, seeds",
        image: "/images/nursery-products.jpg",
    },
    {
        title: "Personal Care",
        description: "Herbal soaps, skincare, haircare",
        image: "/images/personal-care.jpg",
    },
];

export default function OurProducts() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-primary">Our Products</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    We deliver 100% pure Ayurvedic and natural products across multiple categories.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                        <div className="relative h-48 w-full">
                            <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover rounded-t-md"
                            />
                        </div>
                        <CardHeader>
                            <CardTitle className="text-xl text-green-700">{product.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{product.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}