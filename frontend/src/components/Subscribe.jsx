import React from "react";

export default function Subscribe() {
  return (
    <>
     
{/* ===== Download / Platform Availability ===== */}
<section className="relative py-32">
  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('/assets/icons/images.jfif')",
    }}
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/60" />

  {/* Content */}
  <div className="relative max-w-4xl mx-auto px-6 text-center text-white">
    <h2 className="text-4xl md:text-5xl font-bold mb-6">
      LARRYSMS is Available on All Platforms
    </h2>

    <p className="text-lg md:text-xl text-gray-200 mb-12">
      Access LARRYSMS from any device — smartphone, tablet, or desktop.
      Start receiving SMS and OTP instantly.
    </p>

    <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
      <img
        src="/assets/icons/google-play-black.png"
        className="h-14 hover:scale-105 transition"
        alt="Google Play"
      />
      <img
        src="/assets/icons/app-store-black.png"
        className="h-14 hover:scale-105 transition"
        alt="App Store"
      />
    </div>

    <span className="block mt-6 text-sm italic text-gray-300">
      * Available on iPhone, iPad and all Android devices
    </span>
  </div>
</section>


     
      {/* ===== Subscribe Section ===== */}
<section className="py-24 bg-gradient-to-b from-purple-50/40 to-white">
  <div className="max-w-3xl mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold mb-6 text-gray-900">
      Get Updates & Special Offers
    </h2>

    <p className="text-lg text-gray-600 mb-12">
      Subscribe to the LARRYSMS newsletter for updates, new features,
      and exclusive offers.
    </p>

    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
    >
      <input
        type="email"
        placeholder="Enter your email address"
        className="flex-1 px-6 py-4 rounded-2xl border border-gray-300 text-lg focus:ring-4 focus:ring-purple-200 outline-none"
      />

      <button
        type="submit"
        className="px-10 py-4 rounded-2xl bg-purple-600 text-white text-lg font-semibold hover:bg-purple-700 transition shadow-md"
      >
        Subscribe →
      </button>
    </form>

    <p className="text-sm text-gray-500 mt-6">
      No spam. Unsubscribe anytime.
    </p>
  </div>
</section>

    </>
  );
}
