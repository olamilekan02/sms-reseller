export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-gray-50 py-20">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
      How It Works
    </h2>
    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
      Simple 3-step process to start verifying numbers instantly
    </p>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
      <div className="flex flex-col items-center md:items-start">
        <img src="/public/icon-1.png" alt="Step 1" className="w-16 h-16" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Sign Up</h3>
        <p className="mt-2 text-gray-600">Create an account in seconds and fund your wallet.</p>
      </div>

      <div className="flex flex-col items-center md:items-start">
        <img src="/public/icon-2.png" alt="Step 2" className="w-16 h-16" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Choose a Number</h3>
        <p className="mt-2 text-gray-600">Rent or buy numbers from multiple countries instantly.</p>
      </div>

      <div className="flex flex-col items-center md:items-start">
        <img src="/icons/step3.svg" alt="Step 3" className="w-16 h-16" />
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Receive SMS</h3>
        <p className="mt-2 text-gray-600">Get verification SMS immediately and complete your tasks.</p>
      </div>
    </div>
  </div>
</section>

  );
}
