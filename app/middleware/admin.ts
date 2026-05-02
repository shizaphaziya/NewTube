export default defineNuxtRouteMiddleware(async (to, from) => {
  const { profile, fetchProfile, isAdmin } = useProfile();

  // Ensure profile is loaded
  if (!profile.value) {
    await fetchProfile();
  }

  if (!isAdmin.value) {
    return navigateTo("/");
  }
});
