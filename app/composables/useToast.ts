import { useToast as useShadcnToast } from "~/components/ui/toast/use-toast";

export const useToast = () => {
  const { toast } = useShadcnToast();

  const success = (message: string, duration = 3000) => {
    toast({
      title: "Success",
      description: message,
      variant: "default",
      duration,
    });
  };

  const error = (message: string, duration = 5000) => {
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
      duration,
    });
  };

  const info = (message: string, duration = 3000) => {
    toast({
      title: "Info",
      description: message,
      duration,
    });
  };

  return {
    success,
    error,
    info,
    // Add compatibility for other properties if needed
    toasts: [], 
    removeToast: () => {},
    addToast: (message: string, type: any) => {
      if (type === 'success') success(message);
      else if (type === 'error') error(message);
      else info(message);
    }
  };
};
