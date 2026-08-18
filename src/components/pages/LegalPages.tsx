import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

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
            We only collect personal information that you deliberately provide — including your name, contact phone number (+91 95852 62522), email address (support@catzone.in), city of residence, and pedigree preferences when using our WhatsApp concierge checkout or enquiry forms.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            2. Purpose of Processing
          </h3>
          <p>
            Your details are used exclusively to process your companion adoption request, verify veterinary paperwork, coordinate temperature-controlled transit, and provide ongoing feline nutritional guidance.
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
            Upon adoption finalization, the adopter&apos;s verified name and contact details are registered with the international microchip database as the legal feline guardian.
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
              Terms of Adoption & Guarantee
            </h1>
          </div>

          <p>
            Welcome to CatZone.in. By initiating a purchase enquiry or completing an adoption reservation through our WhatsApp concierge, you acknowledge agreement with our terms below.
          </p>

          <h3 className="text-base font-display font-bold text-[#191816]">
            1. Pedigree Authenticity & Lineage
          </h3>
          <p>
            All pedigree kittens cataloged on CatZone are bred under recognized WCF or TICA ethical protocols. Lineage documentation and certified pedigree papers are handed over upon full adoption clearance.
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
            CatZone retains the right to politely decline an adoption if the adopter cannot provide an indoor-safe, nurturing, and responsible living environment.
          </p>
        </div>
      </div>
    </div>
  );
};
