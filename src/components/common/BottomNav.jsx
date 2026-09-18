import React from 'react';
import { Home, Calendar, BookOpen, FileText, User, Users, CheckSquare, BarChart2, DollarSign, UserCheck } from 'lucide-react';

export default function BottomNav({ role, activeTab, setActiveTab }) {
  // Define nav configurations per role based on ASPIRE THEME.png
  const navConfigs = {
    student: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'classes', label: 'Classes', icon: Calendar },
      { id: 'tests', label: 'Tests', icon: FileText },
      { id: 'materials', label: 'Materials', icon: BookOpen },
      { id: 'profile', label: 'Profile', icon: User }
    ],
    teacher: [
      { id: 'home', label: 'Dashboard', icon: Home },
      { id: 'batches', label: 'Batches', icon: Users },
      { id: 'attendance', label: 'Attendance', icon: CheckSquare },
      { id: 'performance', label: 'Performance', icon: BarChart2 },
      { id: 'profile', label: 'Profile', icon: User }
    ],
    parent: [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'child', label: 'Child', icon: User },
      { id: 'performance', label: 'Performance', icon: BarChart2 },
      { id: 'fees', label: 'Fees', icon: DollarSign },
      { id: 'profile', label: 'Profile', icon: User }
    ],
    admin: [
      { id: 'home', label: 'Dashboard', icon: Home },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'teachers', label: 'Teachers', icon: UserCheck },
      { id: 'batches', label: 'Batches', icon: BookOpen },
      { id: 'profile', label: 'Settings', icon: User }
    ]
  };

  const tabs = navConfigs[role] || navConfigs.student;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxWidth: '480px',
      margin: '0 auto',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: '8px 4px 14px 4px',
      zIndex: 40,
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.05)'
    }}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              color: isActive ? 'var(--brand-800)' : 'var(--text-muted)',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span style={{
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              marginTop: '4px'
            }}>
              {tab.label}
            </span>
            {isActive && (
              <span style={{
                position: 'absolute',
                bottom: '0px',
                width: '16px',
                height: '3px',
                background: 'var(--brand-800)',
                borderRadius: '9999px'
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
