/**
 * Master Data matching ASPIRE THEME.png exactly
 */

export const DEFAULT_GREY_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128"><rect width="128" height="128" rx="28" fill="%23e2e8f0"/><circle cx="64" cy="48" r="22" fill="%2394a3b8"/><path d="M26 108c0-20.987 17.013-38 38-38s38 17.013 38 38v4H26v-4z" fill="%2394a3b8"/></svg>`;

export const mockUsers = {
  admin: {
    id: 'adm-001',
    name: 'ASPIRE Admin',
    role: 'admin',
    email: 'aspirelearningcentre@outlook.com',
    phone: '+917738578685',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  },
  student: {
    id: 'std-empty',
    name: 'Student',
    role: 'student',
    course: '12th Science',
    rollNumber: '',
    email: '',
    phone: '',
    bloodGroup: '',
    parentName: '',
    parentPhone: '',
    avatar: DEFAULT_GREY_AVATAR,
    overallAttendance: 0,
    overallPerformance: 0
  },
  teacher: {
    id: 'tch-empty',
    name: 'Teacher',
    role: 'teacher',
    subject: '',
    subjects: '',
    designation: 'Faculty',
    department: 'Academics',
    employeeId: '',
    email: '',
    phone: '',
    bloodGroup: '',
    avatar: DEFAULT_GREY_AVATAR,
    assignedBatches: []
  },
  parent: {
    id: 'par-empty',
    name: 'Parent',
    role: 'parent',
    email: '',
    phone: '',
    avatar: DEFAULT_GREY_AVATAR,
    linkedChild: {
      name: '',
      class: '',
      attendance: 0,
      tests: 0,
      performance: 0
    }
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
    title: 'GATE 2022 General Aptitude Test',
    code: 'GATE-2022-GA',
    course: 'JEE (Mains + Adv)',
    subject: 'Physics (JEE)',
    chapter: 'Verbal & Numerical Ability',
    date: '19 Sep 2026',
    duration: '180 min',
    maxMarks: 100,
    passingMarks: 35,
    size: '507 KB',
    status: 'Upcoming',
    mode: 'Offline Classroom Paper',
    paperUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    instructions: '1. All questions are compulsory.\n2. Negative marking: -0.33 for 1-mark questions, -0.66 for 2-mark questions.\n3. Calculator is strictly prohibited.'
  },
  {
    id: 't-02',
    title: 'Physics Mechanics Unit Test 01',
    code: 'PHY-JEE-T01',
    course: 'JEE (Mains + Adv)',
    subject: 'Physics (JEE)',
    chapter: 'Kinematics & Laws of Motion',
    date: '18 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    passingMarks: 40,
    size: '2.1 MB',
    status: 'Upcoming',
    mode: 'Offline Classroom Paper',
    paperUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    instructions: '1. All questions are compulsory.\n2. Negative marking: -1 for incorrect MCQ responses.\n3. Calculator is strictly prohibited.'
  },
  {
    id: 't-03',
    title: 'Organic Chemistry Periodic Test 02',
    code: 'CHEM-NEET-T02',
    course: 'NEET',
    subject: 'Chemistry (NEET)',
    chapter: 'Organic Chemistry Reactions',
    date: '22 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    passingMarks: 40,
    size: '1.8 MB',
    status: 'Upcoming',
    mode: 'Offline Classroom Paper',
    paperUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    instructions: '1. Standard JEE/NEET pattern.\n2. Verify all chemical equations.'
  },
  {
    id: 't-04',
    title: 'Mathematics Trigonometry Test 01',
    code: 'MATH-JEE-T01',
    course: '11th Science',
    subject: 'Maths (JEE)',
    chapter: 'Trigonometric Equations',
    date: '26 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    passingMarks: 35,
    size: '3.4 MB',
    status: 'Upcoming',
    mode: 'Offline Classroom Paper',
    paperUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    instructions: '1. Show all intermediate derivation steps where required.'
  },
  {
    id: 't-05',
    title: 'Physics Unit Test 1 (Kinematics)',
    code: 'PHY-UT-01',
    course: '12th Science',
    subject: 'Physics (JEE)',
    chapter: 'Kinematics & Laws of Motion',
    date: '10 Apr 2025',
    duration: '90 min',
    maxMarks: 100,
    passingMarks: 40,
    size: '1.5 MB',
    status: 'Completed',
    mode: 'Offline Classroom Paper',
    paperUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    marksObtained: 88,
    percentage: 88,
    rank: 4,
    correct: 22,
    incorrect: 2,
    unattempted: 1
  }
];

export const mockStudyMaterials = [
  { 
    id: 'm-1', 
    title: 'GATE 2022 General Aptitude Question Paper', 
    course: 'JEE (Mains + Adv)', 
    subject: 'Physics (JEE)', 
    chapter: 'Verbal & Numerical Ability', 
    type: 'PDF', 
    size: '507 KB', 
    date: '19 Sep 2026',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    description: 'Official GATE 2022 General Aptitude previous year question paper with 43 pages.'
  },
  { 
    id: 'm-2', 
    title: 'Mechanics & Newton Laws of Motion', 
    course: '12th Science', 
    subject: 'Physics (JEE)', 
    chapter: 'Chapter 1', 
    type: 'PDF', 
    size: '3.4 MB', 
    date: '12 Apr 2025',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    description: 'Complete handwritten classroom notes on Newton’s 3 Laws and Free Body Diagrams.'
  },
  { 
    id: 'm-3', 
    title: 'Organic Chemistry Reaction Roadmaps', 
    course: 'NEET', 
    subject: 'Chemistry (NEET)', 
    chapter: 'Chapter 3', 
    type: 'PDF', 
    size: '1.8 MB', 
    date: '10 Apr 2025',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    description: 'Full reaction schemes and mechanisms for electrophilic substitution.'
  },
  { 
    id: 'm-4', 
    title: 'Trigonometry Formulas & Solved Problems', 
    course: '11th Science', 
    subject: 'Maths (JEE)', 
    chapter: 'Chapter 4', 
    type: 'PDF', 
    size: '4.2 MB', 
    date: '08 Apr 2025',
    attachmentUrl: 'https://drive.google.com/file/d/1fRm5DBtyZYxEYMpTtQ2ujCBvME4zz749/preview',
    description: 'All trigonometric ratios, multiple angle expansions, and standard JEE problems.'
  },
  { 
    id: 'm-5', 
    title: 'Cell Structure & Molecular Genetics Lecture', 
    course: 'NEET', 
    subject: 'Biology (NEET)', 
    chapter: 'Chapter 2', 
    type: 'Video', 
    size: '45 MB', 
    date: '05 Apr 2025',
    attachmentUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    description: 'High definition recorded video lecture covering cell division and DNA structure.'
  }
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
    courseName: 'JEE (Mains + Adv) • Physics Mastery',
    courseCode: 'PHY-JEE-12A',
    faculty: 'Ms. Priya Shah (Physics)',
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
    courseName: 'NEET • Physics Intensive',
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
    courseName: '11th Science • Physics Fundamentals',
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
    courseName: 'Std 10th • General Science',
    courseCode: 'SCI-BRD-10A',
    faculty: 'Ms. Priya Shah',
    syllabusProgress: 80,
    currentChapter: 'Electricity & Magnetic Effects',
    academicYear: '2024–2025',
    totalLectures: 34,
    nextTest: 'Electricity Practical Mock • 25 Apr 2025'
  }
];

export const mockBatchStudents = [];

export const mockStudentsList = [];

export const mockTeachersList = [];

export const mockAdminStats = {
  totalStudents: 0,
  presentToday: 0,
  totalTeachers: 0,
  pendingFees: '₹0'
};

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

export const mockParentsList = [];
