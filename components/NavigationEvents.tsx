"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FullPageLoader from "@/components/FullPageLoader";

export default function NavigationEvents() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // When path changes, trigger loader briefly
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 800); // you can adjust this
    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? <FullPageLoader /> : null;
}
