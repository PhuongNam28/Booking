// pages/login.tsx
"use client";
import React, { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AvatarGenerator } from "random-avatar-generator";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const router = useRouter();

  const generateRandomAvatar = () => {
    const generator = new AvatarGenerator();
    return generator.generateRandomAvatar();
  };

  useEffect(() => {
    setAvatarUrl(generateRandomAvatar());
  }, []);

  const handleRefreshAvatar = () => {
    setAvatarUrl(generateRandomAvatar());
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name) newErrors.name = "Name is required";
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email address is invalid";
    }
    if (!password) newErrors.password = "Password is required";
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    try {
      // Your authentication logic here
      console.log("Form submitted successfully");
      // After successful registration, redirect to the login page
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        name,
        email,
        avatarUrl,
      });

      router.push("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen p-10 m-2">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-2xl shadow-lg p-10"
      >
        <h1 className="text-xl text-center font-semibold text-[#0b3a65ff]">
          Chat <span className="font-bold text-[#eeab63ff]"> Chat</span>
        </h1>

        <div className="flex items-center space-y-2 justify-between border border-gray-200 p-2">
          <Image
            src={avatarUrl}
            className="rounded-full"
            width={50}
            height={50}
            alt="avatar"
          />

          <Button onClick={handleRefreshAvatar} type="button">
            New avatar
          </Button>
        </div>

        <div className="mt-4">
          <Label>Name</Label>
          <Input
            type="text"
            placeholder="Enter your name"
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mt-4">
          <Label>Email</Label>
          <Input
            type="text"
            placeholder="Enter your email"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mt-4">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Enter your Password"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>

        <div className="mt-4">
          <Label>Confirm Password</Label>
          <Input
            type="password"
            placeholder="Comfirm your password"
            className="w-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <Button className="mt-4">
            {loading ? <span></span> : "Register"}
          </Button>
        </div>

        <span>Already have an Account?{""}</span>
        <Link href="/login" className="text-blue-600 mt-4">
          Login
        </Link>
      </form>
    </div>
  );
}
