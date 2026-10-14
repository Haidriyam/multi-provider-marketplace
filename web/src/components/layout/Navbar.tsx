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
  const { user, logout, quickLogin } = useAuth();
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

  const { login, register } = useAuth();

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
      {/* EMIRATES-GRADE VIP CONCIERGE & DEMO PERSONA TOP BAR */}
      <div className="bg-obsidian-999 text-slate-400 text-xs py-2 px-4 border-b border-gold-500/15">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* VIP Concierge Desk */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold-400 font-semibold tracking-wider uppercase text-[11px]">
              <Crown className="w-3.5 h-3.5 text-gold-400" />
              Royal Concierge Verified
            </span>
            <span className="hidden lg:inline text-slate-500">•</span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
              <PhoneCall className="w-3 h-3 text-gold-500/80" />
              Bespoke Dispatch: <span className="text-slate-300 font-semibold">+971 4 214 4444</span>
            </span>
          </div>

          {/* Persona Switcher & Currency Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-obsidian-900 border border-gold-500/20 px-2 py-0.5 rounded-lg text-[11px] text-gold-400">
              <Globe className="w-3 h-3 text-gold-400" />
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-transparent text-gold-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="PKR" className="bg-obsidian-900 text-slate-200">PKR (₨)</option>
                <option value="USD" className="bg-obsidian-900 text-slate-200">USD ($)</option>
                <option value="AED" className="bg-obsidian-900 text-slate-200">AED (د.إ)</option>
                <option value="EUR" className="bg-obsidian-900 text-slate-200">EUR (€)</option>
              </select>
            </div>

            <span className="hidden sm:inline text-slate-600">|</span>

            {/* Quick Personas */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => quickLogin('admin')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide transition ${
                  user?.role === 'SUPER_ADMIN'
                    ? 'bg-gradient-to-r from-gold-600 to-amber-500 text-obsidian-950 font-black shadow-gold-sm'
                    : 'bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 border border-slate-800'
                }`}
              >
                Super Admin
              </button>
              <button
                onClick={() => quickLogin('provider1')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide transition ${
                  user?.role === 'PROVIDER' && user?.email === 'apex@adventures.com'
                    ? 'bg-gradient-to-r from-gold-600 to-amber-500 text-obsidian-950 font-black shadow-gold-sm'
                    : 'bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 border border-slate-800'
                }`}
              >
                Apex Operator
              </button>
              <button
                onClick={() => quickLogin('customer1')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold tracking-wide transition ${
                  user?.role === 'CUSTOMER' && user?.email === 'sarah@customer.com'
                    ? 'bg-gradient-to-r from-gold-600 to-amber-500 text-obsidian-950 font-black shadow-gold-sm'
                    : 'bg-obsidian-900 hover:bg-obsidian-850 text-slate-300 border border-slate-800'
                }`}
              >
                Sarah (VIP)
              </button>
              {user && (
                <button
                  onClick={logout}
                  className="px-2 py-0.5 rounded text-[10px] text-rose-400 hover:text-rose-300 ml-1 transition"
                >
                  Exit
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN LUXURY HEADER */}
      <header className="sticky top-0 z-40 bg-obsidian-950/95 backdrop-blur-xl border-b border-gold-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* EMIRATES STYLE LUXURY CREST LOGO */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-700 p-0.5 shadow-gold-md group-hover:scale-105 transition-all duration-300">
                <div className="w-full h-full bg-obsidian-950 rounded-[10px] flex items-center justify-center text-gold-400">
                  <Compass className="w-6 h-6 stroke-[1.75]" />
                </div>
              </div>
              <div>
                <div className="font-cinzel text-xl font-bold tracking-[0.18em] text-white flex items-center gap-1.5">
                  FARADAY
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400 inline-block" />
                </div>
                <span className="block text-[10px] uppercase font-bold tracking-[0.3em] text-gold-400/90 -mt-1 font-sans">
                  Royal Expeditions
                </span>
              </div>
            </Link>

            {/* LUXURY EDITORIAL NAVIGATION */}
            <nav className="hidden lg:flex items-center gap-8 text-xs font-bold tracking-[0.12em] uppercase text-slate-300">
              <Link 
                href="/search" 
                className="hover:text-gold-400 transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-gold-400"
              >
                <Search className="w-3.5 h-3.5 text-gold-500" />
                Explore Suites
              </Link>
              <Link 
                href="/compare" 
                className="hover:text-gold-400 transition-colors flex items-center gap-1.5 py-1 border-b-2 border-transparent hover:border-gold-400"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-gold-500" />
                Compare Offerings
              </Link>
              <Link 
                href="/search?destination=hunza-valley" 
                className="hover:text-gold-400 transition-colors py-1 border-b-2 border-transparent hover:border-gold-400"
              >
                Hunza Royal
              </Link>
              <Link 
                href="/search?destination=skardu-deosai" 
                className="hover:text-gold-400 transition-colors py-1 border-b-2 border-transparent hover:border-gold-400"
              >
                Skardu & Deosai
              </Link>
              <Link 
                href="/search?category=coastal-watersports" 
                className="hover:text-gold-400 transition-colors py-1 border-b-2 border-transparent hover:border-gold-400"
              >
                Astola Marine
              </Link>
              <Link 
                href="/faq" 
                className="hover:text-gold-400 transition-colors py-1 border-b-2 border-transparent hover:border-gold-400 text-slate-400"
              >
                Charter Concierge
              </Link>
            </nav>

            {/* ACTIONS & VIP ACCOUNT DROPDOWN */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-3.5 rounded-full border border-gold-500/30 hover:border-gold-400 bg-obsidian-900 transition shadow-gold-sm"
                  >
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-bold text-white leading-tight">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-gold-400">
                        {user.role === 'SUPER_ADMIN' ? '👑 Fleet Admin' : user.role === 'PROVIDER' ? '🏢 Verified Operator' : '🎒 First Class Member'}
                      </div>
                    </div>
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.firstName} 
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-500/40"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-xs">
                        {user.firstName[0]}
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-gold-400 mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-obsidian-950 rounded-2xl shadow-2xl border border-gold-500/30 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <p className="text-[10px] text-gold-400/80 font-bold uppercase tracking-wider">Authenticated Identity</p>
                        <p className="text-xs font-semibold text-white truncate mt-0.5">{user.email}</p>
                      </div>

                      {(user.role === 'SUPER_ADMIN' || user.role === 'OPERATIONS_ADMIN') && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gold-300 font-bold hover:bg-gold-500/10 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-gold-400" />
                          Admin Moderation Console
                        </Link>
                      )}

                      {user.role === 'PROVIDER' && (
                        <Link
                          href="/provider/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gold-300 font-bold hover:bg-gold-500/10 transition"
                        >
                          <Briefcase className="w-4 h-4 text-gold-400" />
                          Operator Control Hub
                        </Link>
                      )}

                      <Link
                        href="/account/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-900 transition"
                      >
                        <CalendarCheck className="w-4 h-4 text-slate-400" />
                        My Bookings & Digital Vouchers
                      </Link>

                      <Link
                        href="/compare"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-900 transition"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-slate-400" />
                        Compare Offerings
                      </Link>

                      <Link
                        href="/account/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-900 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        VIP Preferences & Favourites
                      </Link>

                      <div className="border-t border-slate-800 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-950/30 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-gold-400 px-3 py-2 transition"
                  >
                    Member Log In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-obsidian-950 bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 hover:brightness-110 px-5 py-2.5 rounded-full shadow-gold-sm transition duration-300"
                  >
                    Join Private Fleet
                  </button>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-obsidian-950 px-6 py-4 space-y-3 text-xs font-bold tracking-wider uppercase">
            <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-gold-400">
              Explore Suites
            </Link>
            <Link href="/compare" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-gold-400">
              Compare Packages
            </Link>
            <Link href="/faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-gold-400">
              Concierge Desk
            </Link>
            {user?.role === 'PROVIDER' && (
              <Link href="/provider/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gold-400">
                Operator Dashboard
              </Link>
            )}
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'OPERATIONS_ADMIN') && (
              <Link href="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gold-400">
                Admin Console
              </Link>
            )}
          </div>
        )}
      </header>

      {/* LUXURY AUTH MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-999/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-obsidian-950 rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-gold-500/30 text-white">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mx-auto mb-2">
                <Crown className="w-6 h-6" />
              </div>
              <h2 className="font-editorial text-2xl font-bold tracking-wide text-white">
                {authMode === 'login' ? 'Private Client Access' : 'Create Member Account'}
              </h2>
              <p className="text-xs text-slate-400">
                {authMode === 'login'
                  ? 'Access your luxury expedition bookings and royal concierge'
                  : 'Join the premier verified travel and adventure marketplace'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={authFirstName}
                        onChange={(e) => setAuthFirstName(e.target.value)}
                        placeholder="Sarah"
                        className="w-full px-3 py-2.5 bg-obsidian-900 border border-slate-800 rounded-xl text-white focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={authLastName}
                        onChange={(e) => setAuthLastName(e.target.value)}
                        placeholder="Jenkins"
                        className="w-full px-3 py-2.5 bg-obsidian-900 border border-slate-800 rounded-xl text-white focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Client Tier</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthRole('CUSTOMER')}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          authRole === 'CUSTOMER'
                            ? 'border-gold-400 bg-gold-500/10 text-gold-300'
                            : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        🎒 Explorer Guest
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthRole('PROVIDER')}
                        className={`py-2 text-xs font-bold rounded-xl border transition ${
                          authRole === 'PROVIDER'
                            ? 'border-gold-400 bg-gold-500/10 text-gold-300'
                            : 'border-slate-800 text-slate-400'
                        }`}
                      >
                        🏢 Tour Operator
                      </button>
                    </div>
                  </div>

                  {authRole === 'PROVIDER' && (
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">Commercial Business Name</label>
                      <input
                        type="text"
                        required
                        value={authBusinessName}
                        onChange={(e) => setAuthBusinessName(e.target.value)}
                        placeholder="e.g. Karakoram Expeditions Pvt."
                        className="w-full px-3 py-2.5 bg-obsidian-900 border border-slate-800 rounded-xl text-white focus:border-gold-400 focus:outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2.5 bg-obsidian-900 border border-slate-800 rounded-xl text-white focus:border-gold-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 bg-obsidian-900 border border-slate-800 rounded-xl text-white focus:border-gold-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 bg-gradient-to-r from-gold-400 via-gold-500 to-amber-500 text-obsidian-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-gold-sm transition hover:brightness-110 disabled:opacity-50 mt-2"
              >
                {authSubmitting ? 'Authenticating...' : authMode === 'login' ? 'Access VIP Portal' : 'Register Member Account'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
              {authMode === 'login' ? (
                <p className="text-xs text-slate-400">
                  New client?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="font-bold text-gold-400 hover:underline"
                  >
                    Create private account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Existing client?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="font-bold text-gold-400 hover:underline"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
