import AboutUs from "@/components/aboutus";
import BusinessOpportunity from "@/components/business";
import Categories from "@/components/categories";
import Hero from "@/components/hero";
import LeadershipDesignations from "@/components/leader-designation";
import Marquee from "@/components/flash-marquee";
import OurProducts from "@/components/products";
import Testimonial from "@/components/testimonial";
import AmazeAyurvedaPlan from "@/components/AmazeAyurvedaPlan";
import {Footer} from "@/components/footer";
import LatestReleases from "@/components/LatestReleases";
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
      <LatestReleases />
      <AboutUs />
      {/* <AmazeAyurvedaPlan /> */}
      <BusinessOpportunity />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default Home;
