import { Blog, NavItem } from '@/types';

export const BlogsList: Blog[] = [
  {
    id: '1',
    title: 'AIonica',
    description:
      'The missing link between your AI investments and actual productivity',
    author: 'Shaikh Abdullah',
    externalLink:
      'https://jotion-note-taking-app-sigma.vercel.app/preview/j57aekskp7b6ygqqfwczdp2adn7g18zr'
  }
];
export const WAITLIST_FORM: string = 'https://forms.gle/tn3prFtzefjuwBPn6';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'All Tools',
    url: '/dashboard/tools',
    icon: 'stack',
    shortcut: ['a', 'a'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Tool',
    url: '#', // Placeholder as there is no direct link for the parent
    icon: 'tools',
    isActive: true,

    items: [
      {
        title: 'MistralAI (Chat)',
        url: '/tools/hunyuan-model',
        icon: 'userPen',
        shortcut: ['h', 'h']
      }
    ]
  },
  {
    title: 'Kanban',
    url: '/dashboard/kanban',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: []
  },
  {
    title: 'User',
    url: '#',
    icon: 'kanban',
    shortcut: ['k', 'k'],
    isActive: false,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile',
        icon: 'userPen',
        shortcut: ['m', 'm']
      },
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/',
        icon: 'login'
      }
    ]
  }
];
