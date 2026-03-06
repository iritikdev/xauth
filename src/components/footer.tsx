import {
  Github,
  Instagram,
  Twitter,
  Youtube,
  Send,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="relative bg-green-50 border-t border-slate-100 overflow-hidden pt-16 pb-8 md:pt-24">
      {/* --- Swadeshi Background Graphics Overlay --- */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        {/* Simplified Vector of Red Fort (Left) */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/12/Red_Fort_New_Delhi_Vector.svg"
          alt="Red Fort Graphic"
          className="absolute -left-20 bottom-0 h-[300px] w-auto text-slate-900 grayscale"
        />
        {/* Simplified Vector of Taj Mahal (Center-Right) */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/3d/Taj_Mahal_Vector.svg"
          alt="Taj Mahal Graphic"
          className="absolute right-1/4 top-10 h-[250px] w-auto grayscale"
        />
        {/* Simplified Vector of Qutub Minar (Right) */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/3/30/Qutub_Minar_Vector.svg"
          alt="Qutub Minar Graphic"
          className="absolute right-0 bottom-[-50px] h-[400px] w-auto grayscale"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-y-12 gap-x-8 md:gap-12 mb-16">
          {/* Brand & Mission Column */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/amaze-logo.png"
                alt="Logo"
                className="shrink-0 w-12 h-12 object-contain"
              />
              <h3 className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                Amaze Ayurveda
                <br />
                <span className="text-emerald-600 text-lg font-bold">
                  Pvt. Ltd.
                </span>
              </h3>
            </div>
            <p className="text-slate-600 leading-relaxed max-w-md">
              Aatmanirbhar Bharat begins with wellness. We empower the nation
              with authentic Ayurvedic wisdom and sustainable business
              opportunities.
            </p>
            <div className="flex gap-4 text-slate-400">
              {[Github, Instagram, Twitter, Youtube].map((Icon, i) => (
                <Icon
                  key={i}
                  className="w-5 h-5 hover:text-emerald-600 hover:scale-110 cursor-pointer transition-all"
                />
              ))}
            </div>
          </div>

          {/* Contact & Location (Replaces standard links for stronger trust) */}
          <div className="col-span-1 md:col-span-3 space-y-6">
            <h4 className="font-bold text-slate-950 uppercase tracking-widest text-xs">
              Reach Us
            </h4>
            <ul className="space-y-4 text-slate-700 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Saraiya, Bihar, India 843106</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-emerald-600 shrink-0" />

                <a
                  href="tel:+919204260719"
                  className="hover:text-emerald-600 transition-colors"
                >
                  +91 9204260719
                </a>
              </li>

              <li className="flex items-center gap-3 hover:text-emerald-600 cursor-pointer transition-colors">
                <Mail className="w-5 h-5 text-emerald-600 shrink-0" />

                <a
                  href="mailto:amazeayurveda.in@gmail.com"
                  className="hover:text-emerald-600 transition-colors"
                >
                  amazeayurveda.in@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h4 className="font-bold text-slate-950 uppercase tracking-widest text-xs">
              Explore
            </h4>
            <ul className="space-y-3 text-slate-600 text-sm font-medium">
              {[
                "About Us",
                "Business Plan",
                "Latest Products",
                "Careers",
                "Terms",
              ].map((link) => (
                <li
                  key={link}
                  className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1"
                >
                  {link}
                </li>
              ))}
            </ul>
          </div>

          {/* Swadeshi Newsletter */}
          <div className="col-span-1 sm:col-span-2 md:col-span-3 space-y-6">
            <h4 className="font-bold text-slate-950 uppercase tracking-widest text-xs">
              Stay Connected
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed">
              Subscribe for Ayurvedic insights and exclusive Swadeshi offers.
            </p>
            <div className="relative group">
              <Input
                type="email"
                placeholder="Support Local. Enter Email..."
                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-inner text-sm"
              />
              <Button
                size="icon"
                className="absolute right-2 top-2 bottom-2 bg-slate-950 text-white rounded-lg hover:bg-emerald-600 transition-all h-10 w-10"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Patriotism Focus */}
        <div className="mt-16 pt-8 border-t border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center text-slate-500 text-xs md:text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-orange-500 fill-orange-500" />
              <p>Headquartered in Bihar, India</p>
            </div>
            <p>© 2026 Amaze Ayurveda Pvt. Ltd. | CIN: U85100DL2026PTC000000</p>
            <p className="flex items-center gap-1.5 font-medium text-slate-700">
              Made in Bharat{" "}
              <span className="text-red-500 animate-pulse">🇮🇳</span> for Global
              Wellness
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
