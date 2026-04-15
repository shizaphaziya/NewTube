import { F as executeAsync } from '../nitro/nitro.mjs';
import { f as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useProfile } from './useProfile-Cq-c3-Cr.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'vue';
import '@supabase/supabase-js';
import 'perfect-debounce';
import 'vue/server-renderer';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './useSupabaseClient-4v4x5xwK.mjs';

const admin = defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  const { profile, fetchProfile, isAdmin } = useProfile();
  if (!profile.value) {
    [__temp, __restore] = executeAsync(() => fetchProfile()), await __temp, __restore();
  }
  if (!isAdmin.value) {
    return navigateTo("/");
  }
});

export { admin as default };
//# sourceMappingURL=admin-DMHQrSaB.mjs.map
