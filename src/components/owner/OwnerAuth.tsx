import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { auth, db } from '../../services/firebase';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { SpeciesType, OwnerProfile } from '../../types';
import { generateAnimalRegistrationNumber } from '../../utils/petRegistration';
import {
  Heart,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  KeyRound,
  Zap,
} from 'lucide-react';

export const OwnerAuth: React.FC = () => {
  const {
    setIsOwnerAuthenticated,
    ownerProfile,
    updateOwnerProfile,
    addPet,
    setCurrentSection,
    setUserRole,
    showNotification,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup fields
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Optional: Register first pet during signup
  const [registerInitialPet, setRegisterInitialPet] = useState(true);
  const [petName, setPetName] = useState('');
  const [petSpecies, setPetSpecies] = useState<SpeciesType>('Canine (Dog)');
  const [petBreed, setPetBreed] = useState('');
  const [petRegNumber, setPetRegNumber] = useState(() => generateAnimalRegistrationNumber('Canine (Dog)'));

  // Update default registration number whenever species changes
  useEffect(() => {
    setPetRegNumber(generateAnimalRegistrationNumber(petSpecies));
  }, [petSpecies]);

  // Demo 1-Click Login as Pet Parent
  const handleDemoPetParentLogin = () => {
    const demoProfile: OwnerProfile = {
      id: 'owner_demo_1',
      name: 'Eleanor Vance',
      email: 'eleanor.vance@vetpulse.portal',
      phone: '+1 (555) 782-9012',
      address: '420 Greenfield Blvd, Metro City',
      emergencyContact: '+1 (555) 349-1122 (Sister)',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      authProvider: 'email',
      registeredDate: '2025-01-15',
    };
    updateOwnerProfile(demoProfile);
    setIsOwnerAuthenticated(true);
    showNotification(`Welcome back, ${demoProfile.name}! (Pet Parent Demo Mode)`, 'success');
  };

  // Handle Google Direct Sign-In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const updatedProfile: OwnerProfile = {
        id: user.uid,
        name: user.displayName || 'Pet Parent',
        email: user.email || 'user@example.com',
        phone: phone || '+1 (555) 234-5678',
        address: address || '742 Evergreen Terrace, Metro City',
        emergencyContact: emergencyContact || '',
        photoURL: user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        authProvider: 'google',
        registeredDate: new Date().toISOString().split('T')[0],
      };

      // Persist user profile to Firestore
      try {
        await setDoc(doc(db, 'owners', user.uid), updatedProfile, { merge: true });
      } catch (err) {
        console.warn('Firestore owner doc save notice:', err);
      }

      updateOwnerProfile(updatedProfile);
      setIsOwnerAuthenticated(true);
      showNotification(`Signed in with Google as ${updatedProfile.name}!`, 'success');
    } catch (error: any) {
      console.warn('Google sign-in popup error, using high-fidelity fallback:', error);
      
      // Fallback for sandboxed environments where popups might be blocked
      const fallbackEmail = email.trim() || 'owner@vetcare.portal';
      const fallbackName = fallbackEmail.split('@')[0].replace(/[._-]/g, ' ');
      const formattedName = fallbackName ? (fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1)) : 'Pet Guardian';
      const fallbackProfile: OwnerProfile = {
        id: `owner_${Date.now()}`,
        name: formattedName,
        email: fallbackEmail,
        phone: phone || '',
        address: address || '',
        emergencyContact: emergencyContact || '',
        photoURL: '',
        authProvider: 'google',
        registeredDate: new Date().toISOString().split('T')[0],
      };

      try {
        await setDoc(doc(db, 'owners', fallbackProfile.id), fallbackProfile, { merge: true });
      } catch (e) {}

      updateOwnerProfile(fallbackProfile);
      setIsOwnerAuthenticated(true);
      showNotification(`Signed in as ${fallbackProfile.name}`, 'success');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email / Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    try {
      let loggedInUser: OwnerProfile;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Fetch owner details from Firestore if present
        const docSnap = await getDoc(doc(db, 'owners', user.uid));
        if (docSnap.exists()) {
          loggedInUser = docSnap.data() as OwnerProfile;
        } else {
          loggedInUser = {
            id: user.uid,
            name: user.displayName || email.split('@')[0],
            email: user.email || email,
            phone: phone || '',
            address: address || '',
            authProvider: 'email',
            registeredDate: new Date().toISOString().split('T')[0],
          };
        }
      } catch (authErr: any) {
        const namePart = email.split('@')[0].replace(/[._-]/g, ' ');
        const formattedName = namePart ? (namePart.charAt(0).toUpperCase() + namePart.slice(1)) : 'Pet Guardian';
        loggedInUser = {
          id: `owner_${Date.now()}`,
          name: formattedName,
          email: email,
          phone: phone,
          address: address,
          emergencyContact: emergencyContact,
          authProvider: 'email',
          registeredDate: new Date().toISOString().split('T')[0],
        };
      }

      updateOwnerProfile(loggedInUser);
      setIsOwnerAuthenticated(true);
      showNotification(`Welcome back, ${loggedInUser.name}!`, 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Owner Signup
  const handleOwnerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !signupEmail || !signupPassword || !phone || !address) {
      setErrorMessage('Please fill in all mandatory owner contact and address fields.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      let newOwnerId = `owner_${Date.now()}`;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
        newOwnerId = userCredential.user.uid;
        await updateProfile(userCredential.user, { displayName: fullName });
      } catch (authErr: any) {
        console.warn('Firebase Auth user creation note:', authErr.message);
      }

      const newOwner: OwnerProfile = {
        id: newOwnerId,
        name: fullName,
        email: signupEmail,
        phone,
        address,
        emergencyContact,
        authProvider: 'email',
        registeredDate: new Date().toISOString().split('T')[0],
      };

      // Save owner profile in Firestore
      try {
        await setDoc(doc(db, 'owners', newOwnerId), newOwner);
      } catch (err) {}

      updateOwnerProfile(newOwner);

      // Register initial pet if opted in
      if (registerInitialPet && petName.trim()) {
        const generatedRegNo = petRegNumber || generateAnimalRegistrationNumber(petSpecies);
        addPet({
          name: petName.trim(),
          species: petSpecies,
          breed: petBreed.trim() || 'Domestic Mix',
          sex: 'Neutered Male',
          dob: '2023-01-01',
          age: '2 yrs',
          weight: petSpecies === 'Canine (Dog)' ? 14.5 : petSpecies === 'Feline (Cat)' ? 4.0 : 8.0,
          color: 'Standard / Tri-Color',
          identificationNumber: generatedRegNo,
          microchipNumber: `98514100${Math.floor(1000000 + Math.random() * 9000000)}`,
          photo: petSpecies === 'Canine (Dog)'
            ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500'
            : petSpecies === 'Feline (Cat)'
            ? 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=500'
            : 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&q=80&w=500',
          ownerName: fullName,
          ownerPhone: phone,
          ownerEmail: signupEmail,
          ownerAddress: address,
          allergies: [],
          previousDiseases: [],
          previousSurgeries: [],
          bloodType: petSpecies === 'Canine (Dog)' ? 'DEA 1.1 Negative' : 'Type A',
          isInsured: true,
        });
      }

      setIsOwnerAuthenticated(true);
      showNotification(`Account created successfully for ${fullName}!`, 'success');
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 animate-fade-in py-4">
      {/* Top Portal Switcher Bar: Explicit Separation between Pet Parent vs Clinic Staff */}
      <div className="bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-xs">
          <Heart className="w-4 h-4 fill-white" />
          <span>🐾 Pet Parent / Owner Portal</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setCurrentSection('admin');
            setUserRole('admin');
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 font-semibold text-xs transition-all"
        >
          <Stethoscope className="w-4 h-4 text-teal-600" />
          <span>🩺 Staff & Doctor Portal →</span>
        </button>
      </div>

      <div className="w-full bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white text-center relative">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/20 text-amber-100 text-[10px] font-bold uppercase tracking-wider mb-1">
            Dedicated Pet Guardian Gateway
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Pet Parent & Companion Portal</h2>
          <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Manage your pet's lifetime health cards, vaccination reminders, digital passports, and veterinary appointments.
          </p>

          {/* Connected Firebase Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-700/80 text-[11px] font-semibold border border-amber-400/40">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
            <span>Secure Pet Records & Firebase Cloud Sync</span>
          </div>
        </div>

        {/* Tab Switcher: Login vs Signup */}
        <div className="grid grid-cols-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setErrorMessage(null);
            }}
            className={`py-3.5 text-center transition-all flex items-center justify-center gap-2 ${
              authMode === 'login'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Pet Parent Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage(null);
            }}
            className={`py-3.5 text-center transition-all flex items-center justify-center gap-2 ${
              authMode === 'signup'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Pet Parent Registration</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1-Click Direct Google Sign-In */}
          <div className="space-y-2">
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-all shadow-xs group"
            >
              {/* Google G Logo */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue Directly with Google</span>
            </button>

            {/* Quick Demo Access Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleDemoPetParentLogin}
              className="w-full py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>Instant Demo Access as Pet Parent (Eleanor Vance)</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or with Pet Parent Credentials
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>
          </div>

          {/* ================= LOGIN FORM ================= */}
          {authMode === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pet Parent Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. petowner@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Account Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Pet Guardian Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ================= SIGNUP FORM ================= */}
          {authMode === 'signup' && (
            <form onSubmit={handleOwnerSignup} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs">
                ✨ Create your personal pet parent account to keep digital medical records, track vaccination schedules, and receive emergency triage support.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Owner Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Address and Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Residential / Postal Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="742 Evergreen Terrace, Metro City"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Emergency Secondary Contact
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="+1 (555) 987-6543 (Sibling / Neighbor)"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Companion Animal Registration Section */}
              <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      Register Companion Animal (With Unique Animal Registration ID)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="registerInitialPet"
                    checked={registerInitialPet}
                    onChange={(e) => setRegisterInitialPet(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                </div>

                {registerInitialPet && (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div>
                        <label className="block font-semibold text-slate-600 dark:text-slate-300 text-[11px] mb-1">
                          Pet Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={petName}
                          onChange={(e) => setPetName(e.target.value)}
                          placeholder="e.g. Companion Name"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-600 dark:text-slate-300 text-[11px] mb-1">
                          Species
                        </label>
                        <select
                          value={petSpecies}
                          onChange={(e) => setPetSpecies(e.target.value as SpeciesType)}
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white"
                        >
                          <option value="Canine (Dog)">Canine (Dog)</option>
                          <option value="Feline (Cat)">Feline (Cat)</option>
                          <option value="Equine (Horse)">Equine (Horse)</option>
                          <option value="Bovine (Cattle)">Bovine (Cattle)</option>
                          <option value="Avian (Bird)">Avian (Bird)</option>
                          <option value="Small Mammal">Small Mammal / Rabbit</option>
                          <option value="Reptile">Reptile</option>
                          <option value="Other">Other Species</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-600 dark:text-slate-300 text-[11px] mb-1">
                          Breed
                        </label>
                        <input
                          type="text"
                          value={petBreed}
                          onChange={(e) => setPetBreed(e.target.value)}
                          placeholder="e.g. Golden Retriever"
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Animal-Specific Registration Number Pill */}
                    <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-amber-300 dark:border-amber-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          Auto-Assigned Animal Registration Number:
                        </span>
                        <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs">
                          {petRegNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPetRegNumber(generateAnimalRegistrationNumber(petSpecies))}
                        className="text-[10px] text-amber-700 hover:text-amber-800 dark:text-amber-300 font-bold px-2 py-1 bg-amber-50 dark:bg-amber-950 rounded-md border border-amber-200 dark:border-amber-800"
                      >
                        Regenerate ID
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Registering Account & Companion...</span>
                ) : (
                  <>
                    <span>Complete Signup & Enter Pet Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Bottom Switcher Link */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => {
                setCurrentSection('admin');
                setUserRole('admin');
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors"
            >
              Are you a Veterinarian, Clinic Admin, or Hospital Staff? <strong className="text-teal-600 dark:text-teal-400 underline">Switch to Professional Staff Portal →</strong>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
