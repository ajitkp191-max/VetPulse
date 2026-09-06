import React, { useState, useEffect } from 'react';
import {
  Activity,
  Heart,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  Zap,
  CheckCircle2,
  Database,
  Lock,
} from 'lucide-react';

interface AppLoadingScreenProps {
  message?: string;
  onFinish?: () => void;
  fullScreen?: boolean;
}

export const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  message = 'Initializing VetPulse Clinical Ecosystem...',
  onFinish,
  fullScreen = true,
}) => {
  const [progress, setProgress] = useState(15);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { text: 'Connecting to Cloud Firestore & EMR Security Vault', icon: Database },
    { text: 'Synchronizing Real-Time Patient & Clinical Records', icon: Activity },
    { text: 'Calibrating AI Symptom Checker & Rx Formulary', icon: Sparkles },
    { text: 'Preparing Doctor & Pet Parent Portals', icon: Heart },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          if (onFinish) {
            setTimeout(onFinish, 400);
          }
          return 100;
        }
        const diff = Math.random() * 18 + 8;
        const next = Math.min(prev + diff, 98);
        if (next > 75) setStepIndex(3);
        else if (next > 50) setStepIndex(2);
        else if (next > 25) setStepIndex(1);
        return next;
      });
    }, 280);

    return () => clearInterval(timer);
  }, [onFinish]);

  const CurrentStepIcon = steps[stepIndex]?.icon || Activity;

  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-50' : 'w-full py-16'
      } flex flex-col items-center justify-center bg-slate-950 text-white selection:bg-teal-500 selection:text-white px-4 overflow-hidden`}
    >
      {/* Dynamic Animated Background Aura Gradients */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>

      {/* Main Glass Card Loader Container */}
      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
        
        {/* Animated Veterinary Pulse Centerpiece */}
        <div className="relative mb-6">
          {/* Outer Ripple Rings */}
          <div className="absolute -inset-4 bg-teal-500/20 rounded-full animate-ping opacity-40" />
          <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full blur-md opacity-30 animate-pulse" />
          
          {/* Center Circular Icon Core */}
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 p-0.5 shadow-xl flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden relative">
              
              {/* Animated ECG Pulse Line behind icon */}
              <svg
                className="absolute inset-0 w-full h-full opacity-30 text-teal-400"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,50 L25,50 L35,20 L45,80 L55,35 L65,60 L75,50 L100,50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="animate-pulse"
                />
              </svg>

              <Activity className="w-9 h-9 text-teal-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Brand & Loading Heading */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 border border-teal-800/80 text-teal-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>VetPulse Clinical Core</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
            Loading Workspace
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {message}
          </p>
        </div>

        {/* Shimmering Progress Bar */}
        <div className="w-full space-y-2 mb-6">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <CurrentStepIcon className="w-3.5 h-3.5 text-teal-400 animate-bounce" />
              {steps[stepIndex]?.text}
            </span>
            <span className="text-teal-400 font-bold">{Math.round(progress)}%</span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 relative">
            <div
              className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300 rounded-full transition-all duration-300 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer light sweep animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Step Checkpoints Flow */}
        <div className="w-full grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/80">
          {steps.map((s, idx) => {
            const isCompleted = stepIndex > idx || progress === 100;
            const isCurrent = stepIndex === idx && progress < 100;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-teal-500 text-slate-950 font-bold'
                      : isCurrent
                      ? 'bg-teal-950 border border-teal-500 text-teal-400 animate-pulse'
                      : 'bg-slate-800/60 text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 truncate max-w-full font-medium">
                  {idx === 0 ? 'Cloud' : idx === 1 ? 'EMR' : idx === 2 ? 'AI' : 'Portal'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Security & Offline-Resilient Footer Badge */}
        <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>256-bit Encrypted • Zero-Loss Cloud Sync</span>
        </div>
      </div>
    </div>
  );
};
