import type { Database } from '~/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const profile = useState<Profile | null>('profile', () => null)

  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.value.id)
      .single()

    if (!error && data) {
      profile.value = data
    }
  }

  const updateProfile = async (updates: Database['public']['Tables']['profiles']['Update']) => {
    if (!user.value) return { error: new Error('User not logged in') }
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.value.id)
    
    if (!error) {
      await fetchProfile()
    }
    return { error }
  }

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isUser = computed(() => profile.value?.role ? ['user', 'admin'].includes(profile.value.role) : false)
  const isBlocked = computed(() => profile.value?.status === 'blocked')

  return {
    profile,
    fetchProfile,
    updateProfile,
    isAdmin,
    isUser,
    isBlocked
  }
}
