import { type Ref, onMounted, onUnmounted, unref } from "vue";
import { gsap } from "gsap";

export const useMagnetic = (el: Ref<any>, strength = 40) => {
  if (!import.meta.client) return;

  let xTo: any, yTo: any;

  onMounted(() => {
    const target = unref(el);
    if (!target) return;

    // Handle Vue component refs (like NuxtLink)
    const element = target.$el || target;
    if (!element || typeof element.addEventListener !== "function") return;

    xTo = gsap.quickTo(element, "x", { duration: 0.8, ease: "power3.out" });
    yTo = gsap.quickTo(element, "y", { duration: 0.8, ease: "power3.out" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = element.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);

      xTo(x * (strength / 100));
      yTo(y * (strength / 100));
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    onUnmounted(() => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    });
  });
};

export const useRipple = () => {
  const createRipple = (event: MouseEvent) => {
    const button = event.currentTarget as HTMLElement;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
      ripple.remove();
    }

    button.appendChild(circle);
  };

  return { createRipple };
};
