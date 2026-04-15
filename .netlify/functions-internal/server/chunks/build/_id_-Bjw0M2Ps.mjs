import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrGetDirectiveProps, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderTeleport } from 'vue/server-renderer';
import { withAsyncContext, ref, resolveDirective, unref, mergeProps, useSSRContext } from 'vue';
import { u as useTimeAgo } from './index-CTnNueJA.mjs';
import { c as useRoute, a as useSupabaseUser, b as useI18n, d as useAsyncData } from './server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
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

const _sfc_main$1 = {
  __name: "CinemaMode",
  __ssrInlineRender: true,
  props: {
    active: Boolean
  },
  emits: ["update:active"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.active) {
          _push2(`<div class="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[45] pointer-events-auto"></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CinemaMode.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const supabase = useSupabaseClient();
    const user = useSupabaseUser();
    const { t } = useI18n();
    const { data: video } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`video-${route.params.id}`, async () => {
      const { data } = await supabase.from("videos").select("*, profiles(id, display_name, avatar_url)").eq("id", route.params.id).single();
      return data;
    })), __temp = await __temp, __restore(), __temp);
    const { data: likesCount, refresh: refreshLikes } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`likes-${route.params.id}`, async () => {
      const { count } = await supabase.from("likes").select("*", { count: "exact", head: true }).eq("video_id", route.params.id);
      return count || 0;
    })), __temp = await __temp, __restore(), __temp);
    const hasLiked = ref(false);
    const isSubscribed = ref(false);
    const { data: comments, refresh: refreshComments } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(`comments-${route.params.id}`, async () => {
      const { data } = await supabase.from("comments").select("*, profiles(display_name, avatar_url)").eq("video_id", route.params.id).order("created_at", { ascending: false });
      return data || [];
    })), __temp = await __temp, __restore(), __temp);
    const commentContent = ref("");
    const isPosting = ref(false);
    ref(null);
    const isPlaying = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CinemaMode = _sfc_main$1;
      const _directive_motion = resolveDirective("motion");
      if (unref(video)) {
        _push(`<div${ssrRenderAttrs(_attrs)}>`);
        _push(ssrRenderComponent(_component_CinemaMode, {
          active: _ctx.isCinemaMode,
          "onUpdate:active": ($event) => _ctx.isCinemaMode = $event
        }, null, _parent));
        _push(`<div class="${ssrRenderClass([{ "relative z-50": _ctx.isCinemaMode }, "layout-container pb-40 transition-all duration-1000"])}"><div class="${ssrRenderClass([{ "flex flex-col items-center": _ctx.isCinemaMode }, "grid grid-cols-1 lg:grid-cols-3 gap-16"])}"><div class="${ssrRenderClass([_ctx.isCinemaMode ? "w-full max-w-6xl" : "lg:col-span-2", "space-y-12"])}"><div${ssrRenderAttrs(mergeProps({
          initial: { opacity: 0, scale: 0.95 },
          enter: { opacity: 1, scale: 1, transition: { duration: 1e3, ease: [0.16, 1, 0.3, 1] } },
          class: ["group relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border border-white/5 ring-1 ring-white/5 transition-all duration-1000", { "ring-white/20 scale-[1.02] shadow-[0_0_100px_rgba(255,255,255,0.05)]": _ctx.isCinemaMode }]
        }, ssrGetDirectiveProps(_ctx, _directive_motion)))}><video${ssrRenderAttr("src", unref(video).video_url)} class="w-full h-full object-contain"${ssrRenderAttr("poster", unref(video).thumbnail_url)} style="${ssrRenderStyle({ viewTransitionName: `video-thumb-${unref(video).id}` })}"></video><button class="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all opacity-0 group-hover:opacity-100"><div class="${ssrRenderClass(_ctx.isCinemaMode ? "i-ph-arrows-in-bold" : "i-ph-arrows-out-bold")}"></div></button><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 pointer-events-none"><div class="w-24 h-24 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center border border-white/10 scale-90 group-hover:scale-100 transition-all duration-500"><div class="${ssrRenderClass([unref(isPlaying) ? "i-ph-pause-fill" : "i-ph-play-fill", "text-white text-4xl"])}"></div></div></div></div><div class="${ssrRenderClass([{ "max-w-4xl mx-auto": _ctx.isCinemaMode }, "space-y-10"])}"><h1 class="text-4xl md:text-5xl font-brand font-extrabold tracking-tighter leading-tight text-gradient">${ssrInterpolate(unref(video).title)}</h1><div class="flex flex-wrap items-center justify-between gap-6 pb-10 border-b border-white/5"><div class="flex items-center gap-5"><img${ssrRenderAttr("src", unref(video).profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${unref(video).user_id}`)} class="w-14 h-14 rounded-full border border-white/10 p-1 bg-void-card ring-1 ring-white/5"><div class="space-y-1"><div class="font-brand text-lg text-white tracking-tight">${ssrInterpolate(unref(video).profiles.display_name)}</div><div class="text-[10px] text-white/30 uppercase tracking-[0.3em] font-bold">${ssrInterpolate(unref(t)("watch.verified_architect"))}</div></div><button class="ml-6 flex items-center gap-2 group"><div class="${ssrRenderClass([unref(isSubscribed) ? "bg-white/5 text-white/20 border border-white/5" : "bg-white text-black hover:bg-zinc-200", "px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest transition-all duration-500"])}">${ssrInterpolate(unref(isSubscribed) ? unref(t)("watch.membership_active") : unref(t)("watch.join_collective"))}</div></button></div><div class="flex items-center gap-4"><button class="${ssrRenderClass([unref(hasLiked) ? "bg-white text-black" : "bg-white/5 hover:bg-white/10 text-white/60", "flex items-center gap-3 px-8 py-3 rounded-full border border-white/5 transition-all font-bold text-xs tracking-widest uppercase"])}"><div class="${ssrRenderClass([unref(hasLiked) ? "i-ph-heart-fill" : "i-ph-heart-bold", "text-lg"])}"></div> ${ssrInterpolate(unref(likesCount))}</button><button class="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all"><div class="i-ph-share-network-bold text-lg"></div></button></div></div><div class="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 leading-relaxed text-white/50 text-sm tracking-wide"><div class="flex items-center gap-4 mb-6 text-[10px] font-bold text-white/40 uppercase tracking-[0.4em]"><span>${ssrInterpolate(unref(video).view_count)} ${ssrInterpolate(unref(t)("watch.impression_units"))}</span><span class="w-1 h-1 rounded-full bg-white/10"></span><span>${ssrInterpolate(unref(t)("watch.logged"))}: ${ssrInterpolate(new Date(unref(video).created_at).toLocaleDateString())}</span></div> ${ssrInterpolate(unref(video).description || unref(t)("watch.no_metadata"))}</div></div><div class="${ssrRenderClass([{ "max-w-4xl mx-auto": _ctx.isCinemaMode }, "space-y-12 pt-12"])}"><div class="flex items-center gap-4"><div class="w-2 h-2 rounded-full bg-white"></div><h2 class="text-xl font-brand font-bold tracking-tight uppercase italic">${ssrInterpolate(unref(t)("watch.protocol_feed"))} (${ssrInterpolate(unref(comments)?.length || 0)}) </h2></div><div class="flex gap-6">`);
        if (unref(user)) {
          _push(`<img${ssrRenderAttr("src", _ctx.profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${unref(user)?.email}`)} class="w-12 h-12 rounded-full border border-white/10 p-1 bg-void-card shrink-0">`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex-1 space-y-4"><textarea${ssrRenderAttr("placeholder", unref(t)("watch.add_comment"))} class="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-6 text-sm focus:outline-none focus:border-white/30 transition-all min-h-[120px] resize-none placeholder:text-white/20">${ssrInterpolate(unref(commentContent))}</textarea><div class="flex justify-end items-center gap-6">`);
        if (unref(commentContent)) {
          _push(`<button class="text-xs font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">${ssrInterpolate(unref(t)("watch.discard"))}</button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button${ssrIncludeBooleanAttr(unref(isPosting) || !unref(commentContent).trim()) ? " disabled" : ""} class="btn-primary">${ssrInterpolate(unref(isPosting) ? unref(t)("watch.transmitting") : unref(t)("watch.post_message"))}</button></div></div></div><div class="space-y-10 pt-6"><!--[-->`);
        ssrRenderList(unref(comments), (comment) => {
          _push(`<div class="flex gap-6 group"><img${ssrRenderAttr("src", comment.profiles.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`)} class="w-11 h-11 rounded-full border border-white/5 p-0.5 bg-void shrink-0"><div class="space-y-2 flex-1"><div class="flex items-center gap-3"><span class="font-bold text-xs tracking-widest uppercase text-white/80">${ssrInterpolate(comment.profiles.display_name)}</span><span class="text-[9px] text-white/20 font-bold uppercase tracking-widest">${ssrInterpolate(("useTimeAgo" in _ctx ? _ctx.useTimeAgo : unref(useTimeAgo))(comment.created_at).value)}</span></div><p class="text-white/40 text-sm leading-relaxed max-w-2xl">${ssrInterpolate(comment.content)}</p><div class="flex items-center gap-6 pt-3"><button class="flex items-center gap-2 text-[10px] font-bold text-white/20 hover:text-white transition-colors"><div class="i-ph-thumbs-up-bold"></div> 0 </button><button class="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest">${ssrInterpolate(unref(t)("watch.reply"))}</button></div></div></div>`);
        });
        _push(`<!--]--></div></div></div><div class="${ssrRenderClass([{ "w-full max-w-4xl pt-20 border-t border-white/5": _ctx.isCinemaMode }, "space-y-10"])}"><div class="flex items-center gap-3 ml-2"><div class="w-1 h-3 bg-white/20"></div><h3 class="text-xs font-brand tracking-[0.4em] text-white/40 uppercase italic">${ssrInterpolate(unref(t)("watch.up_next"))}</h3></div><div class="${ssrRenderClass([{ "grid grid-cols-1 md:grid-cols-2 gap-10 space-y-0": _ctx.isCinemaMode }, "space-y-10"])}"><!--[-->`);
        ssrRenderList(6, (n) => {
          _push(`<div class="flex gap-5 group cursor-pointer transition-all duration-500 hover:translate-x-1"><div class="w-44 aspect-video rounded-2xl bg-void-card shrink-0 overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-white/20 shadow-xl"><div class="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center"><div class="i-ph-video-camera-bold text-white/5 text-4xl transition-transform duration-700 group-hover:scale-110"></div></div></div><div class="flex flex-col gap-2 min-w-0 pt-1"><div class="text-xs font-brand font-bold tracking-tight text-white/90 line-clamp-2 leading-snug group-hover:text-white transition-colors">Elevating Video Platforms via Minimalist 2026 Architectures</div><div class="text-[9px] text-white/30 tracking-[0.2em] font-bold uppercase">System Operator</div><div class="text-[9px] text-white/10 font-bold uppercase tracking-widest">Analytics: 942K Units</div></div></div>`);
        });
        _push(`<!--]--></div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/watch/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-Bjw0M2Ps.mjs.map
