import { InputHTMLAttributes } from "react";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`${className} px-4 py-3 font-medium text-sm bg-slate-800 rounded-lg w-full outline-none focus:ring-2 ring-blue-600`}
      {...props}
    />
  );
}
