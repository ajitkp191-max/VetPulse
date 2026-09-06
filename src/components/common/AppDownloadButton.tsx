import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  ArrowDownToLine,
  Sparkles,
  Info,
  QrCode,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AppDownloadButtonProps {
  onOpenModal?: () => void;
}

export const AppDownloadButton: React.FC<AppDownloadButtonProps> = ({ onOpenModal }) => {
  const { showNotification } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [deviceType, setDeviceType] = useState<'android' | 'ios' | 'windows' | 'mac' | 'desktop'>('desktop');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect device platform
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/android/i.test(ua)) {
        setDeviceType('android');
      } else if (/iphone|ipad|ipod/i.test(ua)) {
        setDeviceType('ios');
      } else if (/windows|win32/i.test(ua)) {
        setDeviceType('windows');
      } else if (/macintosh|mac os x/i.test(ua)) {
        setDeviceType('mac');
      } else {
        setDeviceType('desktop');
      }

      // Check if already running in standalone PWA / WebAPK mode
      if (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true
      ) {
        setIsStandalone(true);
      }
    }

    // Capture beforeinstallprompt event for direct native install
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleOneTapDownload = async () => {
    setIsDownloading(true);

    try {
      // 1. If on Android:
      if (deviceType === 'android') {
        if (deferredPrompt) {
          // Native WebAPK Install Prompt (Google Play Services mints real APK on device)
          try {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult && choiceResult.outcome === 'accepted') {
              showNotification('VetCare Pro installed successfully as native Android app!', 'success');
              setDownloadSuccess(true);
            }
          } catch (promptErr) {
            console.warn('Deferred prompt error:', promptErr);
            if (onOpenModal) onOpenModal();
          }
        } else {
          // Inside iframe or beforeinstallprompt pending: open guided install center
          if (onOpenModal) {
            onOpenModal();
          }
          showNotification(
            'To install on Android: In Chrome, tap ⋮ (menu) → "Install app" for the native WebAPK!',
            'info'
          );
        }
      } 
      // 2. If on iOS (iPhone / iPad):
      else if (deviceType === 'ios') {
        if (onOpenModal) {
          onOpenModal();
        }
        showNotification(
          'iOS Tip: In Safari, tap Share [⎙] → "Add to Home Screen" to install!',
          'info'
        );
      } 
      // 3. If on Windows, Mac, or Desktop:
      else {
        if (deferredPrompt) {
          try {
            deferredPrompt.prompt();
            const choiceResult = await deferredPrompt.userChoice;
            if (choiceResult && choiceResult.outcome === 'accepted') {
              showNotification('VetCare Pro installed to your desktop!', 'success');
              setDownloadSuccess(true);
            }
          } catch (promptErr) {
            console.warn('Desktop prompt error:', promptErr);
            if (onOpenModal) onOpenModal();
          }
        } else {
          if (onOpenModal) {
            onOpenModal();
          }
          showNotification('Open browser menu (⋮) → "Install VetCare Pro" to install locally.', 'info');
        }
      }
    } catch (err: any) {
      console.error('Install action error:', err);
      if (onOpenModal) onOpenModal();
    } finally {
      setTimeout(() => {
        setIsDownloading(false);
      }, 1000);
      setTimeout(() => {
        setDownloadSuccess(false);
      }, 5000);
    }
  };

  // Label configuration based on detected device
  const getDeviceConfig = () => {
    switch (deviceType) {
      case 'android':
        return {
          title: 'Download App',
          subtitle: 'Android APK',
          badge: 'APK',
          Icon: Smartphone,
          gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
        };
      case 'ios':
        return {
          title: 'Download App',
          subtitle: 'iOS / iPhone',
          badge: 'iOS',
          Icon: Smartphone,
          gradient: 'from-teal-600 to-indigo-600',
        };
      case 'windows':
        return {
          title: 'Download App',
          subtitle: 'Windows PC',
          badge: 'Windows',
          Icon: Laptop,
          gradient: 'from-blue-600 to-teal-600',
        };
      case 'mac':
        return {
          title: 'Download App',
          subtitle: 'macOS',
          badge: 'Mac',
          Icon: Laptop,
          gradient: 'from-slate-700 to-teal-700',
        };
      default:
        return {
          title: 'Download App',
          subtitle: 'Auto-Detect',
          badge: 'App',
          Icon: Download,
          gradient: 'from-emerald-600 to-teal-600',
        };
    }
  };

  const config = getDeviceConfig();
  const DeviceIcon = config.Icon;

  return (
    <div className="flex items-center gap-1">
      {/* Primary One-Tap Automatic Download Button */}
      <button
        id="header-btn-one-tap-download"
        onClick={handleOneTapDownload}
        disabled={isDownloading}
        title={`One-tap instant download for ${deviceType.toUpperCase()}`}
        className={`group relative flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r ${config.gradient} hover:brightness-110 active:scale-95 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all duration-150 overflow-hidden cursor-pointer`}
      >
        {/* Animated shine line on hover */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

        {isDownloading ? (
          <ArrowDownToLine className="w-4 h-4 animate-bounce text-white shrink-0" />
        ) : downloadSuccess ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
        ) : (
          <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-white shrink-0" />
        )}

        <div className="flex flex-col items-start text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight whitespace-nowrap">
              {downloadSuccess ? 'Downloading...' : config.title}
            </span>
            <span className="px-1.5 py-0.5 bg-black/20 backdrop-blur-xs rounded text-[9px] font-mono tracking-wider uppercase">
              {config.badge}
            </span>
          </div>
          <span className="hidden sm:inline-block text-[9px] font-normal text-teal-100 opacity-90 mt-0.5">
            {config.subtitle} • One Tap
          </span>
        </div>
      </button>

      {/* Auxiliary button to open modal (QR code, technical specs, etc.) */}
      {onOpenModal && (
        <button
          onClick={onOpenModal}
          title="Release details & QR Code for other devices"
          className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700"
        >
          <QrCode className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
