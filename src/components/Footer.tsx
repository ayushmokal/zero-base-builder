import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";

export function Footer() { 
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row py-8 gap-8">
          {/* Logo and Newsletter - On the left */}
          <div className="lg:w-1/3">
            <Link to="/" className="mb-8 block">
              <img 
                src="https://i.ibb.co/BCHWQmq/Black-bg-2-1-e1722342966946-300x55.png" 
                alt="Technikaz" 
                className="h-20 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Sign-Up For Newsletters"
                className="w-full h-12 px-4 rounded-lg bg-white text-black placeholder:text-gray-500 focus:outline-none"
              />
              <button className="absolute right-0 top-0 h-12 px-8 bg-[#00897B] text-white rounded-r-lg font-medium hover:bg-[#007A6D] transition-colors">
                GO
              </button>
            </div>
          </div>

          {/* Links and Company Sections - Centered */}
          <div className="flex flex-1 justify-center gap-20">
            {/* Links Column */}
            <div>
              <h3 className="text-[#00E0FF] font-medium mb-4 text-lg text-left">Links</h3>
              <ul className="space-y-3 text-left">
                <li><Link to="/games" className="hover:text-[#00E0FF]">Games</Link></li>
                <li><Link to="/tech" className="hover:text-[#00E0FF]">Tech</Link></li>
                <li><Link to="/entertainment" className="hover:text-[#00E0FF]">Entertainment</Link></li>
                <li><Link to="/mobile" className="hover:text-[#00E0FF]">Mobile</Link></li>
                <li><Link to="/stocks" className="hover:text-[#00E0FF]">Stocks</Link></li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-[#00E0FF] font-medium mb-4 text-lg text-left">Company</h3>
              <ul className="space-y-3 text-left">
                <li><Link to="/about" className="hover:text-[#00E0FF]">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#00E0FF]">Contact Us</Link></li>
                <li><Link to="/privacy" className="hover:text-[#00E0FF]">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#00E0FF]">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section with Social Links and Copyright */}
        <div className="border-t border-white/10">
          <div className="container mx-auto py-4">
            {/* Social Links */}
            <div className="flex gap-4 mb-4">
              <Link to="#" className="hover:text-[#00E0FF]">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link to="#" className="hover:text-[#00E0FF]">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="hover:text-[#00E0FF]">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link to="#" className="hover:text-[#00E0FF]">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400 text-center">
              @2024 -25 Technikaz All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}