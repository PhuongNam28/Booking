"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib";
import { ADMIN_API_ROUTES } from "@/ultis";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await apiClient.post(ADMIN_API_ROUTES.LOGIN, {
        email,
        password,
      });

      if (response.data.userInfo) {
        // Người dùng đã đăng nhập thành công, chuyển hướng đến trang Dashboard hoặc trang khác tùy thuộc vào logic của bạn
        router.push("/admin/dashboard");
      } else {
        // Xử lý trường hợp người dùng không đăng nhập thành công
        console.log("Đăng nhập không thành công. Vui lòng thử lại!");
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Lỗi khi đăng nhập:", error);
    }
  };

  return (
    <div
      className="h-screen w-full flex items-center justify-center bg-cover bg-no-repeat"
      style={{ backgroundImage: 'url("/home/home-bg.png")' }}
    >
      <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-2xl">
        <Card className="shadow-2xl bg-opacity-20 w-80">
          <CardHeader className="flex flex-col gap-4 capitalize text-3xl items-center">
            <div className="flex flex-col gap-1 items-center">
              <Image
                src="/logo.png"
                alt="logo"
                width={80}
                height={80}
                className="cursor-pointer"
              />
              <div className="text-xl uppercase font-medium italic text-black">
                <span>Palm Tree Admin Login</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center w-full justify-center">
            <div className="flex flex-col gap-2 w-full mb-4">
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                color="blue"
              />
            </div>

            <div className="flex flex-col gap-2 w-full">
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                color="blue"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 items-center justify-center">
            <Button
              color="red"
              className="w-full capitalize"
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
