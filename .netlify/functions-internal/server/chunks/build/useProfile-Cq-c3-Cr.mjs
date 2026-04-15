import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
import { a as useSupabaseUser, l as useState } from './server.mjs';
import { computed } from 'vue';

const useProfile = () => {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const profile = useState("profile", () => null);
  const fetchProfile = async () => {
    if (!user.value) {
      profile.value = null;
      return;
    }
    const { data, error } = await supabase.from("profiles").select("*").eq("id", user.value.id).single();
    if (!error) {
      profile.value = data;
    }
  };
  const isAdmin = computed(() => profile.value?.role === "admin");
  const isUser = computed(() => ["user", "admin"].includes(profile.value?.role));
  return {
    profile,
    fetchProfile,
    isAdmin,
    isUser
  };
};

export { useProfile as u };
//# sourceMappingURL=useProfile-Cq-c3-Cr.mjs.map
