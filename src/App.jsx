import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Lock,
  LogOut,
  Map,
  Minus,
  Plus,
  Search,
  Settings,
  Shield,
  Trash2,
  Unlock,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

const initialBuildings = [
  { id: 'b1', name: 'HSH', locked: false },
  { id: 'b2', name: 'PCL', locked: false },
  { id: 'b3', name: 'NSW', locked: false },
  { id: 'b4', name: 'DAH', locked: true },
];

const initialAlerts = [
  { id: 'a1', title: 'Intruder', status: 'resolved', tone: 'danger' },
  { id: 'a2', title: 'Fire Alarm', status: 'resolved', tone: 'warning' },
];

const initialLogs = [
  '7:00 - Door 64 unlocked',
  '7:00 - Door 63 unlocked',
  '7:00 - Door 62 unlocked',
  '7:00 - Door 61 unlocked',
];

const initialSchedule = [
  { day: 10, label: 'Apr 10', kind: 'lock' },
  { day: 15, label: 'HSH PCL', kind: 'building' },
  { day: 20, label: 'DAH', kind: 'building' },
];

const initialDoors = [
  ['D-001', 'Main Entrance', 'HSH', 'Unlocked', 'Online'],
  ['D-002', 'Side Exit', 'HSH', 'Unlocked', 'Online'],
  ['D-003', 'Lab Door', 'HSH', 'Unlocked', 'Online'],
  ['D-004', 'Office Door', 'HSH', 'Unlocked', 'Online'],
  ['D-005', 'Hallway Gate', 'HSH', 'Unlocked', 'Online'],
  ['D-006', 'Emergency Exit', 'HSH', 'Unlocked', 'Online'],
  ['D-007', 'Classroom Door', 'HSH', 'Unlocked', 'Online'],
  ['D-008', 'Storage Room', 'HSH', 'Unlocked', 'Online'],
  ['D-020', 'Cafeteria', 'PCL', 'Unlocked', 'Online'],
  ['D-027', 'Cafeteria', 'DAH', 'Unlocked', 'Online'],
  ['D-032', 'Emergency Exit', 'HSH', 'Unlocked', 'Online'],
  ['D-042', 'Emergency Exit', 'NSW', 'Locked', 'Online'],
  ['D-051', 'Emergency Exit', 'HSH', 'Locked', 'Online'],
  ['D-064', 'Auditorium', 'NSW', 'Locked', 'Online'],
  ['D-070', 'Emergency Exit', 'NSW', 'Locked', 'Online'],
].map(([id, name, building, state, status]) => ({ id, name, building, state, status }));

const eventLogRows = [
  ['03/30/2026 7:00 AM', 'D-020', 'Cafeteria', 'PCL', 'Officer Miller', 'M. Johnson', 'Badge Scan', 'Unlocked'],
  ['03/30/2026 6:16 AM', 'D-064', 'Auditorium', 'NSW', 'Officer Miller', 'S. Lee', 'Access Denied', 'Locked'],
  ['03/30/2026 5:51 AM', 'D-009', 'Main Entrance', 'HSH', 'Officer Williams', '-', 'Badge Scan', 'Locked'],
  ['03/30/2026 5:46 AM', 'D-009', 'Side Exit', 'PCL', 'Officer Smith', 'K. Nguyen', 'Lock', 'Locked'],
  ['03/30/2026 5:06 AM', 'D-051', 'Emergency Exit', 'HSH', 'System Auto', 'J. Martinez', 'Unlock', 'Locked'],
  ['03/30/2026 4:35 AM', 'D-032', 'Emergency Exit', 'HSH', 'Officer Davis', '-', 'Unlock', 'Unlocked'],
  ['03/30/2026 4:18 AM', 'D-042', 'Emergency Exit', 'NSW', 'System Auto', 'S. Lee', 'Key Card Entry', 'Locked'],
  ['03/30/2026 4:04 AM', 'D-070', 'Emergency Exit', 'NSW', 'Officer Garcia', '-', 'Badge Scan', 'Locked'],
  ['03/30/2026 3:47 AM', 'D-012', 'Office Door', 'NSW', 'Officer Brown', '-', 'Auto Unlock', 'Locked'],
  ['03/30/2026 3:06 AM', 'D-014', 'Side Exit', 'NSW', 'Officer Brown', 'R. Patel', 'Key Card Entry', 'Locked'],
  ['03/30/2026 3:00 AM', 'D-013', 'Cafeteria', 'DAH', 'Officer Davis', 'R. Patel', 'Forced Entry Alert', 'Locked'],
  ['03/30/2026 2:36 AM', 'D-027', 'Cafeteria', 'DAH', 'Officer Miller', '-', 'Key Card Entry', 'Unlocked'],
  ['03/30/2026 1:56 AM', 'D-022', 'Hallway Gate', 'NSW', 'Officer Brown', '-', 'Key Card Entry', 'Locked'],
].map(([dateTime, doorId, door, building, user, student, event, lockDoor]) => ({
  dateTime,
  doorId,
  door,
  building,
  user,
  student,
  event,
  lockDoor,
}));

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calendarCells = [null, null, null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

function App() {
  const [page, setPage] = useState('login');
  const [alerts, setAlerts] = useState(initialAlerts);
  const [buildings, setBuildings] = useState(initialBuildings);
  const [dashboardLogs, setDashboardLogs] = useState(initialLogs);
  const [scheduleItems, setScheduleItems] = useState(initialSchedule);
  const [doors, setDoors] = useState(initialDoors);
  const [selectedDoorIds, setSelectedDoorIds] = useState([]);
  const [doorForm, setDoorForm] = useState({ name: '', id: '', building: 'HSH' });
  const [mapZoom, setMapZoom] = useState(1);
  const [selectedScheduleDay, setSelectedScheduleDay] = useState(11);
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showManageAlerts, setShowManageAlerts] = useState(false);
  const [showBuildings, setShowBuildings] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showLockdown, setShowLockdown] = useState(false);
  const [alertForm, setAlertForm] = useState({ type: 'Urgent', title: '', message: '', staff: false, students: false });
  const [newBuildingName, setNewBuildingName] = useState('');
  const [lockdownInitiated, setLockdownInitiated] = useState(false);

  const doorCounts = useMemo(() => {
    const online = doors.filter((door) => door.status === 'Online').length;
    const offline = doors.filter((door) => door.status === 'Offline').length;
    const locked = doors.filter((door) => door.state === 'Locked').length;
    const unlocked = doors.filter((door) => door.state === 'Unlocked').length;
    return { online, offline, locked, unlocked };
  }, [doors]);

  const upcomingLocks = useMemo(
    () => scheduleItems.filter((item) => item.kind === 'lock').map((item) => item.label),
    [scheduleItems]
  );

  const breadcrumb = useMemo(() => {
    if (page === 'settings') return 'Home/Settings';
    if (page === 'schedule') return 'Home/Schedule';
    if (page === 'logs') return 'Home/View Logs';
    if (page === 'doors') return 'Home/Modify Doors';
    return 'Dashboard';
  }, [page]);

  const addAlert = () => {
    const title = alertForm.title.trim();
    if (!title) return;
    setAlerts((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        title,
        status: 'active',
        tone: alertForm.type === 'Urgent' ? 'danger' : alertForm.type === 'Warning' ? 'warning' : 'info',
      },
    ]);
    setAlertForm({ type: 'Urgent', title: '', message: '', staff: false, students: false });
    setShowAddAlert(false);
  };

  const addBuilding = () => {
    const name = newBuildingName.trim().toUpperCase();
    if (!name) return;
    setBuildings((current) => [...current, { id: crypto.randomUUID(), name, locked: false }]);
    setNewBuildingName('');
  };

  const deleteBuilding = (id) => {
    setBuildings((current) => current.filter((building) => building.id !== id));
  };

  const deleteAlert = (id) => {
    setAlerts((current) => current.filter((alert) => alert.id !== id));
  };

  const setAllBuildingsLocked = (locked) => {
    setBuildings((current) => current.map((building) => ({ ...building, locked })));
  };

  const toggleDoorSelection = (id) => {
    setSelectedDoorIds((current) =>
      current.includes(id) ? current.filter((doorId) => doorId !== id) : [...current, id]
    );
  };

  const updateSelectedDoors = (updates) => {
    setDoors((current) =>
      current.map((door) => (selectedDoorIds.includes(door.id) ? { ...door, ...updates } : door))
    );
  };

  const addDoor = () => {
    if (!doorForm.name.trim() || !doorForm.id.trim()) return;
    setDoors((current) => [
      ...current,
      {
        id: doorForm.id.trim().toUpperCase(),
        name: doorForm.name.trim(),
        building: doorForm.building,
        state: 'Unlocked',
        status: 'Online',
      },
    ]);
    setDoorForm({ name: '', id: '', building: 'HSH' });
  };

  const removeSelectedDoors = () => {
    setDoors((current) => current.filter((door) => !selectedDoorIds.includes(door.id)));
    setSelectedDoorIds([]);
  };

  const applyLockdown = () => {
    setLockdownInitiated(true);
    setAllBuildingsLocked(true);
    setDoors((current) => current.map((door) => ({ ...door, state: 'Locked', status: 'Online' })));
    setAlerts((current) => {
      const withoutExisting = current.filter((alert) => alert.title !== 'LOCKDOWN INITIATED');
      return [...withoutExisting, { id: crypto.randomUUID(), title: 'LOCKDOWN INITIATED', status: 'active', tone: 'danger' }];
    });
    setDashboardLogs([
      '7:12 PM - Emergency contacts notified',
      '7:12 PM - All buildings secured',
      '7:12 PM - LOCKDOWN INITIATED - All doors locked',
    ]);
    setShowLockdown(false);
  };

  return (
    <div className="app-shell">
      <Header
        page={page}
        breadcrumb={breadcrumb}
        onHome={() => setPage('dashboard')}
        onSettings={() => setPage('settings')}
        onLogout={() => setPage('login')}
      />

      {page === 'login' && <LoginView onLogin={() => setPage('dashboard')} />}
      {page === 'dashboard' && (
        <DashboardView
          alerts={alerts}
          buildings={buildings}
          dashboardLogs={dashboardLogs}
          upcomingLocks={upcomingLocks}
          lockdownInitiated={lockdownInitiated}
          doorCounts={doorCounts}
          onGoSchedule={() => setPage('schedule')}
          onShowAddAlert={() => setShowAddAlert(true)}
          onShowManageAlerts={() => setShowManageAlerts(true)}
          onShowBuildings={() => setShowBuildings(true)}
          onShowMap={() => setShowMap(true)}
          onGoLogs={() => setPage('logs')}
          onGoDoors={() => setPage('doors')}
          onUnlockAll={() => setAllBuildingsLocked(false)}
          onLockAll={() => setAllBuildingsLocked(true)}
          onInitiateLockdown={() => setShowLockdown(true)}
        />
      )}
      {page === 'settings' && <SettingsView onBack={() => setPage('dashboard')} />}
      {page === 'schedule' && (
        <ScheduleView
          scheduleItems={scheduleItems}
          selectedDay={selectedScheduleDay}
          onSelectDay={setSelectedScheduleDay}
          onAddLock={() => {
            const exists = scheduleItems.some((item) => item.day === selectedScheduleDay && item.kind === 'lock');
            if (!exists) {
              setScheduleItems((current) => [
                ...current,
                { day: selectedScheduleDay, label: `Apr ${selectedScheduleDay}`, kind: 'lock' },
              ]);
            }
          }}
          onRemoveLock={() => {
            setScheduleItems((current) =>
              current.filter((item) => !(item.day === selectedScheduleDay && item.kind === 'lock'))
            );
          }}
        />
      )}
      {page === 'logs' && <LogsView rows={eventLogRows} />}
      {page === 'doors' && (
        <DoorsView
          doors={doors}
          selectedDoorIds={selectedDoorIds}
          doorForm={doorForm}
          onSelectDoor={toggleDoorSelection}
          onBack={() => setPage('dashboard')}
          onChangeDoorForm={setDoorForm}
          onLock={() => updateSelectedDoors({ state: 'Locked' })}
          onUnlock={() => updateSelectedDoors({ state: 'Unlocked' })}
          onOffline={() => updateSelectedDoors({ status: 'Offline' })}
          onOnline={() => updateSelectedDoors({ status: 'Online' })}
          onAddDoor={addDoor}
          onRemoveDoor={removeSelectedDoors}
        />
      )}

      {showAddAlert && (
        <Modal title="Add Alert" onClose={() => setShowAddAlert(false)}>
          <div className="form-grid">
            <Field label="Alert type">
              <select value={alertForm.type} onChange={(event) => setAlertForm({ ...alertForm, type: event.target.value })}>
                <option>Urgent</option>
                <option>Warning</option>
                <option>Info</option>
              </select>
            </Field>
            <Field label="Alert title">
              <input
                value={alertForm.title}
                onChange={(event) => setAlertForm({ ...alertForm, title: event.target.value })}
              />
            </Field>
            <Field label="Alert message">
              <textarea
                rows="5"
                value={alertForm.message}
                onChange={(event) => setAlertForm({ ...alertForm, message: event.target.value })}
              />
            </Field>
            <div className="checkbox-row">
              <label><input type="checkbox" checked={alertForm.staff} onChange={(event) => setAlertForm({ ...alertForm, staff: event.target.checked })} /> Send notifications to Staff</label>
              <label><input type="checkbox" checked={alertForm.students} onChange={(event) => setAlertForm({ ...alertForm, students: event.target.checked })} /> Send notifications to Students</label>
            </div>
            <div className="modal-actions left">
              <Button variant="default" onClick={() => setShowAddAlert(false)}>Cancel</Button>
              <Button variant="default" onClick={addAlert}>Send Alert</Button>
            </div>
          </div>
        </Modal>
      )}

      {showManageAlerts && (
        <Modal title="Manage Alerts" onClose={() => setShowManageAlerts(false)}>
          <div className="list-box compact-list">
            {alerts.map((alert) => (
              <div key={alert.id} className="list-row spread">
                <span className={`tone-${alert.tone}`}>{alert.title} <span className="muted">({alert.status})</span></span>
                <button className="icon-button" onClick={() => deleteAlert(alert.id)} aria-label={`Delete ${alert.title}`}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          <div className="modal-actions left single">
            <Button variant="default" onClick={() => setShowManageAlerts(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {showBuildings && (
        <Modal title="Modify Buildings" onClose={() => setShowBuildings(false)}>
          <div className="list-box compact-list">
            {buildings.map((building) => (
              <div key={building.id} className="list-row spread">
                <span>
                  {building.name} <span className="muted">({building.locked ? 'locked' : 'unlocked'})</span>
                </span>
                <button className="icon-button" onClick={() => deleteBuilding(building.id)} aria-label={`Delete ${building.name}`}>
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          <div className="inline-form">
            <input value={newBuildingName} onChange={(event) => setNewBuildingName(event.target.value)} />
            <Button variant="default" onClick={addBuilding}>Add</Button>
            <Button variant="default" onClick={() => setShowBuildings(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {showMap && (
        <Modal title="Campus Map" onClose={() => setShowMap(false)} wide>
          <div className="map-toolbar">
            <button className="tool-chip" onClick={() => setMapZoom((value) => Math.max(0.5, Number((value - 0.1).toFixed(2))))}><ZoomOut size={18} /></button>
            <span className="zoom-label">{Math.round(mapZoom * 100)}%</span>
            <button className="tool-chip" onClick={() => setMapZoom((value) => Math.min(2.2, Number((value + 0.1).toFixed(2))))}><ZoomIn size={18} /></button>
            <button className="tool-chip" onClick={() => setMapZoom(1)}><Search size={18} /></button>
          </div>
          <div className="map-stage">
            <img src="./campus-map.png" alt="Campus map" style={{ transform: `scale(${mapZoom})` }} />
          </div>
          <p className="map-hint">Scroll to zoom · Drag to pan when zoomed in</p>
        </Modal>
      )}

      {showLockdown && (
        <div className="overlay danger-overlay">
          <div className="danger-modal">
            <h2>Confirm Lockdown</h2>
            <p>Are you sure you want to initiate a full campus lockdown?</p>
            <p>All doors will be locked.</p>
            <p>All buildings will be secured.</p>
            <div className="danger-actions">
              <button className="text-link" onClick={() => setShowLockdown(false)}>Cancel</button>
              <button className="danger-button" onClick={applyLockdown}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Header({ page, breadcrumb, onHome, onSettings, onLogout }) {
  if (page === 'login') {
    return <header className="topbar center">School LockDown System</header>;
  }

  return (
    <header className="topbar">
      <div className="brand-group">
        <Shield size={36} />
        <span>School LockDown System</span>
        <span className="divider">|</span>
        <span>Welcome Officer, lance</span>
        <span className="divider">|</span>
        <span>{breadcrumb}</span>
        <span className="divider">|</span>
        <span>Tuesday, April 14, 2026</span>
      </div>
      <div className="top-actions">
        <Button variant="ghost" onClick={onHome}>Home</Button>
        <Button variant="ghost" onClick={onSettings}>Settings</Button>
        <Button variant="danger" onClick={onLogout}>Logout</Button>
      </div>
    </header>
  );
}

function LoginView({ onLogin }) {
  return (
    <main className="login-page">
      <div className="login-card">
        <div className="logo-circle">
          <div className="logo-bars">|||</div>
          <div className="logo-script">Lockdown</div>
          <div className="logo-small">SLOGAN</div>
        </div>
        <input placeholder="Username" />
        <input placeholder="Password" type="password" />
        <div className="login-actions">
          <button className="primary-button" onClick={onLogin}>Login</button>
        </div>
      </div>
    </main>
  );
}

function DashboardView({
  alerts,
  buildings,
  dashboardLogs,
  upcomingLocks,
  lockdownInitiated,
  doorCounts,
  onGoSchedule,
  onShowAddAlert,
  onShowManageAlerts,
  onShowBuildings,
  onShowMap,
  onGoLogs,
  onGoDoors,
  onUnlockAll,
  onLockAll,
  onInitiateLockdown,
}) {
  return (
    <main className="page page-dashboard">
      <div className="dashboard-grid">
        <Panel title="Lock Schedule">
          <div className="centered-action"><Button variant="default" onClick={onGoSchedule}>View Schedule</Button></div>
          <div className="section-title">Upcoming Locks — April 2026</div>
          <div className="list-box">
            {upcomingLocks.length ? upcomingLocks.map((lockLabel) => (
              <span key={lockLabel} className="pill"><Lock size={14} /> {lockLabel}</span>
            )) : <span className="muted">No locks scheduled this month</span>}
          </div>
        </Panel>

        <Panel title="ALERTS">
          <div className="button-row centered">
            <Button variant="default" onClick={onShowAddAlert}>Add Alerts</Button>
            <Button variant="default" onClick={onShowManageAlerts}>Manage Alerts</Button>
          </div>
          <div className="list-box">
            {alerts.map((alert) => (
              <div key={alert.id} className="list-row spread">
                <span className={`tone-${alert.tone}`}>{alert.title}</span>
                <span className={alert.status === 'active' ? 'tone-danger' : 'tone-success'}>{alert.status}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Buildings">
          <div className="list-box">
            {buildings.map((building) => (
              <div key={building.id} className="list-row spread">
                <span>{building.name}</span>
                <span className={building.locked ? 'tone-danger' : 'tone-success'}>{building.locked ? 'locked' : 'unlocked'}</span>
              </div>
            ))}
          </div>
          <div className="button-row left">
            <Button variant="default" onClick={onUnlockAll}>Unlock</Button>
            <Button variant="default" onClick={onLockAll}>Lock</Button>
            <Button variant="default" onClick={onShowBuildings}>Modify Buildings</Button>
          </div>
        </Panel>

        <Panel title="Access Logs">
          <div className="centered-action"><Button variant="default" onClick={onGoLogs}>View Logs</Button></div>
          <div className="list-box">
            {dashboardLogs.map((log) => <div key={log} className="list-row">{log}</div>)}
          </div>
        </Panel>

        <Panel title="Lockdown Doors">
          <div className="centered-action"><Button variant="default" onClick={onGoDoors}>Modify Doors</Button></div>
          <div className="list-box metrics">
            <div className="list-row spread"><span>Doors online</span><span className="tone-success">{doorCounts.online}</span></div>
            <div className="list-row spread"><span>Doors offline</span><span className="tone-danger">{doorCounts.offline}</span></div>
            <div className="list-row spread"><span>Doors unlocked</span><span className="tone-success">{doorCounts.unlocked}</span></div>
            <div className="list-row spread"><span>Doors locked</span><span className="tone-danger">{doorCounts.locked}</span></div>
          </div>
          <div className="button-stack">
            <button className="large-green">Unlock Campus</button>
            <button className="large-red" onClick={onInitiateLockdown}>{lockdownInitiated ? 'Lockdown Active' : 'Initiate Lockdown'}</button>
          </div>
        </Panel>

        <Panel title="Campus Map">
          <button className="map-preview-button" onClick={onShowMap}>
            <img src="./campus-map.png" alt="Campus map preview" />
            <span>Click map to enlarge</span>
          </button>
        </Panel>
      </div>
    </main>
  );
}

function SettingsView({ onBack }) {
  return (
    <main className="page narrow-page">
      <div className="page-action-row"><Button variant="default" onClick={onBack}>Back to Dashboard</Button></div>
      <Panel title="Settings">
        <SettingsSection title="Notifications">
          <ToggleRow title="Push Notifications" subtitle="Receive alerts on this device" enabled />
          <ToggleRow title="Email Alerts" subtitle="Send alert summaries to your email" />
          <ToggleRow title="Sound Alerts" subtitle="Play sound for urgent alerts" enabled />
        </SettingsSection>
        <SettingsSection title="Security">
          <SelectRow title="Auto-Lock Timeout (minutes)" subtitle="Automatically lock doors after inactivity" value="30" />
          <SelectRow title="Session Timeout (minutes)" subtitle="Auto-logout after inactivity" value="60" />
        </SettingsSection>
        <SettingsSection title="System">
          <SelectRow title="Display Theme" subtitle="Choose interface appearance" value="Light" />
          <SelectRow title="Log Retention (days)" subtitle="Control how long logs are stored" value="90" />
        </SettingsSection>
      </Panel>
    </main>
  );
}

function ScheduleView({ scheduleItems, selectedDay, onSelectDay, onAddLock, onRemoveLock }) {
  return (
    <main className="page narrow-page">
      <Panel title="April 2026">
        <div className="schedule-toolbar">
          <div className="button-row left">
            <Button variant="default"><ChevronLeft size={18} /></Button>
            <Button variant="default"><ChevronRight size={18} /></Button>
          </div>
          <div className="button-row left">
            <Button variant="default" onClick={onAddLock}>Add</Button>
            <Button variant="default" onClick={onRemoveLock}>Remove</Button>
          </div>
        </div>
        <div className="calendar-grid weekday-row">
          {weekDays.map((day) => <div key={day} className="calendar-head">{day}</div>)}
        </div>
        <div className="calendar-grid">
          {calendarCells.map((day, index) => {
            const entry = scheduleItems.filter((item) => item.day === day);
            const selected = day === selectedDay;
            return (
              <button
                key={`${day ?? 'blank'}-${index}`}
                className={`calendar-cell ${selected ? 'selected-day' : ''}`}
                onClick={() => day && onSelectDay(day)}
                disabled={!day}
              >
                {day && <div className="calendar-date">{day}</div>}
                {entry.map((item) => (
                  <div key={`${item.day}-${item.label}`} className={`calendar-tag ${item.kind === 'lock' ? 'lock-tag' : 'building-tag'}`}>
                    {item.kind === 'lock' ? <Lock size={11} /> : null}
                    {item.label}
                  </div>
                ))}
              </button>
            );
          })}
        </div>
        <div className="button-row centered wrap-gap">
          <Button variant="default">Rp/weekly</Button>
          <Button variant="default">Rp/monthly</Button>
          <Button variant="default">Rp/yearly</Button>
          <Button variant="accent">+ Exception</Button>
        </div>
        <p className="helper-text">1 date selected (Hold Shift or ⌘/Ctrl to select multiple)</p>
      </Panel>
      <Panel title="Exception Schedule">
        <p className="muted">Building-specific locks that override the regular schedule for individual dates.</p>
      </Panel>
    </main>
  );
}

function LogsView({ rows }) {
  return (
    <main className="page page-logs">
      <div className="logs-toolbar">
        <span className="logs-title">Event Logs</span>
        <div className="filter-row">
          <label>Sort by</label>
          <select><option>Date</option></select>
          <span>Custom Range</span>
          <label>From</label>
          <input type="text" value="03/01/2026" readOnly />
          <label>To</label>
          <input type="text" value="04/17/2026" readOnly />
          <Button variant="default">Apply</Button>
        </div>
      </div>
      <div className="table-card">
        <div className="table-wrap wide-table">
          <table>
            <thead>
              <tr>
                <th>Date &amp; Time</th>
                <th>Door #</th>
                <th>Door</th>
                <th>Bld. Site</th>
                <th>User/Instant</th>
                <th>Student</th>
                <th>Event</th>
                <th>Lock Door</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.dateTime}-${row.doorId}-${row.event}`}>
                  <td>{row.dateTime}</td>
                  <td>{row.doorId}</td>
                  <td>{row.door}</td>
                  <td>{row.building}</td>
                  <td>{row.user}</td>
                  <td>{row.student}</td>
                  <td>{row.event}</td>
                  <td>{row.lockDoor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function DoorsView({
  doors,
  selectedDoorIds,
  doorForm,
  onSelectDoor,
  onBack,
  onChangeDoorForm,
  onLock,
  onUnlock,
  onOffline,
  onOnline,
  onAddDoor,
  onRemoveDoor,
}) {
  return (
    <main className="page page-doors">
      <div className="door-header-row">
        <div className="logs-title">Door List</div>
        <Button variant="default" onClick={onBack}>Back to Dashboard</Button>
      </div>
      <div className="table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Door ID</th>
                <th>Door Name</th>
                <th>Building</th>
                <th>State</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {doors.map((door) => (
                <tr
                  key={door.id}
                  className={selectedDoorIds.includes(door.id) ? 'selected-row' : ''}
                  onClick={() => onSelectDoor(door.id)}
                >
                  <td>{door.id}</td>
                  <td>{door.name}</td>
                  <td>{door.building}</td>
                  <td className={door.state === 'Locked' ? 'tone-danger' : 'tone-success'}>{door.state}</td>
                  <td className={door.status === 'Online' ? 'tone-success' : 'tone-danger'}>{door.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="button-row left wrap-gap action-block">
        <Button variant="default" onClick={onLock}>Lock</Button>
        <Button variant="default" onClick={onUnlock}>Unlock</Button>
        <Button variant="default" onClick={onOffline}>Offline</Button>
        <Button variant="default" onClick={onOnline}>Online</Button>
      </div>
      <div className="door-form-card">
        <div className="door-form-grid">
          <Field label="Door Name">
            <input value={doorForm.name} onChange={(event) => onChangeDoorForm({ ...doorForm, name: event.target.value })} />
          </Field>
          <Field label="Door ID">
            <input value={doorForm.id} onChange={(event) => onChangeDoorForm({ ...doorForm, id: event.target.value })} />
          </Field>
          <Field label="Door Building">
            <select value={doorForm.building} onChange={(event) => onChangeDoorForm({ ...doorForm, building: event.target.value })}>
              <option>HSH</option>
              <option>PCL</option>
              <option>NSW</option>
              <option>DAH</option>
            </select>
          </Field>
        </div>
        <div className="button-row left wrap-gap top-gap">
          <Button variant="default" onClick={onAddDoor}>Add</Button>
          <Button variant="default" onClick={onRemoveDoor}>Remove</Button>
        </div>
      </div>
    </main>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Modal({ title, onClose, wide, children }) {
  return (
    <div className="overlay">
      <div className={`modal-card ${wide ? 'wide' : ''}`}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="icon-button" onClick={onClose} aria-label="Close modal"><X size={24} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Button({ children, variant, onClick }) {
  return (
    <button className={`button ${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

function SettingsSection({ title, children }) {
  return (
    <section className="settings-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ToggleRow({ title, subtitle, enabled = false }) {
  return (
    <div className="settings-row">
      <div>
        <div>{title}</div>
        <div className="muted">{subtitle}</div>
      </div>
      <div className={`toggle ${enabled ? 'enabled' : ''}`}><span /></div>
    </div>
  );
}

function SelectRow({ title, subtitle, value }) {
  return (
    <div className="settings-row select-row">
      <div>
        <div>{title}</div>
        <div className="muted">{subtitle}</div>
      </div>
      <select value={value} readOnly>
        <option>{value}</option>
      </select>
    </div>
  );
}

export default App;
