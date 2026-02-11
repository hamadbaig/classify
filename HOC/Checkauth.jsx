"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Loader from "@/components/Common/Loader";
import { usePathname } from "next/navigation";

const Checkauth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const pathname = usePathname();
    const router = useRouter();
    const user = useSelector((state) => state.UserSignup.data);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
      // List of routes that require authentication
      const privateRoutes = [
        "/profile",
        "/ad-listing",
        "/notifications",
        "/chat",
        "/user-subscription",
        "/my-ads",
        "/favorites",
        "/transactions",
        "/reviews",
        "/edit-listing",
        "/user-verification",
        "/job-applications",
      ];
      const isPrivateRoute = privateRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

      // If it's a private route and user is not authenticated
      if (isPrivateRoute && !user) {
        router.push("/");
        return;
      }

      // If user is authenticated or it's not a private route
      setIsAuthorized(true);
      setAuthChecked(true);
    }, [user, pathname, router]);

    // Show loader until auth check completes
    if (!authChecked) {
      return <Loader />;
    }

    // Only render the component if user is authorized
    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  return Wrapper;
};

export default Checkauth;
