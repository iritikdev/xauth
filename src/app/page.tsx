import AboutUs from "@/components/aboutus";
import BusinessOpportunity from "@/components/business";
import Hero from "@/components/hero";
import Testimonial from "@/components/testimonial";
import { Footer } from "@/components/footer";
import { ProductCarousel } from "@/components/LatestReleases";
import { Navbar } from "@/components/navbar";
import { FeaturedProducts } from "@/components/ecommerce/featured-products";
import prisma from "@/lib/prisma";
import AmazeAyurvedaPlan from "@/components/AmazeAyurvedaPlan";
import FaqSection from "@/components/faq-section";

interface Props {
  companyName?: string;
}

const messages = [
  "🔥 Hot Deal: 50% Off!",
  "🎉 New Feature Released!",
  "🚀 Launching Soon!",
  "📢 Follow us on Twitter!",
];

const Home = async (props: Props) => {
  const products = await prisma.product.findMany({
    include : {category:true},
    take: 6,
    orderBy: { createdAt: "desc" },
  });
  console.log("Product", products)
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedProducts initialProducts={products} />
      <AboutUs />
      <BusinessOpportunity />
      <Testimonial />
      <FaqSection/>
      <Footer />
    </div>
  );
};

export default Home;
