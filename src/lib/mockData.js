/**
 * Master Data matching ASPIRE THEME.png exactly
 */

export const mockUsers = {
  student: {
    id: 'std-104',
    name: 'Rohan Sharma',
    role: 'student',
    course: 'Std. 12 • Science • JEE',
    rollNumber: 'ASPIRE-2025-104',
    email: 'rohan.sharma@gmail.com',
    phone: '+919820123456',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    overallAttendance: 89,
    overallPerformance: 78
  },
  teacher: {
    id: 'tch-018',
    name: 'Ms. Priya Shah',
    role: 'teacher',
    subject: 'Physics Teacher',
    email: 'priya.shah@aspirelearning.com',
    phone: '+919820987654',
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
  { id: 'm-2', title: 'Organic Chemistry Reactions', subject: 'Chemistry', chapter: 'Chapter 3', type: 'Notes', size: '1.8 MB', date: '10 Apr 2025' },
  { id: 'm-3', title: 'Trigonometry Formulas & Problems', subject: 'Mathematics', chapter: 'Chapter 4', type: 'PDF', size: '4.2 MB', date: '08 Apr 2025' },
  { id: 'm-4', title: 'Cell Structure & Genetics', subject: 'Biology', chapter: 'Chapter 2', type: 'Video', size: '45 MB', date: '05 Apr 2025' }
];

export const mockBatches = [
  { id: 'b-1', name: 'JEE 12 - A', studentsCount: 35, subject: 'Physics', time: '10:00 AM - 1:00 PM', status: 'Active' },
  { id: 'b-2', name: 'NEET 12 - B', studentsCount: 29, subject: 'Physics', time: '11:00 AM - 2:00 PM', status: 'Active' },
  { id: 'b-3', name: 'Class 11 - A', studentsCount: 32, subject: 'Physics', time: '08:00 AM - 11:00 AM', status: 'Active' },
  { id: 'b-4', name: 'Class 10 - A', studentsCount: 30, subject: 'Science', time: '02:00 PM - 05:00 PM', status: 'Active' }
];

export const mockStudentsList = [
  { id: 's-1', name: 'Aarav Mehta', roll: '101', course: 'Std. 12 • JEE', attendance: 'Present', score: '92%', status: 'Active' },
  { id: 's-2', name: 'Diya Patel', roll: '102', course: 'Std. 12 • NEET', attendance: 'Present', score: '88%', status: 'Active' },
  { id: 's-3', name: 'Rohan Verma', roll: '103', course: 'Std. 11 • Science', attendance: 'Absent', score: '74%', status: 'Active' },
  { id: 's-4', name: 'Sneha Iyer', roll: '104', course: 'Std. 10 • Science', attendance: 'Present', score: '95%', status: 'Active' },
  { id: 's-5', name: 'Karan Malhotra', roll: '105', course: 'Std. 12 • JEE', attendance: 'Present', score: '81%', status: 'Active' }
];

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
