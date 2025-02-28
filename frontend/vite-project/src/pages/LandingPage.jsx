import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from "lottie-react";
import animationData from "../assets/FrontPageAnimation.json";
import fileSave from "../assets/FileSaving.json";
import collaborationLottie from "../assets/CollaborationLottie.json";
import versionHistory from "../assets/VersionHistory.json";

export default function LandingPage() {
  const pricingPlans = [
    {
      name: 'Free',
      price: '0',
      features: [
        'Up to 50 documents',
        'Basic collaboration',
        '2GB storage',
        'Real-time editing',
        'Basic support'
      ],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: '9',
      popular: true,
      features: [
        'Unlimited documents',
        'Advanced collaboration',
        '10GB storage',
        'Version history',
        'Priority support',
        'Custom templates'
      ],
      cta: 'Go Pro'
    },
    {
      name: 'Enterprise',
      price: '29',
      features: [
        'Unlimited workspaces',
        'SSO & SAML',
        '100GB storage',
        'Dedicated support',
        'Custom branding',
        'Advanced analytics'
      ],
      cta: 'Contact Sales'
    }
  ];

  const faqItems = [
    {
      question: 'Is my data secure?',
      answer: 'Yes, all documents are encrypted both in transit and at rest. We use industry-standard security protocols.'
    },
    {
      question: 'Can I use SyncScript offline?',
      answer: 'Currently we require an internet connection for real-time collaboration, but offline mode is coming soon.'
    },
    {
      question: 'How many collaborators can I invite?',
      answer: 'Unlimited collaborators on all plans. Only document limits vary between plans.'
    },
    {
      question: 'What file formats do you support?',
      answer: 'Export to PDF, DOCX, and Markdown. More formats coming soon.'
    }
  ];

  return (
    <div className="min-h-screen w-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="fixed w-full z-50 px-4 py-3 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ rotate: 360, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <svg className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </motion.div>
              <span className="text-4xl font-bold py-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                SyncScript
              </span>
            </div>
            <div className="hidden md:flex space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-200">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-200">Pricing</a>
              <a href="#faq" className="text-gray-300 hover:text-white transition-colors duration-200">FAQ</a>
            </div>
          </div>
          <div className="flex space-x-3">
            <Link
              to="/auth"
              className="px-6 py-2.5 border border-gray-700 text-gray-300 rounded-xl hover:border-blue-500 hover:text-white transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link
              to="/auth"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 leading-tight">
                The Future of Writing is Here. Collaborate. Create. Connect.
              </h1>
              <p className="mt-6 text-xl text-gray-300 max-w-2xl">
                Experience seamless co-editing with our powerful online text editor. Invite collaborators, track changes, and bring your ideas to life in real-time.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="/app" className="px-8 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  Start Writing Now
                </a>
                <a href="#pricing" className="px-8 py-4 border border-gray-700 text-gray-300 font-medium rounded-lg hover:border-blue-500 hover:text-white transition-colors duration-200">
                  View Pricing
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative hidden lg:block"
            >
              <Lottie animationData={animationData} loop={true} className="w-full h-full" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center justify-center bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Powerful Features to Boost Your Productivity
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/40 transition-shadow duration-300"
            >
              <div className="flex items-center justify-center bg-blue-500 p-4 rounded-full w-44 h-44 mx-auto mb-4">
                <Lottie animationData={collaborationLottie} loop={true} className="w-11/8 h-11/8" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Real-Time Collaboration</h3>
              <p>Work together seamlessly, edit simultaneously, and see changes in real-time.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/40 transition-shadow duration-300"
            >
              <div className="flex items-center justify-center p-4 rounded-full w-44 h-44 mx-auto mb-4">
                <Lottie animationData={fileSave} loop={true} className="w-full h-full scale-150" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Auto-Save</h3>
              <p>Your work is automatically saved, ensuring you never lose progress.</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/40 transition-shadow duration-300"
            >
              <div className="flex items-center justify-center bg-gray-200 p-4 rounded-full w-44 h-44 mx-auto mb-4">
                <Lottie animationData={versionHistory} loop={true} className="w-full h-full scale-120" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Version History</h3>
              <p>Track document changes and restore previous versions anytime.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="min-h-screen flex items-center justify-center bg-gray-800 py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Pricing</h2>
            <p className="text-lg text-gray-400">Choose the plan that works best for you or your team</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className={`relative bg-gray-900 p-8 rounded-2xl border ${
                  plan.popular
                    ? 'border-blue-600 shadow-2xl shadow-blue-900/30'
                    : 'border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 -translate-y-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-white mb-6">
                  ${plan.price}<span className="text-xl text-gray-400">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-gray-300">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className={`w-full block text-center py-3 rounded-lg font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-white'
                  }`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="min-h-screen flex items-center justify-center bg-gray-900 py-16 pt-28">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400">Find answers to common questions about SyncScript</p>
          </div>
          <div className="space-y-6 max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="border border-gray-800 rounded-xl p-6 bg-gray-800/30"
              >
                <h3 className="text-lg font-medium text-white">{item.question}</h3>
                <p className="mt-2 text-gray-400">{item.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="ml-2 text-xl font-bold text-white">SyncScript</span>
            </div>
            <p className="text-gray-400 text-sm mt-4 md:mt-0">© 2025 SyncScript. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}