export const useProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const profile = useState('profile', () => null)

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

    if (!error) {
      profile.value = data
    }
  }

  const isAdmin = computed(() => profile.value?.role === 'admin')
  const isUser = computed(() => ['user', 'admin'].includes(profile.value?.role))

  return {
    profile,
    fetchProfile,
    isAdmin,
    isUser
  }
}
