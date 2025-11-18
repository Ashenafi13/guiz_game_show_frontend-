export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;

  children?: NavigationItem[];
}
export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'quiz-management',
    title: 'Quiz Management',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'seasons',
        title: 'Seasons',
        type: 'item',
        url: '/seasons',
        classes: 'nav-item',
        icon: 'feather icon-calendar'
      },
      {
        id: 'episodes',
        title: 'Episodes',
        type: 'item',
        url: '/episodes',
        classes: 'nav-item',
        icon: 'feather icon-film'
      },
      {
        id: 'questions',
        title: 'Questions',
        type: 'item',
        url: '/questions',
        classes: 'nav-item',
        icon: 'feather icon-help-circle'
      },
      {
        id: 'categories',
        title: 'Categories',
        type: 'item',
        url: '/categories',
        classes: 'nav-item',
        icon: 'feather icon-tag'
      },
      {
        id: 'contestants',
        title: 'Contestants',
        type: 'item',
        url: '/contestants',
        classes: 'nav-item',
        icon: 'feather icon-users'
      },
      {
        id: 'teams',
        title: 'Teams',
        type: 'item',
        url: '/teams',
        classes: 'nav-item',
        icon: 'feather icon-shield'
      },
      {
        id: 'reward-types',
        title: 'Reward Types',
        type: 'item',
        url: '/reward-types',
        classes: 'nav-item',
        icon: 'feather icon-shield'
      },
//competitions
      {
        id: 'competitions',
        title: 'Competitions',
        type: 'item',
        url: '/competitions',
        classes: 'nav-item',
        icon: 'feather icon-award'
      }
    ]
  }
];
