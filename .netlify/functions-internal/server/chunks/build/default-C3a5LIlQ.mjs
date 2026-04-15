import { _ as __nuxt_component_0$1 } from './nuxt-link-BKJ9yXBT.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, toDisplayString, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'vue/server-renderer';
import { a as useSupabaseUser, b as useI18n, c as useRoute } from './server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
import { u as useProfile } from './useProfile-Cq-c3-Cr.mjs';
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

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Sidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const route = useRoute();
    const navItems = [
      { icon: "i-ph-house-line-bold", label: t("nav.home"), link: "/" },
      { icon: "i-ph-fire-bold", label: t("home.trending"), link: "/?feed=trending" },
      { icon: "i-ph-users-bold", label: t("home.subscriptions"), link: "/?feed=subs" },
      { icon: "i-ph-clock-bold", label: t("home.library"), link: "/?feed=history" }
    ];
    const creatorItems = [
      { icon: "i-ph-circles-four-bold", label: t("nav.studio"), link: "/studio" },
      { icon: "i-ph-upload-simple-bold", label: t("nav.upload"), link: "/studio/upload" }
    ];
    const isActive = (link) => {
      const [path, query] = link.split("?");
      if (query) {
        const [paramKey, paramVal] = query.split("=");
        return route.path === path && route.query[paramKey] === paramVal;
      }
      if (path === "/") return route.path === "/";
      return route.path === path || route.path.startsWith(path + "/");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<aside${ssrRenderAttrs(mergeProps({ class: "fixed left-0 top-0 h-screen z-40 flex flex-col overflow-hidden bg-[#050505] border-r border-white/[0.05] select-none w-[72px] hover:w-60 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "h-[72px] flex items-center gap-0 hover:gap-4 px-[18px] border-b border-white/[0.05] shrink-0 transition-[gap] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden no-underline group"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-white transition-transform duration-300 group-hover:scale-95"${_scopeId}><div class="i-ph-play-fill text-black text-base translate-x-0.5"${_scopeId}></div></div><div class="ml-3 overflow-hidden whitespace-nowrap opacity-0 w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [aside:hover_&amp;]:opacity-100 [aside:hover_&amp;]:w-28"${_scopeId}><div class="text-[13px] font-brand font-black tracking-[0.25em] text-white italic"${_scopeId}>NEWTUBE</div><div class="text-[6px] font-black tracking-[0.5em] text-white/20 uppercase"${_scopeId}>ELITE</div></div>`);
          } else {
            return [
              createVNode("div", { class: "w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-white transition-transform duration-300 group-hover:scale-95" }, [
                createVNode("div", { class: "i-ph-play-fill text-black text-base translate-x-0.5" })
              ]),
              createVNode("div", { class: "ml-3 overflow-hidden whitespace-nowrap opacity-0 w-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [aside:hover_&]:opacity-100 [aside:hover_&]:w-28" }, [
                createVNode("div", { class: "text-[13px] font-brand font-black tracking-[0.25em] text-white italic" }, "NEWTUBE"),
                createVNode("div", { class: "text-[6px] font-black tracking-[0.5em] text-white/20 uppercase" }, "ELITE")
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<nav class="flex-1 py-4 px-3 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden scrollbar-none"><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.link,
          class: ["relative flex items-center h-11 rounded-xl overflow-hidden no-underline transition-colors duration-200 group", isActive(item.link) ? "bg-white/[0.12] text-white" : "text-white/45 hover:text-white hover:bg-white/[0.06]"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isActive(item.link)) {
                _push2(`<div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="w-[72px] flex items-center justify-center shrink-0 [aside:hover_&amp;]:w-11"${_scopeId}><div class="${ssrRenderClass([item.icon, "text-[18px]"])}"${_scopeId}></div></div><span class="whitespace-nowrap text-[11px] font-brand font-bold tracking-[0.15em] uppercase opacity-0 w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 [aside:hover_&amp;]:opacity-100 [aside:hover_&amp;]:w-auto"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                isActive(item.link) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full"
                })) : createCommentVNode("", true),
                createVNode("div", { class: "w-[72px] flex items-center justify-center shrink-0 [aside:hover_&]:w-11" }, [
                  createVNode("div", {
                    class: [item.icon, "text-[18px]"]
                  }, null, 2)
                ]),
                createVNode("span", { class: "whitespace-nowrap text-[11px] font-brand font-bold tracking-[0.15em] uppercase opacity-0 w-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-75 [aside:hover_&]:opacity-100 [aside:hover_&]:w-auto" }, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--><div class="my-3 mx-3 h-px bg-white/[0.05]"></div><div class="px-3 mb-1 overflow-hidden whitespace-nowrap h-0 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [aside:hover_&amp;]:h-6 [aside:hover_&amp;]:opacity-100"><span class="text-[9px] font-black tracking-[0.5em] uppercase text-white/15">Creator</span></div><!--[-->`);
      ssrRenderList(creatorItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: item.link,
          class: ["relative flex items-center h-11 rounded-xl overflow-hidden no-underline transition-colors duration-200 group", isActive(item.link) ? "bg-white/10 text-white" : "text-white/30 hover:text-white hover:bg-white/[0.05]"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (isActive(item.link)) {
                _push2(`<div class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full"${_scopeId}></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="w-[72px] flex items-center justify-center shrink-0 [aside:hover_&amp;]:w-11"${_scopeId}><div class="${ssrRenderClass([item.icon, "text-[18px]"])}"${_scopeId}></div></div><span class="whitespace-nowrap text-[11px] font-brand font-bold tracking-[0.15em] uppercase opacity-0 w-0 overflow-hidden transition-all duration-500 delay-75 [aside:hover_&amp;]:opacity-100 [aside:hover_&amp;]:w-auto"${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                isActive(item.link) ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-white rounded-r-full"
                })) : createCommentVNode("", true),
                createVNode("div", { class: "w-[72px] flex items-center justify-center shrink-0 [aside:hover_&]:w-11" }, [
                  createVNode("div", {
                    class: [item.icon, "text-[18px]"]
                  }, null, 2)
                ]),
                createVNode("span", { class: "whitespace-nowrap text-[11px] font-brand font-bold tracking-[0.15em] uppercase opacity-0 w-0 overflow-hidden transition-all duration-500 delay-75 [aside:hover_&]:opacity-100 [aside:hover_&]:w-auto" }, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="shrink-0 h-14 border-t border-white/[0.05] flex items-center px-[22px] gap-0 overflow-hidden"><div class="w-2 h-2 rounded-full bg-emerald-500/40 animate-pulse shrink-0"></div><div class="ml-4 whitespace-nowrap opacity-0 w-0 transition-all duration-500 [aside:hover_&amp;]:opacity-100 [aside:hover_&amp;]:w-auto overflow-hidden"><div class="text-[8px] font-black tracking-[0.4em] uppercase text-white/15">ONLINE</div></div></div></aside>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Sidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "Sidebar" });
const _sfc_main$1 = {
  __name: "UserAuthBtn",
  __ssrInlineRender: true,
  setup(__props) {
    const user = useSupabaseUser();
    useSupabaseClient();
    const { profile } = useProfile();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      if (unref(user)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-4 animate-fade-in-up" }, _attrs))}><div class="flex items-center gap-3 group cursor-pointer"><div class="text-right"><div class="text-xs font-bold text-white group-hover:text-silver-white transition-all tracking-widest uppercase">${ssrInterpolate(unref(profile)?.display_name || unref(user).email?.split("@")[0])}</div><div class="text-[10px] text-white/30 tracking-widest uppercase font-brand">${ssrInterpolate(unref(profile)?.role || "User")}</div></div><div class="relative"><img${ssrRenderAttr("src", unref(profile)?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${unref(user).email}`)} class="w-10 h-10 rounded-full border border-white/5 group-hover:border-white/20 transition-all p-0.5 bg-void-card ring-1 ring-white/5"></div></div><button class="w-10 h-10 rounded-full flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"><div class="i-ph-sign-out-bold text-lg"></div></button></div>`);
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
          to: "/auth/login",
          class: "btn-primary flex items-center gap-2 group"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="i-ph-user-bold transition-transform group-hover:rotate-12"${_scopeId}></div><span class="text-xs uppercase tracking-widest font-bold"${_scopeId}>${ssrInterpolate(_ctx.$t("nav.login"))}</span>`);
            } else {
              return [
                createVNode("div", { class: "i-ph-user-bold transition-transform group-hover:rotate-12" }),
                createVNode("span", { class: "text-xs uppercase tracking-widest font-bold" }, toDisplayString(_ctx.$t("nav.login")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/UserAuthBtn.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { isAdmin } = useProfile();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Sidebar = __nuxt_component_0;
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_UserAuthBtn = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-[#050505] text-white font-sans flex" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Sidebar, null, null, _parent));
      _push(`<div class="flex-1 flex flex-col min-w-0 pl-[72px] transition-[padding-left] duration-500"><header class="sticky top-0 z-30 h-[72px] flex items-center gap-6 px-8 bg-[#050505]/90 backdrop-blur-xl border-b border-white/[0.05]"><div class="flex-1 max-w-md"><label class="relative flex items-center group"><div class="absolute left-4 i-ph-magnifying-glass-bold text-white/20 text-sm pointer-events-none transition-colors duration-200 group-focus-within:text-white/40"></div><input type="search"${ssrRenderAttr("placeholder", _ctx.$t("nav.search") || "Search...")} class="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm font-sans placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 focus:bg-white/[0.06] transition-all duration-200"></label></div><div class="flex items-center gap-3 ml-auto">`);
      if (unref(isAdmin)) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/admin",
          class: "w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04] border border-white/[0.07] text-white/25 hover:text-white hover:border-white/20 transition-all duration-200 no-underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="i-ph-shield-checkered-bold"${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "i-ph-shield-checkered-bold" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="w-px h-5 bg-white/[0.08]"></div>`);
      _push(ssrRenderComponent(_component_UserAuthBtn, null, null, _parent));
      _push(`</div></header><main class="flex-1">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main><footer class="h-16 border-t border-white/[0.04] flex items-center justify-between px-8"><div class="flex items-center gap-2"><div class="w-6 h-6 rounded-lg bg-white flex items-center justify-center"><div class="i-ph-play-fill text-black text-xs translate-x-px"></div></div><span class="text-[10px] font-brand font-black tracking-[0.3em] uppercase text-white/40">NEWTUBE</span></div><div class="text-[9px] font-black tracking-[0.5em] uppercase text-white/10"> © ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} • ELITE 2026 </div></footer></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-C3a5LIlQ.mjs.map
