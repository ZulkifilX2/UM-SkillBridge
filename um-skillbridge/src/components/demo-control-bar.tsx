'use client';

import { useState } from 'react';
import { useDemoStore } from '@/lib/store';
import {
  CheckCircle2, RotateCcw, Plus,
  ChevronDown, ChevronUp, Coins, ShieldCheck, Zap
} from 'lucide-react';

export function DemoControlBar() {
  const [collapsed, setCollapsed] = useState(true); // Start collapsed on load so it never covers mobile buttons
  const [showSwitchMenu, setShowSwitchMenu] = useState(false);

  const {
    users,
    currentUserId,
    switchDemoUser,
    getCurrentUser,
    getUserBalance,
    sessions,
    simulateSessionCompletion,
    resetDemo,
    createDemoMatch,
  } = useDemoStore();

  const currentUser = getCurrentUser();
  const balance = currentUserId ? getUserBalance(currentUserId) : { available: 0, reserved: 0 };

  const actionableSession = sessions.find(s =>
    ['Requested', 'Confirmed', 'Accepted'].includes(s.status) &&
    (s.mentorId === currentUserId || s.learnerId === currentUserId)
  );

  const handleSimulateCompletion = () => {
    if (actionableSession) {
      simulateSessionCompletion(actionableSession.id);
    } else {
      const anyActionable = sessions.find(s => ['Requested', 'Confirmed', 'Accepted'].includes(s.status));
      if (anyActionable) {
        simulateSessionCompletion(anyActionable.id);
      }
    }
  };

  const handleCreateDemoMatch = () => {
    if (currentUserId === 'u-aisha') {
      createDemoMatch('u-aisha', 'u-sarah', 'sk-mandarin', true, 'sk-python');
    } else {
      createDemoMatch(currentUserId || 'u-aisha', 'u-daniel', 'sk-canva', true, 'sk-python');
    }
  };

  return (
    <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 transition-all duration-300">
      {collapsed ? (
        /* Sleek compact collapsed floating pill */
        <button
          onClick={() => setCollapsed(false)}
          id="btn-expand-demo-rig"
          className="group flex items-center gap-2 px-3 py-2 rounded-full border border-teal-400/40 shadow-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 text-white"
          style={{ background: 'rgba(6, 27, 54, 0.95)' }}
          aria-label="Open UM Demo Rig Controls"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
          </span>
          <span className="text-xs font-bold text-teal-300 flex items-center gap-1">
            <Zap size={12} /> Demo Rig
          </span>
          <span className="text-white/60 text-[10px]">|</span>
          <span className="text-xs font-semibold text-white/90">
            {currentUser?.displayName || 'User'}
          </span>
          <span className="font-mono text-[11px] text-teal-300 font-bold">
            {balance.available.toFixed(1)} Cr
          </span>
          <ChevronUp size={14} className="text-white/60 group-hover:text-white" />
        </button>
      ) : (
        /* Expanded full controller card */
        <aside
          aria-label="Interactive Demo Controller"
          className="w-[calc(100vw-1.5rem)] sm:w-80 shadow-2xl rounded-2xl border backdrop-blur-md transition-all duration-300"
          style={{
            background: 'rgba(6, 27, 54, 0.96)',
            borderColor: 'rgba(32, 197, 190, 0.4)',
            color: '#FFFFFF'
          }}
        >
          {/* Header bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/10 gap-2">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
              </span>
              <span className="text-xs font-bold tracking-wide uppercase text-teal-300 flex items-center gap-1">
                <ShieldCheck size={14} /> Hackathon Demo Rig
              </span>
            </div>

            <button
              onClick={() => setCollapsed(true)}
              id="btn-collapse-demo-rig"
              className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Minimize Demo Controls"
            >
              <ChevronDown size={16} />
            </button>
          </div>

          <div className="p-3 flex flex-col gap-2.5 text-sm">
            {/* Active Persona switcher */}
            <div className="relative">
              <div className="text-[10px] uppercase tracking-wider text-white/60 mb-1 font-semibold flex justify-between">
                <span>Active Persona</span>
                <span className="text-teal-300 font-mono text-[10px]">
                  {balance.available.toFixed(1)} Cr Avail {balance.reserved > 0 && `(${balance.reserved.toFixed(1)} Res)`}
                </span>
              </div>

              <button
                onClick={() => setShowSwitchMenu(!showSwitchMenu)}
                className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-left"
                aria-label="Switch Demo User"
                id="demo-user-selector"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
                    style={{ backgroundColor: currentUser?.avatarColor || '#0C9D9A' }}
                  >
                    {currentUser?.avatarInitials || 'UM'}
                  </span>
                  <div>
                    <span className="font-semibold text-white block text-xs leading-none">
                      {currentUser?.displayName || 'Select User'}
                    </span>
                    <span className="text-[10px] text-teal-200">
                      {currentUser?.faculty} (Yr {currentUser?.yearOfStudy})
                    </span>
                  </div>
                </div>
                <ChevronDown size={14} className="text-white/60" />
              </button>

              {showSwitchMenu && (
                <div className="absolute left-0 right-0 bottom-full mb-1.5 rounded-xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden z-50">
                  <div className="p-1.5 max-h-52 overflow-y-auto flex flex-col gap-1">
                    {users.map(u => {
                      const uBal = getUserBalance(u.id);
                      const isSelected = u.id === currentUserId;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchDemoUser(u.id);
                            setShowSwitchMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                            isSelected ? 'bg-teal-500/20 text-teal-200 font-semibold' : 'hover:bg-white/10 text-white/90'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                              style={{ backgroundColor: u.avatarColor }}
                            >
                              {u.avatarInitials}
                            </span>
                            <span>{u.displayName} ({u.faculty.split(' ')[0]})</span>
                          </div>
                          <span className="font-mono text-[11px] text-teal-300">
                            {uBal.available} Cr
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleSimulateCompletion}
                disabled={!actionableSession && !sessions.some(s => ['Requested', 'Confirmed', 'Accepted'].includes(s.status))}
                id="btn-simulate-complete"
                title="Simulate peer session completion and escrow settlement"
                className="px-2 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 size={13} />
                <span>Complete</span>
              </button>

              <button
                onClick={handleCreateDemoMatch}
                id="btn-quick-match"
                title="Add a new reciprocal skill match"
                className="px-2 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-white/15"
              >
                <Plus size={13} />
                <span>New Match</span>
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px] text-white/60">
              <span className="flex items-center gap-1">
                <Coins size={11} className="text-amber-300" /> Currency-free
              </span>
              <button
                onClick={() => {
                  if (confirm('Reset demo state to initial hackathon showcase data?')) {
                    resetDemo();
                  }
                }}
                id="btn-reset-demo"
                className="hover:text-amber-300 transition-colors flex items-center gap-1 text-[10px] underline underline-offset-2"
              >
                <RotateCcw size={10} /> Reset Data
              </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
