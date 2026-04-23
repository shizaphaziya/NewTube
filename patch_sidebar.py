with open('app/components/Sidebar.vue', 'r') as f:
    content = f.read()

import re

nav_items_old = """const navItems = computed(() => [
  { icon: 'i-ph-house', activeIcon: 'i-ph-house-fill', label: t('nav.home'),          link: '/' },
  { icon: 'i-ph-fire', activeIcon: 'i-ph-fire-fill', label: t('home.trending'),     link: '/?feed=trending' },
  { icon: 'i-ph-lightning', activeIcon: 'i-ph-lightning-fill', label: t('home.latest'),       link: '/?feed=latest' },
])"""

nav_items_new = """const navItems = computed(() => [
  { icon: 'i-ph-house', activeIcon: 'i-ph-house-fill', label: t('nav.home'),          link: '/' },
  { icon: 'i-ph-fire', activeIcon: 'i-ph-fire-fill', label: t('home.trending'),     link: '/?feed=trending' },
  { icon: 'i-ph-users-three', activeIcon: 'i-ph-users-three-fill', label: t('home.subscriptions'), link: '/subscriptions' },
  { icon: 'i-ph-lightning', activeIcon: 'i-ph-lightning-fill', label: t('home.latest'),       link: '/?feed=latest' },
])"""

content = content.replace(nav_items_old, nav_items_new)

with open('app/components/Sidebar.vue', 'w') as f:
    f.write(content)
