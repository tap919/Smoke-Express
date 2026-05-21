import React, { useState } from 'react';
import { ShieldCheck, LogOut, ArrowRight, ShieldAlert } from 'lucide-react';

interface AgeGateProps {
  onVerify: () => void;
}

export default function AgeGate({ onVerify }: AgeGateProps) {
  const [denied, setDenied] = useState(false);
  const [checkbox, setCheckbox] = useState(false);

  const handleVerify = () => {
    if (!checkbox) return;
    onVerify();
  };

  if (denied) {
    return (
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90"
        id="age-gate-denied"
      >
        <div className="max-w-md w-full bg-[#080808] border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-950/20 border border-red-500/40 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-serif italic text-white tracking-tight mb-3">
            Access Restricted
          </h1>
          <p className="text-sm text-[#e0e0e0]/70 mb-6 leading-relaxed">
            Due to strict North Carolina and federal tobacco compliance mandates, you must be 21 years of age or older to purchase products from Northside partner smoke shops. We verify IDs at the door upon delivery.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setDenied(false)}
              className="w-full py-3 bg-[#151515] hover:bg-[#1a1a1a] text-[#e0e0e0]/80 font-medium text-sm rounded-xl border border-white/5 transition"
            >
              Go Back
            </button>
            <a
              href="https://www.google.com"
              className="text-center text-xs text-[#bfa181]/70 hover:text-[#bfa181] underline py-2 transition"
            >
              Exit to google.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050505]/95 backdrop-blur-md"
      id="age-gate-primary"
    >
      <div className="max-w-lg w-full bg-[#080808] border border-white/10 rounded-3xl p-8 md:p-10 text-center shadow-2xl relative overflow-hidden">
        {/* Subtle decorative gold top lightbar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-gold/40 via-accent-gold to-accent-gold/40" />

        <div className="w-16 h-16 bg-accent-gold/5 border border-accent-gold/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-8 h-8 text-accent-gold" />
        </div>

        <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold border border-accent-gold/20 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold">
          Age Compliance Secure Gate
        </span>

        <h1 className="text-4xl font-serif italic text-white tracking-tight mt-5 mb-3">
          Northside Smoke
        </h1>

        <p className="text-xs text-[#e0e0e0]/70 mb-6 leading-relaxed px-2">
          Welcome to Northside's premium 3rd party carbon-neutral smoke delivery network. 
          <strong className="text-white block mt-2 text-sm">
            Products on this platform require you to be 21+ years of age.
          </strong> 
          Recipient must present physical government-issued identity verification to the 3rd-party delivery courier matching the order name. No exceptions under state law.
        </p>

        {/* Checkbox confirmation */}
        <label className="flex items-start gap-3 text-left bg-[#151515] border border-white/5 p-4 rounded-xl cursor-pointer hover:bg-[#1a1a1a] transition mb-6">
          <input
            type="checkbox"
            checked={checkbox}
            onChange={(e) => setCheckbox(e.target.checked)}
            className="mt-1 w-5 h-5 accent-accent-gold rounded border-white/10 bg-[#050505]"
          />
          <div className="text-xs text-[#e0e0e0]/70 leading-normal select-none">
            I certify under penalty of perjury that I am <strong className="text-white font-medium">at least 21 years of age</strong>, and I authorize Northside Smoke to verify my physical identification card credentials at point of delivery.
          </div>
        </label>

        <div className="flex gap-3">
          <button
            onClick={() => setDenied(true)}
            className="flex-1 py-3 bg-[#151515] hover:bg-[#1a1a1a] text-[#e0e0e0]/80 font-medium text-sm rounded-xl border border-white/5 transition flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Under 21
          </button>
          <button
            disabled={!checkbox}
            onClick={handleVerify}
            className={`flex-1 py-3 font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-1.5 ${
              checkbox
                ? 'bg-accent-gold text-black shadow-lg shadow-accent-gold/20 hover:brightness-110'
                : 'bg-[#151515] text-white/25 cursor-not-allowed border border-white/5'
            }`}
          >
            I am 21+
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-8 text-[9px] text-[#e0e0e0]/30 font-mono tracking-wider">
          COURIER VERIFICATION PLATFORM v2.1 • NC TOBACCO COMPLIANCE METADATA
        </div>
      </div>
    </div>
  );
}
