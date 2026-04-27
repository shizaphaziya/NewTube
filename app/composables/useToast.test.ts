import { expect, test, describe, beforeEach } from "bun:test";
import { useToast } from "./useToast";

describe("useToast", () => {
  let toastManager: ReturnType<typeof useToast>;

  beforeEach(() => {
    toastManager = useToast();
    toastManager.toasts.value = [];
  });

  test("should add a toast with default values", () => {
    toastManager.addToast("Test message");

    expect(toastManager.toasts.value).toHaveLength(1);
    const toast = toastManager.toasts.value[0];
    expect(toast.message).toBe("Test message");
    expect(toast.type).toBe("info");
    expect(toast.duration).toBe(3000);
    expect(toast.id).toBeDefined();
  });

  test("should add a toast with custom type and duration", () => {
    toastManager.addToast("Success message", "success", 5000);

    expect(toastManager.toasts.value).toHaveLength(1);
    const toast = toastManager.toasts.value[0];
    expect(toast.message).toBe("Success message");
    expect(toast.type).toBe("success");
    expect(toast.duration).toBe(5000);
  });

  test("should limit to 3 toasts max and remove the oldest", () => {
    toastManager.addToast("First");
    toastManager.addToast("Second");
    toastManager.addToast("Third");

    expect(toastManager.toasts.value).toHaveLength(3);
    expect(toastManager.toasts.value[0].message).toBe("First");

    toastManager.addToast("Fourth");

    expect(toastManager.toasts.value).toHaveLength(3);
    expect(toastManager.toasts.value[0].message).toBe("Second");
    expect(toastManager.toasts.value[2].message).toBe("Fourth");
  });

  test("should remove toast by id", () => {
    toastManager.addToast("To remove");
    const id = toastManager.toasts.value[0].id;

    toastManager.removeToast(id);
    expect(toastManager.toasts.value).toHaveLength(0);
  });

  test("should not remove anything if id does not exist", () => {
    toastManager.addToast("Keep me");
    toastManager.removeToast("non-existent-id");
    expect(toastManager.toasts.value).toHaveLength(1);
  });

  describe("shorthand methods", () => {
    test("success() should add success toast", () => {
      toastManager.success("Yay!");
      expect(toastManager.toasts.value[0].type).toBe("success");
      expect(toastManager.toasts.value[0].message).toBe("Yay!");
    });

    test("error() should add error toast", () => {
      toastManager.error("Oops!");
      expect(toastManager.toasts.value[0].type).toBe("error");
      expect(toastManager.toasts.value[0].message).toBe("Oops!");
    });

    test("info() should add info toast", () => {
      toastManager.info("Hey!");
      expect(toastManager.toasts.value[0].type).toBe("info");
      expect(toastManager.toasts.value[0].message).toBe("Hey!");
    });
  });

  test("should automatically remove toast after duration", async () => {
    toastManager.addToast("Auto remove", "info", 10);
    expect(toastManager.toasts.value).toHaveLength(1);

    await new Promise(resolve => setTimeout(resolve, 20));

    expect(toastManager.toasts.value).toHaveLength(0);
  });

  test("should not automatically remove if duration is 0", async () => {
    toastManager.addToast("Stay forever", "info", 0);
    expect(toastManager.toasts.value).toHaveLength(1);

    await new Promise(resolve => setTimeout(resolve, 20));

    expect(toastManager.toasts.value).toHaveLength(1);
  });
});
