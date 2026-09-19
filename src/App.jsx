import React, { useState, useEffect, useRef } from 'react';
import { App as CapApp } from '@capacitor/app';
import { mockUsers, mockNotices } from './lib/mockData';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import ProtectedPdfViewer from './components/common/ProtectedPdfViewer';
import ScreenSlider from './components/common/ScreenSlider';
import LoginModal from './components/auth/LoginModal';
import NotificationsModal from './components/common/NotificationsModal';
import PermissionsModal from './components/common/PermissionsModal';
import OpeningScreen from './components/common/OpeningScreen';
import { isFirstLaunch } from './lib/permissions';
import { Browser } from '@capacitor/browser';
import { supabase } from './lib/supabaseClient';

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
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      return localStorage.getItem('aspire_user_role') || 'admin';
    } catch (e) {
      return 'admin';
    }
  });
  const [activeTab, setActiveTab] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [notices, setNotices] = useState(mockNotices);
  const [pdfViewerData, setPdfViewerData] = useState(null);

  // Authentication & Opening Screen States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      const saved = localStorage.getItem('aspire_is_logged_in');
      if (saved !== null) return saved === 'true';
      return false;
    } catch (e) {
      return false;
    }
  });

  const [showOpeningScreen, setShowOpeningScreen] = useState(true);
  const [isLandingFade, setIsLandingFade] = useState(false);

  // Profile loading & saving helper for Students, Teachers & Parents
  const getUserForRole = (role) => {
    const base = mockUsers[role] || mockUsers.admin;
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

  // Active user profile matching current role (persists when logged in)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('aspire_is_logged_in');
      if (savedAuth === 'true') {
        const savedRole = localStorage.getItem('aspire_user_role') || 'admin';
        return getUserForRole(savedRole);
      }
    } catch (e) {}
    return null;
  });

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

  // Teacher submits attendance → generate live notifications for parents & students
  const handleAttendanceSubmit = ({ batchName, subject, time, students }) => {
    const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const newNotifs = students.map(s => {
      const isAbsent = s.status === 'Absent';
      return {
        id: `att-${s.id}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: isAbsent ? `⚠️ Attendance Alert: ${s.name} Absent` : `✅ Attendance: ${s.name} Present`,
        message: isAbsent
          ? `Parent Alert: ${s.name} was marked ABSENT for today's ${time} ${subject} class (${batchName}). Please contact institute if this is an error.`
          : `${s.name} attended today's ${time} ${subject} class (${batchName}). Marked by faculty.`,
        category: 'Attendance',
        priority: isAbsent ? 'high' : 'normal',
        timestamp: 'Just now',
        date: today,
        read: false
      };
    });
    setNotices(prev => [...newNotifs, ...prev]);
  };

  // Listen for admin attendance corrections
  useEffect(() => {
    const handleAttendanceChange = (e) => {
      if (e.detail?.updatedBy === 'admin') {
        const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        const { studentId, newStatus } = e.detail;
        setNotices(prev => [{
          id: `admin-att-${studentId}-${Date.now()}`,
          title: `Attendance Corrected by Admin`,
          message: `Attendance status for student #${studentId} was updated to ${newStatus} by Institute Admin.`,
          category: 'Attendance',
          priority: 'normal',
          timestamp: 'Just now',
          date: today,
          read: false
        }, ...prev]);
      }
    };
    window.addEventListener('aspire:attendance-updated', handleAttendanceChange);
    return () => window.removeEventListener('aspire:attendance-updated', handleAttendanceChange);
  }, []);

  // State refs for the back button listener to prevent stale closures
  const activeTabRef = useRef(activeTab);
  const isLoginOpenRef = useRef(isLoginOpen);
  const isCreateTestOpenRef = useRef(isCreateTestOpen);
  const isNotificationsOpenRef = useRef(isNotificationsOpen);
  const isPermissionsOpenRef = useRef(isPermissionsOpen);
  const pdfViewerDataRef = useRef(pdfViewerData);
  const showOpeningScreenRef = useRef(showOpeningScreen);
  const isLoggedInRef = useRef(isLoggedIn);

  useEffect(() => { activeTabRef.current = activeTab; }, [activeTab]);
  useEffect(() => { isLoginOpenRef.current = isLoginOpen; }, [isLoginOpen]);
  useEffect(() => { isCreateTestOpenRef.current = isCreateTestOpen; }, [isCreateTestOpen]);
  useEffect(() => { isNotificationsOpenRef.current = isNotificationsOpen; }, [isNotificationsOpen]);
  useEffect(() => { isPermissionsOpenRef.current = isPermissionsOpen; }, [isPermissionsOpen]);
  useEffect(() => { pdfViewerDataRef.current = pdfViewerData; }, [pdfViewerData]);
  useEffect(() => { showOpeningScreenRef.current = showOpeningScreen; }, [showOpeningScreen]);
  useEffect(() => { isLoggedInRef.current = isLoggedIn; }, [isLoggedIn]);

  // First-time download/launch check: automatically prompt for mobile device permissions once entered
  useEffect(() => {
    if (isFirstLaunch() && !showOpeningScreen && isLoggedIn) {
      const timer = setTimeout(() => {
        setIsPermissionsOpen(true);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [showOpeningScreen, isLoggedIn]);

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

      if (isPermissionsOpenRef.current) {
        setIsPermissionsOpen(false);
        return;
      }
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

      // If on opening screen and not logged in, back exits app
      if (showOpeningScreenRef.current && !isLoggedInRef.current) {
        try {
          CapApp.exitApp();
        } catch (err) {}
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
    const base = mockUsers[userAuth.role] || mockUsers.student;
    let matched = {
      ...base,
      id: userAuth.id || base.id,
      name: userAuth.name || base.name,
      email: userAuth.email || base.email,
      phone: userAuth.phone !== undefined ? userAuth.phone : '',
      bloodGroup: userAuth.bloodGroup !== undefined ? userAuth.bloodGroup : '',
      role: userAuth.role || 'student',
      course: userAuth.course || base.course,
      rollNumber: userAuth.rollNumber || base.rollNumber
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
    setIsLoggedIn(true);
    try {
      localStorage.setItem('aspire_is_logged_in', 'true');
      localStorage.setItem('aspire_user_role', userAuth.role);
      localStorage.setItem(`aspire_${userAuth.role}_profile`, JSON.stringify(matched));
    } catch (e) {}
    setActiveTab('home');
    setShowOpeningScreen(false);
    setIsLandingFade(true);
    setTimeout(() => {
      setIsLandingFade(false);
    }, 850);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('aspire_is_logged_in');
    } catch (e) {}
    setIsLoggedIn(false);
    setCurrentUser(null);
    setShowOpeningScreen(true);
    setIsLoginOpen(false);
  };

  // Mobile OAuth redirect deep link listener (com.aspire.learning://auth#access_token=...)
  useEffect(() => {
    let urlListener = null;

    const initOAuthListener = async () => {
      try {
        urlListener = await CapApp.addListener('appUrlOpen', async (data) => {
          try {
            await Browser.close();
          } catch (e) {}

          const rawUrl = data?.url;
          if (!rawUrl) return;

          // Parse hash fragment from OAuth callback
          if (rawUrl.includes('access_token')) {
            const hashIndex = rawUrl.indexOf('#');
            if (hashIndex !== -1) {
              const hash = rawUrl.substring(hashIndex + 1);
              const params = new URLSearchParams(hash);
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');

              if (accessToken) {
                const { data: sessionData, error: sessionErr } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken || ''
                });

                if (!sessionErr && sessionData?.user) {
                  const userMeta = sessionData.user.user_metadata || {};
                  handleLoginSuccess({
                    id: sessionData.user.id,
                    email: sessionData.user.email,
                    role: userMeta.role || 'student',
                    name: userMeta.full_name || sessionData.user.email?.split('@')[0] || 'ASPIRE User'
                  });
                }
              }
            }
          }
        });
      } catch (err) {
        console.error('Deep link listener error:', err);
      }
    };

    initOAuthListener();

    // Supabase auth state change subscription
    const { data: authSub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user) {
        try {
          await Browser.close();
        } catch (e) {}
        const userMeta = session.user.user_metadata || {};
        handleLoginSuccess({
          id: session.user.id,
          email: session.user.email,
          role: userMeta.role || 'student',
          name: userMeta.full_name || session.user.email?.split('@')[0] || 'ASPIRE User'
        });
      }
    });

    return () => {
      if (urlListener && urlListener.remove) {
        urlListener.remove();
      }
      if (authSub?.subscription) {
        authSub.subscription.unsubscribe();
      }
    };
  }, []);

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
          onOpenPermissions={() => setIsPermissionsOpen(true)}
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
          onOpenPermissions={() => setIsPermissionsOpen(true)}
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
          onOpenPermissions={() => setIsPermissionsOpen(true)}
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
        user={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadNoticesCount}
      />

      {/* Main Role-Specific Viewport with Hardware-Accelerated Sliding Track */}
      <main
        key={isLandingFade ? 'landing-main' : 'default-main'}
        className={isLandingFade ? 'home-fade-landing' : ''}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}
      >
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

      {/* Device Permissions Onboarding & Management Modal */}
      <PermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
      />

      {/* Opening Screen (Splash / Welcome Screen) */}
      {showOpeningScreen && (
        <OpeningScreen
          isLoggedIn={isLoggedIn}
          onOpenLogin={() => setIsLoginOpen(true)}
          onProceed={() => setShowOpeningScreen(false)}
        />
      )}
    </div>
  );
}
