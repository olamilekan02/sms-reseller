import { useState } from "react";

const faqData = [
  {
    question: "What is LARRYSMS?",
    answer:
      "LARRYSMS is a virtual SMS number provider that allows you to receive OTP and verification codes instantly without a physical SIM.",
  },
  {
    question: "How fast will I receive SMS?",
    answer:
      "SMS and OTP codes are delivered within seconds using our high-speed network infrastructure.",
  },
  {
    question: "Which apps are supported?",
    answer:
      "LARRYSMS supports WhatsApp, Telegram, Facebook, Instagram, Google, and many other platforms.",
  },
  {
    question: "Do you provide API access?",
    answer:
      "Yes. LARRYSMS provides API access for developers and businesses to automate SMS verification.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cryptocurrency. All payments are secure and encrypted.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Answers to common questions about LARRYSMS SMS and OTP services.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex justify-between items-center px-6 py-5 text-left font-semibold bg-purple-50 hover:bg-purple-100"
              >
                {item.question}
                <span
                  className={`transform transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden px-6 text-gray-700 ${
                  openIndex === index ? "max-h-96 py-4" : "max-h-0"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
