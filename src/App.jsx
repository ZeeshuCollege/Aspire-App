import React, { useState, useEffect, useRef } from 'react';
import { App as CapApp } from '@capacitor/app';
import { mockUsers, mockNotices } from './lib/mockData';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import ProtectedPdfViewer from './components/common/ProtectedPdfViewer';
import ScreenSlider from './components/common/ScreenSlider';
import LoginModal from './components/auth/LoginModal';
import NotificationsModal from './components/common/NotificationsModal';

// Student Views
import StudentHome from './components/student/StudentHome';
import Timetable from './components/student/Timetable';
import StudyMaterial from './components/student/StudyMaterial';
import TestsView from './components/student/TestsView';
import StudentProfile from './components/student/StudentProfile';

// Teacher Views
import TeacherDashboard from './components/teacher/TeacherDashboard';
import MyBatches from './components/teacher/MyBatches';
import AttendanceMarker from './components/teacher/AttendanceMarker';
import CreateTestModal from './components/teacher/CreateTestModal';
import TeacherPerformance from './components/teacher/TeacherPerformance';

// Parent Views
import ParentHome from './components/parent/ParentHome';
import AttendanceCalendar from './components/parent/AttendanceCalendar';
import ParentPerformance from './components/parent/ParentPerformance';
import ParentFees from './components/parent/ParentFees';

// Admin View (100% Mobile)
import AdminMobileDashboard from './components/admin/AdminMobileDashboard';

export default function App() {
  const [currentRole, setCurrentRole] = useState('student');
  const [activeTab, setActiveTab] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notices, setNotices] = useState(mockNotices);
  const [pdfViewerData, setPdfViewerData] = useState(null);

  // Profile loading & saving helper for Students, Teachers & Parents
  const getUserForRole = (role) => {
    const base = mockUsers[role] || mockUsers.student;
    try {
      const saved = localStorage.getItem(`aspire_${role}_profile`);
      if (saved) {
        return { ...base, ...JSON.parse(saved) };
      }
      if (role === 'student') {
        const savedAvatar = localStorage.getItem('aspire_student_avatar');
        if (savedAvatar) {
          return { ...base, avatar: savedAvatar };
        }
      }
    } catch (e) {
      console.error(e);
    }
    return base;
  };

  // Active user profile matching current role (with persistent custom details & avatar support)
  const [currentUser, setCurrentUser] = useState(() => getUserForRole('student'));

  const handleUpdateAvatar = (newAvatar) => {
    try {
      localStorage.setItem('aspire_student_avatar', newAvatar);
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(prev => prev ? { ...prev, avatar: newAvatar } : prev);
  };

  // Update & persist personal details for any role (Student, Teacher, Parent)
  const handleUpdateUser = (updatedData) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updatedData };
      try {
        localStorage.setItem(`aspire_${currentRole}_profile`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const [classesSubTab, setClassesSubTab] = useState('schedule');

  const unreadNoticesCount = notices.filter(n => !n.read).length;

  const handleMarkAllNoticesRead = () => {
    setNotices(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNoticeClick = (id) => {
    setNotices(prev => prev.map(n => n.id === id ? ({ ...n, read: true }) : n));
  };

  // Teacher submits attendance → generate live notifications for each student/parent
  const handleAttendanceSubmit = ({ batchName, subject, time, students }) => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const newNotifs = students.map(s => ({
      id: `att-${s.id}-${Date.now()}`,
      title: `Attendance Marked: ${s.name}`,
      message: `${s.name} is ${s.status} for today's ${time} ${subject} lecture (${batchName}). Marked by teacher.`,
      category: 'Attendance',
      priority: s.status === 'Absent' ? 'high' : 'normal',
      timestamp: 'Just now',
      date: today,
      read: false
    }));
    setNotices(prev => [...newNotifs, ...prev]);
  };

  // State refs for the back button listener to prevent stale closures
  const activeTabRef = useRef(activeTab);
  const isLoginOpenRef = useRef(isLoginOpen);
  const isCreateTestOpenRef = useRef(isCreateTestOpen);
  const isNotificationsOpenRef = useRef(isNotificationsOpen);
  const pdfViewerDataRef = useRef(pdfViewerData);

  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { isLoginOpenRef.current = isLoginOpen; }, [isLoginOpen]);
  useEffect(() => { isCreateTestOpenRef.current = isCreateTestOpen; }, [isCreateTestOpen]);
  useEffect(() => { isNotificationsOpenRef.current = isNotificationsOpen; }, [isNotificationsOpen]);
  useEffect(() => { pdfViewerDataRef.current = pdfViewerData; }, [pdfViewerData]);

  // Keep browser/webview history in sync: push state when leaving home
  useEffect(() => {
    if (activeTab !== 'home') {
      window.history.pushState({ tab: activeTab }, '');
    }
  }, [activeTab]);

  // Unified Android hardware & swipe-gesture back navigation
  useEffect(() => {
    const handleBackNavigation = () => {
      // 1. Give sub-modals or nested views (e.g. admin panels, batch details) priority to close
      let handledByChild = false;
      const event = new CustomEvent('app:back', {
        cancelable: true,
        detail: {
          markHandled: () => { handledByChild = true; }
        }
      });
      window.dispatchEvent(event);
      if (handledByChild) return;

      // 2. Close top-level overlay modals if any are open
      if (pdfViewerDataRef.current) {
        setPdfViewerData(null);
        return;
      }
      if (isNotificationsOpenRef.current) {
        setIsNotificationsOpen(false);
        return;
      }
      if (isCreateTestOpenRef.current) {
        setIsCreateTestOpen(false);
        return;
      }
      if (isLoginOpenRef.current) {
        setIsLoginOpen(false);
        return;
      }

      // 3. If currently on any other page/tab, navigate to 'home' first!
      if (activeTabRef.current !== 'home') {
        setActiveTab('home');
        return;
      }

      // 4. Only when already on 'home' does the full app exit/back trigger
      try {
        CapApp.exitApp();
      } catch (err) {
        // In web browser environment
      }
    };

    // Native Capacitor back button (handles hardware back button + Android gesture back)
    let capBackListener = null;
    try {
      CapApp.addListener('backButton', () => {
        handleBackNavigation();
      }).then(listener => {
        capBackListener = listener;
      }).catch(() => {});
    } catch (e) {}

    // Web / browser popstate listener (for browser back button / swipe back)
    const handlePopState = () => {
      handleBackNavigation();
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      if (capBackListener && capBackListener.remove) {
        capBackListener.remove();
      }
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Switch role and update active user & tab
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setCurrentUser(getUserForRole(role));
    setActiveTab('home');
  };

  const handleStudentNavigate = (tab) => {
    if (tab === 'attendance') {
      setClassesSubTab('attendance');
      setActiveTab('classes');
    } else if (tab === 'classes') {
      setClassesSubTab('schedule');
      setActiveTab('classes');
    } else {
      setActiveTab(tab);
    }
  };

  const handleLoginSuccess = (userAuth) => {
    let matched = mockUsers[userAuth.role] || {
      ...mockUsers.student,
      name: userAuth.name,
      email: userAuth.email,
      role: userAuth.role
    };
    if (userAuth.role === 'student') {
      try {
        const savedAvatar = localStorage.getItem('aspire_student_avatar');
        if (savedAvatar) {
          matched = { ...matched, avatar: savedAvatar };
        }
      } catch (e) {}
    }
    setCurrentRole(userAuth.role);
    setCurrentUser(matched);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginOpen(true);
  };

  // Student Screens (5 Tabs matching BottomNav)
  const studentTabs = [
    {
      id: 'home',
      component: (
        <StudentHome
          user={currentUser || mockUsers.student}
          onNavigate={handleStudentNavigate}
          onOpenTestPaper={(paper) => setPdfViewerData(paper)}
        />
      )
    },
    {
      id: 'classes',
      component: (
        <Timetable initialSubTab={classesSubTab} />
      )
    },
    {
      id: 'tests',
      component: (
        <TestsView onOpenTestPaper={(paper) => setPdfViewerData(paper)} />
      )
    },
    {
      id: 'materials',
      component: (
        <StudyMaterial onOpenViewer={(paper) => setPdfViewerData(paper)} />
      )
    },
    {
      id: 'profile',
      component: (
        <StudentProfile
          user={currentUser || mockUsers.student}
          onLogout={handleLogout}
          onUpdateAvatar={handleUpdateAvatar}
          onUpdateUser={handleUpdateUser}
        />
      )
    }
  ];

  // Teacher Screens (4 Tabs matching BottomNav)
  const teacherTabs = [
    {
      id: 'home',
      component: (
        <TeacherDashboard
          user={currentUser || mockUsers.teacher}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenCreateTest={() => setIsCreateTestOpen(true)}
          onOpenUploadMaterial={() => setPdfViewerData({ title: 'Physics Chapter 1 Notes', subtitle: 'Upload & Preview Desk' })}
        />
      )
    },
    {
      id: 'batches',
      component: (
        <MyBatches
          onSelectBatch={() => setActiveTab('performance')}
          onAttendanceSubmit={handleAttendanceSubmit}
        />
      )
    },
    {
      id: 'performance',
      component: (
        <TeacherPerformance />
      )
    },
    {
      id: 'profile',
      component: (
        <StudentProfile
          user={currentUser || mockUsers.teacher}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )
    }
  ];

  // Parent Screens (5 Tabs matching BottomNav)
  const parentTabs = [
    {
      id: 'home',
      component: (
        <ParentHome
          user={currentUser || mockUsers.parent}
          onNavigate={(tab) => setActiveTab(tab)}
          onOpenTestPaper={(paper) => setPdfViewerData(paper)}
        />
      )
    },
    {
      id: 'child',
      component: (
        <AttendanceCalendar />
      )
    },
    {
      id: 'performance',
      component: (
        <ParentPerformance onOpenTestPaper={(paper) => setPdfViewerData(paper)} />
      )
    },
    {
      id: 'fees',
      component: (
        <ParentFees />
      )
    },
    {
      id: 'profile',
      component: (
        <StudentProfile
          user={currentUser || mockUsers.parent}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
        />
      )
    }
  ];

  // Mobile Application Layout for all 4 roles (Student, Teacher, Parent, Admin)
  return (
    <div className="mobile-app-wrapper">
      {/* Universal Header */}
      <Header
        currentRole={currentRole}
        setRole={handleRoleChange}
        user={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadNoticesCount}
      />

      {/* Main Role-Specific Viewport with Hardware-Accelerated Sliding Track */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
        {/* STUDENT SCREENS */}
        {currentRole === 'student' && (
          <ScreenSlider
            activeTab={activeTab}
            tabs={studentTabs}
            onNavigate={setActiveTab}
            roleKey="student"
          />
        )}

        {/* TEACHER SCREENS */}
        {currentRole === 'teacher' && (
          <ScreenSlider
            activeTab={activeTab}
            tabs={teacherTabs}
            onNavigate={setActiveTab}
            roleKey="teacher"
          />
        )}

        {/* PARENT SCREENS */}
        {currentRole === 'parent' && (
          <ScreenSlider
            activeTab={activeTab}
            tabs={parentTabs}
            onNavigate={setActiveTab}
            roleKey="parent"
          />
        )}

        {/* ADMIN MOBILE SCREENS */}
        {currentRole === 'admin' && (
          <AdminMobileDashboard
            activeTab={activeTab}
            onNavigate={(tab) => setActiveTab(tab)}
            onLogout={handleLogout}
          />
        )}
      </main>


      {/* Role-Specific Floating Mobile Bottom Navigation */}
      <BottomNav
        role={currentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* In-App Protected PDF Viewer Modal */}
      {pdfViewerData && (
        <ProtectedPdfViewer
          title={pdfViewerData.title}
          subtitle={pdfViewerData.subtitle}
          studentName={currentUser ? currentUser.name : 'Rohan Sharma'}
          rollNo={currentUser?.rollNumber || 'ASPIRE-104'}
          onClose={() => setPdfViewerData(null)}
        />
      )}

      {/* Teacher Create Test Modal */}
      <CreateTestModal
        isOpen={isCreateTestOpen}
        onClose={() => setIsCreateTestOpen(false)}
        onCreated={() => setActiveTab('batches')}
      />

      {/* Authentication & Password Reset Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        defaultRole={currentRole}
      />

      {/* Announcements & Notifications Board Modal (0.5s Bottom-to-Top Pop-up) */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notices={notices}
        onMarkAllRead={handleMarkAllNoticesRead}
        onNoticeClick={handleNoticeClick}
      />
    </div>
  );
}
