"use client";
import { useState } from "react";

export default function PasswordInput({ value, onChange }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        required
        value={value}
        onChange={onChange}
        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-10"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
      >
        {showPassword ? "🔒" : "👁️"}
      </button>
    </div>
  );
}
