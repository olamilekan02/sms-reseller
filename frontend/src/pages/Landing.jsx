import React, { useEffect } from "react";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import Subscribe from "../components/Subscribe";
import { Link } from "react-router-dom";
import AOS from "aos"; // Install: npm i aos
import "aos/dist/aos.css"; // Add to main.jsx or here

export default function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 800, // Faster animation
      easing: "ease-in-out",
      once: true, // Animate once
      offset: 200, // Trigger earlier
    });
  }, []);

  return (
    <div className="font-sans scroll-smooth"> {/* Smooth scrolling */}

      {/* ======= Header / Navbar ======= */}
      <header className="sticky top-0 z-50 bg-purple-50 shadow-md">
        <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <div className="text-xl font-bold text-purple-700">
            LARRYSMS
          </div>

          {/* Menu */}
          <ul className="hidden md:flex gap-8 text-gray-700 font-medium">
            <li>
              <a href="#home" className="hover:text-purple-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-purple-600 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-purple-600 transition">
                How It Works
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-purple-600 transition">
                Contact
              </a>
            </li>
          </ul>

          {/* Login / Signup */}
          <div className="hidden md:flex gap-4">
            <Link
              to="/login"
              className="px-10 py-5 bg-white text-purple-600 text-lg font-normal rounded-xl shadow-lg hover:bg-gray-100 transition"
            >
              Login →
            </Link>
            <Link
              to="/signup"
              className="px-10 py-5 bg-purple-600 text-white text-lg font-normal rounded-xl shadow-lg hover:bg-purple-700 transition"
            >
              Register →
            </Link>
          </div>
        </nav>
      </header>

      {/* ======= Hero Section ======= */}
      <section
        id="home"
        className="relative bg-gradient-to-r from-purple-600 to-indigo-500 text-white overflow-hidden"
      >
        {/* Faded background */}
        <div
          className="absolute inset-0 bg-[url('/images.jfif')] bg-cover bg-center opacity-10"
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative container mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-10 pt-5 pb-28 z-10">
          {/* Left */}
          <div
            className="text-left lg:max-w-2xl flex-1 space-y-6"
            data-aos="fade-right" // Left side animation
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-tight">
              Receive SMS & OTP Instantly
            </h1>

            <p className="text-xl sm:text-2xl text-purple-100 max-w-xl font-normal">
              Get virtual SMS numbers for app verifications instantly.  
              No physical SIM card needed. Fast, secure, and automated with LARRYSMS.
            </p>

            {/* Store images and login button */}
            <div className="flex flex-col items-center lg:items-start gap-4">
              {/* Row with store images and login */}
              <div className="flex flex-row gap-6 items-center">
                <img src="/assets/icons/google-play-black.png" className="h-14" />
                <img src="/assets/icons/app-store-black.png" className="h-14" />

                <Link
                  to="/login"
                  className="px-10 py-5 bg-white text-purple-600 text-lg font-normal rounded-xl shadow-lg hover:bg-gray-100 transition"
                >
                  Login →
                </Link>
              </div>

              {/* New text below */}
              <span className="text-white text-lg font-semibold italic mt-2 text-center lg:text-left">
                * Available on iPhone, iPad and all Android devices
              </span>
            </div>
          </div>

          {/* Right */}
          <div
            className="flex-1 flex justify-center lg:justify-end mb-14 lg:mb-0"
            data-aos="fade-left" // Right side animation
          >
            <img
              src="/app-dashboard-3.png"
              alt="App Interface"
              className="w-64 sm:w-72 md:w-80 lg:w-[300px]"
            />
          </div>
        </div>

        {/* Bottom Shape */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            className="w-full h-40"
          >
            <path
              d="M0,64 C360,220 1080,0 1440,160 L1440,320 L0,320 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* ======= Counter Section ======= */}
      <section className="py-28 bg-purple-50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            
            {/* Counter 1 */}
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition">
              <div className="text-6xl font-bold text-purple-600">
                500<span className="text-2xl">K+</span>
              </div>
              <h5 className="mt-4 text-2xl font-semibold text-gray-700">Active Users</h5>
            </div>

            {/* Counter 2 */}
            <div data-aos="fade-up" data-aos-delay="200" className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition">
              <div className="text-6xl font-bold text-purple-600">
                50<span className="text-2xl">M+</span>
              </div>
              <h5 className="mt-4 text-2xl font-semibold text-gray-700">SMS Received</h5>
            </div>

            {/* Counter 3 */}
            <div data-aos="fade-up" data-aos-delay="300" className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition">
              <div className="text-6xl font-bold text-purple-600">
                150<span className="text-2xl">+</span>
              </div>
              <h5 className="mt-4 text-2xl font-semibold text-gray-700">Countries</h5>
            </div>

            {/* Counter 4 */}
            <div data-aos="fade-up" data-aos-delay="400" className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transition">
              <div className="text-6xl font-bold text-purple-600">
                24<span className="text-2xl">/7</span>
              </div>
              <h5 className="mt-4 text-2xl font-semibold text-gray-700">Support</h5>
            </div>

          </div>
        </div>
      </section>

      {/* ======= Features Section ======= */}
      <section id="features" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          
          {/* Premium Features Pill */}
          <div className="flex items-center justify-center mb-8 gap-3">
            <span className="flex items-center bg-purple-200 text-purple-800 px-4 py-2 rounded-full text-lg font-semibold">
              <img
                src="/assets/icons/bulb.svg"
                alt="Premium Features Icon"
                className="h-7 w-7 mr-2"
              />
              Premium Features
            </span>
          </div>

          {/* Section Title */}
          <h2 className="text-5xl sm:text-6xl font-bold mb-8">Why Choose LARRYSMS?</h2>

          <p className="mb-16 text-xl sm:text-2xl max-w-3xl mx-auto text-gray-700">
            Discover powerful features designed for SMS verification and OTP services, making our platform perfect for your needs.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Feature Card 1 */}
            <div data-aos="fade-left" className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-3 flex flex-col items-center text-center">
              <img src="/assets/icons/icons8-sms-48.png" alt="Feature Icon" className="h-20 w-20 mb-6" />
              <h3 className="text-3xl font-semibold mb-3">Instant SMS Delivery</h3>
              <p className="text-lg text-gray-700">Receive OTP and verification SMS instantly with our high-speed network infrastructure.</p>
            </div>

            {/* Feature Card 2 */}
            <div data-aos="fade-up" className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-3 flex flex-col items-center text-center">
              <img src="/assets/icons/icons8-globe-50.png" alt="Feature Icon" className="h-20 w-20 mb-6" />
              <h3 className="text-3xl font-semibold mb-3">Global Coverage</h3>
              <p className="text-lg text-gray-700">Access virtual numbers from 150+ countries for any app verification worldwide.</p>
            </div>

            {/* Feature Card 3 */}
            <div data-aos="fade-right" className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-3 flex flex-col items-center text-center">
              <img src="/assets/icons/icons8-lock-50.png" alt="Feature Icon" className="h-20 w-20 mb-6" />
              <h3 className="text-3xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-lg text-gray-700">Your data is protected with enterprise-grade encryption and privacy measures.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ======= How It Works Section ======= */}
      <section id="how-it-works" className="py-28 bg-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-5xl sm:text-6xl font-bold mb-8">How LARRYSMS Works</h2>
          <p className="mb-16 text-xl sm:text-2xl max-w-3xl mx-auto text-gray-700">
            Follow these simple steps to start receiving SMS and OTP instantly with LARRYSMS.
          </p>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            
            {/* Step 1 */}
            <div data-aos="fade-left" className="bg-gradient-to-r from-purple-100 to-purple-50 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-3 flex flex-col items-center text-center">
              <img src="/assets/icons/icons8-user-100.png" alt="Sign Up Icon" className="h-20 w-20 mb-6" />
              <h3 className="text-3xl font-semibold mb-3">Sign Up</h3>
              <p className="text-lg text-gray-700">Create your account in less than 60 seconds.</p>
            </div>

            {/* Step 2 */}
            <div data-aos="fade-up" className="bg-gradient-to-r from-purple-100 to-purple-50 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-3 flex flex-col items-center text-center">
              <img src="/assets/icons/icons8-phone-48.png" alt="Choose Number Icon" className="h-20 w-20 mb-6" />
              <h3 className="text-3xl font-semibold mb-3">Choose Number</h3>
              <p className="text-lg text-gray-700">Select a virtual number from your desired country and provider.</p>
            </div>

            {/* Step 3 */}
            <div data-aos="fade-right" className="bg-gradient-to-r from-purple-100 to-purple-50 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-3 flex flex-col items-center text-center">
              <img src="/assets/icons/icons8-message-50.png" alt="Receive SMS Icon" className="h-20 w-20 mb-6" />
              <h3 className="text-3xl font-semibold mb-3">Receive SMS</h3>
              <p className="text-lg text-gray-700">Get your OTP and verification codes instantly in your dashboard.</p>
            </div>

          </div>
        </div>
      </section>

      {/* ======= Customer Reviews Section ======= */}
      <section id="reviews" className="py-28 bg-purple-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center">
          {/* Section Intro */}
          <div className="mb-16">
            <span className="inline-flex items-center bg-purple-200 text-purple-800 px-4 py-2 rounded-full text-lg font-semibold mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Customer Reviews
            </span>
            <h2 className="text-5xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Join thousands of satisfied customers who trust LARRYSMS for instant SMS verification and OTP services.</p>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Review 1 */}
            <div data-aos="fade-up" data-aos-delay="100" className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927C9.329 2.114 10.671 2.114 10.951 2.927l1.286 3.954a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.954c.28 .813-.691 1.485-1.4 1.02l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.709 .465-1.68-.207-1.4-1.02l1.286-3.954a1 1 0 00-.364-1.118L2.028 9.38c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.954z" />
                    </svg>
                  ))}
                </div>
              </div>
              <h4 className="text-2xl font-semibold mb-3">Fast & Reliable Service!</h4>
              <p className="text-gray-700 mb-6">"LARRYSMS is a game-changer for my business. I can verify multiple accounts without hassle. SMS delivery is instant and the dashboard is intuitive."</p>
              <div className="flex items-center">
                <img src="/assets/icons/avatar-1.png" alt="David Chen" className="h-12 w-12 rounded-full mr-4" />
                <div className="text-left">
                  <h5 className="font-semibold">David Chen</h5>
                  <span className="text-gray-500 text-sm">Digital Marketing Manager</span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div data-aos="fade-up" data-aos-delay="200" className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927C9.329 2.114 10.671 2.114 10.951 2.927l1.286 3.954a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.954c.28 .813-.691 1.485-1.4 1.02l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.709 .465-1.68-.207-1.4-1.02l1.286-3.954a1 1 0 00-.364-1.118L2.028 9.38c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.954z" />
                    </svg>
                  ))}
                </div>
              </div>
              <h4 className="text-2xl font-semibold mb-3">Best SMS Service Provider</h4>
              <p className="text-gray-700 mb-6">"I've tried many SMS verification services, but LARRYSMS stands out with its reliability and affordable pricing. Highly recommended for developers!"</p>
              <div className="flex items-center">
                <img src="/assets/icons/avatar-2.png" alt="Sarah Martinez" className="h-12 w-12 rounded-full mr-4" />
                <div className="text-left">
                  <h5 className="font-semibold">Sarah Martinez</h5>
                  <span className="text-gray-500 text-sm">Software Developer</span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div data-aos="fade-up" data-aos-delay="300" className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="flex justify-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927C9.329 2.114 10.671 2.114 10.951 2.927l1.286 3.954a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.286 3.954c.28 .813-.691 1.485-1.4 1.02l-3.37-2.448a1 1 0 00-1.176 0l-3.37 2.448c-.709 .465-1.68-.207-1.4-1.02l1.286-3.954a1 1 0 00-.364-1.118L2.028 9.38c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.954z" />
                    </svg>
                  ))}
                </div>
              </div>
              <h4 className="text-2xl font-semibold mb-3">Perfect for My Agency</h4>
              <p className="text-gray-700 mb-6">"Managing multiple client accounts is so much easier with LARRYSMS. The API integration is seamless and customer support is excellent."</p>
              <div className="flex items-center">
                <img src="/assets/icons/avatar-3.png" alt="James Wilson" className="h-12 w-12 rounded-full mr-4" />
                <div className="text-left">
                  <h5 className="font-semibold">James Wilson</h5>
                  <span className="text-gray-500 text-sm">Agency Owner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= FAQ Section ======= */}
      <FAQ />

      {/* ======= Subscribe / Contact ======= */}
      <section id="contact">
        <Subscribe />
      </section>

      <Footer />
    </div>
  );
}