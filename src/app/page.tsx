import AboutUs from "@/components/aboutus";
import BusinessOpportunity from "@/components/business";
import Categories from "@/components/categories";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import LeadershipDesignations from "@/components/leader-designation";
import Marquee from "@/components/flash-marquee";
import Navbar from "@/components/navbar";
import OurProducts from "@/components/products";
import Testimonial from "@/components/testimonial";

interface Props {
  companyName?: string;
}

const messages = [
  "🔥 Hot Deal: 50% Off!",
  "🎉 New Feature Released!",
  "🚀 Launching Soon!",
  "📢 Follow us on Twitter!",
];

const Home = (props: Props) => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Marquee items={messages} />
      <Categories />
      <AboutUs />
      <OurProducts />
      <BusinessOpportunity />
      <LeadershipDesignations />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Home;
