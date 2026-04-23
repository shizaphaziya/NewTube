with open('app/components/QuickActions.vue', 'r') as f:
    content = f.read()

content = content.replace("{ icon: 'i-ph-users-four-bold', label: t('home.subscriptions'), link: '/' },", "{ icon: 'i-ph-users-four-bold', label: t('home.subscriptions'), link: '/subscriptions' },")

with open('app/components/QuickActions.vue', 'w') as f:
    f.write(content)
