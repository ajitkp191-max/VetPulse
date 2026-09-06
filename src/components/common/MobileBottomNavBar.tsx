import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Search,
  History,
  Clock,
  Sparkles,
  RefreshCw,
  AlertOctagon,
} from 'lucide-react';

export const MobileBottomNavBar: React.FC = () => {
  const {
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    goHome,
    navigationHistory,
    historyIndex,
    jumpToHistoryIndex,
    setIsPetSearchOpen,
    refreshData,
    isRefreshing,
    currentSection,
    setOwnerActiveTab,
    showNotification,
  } = useApp();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsHistoryOpen(false);
      }
    };
    if (isHistoryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isHistoryOpen]);

  const formatTime = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 30) return 'Just now';
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
  };

  return (
    <>
      {/* Mobile Floating Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-lg safe-area-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* BACK BUTTON */}
          <button
            id="mobile-nav-btn-back"
            type="button"
            disabled={!canGoBack}
            onClick={goBack}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              canGoBack
                ? 'text-slate-700 dark:text-slate-200 active:scale-90 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-slate-300 dark:text-slate-600 opacity-50 cursor-not-allowed'
            }`}
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Back</span>
          </button>

          {/* FORWARD BUTTON */}
          <button
            id="mobile-nav-btn-forward"
            type="button"
            disabled={!canGoForward}
            onClick={goForward}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              canGoForward
                ? 'text-slate-700 dark:text-slate-200 active:scale-90 hover:bg-slate-100 dark:hover:bg-slate-800'
                : 'text-slate-300 dark:text-slate-600 opacity-50 cursor-not-allowed'
            }`}
            title="Go Forward"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Forward</span>
          </button>

          {/* HOME BUTTON */}
          <button
            id="mobile-nav-btn-home"
            type="button"
            onClick={goHome}
            className="flex flex-col items-center justify-center p-1.5 rounded-xl text-teal-600 dark:text-teal-400 active:scale-90 hover:bg-teal-50 dark:hover:bg-teal-950/60 transition-all"
            title="Home Dashboard"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-0.5">Home</span>
          </button>


        </div>
      </div>

      {/* Mobile History Drawer Sheet */}
      {isHistoryOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end p-3 animate-in fade-in duration-150">
          <div
            ref={drawerRef}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xl space-y-3 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 rounded-xl">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    Navigation History
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Jump to any visited view in this session
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1">
              {navigationHistory.map((item, idx) => {
                const isCurrent = idx === historyIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      jumpToHistoryIndex(idx);
                      setIsHistoryOpen(false);
                    }}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between gap-3 text-xs transition-colors ${
                      isCurrent
                        ? 'bg-teal-50 dark:bg-teal-950/80 text-teal-900 dark:text-teal-200 font-bold border border-teal-200 dark:border-teal-800'
                        : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-bold truncate">{item.label}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        Section: {item.section.replace('_', ' ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTime(item.timestamp)}
                      </span>
                      {isCurrent && (
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  refreshData();
                  setIsHistoryOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 p-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                Sync Cloud Records
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
