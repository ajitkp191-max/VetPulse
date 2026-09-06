import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  ExternalLink,
  QrCode,
  ShieldCheck,
  X,
  Copy,
  Check,
  Sparkles,
  Info,
  Layers,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface AndroidApkReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidApkReleaseModal: React.FC<AndroidApkReleaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'install' | 'package' | 'qr'>('install');
  const [installNotice, setInstallNotice] = useState<string | null>(null);

  // Live app production URL
  const appUrl = 'https://ais-pre-v2gwzo3lzbyh2zuwobmihc-713845383221.asia-southeast1.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(appUrl)}`;

  useEffect(() => {
    // Check if running in standalone mode (already installed as PWA / WebAPK)
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true)
    ) {
      setIsInstalled(true);
    }

    // Capture beforeinstallprompt for direct Android install
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setInstallNotice('Installation started! Check your Android home screen.');
        }
        setDeferredPrompt(null);
      } catch (e) {
        console.warn('Install prompt error:', e);
      }
    } else {
      setInstallNotice(
        'To install directly: Open this link in Google Chrome on your Android device, tap ⋮ (menu), and select "Install app".'
      );
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500 text-white shadow-md shadow-teal-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Android App &amp; APK Release Center
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official WebAPK installation &amp; certified Android release
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('install')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Install on Android (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'package'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Signed APK (PWABuilder)
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-3 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'qr'
                ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            Scan QR Code
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* CRITICAL FIX BANNER: Package Parsing Error Guide */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                Fixing "There was a problem while parsing the package"
              </h4>
              <p className="text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
                Android Package Manager requires APKs to be minted with Dalvik bytecode (DEX) and Keystore signatures.
                To install <strong>with 1 tap and ZERO errors</strong> on your Android phone:
              </p>
              <div className="text-xs font-medium text-amber-950 dark:text-amber-100 bg-amber-100/60 dark:bg-amber-900/40 rounded-lg p-2 mt-1">
                👉 <strong>Open in Chrome &rarr; Tap menu (⋮) &rarr; Tap "Install app" (or "Add to Home screen")</strong>.
                Android automatically mints a 100% verified native WebAPK directly onto your device!
              </div>
            </div>
          </div>

          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* Install Action Card */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-600/30">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    VetCare Pro Veterinary System
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Package: <code className="text-teal-600 dark:text-teal-400">com.vetcarepro.app</code>
                  </p>
                </div>

                {isInstalled ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> App is already installed in Standalone Mode
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleInstallClick}
                      className="py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>1-Tap Install (WebAPK)</span>
                    </button>
                    <a
                      href={appUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <span>Open in Chrome Tab</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {installNotice && (
                  <div className="p-3 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 rounded-xl text-xs text-teal-900 dark:text-teal-200 text-left">
                    {installNotice}
                  </div>
                )}
              </div>

              {/* 3-Step Visual Instruction Guide */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 uppercase tracking-wider">
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  Official Android WebAPK Installation (3 Steps)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                      1
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Open in Chrome</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Open this URL in Google Chrome or Samsung Internet.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                      2
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Tap Menu (⋮)</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Tap the three dots icon in the top right corner of Chrome.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                      3
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">"Install app"</div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Tap "Install app" &amp; Android installs the verified native app icon!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'package' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Cloud Binary APK Compiler (PWABuilder &amp; Bubblewrap)
                </h4>
                <p className="text-xs text-indigo-800/90 dark:text-indigo-300/90 mt-1 leading-relaxed">
                  To get a certified, signed <strong>.apk</strong> file with compiled DEX bytecode ready for manual sideloading, generate it via PWABuilder (backed by Google &amp; Microsoft).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Production URL:</span>
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 font-mono text-xs text-slate-800 dark:text-slate-200 truncate border border-slate-200 dark:border-slate-800">
                  {appUrl}
                </div>

                <a
                  href={pwaBuilderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build Certified Signed APK on PWABuilder</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                  PWABuilder tests the manifest, verifies icons, and generates a downloadable signed release APK file with DEX bytecode that sideloads without parsing errors.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="text-center space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Scan this QR code using the camera app or Google Lens on your Android device to open and install the app in Chrome:
              </p>

              <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-teal-300 dark:border-teal-700 inline-block shadow-md">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(appUrl)}`}
                  alt="QR Code for Android App"
                  className="w-44 h-44 mx-auto rounded-lg"
                  loading="lazy"
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={handleCopyUrl}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'URL Copied!' : 'Copy Mobile Link'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Technical Spec Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Package Identifier</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">com.vetcarepro.app</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Platform</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Android 8.0+ (API 26+)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Display Architecture</span>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">Standalone / WebAPK</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Offline Caching</span>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">Service Worker Active</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Build Target: Android WebAPK / Standalone TWA
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
