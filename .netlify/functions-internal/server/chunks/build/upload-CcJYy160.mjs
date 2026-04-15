import { defineComponent, ref, resolveDirective, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrGetDirectiveProps, ssrInterpolate, ssrRenderAttr, ssrRenderStyle, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
import { a as useSupabaseUser, b as useI18n } from './server.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "upload",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    useSupabaseUser();
    const { t } = useI18n();
    const title = ref("");
    const description = ref("");
    const videoFile = ref(null);
    const thumbFile = ref(null);
    new FFmpeg();
    const processing = ref(false);
    const processingProgress = ref(0);
    const uploading = ref(false);
    const uploadProgress = ref(0);
    const success = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_motion_fade = resolveDirective("motion-fade");
      const _directive_motion_pop_in = resolveDirective("motion-pop-in");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "layout-container max-w-4xl py-12 pb-20" }, _attrs))}><div${ssrRenderAttrs(mergeProps({ class: "relative overflow-hidden rounded-[28px] bg-white/[0.03] border border-white/[0.07] backdrop-blur-2xl p-12" }, ssrGetDirectiveProps(_ctx, _directive_motion_pop_in)))}><div class="absolute -top-40 -right-40 w-80 h-80 bg-white/[0.015] blur-[120px] rounded-full pointer-events-none"></div><div class="absolute -bottom-40 -left-20 w-60 h-60 bg-white/[0.01] blur-[80px] rounded-full pointer-events-none"></div><div class="flex items-center gap-6 mb-16"><div class="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center"><div class="i-ph-upload-simple-bold text-2xl text-white/60"></div></div><div><h1 class="text-3xl font-black font-brand tracking-tighter text-white uppercase">${ssrInterpolate(unref(t)("studio.upload"))}</h1><p class="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mt-1">${ssrInterpolate(unref(t)("studio.broadcasting"))}</p></div></div>`);
      if (unref(success)) {
        _push(`<div class="bg-white/5 border border-white/10 p-16 rounded-[40px] text-center space-y-6"><div class="i-ph-check-circle-fill text-7xl text-white mx-auto animate-pulse"></div><h2 class="text-3xl font-heading font-black tracking-tight text-white uppercase">${ssrInterpolate(unref(t)("studio.success"))}</h2><p class="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">${ssrInterpolate(unref(t)("studio.success_subtitle"))}</p></div>`);
      } else {
        _push(`<form class="space-y-12"><div class="grid grid-cols-1 lg:grid-cols-5 gap-12"><div class="lg:col-span-2 space-y-8"><div class="space-y-4"><label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">${ssrInterpolate(unref(t)("studio.select_file"))}</label><div class="relative h-64 rounded-2xl border-2 border-dashed border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group">`);
        if (!unref(videoFile)) {
          _push(`<div class="text-center group-hover:scale-105 transition-transform duration-500"><div class="i-ph-video-bold text-5xl text-white/5 mb-4 group-hover:text-white/20 transition-colors"></div><p class="text-[10px] text-white/20 font-black uppercase tracking-widest">${ssrInterpolate(unref(t)("studio.select_file"))}</p></div>`);
        } else {
          _push(`<div class="text-center p-6 w-full"><div class="i-ph-file-video-fill text-5xl text-silver mb-4 mx-auto"></div><p class="text-xs font-black text-white truncate px-4">${ssrInterpolate(unref(videoFile).name.toUpperCase())}</p><p class="text-[9px] text-white/20 font-bold mt-2 uppercase tracking-widest">${ssrInterpolate((unref(videoFile).size / (1024 * 1024)).toFixed(1))} MB • READY</p></div>`);
        }
        _push(`<input type="file" hidden accept="video/*"></div></div><div class="space-y-4"><label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">${ssrInterpolate(unref(t)("studio.cover_artwork"))}</label><div class="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-colors cursor-pointer"><div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors"><div class="i-ph-image-bold text-2xl"></div></div><div class="flex-1 min-w-0"><p class="text-[10px] font-black text-white/40 uppercase tracking-widest truncate">${ssrInterpolate(unref(thumbFile) ? unref(thumbFile).name : unref(t)("studio.select_thumbnail"))}</p></div><input type="file" hidden accept="image/*"></div></div></div><div class="lg:col-span-3 space-y-10"><div class="space-y-3 group"><label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-silver transition-colors">${ssrInterpolate(unref(t)("studio.title"))}</label><input${ssrRenderAttr("value", unref(title))} required type="text" class="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-2xl font-brand font-black tracking-tight focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/[0.06] text-white"${ssrRenderAttr("placeholder", unref(t)("studio.entry_name_placeholder"))}></div><div class="space-y-3 group"><label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-silver transition-colors">${ssrInterpolate(unref(t)("studio.description"))}</label><textarea rows="6" class="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.05] transition-all placeholder:text-white/15 leading-relaxed resize-none text-white font-sans"${ssrRenderAttr("placeholder", unref(t)("studio.description_placeholder"))}>${ssrInterpolate(unref(description))}</textarea></div></div></div><div class="pt-12 border-t border-white/5">`);
        if (unref(processing)) {
          _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 mb-12" }, ssrGetDirectiveProps(_ctx, _directive_motion_fade)))}><div class="flex justify-between items-end"><div class="space-y-1"><p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 animate-pulse">${ssrInterpolate(unref(t)("studio.optimizing"))}</p><p class="text-[9px] text-white/20 uppercase font-black">${ssrInterpolate(unref(t)("studio.ffmpeg_note"))}</p></div><span class="text-2xl font-brand font-black tracking-tighter text-white tabular-nums">${ssrInterpolate(unref(processingProgress))}%</span></div><div class="h-[2px] w-full bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-white transition-all duration-300 ease-out" style="${ssrRenderStyle({ width: `${unref(processingProgress)}%` })}"></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(uploading)) {
          _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-6 mb-12" }, ssrGetDirectiveProps(_ctx, _directive_motion_fade)))}><div class="flex justify-between items-end"><div class="space-y-1"><p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 animate-pulse">${ssrInterpolate(unref(t)("studio.broadcasting"))}</p><p class="text-[9px] text-white/20 uppercase font-black">${ssrInterpolate(unref(t)("studio.uploading_note"))}</p></div><span class="text-2xl font-brand font-black tracking-tighter text-white tabular-nums">${ssrInterpolate(unref(uploadProgress))}%</span></div><div class="h-[2px] w-full bg-white/5 rounded-full overflow-hidden"><div class="h-full bg-silver transition-all duration-700 ease-out" style="${ssrRenderStyle({ width: `${unref(uploadProgress)}%` })}"></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(processing) || unref(uploading) || !unref(videoFile) || !unref(title)) ? " disabled" : ""} class="btn-primary w-full py-6 text-sm font-black tracking-[0.4em] uppercase group">`);
        if (!unref(processing) && !unref(uploading)) {
          _push(`<span class="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em]">${ssrInterpolate(unref(t)("studio.publish"))} <div class="i-ph-rocket-launch-bold group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300"></div></span>`);
        } else {
          _push(`<span class="flex items-center justify-center gap-4 text-xs font-black tracking-[0.2em]">${ssrInterpolate(unref(processing) ? unref(t)("studio.processing") : unref(t)("studio.uploading"))} <div class="i-ph-circle-notch-bold animate-spin"></div></span>`);
        }
        _push(`</button></div></form>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/studio/upload.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=upload-CcJYy160.mjs.map
