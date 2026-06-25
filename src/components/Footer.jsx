import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#050505] text-white pt-10 pb-16 overflow-hidden border-t border-white/5">
      {/* Massive Background Text */}
      <div className="absolute top-0 left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none opacity-40">
        <h1 className="text-[20vw] font-black leading-[0.8] text-outline-transparent tracking-tighter w-full text-center whitespace-nowrap">
          SkillStream
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 mt-[12vw] sm:mt-[15vw] md:mt-[8vw] lg:mt-[5vw] animate-slide-up" style={{ animationDuration: '1s' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Logo & Socials */}
          <div className="flex flex-col space-y-10 group">
            <div className="flex items-center space-x-2 transition-transform duration-500 hover:scale-105">
              <BrainCircuit className="h-10 w-10 text-white" />
              <div className="flex flex-col leading-[1.1]">
                <span className="text-[22px] font-semibold tracking-tight">SkillStream</span>
                <span className="text-[14px] font-medium text-gray-400">Coding School</span>
              </div>
            </div>
            
            <div className="flex space-x-6">
              {/* Instagram */}
              <a href="#" className="text-white hover:text-[#E87C41] transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-white hover:text-[#E87C41] transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              {/* Discord */}
              <a href="#" className="text-white hover:text-[#E87C41] transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
              </a>
              {/* YouTube */}
              <a href="#" className="text-white hover:text-[#E87C41] transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="text-white hover:text-[#E87C41] transition-colors duration-300">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase text-gray-200">About</h3>
            <ul className="space-y-4 text-[14px] text-gray-400 font-medium">
              <li><Link to="#" className="hover:text-white transition-colors duration-300">About Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Support</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Pricing and Refund</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Terms and Condition</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase text-gray-200">Company</h3>
            <ul className="space-y-4 text-[14px] text-gray-400 font-medium">
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Resume Checker</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Hire From Us</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Discord</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Jobs</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Submit Projects</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors duration-300">Feedback</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-[13px] font-bold tracking-[0.15em] uppercase text-gray-200">Contact</h3>
            <ul className="space-y-4 text-[14px] text-gray-400 font-medium">
              <li>Online: 10am - 10pm +91 9071433205</li>
              <li>Offline: 11am - 8pm +91 9691778470</li>
              <li><a href="mailto:hello@sheryians.com" className="hover:text-[#E87C41] transition-colors duration-300">hello@sheryians.com</a></li>
              <li className="leading-relaxed">23-B, Sector C Indrapuri, Bhopal (MP), 462023</li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
