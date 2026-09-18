import React, { useState } from 'react';
import { mockUsers } from './lib/mockData';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import ProtectedPdfViewer from './components/common/ProtectedPdfViewer';
import LoginModal from './components/auth/LoginModal';

// Student Views
import StudentHome from './components/student/StudentHome';
import Timetable from './components/student/Timetable';
import AttendanceView from './components/student/AttendanceView';
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
import ParentFees from './components/parent/ParentFees';

// Admin View (100% Mobile)
import AdminMobileDashboard from './components/admin/AdminMobileDashboard';

export default function App() {
  const [currentRole, setCurrentRole] = useState('student');
  const [activeTab, setActiveTab] = useState('home');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCreateTestOpen, setIsCreateTestOpen] = useState(false);
  const [pdfViewerData, setPdfViewerData] = useState(null);

  // Active user profile matching current role
  const [currentUser, setCurrentUser] = useState(mockUsers.student);

  // Switch role and update active user & tab
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setCurrentUser(mockUsers[role] || mockUsers.student);
    setActiveTab('home');
  };

  const handleLoginSuccess = (userAuth) => {
    const matched = mockUsers[userAuth.role] || {
      ...mockUsers.student,
      name: userAuth.name,
      email: userAuth.email,
      role: userAuth.role
    };
    setCurrentRole(userAuth.role);
    setCurrentUser(matched);
    setActiveTab('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoginOpen(true);
  };

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
      />

      {/* Main Role-Specific Viewport */}
      <main style={{ flex: 1 }}>
        {/* STUDENT SCREENS */}
        {currentRole === 'student' && (
          <>
            {activeTab === 'home' && (
              <StudentHome
                user={currentUser || mockUsers.student}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenTestPaper={(paper) => setPdfViewerData(paper)}
              />
            )}
            {activeTab === 'classes' && <Timetable />}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'materials' && (
              <StudyMaterial onOpenViewer={(paper) => setPdfViewerData(paper)} />
            )}
            {activeTab === 'tests' && (
              <TestsView onOpenTestPaper={(paper) => setPdfViewerData(paper)} />
            )}
            {activeTab === 'profile' && (
              <StudentProfile
                user={currentUser || mockUsers.student}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

        {/* TEACHER SCREENS */}
        {currentRole === 'teacher' && (
          <>
            {activeTab === 'home' && (
              <TeacherDashboard
                user={currentUser || mockUsers.teacher}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenCreateTest={() => setIsCreateTestOpen(true)}
                onOpenUploadMaterial={() => setPdfViewerData({ title: 'Physics Chapter 1 Notes', subtitle: 'Upload & Preview Desk' })}
              />
            )}
            {activeTab === 'batches' && <MyBatches onSelectBatch={() => setActiveTab('attendance')} />}
            {activeTab === 'attendance' && <AttendanceMarker />}
            {activeTab === 'performance' && <TeacherPerformance />}
            {activeTab === 'profile' && (
              <StudentProfile
                user={currentUser || mockUsers.teacher}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

        {/* PARENT SCREENS */}
        {currentRole === 'parent' && (
          <>
            {activeTab === 'home' && (
              <ParentHome
                user={currentUser || mockUsers.parent}
                onNavigate={(tab) => setActiveTab(tab)}
                onOpenTestPaper={(paper) => setPdfViewerData(paper)}
              />
            )}
            {activeTab === 'child' && <AttendanceCalendar />}
            {activeTab === 'performance' && (
              <div style={{ padding: '16px' }}>
                <AttendanceView />
              </div>
            )}
            {activeTab === 'fees' && <ParentFees />}
            {activeTab === 'profile' && (
              <StudentProfile
                user={currentUser || mockUsers.parent}
                onLogout={handleLogout}
              />
            )}
          </>
        )}

        {/* ADMIN MOBILE SCREENS (From ASPIRE THEME.png Row 4) */}
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
          rollNo="ASPIRE-104"
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
    </div>
  );
}
