"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import FullPageLoader from "@/components/FullPageLoader";

type NavigationContextType = {
  navigateWithLoader: (path: string) => Promise<void>;
};

export const NavigationContext = createContext<NavigationContextType>({
  navigateWithLoader: async () => {},
});

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const navigateWithLoader = async (path: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 50)); // let loader mount
    router.push(path);
    setTimeout(() => setLoading(false), 1200); // hide after navigation
  };

  return (
    <NavigationContext.Provider value={{ navigateWithLoader }}>
      {children}
      {loading && <FullPageLoader />}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
