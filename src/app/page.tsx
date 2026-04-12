import Hero from "@/components/home/hero";
import AboutUs from "@/components/home/aboutus";
import BusinessOpportunity from "@/components/home/business";
import Testimonial from "@/components/home/testimonial";
import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/app-header";
import { FeaturedProducts } from "@/components/home/featured-products";
import prisma from "@/lib/prisma";
import FaqSection from "@/components/home/faq-section";
import BackToTop from "@/components/ui/back-top";

const Home = async () => {
  const products = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
  });
  const productsWithCategory = products.filter(p => p.categoryId);
  return (
    <div className="min-h-screen bg-white">
      <AppHeader />
      <Hero />
      <FeaturedProducts initialProducts={productsWithCategory} />
      <AboutUs />
      <BusinessOpportunity />
      <Testimonial />
      <FaqSection />
      <BackToTop />
      <Footer />
    </div>
  );
};

export default Home;
