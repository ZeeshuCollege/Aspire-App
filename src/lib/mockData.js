/**
 * Master Data matching ASPIRE THEME.png exactly
 */

export const DEFAULT_GREY_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128"><rect width="128" height="128" rx="28" fill="%23e2e8f0"/><circle cx="64" cy="48" r="22" fill="%2394a3b8"/><path d="M26 108c0-20.987 17.013-38 38-38s38 17.013 38 38v4H26v-4z" fill="%2394a3b8"/></svg>`;

export const mockUsers = {
  student: {
    id: 'std-104',
    name: 'Rohan Sharma',
    role: 'student',
    course: 'Std. 12 • Science • JEE',
    rollNumber: 'ASPIRE-2025-104',
    email: 'rohan.sharma@gmail.com',
    phone: '+91 98201 23456',
    bloodGroup: 'B+',
    parentName: 'Amit Sharma',
    parentPhone: '+91 77385 78685',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    overallAttendance: 89,
    overallPerformance: 78
  },
  teacher: {
    id: 'tch-018',
    name: 'Ms. Priya Shah',
    role: 'teacher',
    subject: 'Physics',
    subjects: 'Physics',
    designation: 'Senior Physics Faculty',
    department: 'Science & Competitive Exams',
    employeeId: 'ASPIRE-FAC-018',
    email: 'priya.shah@aspirelearning.com',
    phone: '+91 98209 87654',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    assignedBatches: ['JEE 12 - A', 'Class 11 - A', 'Class 10 - A']
  },
  parent: {
    id: 'par-052',
    name: 'Amit Sharma',
    role: 'parent',
    email: 'amit.sharma@yahoo.com',
    phone: '+917738578685',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    linkedChild: {
      name: 'Rohan Sharma',
      class: 'Std. 12 • Science',
      attendance: 92,
      tests: 86,
      performance: 78
    }
  },
  admin: {
    id: 'adm-001',
    name: 'ASPIRE Admin',
    role: 'admin',
    email: 'aspirelearningcentre@outlook.com',
    phone: '+917738578685',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
};

export const mockSchedule = [
  { id: 1, day: 'Mon', subject: 'Physics', time: '10:00 AM - 11:00 AM', room: 'Room 204', faculty: 'Ms. Priya Shah', status: 'Ongoing' },
  { id: 2, day: 'Mon', subject: 'Mathematics', time: '11:30 AM - 12:30 PM', room: 'Room 201', faculty: 'Mr. Neha Kapoor', status: 'Upcoming' },
  { id: 3, day: 'Mon', subject: 'Chemistry', time: '1:00 PM - 2:00 PM', room: 'Room 203', faculty: 'Mr. Rahul Verma', status: 'Upcoming' },
  { id: 4, day: 'Mon', subject: 'Biology', time: '4:00 PM - 5:00 PM', room: 'Room 202', faculty: 'Mr. Suresh Iyer', status: 'Upcoming' }
];

export const mockTests = [
  {
    id: 't-01',
    code: 'Physics Test 01',
    subject: 'Physics',
    chapter: 'Mechanics',
    date: '18 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    status: 'Upcoming',
    paperUrl: 'mock_physics_test_01.pdf',
    instructions: '1. All questions are compulsory.\n2. Negative marking: -1 for incorrect MCQ responses.\n3. Calculator is strictly prohibited.'
  },
  {
    id: 't-02',
    code: 'Chemistry Test 02',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry',
    date: '22 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    status: 'Upcoming',
    paperUrl: 'mock_chemistry_test_02.pdf',
    instructions: '1. Standard JEE pattern.\n2. Verify all chemical equations.'
  },
  {
    id: 't-03',
    code: 'Mathematics Test 01',
    subject: 'Mathematics',
    chapter: 'Trigonometry',
    date: '26 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    status: 'Upcoming',
    paperUrl: 'mock_maths_test_01.pdf',
    instructions: '1. Show all intermediate derivation steps where required.'
  },
  {
    id: 't-04',
    code: 'Physics Unit Test 1',
    subject: 'Physics',
    chapter: 'Kinematics & Laws of Motion',
    date: '10 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    status: 'Completed',
    marksObtained: 88,
    percentage: 88,
    rank: 4,
    correct: 22,
    incorrect: 2,
    unattempted: 1
  }
];

export const mockStudyMaterials = [
  { id: 'm-1', title: 'Mechanics & Newton Laws', subject: 'Physics', chapter: 'Chapter 1', type: 'PDF', size: '3.4 MB', date: '12 Apr 2025' },
  { id: 'm-2', title: 'Organic Chemistry Reactions', subject: 'Chemistry', chapter: 'Chapter 3', type: 'PDF', size: '1.8 MB', date: '10 Apr 2025' },
  { id: 'm-3', title: 'Trigonometry Formulas & Problems', subject: 'Mathematics', chapter: 'Chapter 4', type: 'PDF', size: '4.2 MB', date: '08 Apr 2025' },
  { id: 'm-4', title: 'Cell Structure & Genetics', subject: 'Biology', chapter: 'Chapter 2', type: 'Video', size: '45 MB', date: '05 Apr 2025' }
];

export const mockBatches = [
  {
    id: 'b-1',
    name: 'JEE 12 - A',
    studentsCount: 35,
    subject: 'Physics',
    time: '10:00 AM - 1:00 PM',
    status: 'Active',
    room: 'Room 204',
    courseName: 'Std. 12 Science • JEE Advanced Physics Mastery',
    courseCode: 'PHY-JEE-12A',
    faculty: 'Ms. Priya Shah (Physics Specialist)',
    syllabusProgress: 72,
    currentChapter: 'Mechanics & Newton\'s Laws of Motion',
    academicYear: '2024–2025',
    totalLectures: 32,
    nextTest: 'Physics Unit Test 2 • 22 Apr 2025'
  },
  {
    id: 'b-2',
    name: 'NEET 12 - B',
    studentsCount: 29,
    subject: 'Physics',
    time: '11:00 AM - 2:00 PM',
    status: 'Active',
    room: 'Room 201',
    courseName: 'Std. 12 Medical • NEET Physics Intensive',
    courseCode: 'PHY-NEET-12B',
    faculty: 'Ms. Priya Shah',
    syllabusProgress: 68,
    currentChapter: 'Optics & Wave Motion',
    academicYear: '2024–2025',
    totalLectures: 30,
    nextTest: 'Optics Assessment • 24 Apr 2025'
  },
  {
    id: 'b-3',
    name: 'Class 11 - A',
    studentsCount: 32,
    subject: 'Physics',
    time: '08:00 AM - 11:00 AM',
    status: 'Active',
    room: 'Room 105',
    courseName: 'Std. 11 Foundation • Physics Fundamentals',
    courseCode: 'PHY-FND-11A',
    faculty: 'Ms. Priya Shah',
    syllabusProgress: 60,
    currentChapter: 'Units, Dimensions & Vectors',
    academicYear: '2024–2025',
    totalLectures: 26,
    nextTest: 'Vectors & Kinematics • 28 Apr 2025'
  },
  {
    id: 'b-4',
    name: 'Class 10 - A',
    studentsCount: 30,
    subject: 'Science',
    time: '02:00 PM - 05:00 PM',
    status: 'Active',
    room: 'Room 102',
    courseName: 'Std. 10 Board Accelerator • General Science',
    courseCode: 'SCI-BRD-10A',
    faculty: 'Ms. Priya Shah',
    syllabusProgress: 80,
    currentChapter: 'Electricity & Magnetic Effects',
    academicYear: '2024–2025',
    totalLectures: 34,
    nextTest: 'Electricity Practical Mock • 25 Apr 2025'
  }
];

export const mockBatchStudents = [
  {
    id: 's-104',
    name: 'Rohan Sharma',
    roll: '104',
    rollNumber: 'ASPIRE-2025-104',
    email: 'rohan.sharma@gmail.com',
    phone: '+91 98201 23456',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'B+',
    parentName: 'Amit Sharma',
    parentPhone: '+91 77385 78685',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Present',
    attendanceRate: 89,
    attendedCount: 25,
    totalCount: 28,
    recentAttendance: ['Present', 'Present', 'Absent', 'Present', 'Present'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 88,
      maxMarks: 100,
      percentage: 88,
      rank: 4,
      classAverage: 71,
      correct: 22,
      incorrect: 2,
      unattempted: 1,
      status: 'Passed (Distinction)',
      grade: 'A'
    }
  },
  {
    id: 's-101',
    name: 'Aarav Mehta',
    roll: '101',
    rollNumber: 'ASPIRE-2025-101',
    email: 'aarav.mehta@gmail.com',
    phone: '+91 98111 22334',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'O+',
    parentName: 'Rajesh Mehta',
    parentPhone: '+91 98222 33445',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Present',
    attendanceRate: 94,
    attendedCount: 27,
    totalCount: 28,
    recentAttendance: ['Present', 'Present', 'Present', 'Present', 'Present'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 96,
      maxMarks: 100,
      percentage: 96,
      rank: 1,
      classAverage: 71,
      correct: 24,
      incorrect: 1,
      unattempted: 0,
      status: 'Top Performer (Rank 1)',
      grade: 'A+'
    }
  },
  {
    id: 's-102',
    name: 'Diya Patel',
    roll: '102',
    rollNumber: 'ASPIRE-2025-102',
    email: 'diya.patel@gmail.com',
    phone: '+91 98222 55667',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'A+',
    parentName: 'Sanjay Patel',
    parentPhone: '+91 98333 44556',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Present',
    attendanceRate: 91,
    attendedCount: 26,
    totalCount: 28,
    recentAttendance: ['Present', 'Present', 'Present', 'Absent', 'Present'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 85,
      maxMarks: 100,
      percentage: 85,
      rank: 6,
      classAverage: 71,
      correct: 21,
      incorrect: 3,
      unattempted: 1,
      status: 'Passed (Grade A)',
      grade: 'A'
    }
  },
  {
    id: 's-103',
    name: 'Karan Malhotra',
    roll: '103',
    rollNumber: 'ASPIRE-2025-103',
    email: 'karan.m@gmail.com',
    phone: '+91 98333 77889',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'AB+',
    parentName: 'Vikram Malhotra',
    parentPhone: '+91 98444 55667',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Absent',
    attendanceRate: 82,
    attendedCount: 23,
    totalCount: 28,
    recentAttendance: ['Present', 'Absent', 'Present', 'Present', 'Absent'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 74,
      maxMarks: 100,
      percentage: 74,
      rank: 14,
      classAverage: 71,
      correct: 18,
      incorrect: 5,
      unattempted: 2,
      status: 'Passed',
      grade: 'B+'
    }
  },
  {
    id: 's-105',
    name: 'Sneha Iyer',
    roll: '105',
    rollNumber: 'ASPIRE-2025-105',
    email: 'sneha.iyer@gmail.com',
    phone: '+91 98444 88990',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'O-',
    parentName: 'Raman Iyer',
    parentPhone: '+91 98555 66778',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Present',
    attendanceRate: 96,
    attendedCount: 27,
    totalCount: 28,
    recentAttendance: ['Present', 'Present', 'Present', 'Present', 'Present'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 92,
      maxMarks: 100,
      percentage: 92,
      rank: 2,
      classAverage: 71,
      correct: 23,
      incorrect: 1,
      unattempted: 1,
      status: 'Top Performer (Rank 2)',
      grade: 'A+'
    }
  },
  {
    id: 's-106',
    name: 'Riya Sen',
    roll: '106',
    rollNumber: 'ASPIRE-2025-106',
    email: 'riya.sen@gmail.com',
    phone: '+91 98555 11223',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'B-',
    parentName: 'Debashis Sen',
    parentPhone: '+91 98666 77889',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Absent',
    attendanceRate: 75,
    attendedCount: 21,
    totalCount: 28,
    recentAttendance: ['Absent', 'Present', 'Absent', 'Present', 'Absent'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 62,
      maxMarks: 100,
      percentage: 62,
      rank: 22,
      classAverage: 71,
      correct: 15,
      incorrect: 8,
      unattempted: 2,
      status: 'Needs Attention',
      grade: 'C'
    }
  },
  {
    id: 's-107',
    name: 'Siddharth Rao',
    roll: '107',
    rollNumber: 'ASPIRE-2025-107',
    email: 'siddharth.rao@gmail.com',
    phone: '+91 98666 33445',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'A-',
    parentName: 'Venkat Rao',
    parentPhone: '+91 98777 88990',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Present',
    attendanceRate: 88,
    attendedCount: 24,
    totalCount: 28,
    recentAttendance: ['Present', 'Present', 'Present', 'Present', 'Absent'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 81,
      maxMarks: 100,
      percentage: 81,
      rank: 9,
      classAverage: 71,
      correct: 20,
      incorrect: 4,
      unattempted: 1,
      status: 'Passed (Grade A)',
      grade: 'A'
    }
  },
  {
    id: 's-108',
    name: 'Ananya Deshmukh',
    roll: '108',
    rollNumber: 'ASPIRE-2025-108',
    email: 'ananya.d@gmail.com',
    phone: '+91 98777 55667',
    course: 'Std. 12 • Science • JEE',
    bloodGroup: 'B+',
    parentName: 'Prasad Deshmukh',
    parentPhone: '+91 98888 99001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    todayAttendance: 'Present',
    attendanceRate: 92,
    attendedCount: 26,
    totalCount: 28,
    recentAttendance: ['Present', 'Present', 'Present', 'Present', 'Present'],
    latestTest: {
      subject: 'Physics',
      title: 'Physics Mechanics & Laws of Motion',
      date: '10 Apr 2025',
      score: 89,
      maxMarks: 100,
      percentage: 89,
      rank: 3,
      classAverage: 71,
      correct: 22,
      incorrect: 2,
      unattempted: 1,
      status: 'Top Performer (Rank 3)',
      grade: 'A'
    }
  }
];

export const mockStudentsList = mockBatchStudents;

export const mockTeachersList = [
  { id: 't-1', name: 'Ms. Priya Shah', subject: 'Physics', batches: 'JEE 12-A, Class 11-A', status: 'Active' },
  { id: 't-2', name: 'Mr. Rahul Verma', subject: 'Chemistry', batches: 'NEET 12-B, Class 10-A', status: 'Active' },
  { id: 't-3', name: 'Ms. Neha Kapoor', subject: 'Mathematics', batches: 'JEE 12-A, Class 11-A', status: 'Active' },
  { id: 't-4', name: 'Mr. Suresh Iyer', subject: 'Biology', batches: 'NEET 12-B', status: 'Active' }
];

export const mockAdminStats = {
  totalStudents: 248,
  presentToday: 218,
  totalTeachers: 18,
  pendingFees: '₹1,25,000'
};

// Notices and Announcements ordered from latest to oldest
export const mockNotices = [
  {
    id: 'notif-1',
    title: 'JEE Advanced Mock Test 03 Scheduled',
    message: 'Physics & Chemistry combined 3-hour assessment will be conducted this Sunday from 9:00 AM to 12:00 PM in Room 204. Reporting time is 8:45 AM.',
    category: 'Test',
    priority: 'high',
    timestamp: 'Just now',
    date: '18 Apr 2025',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Attendance Alert: Physics Lecture',
    message: 'Attendance successfully marked: Present for today\'s 10:00 AM Physics Mechanics lecture with Ms. Priya Shah.',
    category: 'Attendance',
    priority: 'normal',
    timestamp: '2 hours ago',
    date: '18 Apr 2025',
    read: false
  },
  {
    id: 'notif-3',
    title: 'New Study Material: Organic Chemistry Reactions',
    message: 'Comprehensive handwritten chapter summary and reaction mechanism flowchart uploaded by Mr. Rahul Verma.',
    category: 'Material',
    priority: 'normal',
    timestamp: '5 hours ago',
    date: '18 Apr 2025',
    read: false
  },
  {
    id: 'notif-4',
    title: 'Parent-Teacher Meeting (PTM) Scheduled',
    message: 'Term 1 Academic Performance Discussion scheduled for Saturday, 26th April. One-on-one slots allocated between 10:00 AM and 2:00 PM.',
    category: 'Notice',
    priority: 'high',
    timestamp: 'Yesterday',
    date: '17 Apr 2025',
    read: true
  },
  {
    id: 'notif-5',
    title: 'Fee Payment Acknowledgment: Term 2',
    message: 'Receipt #ASP-2025-0842 generated for ₹45,000 paid via Net Banking. Remaining term balance is ₹30,000 due by 25 Apr 2025.',
    category: 'Fee',
    priority: 'normal',
    timestamp: '2 days ago',
    date: '16 Apr 2025',
    read: true
  },
  {
    id: 'notif-6',
    title: 'Classroom Maintenance Notice',
    message: 'Room 201 smartboard calibration completed. Class 11 Mathematics will resume in Room 201 as scheduled.',
    category: 'Notice',
    priority: 'low',
    timestamp: '4 days ago',
    date: '14 Apr 2025',
    read: true
  },
  {
    id: 'notif-7',
    title: 'National Holiday: Centre Closed',
    message: 'ASPIRE Learning Centre will remain closed on Tuesday for Mahavir Jayanti. All missed doubt sessions will be compensated on Thursday.',
    category: 'Notice',
    priority: 'low',
    timestamp: '1 week ago',
    date: '11 Apr 2025',
    read: true
  }
];

// Last 30 Latest Lectures Attendance (strictly ordered from newest to oldest)
export const mockLectureAttendance = [
  { id: 'lec-30', lectureNumber: 83, date: '18 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Physics', topic: "Electromagnetic Induction & Faraday's Law", faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '09:56 AM' },
  { id: 'lec-29', lectureNumber: 82, date: '17 Sep 2026', time: '02:00 PM - 03:00 PM', subject: 'Chemistry', topic: 'Thermodynamics & Carnot Cycle', faculty: 'Mr. Rahul Verma', status: 'Present', recordedAt: '01:58 PM' },
  { id: 'lec-28', lectureNumber: 81, date: '17 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Mathematics', topic: 'Definite Integrals & Properties', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '09:55 AM' },
  { id: 'lec-27', lectureNumber: 80, date: '16 Sep 2026', time: '11:30 AM - 12:30 PM', subject: 'Physics', topic: 'Alternating Current & LC Oscillations', faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '11:28 AM' },
  { id: 'lec-26', lectureNumber: 79, date: '16 Sep 2026', time: '09:00 AM - 10:00 AM', subject: 'Chemistry', topic: 'Coordination Compounds & Ligands', faculty: 'Mr. Rahul Verma', status: 'Present', recordedAt: '08:58 AM' },
  { id: 'lec-25', lectureNumber: 78, date: '15 Sep 2026', time: '03:00 PM - 04:00 PM', subject: 'Biology', topic: 'Molecular Basis of Inheritance', faculty: 'Mr. Suresh Iyer', status: 'Absent', recordedAt: 'Missed' },
  { id: 'lec-24', lectureNumber: 77, date: '15 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Mathematics', topic: 'Applications of Derivatives: Tangents', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '09:57 AM' },
  { id: 'lec-23', lectureNumber: 76, date: '14 Sep 2026', time: '01:00 PM - 02:00 PM', subject: 'Chemistry', topic: 'Electrochemistry & Nernst Equation', faculty: 'Mr. Rahul Verma', status: 'Present', recordedAt: '12:59 PM' },
  { id: 'lec-22', lectureNumber: 75, date: '14 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Physics', topic: 'Magnetism & Matter: Dipole Moments', faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '09:54 AM' },
  { id: 'lec-21', lectureNumber: 74, date: '13 Sep 2026', time: '11:00 AM - 12:00 PM', subject: 'Mathematics', topic: 'Indefinite Integration: Partial Fractions', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '10:58 AM' },
  { id: 'lec-20', lectureNumber: 73, date: '12 Sep 2026', time: '02:00 PM - 03:00 PM', subject: 'Biology', topic: 'Biotechnology Principles & Processes', faculty: 'Mr. Suresh Iyer', status: 'Present', recordedAt: '01:55 PM' },
  { id: 'lec-19', lectureNumber: 72, date: '12 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Physics', topic: 'Moving Charges and Magnetic Field', faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '09:59 AM' },
  { id: 'lec-18', lectureNumber: 71, date: '11 Sep 2026', time: '01:30 PM - 02:30 PM', subject: 'Chemistry', topic: 'Chemical Kinetics: Integrated Rate Laws', faculty: 'Mr. Rahul Verma', status: 'Present', recordedAt: '01:25 PM' },
  { id: 'lec-17', lectureNumber: 70, date: '11 Sep 2026', time: '09:30 AM - 10:30 AM', subject: 'Mathematics', topic: 'Continuity & Differentiability Review', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '09:28 AM' },
  { id: 'lec-16', lectureNumber: 69, date: '10 Sep 2026', time: '03:00 PM - 04:00 PM', subject: 'Physics', topic: "Current Electricity & Kirchhoff's Laws", faculty: 'Ms. Priya Shah', status: 'Absent', recordedAt: 'Missed' },
  { id: 'lec-15', lectureNumber: 68, date: '10 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Chemistry', topic: 'Solutions & Colligative Properties', faculty: 'Mr. Rahul Verma', status: 'Present', recordedAt: '09:56 AM' },
  { id: 'lec-14', lectureNumber: 67, date: '09 Sep 2026', time: '11:30 AM - 12:30 PM', subject: 'Mathematics', topic: 'Matrices and System of Linear Equations', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '11:27 AM' },
  { id: 'lec-13', lectureNumber: 66, date: '09 Sep 2026', time: '09:00 AM - 10:00 AM', subject: 'Biology', topic: 'Genetics & Chromosomal Aberrations', faculty: 'Mr. Suresh Iyer', status: 'Present', recordedAt: '08:59 AM' },
  { id: 'lec-12', lectureNumber: 65, date: '08 Sep 2026', time: '02:00 PM - 03:00 PM', subject: 'Physics', topic: 'Electrostatic Potential & Capacitance', faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '01:57 PM' },
  { id: 'lec-11', lectureNumber: 64, date: '08 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Chemistry', topic: 'Solid State: Crystal Lattices & Voids', faculty: 'Mr. Rahul Verma', status: 'Present', recordedAt: '09:55 AM' },
  { id: 'lec-10', lectureNumber: 63, date: '07 Sep 2026', time: '01:00 PM - 02:00 PM', subject: 'Mathematics', topic: 'Inverse Trigonometric Functions', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '12:58 PM' },
  { id: 'lec-09', lectureNumber: 62, date: '07 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Physics', topic: 'Electric Charges and Fields: Gauss Law', faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '09:54 AM' },
  { id: 'lec-08', lectureNumber: 61, date: '05 Sep 2026', time: '11:00 AM - 12:00 PM', subject: 'Biology', topic: 'Ecology and Biogeochemical Cycles', faculty: 'Mr. Suresh Iyer', status: 'Present', recordedAt: '10:55 AM' },
  { id: 'lec-07', lectureNumber: 60, date: '05 Sep 2026', time: '09:00 AM - 10:00 AM', subject: 'Chemistry', topic: 'Periodic Trends & Chemical Bonding', faculty: 'Mr. Rahul Verma', status: 'Present', recordedAt: '08:58 AM' },
  { id: 'lec-06', lectureNumber: 59, date: '04 Sep 2026', time: '02:00 PM - 03:00 PM', subject: 'Mathematics', topic: 'Relations and Functions: Bijective Maps', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '01:58 PM' },
  { id: 'lec-05', lectureNumber: 58, date: '04 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Physics', topic: "Wave Optics: Young's Double Slit Experiment", faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '09:57 AM' },
  { id: 'lec-04', lectureNumber: 57, date: '03 Sep 2026', time: '03:00 PM - 04:00 PM', subject: 'Chemistry', topic: 'Organic Reaction Mechanisms: SN1 vs SN2', faculty: 'Mr. Rahul Verma', status: 'Absent', recordedAt: 'Missed' },
  { id: 'lec-03', lectureNumber: 56, date: '03 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Mathematics', topic: 'Complex Numbers & De Moivre Theorem', faculty: 'Mr. Neha Kapoor', status: 'Present', recordedAt: '09:56 AM' },
  { id: 'lec-01', lectureNumber: 54, date: '02 Sep 2026', time: '10:00 AM - 11:00 AM', subject: 'Physics', topic: 'Ray Optics and Optical Instruments', faculty: 'Ms. Priya Shah', status: 'Present', recordedAt: '09:55 AM' }
];

export const mockParentsList = [
  {
    id: 'par-1',
    name: 'Amit Sharma',
    phone: '+91 77385 78685',
    email: 'amit.sharma@yahoo.com',
    linkedChildName: 'Rohan Sharma',
    linkedChildEmail: 'rohan.sharma@aspire.edu',
    linkedChildRoll: '104',
    linkedChildCourse: 'Std. 12 • Science • JEE',
    status: 'Active'
  },
  {
    id: 'par-2',
    name: 'Rajesh Mehta',
    phone: '+91 98222 33445',
    email: 'rajesh.mehta@gmail.com',
    linkedChildName: 'Aarav Mehta',
    linkedChildEmail: 'aarav.mehta@aspire.edu',
    linkedChildRoll: '101',
    linkedChildCourse: 'Std. 12 • Science • JEE',
    status: 'Active'
  },
  {
    id: 'par-3',
    name: 'Sunita Deshmukh',
    phone: '+91 98333 44556',
    email: 'sunita.deshmukh@gmail.com',
    linkedChildName: 'Ananya Deshmukh',
    linkedChildEmail: 'ananya.deshmukh@aspire.edu',
    linkedChildRoll: '102',
    linkedChildCourse: 'Std. 12 • Science • NEET',
    status: 'Active'
  },
  {
    id: 'par-4',
    name: 'Vikram Verma',
    phone: '+91 98444 55667',
    email: 'vikram.verma@gmail.com',
    linkedChildName: 'Kabir Verma',
    linkedChildEmail: 'kabir.verma@aspire.edu',
    linkedChildRoll: '103',
    linkedChildCourse: 'Std. 11 • Science • JEE',
    status: 'Active'
  },
  {
    id: 'par-5',
    name: 'Manoj Patel',
    phone: '+91 98555 66778',
    email: 'manoj.patel@gmail.com',
    linkedChildName: 'Riya Patel',
    linkedChildEmail: 'riya.patel@aspire.edu',
    linkedChildRoll: '105',
    linkedChildCourse: 'Std. 10 • Foundation',
    status: 'Active'
  }
];
