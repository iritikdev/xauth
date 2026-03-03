import { Github, Instagram, Twitter, Youtube, Send } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-12 pb-8 md:pt-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Grid Structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-y-10 gap-x-8 md:gap-12">
          
          {/* Brand Column - Full width on mobile, 4/12 on desktop */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <div className="shrink-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">A</div>
              <h3 className="text-xl font-bold text-slate-900 leading-tight">
                Amaze Ayurveda<br/><span className="text-emerald-600">Pvt. Ltd.</span>
              </h3>
            </div>
            <p className="text-slate-500 leading-relaxed max-w-md">
              Empowering people with pure Ayurvedic products and business opportunities. Join us to build better health, wealth, and a sustainable future.
            </p>
            <div className="flex gap-5 text-slate-400">
              <Github className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 hover:text-emerald-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Links Columns - Side by side on small screens */}
          <div className="col-span-1 md:col-span-2 space-y-5">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">About</li>
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">Features</li>
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">Works</li>
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">Career</li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-5">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Help</h4>
            <ul className="space-y-3 text-slate-500 text-sm">
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">Customer Support</li>
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">Delivery Details</li>
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">Terms & Conditions</li>
              <li className="hover:text-emerald-600 transition-all cursor-pointer hover:translate-x-1">Privacy Policy</li>
            </ul>
          </div>

          {/* Newsletter Column - Full width on tablet/mobile */}
          <div className="col-span-1 sm:col-span-2 md:col-span-4 space-y-5">
            <h4 className="font-bold text-slate-900 uppercase tracking-widest text-xs">Subscribe to newsletter</h4>
            <div className="relative group max-w-sm md:max-w-none">
              <input 
                type="email" 
                placeholder="Your email..."
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all shadow-sm text-sm"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-slate-900 text-white px-4 rounded-lg hover:bg-emerald-600 transition-all flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400">By subscribing, you agree to our Privacy Policy.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center text-slate-400 text-xs md:text-sm">
            <p>© 2026 Amaze Ayurveda Pvt. Ltd. | All Rights Reserved</p>
            <p className="flex items-center gap-1.5">
              Made with <span className="text-red-500 animate-pulse">❤️</span> for better health
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};