"use client";

import { useState } from "react";
import Link from "next/link";

const UPI_ID = "raghavmalviya93@oksbi";

const plans = [
  {
    name: "Free",
    price: "$0",
    priceINR: "Free",
    period: "forever",
    color: "text-muted",
    features: [
      "3 food scans per day",
      "5 AI chat messages per day",
      "Basic nutrition breakdown",
      "7-day food history",
    ],
    current: true,
  },
  {
    name: "Plus",
    price: "$5",
    priceINR: "399",
    period: "/month",
    color: "text-primary",
    bgAccent: "bg-primary-light",
    borderAccent: "border-primary/20",
    features: [
      "20 food scans per day",
      "50 AI chat messages per day",
      "Full bacteria & pathogen analysis",
      "Vitamin & mineral breakdown",
      "90-day food history",
      "Priority AI responses",
    ],
    popular: true,
    tier: "plus",
  },
  {
    name: "Pro",
    price: "$15",
    priceINR: "999",
    period: "/month",
    color: "text-purple",
    bgAccent: "bg-purple-light",
    borderAccent: "border-purple/20",
    features: [
      "Unlimited food scans",
      "Unlimited AI chat",
      "Full bacteria & pathogen analysis",
      "Personalized weekly reports",
      "Unlimited food history",
      "Advanced diet recommendations",
      "Priority support",
    ],
    tier: "pro",
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [txnId, setTxnId] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!txnId.trim() || !selectedPlan) return;
    // In future: save to Supabase for admin to verify
    setSubmitted(true);
  };

  return (
    <main className="max-w-lg mx-auto px-5 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="text-text-secondary hover:text-text transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-text">Choose Your Plan</h1>
          <p className="text-xs text-text-secondary">
            Unlock more scans, deeper analysis &amp; personalized advice
          </p>
        </div>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-5 card-shadow ${
              plan.popular
                ? `${plan.bgAccent} border ${plan.borderAccent}`
                : "bg-surface border border-border"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <div className="flex items-baseline justify-between mb-3">
              <h3 className={`text-lg font-bold ${plan.color}`}>
                {plan.name}
              </h3>
              <div className="text-right">
                {plan.current ? (
                  <span className="text-lg font-bold text-muted">Free</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold text-text">
                      {plan.priceINR}
                    </span>
                    <span className="text-sm text-muted"> INR{plan.period}</span>
                  </>
                )}
              </div>
            </div>

            <ul className="space-y-1.5 mb-4">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                  <svg className={`w-4 h-4 shrink-0 ${plan.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>

            {plan.current ? (
              <div className="w-full py-2.5 rounded-xl text-sm font-medium text-center bg-surface-hover text-muted">
                Current Plan
              </div>
            ) : (
              <button
                onClick={() => setSelectedPlan(plan.tier!)}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all active:scale-[0.98] ${
                  plan.name === "Plus"
                    ? "bg-primary text-white hover:bg-primary-dark glow-green"
                    : "bg-purple text-white hover:opacity-90"
                }`}
              >
                Upgrade to {plan.name}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedPlan && !submitted && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedPlan(null)}
          />
          <div className="relative w-full max-w-sm bg-surface rounded-t-3xl sm:rounded-2xl p-6 card-shadow-lg animate-slide-up mx-4">
            <h3 className="text-lg font-bold text-text mb-1">
              Pay via UPI
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              {selectedPlan === "plus" ? "Plus — 399 INR/month" : "Pro — 999 INR/month"}
            </p>

            {/* UPI ID */}
            <div className="bg-primary-light rounded-xl p-4 mb-4 text-center">
              <p className="text-xs text-text-secondary mb-1">Send payment to UPI ID</p>
              <p className="text-lg font-bold text-primary select-all">{UPI_ID}</p>
              <button
                onClick={() => navigator.clipboard.writeText(UPI_ID)}
                className="text-xs text-primary mt-1 hover:underline"
              >
                Copy UPI ID
              </button>
            </div>

            {/* Pay button for mobile */}
            <a
              href={`upi://pay?pa=${UPI_ID}&pn=GutSense&am=${selectedPlan === "plus" ? "399" : "999"}&cu=INR&tn=GutSense ${selectedPlan} subscription`}
              className="block w-full py-3 rounded-xl bg-primary text-white text-center font-semibold mb-4 hover:bg-primary-dark transition-colors"
            >
              Pay with UPI App
            </a>

            {/* Transaction ID */}
            <div className="space-y-2">
              <p className="text-xs text-muted">
                After payment, enter your UPI transaction/reference ID:
              </p>
              <input
                type="text"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                placeholder="e.g. 412345678901"
                className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
              />
              <button
                onClick={handlePaymentSubmit}
                disabled={!txnId.trim()}
                className="w-full py-2.5 rounded-xl bg-text text-surface font-semibold text-sm disabled:opacity-30 hover:opacity-90 transition-all"
              >
                Submit &amp; Activate
              </button>
            </div>

            <button
              onClick={() => setSelectedPlan(null)}
              className="w-full text-center text-xs text-muted mt-3 hover:text-text"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative bg-surface rounded-2xl p-8 card-shadow-lg text-center mx-4 animate-slide-up">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-text mb-1">Payment Submitted!</h3>
            <p className="text-sm text-text-secondary mb-4">
              Your account will be upgraded within 24 hours once payment is verified.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-muted mt-6">
        Cancel anytime by contacting support.
      </p>
    </main>
  );
}
