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
  CheckCircle2
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, quickLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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
      {/* 1-CLICK DEMO ROLE SWITCHER BAR */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
              Phase 1 MVP Demo
            </span>
            <span className="hidden sm:inline text-slate-400">Quick-Switch Personas:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => quickLogin('admin')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'SUPER_ADMIN' 
                  ? 'bg-purple-600 text-white font-semibold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              👑 Super Admin
            </button>
            <button
              onClick={() => quickLogin('ops')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'OPERATIONS_ADMIN' 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              🛠️ Ops Admin
            </button>
            <button
              onClick={() => quickLogin('provider1')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'PROVIDER' && user?.email === 'apex@adventures.com'
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              🏔️ Apex Provider
            </button>
            <button
              onClick={() => quickLogin('customer1')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'CUSTOMER' && user?.email === 'sarah@customer.com'
                  ? 'bg-amber-600 text-white font-semibold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              🎒 Customer (Sarah)
            </button>
            <button
              onClick={() => quickLogin('customer2')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                user?.role === 'CUSTOMER' && user?.email === 'ali@customer.com'
                  ? 'bg-amber-600 text-white font-semibold' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              🤿 Customer (Ali)
            </button>
            {user && (
              <button
                onClick={logout}
                className="px-2 py-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 ml-1 transition"
                title="Sign out"
              >
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN NAVIGATION HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Faraday<span className="text-emerald-600">Expeditions</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 -mt-1">
                  Verified Marketplace
                </span>
              </div>
            </Link>

            {/* Quick Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/search" className="hover:text-emerald-600 transition flex items-center gap-1.5">
                <Search className="w-4 h-4 text-slate-400" />
                Find Packages
              </Link>
              <Link href="/search?destination=hunza-valley" className="hover:text-emerald-600 transition">
                Hunza
              </Link>
              <Link href="/search?destination=skardu-deosai" className="hover:text-emerald-600 transition">
                Skardu
              </Link>
              <Link href="/search?category=coastal-watersports" className="hover:text-emerald-600 transition">
                Coastal & Diving
              </Link>
              <Link href="/faq" className="hover:text-emerald-600 transition">
                How It Works
              </Link>
            </nav>

            {/* Actions / User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 hover:shadow-sm transition bg-white"
                  >
                    <div className="text-left hidden sm:block">
                      <div className="text-xs font-semibold text-slate-900 leading-tight">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                        {user.role.replace('_', ' ')}
                      </div>
                    </div>
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.firstName} 
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      </div>

                      {/* Role Specific Shortcuts */}
                      {(user.role === 'SUPER_ADMIN' || user.role === 'OPERATIONS_ADMIN') && (
                        <Link
                          href="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50 transition"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          Admin Control Panel
                        </Link>
                      )}

                      {user.role === 'PROVIDER' && (
                        <Link
                          href="/provider/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                        >
                          <Briefcase className="w-4 h-4 text-emerald-600" />
                          Provider Dashboard
                        </Link>
                      )}

                      <Link
                        href="/account/bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <CalendarCheck className="w-4 h-4 text-slate-400" />
                        My Bookings & Enquiries
                      </Link>

                      <Link
                        href="/account/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Account & Favourites
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setAuthModalOpen(true);
                    }}
                    className="text-sm font-semibold text-slate-700 hover:text-emerald-600 px-3 py-2 transition"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('register');
                      setAuthModalOpen(true);
                    }}
                    className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl shadow-sm transition"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium"
            >
              Explore Packages
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-slate-700 font-medium"
            >
              How It Works
            </Link>
            {user?.role === 'PROVIDER' && (
              <Link
                href="/provider/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-emerald-600 font-semibold"
              >
                Provider Dashboard
              </Link>
            )}
            {(user?.role === 'SUPER_ADMIN' || user?.role === 'OPERATIONS_ADMIN') && (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-purple-600 font-semibold"
              >
                Admin Control Panel
              </Link>
            )}
          </div>
        )}
      </header>

      {/* AUTHENTICATION MODAL */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Compass className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {authMode === 'login'
                  ? 'Access your bookings, messages, and saved trips'
                  : 'Join the premier verified travel and adventure marketplace'}
              </p>
            </div>

            {authError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={authFirstName}
                        onChange={(e) => setAuthFirstName(e.target.value)}
                        placeholder="Sarah"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={authLastName}
                        onChange={(e) => setAuthLastName(e.target.value)}
                        placeholder="Jenkins"
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAuthRole('CUSTOMER')}
                        className={`py-2 text-xs font-semibold rounded-xl border text-center transition ${
                          authRole === 'CUSTOMER'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        🎒 Explorer / Customer
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthRole('PROVIDER')}
                        className={`py-2 text-xs font-semibold rounded-xl border text-center transition ${
                          authRole === 'PROVIDER'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                            : 'border-slate-200 text-slate-600'
                        }`}
                      >
                        🏢 Service Provider
                      </button>
                    </div>
                  </div>

                  {authRole === 'PROVIDER' && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Business Name</label>
                      <input
                        type="text"
                        required
                        value={authBusinessName}
                        onChange={(e) => setAuthBusinessName(e.target.value)}
                        placeholder="e.g. Karakoram Expeditions Pvt."
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  )}
                </>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow-md transition disabled:opacity-50 mt-2"
              >
                {authSubmitting ? 'Processing...' : authMode === 'login' ? 'Log In' : 'Create Account'}
              </button>
            </form>

            <div className="mt-4 pt-4 border-t border-slate-100 text-center">
              {authMode === 'login' ? (
                <p className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="font-semibold text-emerald-600 hover:underline"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="font-semibold text-emerald-600 hover:underline"
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
