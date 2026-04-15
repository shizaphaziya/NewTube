import { _ as __nuxt_component_0$1 } from './nuxt-link-BKJ9yXBT.mjs';
import { ref, mergeProps, unref, resolveDirective, defineComponent, withCtx, createVNode, toDisplayString, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrGetDirectiveProps, ssrRenderAttr, ssrRenderStyle } from 'vue/server-renderer';
import { b as useI18n, e as useSeoMeta, _ as _export_sfc } from './server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-4v4x5xwK.mjs';
import { a as useIntersectionObserver } from './index-CTnNueJA.mjs';
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

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "VideoCard",
  __ssrInlineRender: true,
  props: {
    video: {}
  },
  setup(__props) {
    const { t } = useI18n();
    const formatViews = (count) => {
      if (count >= 1e6) return (count / 1e6).toFixed(1) + "M";
      if (count >= 1e3) return (count / 1e3).toFixed(1) + "K";
      return count.toString();
    };
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const d = new Date(dateStr);
      const now = /* @__PURE__ */ new Date();
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 864e5);
      if (diffDays === 0) return "Сегодня";
      if (diffDays === 1) return "Вчера";
      if (diffDays < 7) return `${diffDays}д назад`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}н назад`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)}м назад`;
      return `${Math.floor(diffDays / 365)}г назад`;
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: `/watch/${__props.video.id}`,
        class: "flex flex-col gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-2xl",
        style: { viewTransitionName: `video-card-${__props.video.id}` }
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="relative aspect-video rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/20 group-hover:-translate-y-1.5 group-hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)]"${_scopeId}><img${ssrRenderAttr("src", __props.video.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800")}${ssrRenderAttr("alt", __props.video.title)} class="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style="${ssrRenderStyle({ viewTransitionName: `video-thumb-${__props.video.id}` })}" loading="lazy"${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"${_scopeId}></div><div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400"${_scopeId}><div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center scale-75 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_8px_32px_rgba(0,0,0,0.6)]"${_scopeId}><div class="i-ph-play-fill text-black text-xl translate-x-px"${_scopeId}></div></div></div><div class="absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[9px] font-black tracking-widest text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"${_scopeId}>${ssrInterpolate(formatViews(__props.video.view_count))} ${ssrInterpolate(unref(t)("watch.views"))}</div></div><div class="flex gap-3 px-0.5"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_NuxtLink, {
              to: `/profile/${__props.video.user_id}`,
              onClick: () => {
              },
              class: "shrink-0 mt-0.5"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<img${ssrRenderAttr("src", __props.video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${__props.video.user_id}`)}${ssrRenderAttr("alt", __props.video.profiles?.display_name)} class="w-8 h-8 rounded-xl border border-white/[0.08] object-cover transition-all duration-300 hover:border-white/25 hover:scale-110"${_scopeId2}>`);
                } else {
                  return [
                    createVNode("img", {
                      src: __props.video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${__props.video.user_id}`,
                      alt: __props.video.profiles?.display_name,
                      class: "w-8 h-8 rounded-xl border border-white/[0.08] object-cover transition-all duration-300 hover:border-white/25 hover:scale-110"
                    }, null, 8, ["src", "alt"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="flex flex-col gap-0.5 min-w-0 flex-1"${_scopeId}><h3 class="text-[13px] font-sans font-semibold text-white/85 leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-white"${_scopeId}>${ssrInterpolate(__props.video.title)}</h3><p class="text-[10px] font-bold tracking-wider text-white/30 uppercase truncate mt-0.5"${_scopeId}>${ssrInterpolate(__props.video.profiles?.display_name)}</p><div class="flex items-center gap-2 mt-0.5"${_scopeId}><span class="text-[10px] text-white/20 tabular-nums"${_scopeId}>${ssrInterpolate(formatDate(__props.video.created_at))}</span></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "relative aspect-video rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.06] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-white/20 group-hover:-translate-y-1.5 group-hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.9)]" }, [
                createVNode("img", {
                  src: __props.video.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800",
                  alt: __props.video.title,
                  class: "w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]",
                  style: { viewTransitionName: `video-thumb-${__props.video.id}` },
                  loading: "lazy"
                }, null, 12, ["src", "alt"]),
                createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
                createVNode("div", { class: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400" }, [
                  createVNode("div", { class: "w-12 h-12 rounded-2xl bg-white flex items-center justify-center scale-75 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_8px_32px_rgba(0,0,0,0.6)]" }, [
                    createVNode("div", { class: "i-ph-play-fill text-black text-xl translate-x-px" })
                  ])
                ]),
                createVNode("div", { class: "absolute bottom-2.5 right-2.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-sm text-[9px] font-black tracking-widest text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300" }, toDisplayString(formatViews(__props.video.view_count)) + " " + toDisplayString(unref(t)("watch.views")), 1)
              ]),
              createVNode("div", { class: "flex gap-3 px-0.5" }, [
                createVNode(_component_NuxtLink, {
                  to: `/profile/${__props.video.user_id}`,
                  onClick: withModifiers(() => {
                  }, ["stop"]),
                  class: "shrink-0 mt-0.5"
                }, {
                  default: withCtx(() => [
                    createVNode("img", {
                      src: __props.video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${__props.video.user_id}`,
                      alt: __props.video.profiles?.display_name,
                      class: "w-8 h-8 rounded-xl border border-white/[0.08] object-cover transition-all duration-300 hover:border-white/25 hover:scale-110"
                    }, null, 8, ["src", "alt"])
                  ]),
                  _: 1
                }, 8, ["to", "onClick"]),
                createVNode("div", { class: "flex flex-col gap-0.5 min-w-0 flex-1" }, [
                  createVNode("h3", { class: "text-[13px] font-sans font-semibold text-white/85 leading-snug line-clamp-2 transition-colors duration-300 group-hover:text-white" }, toDisplayString(__props.video.title), 1),
                  createVNode("p", { class: "text-[10px] font-bold tracking-wider text-white/30 uppercase truncate mt-0.5" }, toDisplayString(__props.video.profiles?.display_name), 1),
                  createVNode("div", { class: "flex items-center gap-2 mt-0.5" }, [
                    createVNode("span", { class: "text-[10px] text-white/20 tabular-nums" }, toDisplayString(formatDate(__props.video.created_at)), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VideoCard.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$3, { __name: "VideoCard" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "VideoSkeleton",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-4 animate-pulse" }, _attrs))} data-v-4a1f483e><div class="relative aspect-video rounded-3xl bg-white/[0.03] overflow-hidden border border-white/5" data-v-4a1f483e><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-animation" data-v-4a1f483e></div></div><div class="flex gap-4 px-1" data-v-4a1f483e><div class="w-10 h-10 rounded-2xl bg-white/[0.03] shrink-0 overflow-hidden relative border border-white/5" data-v-4a1f483e><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-animation" data-v-4a1f483e></div></div><div class="flex flex-col gap-2 w-full" data-v-4a1f483e><div class="h-4 w-3/4 bg-white/[0.05] rounded-lg relative overflow-hidden" data-v-4a1f483e><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent shimmer-animation" data-v-4a1f483e></div></div><div class="h-3 w-1/2 bg-white/[0.02] rounded-lg relative overflow-hidden" data-v-4a1f483e><div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent shimmer-animation" data-v-4a1f483e></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VideoSkeleton.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-4a1f483e"]]), { __name: "VideoSkeleton" });
const pageSize = 12;
const _sfc_main$1 = {
  __name: "InfiniteVideoGrid",
  __ssrInlineRender: true,
  setup(__props) {
    const supabase = useSupabaseClient();
    const videos = ref([]);
    const page = ref(0);
    const loading = ref(false);
    const hasMore = ref(true);
    const loadMoreTrigger = ref(null);
    const fetchVideos = async () => {
      if (loading.value || !hasMore.value) return;
      loading.value = true;
      const from = page.value * pageSize;
      const to = from + pageSize - 1;
      const { data, error } = await supabase.from("videos").select("*, profiles(display_name, avatar_url)").eq("status", "published").order("created_at", { ascending: false }).range(from, to);
      if (error) {
        console.error(error);
      } else {
        if (data.length < pageSize) hasMore.value = false;
        videos.value.push(...data);
        page.value++;
      }
      loading.value = false;
    };
    useIntersectionObserver(loadMoreTrigger, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        fetchVideos();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VideoCard = __nuxt_component_0;
      const _component_VideoSkeleton = __nuxt_component_1;
      const _directive_motion = resolveDirective("motion");
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"><!--[-->`);
      ssrRenderList(unref(videos), (video, idx) => {
        _push(ssrRenderComponent(_component_VideoCard, mergeProps({
          key: video.id,
          video,
          initial: { opacity: 0, y: 40 },
          enter: { opacity: 1, y: 0, transition: { duration: 1e3, ease: [0.16, 1, 0.3, 1], delay: idx % pageSize * 100 } }
        }, ssrGetDirectiveProps(_ctx, _directive_motion)), null, _parent));
      });
      _push(`<!--]-->`);
      if (unref(loading)) {
        _push(`<!--[-->`);
        ssrRenderList(6, (n) => {
          _push(ssrRenderComponent(_component_VideoSkeleton, { key: n }, null, _parent));
        });
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="h-40 flex items-center justify-center mt-20">`);
      if (unref(loading) && unref(videos).length > 0) {
        _push(`<div class="w-8 h-8 rounded-full border-2 border-white/10 border-t-white animate-spin"></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(hasMore) && unref(videos).length > 0) {
        _push(`<p class="text-white/10 text-[9px] font-black tracking-[0.5em] uppercase"> ∎ ${ssrInterpolate(_ctx.$t("home.no_videos"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (!unref(loading) && unref(videos).length === 0) {
        _push(`<div class="flex flex-col items-center justify-center py-60 text-center"><div class="i-ph-video-camera-slash text-8xl text-white/[0.02] mb-10"></div><h2 class="text-4xl font-brand tracking-widest text-white/20 uppercase italic">${ssrInterpolate(_ctx.$t("home.no_videos"))}</h2></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/InfiniteVideoGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const feeds = [
      { key: "trending", label: t("home.trending"), icon: "i-ph-fire-bold" },
      { key: "latest", label: t("home.latest"), icon: "i-ph-lightning-bold" },
      { key: "subscriptions", label: t("home.subscriptions"), icon: "i-ph-users-four-bold" }
    ];
    const activeFeed = ref("trending");
    useSeoMeta({
      title: "NewTube — Elite Video Platform",
      description: "Discover the best videos on NewTube, the next-generation video platform."
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_InfiniteVideoGrid = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen" }, _attrs))}><div class="px-8 pt-8 pb-6 flex items-center gap-6 border-b border-white/[0.04]"><div class="flex items-center gap-1.5"><!--[-->`);
      ssrRenderList(feeds, (feed) => {
        _push(`<button class="${ssrRenderClass([unref(activeFeed) === feed.key ? "bg-white text-black" : "text-white/35 hover:text-white/70 hover:bg-white/[0.05]", "flex items-center gap-2 px-4 py-2 rounded-xl font-brand font-bold text-[10px] uppercase tracking-[0.18em] transition-all duration-250 whitespace-nowrap"])}"><div class="${ssrRenderClass([feed.icon, "text-sm shrink-0"])}"></div><span>${ssrInterpolate(feed.label)}</span></button>`);
      });
      _push(`<!--]--></div><div class="flex-1"></div><div class="text-[9px] font-black tracking-[0.4em] uppercase text-white/10"> NewTube </div></div><div class="px-8 py-8">`);
      _push(ssrRenderComponent(_component_InfiniteVideoGrid, null, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Bo_ph3n8.mjs.map
