export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-900">
          SMSVerify
        </div>

        {/* Navigation Links */}
<div className="hidden md:flex items-center space-x-8 text-sm text-gray-700">
  <a href="#home" className="hover:text-gray-900">
    Home
  </a>
  <a href="#features" className="hover:text-gray-900">
    Features
  </a>
  <a href="#how-it-works" className="hover:text-gray-900">
    How It Works
  </a>
  <a href="#contact" className="hover:text-gray-900">
    Contact
  </a>
</div>

        <div className="flex items-center space-x-4 text-sm">
          <a href="/login">Login</a>
          <a className="px-4 py-2 bg-gray-900 text-white rounded-md">
            Sign Up
          </a>
        </div>
      </div>
    </nav>
  );
}
