import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const CAMPUS_MAP_SRC = '/campus-map.png';

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  { label: 'April 2026', year: 2026, month: 3, days: 30, start: 3 },
  { label: 'May 2026', year: 2026, month: 4, days: 31, start: 5 },
  { label: 'June 2026', year: 2026, month: 5, days: 30, start: 1 },
];

const INITIAL_BUILDINGS = [
  { name: 'HSH', status: 'unlocked' },
  { name: 'PCL', status: 'unlocked' },
  { name: 'NSW', status: 'unlocked' },
  { name: 'DAH', status: 'locked' },
];

const INITIAL_ALERTS = [
  { id: 1, label: 'Intruder', status: 'resolved', tone: 'text-red-600', type: 'Urgent' },
  { id: 2, label: 'Fire Alarm', status: 'resolved', tone: 'text-amber-500', type: 'Warning' },
];

const INITIAL_DOORS = Array.from({ length: 32 }, (_, i) => {
  const n = i + 1;
  const id = `D-${String(n).padStart(3, '0')}`;
  const names = [
    'Main Entrance', 'Side Exit', 'Lab Door', 'Office Door', 'Hallway Gate', 'Emergency Exit', 'Classroom Door', 'Storage Room',
    'Auditorium', 'Cafeteria', 'Gym Entry', 'Library Door', 'Science Wing', 'Admin Office', 'Counseling Office', 'North Exit',
    'South Exit', 'East Gate', 'West Gate', 'Commons', 'Fine Arts', 'Maintenance', 'Nurse Office', 'Chapel', 'Field House', 'Theater', 'Music Hall', 'Lecture Hall', 'Computer Lab', 'Engineering', 'Residence Hall', 'Bookstore',
  ];
  const buildings = ['HSH', 'PCL', 'NSW', 'DAH'];
  return [id, names[i] || `Door ${n}`, buildings[Math.floor(i / 8)] || 'HSH', 'Unlocked', 'Online'];
});

const EVENT_LOGS = [
  ['03/30/2026 7:00 AM', 'D-020', 'Cafeteria', 'PCL', 'Officer Miller', 'M. Johnson', 'Badge Scan', 'Unlocked'],
  ['03/30/2026 6:16 AM', 'D-032', 'Residence Hall', 'DAH', 'Officer Miller', 'S. Lee', 'Access Denied', 'Locked'],
  ['03/30/2026 5:51 AM', 'D-009', 'Auditorium', 'HSH', 'Officer Williams', '-', 'Badge Scan', 'Locked'],
  ['03/30/2026 5:46 AM', 'D-010', 'Cafeteria', 'PCL', 'Officer Smith', 'K. Nguyen', 'Lock', 'Locked'],
  ['03/30/2026 5:06 AM', 'D-021', 'Fine Arts', 'HSH', 'System Auto', 'J. Martinez', 'Unlock', 'Locked'],
  ['03/30/2026 4:35 AM', 'D-030', 'Engineering', 'HSH', 'Officer Davis', '-', 'Unlock', 'Unlocked'],
  ['03/30/2026 4:18 AM', 'D-014', 'Admin Office', 'NSW', 'System Auto', 'S. Lee', 'Key Card Entry', 'Locked'],
  ['03/30/2026 4:04 AM', 'D-028', 'Lecture Hall', 'NSW', 'Officer Garcia', '-', 'Badge Scan', 'Locked'],
  ['03/30/2026 3:47 AM', 'D-012', 'Library Door', 'NSW', 'Officer Brown', '-', 'Auto Unlock', 'Locked'],
  ['03/30/2026 3:06 AM', 'D-026', 'Theater', 'DAH', 'Officer Brown', 'R. Patel', 'Key Card Entry', 'Locked'],
  ['03/30/2026 2:53 AM', 'D-003', 'Lab Door', 'PCL', 'Officer Jones', 'K. Nguyen', 'Key Card Entry', 'Unlocked'],
  ['03/30/2026 2:17 AM', 'D-018', 'East Gate', 'NSW', 'Officer Smith', 'S. Lee', 'Auto Lock', 'Locked'],
  ['03/30/2026 2:06 AM', 'D-011', 'Gym Entry', 'PCL', 'System Auto', '-', 'Lock', 'Locked'],
  ['03/30/2026 1:45 AM', 'D-025', 'Field House', 'DAH', 'Officer Jones', '-', 'Manual Override', 'Locked'],
  ['03/30/2026 1:02 AM', 'D-006', 'Emergency Exit', 'HSH', 'Officer Jones', '-', 'Auto Unlock', 'Unlocked'],
  ['03/30/2026 12:26 AM', 'D-007', 'Classroom Door', 'HSH', 'Officer Davis', '-', 'Manual Override', 'Unlocked'],
  ['03/30/2026 12:14 AM', 'D-013', 'Science Wing', 'DAH', 'Officer Miller', 'R. Patel', 'Badge Scan', 'Locked'],
  ['03/30/2026 12:02 AM', 'D-020', 'Cafeteria', 'NSW', 'Officer Smith', '-', 'Access Denied', 'Locked'],
  ['03/29/2026 11:44 PM', 'D-005', 'Hallway Gate', 'DAH', 'Officer Davis', '-', 'Unlock', 'Locked'],
  ['03/29/2026 11:24 PM', 'D-008', 'Storage Room', 'HSH', 'System Auto', '-', 'Access Granted', 'Locked'],
];

const Icons = {
  ShieldAlert: ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6l7-3z" />
      <path d="M12 8v5" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  Trash2: ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  ),
  X: ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  ),
  ZoomIn: ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  ),
  ZoomOut: ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M8 11h6" />
    </svg>
  ),
  RotateCcw: ({ className = '' }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v6h6" />
    </svg>
  ),
};

function cn(...classes) { return classes.filter(Boolean).join(' '); }
function keyForDate(monthMeta, day) { return `${monthMeta.year}-${String(monthMeta.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`; }
function formatDateKey(key) { return `${key.slice(5).replace('-', '/')}/${key.slice(0, 4)}`; }

function getTheme(dark) {
  return dark ? {
    app: 'bg-slate-950 text-slate-100', header: 'bg-slate-900 text-slate-100', card: 'border-slate-700 bg-slate-900/90',
    cardTitle: 'text-slate-100', button: 'border-slate-600 bg-slate-800 text-slate-100', input: 'border-slate-600 bg-slate-900 text-slate-100',
    subtle: 'text-slate-400', tableHead: 'bg-slate-800 text-slate-100', tableRow: 'bg-slate-900', border: 'border-slate-700', lightPanel: 'bg-slate-900'
  } : {
    app: 'bg-[#b7d1e8] text-slate-900', header: 'bg-blue-700 text-white', card: 'border-blue-600 bg-[#cfe2f3]/60',
    cardTitle: 'text-slate-900', button: 'border-blue-600 bg-[#d9e8f6] text-slate-900', input: 'border-blue-600 bg-white text-slate-900',
    subtle: 'text-slate-500', tableHead: 'bg-blue-700 text-white', tableRow: 'bg-[#a8c8e4]', border: 'border-blue-600', lightPanel: 'bg-[#f4f4f4]'
  };
}

function recomputeDoorStats(doors) {
  return {
    online: doors.filter((d) => d[4] === 'Online').length,
    offline: doors.filter((d) => d[4] === 'Offline').length,
    unlocked: doors.filter((d) => d[3] === 'Unlocked').length,
    locked: doors.filter((d) => d[3] === 'Locked').length,
  };
}

function Card({ title, children, theme, className = '' }) {
  return <div className={cn('rounded-[18px] border-2 p-6 shadow-sm', theme.card, className)}><h3 className={cn('mb-5 text-center text-[20px] font-medium', theme.cardTitle)}>{title}</h3>{children}</div>;
}
function Button({ children, theme, className = '', ...props }) {
  return <button {...props} className={cn('rounded-[14px] border-2 px-6 py-3 text-[18px] font-medium transition hover:brightness-[0.98] active:scale-[0.99]', theme.button, className)}>{children}</button>;
}
function Modal({ children, wide = false, danger = false, darkMode = false }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-[2px]"><motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} className={cn('w-full rounded-[18px] border-2 p-6 shadow-2xl', wide ? 'max-w-6xl' : 'max-w-2xl', danger ? 'border-red-500' : darkMode ? 'border-slate-700 bg-slate-900 text-slate-100' : 'border-blue-600 bg-[#f4f4f4] text-slate-900')}>{children}</motion.div></div>;
}

function Header({ page, setPage, loggedIn, theme, darkMode }) {
  const crumb = useMemo(() => ({ dashboard: 'Dashboard', settings: 'Home/Settings', schedule: 'Home/Lock Schedule', logs: 'Home/Logs', doors: 'Home/Modify Doors' })[page] || '', [page]);
  return <div className={cn('sticky top-0 z-20 px-6 py-6 shadow', theme.header)}><div className="mx-auto flex max-w-[1450px] items-center justify-between gap-6"><div className="flex flex-wrap items-center gap-5 text-[18px] font-medium"><Icons.ShieldAlert className="h-9 w-9" /><span>School LockDown System</span>{loggedIn && <span className="opacity-50">|</span>}{loggedIn && <span>Welcome Officer, lance</span>}{loggedIn && <span className="opacity-50">|</span>}{loggedIn && <span>{crumb}</span>}{loggedIn && <span className="opacity-50">|</span>}{loggedIn && <span>Tuesday, April 28, 2026</span>}</div>{loggedIn && <div className="flex gap-3"><Button theme={theme} className={darkMode ? '!border-slate-600 !bg-slate-800 !text-slate-100' : '!border-white/40 !bg-blue-700 !text-white'} onClick={() => setPage('dashboard')}>Home</Button><Button theme={theme} className={darkMode ? '!border-slate-600 !bg-slate-800 !text-slate-100' : '!border-white/40 !bg-blue-700 !text-white'} onClick={() => setPage('settings')}>Settings</Button><Button theme={theme} className="border-red-500 bg-red-600 text-white" onClick={() => setPage('login')}>Logout</Button></div>}</div></div>;
}

function LoginPage({ onLogin, theme }) {
  const handleKeyDown = (e) => { if (e.key === 'Enter') onLogin(); };
  return <div className="flex min-h-[calc(100vh-92px)] items-center justify-center px-6 py-12"><motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[420px]"><div className="mb-8 flex justify-center"><div className="flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-amber-800 bg-amber-200 shadow"><div className="text-center text-amber-900"><div className="text-lg font-bold">|||</div><div className="font-serif text-[21px] leading-tight">Lockdown</div><div className="text-[9px] uppercase tracking-[0.2em]">Slogan</div></div></div></div><div className="space-y-6"><input onKeyDown={handleKeyDown} placeholder="Username" className={cn('w-full border-2 px-4 py-4 text-[20px] outline-none', theme.input)} /><input onKeyDown={handleKeyDown} type="password" placeholder="Password" className={cn('w-full border-2 px-4 py-4 text-[20px] outline-none', theme.input)} /><Button theme={theme} className="bg-blue-600 text-white" onClick={onLogin}>Login</Button></div></motion.div></div>;
}

function Dashboard({ buildings, alerts, doorStats, logs, scheduleItems, setPage, openModal, triggerLockdown, clearLockdown, lockdownActive, theme, toggleBuildingStatus }) {
  return <div className="mx-auto grid max-w-[1450px] gap-6 p-6 lg:grid-cols-2"><Card title="Lock Schedule" theme={theme}><div className="mb-6 flex justify-center"><Button theme={theme} onClick={() => setPage('schedule')}>View Schedule</Button></div><div className="mb-4 text-[17px]">Upcoming Locks - April 2026</div><div className={cn('rounded-[14px] border-2 p-4', theme.border)}>{scheduleItems.length ? scheduleItems.slice(0, 5).map((item) => <div key={item.key} className="mb-2 last:mb-0"><span className={cn('inline-flex items-center rounded-[12px] border px-4 py-2 text-[18px]', theme.border)}>{item.locked ? '🔒' : '•'} {item.label}</span></div>) : <div className={theme.subtle}>No locks scheduled this month</div>}</div></Card><Card title="ALERTS" theme={theme}><div className="mb-6 flex justify-center gap-4"><Button theme={theme} onClick={() => openModal('addAlert')}>Add Alerts</Button><Button theme={theme} onClick={() => openModal('manageAlerts')}>Manage Alerts</Button></div><div className={cn('rounded-[14px] border-2 p-4 text-[18px]', theme.border)}>{alerts.map((a) => <div key={a.id} className="mb-3 flex items-center justify-between last:mb-0"><span className={a.tone}>{a.label}</span><span className={a.status === 'active' ? 'text-red-600' : 'text-green-700'}>{a.status}</span></div>)}</div></Card><Card title="Buildings" theme={theme}><div className={cn('rounded-[14px] border-2 p-5 text-[18px]', theme.border)}>{buildings.map((b) => <button key={b.name} onClick={() => toggleBuildingStatus(b.name)} className={cn('mb-4 flex w-full items-center justify-between rounded px-2 py-2 text-left last:mb-0', b.status === 'locked' ? 'bg-red-500/10' : 'bg-emerald-500/10')}><span>{b.name}</span><span className={b.status === 'locked' ? 'text-red-600' : 'text-green-700'}>{b.status}</span></button>)}</div><div className="mt-6 flex justify-center"><Button theme={theme} onClick={() => openModal('buildings')}>Modify Buildings</Button></div></Card><Card title="Access Logs" theme={theme}><div className="mb-6 flex justify-center"><Button theme={theme} onClick={() => setPage('logs')}>View Logs</Button></div><div className={cn('rounded-[14px] border-2 p-4 text-[18px]', theme.border)}>{logs.map((log) => <div key={log} className="mb-3 last:mb-0">{log}</div>)}</div></Card><Card title="Lockdown Doors" theme={theme}><div className="mb-5 flex justify-center"><Button theme={theme} onClick={() => setPage('doors')}>Modify Doors</Button></div><div className={cn('rounded-[14px] border-2 p-4 text-[18px]', theme.border)}><div className="mb-3 flex justify-between"><span>Doors online</span><span className="text-green-700">{doorStats.online}</span></div><div className="mb-3 flex justify-between"><span>Doors offline</span><span className="text-red-600">{doorStats.offline}</span></div><div className="mb-3 flex justify-between"><span>Doors unlocked</span><span className="text-green-700">{doorStats.unlocked}</span></div><div className="flex justify-between"><span>Doors locked</span><span className="text-red-600">{doorStats.locked}</span></div></div></Card><Card title="Campus Map" theme={theme}><button onClick={() => openModal('map')} className="mx-auto block w-full"><div className="overflow-hidden rounded border border-slate-300 bg-white"><img src={CAMPUS_MAP_SRC} alt="Oklahoma Christian campus map" className="h-[270px] w-full object-contain" /></div><div className={cn('mt-2 text-center', theme.subtle)}>Map asset packaged locally</div></button></Card><div className="lg:col-span-2">{lockdownActive ? <button onClick={clearLockdown} className="w-full rounded-[16px] bg-emerald-600 px-6 py-8 text-[28px] font-semibold text-white shadow">ALL CLEAR</button> : <button onClick={triggerLockdown} className="w-full rounded-[16px] bg-red-700 px-6 py-8 text-[28px] font-semibold text-white shadow">Initiate Lockdown</button>}</div></div>;
}

function SettingsPage({ setPage, darkMode, setDarkMode, theme }) {
  return <div className="mx-auto max-w-[1120px] p-6"><div className="mb-6 flex justify-end"><Button theme={theme} onClick={() => setPage('dashboard')}>Back to Dashboard</Button></div><Card title="Settings" theme={theme} className={theme.lightPanel}><section className="mb-7"><h4 className="mb-4 text-[20px] font-semibold">Notifications</h4><div className={cn('space-y-5 border-t pt-5', theme.border)}>{[['Push Notifications', 'Receive alerts on this device', true], ['Email Alerts', 'Send alert summaries to your email', false], ['Sound Alerts', 'Play sound for urgent alerts', true]].map(([title, sub, enabled]) => <div key={String(title)} className="flex items-center justify-between gap-5"><div><div className="text-[18px]">{title}</div><div className={cn('text-[16px]', theme.subtle)}>{sub}</div></div><div className={cn('h-8 w-14 rounded-full p-1', enabled ? 'bg-green-700' : 'bg-slate-400')}><div className={cn('h-6 w-6 rounded-full bg-white', enabled && 'ml-auto')} /></div></div>)}</div></section><section className={cn('mb-7 border-t pt-5', theme.border)}><h4 className="mb-4 text-[20px] font-semibold">Security</h4><div className="grid gap-4 md:grid-cols-[1fr_120px] md:items-center"><div><div className="text-[18px]">Auto-Lock Timeout (minutes)</div><div className={cn('text-[16px]', theme.subtle)}>Automatically lock doors after inactivity</div></div><select className={cn('rounded-[12px] border-2 px-4 py-3 text-[18px]', theme.input)}><option>30</option></select><div><div className="text-[18px]">Session Timeout (minutes)</div><div className={cn('text-[16px]', theme.subtle)}>Auto-logout after inactivity</div></div><select className={cn('rounded-[12px] border-2 px-4 py-3 text-[18px]', theme.input)}><option>60</option></select></div></section><section className={cn('border-t pt-5', theme.border)}><h4 className="mb-4 text-[20px] font-semibold">System</h4><div className="grid gap-4 md:grid-cols-[1fr_160px] md:items-center"><div><div className="text-[18px]">Display Theme</div><div className={cn('text-[16px]', theme.subtle)}>Choose interface appearance</div></div><select value={darkMode ? 'Dark' : 'Light'} onChange={(e) => setDarkMode(e.target.value === 'Dark')} className={cn('rounded-[12px] border-2 px-4 py-3 text-[18px]', theme.input)}><option>Light</option><option>Dark</option></select><div><div className="text-[18px]">Log Retention (days)</div><div className={cn('text-[16px]', theme.subtle)}>Control how long logs are stored</div></div><select className={cn('rounded-[12px] border-2 px-4 py-3 text-[18px]', theme.input)}><option>90</option></select></div></section></Card></div>;
}

function SchedulePage({ monthIndex, setMonthIndex, scheduleMap, selectedDateKeys, setSelectedDateKeys, addSelectedDates, removeSelectedDates, openExceptionModal, exceptionEntries, theme }) {
  const month = MONTHS[monthIndex];
  const cells = [];
  for (let i = 0; i < month.start; i += 1) cells.push(null);
  for (let day = 1; day <= month.days; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  const toggleDate = (day, event) => { if (!day) return; const key = keyForDate(month, day); setSelectedDateKeys((prev) => event?.shiftKey ? (prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]) : [key]); };
  return <div className="mx-auto max-w-[1080px] p-6"><Card title={month.label} theme={theme}><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div className="flex gap-3"><Button theme={theme} onClick={() => setMonthIndex((i) => Math.max(0, i - 1))}>◀</Button><Button theme={theme} onClick={() => setMonthIndex((i) => Math.min(MONTHS.length - 1, i + 1))}>▶</Button></div><div className="flex gap-3"><Button theme={theme} onClick={() => addSelectedDates('single')}>Add</Button><Button theme={theme} onClick={removeSelectedDates}>Remove</Button></div></div><div className="grid grid-cols-7 gap-1 text-center">{WEEK_DAYS.map((d) => <div key={d} className={cn('border-2 py-3 text-[16px] font-medium', theme.border)}>{d}</div>)}{cells.map((day, idx) => { const key = day ? keyForDate(month, day) : `blank-${idx}`; const item = day ? scheduleMap[key] : null; const selected = day && selectedDateKeys.includes(key); return <button key={key} type="button" onClick={(event) => toggleDate(day, event)} className={cn('min-h-[86px] border-2 p-2 text-[16px] text-left transition', theme.border, !day && 'opacity-40', selected && 'ring-2 ring-amber-400', item?.locked && (theme.app.includes('slate') ? 'bg-red-950/50' : 'bg-[#ddd8ca]'))}><div className="text-center">{day || ''}</div>{item?.locked && <div className="mt-2 text-center">🔒</div>}{item?.buildings?.length ? <div className="mt-2 text-center text-[12px] text-amber-600">{item.buildings.join(' ')}</div> : null}</button>; })}</div><div className="mt-6 flex flex-wrap justify-center gap-4"><Button theme={theme} onClick={() => addSelectedDates('weekly')}>Rp/weekly</Button><Button theme={theme} onClick={() => addSelectedDates('monthly')}>Rp/monthly</Button><Button theme={theme} onClick={() => addSelectedDates('yearly')}>Rp/yearly</Button><Button theme={theme} className="border-amber-500 bg-amber-600 text-white" onClick={openExceptionModal}>+ Exception</Button></div><div className={cn('mt-4 text-center', theme.subtle)}>{selectedDateKeys.length} date selected. Hold Shift to multi-select.</div></Card><div className={cn('mt-6 rounded-[18px] border-2 p-6', theme.border)}><div className="text-[20px] font-medium">Exception Schedule</div><div className={cn('mt-2', theme.subtle)}>Building-specific locks that override the regular schedule for individual dates.</div><div className="mt-4 space-y-3">{exceptionEntries.length ? exceptionEntries.map((entry, idx) => <div key={`${entry.key}-${idx}`} className={cn('rounded-[12px] border p-3 text-[16px]', theme.border)}><div className="font-medium">{entry.date}</div><div className={theme.subtle}>Buildings: {entry.buildings.join(', ')}</div><div className={theme.subtle}>Time: {entry.time}</div>{entry.reason ? <div className={theme.subtle}>Reason: {entry.reason}</div> : null}</div>) : <div className={theme.subtle}>No exceptions added yet.</div>}</div></div></div>;
}

function LogsPage({ setPage, theme }) {
  const [sortBy, setSortBy] = useState('Date');
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 20;
  const totalEntries = 120;
  const sortedLogs = [...EVENT_LOGS].sort((a, b) => { if (sortBy === 'Building') return a[3].localeCompare(b[3]); if (sortBy === 'Event') return a[6].localeCompare(b[6]); return b[0].localeCompare(a[0]); });
  const pagedLogs = sortedLogs.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize);
  return <div className="mx-auto max-w-[1450px] p-6"><div className="mb-8 text-[22px] font-medium">Event Logs</div><div className="mb-7 flex flex-wrap items-center gap-4 text-[18px]"><span>Sort by</span><select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPageIndex(0); }} className={cn('rounded-[12px] border-2 px-4 py-3', theme.input)}><option>Date</option><option>Building</option><option>Event</option></select><span>Custom Range</span><span>From</span><input className={cn('rounded-[12px] border-2 px-4 py-3', theme.input)} defaultValue="03/01/2026" /><span>To</span><input className={cn('rounded-[12px] border-2 px-4 py-3', theme.input)} defaultValue="04/17/2026" /><Button theme={theme}>Apply</Button></div><div className={cn('overflow-hidden rounded-[16px] border-2', theme.border)}><table className="w-full border-collapse text-left text-[17px]"><thead className={theme.tableHead}><tr>{['Date & Time', 'Door #', 'Door', 'Bld. Site', 'User/Instant', 'Student', 'Event', 'Lock Door'].map((h) => <th key={h} className="border border-slate-500 px-4 py-4 font-semibold">{h}</th>)}</tr></thead><tbody>{pagedLogs.map((row, idx) => <tr key={idx} className={theme.tableRow}>{row.map((cell, cidx) => <td key={cidx} className="border border-slate-500/40 px-4 py-4">{cell}</td>)}</tr>)}</tbody></table></div><div className="mt-4 flex items-center justify-between gap-4"><div className={theme.subtle}>Showing {pageIndex * pageSize + 1} - {Math.min((pageIndex + 1) * pageSize, totalEntries)} of {totalEntries} entries</div><div className="flex gap-3"><button disabled={pageIndex === 0} onClick={() => setPageIndex((p) => Math.max(0, p - 1))} className={cn('rounded-[12px] border px-6 py-3 text-[18px]', theme.border, pageIndex === 0 ? 'opacity-40' : '')}>Previous</button><button disabled={(pageIndex + 1) * pageSize >= totalEntries} onClick={() => setPageIndex((p) => p + 1)} className={cn('rounded-[12px] border px-6 py-3 text-[18px]', theme.border, (pageIndex + 1) * pageSize >= totalEntries ? 'opacity-40' : '')}>Next</button></div></div><div className="mt-6"><Button theme={theme} onClick={() => setPage('dashboard')}>Back</Button></div></div>;
}

function DoorsPage({ doors, setPage, theme, selectedDoorIds, setSelectedDoorIds, setDoors, setDoorStats }) {
  const [newDoorName, setNewDoorName] = useState('');
  const [newDoorId, setNewDoorId] = useState('');
  const [newDoorBuilding, setNewDoorBuilding] = useState('HSH');
  const toggleRow = (doorId, event) => setSelectedDoorIds((prev) => event?.shiftKey ? (prev.includes(doorId) ? prev.filter((id) => id !== doorId) : [...prev, doorId]) : (prev.includes(doorId) && prev.length === 1 ? [] : [doorId]));
  const updateDoors = (updater) => setDoors((prev) => { const next = updater(prev); setDoorStats(recomputeDoorStats(next)); return next; });
  const applyToSelected = (kind) => { if (!selectedDoorIds.length) return; updateDoors((prev) => prev.map((row) => { if (!selectedDoorIds.includes(row[0])) return row; const next = [...row]; if (kind === 'lock') next[3] = 'Locked'; if (kind === 'unlock') next[3] = 'Unlocked'; if (kind === 'offline') next[4] = 'Offline'; if (kind === 'online') next[4] = 'Online'; return next; })); };
  const addDoor = () => { if (!newDoorName.trim() || !newDoorId.trim()) return; updateDoors((prev) => [...prev, [newDoorId.trim(), newDoorName.trim(), newDoorBuilding, 'Unlocked', 'Online']]); setNewDoorName(''); setNewDoorId(''); };
  const removeSelected = () => { if (!selectedDoorIds.length) return; updateDoors((prev) => prev.filter((row) => !selectedDoorIds.includes(row[0]))); setSelectedDoorIds([]); };
  return <div className="mx-auto max-w-[1450px] p-6"><div className="mb-6 text-[22px] font-medium">Door List</div><div className={cn('max-h-[520px] overflow-y-auto rounded-[16px] border-2', theme.border)}><table className="w-full border-collapse text-left text-[17px]"><thead className={cn(theme.tableHead, 'sticky top-0 z-10')}><tr>{['Door ID', 'Door Name', 'Building', 'State', 'Status'].map((h) => <th key={h} className="border border-slate-500 px-4 py-4 font-semibold">{h}</th>)}</tr></thead><tbody>{doors.map((row) => { const selected = selectedDoorIds.includes(row[0]); return <tr key={row[0]} onClick={(e) => toggleRow(row[0], e)} className={cn(theme.tableRow, 'cursor-pointer', selected && 'bg-amber-500/20')}><td className="border border-slate-500/40 px-4 py-4">{row[0]}</td><td className="border border-slate-500/40 px-4 py-4">{row[1]}</td><td className="border border-slate-500/40 px-4 py-4">{row[2]}</td><td className={cn('border border-slate-500/40 px-4 py-4', row[3] === 'Locked' ? 'text-red-600' : 'text-green-700')}>{row[3]}</td><td className={cn('border border-slate-500/40 px-4 py-4', row[4] === 'Online' ? 'text-green-700' : 'text-red-600')}>{row[4]}</td></tr>; })}</tbody></table></div><div className="mt-6 flex flex-wrap gap-4"><Button theme={theme} onClick={() => applyToSelected('lock')}>Lock</Button><Button theme={theme} onClick={() => applyToSelected('unlock')}>Unlock</Button><Button theme={theme} onClick={() => applyToSelected('offline')}>Offline</Button><Button theme={theme} onClick={() => applyToSelected('online')}>Online</Button></div><div className={cn('mt-7 rounded-[16px] border-2 p-6', theme.border)}><div className="grid gap-4 md:grid-cols-[1fr_150px_160px_auto] md:items-end"><div><div className="mb-2 text-[18px]">Door Name</div><input value={newDoorName} onChange={(e) => setNewDoorName(e.target.value)} className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)} /></div><div><div className="mb-2 text-[18px]">Door ID</div><input value={newDoorId} onChange={(e) => setNewDoorId(e.target.value)} className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)} /></div><div><div className="mb-2 text-[18px]">Door Building</div><select value={newDoorBuilding} onChange={(e) => setNewDoorBuilding(e.target.value)} className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)}><option>HSH</option><option>PCL</option><option>NSW</option><option>DAH</option></select></div><div className="flex gap-3"><Button theme={theme} onClick={addDoor}>Add</Button><Button theme={theme} onClick={removeSelected}>Remove</Button></div></div></div><div className="mt-6"><Button theme={theme} onClick={() => setPage('dashboard')}>Back</Button></div></div>;
}

function AddAlertModal({ onClose, onSend, theme, darkMode }) {
  const [type, setType] = useState('Urgent');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  return <Modal darkMode={darkMode}><div className="mb-4 flex items-start justify-between"><div className="text-[22px] font-medium">Add Alert</div><button onClick={onClose}><Icons.X className="h-8 w-8" /></button></div><div className="space-y-4 text-[18px]"><div><div className="mb-2">Alert type</div><select value={type} onChange={(e) => setType(e.target.value)} className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)}><option>Urgent</option><option>Warning</option><option>Info</option></select></div><div><div className="mb-2">Alert title</div><input value={title} onChange={(e) => setTitle(e.target.value)} className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)} /></div><div><div className="mb-2">Alert message</div><textarea value={message} onChange={(e) => setMessage(e.target.value)} className={cn('min-h-[120px] w-full rounded-[12px] border-2 px-4 py-3', theme.input)} /></div><div className="flex gap-3 pt-2"><Button theme={theme} onClick={onClose}>Cancel</Button><Button theme={theme} onClick={() => onSend(type, title, message)}>Send Alert</Button></div></div></Modal>;
}

function ManageAlertsModal({ alerts, onClose, onDelete, onResolve, theme, darkMode }) {
  return <Modal darkMode={darkMode}><div className="mb-4 flex items-start justify-between"><div className="text-[22px] font-medium">Manage Alerts</div><button onClick={onClose}><Icons.X className="h-8 w-8" /></button></div><div className={cn('rounded-[14px] border-2 p-4', theme.border)}>{alerts.map((a) => <div key={a.id} className="mb-5 flex items-center justify-between gap-4 last:mb-0"><div className="text-[18px]"><span className={a.tone}>{a.label}</span> <span className={theme.subtle}>({a.status})</span></div><div className="flex items-center gap-2"><Button theme={theme} className="px-3 py-2 text-[14px]" onClick={() => onResolve(a.id)}>{a.status === 'resolved' ? 'Reopen' : 'Resolve'}</Button><button onClick={() => onDelete(a.id)}><Icons.Trash2 className="h-5 w-5 text-red-600" /></button></div></div>)}</div><div className="mt-5"><Button theme={theme} onClick={onClose}>Close</Button></div></Modal>;
}

function BuildingsModal({ buildings, onClose, onAdd, onDelete, theme, darkMode }) {
  const [newBuilding, setNewBuilding] = useState('');
  return <Modal darkMode={darkMode}><div className="mb-4 flex items-start justify-between"><div className="text-[22px] font-medium">Modify Buildings</div><button onClick={onClose}><Icons.X className="h-8 w-8" /></button></div><div className={cn('rounded-[14px] border-2 p-4', theme.border)}>{buildings.map((b) => <div key={b.name} className="mb-4 flex items-center justify-between last:mb-0"><div className="text-[18px]">{b.name} <span className={theme.subtle}>({b.status})</span></div><button onClick={() => onDelete(b.name)}><Icons.Trash2 className="h-5 w-5 text-red-600" /></button></div>)}</div><div className="mt-5 flex flex-wrap gap-3"><input value={newBuilding} onChange={(e) => setNewBuilding(e.target.value)} className={cn('min-w-[200px] flex-1 rounded-[12px] border-2 px-4 py-3', theme.input)} /><Button theme={theme} onClick={() => { onAdd(newBuilding); setNewBuilding(''); }}>Add</Button><Button theme={theme} onClick={onClose}>Close</Button></div></Modal>;
}

function MapModal({ onClose, darkMode }) {
  const [zoom, setZoom] = useState(1);
  return <Modal wide darkMode={darkMode}><div className="mb-4 flex items-center justify-between"><div className="text-[22px] font-medium">Campus Map</div><div className="flex items-center gap-4"><button onClick={() => setZoom((z) => Math.max(0.75, z - 0.25))}><Icons.ZoomOut className="h-7 w-7 text-blue-700" /></button><div className="text-[18px]">{Math.round(zoom * 100)}%</div><button onClick={() => setZoom((z) => Math.min(2, z + 0.25))}><Icons.ZoomIn className="h-7 w-7 text-blue-700" /></button><button onClick={() => setZoom(1)}><Icons.RotateCcw className="h-7 w-7 text-blue-700" /></button><button onClick={onClose}><Icons.X className="h-7 w-7" /></button></div></div><div className="overflow-auto rounded border border-slate-400 bg-white p-4"><img src={CAMPUS_MAP_SRC} alt="Oklahoma Christian campus map enlarged" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }} className="mx-auto max-w-full" /></div><div className="mt-3 text-center text-slate-500">Campus map preview</div></Modal>;
}

function ConfirmLockdownModal({ onClose, onConfirm, darkMode }) {
  return <Modal danger darkMode={darkMode}><div className="mx-auto max-w-[460px] rounded-[16px] bg-red-50/85 p-6 text-center text-red-600 shadow"><div className="mb-4 text-[24px] font-medium">Confirm Lockdown</div><div className="space-y-3 text-[18px]"><div>Are you sure you want to initiate a full campus lockdown?</div><div>All doors will be locked.</div><div>All buildings will be secured.</div></div><div className="mt-8 flex items-center justify-center gap-8"><button className="text-[18px] underline" onClick={onClose}>Cancel</button><button className="rounded-[14px] bg-red-600 px-8 py-3 text-[18px] font-semibold text-white" onClick={onConfirm}>Confirm</button></div></div></Modal>;
}

function ExceptionModal({ selectedDateKeys, onClose, onApply, theme, darkMode }) {
  const [selectedBuildings, setSelectedBuildings] = useState([]);
  const [reason, setReason] = useState('');
  const [allDay, setAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('05:00 PM');
  const toggleBuilding = (name) => setSelectedBuildings((prev) => prev.includes(name) ? prev.filter((b) => b !== name) : [...prev, name]);
  return <Modal darkMode={darkMode}><div className="mb-4 text-[22px] font-medium">Add Exception Schedule</div><div className="space-y-5 text-[18px]"><div><div className="mb-2">Selected Dates:</div><div className="flex flex-wrap gap-2">{selectedDateKeys.length ? selectedDateKeys.map((key) => <span key={key} className="rounded bg-slate-200 px-3 py-1 text-slate-900">{formatDateKey(key)}</span>) : <span className={theme.subtle}>No dates selected</span>}</div></div><div><div className="mb-3">Select Buildings to Lock:</div><div className="flex flex-wrap gap-3">{['HSH', 'PCL', 'NSW', 'DAH'].map((name) => <button key={name} type="button" onClick={() => toggleBuilding(name)} className={cn('rounded-[10px] border-2 px-4 py-2', selectedBuildings.includes(name) ? 'border-blue-600 bg-blue-100 text-slate-900' : theme.input)}>{name}</button>)}</div></div><div><div className="mb-2">Reason (optional):</div><input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Maintenance, Special event..." className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)} /></div><label className="flex items-center gap-3"><input checked={allDay} onChange={(e) => setAllDay(e.target.checked)} type="checkbox" /> All Day</label>{!allDay && <div><div className="mb-2">Time Range:</div><div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end"><div><div className={cn('mb-2 text-[16px]', theme.subtle)}>Start</div><input value={startTime} onChange={(e) => setStartTime(e.target.value)} className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)} /></div><div className="pb-3 text-center">to</div><div><div className={cn('mb-2 text-[16px]', theme.subtle)}>End</div><input value={endTime} onChange={(e) => setEndTime(e.target.value)} className={cn('w-full rounded-[12px] border-2 px-4 py-3', theme.input)} /></div></div><div className={cn('mt-2 text-[16px]', theme.subtle)}>{startTime} - {endTime}</div></div>}<div className="flex items-center justify-end gap-4 pt-1"><button className="text-[18px] underline" onClick={onClose}>Cancel</button><button disabled={!selectedDateKeys.length} className={cn('rounded-[12px] px-6 py-3 text-[18px] font-medium', selectedDateKeys.length ? 'bg-amber-300 text-slate-700' : 'bg-amber-200 text-slate-400')} onClick={() => onApply(selectedBuildings, reason, allDay, startTime, endTime)}>Add Exception</button></div></div></Modal>;
}

export default function App() {
  const [page, setPage] = useState('login');
  const [modal, setModal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [doors, setDoors] = useState(INITIAL_DOORS);
  const [selectedDoorIds, setSelectedDoorIds] = useState([]);
  const [buildings, setBuildings] = useState(INITIAL_BUILDINGS);
  const [lockdownActive, setLockdownActive] = useState(false);
  const [doorStats, setDoorStats] = useState(recomputeDoorStats(INITIAL_DOORS));
  const [dashboardLogs, setDashboardLogs] = useState(['7:00 - Door 64 unlocked', '7:00 - Door 63 unlocked', '7:00 - Door 62 unlocked', '7:00 - Door 61 unlocked']);
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedDateKeys, setSelectedDateKeys] = useState([]);
  const [scheduleMap, setScheduleMap] = useState({ '2026-04-10': { locked: true, buildings: [] }, '2026-04-15': { locked: true, buildings: ['HSH', 'PCL'] }, '2026-04-20': { locked: true, buildings: ['DAH'] } });
  const [exceptionEntries, setExceptionEntries] = useState([]);

  const theme = getTheme(darkMode);
  const loggedIn = page !== 'login';
  const openModal = (name) => setModal(name);
  const closeModal = () => setModal(null);
  const scheduleItems = Object.keys(scheduleMap).sort().map((key) => ({ key, label: formatDateKey(key), locked: scheduleMap[key].locked }));

  const addSelectedDates = (mode = 'single') => {
    if (!selectedDateKeys.length) return;
    const month = MONTHS[monthIndex];
    const selectedDays = selectedDateKeys.filter((key) => key.startsWith(`${month.year}-${String(month.month + 1).padStart(2, '0')}-`)).map((key) => Number(key.slice(-2)));
    if (!selectedDays.length) return;
    const allSelectedBlank = selectedDateKeys.every((key) => !scheduleMap[key]);
    setScheduleMap((prev) => {
      const next = { ...prev };
      const addOne = (targetMonth, day, buildings = []) => { if (day >= 1 && day <= targetMonth.days) next[keyForDate(targetMonth, day)] = { locked: true, buildings }; };
      const removeOne = (targetMonth, day) => { if (day >= 1 && day <= targetMonth.days) delete next[keyForDate(targetMonth, day)]; };
      selectedDays.forEach((day) => {
        if (mode === 'single') { addOne(month, day); return; }
        if (mode === 'weekly') { for (let d = day; d <= month.days; d += 7) (allSelectedBlank ? removeOne : addOne)(month, d); return; }
        if (mode === 'monthly' || mode === 'yearly') MONTHS.forEach((m) => (allSelectedBlank ? removeOne : addOne)(m, Math.min(day, m.days)));
      });
      return next;
    });
  };

  const removeSelectedDates = () => {
    if (!selectedDateKeys.length) return;
    setScheduleMap((prev) => {
      const next = { ...prev };
      selectedDateKeys.forEach((key) => delete next[key]);
      return next;
    });
    setSelectedDateKeys([]);
  };

  const applyException = (selectedBuildings, reason, allDay, startTime, endTime) => {
    if (!selectedDateKeys.length) return;
    setScheduleMap((prev) => {
      const next = { ...prev };
      selectedDateKeys.forEach((key) => { next[key] = { locked: true, buildings: selectedBuildings.length ? selectedBuildings : ['EX'], reason, allDay, startTime, endTime }; });
      return next;
    });
    setExceptionEntries((prev) => [...selectedDateKeys.map((key) => ({ key, date: formatDateKey(key), buildings: selectedBuildings.length ? selectedBuildings : ['EX'], reason, time: allDay ? 'All Day' : `${startTime} - ${endTime}` })), ...prev]);
    closeModal();
  };

  const sendAlert = (type, title, message) => {
    const label = title.trim() || message.trim() || type;
    const tone = type === 'Urgent' ? 'text-red-600' : type === 'Warning' ? 'text-amber-500' : 'text-white';
    setAlerts((prev) => [...prev, { id: Date.now(), label, status: 'active', tone, type }]);
    closeModal();
  };
  const resolveAlert = (id) => setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: a.status === 'resolved' ? 'active' : 'resolved' } : a));
  const deleteAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));
  const addBuilding = (name) => { const trimmed = name.trim().toUpperCase(); if (!trimmed || buildings.some((b) => b.name === trimmed)) return; setBuildings((prev) => [...prev, { name: trimmed, status: 'unlocked' }]); };
  const deleteBuilding = (name) => setBuildings((prev) => prev.filter((b) => b.name !== name));
  const toggleBuildingStatus = (name) => setBuildings((prev) => prev.map((b) => (b.name === name ? { ...b, status: b.status === 'locked' ? 'unlocked' : 'locked' } : b)));

  const confirmLockdown = () => {
    setLockdownActive(true);
    setBuildings((prev) => prev.map((b) => ({ ...b, status: 'locked' })));
    setDoors((prev) => { const next = prev.map((row) => [row[0], row[1], row[2], 'Locked', row[4]]); setDoorStats(recomputeDoorStats(next)); return next; });
    setDashboardLogs(['7:12 PM - Emergency contacts notified', '7:12 PM - All buildings secured', '7:12 PM - LOCKDOWN INITIATED - All doors locked']);
    setAlerts((prev) => prev.some((a) => a.label === 'LOCKDOWN INITIATED') ? prev.map((a) => (a.label === 'LOCKDOWN INITIATED' ? { ...a, status: 'active', tone: 'text-red-600' } : a)) : [...prev, { id: 999, label: 'LOCKDOWN INITIATED', status: 'active', tone: 'text-red-600', type: 'Urgent' }]);
    closeModal();
  };

  const clearLockdown = () => {
    setLockdownActive(false);
    setBuildings((prev) => prev.map((b) => ({ ...b, status: 'unlocked' })));
    setDoors((prev) => { const next = prev.map((row) => [row[0], row[1], row[2], 'Unlocked', row[4]]); setDoorStats(recomputeDoorStats(next)); return next; });
    setDashboardLogs(['7:15 PM - ALL CLEAR issued', '7:15 PM - Lockdown revoked', '7:15 PM - All doors unlocked']);
    setAlerts((prev) => prev.filter((a) => a.label !== 'LOCKDOWN INITIATED'));
  };

  return <div className={cn('min-h-screen', theme.app)}><Header page={page} setPage={setPage} loggedIn={loggedIn} theme={theme} darkMode={darkMode} />{page === 'login' && <LoginPage onLogin={() => setPage('dashboard')} theme={theme} />}{page === 'dashboard' && <Dashboard buildings={buildings} alerts={alerts} doorStats={doorStats} logs={dashboardLogs} scheduleItems={scheduleItems} setPage={setPage} openModal={openModal} triggerLockdown={() => setModal('confirmLockdown')} clearLockdown={clearLockdown} lockdownActive={lockdownActive} theme={theme} toggleBuildingStatus={toggleBuildingStatus} />}{page === 'settings' && <SettingsPage setPage={setPage} darkMode={darkMode} setDarkMode={setDarkMode} theme={theme} />}{page === 'schedule' && <SchedulePage monthIndex={monthIndex} setMonthIndex={setMonthIndex} scheduleMap={scheduleMap} selectedDateKeys={selectedDateKeys} setSelectedDateKeys={setSelectedDateKeys} addSelectedDates={addSelectedDates} removeSelectedDates={removeSelectedDates} openExceptionModal={() => openModal('exceptionSchedule')} exceptionEntries={exceptionEntries} theme={theme} />}{page === 'logs' && <LogsPage setPage={setPage} theme={theme} />}{page === 'doors' && <DoorsPage doors={doors} setPage={setPage} theme={theme} selectedDoorIds={selectedDoorIds} setSelectedDoorIds={setSelectedDoorIds} setDoors={setDoors} setDoorStats={setDoorStats} />}
    <AnimatePresence>
      {modal === 'addAlert' && <AddAlertModal onClose={closeModal} onSend={sendAlert} theme={theme} darkMode={darkMode} />}
      {modal === 'manageAlerts' && <ManageAlertsModal alerts={alerts} onClose={closeModal} onDelete={deleteAlert} onResolve={resolveAlert} theme={theme} darkMode={darkMode} />}
      {modal === 'buildings' && <BuildingsModal buildings={buildings} onClose={closeModal} onAdd={addBuilding} onDelete={deleteBuilding} theme={theme} darkMode={darkMode} />}
      {modal === 'map' && <MapModal onClose={closeModal} darkMode={darkMode} />}
      {modal === 'confirmLockdown' && <ConfirmLockdownModal onClose={closeModal} onConfirm={confirmLockdown} darkMode={darkMode} />}
      {modal === 'exceptionSchedule' && <ExceptionModal selectedDateKeys={selectedDateKeys} onClose={closeModal} onApply={applyException} theme={theme} darkMode={darkMode} />}
    </AnimatePresence>
  </div>;
}
