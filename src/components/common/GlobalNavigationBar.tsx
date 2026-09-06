import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  RefreshCw,
  History,
  ChevronRight,
  Clock,
  ExternalLink,
  Keyboard,
  ShieldAlert,
  Stethoscope,
  HeartHandshake,
  CheckCircle,
} from 'lucide-react';

export const GlobalNavigationBar: React.FC = () => {
  const {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    goHome,
    navigationHistory,
    historyIndex,
    jumpToHistoryIndex,
    currentBreadcrumbs,
    refreshData,
    isRefreshing,
    currentSection,
  } = useApp();

  const [isHistoryDropdownOpen, setIsHistoryDropdownOpen] = useState(false);
  const [showShortcutTip, setShowShortcutTip] = useState(false);
  const historyMenuRef = useRef<HTMLDivElement>(null);

  // Close history menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (historyMenuRef.current && !historyMenuRef.current.contains(e.target as Node)) {
        setIsHistoryDropdownOpen(false);
      }
    };
    if (isHistoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHistoryDropdownOpen]);

  const prevItem = historyIndex > 0 ? navigationHistory[historyIndex - 1] : null;
  const nextItem = historyIndex < navigationHistory.length - 1 ? navigationHistory[historyIndex + 1] : null;

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'super_admin':
        return <ShieldAlert className="w-3 h-3 text-rose-500" />;
      case 'doctor':
      case 'admin':
        return <Stethoscope className="w-3 h-3 text-teal-500" />;
      default:
        return <HeartHandshake className="w-3 h-3 text-amber-500" />;
    }
  };

  const formatTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 30) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <nav
      aria-label="Essential Application Navigation"
      className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 sticky top-[53px] z-30 transition-all shadow-2xs"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {/* Left: Essential Back, Forward, Home, History Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* 1. BACK BUTTON */}
          <button
            id="nav-btn-back"
            type="button"
            disabled={!canGoBack}
            onClick={goBack}
            title={canGoBack ? `Go Back to "${prevItem?.label || 'Previous'}" (Alt + ←)` : 'No previous page in history'}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              canGoBack
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer active:scale-95'
                : 'bg-slate-50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-800/50 cursor-not-allowed opacity-60'
            }`}
          >
            <ArrowLeft className={`w-3.5 h-3.5 ${canGoBack ? 'text-teal-600 dark:text-teal-400' : ''}`} />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* 2. FORWARD BUTTON */}
          <button
            id="nav-btn-forward"
            type="button"
            disabled={!canGoForward}
            onClick={goForward}
            title={canGoForward ? `Go Forward to "${nextItem?.label || 'Next'}" (Alt + →)` : 'No forward page in history'}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              canGoForward
                ? 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs cursor-pointer active:scale-95'
                : 'bg-slate-50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-800/50 cursor-not-allowed opacity-60'
            }`}
          >
            <span className="hidden sm:inline">Forward</span>
            <ArrowRight className={`w-3.5 h-3.5 ${canGoForward ? 'text-teal-600 dark:text-teal-400' : ''}`} />
          </button>

          {/* 3. HOME BUTTON */}
          <button
            id="nav-btn-home"
            type="button"
            onClick={goHome}
            title="Go to Active Dashboard (Alt + H)"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <Home className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Home</span>
          </button>

          {/* 4. HISTORY / RECENT PAGES DROPDOWN */}
          <div className="relative" ref={historyMenuRef}>
            <button
              id="nav-btn-history"
              type="button"
              onClick={() => setIsHistoryDropdownOpen((prev) => !prev)}
              title="Recent Navigation History & Jump List"
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isHistoryDropdownOpen
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-mono text-[11px]">
                {navigationHistory.length > 0 ? `${historyIndex + 1}/${navigationHistory.length}` : ''}
              </span>
            </button>

            {/* History Dropdown Panel */}
            {isHistoryDropdownOpen && (
              <div className="absolute left-0 mt-1.5 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Navigation Trail ({navigationHistory.length})
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Alt+← / Alt+→</span>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-1 py-1">
                  {navigationHistory.map((item, idx) => {
                    const isCurrent = idx === historyIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          jumpToHistoryIndex(idx);
                          setIsHistoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                          isCurrent
                            ? 'bg-teal-50 dark:bg-teal-950/70 text-teal-900 dark:text-teal-200 font-bold border border-teal-200 dark:border-teal-800'
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          {getSectionIcon(item.section)}
                          <span className="truncate">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {formatTime(item.timestamp)}
                          </span>
                          {isCurrent && (
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Interactive Breadcrumb Navigation Pathway */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 px-2 text-xs overflow-x-auto no-scrollbar">
          {currentBreadcrumbs.map((crumb, idx) => {
            const isLast = idx === currentBreadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && (
                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                )}
                {crumb.onClick && !isLast ? (
                  <button
                    type="button"
                    onClick={crumb.onClick}
                    className="text-slate-500 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-300 font-medium truncate hover:underline cursor-pointer"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span
                    className={`truncate ${
                      isLast
                        ? 'font-bold text-slate-900 dark:text-white flex items-center gap-1'
                        : 'text-slate-500 dark:text-slate-400 font-medium'
                    }`}
                  >
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Cloud Sync, Reload & Keyboard Shortcut Info */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Keyboard shortcuts helper badge */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowShortcutTip(true)}
              onMouseLeave={() => setShowShortcutTip(false)}
              onClick={() => setShowShortcutTip((prev) => !prev)}
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Keyboard Navigation Shortcuts"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px]">Shortcuts</span>
            </button>

            {showShortcutTip && (
              <div className="absolute right-0 mt-1.5 w-60 bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs z-50 border border-slate-700 animate-in fade-in duration-150">
                <div className="font-bold text-teal-400 mb-1.5 flex items-center gap-1">
                  <Keyboard className="w-3.5 h-3.5" />
                  Navigation Shortcuts
                </div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div className="flex justify-between">
                    <span>Back:</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">Alt + ←</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Forward:</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">Alt + →</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Home:</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">Alt + H</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>Search:</span>
                    <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-[10px]">⌘ + K</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. SYNC & REFRESH DATA BUTTON */}
          <button
            id="nav-btn-refresh"
            type="button"
            onClick={refreshData}
            disabled={isRefreshing}
            title="Refresh & Sync Data with Database (Alt + R)"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/80 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-200 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-teal-600 dark:text-teal-400 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Sync'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
