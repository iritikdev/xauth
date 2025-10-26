import Image from "next/image";
import { FaTwitter, FaInstagram, FaGithub, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:justify-between">
        {/* Brand and description */}
        <div className="mb-8 md:mb-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Image src={"/aalogoc.png"} alt="Amaze Ayurveda Pvt. Ltd." width={48} height={48} />
            <span className="text-xl font-bold">Amaze Ayurveda Pvt. Ltd.</span>
          </div>
          <p className="text-gray-600 max-w-xs">
            Empowering people with pure Ayurvedic products and business opportunities.
            Join us to build better health, wealth, and a sustainable future.
          </p>
          <div className="flex items-center gap-4 mt-4">
            <a href="#" aria-label="GitHub" className="text-gray-500 hover:text-black"><FaGithub size={20} /></a>
            <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-black"><FaInstagram size={20} /></a>
            <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-black"><FaTwitter size={20} /></a>
            <a href="#" aria-label="YouTube" className="text-gray-500 hover:text-black"><FaYoutube size={20} /></a>
          </div>
        </div>
        {/* Company links */}
        <div className="mb-8 md:mb-0 flex-1">
          <h3 className="font-semibold mb-2">Company</h3>
          <ul className="text-gray-600">
            <li className="mb-2"><a href="#" className="hover:text-black">About</a></li>
            <li className="mb-2"><a href="#" className="hover:text-black">Features</a></li>
            <li className="mb-2"><a href="#" className="hover:text-black">Works</a></li>
            <li><a href="#" className="hover:text-black">Career</a></li>
          </ul>
        </div>
        {/* Help links */}
        <div className="mb-8 md:mb-0 flex-1">
          <h3 className="font-semibold mb-2">Help</h3>
          <ul className="text-gray-600">
            <li className="mb-2"><a href="#" className="hover:text-black">Customer Support</a></li>
            <li className="mb-2"><a href="#" className="hover:text-black">Delivery Details</a></li>
            <li className="mb-2"><a href="#" className="hover:text-black">Terms & Conditions</a></li>
            <li><a href="#" className="hover:text-black">Privacy Policy</a></li>
          </ul>
        </div>
        {/* Newsletter */}
        <div className="flex-1">
          <h3 className="font-semibold mb-2">Subscribe to newsletter</h3>
          <form className="flex items-center mb-4">
            <input
              className="py-2 px-4 flex-grow rounded-l-lg border focus:outline-none"
              placeholder="Your email..."
              type="email"
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-r-lg flex items-center justify-center"
              type="submit"
            >
              &rarr;
            </button>
          </form>
          {/* <div className="flex flex-wrap gap-4 text-gray-500 text-sm">
            <span>bestofjs</span>
            <span>Product Hunt</span>
            <span>reddit</span>
            <span>Medium</span>
            <span>Y Combinator</span>
            <span>🚀</span>
          </div> */}
        </div>
      </div>
      {/* Bottom copyright */}
      <div className="border-t pt-4 pb-2 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Amaze Ayurveda Pvt. Ltd. | All Rights Reserved, Made with <span className="text-red-500">♥</span>
      </div>
    </footer>
  );
}
