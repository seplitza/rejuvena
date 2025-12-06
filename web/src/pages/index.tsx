import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import LanguageSelector from '../components/common/LanguageSelector';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>FaceLift Naturally - Natural Face Rejuvenation</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
        {/* Language Selector in top right */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageSelector />
        </div>
        
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              FaceLift Naturally
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Preserve attractiveness and reverse age-related changes in the face and posture with our proven natural rejuvenation method.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/auth/login"
                className="px-8 py-4 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700 transition"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup"
                className="px-8 py-4 bg-white text-pink-600 border-2 border-pink-600 rounded-lg font-semibold hover:bg-pink-50 transition"
              >
                Get Started
              </Link>
              <button 
                onClick={() => router.push('/guest')}
                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Try as Guest
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-3">Natural Exercises</h3>
              <p className="text-gray-600">
                Face and posture exercises proven to work over 5 years by our specialists.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Targeted Results</h3>
              <p className="text-gray-600">
                Address wrinkles, sagging, double chin, and other age-related concerns effectively.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold mb-3">20 Minutes a Day</h3>
              <p className="text-gray-600">
                Less time than any surgery or cosmetic treatment, from the comfort of your home.
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16 bg-white rounded-2xl p-12 shadow-sm">
            <h2 className="text-3xl font-bold text-center mb-8">Why Choose Natural Rejuvenation?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">No Surgery Required</h4>
                  <p className="text-gray-600">Achieve results without scars, procedures, or downtime.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">Proven Method</h4>
                  <p className="text-gray-600">Over 30,000 practitioners have enhanced their appearance.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">Better Than Face Yoga</h4>
                  <p className="text-gray-600">Deep muscle anatomy work and posture adjustment.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">✓</span>
                <div>
                  <h4 className="font-semibold mb-1">Natural Alternative</h4>
                  <p className="text-gray-600">Avoid Botox and fillers with our relaxation-based approach.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
