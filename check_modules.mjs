import http from 'http';

const files = [
  '/src/lib/mockData.js',
  '/src/components/common/Header.jsx',
  '/src/components/common/BottomNav.jsx',
  '/src/components/common/ProtectedPdfViewer.jsx',
  '/src/components/auth/LoginModal.jsx',
  '/src/components/student/StudentHome.jsx',
  '/src/components/student/Timetable.jsx',
  '/src/components/student/AttendanceView.jsx',
  '/src/components/student/StudyMaterial.jsx',
  '/src/components/student/TestsView.jsx',
  '/src/components/student/StudentProfile.jsx',
  '/src/components/teacher/TeacherDashboard.jsx',
  '/src/components/teacher/MyBatches.jsx',
  '/src/components/teacher/AttendanceMarker.jsx',
  '/src/components/teacher/CreateTestModal.jsx',
  '/src/components/teacher/TeacherPerformance.jsx',
  '/src/components/parent/ParentHome.jsx',
  '/src/components/parent/AttendanceCalendar.jsx',
  '/src/components/parent/ParentFees.jsx',
  '/src/components/admin/AdminMobileDashboard.jsx',
  '/src/lib/supabaseClient.js',
  '/src/lib/whatsappService.js'
];

async function check() {
  for (const f of files) {
    await new Promise(r => {
      http.get('http://localhost:5173' + f, res => {
        if (res.statusCode !== 200) {
          console.error(`ERROR on ${f}: status ${res.statusCode}`);
        } else {
          console.log(`OK: ${f}`);
        }
        r();
      }).on('error', err => {
        console.error(`NETWORK ERROR on ${f}:`, err.message);
        r();
      });
    });
  }
}

check();
