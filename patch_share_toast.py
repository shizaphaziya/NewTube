with open('app/components/ShareModal.vue', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('@/components/ui/toast/use-toast', '~/components/ui/toast/use-toast')

with open('app/components/ShareModal.vue', 'w', encoding='utf-8') as f:
    f.write(content)
