"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { refreshTokenAsync } from "@/redux/features/auth/authSlice";

export default function AppInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(refreshTokenAsync());
    const interval = setInterval(() => {
      dispatch(refreshTokenAsync());
    }, 10 * 60 * 1000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}
