import { _ as __nuxt_component_0 } from './nuxt-link-BKJ9yXBT.mjs';
import { withAsyncContext, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderStyle, ssrInterpolate, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderAttr } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
import { _ as _export_sfc, a as useSupabaseUser, b as useI18n, d as useAsyncData } from './server.mjs';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const { t } = useI18n();
    const { profile } = useProfile();
    const { data: videos, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("user-videos", async () => {
      if (!user.value) return [];
      const { data } = await supabase.from("videos").select("*, likes(count), comments(count)").eq("user_id", user.value.id).order("created_at", { ascending: false });
      return data || [];
    })), __temp = await __temp, __restore(), __temp);
    const stats = computed(() => {
      if (!videos.value) return { views: 0, videos: 0, engagement: 0 };
      return {
        views: videos.value.reduce((acc, v) => acc + (v.view_count || 0), 0),
        videos: videos.value.length,
        engagement: videos.value.reduce((acc, v) => acc + (v.likes?.[0]?.count || 0) + (v.comments?.[0]?.count || 0), 0)
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "px-10 py-10 relative" }, _attrs))} data-v-7cbdf424>`);
      if (!unref(user)) {
        _push(`<div class="absolute inset-0 z-50 flex items-center justify-center p-6 text-center" data-v-7cbdf424><div class="glass-card p-16 max-w-md space-y-8 ring-1 ring-white/10 relative z-10" style="${ssrRenderStyle({ "animation": "fade-in-up 0.6s cubic-bezier(0.16,1,0.3,1) both" })}" data-v-7cbdf424><div class="w-14 h-14 mx-auto rounded-3xl bg-white/[0.06] border border-white/10 flex items-center justify-center" data-v-7cbdf424><div class="i-ph-lock-key-bold text-2xl text-white/40" data-v-7cbdf424></div></div><div class="space-y-3" data-v-7cbdf424><h2 class="text-2xl font-brand font-black tracking-tighter text-white" data-v-7cbdf424>${ssrInterpolate(unref(t)("auth.authentication_locked"))}</h2><p class="text-white/30 text-sm leading-relaxed" data-v-7cbdf424>${ssrInterpolate(unref(t)("auth.auth_required_desc"))}</p></div>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/auth/login",
          class: "btn-primary inline-flex"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("auth.authorize_identity"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("auth.authorize_identity")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="absolute inset-0 bg-void/70 backdrop-blur-2xl" data-v-7cbdf424></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass([{ "opacity-10 blur-sm pointer-events-none select-none": !unref(user) }, "space-y-16"])}" data-v-7cbdf424><div class="flex flex-col md:flex-row md:items-end justify-between gap-8" data-v-7cbdf424><div class="space-y-2" data-v-7cbdf424><h1 class="text-5xl font-brand font-black tracking-tighter text-white" data-v-7cbdf424>${ssrInterpolate(unref(t)("studio.command_center"))}</h1><p class="text-[#666] text-[10px] font-bold uppercase tracking-[0.4em]" data-v-7cbdf424>${ssrInterpolate(unref(profile)?.display_name || "—")} • ${ssrInterpolate(unref(t)("studio.elite_operator"))}</p></div>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/studio/upload",
        class: "btn-primary self-start md:self-auto group flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="i-ph-plus-bold transition-transform group-hover:rotate-90 duration-300" data-v-7cbdf424${_scopeId}></div> ${ssrInterpolate(unref(t)("studio.publish_record"))}`);
          } else {
            return [
              createVNode("div", { class: "i-ph-plus-bold transition-transform group-hover:rotate-90 duration-300" }),
              createTextVNode(" " + toDisplayString(unref(t)("studio.publish_record")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-6" data-v-7cbdf424><div class="glass-card p-8 space-y-3 group hover:border-white/15 transition-all duration-500" data-v-7cbdf424><div class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]" data-v-7cbdf424>${ssrInterpolate(unref(t)("studio.total_impressions"))}</div><div class="text-5xl font-brand font-black text-white tabular-nums" data-v-7cbdf424>${ssrInterpolate(unref(stats).views.toLocaleString())}</div><div class="h-px bg-white/[0.04] mt-4" data-v-7cbdf424></div><div class="text-[9px] text-white/5 font-black tracking-widest" data-v-7cbdf424>IMP_UNITS • AGGREGATE</div></div><div class="glass-card p-8 space-y-3 group hover:border-white/15 transition-all duration-500" data-v-7cbdf424><div class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]" data-v-7cbdf424>${ssrInterpolate(unref(t)("studio.signal_fragments"))}</div><div class="text-5xl font-brand font-black text-white tabular-nums" data-v-7cbdf424>${ssrInterpolate(unref(stats).videos)}</div><div class="h-px bg-white/[0.04] mt-4" data-v-7cbdf424></div><div class="text-[9px] text-white/5 font-black tracking-widest" data-v-7cbdf424>RECORD_COUNT • INDEX</div></div><div class="glass-card p-8 space-y-3 group hover:border-white/15 transition-all duration-500" data-v-7cbdf424><div class="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]" data-v-7cbdf424>${ssrInterpolate(unref(t)("studio.synapse_response"))}</div><div class="text-5xl font-brand font-black text-white tabular-nums" data-v-7cbdf424>${ssrInterpolate(unref(stats).engagement)}</div><div class="h-px bg-white/[0.04] mt-4" data-v-7cbdf424></div><div class="text-[9px] text-white/5 font-black tracking-widest" data-v-7cbdf424>INT_RATE • LIVE</div></div></div><div class="space-y-8" data-v-7cbdf424><div class="flex items-center gap-3" data-v-7cbdf424><div class="w-1.5 h-1.5 rounded-full bg-white/30" data-v-7cbdf424></div><h2 class="text-[9px] font-black uppercase tracking-[0.5em] text-white/20" data-v-7cbdf424>${ssrInterpolate(unref(t)("studio.active_records"))}</h2></div>`);
      if (!unref(videos)?.length) {
        _push(`<div class="glass-card p-20 flex flex-col items-center gap-6 text-center border-dashed border-white/[0.04]" data-v-7cbdf424><div class="i-ph-folder-simple-dashed-bold text-5xl text-white/10" data-v-7cbdf424></div><p class="text-white/20 text-xs font-bold uppercase tracking-widest" data-v-7cbdf424>${ssrInterpolate(unref(t)("studio.no_records"))}</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/studio/upload",
          class: "btn-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("studio.publish_record"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("studio.publish_record")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-4" data-v-7cbdf424><!--[-->`);
        ssrRenderList(unref(videos), (video) => {
          _push(`<div class="glass-card p-5 flex items-center gap-6 group hover:border-white/10 transition-all duration-500" data-v-7cbdf424><div class="w-40 aspect-video rounded-2xl overflow-hidden bg-void/50 flex-shrink-0" data-v-7cbdf424>`);
          if (video.thumbnail_url) {
            _push(`<img${ssrRenderAttr("src", video.thumbnail_url)} class="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700" data-v-7cbdf424>`);
          } else {
            _push(`<div class="w-full h-full flex items-center justify-center" data-v-7cbdf424><div class="i-ph-video-camera-bold text-white/10 text-3xl" data-v-7cbdf424></div></div>`);
          }
          _push(`</div><div class="flex-1 min-w-0 space-y-1.5" data-v-7cbdf424><h3 class="font-brand font-black tracking-tight text-white truncate" data-v-7cbdf424>${ssrInterpolate(video.title)}</h3><div class="flex items-center gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest" data-v-7cbdf424><span data-v-7cbdf424>${ssrInterpolate((video.view_count || 0).toLocaleString())} ${ssrInterpolate(unref(t)("studio.impressions"))}</span><span class="w-px h-3 bg-white/10" data-v-7cbdf424></span><span data-v-7cbdf424>${ssrInterpolate(new Date(video.created_at).toLocaleDateString())}</span></div></div><div class="flex items-center gap-3 shrink-0" data-v-7cbdf424>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/watch/${video.id}`,
            class: "w-10 h-10 rounded-xl flex items-center justify-center text-white/20 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<div class="i-ph-eye-bold text-lg" data-v-7cbdf424${_scopeId}></div>`);
              } else {
                return [
                  createVNode("div", { class: "i-ph-eye-bold text-lg" })
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<button class="w-10 h-10 rounded-xl flex items-center justify-center text-red-500/30 hover:text-red-500 hover:bg-red-500/[0.08] transition-all duration-200" data-v-7cbdf424><div class="i-ph-trash-bold text-lg" data-v-7cbdf424></div></button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7cbdf424"]]);

export { index as default };
//# sourceMappingURL=index-CjhX8-AH.mjs.map
