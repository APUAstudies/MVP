export interface SubItem {
  label: string;
  href: string;
  category?: string;
}

export interface NavItem {
  label: string;
  href: string;
  description: string;
  icon: string;
  subItems: SubItem[];
}

export const navLinks: NavItem[] = [
  { 
    label: 'Dashboard',
    href: '/dashboard',
    description: "Website made by students for students, for more efficient and productive learning.",
    icon: '🏠',
    subItems: [
      { label: 'Overview', href: '/dashboard', category: 'General' },
      { label: 'Analytics', href: '/dashboard/stats', category: 'General' }
    ]
  },
  { 
    label: 'Lobby',
    href: '/lobby',
    description: "Focus on tasks, write notes, and study together with friends.",
    icon: '📚',
    subItems: [
      { label: 'Study', href: '/lobby', category: 'Study Tools' },
      { label: 'Help', href: '/lobby/help', category: 'Study Tools' },
      { label: 'Groups', href: '/lobby/groups', category: 'Social' }
    ]
  },
  { 
    label: 'Tools',
    href: '/tools',
    description: "Find the best tools to make your life more productive",
    icon: '🛠️',
    subItems: [
      { label: 'Favorites', href: '/tools/extensions', category: '' },
      { label: 'Chrome Extensions', href: '/tools/extensions', category: 'Resources' },
      { label: 'Websites', href: '/tools/websites', category: 'Resources' },
      { label: 'Our Tools', href: '/tools/custom', category: 'Resources' },
      { label: 'Suggest a Tool', href: '/tools/suggest', category: 'Feedback' }
    ]
  },
  { 
    label: 'Settings',
    href: '/settings',
    description: "Manage your account settings, customize your experience and much more.",
    icon: '⚙️',
    subItems: [
      { label: 'Profile', href: '/settings', category: 'User' },
      { label: 'Account', href: '/settings/account', category: 'User' },
      { label: 'Customization', href: '/settings/customization', category: 'User' },
      { label: 'Connect accounts', href: '/settings/connect', category: 'Integrations' }
    ]
  },
];