import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* ===== Footer Top ===== */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div>
            <img
              src="/assets/logo/logo.png"
              alt="SMS Platform Logo"
              className="h-10 mb-4"
            />

            <p className="text-sm leading-relaxed text-gray-400">
              A reliable virtual SMS & OTP platform built for fast verification,
              global coverage, and secure authentication.
            </p>

            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-white transition">Facebook</a>
              <a href="#" className="hover:text-white transition">Twitter</a>
              <a href="#" className="hover:text-white transition">LinkedIn</a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Product Help */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white">Help Center</a></li>
              <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white">Contact Support</a></li>
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get the App</h4>

            <div className="flex flex-col gap-4">
              <img
                src="/assets/icons/google-play-black.png"
                alt="Google Play"
                className="h-12 w-fit"
              />
              <img
                src="/assets/icons/app-store-black.png"
                alt="App Store"
                className="h-12 w-fit"
              />
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Available on Android, iPhone, and iPad
            </p>
          </div>

        </div>
      </div>

      {/* ===== Footer Bottom ===== */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500 gap-3">
          <span>© 2025 LarrySMS. All rights reserved.</span>
          <span>Powered by LarrySMS Technologies</span>
        </div>
      </div>
    </footer>
  );
}
