import type { Database } from '~/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  
  // Shared state across all instances of useProfile
  const profile = useState<Profile | null>('user-profile-v6', () => null)
  const loading = useState('user-profile-loading-v6', () => false)

  const fetchProfile = async (uid?: string) => {
    const userId = uid || user.value?.id
    if (!userId) {
      console.log('[useProfile] No userId for fetch')
      profile.value = null
      return
    }

    if (loading.value) return
    loading.value = true
    
    try {
      console.log('[useProfile] Fetching profile for:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('[useProfile] Fetch error:', error.message)
        profile.value = null
      } else {
        console.log('[useProfile] Fetch success:', data?.display_name, data?.role)
        if (data) {
          if (data.avatar_url && data.avatar_url.includes('supabase.co')) {
            const timestamp = data.updated_at ? new Date(data.updated_at).getTime() : Date.now()
            const separator = data.avatar_url.includes('?') ? '&' : '?'
            data.avatar_url = `${data.avatar_url}${separator}v=${timestamp}`
          }
        }
        profile.value = data as Profile
      }
    } catch (e) {
      console.error('[useProfile] Unexpected error:', e)
    } finally {
      loading.value = false
    }
  }

  // Use onAuthStateChange for maximum reliability in SPA mode
  if (import.meta.client) {
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('[useProfile] Auth state changed:', event, session?.user?.id)
      if (session?.user) {
        // If we don't have a profile or the ID changed, fetch it
        if (!profile.value || profile.value.id !== session.user.id) {
          fetchProfile(session.user.id)
        }
      } else {
        profile.value = null
      }
    })
  }

  // Also watch the Nuxt user ref just in case
  watch(() => user.value?.id, (newId) => {
    if (newId && (!profile.value || profile.value.id !== newId)) {
      console.log('[useProfile] Nuxt User ID sync:', newId)
      fetchProfile(newId)
    }
  }, { immediate: true })

  const updateProfile = async (updates: Database['public']['Tables']['profiles']['Update']) => {
    try {
      // Direct session check to avoid ref lag
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id || user.value?.id
      
      if (!userId) {
         console.error('[useProfile] Update failed: No session detected')
         throw new Error('Authentication required')
      }

      console.log('[useProfile] Performing update for:', userId)
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()
      
      if (!error && data) {
        console.log('[useProfile] Update successful')
        profile.value = { ...data } as Profile
      }
      return { data, error }
    } catch (e: any) {
      console.error('[useProfile] Update failed:', e)
      return { error: e }
    }
  }

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isUser = computed(() => ['user', 'admin'].includes(profile.value?.role || ''))

  return {
    profile,
    loading: computed(() => loading.value),
    fetchProfile,
    refreshProfile: fetchProfile,
    updateProfile,
    isAdmin,
    isUser
  }
}
