import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, ShieldCheck, FileText, AlertTriangle } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-[#8B5CF6] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-purple-100 shadow-sm space-y-6 text-sm text-stone-600 leading-relaxed">
          <div className="flex items-center space-x-3 text-[#8B5CF6] pb-4 border-b border-purple-100">
            <ShieldCheck className="w-6 h-6" />
            <h1 className="text-3xl font-display font-bold text-[#191816]">
              Privacy & Data Policy
            </h1>
          </div>

          <p>
            At CatZone.in, we hold customer privacy with the utmost confidentiality. This policy explains how we collect, handle, and protect your information when engaging with our cattery concierge services.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            1. Information Collection
          </h3>
          <p>
            We only collect personal information that you deliberately provide — including your name, contact phone number (+91 82708 98054), email address (support@catzone.in), city of residence, and pedigree preferences when using our WhatsApp concierge checkout or enquiry forms.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            2. Purpose of Processing
          </h3>
          <p>
            Your details are used exclusively to process your companion purchase request, verify veterinary paperwork, coordinate temperature-controlled transit, and provide ongoing feline nutritional guidance.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            3. Zero Third-Party Sharing
          </h3>
          <p>
            CatZone will never sell, rent, or commercialize your personal contact details to external marketing agencies or third parties. All communication occurs strictly within our private concierge network.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            4. Microchip Registration & Ownership Records
          </h3>
          <p>
            Upon purchase finalization, the adopter&apos;s verified name and contact details are registered with the international microchip database as the legal feline guardian.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-[#8B5CF6] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-purple-100 shadow-sm space-y-6 text-sm text-stone-600 leading-relaxed">
          <div className="flex items-center space-x-3 text-[#8B5CF6] pb-4 border-b border-purple-100">
            <FileText className="w-6 h-6" />
            <h1 className="text-3xl font-display font-bold text-[#191816]">
              Terms of Sale & Guarantee
            </h1>
          </div>

          <p>
            Welcome to CatZone.in. By initiating a purchase enquiry or completing an purchase reservation through our WhatsApp concierge, you acknowledge agreement with our terms below.
          </p>

          {/* Official Disclaimer Box */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-7 space-y-4 text-stone-800">
            <div className="flex items-center space-x-2.5 text-amber-900 pb-2 border-b border-amber-200/60">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-900">
                DISCLAIMER
              </h2>
            </div>

            <p className="font-medium text-stone-800 text-sm leading-relaxed">
              CatZone is an informational platform designed to showcase available cats, provide relevant details about their breeds, age, health and availability, and connect interested individuals with the respective seller.
            </p>

            <ol className="space-y-3 pt-1 text-xs sm:text-sm text-stone-700 leading-relaxed list-none">
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-900 shrink-0 min-w-5">1.</span>
                <div>
                  <strong className="text-stone-900 font-semibold">No Direct Online Sales:</strong> CatZone does not provide an online checkout facility or directly process payments for the purchase of cats through this website.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-900 shrink-0 min-w-5">2.</span>
                <div>
                  <strong className="text-stone-900 font-semibold">Enquiry-Based Interaction:</strong> Visitors may use the contact details or WhatsApp facility provided on the website to enquire about a cat&apos;s availability and obtain further information from the seller.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-900 shrink-0 min-w-5">3.</span>
                <div>
                  <strong className="text-stone-900 font-semibold">Independent Transactions:</strong> Any discussions, arrangements, agreements or transactions relating to the purchase or transfer of a cat take place directly between the prospective buyer and the respective seller, subject to applicable laws and regulations.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-900 shrink-0 min-w-5">4.</span>
                <div>
                  <strong className="text-stone-900 font-semibold">Animal Welfare Compliance:</strong> All activities involving the breeding, keeping, offering or transfer of cats must comply with applicable Indian animal welfare laws, including the Prevention of Cruelty to Animals Act, 1960 and the Prevention of Cruelty to Animals (Pet Shop) Rules, 2018.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-900 shrink-0 min-w-5">5.</span>
                <div>
                  <strong className="text-stone-900 font-semibold">Responsible Ownership:</strong> Prospective owners are encouraged to verify the cat&apos;s health condition, vaccination history, veterinary records and other relevant information before proceeding with any arrangement.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-900 shrink-0 min-w-5">6.</span>
                <div>
                  <strong className="text-stone-900 font-semibold">No Guarantee of Availability:</strong> The availability, health details and other information displayed on the website are subject to confirmation by the respective seller.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="font-bold text-amber-900 shrink-0 min-w-5">7.</span>
                <div>
                  <strong className="text-stone-900 font-semibold">No Animal Shipping Without Compliance:</strong> Any transportation or transfer of animals must be arranged responsibly and in accordance with applicable animal welfare and transportation requirements.
                </div>
              </li>
            </ol>
          </div>

          <h3 className="text-base font-display font-bold text-[#191816]">
            1. Pedigree Authenticity & Lineage
          </h3>
          <p>
            All pedigree kittens cataloged on CatZone are bred under recognized WCF or TICA ethical protocols. Lineage documentation and certified pedigree papers are handed over upon full purchase clearance.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            2. Availability & Real-Time Status
          </h3>
          <p>
            Because our companions are unique living individuals, companion availability is strictly confirmed in real-time by the concierge. If a cat is marked &ldquo;Sold Out&rdquo; or reserved before final deposit, CatZone will suggest alternative companions or prioritize the adopter for subsequent litters.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            3. Health Warranty & Veterinary Protocol
          </h3>
          <p>
            Every cat leaves our cattery fully vet-inspected, vaccinated according to age, microchipped, and dewormed. Adopters are entitled to a 1-year hereditary health warranty covering certified congenital defects.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            4. Ethical Home Commitment
          </h3>
          <p>
            CatZone retains the right to politely decline a sale if the adopter cannot provide an indoor-safe, nurturing, and responsible living environment.
          </p>
        </div>
      </div>
    </div>
  );
};
