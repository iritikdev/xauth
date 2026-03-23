import Hero from "@/components/hero";
import AboutUs from "@/components/aboutus";
import BusinessOpportunity from "@/components/business";
import Testimonial from "@/components/testimonial";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { FeaturedProducts } from "@/components/ecommerce/featured-products";
import prisma from "@/lib/prisma";
import FaqSection from "@/components/faq-section";

const Home = async () => {
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });
  const productsWithCategory = products.filter(p => p.categoryId);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedProducts initialProducts={productsWithCategory} />
      <AboutUs />
      <BusinessOpportunity />
      <Testimonial />
      <FaqSection />
      <Footer />
    </div>
  );
};

export default Home;
