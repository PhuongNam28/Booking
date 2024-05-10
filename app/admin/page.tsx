"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Admin = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Giả sử logic kiểm tra đã đăng nhập được thực hiện ở đây
    const checkLoginStatus = () => {
      // Đây là một ví dụ, bạn cần thay thế bằng logic thực tế của bạn
      const userLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(userLoggedIn);
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    // Nếu đã đăng nhập, chuyển hướng đến dashboard
    if (isLoggedIn) {
      router.push("/admin/dashboard");
    } else {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      router.push("/admin/login");
    }
  }, [isLoggedIn, router]);

  return <div className="pt-8">DASHBOARD</div>;
};

export default Admin;
