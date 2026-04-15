import { _ as __nuxt_component_0 } from './nuxt-link-BKJ9yXBT.mjs';
import { ref, resolveDirective, mergeProps, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDirectiveProps, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
import { b as useI18n } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import '@supabase/supabase-js';
import 'perfect-debounce';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const { t } = useI18n();
    const email = ref("");
    const password = ref("");
    const isRegister = ref(false);
    const loading = ref(false);
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _directive_motion_pop_in = resolveDirective("motion-pop-in");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-void text-white flex items-center justify-center p-4 relative overflow-hidden font-sans" }, _attrs))}><div class="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_100%)]"></div><div${ssrRenderAttrs(mergeProps({ class: "glass-card w-full max-w-sm p-12 relative z-10 border-white/5 backdrop-blur-3xl shadow-2xl" }, ssrGetDirectiveProps(_ctx, _directive_motion_pop_in)))}><div class="text-center mb-12">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-block mb-8 group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-500"${_scopeId}><div class="w-2 h-8 bg-silver animate-pulse"${_scopeId}></div><span class="text-4xl font-black font-heading tracking-tight text-white leading-none"${_scopeId}>NEWTUBE</span></div>`);
          } else {
            return [
              createVNode("div", { class: "flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-500" }, [
                createVNode("div", { class: "w-2 h-8 bg-silver animate-pulse" }),
                createVNode("span", { class: "text-4xl font-black font-heading tracking-tight text-white leading-none" }, "NEWTUBE")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-lg font-heading font-black tracking-tight text-silver/90 uppercase">${ssrInterpolate(unref(isRegister) ? unref(t)("auth.join_community") : unref(t)("auth.welcome_back"))}</h1><p class="text-white/30 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">${ssrInterpolate(unref(t)("auth.subtitle"))}</p></div><form class="space-y-8">`);
      if (unref(errorMsg)) {
        _push(`<div class="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] font-bold uppercase tracking-wider text-center">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="space-y-6"><div class="space-y-2 group"><label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 group-focus-within:text-silver transition-colors">${ssrInterpolate(unref(t)("auth.email"))}</label><input${ssrRenderAttr("value", unref(email))} type="email" required placeholder="IDENTITY@ELITE.CO" class="w-full bg-white/5 border-b border-white/10 p-4 text-sm focus:outline-none focus:border-silver focus:bg-white/[0.08] transition-all placeholder:text-white/10"></div><div class="space-y-2 group"><label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-1 group-focus-within:text-silver transition-colors">${ssrInterpolate(unref(t)("auth.password"))}</label><input${ssrRenderAttr("value", unref(password))} type="password" required placeholder="••••••••" class="w-full bg-white/5 border-b border-white/10 p-4 text-sm focus:outline-none focus:border-silver focus:bg-white/[0.08] transition-all placeholder:text-white/10"></div></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="btn-primary w-full py-5 text-xs font-black tracking-[0.3em] uppercase group overflow-hidden">`);
      if (!unref(loading)) {
        _push(`<span class="flex items-center justify-center gap-3">${ssrInterpolate(unref(isRegister) ? unref(t)("auth.create_account") : unref(t)("auth.sign_in"))} <div class="i-ph-arrow-right-bold group-hover:translate-x-1 transition-transform"></div></span>`);
      } else {
        _push(`<div class="i-ph-circle-notch-bold animate-spin text-xl mx-auto"></div>`);
      }
      _push(`</button></form><div class="mt-12 text-center text-[10px] font-black tracking-widest uppercase"><button class="text-white/30 hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">${ssrInterpolate(unref(isRegister) ? unref(t)("auth.already_have_account") : unref(t)("auth.no_account"))}</button></div></div><div class="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none"></div><div class="absolute top-[-10%] left-[-10%] w-1/3 h-1/3 bg-white/[0.01] blur-[100px] rounded-full pointer-events-none"></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-3uMuLDyh.mjs.map
