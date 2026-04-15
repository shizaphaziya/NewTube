import { computed, toValue, ref, shallowRef, watch, isRef, shallowReadonly, getCurrentScope, onScopeDispose, readonly, getCurrentInstance } from 'vue';

function tryOnScopeDispose(fn, failSilently) {
  if (getCurrentScope()) {
    onScopeDispose(fn, failSilently);
    return true;
  }
  return false;
}
const isClient = false;
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const notNullish = (val) => val != null;
const noop = () => {
};
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function useIntervalFn(cb, interval = 1e3, options = {}) {
  const { immediate = true, immediateCallback = false } = options;
  let timer = null;
  const isActive = shallowRef(false);
  function clean() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function pause() {
    isActive.value = false;
    clean();
  }
  function resume() {
    const intervalValue = toValue(interval);
    if (intervalValue <= 0) return;
    isActive.value = true;
    if (immediateCallback) cb();
    clean();
    if (isActive.value) timer = setInterval(cb, intervalValue);
  }
  if (isRef(interval) || typeof interval === "function") tryOnScopeDispose(watch(interval, () => {
    if (isActive.value && isClient) ;
  }));
  tryOnScopeDispose(pause);
  return {
    isActive: shallowReadonly(isActive),
    pause,
    resume
  };
}
const defaultWindow = void 0;
function unrefElement(elRef) {
  var _$el;
  const plain = toValue(elRef);
  return (_$el = plain === null || plain === void 0 ? void 0 : plain.$el) !== null && _$el !== void 0 ? _$el : plain;
}
// @__NO_SIDE_EFFECTS__
function useMounted() {
  const isMounted = shallowRef(false);
  getCurrentInstance();
  return isMounted;
}
// @__NO_SIDE_EFFECTS__
function useSupported(callback) {
  const isMounted = /* @__PURE__ */ useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useRafFn(fn, options = {}) {
  const { immediate = true, fpsLimit = null, window: window$1 = defaultWindow, once = false } = options;
  const isActive = shallowRef(false);
  const intervalLimit = computed(() => {
    const limit = toValue(fpsLimit);
    return limit ? 1e3 / limit : null;
  });
  let previousFrameTimestamp = 0;
  let rafId = null;
  function loop(timestamp$1) {
    if (!isActive.value || !window$1) return;
    if (!previousFrameTimestamp) previousFrameTimestamp = timestamp$1;
    const delta = timestamp$1 - previousFrameTimestamp;
    if (intervalLimit.value && delta < intervalLimit.value) {
      rafId = window$1.requestAnimationFrame(loop);
      return;
    }
    previousFrameTimestamp = timestamp$1;
    fn({
      delta,
      timestamp: timestamp$1
    });
    if (once) {
      isActive.value = false;
      rafId = null;
      return;
    }
    rafId = window$1.requestAnimationFrame(loop);
  }
  function resume() {
    if (!isActive.value && window$1) {
      isActive.value = true;
      previousFrameTimestamp = 0;
      rafId = window$1.requestAnimationFrame(loop);
    }
  }
  function pause() {
    isActive.value = false;
    if (rafId != null && window$1) {
      window$1.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  if (immediate) resume();
  tryOnScopeDispose(pause);
  return {
    isActive: readonly(isActive),
    pause,
    resume
  };
}
function useIntersectionObserver(target, callback, options = {}) {
  const { root, rootMargin, threshold = 0, window: window$1 = defaultWindow, immediate = true } = options;
  const isSupported = /* @__PURE__ */ useSupported(() => window$1 && "IntersectionObserver" in window$1);
  const targets = computed(() => {
    return toArray(toValue(target)).map(unrefElement).filter(notNullish);
  });
  let cleanup = noop;
  const isActive = shallowRef(immediate);
  const stopWatch = isSupported.value ? watch(() => [
    targets.value,
    unrefElement(root),
    toValue(rootMargin),
    isActive.value
  ], ([targets$1, root$1, rootMargin$1]) => {
    cleanup();
    if (!isActive.value) return;
    if (!targets$1.length) return;
    const observer = new IntersectionObserver(callback, {
      root: unrefElement(root$1),
      rootMargin: rootMargin$1,
      threshold
    });
    targets$1.forEach((el) => el && observer.observe(el));
    cleanup = () => {
      observer.disconnect();
      cleanup = noop;
    };
  }, {
    immediate,
    flush: "post"
  }) : noop;
  const stop = () => {
    cleanup();
    stopWatch();
    isActive.value = false;
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    isActive,
    pause() {
      cleanup();
      isActive.value = false;
    },
    resume() {
      isActive.value = true;
    },
    stop
  };
}
function getDefaultScheduler$5(options) {
  if ("interval" in options || "immediate" in options) {
    const { interval = "requestAnimationFrame", immediate = true } = options;
    return interval === "requestAnimationFrame" ? (fn) => useRafFn(fn, { immediate }) : (fn) => useIntervalFn(fn, interval, options);
  }
  return useRafFn;
}
// @__NO_SIDE_EFFECTS__
function useNow(options = {}) {
  const { controls: exposeControls = false, scheduler = getDefaultScheduler$5(options) } = options;
  const now = ref(/* @__PURE__ */ new Date());
  const update = () => now.value = /* @__PURE__ */ new Date();
  const controls = scheduler(update);
  if (exposeControls) return {
    now,
    ...controls
  };
  else return now;
}
const DEFAULT_UNITS = [
  {
    max: 6e4,
    value: 1e3,
    name: "second"
  },
  {
    max: 276e4,
    value: 6e4,
    name: "minute"
  },
  {
    max: 72e6,
    value: 36e5,
    name: "hour"
  },
  {
    max: 5184e5,
    value: 864e5,
    name: "day"
  },
  {
    max: 24192e5,
    value: 6048e5,
    name: "week"
  },
  {
    max: 28512e6,
    value: 2592e6,
    name: "month"
  },
  {
    max: Number.POSITIVE_INFINITY,
    value: 31536e6,
    name: "year"
  }
];
const DEFAULT_MESSAGES = {
  justNow: "just now",
  past: (n) => n.match(/\d/) ? `${n} ago` : n,
  future: (n) => n.match(/\d/) ? `in ${n}` : n,
  month: (n, past) => n === 1 ? past ? "last month" : "next month" : `${n} month${n > 1 ? "s" : ""}`,
  year: (n, past) => n === 1 ? past ? "last year" : "next year" : `${n} year${n > 1 ? "s" : ""}`,
  day: (n, past) => n === 1 ? past ? "yesterday" : "tomorrow" : `${n} day${n > 1 ? "s" : ""}`,
  week: (n, past) => n === 1 ? past ? "last week" : "next week" : `${n} week${n > 1 ? "s" : ""}`,
  hour: (n) => `${n} hour${n > 1 ? "s" : ""}`,
  minute: (n) => `${n} minute${n > 1 ? "s" : ""}`,
  second: (n) => `${n} second${n > 1 ? "s" : ""}`,
  invalid: ""
};
function DEFAULT_FORMATTER(date) {
  return date.toISOString().slice(0, 10);
}
function getDefaultScheduler$4(options) {
  if ("updateInterval" in options) {
    const { updateInterval = 3e4 } = options;
    return (cb) => useIntervalFn(cb, updateInterval);
  }
  return (cb) => useIntervalFn(cb, 3e4);
}
// @__NO_SIDE_EFFECTS__
function useTimeAgo(time, options = {}) {
  const { controls: exposeControls = false, scheduler = getDefaultScheduler$4(options) } = options;
  const { now, ...controls } = /* @__PURE__ */ useNow({
    scheduler,
    controls: true
  });
  const timeAgo = computed(() => formatTimeAgo(new Date(toValue(time)), options, toValue(now)));
  if (exposeControls) return {
    timeAgo,
    ...controls
  };
  else return timeAgo;
}
function formatTimeAgo(from, options = {}, now = Date.now()) {
  const { max, messages = DEFAULT_MESSAGES, fullDateFormatter = DEFAULT_FORMATTER, units = DEFAULT_UNITS, showSecond = false, rounding = "round" } = options;
  const roundFn = typeof rounding === "number" ? (n) => +n.toFixed(rounding) : Math[rounding];
  const diff = +now - +from;
  const absDiff = Math.abs(diff);
  function getValue$1(diff$1, unit) {
    return roundFn(Math.abs(diff$1) / unit.value);
  }
  function format(diff$1, unit) {
    const val = getValue$1(diff$1, unit);
    const past = diff$1 > 0;
    const str = applyFormat(unit.name, val, past);
    return applyFormat(past ? "past" : "future", str, past);
  }
  function applyFormat(name, val, isPast) {
    const formatter = messages[name];
    if (typeof formatter === "function") return formatter(val, isPast);
    return formatter.replace("{0}", val.toString());
  }
  if (absDiff < 6e4 && !showSecond) return messages.justNow;
  if (typeof max === "number" && absDiff > max) return fullDateFormatter(new Date(from));
  if (typeof max === "string") {
    var _units$find;
    const unitMax = (_units$find = units.find((i) => i.name === max)) === null || _units$find === void 0 ? void 0 : _units$find.max;
    if (unitMax && absDiff > unitMax) return fullDateFormatter(new Date(from));
  }
  for (const [idx, unit] of units.entries()) {
    if (getValue$1(diff, unit) <= 0 && units[idx - 1]) return format(diff, units[idx - 1]);
    if (absDiff < unit.max) return format(diff, unit);
  }
  return messages.invalid;
}

export { useIntersectionObserver as a, useTimeAgo as u };
//# sourceMappingURL=index-CTnNueJA.mjs.map
