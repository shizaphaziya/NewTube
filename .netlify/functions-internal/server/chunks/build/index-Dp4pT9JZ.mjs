import { withAsyncContext, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'vue/server-renderer';
import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
import { b as useI18n, d as useAsyncData } from './server.mjs';
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
    const { t } = useI18n();
    const { data: videos, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("admin-videos", async () => {
      const { data } = await supabase.from("videos").select("*, profiles(display_name)").order("created_at", { ascending: false });
      return data;
    })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout-container pb-20" }, _attrs))}><div class="flex items-center gap-6 mb-16"><div class="w-16 h-16 rounded-[24px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40"><div class="i-ph-shield-check-bold text-3xl"></div></div><div><h1 class="text-4xl font-black font-heading tracking-tighter text-white uppercase">${ssrInterpolate(unref(t)("admin.moderation"))}</h1><p class="text-[10px] text-white/20 font-bold uppercase tracking-[0.3em] mt-1">Content Integrity Protocol</p></div></div><div class="glass-card overflow-hidden border-white/5 shadow-2xl rounded-[32px]"><div class="overflow-x-auto"><table class="w-full text-left border-collapse"><thead><tr class="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5"><th class="px-8 py-6">Content Entity</th><th class="px-8 py-6">Origin</th><th class="px-8 py-6">Registry Status</th><th class="px-8 py-6 text-right">Intervention</th></tr></thead><tbody class="divide-y divide-white/5"><!--[-->`);
      ssrRenderList(unref(videos), (video) => {
        _push(`<tr class="hover:bg-white/[0.02] transition-all duration-300 group"><td class="px-8 py-6"><div class="flex items-center gap-5"><div class="relative group-hover:scale-105 transition-transform duration-500"><img${ssrRenderAttr("src", video.thumbnail_url)} class="w-24 aspect-video rounded-xl bg-white/5 object-cover border border-white/5"><div class="absolute inset-0 bg-void/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center"><div class="i-ph-eye-bold text-white text-xl"></div></div></div><div class="min-w-0"><div class="text-sm font-black text-white uppercase tracking-tight truncate max-w-[240px]">${ssrInterpolate(video.title)}</div><div class="text-[9px] text-white/10 font-bold uppercase tracking-widest mt-1">ID: ${ssrInterpolate(video.id.split("-")[0])}...</div></div></div></td><td class="px-8 py-6"><div class="text-[10px] font-black text-white/40 uppercase tracking-widest">${ssrInterpolate(video.profiles?.display_name)}</div></td><td class="px-8 py-6"><div class="flex"><span class="${ssrRenderClass([[
          video.status === "published" ? "text-white bg-white/5 border-white/10" : video.status === "blocked" ? "text-red-400 bg-red-400/5 border-red-400/10" : "text-white/30 bg-white/5 border-white/5"
        ], "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border"])}">${ssrInterpolate(video.status)}</span></div></td><td class="px-8 py-6 text-right"><div class="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">`);
        if (video.status !== "published") {
          _push(`<button class="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white hover:text-void transition-all"${ssrRenderAttr("title", unref(t)("admin.publish"))}><div class="i-ph-check-bold"></div></button>`);
        } else {
          _push(`<!---->`);
        }
        if (video.status !== "hidden") {
          _push(`<button class="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white hover:text-void transition-all"${ssrRenderAttr("title", unref(t)("admin.hide"))}><div class="i-ph-eye-closed-bold"></div></button>`);
        } else {
          _push(`<!---->`);
        }
        if (video.status !== "blocked") {
          _push(`<button class="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all"${ssrRenderAttr("title", unref(t)("admin.block"))}><div class="i-ph-prohibit-bold"></div></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div>`);
      if (!unref(videos)?.length) {
        _push(`<div class="py-32 text-center text-white/5 font-black uppercase tracking-[0.5em] text-sm"> Registry Empty • No Intervention Required </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Dp4pT9JZ.mjs.map
