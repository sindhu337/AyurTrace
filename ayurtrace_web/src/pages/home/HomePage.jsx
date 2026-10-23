import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Leaf, Shield, Globe, Zap, ChevronRight, Menu, X,
  Microscope, TreePine, Factory, Users, QrCode, BarChart3,
  CheckCircle, ArrowRight, Lock, LogIn, UserPlus
} from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [authAction, setAuthAction] = useState(null)

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-ayur-100 bg-[#fffdf7]/95 shadow-sm backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-[4.25rem] items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ayur-800">
                <Leaf className="h-6 w-6 text-herb-200" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-ayur-900">AYURTRACE</span>
            </div>

            <div className="hidden items-center gap-8 text-sm font-semibold text-gray-700 lg:flex">
              <a href="#" className="border-b-2 border-ayur-700 pb-1 text-ayur-800">Home</a>
              <a href="#about" className="transition hover:text-ayur-700">About</a>
              <a href="#features" className="transition hover:text-ayur-700">Traceability</a>
              <a href="#how-it-works" className="transition hover:text-ayur-700">Herbs</a>
              <a href="#contact" className="transition hover:text-ayur-700">Contact</a>
              <button
                onClick={() => document.getElementById('trace')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 rounded-xl bg-herb-400 px-5 py-3 text-ayur-950 shadow-sm transition hover:bg-herb-300"
              >
                <QrCode className="h-4 w-4" /> Quick Trace
              </button>
            </div>
            <button
              className="rounded-lg p-2 text-gray-700 transition hover:bg-ayur-50 lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Sliding Navigation Drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop Blur Overlay */}
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer Body */}
            <div className="relative w-80 max-w-full h-full bg-white shadow-2xl flex flex-col justify-between p-6 transform transition-transform duration-300 ease-out z-10 animate-in slide-in-from-right">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-ayur-700 rounded-lg flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-extrabold text-ayur-800 text-lg tracking-tight">AYURTRACE</span>
                  </div>
                  <button 
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="mt-8 space-y-6">
                  <a 
                    href="#" 
                    className="flex items-center gap-3 text-gray-700 hover:text-ayur-700 font-semibold transition-colors py-2 border-b border-gray-50/50"
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </a>
                  <a 
                    href="#about" 
                    className="flex items-center gap-3 text-gray-700 hover:text-ayur-700 font-semibold transition-colors py-2 border-b border-gray-50/50"
                    onClick={() => setMenuOpen(false)}
                  >
                    About AYURTRACE
                  </a>

                  {/* Manufacturer Section */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Manufacturer Portal</p>
                    <div className="space-y-3 pl-1">
                      <Link 
                        to="/manufacturer/login" 
                        className="block text-sm text-gray-600 hover:text-ayur-700 font-semibold transition-colors py-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        MANUFACTURER LOGIN
                      </Link>
                      <Link 
                        to="/manufacturer/register" 
                        className="block text-sm text-gray-600 hover:text-ayur-700 font-semibold transition-colors py-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        REGISTER AS MANUFACTURER
                      </Link>
                    </div>
                  </div>

                  {/* Admin Section */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Administration</p>
                    <div className="space-y-3 pl-1">
                      <Link 
                        to="/admin/login" 
                        className="block text-sm text-gray-600 hover:text-ayur-700 font-semibold transition-colors py-1"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
                © 2026 AYURTRACE. All rights reserved.
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #063b27 0%, #12643b 48%, #326f36 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 right-1/3 w-64 h-64 rounded-full bg-herb-500/20" />
          <div className="absolute -bottom-32 left-1/4 h-80 w-[38rem] rounded-[50%] bg-[#5b8730]/40 blur-sm" />
          <div className="absolute -bottom-40 right-[-8rem] h-96 w-96 rounded-full bg-[#d0a741]/20 blur-3xl" />
          <div className="absolute left-[-3rem] top-24 h-48 w-48 rounded-full border-[2rem] border-[#8db45d]/20 blur-sm" />
          <div className="absolute right-10 top-10 text-7xl opacity-20">🌿</div>
          <div className="absolute bottom-6 right-8 text-8xl opacity-30">🌿</div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium text-ayur-100 mb-6 border border-white/20">
                <Zap className="w-3.5 h-3.5 text-herb-300" />
                Blockchain-Powered Traceability
              </div>
              <h1 className="mb-6 text-5xl font-extrabold leading-[0.95] sm:text-6xl lg:text-7xl">
                AYURTRACE
                <span className="mt-4 block font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                  From Farm to <span className="text-herb-300">Formulation</span>
                </span>
              </h1>
              <div className="mb-5 h-1 w-12 bg-herb-300" />
              <p className="mb-8 max-w-xl text-lg leading-relaxed text-ayur-100">
                Blockchain-Based Geo-Tagged Traceability System for Ayurvedic Medicinal Herbs.
                Ensuring authenticity, purity, and transparency across the entire supply chain.
              </p>
              {authAction === null ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setAuthAction('login')}
                    className="group btn-primary bg-herb-500 hover:bg-herb-400 text-ayur-950 flex items-center justify-center gap-2 text-base py-3 px-7 shadow-lg shadow-herb-900/20"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button
                    onClick={() => setAuthAction('register')}
                    className="group bg-white/10 hover:bg-white/20 border border-white/35 text-white font-semibold py-3 px-7 rounded-lg transition-all text-base flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    Register
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              ) : (
                <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-base font-bold text-white">
                      {authAction === 'login' ? 'Login as' : 'Register as'}
                    </p>
                    <button
                      onClick={() => setAuthAction(null)}
                      className="rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                      aria-label="Back to login and register options"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {authAction === 'login' ? (
                      <>
                        <button
                          onClick={() => navigate('/admin/login')}
                          className="group flex items-center justify-between rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-left text-white transition hover:bg-white/20"
                        >
                          <span className="flex items-center gap-3">
                            <Shield className="h-5 w-5 text-herb-300" />
                            <span className="font-semibold">Admin Login</span>
                          </span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                          onClick={() => navigate('/manufacturer/login')}
                          className="group flex items-center justify-between rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-left text-white transition hover:bg-white/20"
                        >
                          <span className="flex items-center gap-3">
                            <Factory className="h-5 w-5 text-herb-300" />
                            <span className="font-semibold">Manufacturer Login</span>
                          </span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled
                          title="Admin registration is managed by the system"
                          className="flex cursor-not-allowed items-center gap-3 rounded-xl border border-white/15 bg-black/10 px-4 py-3 text-left text-white/50"
                        >
                          <Shield className="h-5 w-5" />
                          <span>
                            <span className="block font-semibold">Register as Admin</span>
                            <span className="block text-xs text-white/40">Managed by the system</span>
                          </span>
                        </button>
                        <button
                          onClick={() => navigate('/manufacturer/register')}
                          className="group flex items-center justify-between rounded-xl border border-herb-300/50 bg-herb-500 px-4 py-3 text-left text-ayur-950 transition hover:bg-herb-400"
                        >
                          <span className="flex items-center gap-3">
                            <UserPlus className="h-5 w-5" />
                            <span className="font-semibold">Register as Manufacturer</span>
                          </span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Welcome message */}
            <div className="hidden justify-center lg:flex">
              <div className="relative w-full max-w-md rounded-3xl border border-white/50 bg-[#f4f5dc]/75 p-10 text-center text-ayur-950 shadow-2xl backdrop-blur-md">
                <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-herb-400/20 blur-2xl" />
                <div className="absolute -bottom-8 -left-5 h-28 w-28 rounded-full bg-ayur-400/20 blur-2xl" />
                <div className="relative">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-herb-300/40 bg-herb-300/15">
                    <Leaf className="h-10 w-10 text-ayur-700" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ayur-950">
                    Every herb has a story.
                  </p>
                  <p className="mt-1 text-2xl font-bold leading-snug text-ayur-950">
                    <span className="block text-ayur-700">We help you verify it.</span>
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ayur-900">
                    Secure, transparent, and trusted traceability from cultivation to formulation.
                  </p>
                  <div className="mt-8 grid grid-cols-3 gap-2 border-t border-ayur-800/20 pt-6 text-xs font-semibold text-ayur-900">
                    <span><Leaf className="mx-auto mb-2 h-6 w-6 text-ayur-700" />Cultivation</span>
                    <span><Factory className="mx-auto mb-2 h-6 w-6 text-ayur-700" />Processing</span>
                    <span><Shield className="mx-auto mb-2 h-6 w-6 text-ayur-700" />Verification</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────── */}
      <section id="trace" className="relative overflow-hidden rounded-t-[2rem] bg-[#f4f6e8] text-ayur-950 shadow-[0_-8px_25px_rgba(15,70,37,0.12)]">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-7 sm:grid-cols-4 sm:gap-6">
          {[
            { value: '100%', label: 'Traceable Supply Chain', icon: Leaf },
            { value: 'BCrypt', label: 'Secure Authentication', icon: Lock },
            { value: 'QR',    label: 'Instant Product Scan', icon: QrCode },
            { value: 'GPS',   label: 'Geo-Tagged Cultivation', icon: Globe },
          ].map(({ value, label, icon: Icon }) => (
            <div key={label} className="flex items-center justify-center gap-3 border-ayur-800/15 text-center sm:border-r last:border-0">
              <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-[#dceacb] sm:flex">
                <Icon className="h-6 w-6 text-ayur-800" />
              </div>
              <div>
                <div className="text-2xl font-bold text-ayur-950">{value}</div>
                <div className="mt-1 text-xs text-ayur-800">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ──────────────────────────────────────────────────── */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image placeholder */}
            <div className="relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-ayur-100 to-herb-100 flex items-center justify-center">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-ayur-700 rounded-full flex items-center justify-center">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                </div>
                <p className="text-ayur-700 font-bold text-lg">Ayurvedic Herbs</p>
                <p className="text-ayur-500 text-sm mt-1">Ashwagandha · Tulsi · Neem · Brahmi</p>
              </div>
              {/* Corner badges */}
              <div className="absolute top-4 right-4 bg-ayur-700 text-white text-xs font-semibold px-3 py-1 rounded-full">Organic</div>
              <div className="absolute bottom-4 left-4 bg-herb-500 text-white text-xs font-semibold px-3 py-1 rounded-full">GPS Verified</div>
            </div>

            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 text-ayur-700 text-sm font-semibold mb-3">
                <Leaf className="w-4 h-4" /> About AYURTRACE
              </div>
              <h2 className="text-3xl font-extrabold text-gray-800 mb-5">
                Tracing Every Herb from
                <span className="text-ayur-700"> Soil to Shelf</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                AYURTRACE is a blockchain-based geo-tagged traceability system designed specifically
                for Ayurvedic medicinal herbs. Our platform creates an unbreakable chain of trust
                from the moment a farmer plants a herb to when a customer receives the final product.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Farmers log geo-tagged cultivation details. Manufacturers process approved batches
                into certified Ayurvedic products. Customers scan a QR code and instantly see the
                complete provenance — farm location, cultivation method, harvest date, batch details,
                and manufacturer information.
              </p>
              <div className="space-y-3">
                {[
                  'Complete supply chain transparency',
                  'Blockchain-based immutable records',
                  'GPS geo-tagged herb cultivation',
                  'AYUSH-compliant manufacturer verification',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-ayur-600 shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-ayur-700 text-sm font-semibold mb-3">
              <Zap className="w-4 h-4" /> Platform Features
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              Everything You Need for Verified Ayurveda
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
              A complete ecosystem connecting farmers, manufacturers, and customers with full traceability.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TreePine,    color: 'bg-ayur-50 text-ayur-700',
                title: 'Farmer Management',
                desc: 'Geo-tagged cultivation records, batch creation, and admin-approved farmer IDs (FARM000001).',
              },
              {
                icon: Factory,     color: 'bg-herb-50 text-herb-700',
                title: 'Manufacturer Portal',
                desc: 'AYUSH-verified manufacturers manage products, batches, orders, and QR codes from one dashboard.',
              },
              {
                icon: QrCode,      color: 'bg-blue-50 text-blue-700',
                title: 'QR Traceability',
                desc: 'Each product gets a unique AYR-QR code. Customers scan it to see the complete provenance chain.',
              },
              {
                icon: Shield,      color: 'bg-purple-50 text-purple-700',
                title: 'Admin Oversight',
                desc: 'Dedicated admin panel for approving farmers and manufacturers, with complete application review.',
              },
              {
                icon: Globe,       color: 'bg-orange-50 text-orange-700',
                title: 'GPS Geo-Tagging',
                desc: 'Every cultivation plot is geo-tagged with precise GPS coordinates stored on the blockchain.',
              },
              {
                icon: BarChart3,   color: 'bg-pink-50 text-pink-700',
                title: 'Analytics & Reports',
                desc: 'Manufacturers get real-time analytics on batches, products, orders, and sales trends.',
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="card hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 text-ayur-700 text-sm font-semibold mb-3">
              <GitBranchIcon /> How It Works
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              The Complete Traceability Journey
            </h2>
          </div>

          <div className="relative">
            {/* Connector line */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-ayur-200 via-herb-300 to-ayur-200" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { step: '01', icon: TreePine,  title: 'Farmer Registers',      desc: 'Geo-tagged cultivation & batch creation', color: 'bg-ayur-700' },
                { step: '02', icon: Shield,    title: 'Admin Approves',         desc: 'FARM000001 ID generated on approval',     color: 'bg-ayur-600' },
                { step: '03', icon: Factory,   title: 'Manufacturer Processes', desc: 'Batch received, product manufactured',   color: 'bg-herb-600' },
                { step: '04', icon: QrCode,    title: 'QR Code Generated',      desc: 'AYR-QR linked to product & batch',       color: 'bg-herb-500' },
                { step: '05', icon: Users,     title: 'Customer Scans',         desc: 'Complete provenance visible instantly',   color: 'bg-ayur-500' },
              ].map(({ step, icon: Icon, title, desc, color }) => (
                <div key={step} className="flex flex-col items-center text-center">
                  <div className={`relative w-20 h-20 ${color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-ayur-800">
                      {step}
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-ayur-800 to-ayur-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Join the AYURTRACE Ecosystem?</h2>
          <p className="text-ayur-200 mb-8 text-lg">
            Register your manufacturing company and get verified by AYUSH-certified administrators.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/manufacturer/register')}
              className="bg-herb-500 hover:bg-herb-600 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Register as Manufacturer <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/manufacturer/login')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Already Registered? Login
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-ayur-900 text-ayur-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-ayur-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">AYURTRACE</span>
            </div>
            <p className="text-xs text-ayur-400 text-center">
              Blockchain-Based Geo-Tagged Traceability System for Ayurvedic Medicinal Herbs
            </p>
            <div className="flex items-center gap-4 text-xs">
              <Link to="/manufacturer/login"   className="hover:text-white transition-colors">Manufacturer Login</Link>
              <Link to="/admin/login"          className="hover:text-white transition-colors">Admin</Link>
              <Link to="/manufacturer/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-ayur-800 text-center text-xs text-ayur-500">
            © 2026 AYURTRACE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// Inline micro icon to avoid extra import
function GitBranchIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0a3 3 0 100 6 3 3 0 000-6zm0 0h6a3 3 0 003-3V9a3 3 0 00-3-3h-2" />
    </svg>
  )
}
