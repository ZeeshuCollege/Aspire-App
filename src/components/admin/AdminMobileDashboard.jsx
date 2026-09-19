import React, { useState, useEffect } from 'react';
import { mockAdminStats, mockBatches, mockNotices as initialNotices } from '../../lib/mockData';
import {
  getStoredStudents, saveStoredStudents,
  getStoredTeachers, saveStoredTeachers,
  getStoredParents, saveStoredParents, deleteStoredParent,
  addRegisteredUser
} from '../../lib/userAuthStore';
import {
  Users, UserCheck, BookOpen, CheckSquare, Plus, Search,
  Download, Settings, ShieldCheck, ChevronRight, Bell, DollarSign, Calendar, FileCheck, FileText, Trash2, Award
} from 'lucide-react';
import ScreenSlider from '../common/ScreenSlider';
import AdminStudyMaterialsModal, { SUBJECT_OPTIONS, COURSE_OPTIONS } from './AdminStudyMaterialsModal';
import AdminTestsModal from './AdminTestsModal';
import AdminTimetableModal from './AdminTimetableModal';
import AdminAttendanceModal from './AdminAttendanceModal';
import AdminMarksModal from './AdminMarksModal';

export default function AdminMobileDashboard({ activeTab, onNavigate, onLogout }) {
  // Data States
  const [students, setStudents] = useState(getStoredStudents);
  const [teachers, setTeachers] = useState(getStoredTeachers);
  const [parents, setParents] = useState(getStoredParents);
  const [searchTerm, setSearchTerm] = useState('');
  const [parentSearchTerm, setParentSearchTerm] = useState('');

  // KPI Drill-Down Modal States
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [showTeachersModal, setShowTeachersModal] = useState(false);
  const [showAbsentModal, setShowAbsentModal] = useState(false);
  const [selectedAbsentStudent, setSelectedAbsentStudent] = useState(null);
  const [showNoticesModal, setShowNoticesModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [notices, setNotices] = useState(initialNotices);
  const [showAddNoticeForm, setShowAddNoticeForm] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeMsg, setNewNoticeMsg] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState('General');

  // Add Student Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('12th Science');

  // Add Parent Modal States
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [isParentModalClosing, setIsParentModalClosing] = useState(false);
  const [isSubmittingParent, setIsSubmittingParent] = useState(false);
  const [newParentName, setNewParentName] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newParentEmail, setNewParentEmail] = useState('');
  const [newParentChildName, setNewParentChildName] = useState('');
  const [newParentChildEmail, setNewParentChildEmail] = useState('');
  const [newParentChildRoll, setNewParentChildRoll] = useState('');
  const [newParentChildCourse, setNewParentChildCourse] = useState('12th Science');
  const [selectedStudentIdForParent, setSelectedStudentIdForParent] = useState('');

  // Add Faculty Modal States
  const [showAddFacultyModal, setShowAddFacultyModal] = useState(false);
  const [isFacultyModalClosing, setIsFacultyModalClosing] = useState(false);
  const [newFacultyName, setNewFacultyName] = useState('');
  const [newFacultyEmail, setNewFacultyEmail] = useState('');
  const [newFacultyPassword, setNewFacultyPassword] = useState('');
  const [newFacultyBatches, setNewFacultyBatches] = useState([]);
  const [newFacultySubjects, setNewFacultySubjects] = useState([]);
  const [exportFeedback, setExportFeedback] = useState('');

  // Add Course Modal States
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [isCourseModalClosing, setIsCourseModalClosing] = useState(false);
  const [courses, setCourses] = useState([
    { id: 'c-1', name: 'Std 9th', code: 'STD-9', subjects: ['English (9th)', 'Maths (9th)', 'Science (9th)'], faculty: ['Ms. Priya Shah'] },
    { id: 'c-2', name: 'Std 10th', code: 'STD-10', subjects: ['English (10th)', 'Maths (10th)', 'Science (10th)'], faculty: ['Ms. Priya Shah'] },
    { id: 'c-3', name: '11th Science', code: 'SCI-11', subjects: ['English (11th)', 'Geography (11th)', 'History (11th)'], faculty: ['Mr. Rahul Verma'] },
    { id: 'c-4', name: '12th Science', code: 'SCI-12', subjects: ['English (12th)', 'Geography (12th)', 'History (12th)'], faculty: ['Mr. Rahul Verma'] },
    { id: 'c-5', name: 'NEET', code: 'NEET', subjects: ['Physics (NEET)', 'Chemistry (NEET)', 'Biology (NEET)'], faculty: ['Mr. Rahul Verma', 'Mr. Suresh Iyer'] },
    { id: 'c-6', name: 'JEE (Mains + Adv)', code: 'JEE', subjects: ['Physics (JEE)', 'Chemistry (JEE)', 'Maths (JEE)'], faculty: ['Ms. Priya Shah', 'Ms. Neha Kapoor'] },
    { id: 'c-7', name: 'MHT-CET', code: 'MHT-CET', subjects: ['Physics (JEE)', 'Chemistry (JEE)', 'Maths (JEE)'], faculty: ['Ms. Priya Shah'] }
  ]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseSubjects, setNewCourseSubjects] = useState([]);
  const [newCourseFaculty, setNewCourseFaculty] = useState([]);

  // Animation helper state
  const [closingModal, setClosingModal] = useState(null);

  const NOTICE_CATEGORIES = ['General', 'Test', 'Attendance', 'Fee', 'Holiday', 'Exam'];
  const BATCH_OPTIONS = ['JEE 12-A', 'JEE 12-B', 'NEET 12-A', 'NEET 12-B', 'Class 11-A', 'Class 11-B', 'Class 10-A', 'Class 10-B', 'Foundation 9-A'];
  const FACULTY_OPTIONS = ['Ms. Priya Shah', 'Mr. Rahul Verma', 'Ms. Neha Kapoor', 'Mr. Suresh Iyer'];

  const absentStudents = [
    { id: 'abs-1', name: 'Arjun Mehta', course: 'JEE 12-A', phone: '98765 43210', parentPhone: '91122 33445', bloodGroup: 'B+', email: 'arjun@email.com' },
    { id: 'abs-2', name: 'Sneha Patel', course: 'NEET 12-B', phone: '91234 56789', parentPhone: '90099 88776', bloodGroup: 'O+', email: 'sneha@email.com' },
    { id: 'abs-3', name: 'Rohan Das', course: 'Class 11-A', phone: '99887 76655', parentPhone: '98001 23456', bloodGroup: 'A+', email: 'rohan@email.com' },
  ];

  const toggleFacultyBatch = (b) => setNewFacultyBatches(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  const toggleFacultySubject = (s) => setNewFacultySubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleCourseSubject = (s) => setNewCourseSubjects(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const toggleCourseFaculty = (f) => setNewCourseFaculty(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleAddNotice = (e) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeMsg) return;
    setNotices(prev => [{
      id: `notif-${Date.now()}`,
      title: newNoticeTitle,
      message: newNoticeMsg,
      category: newNoticeCategory,
      priority: 'normal',
      timestamp: 'Just now',
      date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      read: false
    }, ...prev]);
    setNewNoticeTitle('');
    setNewNoticeMsg('');
    setNewNoticeCategory('General');
    setShowAddNoticeForm(false);
  };

  const closeModal = (key, setter) => {
    setClosingModal(key);
    setTimeout(() => { setter(false); setClosingModal(null); }, 380);
  };

  const handleCloseAddModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowAddModal(false);
      setIsModalClosing(false);
    }, 380);
  };

  const handleCloseAddParentModal = () => {
    setIsParentModalClosing(true);
    setTimeout(() => {
      setShowAddParentModal(false);
      setIsParentModalClosing(false);
      setIsSubmittingParent(false);
    }, 380);
  };

  // Auto-fill student details when selected in Add Parent modal
  const handleSelectStudentForParent = (studentId) => {
    setSelectedStudentIdForParent(studentId);
    if (!studentId || studentId === 'custom') {
      return;
    }
    const found = students.find(s => s.id === studentId);
    if (found) {
      setNewParentChildName(found.name || '');
      setNewParentChildRoll(found.roll || '');
      setNewParentChildEmail(found.email || `${(found.name || 'student').toLowerCase().replace(/\s+/g, '')}@aspire.edu`);
      setNewParentChildCourse(found.course || '12th Science');
    }
  };

  const handleAddParent = (e) => {
    e.preventDefault();
    if (isSubmittingParent) return;
    if (!newParentName || !newParentPhone) return;

    // Prevent duplicate entry by phone or email
    const cleanPhoneDigits = newParentPhone.replace(/\D/g, '');
    const cleanEmail = (newParentEmail || '').trim().toLowerCase();
    const isDuplicate = parents.some(p => {
      const pPhoneDigits = (p.phone || '').replace(/\D/g, '');
      const pEmail = (p.email || '').trim().toLowerCase();
      if (cleanPhoneDigits && pPhoneDigits === cleanPhoneDigits) return true;
      if (cleanEmail && pEmail && pEmail === cleanEmail) return true;
      return false;
    });

    if (isDuplicate) {
      setExportFeedback('⚠️ A parent with this phone or email is already registered.');
      setTimeout(() => setExportFeedback(''), 3000);
      handleCloseAddParentModal();
      return;
    }

    setIsSubmittingParent(true);

    const childName = newParentChildName.trim() || 'Student';
    const childRoll = newParentChildRoll.trim() || (students.length + 101).toString();
    const childEmail = newParentChildEmail.trim() || `${childName.toLowerCase().replace(/\s+/g, '')}@aspire.edu`;
    const childCourse = newParentChildCourse.trim() || '12th Science';

    // Find matching enrolled student
    const matchedStudent = students.find(s =>
      (selectedStudentIdForParent && selectedStudentIdForParent !== 'custom' && s.id === selectedStudentIdForParent) ||
      (s.roll && s.roll === childRoll) ||
      (s.name.toLowerCase() === childName.toLowerCase())
    );

    const parentId = `par-${Date.now()}`;
    const studentId = matchedStudent ? matchedStudent.id : `s-${Date.now()}`;

    const parentEmailClean = (newParentEmail.trim() || `${newParentName.trim().toLowerCase().replace(/\s+/g, '')}@gmail.com`).toLowerCase();
    const parentPassClean = newParentPhone.trim() || 'parent@123';

    const newPar = {
      id: parentId,
      name: newParentName.trim(),
      phone: newParentPhone.trim(),
      email: parentEmailClean,
      password: parentPassClean,
      studentId: studentId,
      linkedChildId: studentId,
      linkedChildName: childName,
      linkedChildEmail: childEmail,
      linkedChildRoll: childRoll,
      linkedChildCourse: childCourse,
      status: 'Active'
    };

    // 1. Update parents list and persist
    setParents(prev => {
      const updated = [newPar, ...prev];
      return saveStoredParents(updated);
    });

    // Register parent credentials
    if (newPar.email) {
      addRegisteredUser({
        name: newPar.name,
        email: parentEmailClean,
        password: parentPassClean,
        role: 'parent',
        phone: newPar.phone,
        linkedChildName: childName
      });
    }

    // 2. Connect parent details to student in students state
    if (matchedStudent) {
      setStudents(prev => prev.map(s => {
        if (s.id === matchedStudent.id) {
          return {
            ...s,
            parentName: newParentName.trim(),
            parentPhone: newParentPhone.trim(),
            parentEmail: newParentEmail.trim(),
            parentId: parentId,
            parentStatus: 'Linked'
          };
        }
        return s;
      }));
    } else {
      const newStd = {
        id: studentId,
        name: childName,
        roll: childRoll,
        course: childCourse,
        email: childEmail,
        attendance: 'Present',
        score: '85%',
        status: 'Active',
        parentName: newParentName.trim(),
        parentPhone: newParentPhone.trim(),
        parentEmail: newParentEmail.trim(),
        parentId: parentId,
        parentStatus: 'Linked'
      };
      setStudents(prev => [newStd, ...prev]);
    }

    setNewParentName('');
    setNewParentPhone('');
    setNewParentEmail('');
    setNewParentChildName('');
    setNewParentChildEmail('');
    setNewParentChildRoll('');
    setSelectedStudentIdForParent('');
    handleCloseAddParentModal();

    setExportFeedback(`✓ Parent "${newParentName.trim()}" linked to student "${childName}"!`);
    setTimeout(() => setExportFeedback(''), 3500);
  };

  const handleDeleteParent = (parentId) => {
    const updated = deleteStoredParent(parentId);
    setParents(updated);
    setExportFeedback('Parent removed.');
    setTimeout(() => setExportFeedback(''), 2500);
  };

  const handleCloseAddFacultyModal = () => {
    setIsFacultyModalClosing(true);
    setTimeout(() => {
      setShowAddFacultyModal(false);
      setIsFacultyModalClosing(false);
    }, 380);
  };

  const handleCloseAddCourseModal = () => {
    setIsCourseModalClosing(true);
    setTimeout(() => {
      setShowAddCourseModal(false);
      setIsCourseModalClosing(false);
    }, 380);
  };

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName || newCourseSubjects.length === 0 || newCourseFaculty.length === 0) return;
    const code = newCourseName.slice(0, 3).toUpperCase() + '-' + Date.now().toString().slice(-3);
    const newC = {
      id: `c-${Date.now()}`,
      name: newCourseName,
      code,
      subjects: newCourseSubjects,
      faculty: newCourseFaculty
    };
    setCourses(prev => [newC, ...prev]);
    setNewCourseName('');
    setNewCourseSubjects([]);
    setNewCourseFaculty([]);
    handleCloseAddCourseModal();
  };

  // Intercept back action to close open admin bottom-sheets/modals
  useEffect(() => {
    const handleAdminBack = (e) => {
      if (selectedAbsentStudent) {
        setSelectedAbsentStudent(null);
        e.detail?.markHandled();
        return;
      }
      if (showAddNoticeForm) {
        setShowAddNoticeForm(false);
        e.detail?.markHandled();
        return;
      }
      if (showNoticesModal) {
        setShowNoticesModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showAbsentModal) {
        setShowAbsentModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showMaterialsModal) {
        setShowMaterialsModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showTestsModal) {
        setShowTestsModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showAttendanceModal) {
        setShowAttendanceModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showMarksModal) {
        setShowMarksModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showTeachersModal) {
        setShowTeachersModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showStudentsModal) {
        setShowStudentsModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showAddModal) {
        setShowAddModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showAddParentModal) {
        setShowAddParentModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showAddFacultyModal) {
        setShowAddFacultyModal(false);
        e.detail?.markHandled();
        return;
      }
      if (showAddCourseModal) {
        setShowAddCourseModal(false);
        e.detail?.markHandled();
        return;
      }
    };

    window.addEventListener('app:back', handleAdminBack);
    return () => window.removeEventListener('app:back', handleAdminBack);
  }, [
    selectedAbsentStudent, showAddNoticeForm, showNoticesModal,
    showAbsentModal, showTeachersModal, showStudentsModal,
    showAddModal, showAddParentModal, showAddFacultyModal, showAddCourseModal,
    showMaterialsModal, showTestsModal, showTimetableModal, showAttendanceModal, showMarksModal
  ]);

  const handleAddFaculty = async (e) => {
    e.preventDefault();
    if (!newFacultyName.trim() || !newFacultyEmail.trim() || !newFacultyPassword.trim() || newFacultyBatches.length === 0 || newFacultySubjects.length === 0) return;
    const cleanName = newFacultyName.trim();
    const cleanEmail = newFacultyEmail.trim().toLowerCase();
    const cleanPassword = newFacultyPassword.trim();

    const newT = {
      id: `t-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      subject: newFacultySubjects.join(', '),
      batches: newFacultyBatches.join(', '),
      status: 'Active'
    };
    setTeachers(prev => {
      const updated = [newT, ...prev];
      saveStoredTeachers(updated);
      return updated;
    });

    await addRegisteredUser({
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: 'teacher',
      batches: newFacultyBatches,
      subjects: newFacultySubjects
    });

    setNewFacultyName('');
    setNewFacultyEmail('');
    setNewFacultyPassword('');
    setNewFacultyBatches([]);
    setNewFacultySubjects([]);
    handleCloseAddFacultyModal();
  };

  const handleExport = (format) => {
    setExportFeedback(`Exported to ASPIRE_Report.${format}`);
    setTimeout(() => setExportFeedback(''), 2500);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const trimmedName = newStudentName.trim();
    const trimmedEmail = newStudentEmail.trim().toLowerCase();
    const trimmedPass = newStudentPassword.trim();
    if (!trimmedName || !trimmedEmail || !trimmedPass) {
      alert('Please fill in all fields: Name, Email, and Password.');
      return;
    }
    const rollNo = (students.length + 101).toString();

    const newStd = {
      id: `s-${Date.now()}`,
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPass,
      roll: rollNo,
      rollNumber: `ASPIRE-2025-${rollNo}`,
      course: newStudentCourse,
      attendance: 'Present',
      score: '85%',
      status: 'Active',
      phone: '',
      bloodGroup: ''
    };
    const updated = [newStd, ...students];
    setStudents(updated);
    saveStoredStudents(updated);

    // Save credentials so student can log in immediately
    await addRegisteredUser({
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPass,
      role: 'student',
      course: newStudentCourse,
      rollNumber: `ASPIRE-2025-${rollNo}`,
      phone: '',
      bloodGroup: ''
    });

    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPassword('');
    handleCloseAddModal();

    // Confirm to admin exactly what was saved
    alert(`✅ Student enrolled!\n\nEmail: ${trimmedEmail}\nPassword: ${trimmedPass}\n\nThe student can now log in with these credentials.`);
  };

  const adminTabs = [
    {
      id: 'home',
      component: (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
                Institute Governance
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--brand-900)' }}>Admin Portal</h2>
            </div>

          </div>

          {/* 4 KPI Cards  (2-col grid, clickable where applicable) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>

            {/* Total Students — clickable */}
            <div
              className="card"
              style={{ padding: '14px', cursor: 'pointer', transition: 'transform 0.15s', activeOpacity: 0.8 }}
              onClick={() => setShowStudentsModal(true)}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Students</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', margin: '4px 0 2px 0' }}>{students.length}</h3>
              <span style={{ fontSize: '10px', color: 'var(--success)' }}>Tap to view list</span>
            </div>

            {/* Total Teachers — clickable */}
            <div
              className="card"
              style={{ padding: '14px', cursor: 'pointer' }}
              onClick={() => setShowTeachersModal(true)}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Total Teachers</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#8b5cf6', margin: '4px 0 2px 0' }}>{teachers.length}</h3>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Tap to view list</span>
            </div>

            {/* Notices — clickable */}
            <div
              className="card"
              style={{ padding: '14px', cursor: 'pointer' }}
              onClick={() => setShowNoticesModal(true)}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Notices</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#f59e0b', margin: '4px 0 2px 0' }}>{notices.length}</h3>
              <span style={{ fontSize: '10px', color: 'var(--accent-500)' }}>Tap to manage</span>
            </div>

            {/* Absent Today — clickable */}
            <div
              className="card"
              style={{ padding: '14px', cursor: 'pointer' }}
              onClick={() => setShowAbsentModal(true)}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Absent Today</span>
              <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444', margin: '4px 0 2px 0' }}>{absentStudents.length}</h3>
              <span style={{ fontSize: '10px', color: '#ef4444' }}>Tap to view</span>
            </div>

          </div>

          {/* Academic Quick Actions: Study Materials, Tests, Timetable & Attendance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Academic Quick Actions
              </span>
              <span style={{ fontSize: '10px', color: 'var(--brand-700)', fontWeight: 600 }}>
                Administration Hub
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Study Materials Button */}
              <div
                className="card"
                onClick={() => setShowMaterialsModal(true)}
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%)',
                  border: '1.5px solid #bae6fd',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={19} />
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '10px', padding: '2px 7px' }}>
                    Files
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: '4px 0 2px 0' }}>
                    Study Materials
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Notes, DPPs & Videos
                  </span>
                </div>
              </div>

              {/* Tests & Papers Button */}
              <div
                className="card"
                onClick={() => setShowTestsModal(true)}
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
                  border: '1.5px solid #fecaca',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileCheck size={19} />
                  </div>
                  <span className="badge badge-danger" style={{ fontSize: '10px', padding: '2px 7px' }}>
                    Exams
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: '4px 0 2px 0' }}>
                    Tests & Papers
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Papers & Solutions
                  </span>
                </div>
              </div>

              {/* Timetable Button */}
              <div
                className="card"
                onClick={() => setShowTimetableModal(true)}
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%)',
                  border: '1.5px solid #ddd6fe',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={19} />
                  </div>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    background: '#ede9fe',
                    color: '#6d28d9'
                  }}>
                    Classes
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: '4px 0 2px 0' }}>
                    Timetable
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Add & Delete Lectures
                  </span>
                </div>
              </div>

              {/* Attendance Button */}
              <div
                className="card"
                onClick={() => setShowAttendanceModal(true)}
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
                  border: '1.5px solid #a7f3d0',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckSquare size={19} />
                  </div>
                  <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 7px' }}>
                    Analytics
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: '4px 0 2px 0' }}>
                    Attendance
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Student, Course & Subject
                  </span>
                </div>
              </div>

              {/* Marks Button */}
              <div
                className="card"
                onClick={() => setShowMarksModal(true)}
                style={{
                  padding: '14px',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 100%)',
                  border: '1.5px solid #fde68a',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  transition: 'transform 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={19} />
                  </div>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    background: '#fef3c7',
                    color: '#b45309'
                  }}>
                    Scores
                  </span>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--brand-900)', margin: '4px 0 2px 0' }}>
                    Marks
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    Upload & Grade Tests
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Classes */}
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Ongoing Lectures</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: 700 }}>Physics (JEE 12 - A)</h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room 204 • Ms. Priya Shah</span>
                </div>
                <span className="badge badge-success">Ongoing</span>
              </div>

              <div className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontSize: '13px', fontWeight: 700 }}>Chemistry (NEET 12 - B)</h5>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Room 201 • Mr. Rahul Verma</span>
                </div>
                <span className="badge badge-accent">Ongoing</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'students',
      component: (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Students ({students.length})</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px', gap: '4px' }}
            >
              <Plus size={14} /> Add Student
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 34px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '13px',
                background: 'var(--surface)'
              }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Mobile Student List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {students
              .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.roll.includes(searchTerm))
              .map(std => (
                <div key={std.id} className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{std.name}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Roll #{std.roll} • {std.course}</span>
                    {std.parentName ? (
                      <div style={{ fontSize: '11.5px', color: 'var(--brand-700)', fontWeight: 600, marginTop: '3px' }}>
                        👨‍👦 Parent: {std.parentName} {std.parentPhone ? `(${std.parentPhone})` : ''}
                      </div>
                    ) : (
                      <div style={{ fontSize: '10.5px', color: 'var(--text-muted)', marginTop: '2px', fontStyle: 'italic' }}>
                        No parent linked
                      </div>
                    )}
                  </div>
                  <span className="badge badge-success">{std.status}</span>
                </div>
              ))}
          </div>
        </div>
      )
    },
    {
      id: 'parents',
      component: (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>Parents ({parents.length})</h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Registered Guardians & Linked Students</span>
            </div>
            <button
              onClick={() => setShowAddParentModal(true)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px', gap: '4px', display: 'flex', alignItems: 'center' }}
            >
              <Plus size={14} /> Add Parent
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search parent, phone or student..."
              value={parentSearchTerm}
              onChange={e => setParentSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 34px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '13px',
                background: 'var(--surface)'
              }}
            />
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          {/* Mobile Parents List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {parents
              .filter(p =>
                p.name.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
                (p.linkedChildName && p.linkedChildName.toLowerCase().includes(parentSearchTerm.toLowerCase())) ||
                p.phone.includes(parentSearchTerm)
              )
              .map(p => (
                <div key={p.id} className="card" style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--brand-900)', margin: 0 }}>{p.name}</h4>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '3px', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        <span>📞 {p.phone}</span>
                        {p.email && <span>✉️ {p.email}</span>}
                      </div>
                    </div>
                    <span className="badge badge-success">{p.status}</span>
                  </div>

                  {/* Linked Child Info Box */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Linked Child
                      </span>
                      <h5 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--brand-800)', margin: '1px 0 0 0' }}>
                        {p.linkedChildName}
                      </h5>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Roll #{p.linkedChildRoll} • {p.linkedChildCourse}
                      </span>
                      {p.linkedChildEmail && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          ✉️ {p.linkedChildEmail}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={`tel:${p.phone.replace(/\s+/g, '')}`}
                        style={{
                          padding: '6px 12px',
                          background: '#ffffff',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: 'var(--brand-800)',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                      >
                        Call
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteParent(p.id);
                        }}
                        style={{
                          padding: '6px 8px',
                          background: '#fee2e2',
                          border: '1px solid #fca5a5',
                          borderRadius: '6px',
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                        }}
                        title="Remove Parent"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

            {parents.filter(p =>
              p.name.toLowerCase().includes(parentSearchTerm.toLowerCase()) ||
              (p.linkedChildName && p.linkedChildName.toLowerCase().includes(parentSearchTerm.toLowerCase())) ||
              p.phone.includes(parentSearchTerm)
            ).length === 0 && (
              <div style={{ textAlign: 'center', padding: '24px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
                No parents found matching "{parentSearchTerm}"
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      id: 'teachers',
      component: (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Faculty ({teachers.length})</h3>
            <button
              onClick={() => setShowAddFacultyModal(true)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px', gap: '4px' }}
            >
              <Plus size={14} /> Add Faculty
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {teachers.map(t => (
              <div key={t.id} className="card" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 700 }}>{t.name}</h5>
                  <span style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600 }}>{t.subject}</span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Batches: {t.batches}</p>
                </div>
                <span className="badge badge-success" style={{ flexShrink: 0 }}>{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'batches',
      component: (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '90px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Courses ({courses.length})</h3>
            <button
              onClick={() => setShowAddCourseModal(true)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px', gap: '4px' }}
            >
              <Plus size={14} /> Add Course
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {courses.map(c => (
              <div key={c.id} className="card" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span className="badge badge-accent">{c.code}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{c.name}</h4>
                <p style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600, marginTop: '5px' }}>
                  Subjects: {c.subjects.join(', ')}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Faculty: {c.faculty.join(', ')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      component: (
        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '90px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--brand-900)' }}>Settings & Reports</h3>

          {/* Quick Export Cards */}
          <div className="card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>Export Institute Data</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '12px' }}>Download full reports in 1-tap:</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => handleExport('csv')} className="btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '8px' }}>
                <Download size={13} /> CSV
              </button>
              <button onClick={() => handleExport('xlsx')} className="btn-secondary" style={{ flex: 1, fontSize: '11px', padding: '8px' }}>
                <Download size={13} /> Excel
              </button>
              <button onClick={() => handleExport('pdf')} className="btn-primary" style={{ flex: 1, fontSize: '11px', padding: '8px' }}>
                <Download size={13} /> PDF
              </button>
            </div>
            {exportFeedback && (
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600, display: 'block', marginTop: '8px', textAlign: 'center' }}>
                {exportFeedback}
              </span>
            )}
          </div>


          <button
            onClick={onLogout}
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: 'var(--danger)',
              borderRadius: 'var(--radius-lg)',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            Log Out from Admin
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      <ScreenSlider
        activeTab={activeTab}
        tabs={adminTabs}
        onNavigate={onNavigate}
        roleKey="admin"
      />

      {/* Add Student Modal */}
      {showAddModal && (
        <div
          className={`modal-backdrop-05s ${isModalClosing ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseAddModal(); }}
        >
          <div className={`modal-sheet-05s ${isModalClosing ? 'closing' : ''}`} style={{ padding: '24px 20px' }}>
            <div className="sheet-drag-handle" />
            <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '8px 0 16px 0', color: 'var(--brand-900)' }}>Add New Student</h4>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Student Name"
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="student@email.com"
                  value={newStudentEmail}
                  onChange={e => setNewStudentEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Password (visible)</label>
                <input
                  type="text"
                  autoComplete="off"
                  required
                  placeholder="Set login password"
                  value={newStudentPassword}
                  onChange={e => setNewStudentPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px', fontFamily: 'monospace' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Course</label>
                <select
                  value={newStudentCourse}
                  onChange={e => setNewStudentCourse(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                >
                  {COURSE_OPTIONS.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="button" onClick={handleCloseAddModal} className="btn-secondary" style={{ flex: 1, fontSize: '13px', padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, fontSize: '13px', padding: '10px' }}>
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Parent Modal */}
      {showAddParentModal && (
        <div
          className={`modal-backdrop-05s ${isParentModalClosing ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseAddParentModal(); }}
        >
          <div className={`modal-sheet-05s ${isParentModalClosing ? 'closing' : ''}`} style={{ padding: '24px 20px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="sheet-drag-handle" />
            <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '8px 0 16px 0', color: 'var(--brand-900)' }}>
              Add New Parent
            </h4>
            <form onSubmit={handleAddParent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Parent Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Gupta"
                  value={newParentName}
                  onChange={e => setNewParentName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98XXX XXXXX"
                  value={newParentPhone}
                  onChange={e => setNewParentPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="parent@example.com"
                  value={newParentEmail}
                  onChange={e => setNewParentEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--brand-800)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Linked Student Connection
                  </span>
                  {selectedStudentIdForParent && selectedStudentIdForParent !== 'custom' && (
                    <span className="badge badge-success" style={{ fontSize: '9.5px' }}>✓ Linked</span>
                  )}
                </div>

                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Select Enrolled Student to Auto-Link
                </label>
                <select
                  value={selectedStudentIdForParent}
                  onChange={e => handleSelectStudentForParent(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid var(--brand-500)', marginTop: '4px', fontSize: '13px', background: '#f0f9ff', fontWeight: 600, color: 'var(--brand-900)' }}
                >
                  <option value="">-- Choose Existing Student --</option>
                  {students.map(std => (
                    <option key={std.id} value={std.id}>
                      {std.name} (Roll #{std.roll} • {std.course})
                    </option>
                  ))}
                  <option value="custom">+ Enter New Student Manually</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aryan Gupta"
                  value={newParentChildName}
                  onChange={e => {
                    setNewParentChildName(e.target.value);
                    if (selectedStudentIdForParent && selectedStudentIdForParent !== 'custom') {
                      setSelectedStudentIdForParent('custom');
                    }
                  }}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Student Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. aryan.gupta@aspire.edu"
                  value={newParentChildEmail}
                  onChange={e => setNewParentChildEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Student Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. 106"
                  value={newParentChildRoll}
                  onChange={e => setNewParentChildRoll(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Course / Stream</label>
                <select
                  value={newParentChildCourse}
                  onChange={e => setNewParentChildCourse(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px', background: 'var(--surface)' }}
                >
                  {COURSE_OPTIONS.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={handleCloseAddParentModal} className="btn-secondary" style={{ flex: 1, fontSize: '13px', padding: '10px' }}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingParent}
                  className="btn-primary"
                  style={{
                    flex: 1,
                    fontSize: '13px',
                    padding: '10px',
                    opacity: isSubmittingParent ? 0.65 : 1,
                    cursor: isSubmittingParent ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmittingParent ? 'Adding...' : 'Add Parent'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Faculty Modal */}
      {showAddFacultyModal && (
        <div
          className={`modal-backdrop-05s ${isFacultyModalClosing ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseAddFacultyModal(); }}
        >
          <div className={`modal-sheet-05s ${isFacultyModalClosing ? 'closing' : ''}`} style={{ padding: '24px 20px', maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="sheet-drag-handle" />
            <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '8px 0 16px 0', color: 'var(--brand-900)' }}>Add New Faculty</h4>
            <form onSubmit={handleAddFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Teacher Name"
                  value={newFacultyName}
                  onChange={e => setNewFacultyName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Email ID</label>
                <input
                  type="email"
                  required
                  placeholder="faculty@email.com"
                  value={newFacultyEmail}
                  onChange={e => setNewFacultyEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Password</label>
                <input
                  type="password"
                  required
                  placeholder="Set login password"
                  value={newFacultyPassword}
                  onChange={e => setNewFacultyPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Batch <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(select multiple)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {BATCH_OPTIONS.map(b => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleFacultyBatch(b)}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: newFacultyBatches.includes(b) ? '2px solid var(--brand-600)' : '1.5px solid var(--border)',
                        background: newFacultyBatches.includes(b) ? 'var(--brand-50)' : 'transparent',
                        color: newFacultyBatches.includes(b) ? 'var(--brand-700)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {newFacultyBatches.includes(b) ? '✓ ' : ''}{b}
                    </button>
                  ))}
                </div>
                {newFacultyBatches.length === 0 && <p style={{ fontSize: '11px', color: 'var(--error)', marginTop: '4px' }}>Select at least one batch</p>}
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Subject <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(select multiple)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {SUBJECT_OPTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleFacultySubject(s)}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: newFacultySubjects.includes(s) ? '2px solid var(--accent-500)' : '1.5px solid var(--border)',
                        background: newFacultySubjects.includes(s) ? '#f0f9ff' : 'transparent',
                        color: newFacultySubjects.includes(s) ? 'var(--accent-600)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {newFacultySubjects.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
                {newFacultySubjects.length === 0 && <p style={{ fontSize: '11px', color: 'var(--error)', marginTop: '4px' }}>Select at least one subject</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="button" onClick={handleCloseAddFacultyModal} className="btn-secondary" style={{ flex: 1, fontSize: '13px', padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, fontSize: '13px', padding: '10px' }}>
                  Add Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div
          className={`modal-backdrop-05s ${isCourseModalClosing ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseAddCourseModal(); }}
        >
          <div className={`modal-sheet-05s ${isCourseModalClosing ? 'closing' : ''}`} style={{ padding: '24px 20px', maxHeight: '88vh', overflowY: 'auto' }}>
            <div className="sheet-drag-handle" />
            <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '8px 0 16px 0', color: 'var(--brand-900)' }}>Add New Course</h4>
            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JEE Main + Advanced"
                  value={newCourseName}
                  onChange={e => setNewCourseName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border)', marginTop: '4px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Subjects <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(select multiple)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {SUBJECT_OPTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleCourseSubject(s)}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: newCourseSubjects.includes(s) ? '2px solid var(--accent-500)' : '1.5px solid var(--border)',
                        background: newCourseSubjects.includes(s) ? '#f0f9ff' : 'transparent',
                        color: newCourseSubjects.includes(s) ? 'var(--accent-600)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {newCourseSubjects.includes(s) ? '✓ ' : ''}{s}
                    </button>
                  ))}
                </div>
                {newCourseSubjects.length === 0 && <p style={{ fontSize: '11px', color: 'var(--error)', marginTop: '4px' }}>Select at least one subject</p>}
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Faculty <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(select multiple)</span></label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                  {FACULTY_OPTIONS.map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleCourseFaculty(f)}
                      style={{
                        padding: '5px 11px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: newCourseFaculty.includes(f) ? '2px solid var(--brand-600)' : '1.5px solid var(--border)',
                        background: newCourseFaculty.includes(f) ? 'var(--brand-50)' : 'transparent',
                        color: newCourseFaculty.includes(f) ? 'var(--brand-700)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {newCourseFaculty.includes(f) ? '✓ ' : ''}{f}
                    </button>
                  ))}
                </div>
                {newCourseFaculty.length === 0 && <p style={{ fontSize: '11px', color: 'var(--error)', marginTop: '4px' }}>Select at least one faculty member</p>}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="button" onClick={handleCloseAddCourseModal} className="btn-secondary" style={{ flex: 1, fontSize: '13px', padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, fontSize: '13px', padding: '10px' }}>
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Students List Modal ── */}
      {showStudentsModal && (
        <div className={`modal-backdrop-05s ${closingModal === 'students' ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal('students', setShowStudentsModal); }}>
          <div className={`modal-sheet-05s ${closingModal === 'students' ? 'closing' : ''}`}
            style={{ padding: '24px 20px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>All Students ({students.length})</h4>
              <button onClick={() => closeModal('students', setShowStudentsModal)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {students.map(s => (
                <div key={s.id} className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Roll #{s.roll} • {s.course}</span>
                    {s.parentName && (
                      <div style={{ fontSize: '11px', color: 'var(--brand-700)', fontWeight: 600, marginTop: '2px' }}>
                        Parent: {s.parentName} ({s.parentPhone || 'Linked'})
                      </div>
                    )}
                  </div>
                  <span className="badge badge-success">{s.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Teachers List Modal ── */}
      {showTeachersModal && (
        <div className={`modal-backdrop-05s ${closingModal === 'teachers' ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal('teachers', setShowTeachersModal); }}>
          <div className={`modal-sheet-05s ${closingModal === 'teachers' ? 'closing' : ''}`}
            style={{ padding: '24px 20px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>All Faculty ({teachers.length})</h4>
              <button onClick={() => closeModal('teachers', setShowTeachersModal)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {teachers.map(t => (
                <div key={t.id} className="card" style={{ padding: '12px 14px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</h5>
                  <span style={{ fontSize: '11px', color: 'var(--accent-500)', fontWeight: 600 }}>{t.subject}</span>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Batches: {t.batches}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Notices Modal ── */}
      {showNoticesModal && (
        <div className={`modal-backdrop-05s ${closingModal === 'notices' ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) { closeModal('notices', setShowNoticesModal); setShowAddNoticeForm(false); } }}>
          <div className={`modal-sheet-05s ${closingModal === 'notices' ? 'closing' : ''}`}
            style={{ padding: '24px 20px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>Notices ({notices.length})</h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => setShowAddNoticeForm(f => !f)} className="btn-primary" style={{ padding: '5px 12px', fontSize: '12px' }}>
                  <Plus size={13} /> Add Notice
                </button>
                <button onClick={() => { closeModal('notices', setShowNoticesModal); setShowAddNoticeForm(false); }} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
              </div>
            </div>
            {showAddNoticeForm && (
              <form onSubmit={handleAddNotice} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px', padding: '14px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <input
                  type="text" required placeholder="Notice title"
                  value={newNoticeTitle} onChange={e => setNewNoticeTitle(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '13px' }}
                />
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {NOTICE_CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setNewNoticeCategory(cat)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          border: newNoticeCategory === cat ? '2px solid var(--brand-600)' : '1.5px solid var(--border)',
                          background: newNoticeCategory === cat ? 'var(--brand-50)' : 'transparent',
                          color: newNoticeCategory === cat ? 'var(--brand-700)' : 'var(--text-secondary)',
                        }}
                      >
                        {newNoticeCategory === cat ? '✓ ' : ''}{cat}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  required placeholder="Notice message..."
                  value={newNoticeMsg} onChange={e => setNewNoticeMsg(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '13px', resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setShowAddNoticeForm(false)} className="btn-secondary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1, fontSize: '12px', padding: '8px' }}>Publish</button>
                </div>
              </form>
            )}
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {notices.map(n => (
                <div key={n.id} className="card" style={{ padding: '12px 14px', borderLeft: `3px solid ${n.priority === 'high' ? '#ef4444' : '#f59e0b'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', flex: 1, marginRight: '8px' }}>{n.title}</h5>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', flexShrink: 0 }}>{n.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>{n.message}</p>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>{n.date} • {n.category}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Absent Today Modal ── */}
      {showAbsentModal && !selectedAbsentStudent && (
        <div className={`modal-backdrop-05s ${closingModal === 'absent' ? 'closing' : ''}`}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal('absent', setShowAbsentModal); }}>
          <div className={`modal-sheet-05s ${closingModal === 'absent' ? 'closing' : ''}`}
            style={{ padding: '24px 20px', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>Absent Today ({absentStudents.length})</h4>
              <button onClick={() => closeModal('absent', setShowAbsentModal)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {absentStudents.map(s => (
                <div key={s.id} className="card" style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onClick={() => setSelectedAbsentStudent(s)}>
                  <div>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.name}</h5>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{s.course}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="badge" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>Absent</span>
                    <ChevronRight size={14} color="var(--text-muted)" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Absent Student Detail Modal ── */}
      {showAbsentModal && selectedAbsentStudent && (
        <div className="modal-backdrop-05s"
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedAbsentStudent(null); }}>
          <div className="modal-sheet-05s" style={{ padding: '24px 20px' }}>
            <div className="sheet-drag-handle" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <button onClick={() => setSelectedAbsentStudent(null)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>‹</button>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--brand-900)' }}>Student Info</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', color: '#fff', fontWeight: 800 }}>
                {selectedAbsentStudent.name.charAt(0)}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>{selectedAbsentStudent.name}</h3>
              <span className="badge" style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' }}>Absent Today</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Course', value: selectedAbsentStudent.course },
                { label: 'Email ID', value: selectedAbsentStudent.email },
                { label: 'Phone', value: selectedAbsentStudent.phone },
                { label: "Parent's Phone", value: selectedAbsentStudent.parentPhone },
                { label: 'Blood Group', value: selectedAbsentStudent.bloodGroup },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface)', borderRadius: '10px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Study Materials Modal ── */}
      <AdminStudyMaterialsModal
        isOpen={showMaterialsModal}
        onClose={() => setShowMaterialsModal(false)}
      />

      {/* ── Tests & Exams Modal ── */}
      <AdminTestsModal
        isOpen={showTestsModal}
        onClose={() => setShowTestsModal(false)}
      />

      {/* ── Timetable Modal ── */}
      <AdminTimetableModal
        isOpen={showTimetableModal}
        onClose={() => setShowTimetableModal(false)}
      />

      {/* ── Attendance Analytics Modal ── */}
      <AdminAttendanceModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
      />

      {/* ── Marks Management & Upload Modal ── */}
      <AdminMarksModal
        isOpen={showMarksModal}
        onClose={() => setShowMarksModal(false)}
      />
    </>
  );
}
