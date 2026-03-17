import AboutUs from "@/components/aboutus";
import BusinessOpportunity from "@/components/business";
import Hero from "@/components/hero";
import Testimonial from "@/components/testimonial";
import {Footer} from "@/components/footer";
import { ProductCarousel } from "@/components/LatestReleases";
import { Navbar } from "@/components/navbar";

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
      <ProductCarousel products={[]} />
      <AboutUs />
      {/* <AmazeAyurvedaPlan /> */}
      <BusinessOpportunity />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Home;
