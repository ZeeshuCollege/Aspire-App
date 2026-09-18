import * as Lucide from 'lucide-react';

const icons = [
  'Bell', 'ShieldCheck', 'ChevronDown', 'LogOut',
  'Home', 'Calendar', 'BookOpen', 'FileText', 'User', 'Users', 'CheckSquare', 'BarChart2', 'DollarSign',
  'X', 'ZoomIn', 'ZoomOut', 'ShieldAlert', 'Lock',
  'Mail', 'Phone', 'Eye', 'EyeOff', 'MessageSquare', 'ArrowLeft', 'CheckCircle2', 'AlertCircle',
  'Clock', 'ChevronRight',
  'MapPin', 'UserCheck',
  'Search', 'Book', 'Video',
  'Award', 'CheckCircle', 'XCircle',
  'HelpCircle',
  'PlusCircle', 'Upload',
  'Check', 'CheckCheck',
  'AlertTriangle', 'TrendingUp',
  'ChevronLeft',
  'Download', 'Plus'
];

let missing = [];
for (const icon of icons) {
  if (!Lucide[icon]) {
    missing.push(icon);
  }
}

if (missing.length > 0) {
  console.error('MISSING LUCIDE ICONS:', missing);
} else {
  console.log('ALL LUCIDE ICONS EXIST AND ARE VALID!');
}
