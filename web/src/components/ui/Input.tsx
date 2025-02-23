import { InputHTMLAttributes } from "react";

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="rounded-lg px-5 py-3 font-semibold text-sm bg-slate-800 outline-none focus:outline-slate-600"
      {...props}
    />
  );
}
