'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Search, 
  Compass, 
  ShieldCheck, 
  Bell, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  Briefcase, 
  Layers, 
  CalendarCheck,
  CheckCircle2,
  ArrowLeftRight,
  Sparkles,
  Crown,
  PhoneCall,
  Globe
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, quickLogin, login, register } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState('PKR');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authRole, setAuthRole] = useState<'CUSTOMER' | 'PROVIDER'>('CUSTOMER');
  const [authBusinessName, setAuthBusinessName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        await login({ email: authEmail, password: authPassword });
      } else {
        await register({
          email: authEmail,
          password: authPassword,
          firstName: authFirstName,
          lastName: authLastName,
          role: authRole,
          businessName: authRole === 'PROVIDER' ? authBusinessName : undefined,
        });
      }
      setAuthModalOpen(false);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setAuthSubmitting(false);
    }
  };

  return (
    <>
      {/* EMIRATES-GRADE VIP CONCIERGE & DEMO PERSONA TOP BAR - LIGHT LUXURY */}
      <div className="bg-[#f5f2eb] text-slate-700 text-xs py-1.5 px-3 sm:px-6 border-b border-gold-400/25 w-full">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          
          {/* VIP Concierge Desk */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="flex items-center gap-1 text-gold-700 font-bold tracking-wider uppercase text-[10px] sm:text-[11px] font-cinzel">
              <Crown className="w-3.5 h-3.5 text-gold-600" />
              <span><span className="hidden sm:inline">Royal </span>Concierge</span>
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="hidden md:flex items-center gap-1 text-slate-600 text-[11px]">
              <PhoneCall className="w-3 h-3 text-gold-600" />
              Dispatch: <span className="text-slate-900 font-semibold">+971 4 214 4444</span>
            </span>
          </div>

          {/* Persona Switcher & Currency Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Currency selector */}
            <div className="flex items-center gap-1 bg-white border border-slate-200/90 px-1.5 sm:px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] text-slate-800 shadow-xs">
              <Globe className="w-3 h-3 text-gold-600 shrink-0" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-slate-900 font-bold focus:outline-none cursor-pointer"
              >
                <option value="PKR">PKR (₨)</option>
                <option value="USD">USD ($)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <span className="text-slate-300 hidden sm:inline">|</span>

            {/* Quick Personas */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => quickLogin('admin')}
                title="Super Admin Persona"
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide transition ${
                  user?.role === 'SUPER_ADMIN'
                    ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
                }`}
              >
                <span className="hidden sm:inline">Super </span>Admin
              </button>
              <button
                onClick={() => quickLogin('provider1')}
                title="Apex Operator Persona"
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide transition ${
                  user?.role === 'PROVIDER' && user?.email === 'apex@adventures.com'
                    ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
                }`}
              >
                Operator
              </button>
              <button
                onClick={() => quickLogin('customer1')}
                title="Sarah Customer Persona"
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-[11px] font-bold tracking-wide transition ${
                  user?.role === 'CUSTOMER' && user?.email === 'sarah@customer.com'
                    ? 'bg-gradient-to-r from-gold-500 to-amber-500 text-slate-950 font-black shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90'
                }`}
              >
                VIP
              </button>
              {user && (
                <button
                  onClick={logout}
                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition ml-0.5"
                  title="Sign out"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LUXURY HEADER - CRISP WHITE & GOLD */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
            
            {/* EMIRATES STYLE LUXURY CREST LOGO */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-0.5 shadow-sm group-hover:scale-105 transition-all duration-300 shrink-0">
                <div className="w-full h-full bg-[#080c16] rounded-[10px] flex items-center justify-center text-gold-400">
                  <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="font-cinzel text-lg sm:text-xl font-bold tracking-[0.16em] text-slate-950 flex items-center gap-1 leading-tight">
                  FARADAY
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 inline-block shrink-0" />
                </div>
                <span className="block text-[9px] sm:text-[10px] uppercase font-bold tracking-[0.25em] text-gold-700/90 -mt-0.5 font-sans truncate">
                  Royal Expeditions
                </span>
              </div>
            </Link>

            {/* LUXURY EDITORIAL NAVIGATION (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold tracking-[0.12em] uppercase text-slate-700">
              <Link 
                href="/search" 
                className="hover:text-gold-700 transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-gold-500"
              >
                <Search className="w-3.5 h-3.5 text-gold-600" />
                Explore Suites
              </Link>
              <Link 
                href="/compare" 
                className="hover:text-gold-700 transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-gold-500"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-gold-600" />
                Compare Offerings
              </Link>
              <Link 
                href="/search?destination=hunza-valley" 
                className="hover:text-gold-700 transition-colors py-1 border-b-2 border-transparent hover:border-gold-500"
              >
                Hunza Royal
              </Link>
              <Link 
                href="/search?destination=skardu-deosai" 
                className="hover:text-gold-700 transition-colors py-1 border-b-2 border-transparent hover:border-gold-500"
              >
                Skardu & Deosai
              </Link>
              <Link 
                href="/search?category=coastal-watersports" 
                className="hover:text-gold-700 transition-colors py-1 border-b-2 border-transparent hover:border-gold-500"
              >
                Astola Marine
              </Link>
              <Link 
                href="/faq" 
                className="hover:text-gold-700 transition-colors py-1 border-b-2 border-transparent hover:border-gold-500 text-slate-500"
              >
                Concierge Desk
              </Link>
            </nav>

            {/* ACTIONS & VIP ACCOUNT DROPDOWN */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 sm:p-1.5 pl-2.5 sm:pl-3.5 rounded-full border border-slate-200 hover:border-gold-400 bg-white transition shadow-xs"
                  >
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-bold text-slate-900 leading-tight">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-gold-700">
                        {user.role === 'SUPER_ADMIN' ? '👑 Fleet Admin' : user.role === 'PROVIDER' ? '🏢 Verified Operator' : '🎒 First Class Member'}
                      </div>
                    </div>
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.firstName} 
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-gold-400/50"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center font-bold text-xs">
                        {user.firstName[0]}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-0.5 sm:mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-[10px] text-gold-700 font-bold uppercase tracking-wider">Authenticated Identity</p>
                        <p className="text-xs font-semibold text-slate-900 truncate mt-0.5">{user.email}</p>
                      </div>

                      {(user.role === 'SUPER_ADMIN' || user.role === 'OPERATIONS_ADMIN') && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gold-800 font-bold hover:bg-gold-50 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-gold-600" />
                          Admin Moderation Console
                        </Link>
                      )}

                      {user.role === 'PROVIDER' && (
                        <Link
                          href="/provider/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gold-800 font-bold hover:bg-gold-50 transition"
                        >
                          <Briefcase className="w-4 h-4 text-gold-600" />
                          Operator Control Hub
                        </Link>
                      )}

                      <Link
                        href="/account/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <CalendarCheck className="w-4 h-4 text-slate-400" />
                        My Bookings & Vouchers
                      </Link>

                      <Link
                        href="/compare"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                        Compare Offerings
                      </Link>

                      <Link
                        href="/account/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        VIP Preferences & Favourites
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-semibold"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 hover:text-gold-700 px-2.5 py-1.5 transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:brightness-105 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-xs transition duration-300"
                  >
                    <span className="hidden sm:inline">Join </span>Fleet
                  </button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-5 py-4 space-y-2.5 text-xs font-bold tracking-wider uppercase text-slate-800 shadow-xl animate-in slide-in-from-top-1">
            <Link 
              href="/search" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2 py-2 text-slate-800 hover:text-gold-700 border-b border-slate-100"
            >
              <Search className="w-4 h-4 text-gold-600" />
              Explore Suites
            </Link>
            <Link 
              href="/compare" 
              onClick={() => setMobileMenuOpen(false)} 
              className="flex items-center gap-2 py-2 text-slate-800 hover:text-gold-700 border-b border-slate-100"
            >
              <ArrowLeftRight className="w-4 h-4 text-gold-600" />
              Compare Offerings
            </Link>
            <Link 
              href="/search?destination=hunza-valley" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-800 hover:text-gold-700 border-b border-slate-100"
            >
              Hunza Royal Valley
            </Link>
            <Link 
              href="/search?destination=skardu-deosai" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-800 hover:text-gold-700 border-b border-slate-100"
            >
              Skardu & Deosai Sanctuary
            </Link>
            <Link 
              href="/faq" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 text-slate-600 hover:text-gold-700 border-b border-slate-100"
            >
              Concierge Desk & FAQs
            </Link>

            {user?.role === 'PROVIDER' && (
              <Link 
                href="/provider/dashboard" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block py-2 text-gold-800 font-black border-b border-slate-100"
              >
                Operator Dashboard Hub
              </Link>
            )}

            {(user?.role === 'SUPER_ADMIN' || user?.role === 'OPERATIONS_ADMIN') && (
              <Link 
                href="/admin/dashboard" 
                onClick={() => setMobileMenuOpen(false)} 
                className="block py-2 text-gold-800 font-black border-b border-slate-100"
              >
                Admin Governance Console
              </Link>
            )}
          </div>
        )}
      </header>

      {/* LUXURY AUTH MODAL - LIGHT LUXURY */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-slate-900">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-200 text-gold-700 flex items-center justify-center mx-auto mb-2">
                <Crown className="w-6 h-6 text-gold-600" />
              </div>
              <h2 className="font-editorial text-2xl font-bold tracking-wide text-slate-950">
                {authMode === 'login' ? 'Private Client Access' : 'Create Member Account'}
              </h2>
              <p className="text-xs text-slate-500 font-light">
                {authMode === 'login'
                  ? 'Access your luxury expedition bookings and royal concierge'
                  : 'Join the premier verified travel and adventure marketplace'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={authFirstName}
                        onChange={(e) => setAuthFirstName(e.target.value)}
                        placeholder="e.g. Alistair"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 text-slate-900 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={authLastName}
                        onChange={(e) => setAuthLastName(e.target.value)}
                        placeholder="e.g. Vance"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 text-slate-900 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Account Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthRole('CUSTOMER')}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs transition ${
                          authRole === 'CUSTOMER'
                            ? 'border-gold-500 bg-gold-50 text-gold-900'
                            : 'border-slate-200 text-slate-600 bg-white'
                        }`}
                      >
                        Traveler / VIP Client
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthRole('PROVIDER')}
                        className={`py-2 px-3 rounded-xl border font-bold text-xs transition ${
                          authRole === 'PROVIDER'
                            ? 'border-gold-500 bg-gold-50 text-gold-900'
                            : 'border-slate-200 text-slate-600 bg-white'
                        }`}
                      >
                        Fleet Operator
                      </button>
                    </div>
                  </div>

                  {authRole === 'PROVIDER' && (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Business / Fleet Name</label>
                      <input
                        type="text"
                        required
                        value={authBusinessName}
                        onChange={(e) => setAuthBusinessName(e.target.value)}
                        placeholder="e.g. Apex Karakoram Adventures"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 text-slate-900 bg-slate-50"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="client@palace.com"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 text-slate-900 bg-slate-50"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-gold-500 text-slate-900 bg-slate-50"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-gold-500 via-gold-600 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:brightness-105 transition disabled:opacity-50"
              >
                {authSubmitting
                  ? 'Verifying Credentials...'
                  : authMode === 'login'
                  ? 'Access Member Suite'
                  : 'Complete Registration'}
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-500">
              {authMode === 'login' ? (
                <span>
                  New to Faraday Royal?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="font-bold text-gold-700 hover:underline"
                  >
                    Create Account
                  </button>
                </span>
              ) : (
                <span>
                  Already a member?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-gold-700 hover:underline"
                  >
                    Log In
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
