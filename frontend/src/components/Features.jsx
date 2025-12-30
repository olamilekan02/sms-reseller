export default function Features() {
  return (
    <section id="features" className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Features
        </h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Everything you need to verify numbers instantly and securely
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900">Instant Numbers</h3>
            <p className="mt-2 text-gray-600">
              Get numbers instantly from multiple countries for immediate use.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900">Wallet Integration</h3>
            <p className="mt-2 text-gray-600">
              Pay securely from your wallet for rental or permanent purchases.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-gray-900">Reliable SMS</h3>
            <p className="mt-2 text-gray-600">
              Receive OTP and verification messages instantly without delay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
