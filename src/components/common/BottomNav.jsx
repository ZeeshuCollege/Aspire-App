import React from 'react';
import { Home, Calendar, BookOpen, FileText, User, Users, CheckSquare, BarChart2, DollarSign, UserCheck, UserPlus } from 'lucide-react';

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
      { id: 'parents', label: 'Parents', icon: UserCheck },
      { id: 'teachers', label: 'Teachers', icon: UserPlus },
      { id: 'batches', label: 'Batches', icon: BookOpen },
      { id: 'profile', label: 'Settings', icon: User }
    ]
  };

  const tabs = navConfigs[role] || navConfigs.student;
  const isSixTabs = tabs.length >= 6;

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
      padding: isSixTabs ? '6px 2px 14px 2px' : '8px 4px 14px 4px',
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
              padding: isSixTabs ? '4px 0' : '6px 0',
              color: isActive ? 'var(--brand-800)' : 'var(--text-muted)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              position: 'relative',
              minWidth: 0
            }}
          >
            <div style={{
              transform: isActive ? 'scale(1.12) translateY(-1px)' : 'scale(1)',
              transition: 'transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Icon size={isSixTabs ? 18 : 20} strokeWidth={isActive ? 2.5 : 1.8} />
            </div>
            <span style={{
              fontSize: isSixTabs ? '10px' : '11px',
              fontWeight: isActive ? 700 : 500,
              marginTop: isSixTabs ? '2px' : '4px',
              transition: 'color 0.2s ease',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%',
              display: 'block'
            }}>
              {tab.label}
            </span>
            {isActive && (
              <span style={{
                position: 'absolute',
                bottom: '0px',
                width: '18px',
                height: '3px',
                background: 'var(--brand-800)',
                borderRadius: '9999px',
                boxShadow: '0 1px 6px rgba(30, 58, 138, 0.4)'
              }} />
            )}
          </button>

        );
      })}
    </nav>
  );
}
