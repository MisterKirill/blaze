import { ButtonHTMLAttributes } from "react";

export default function Button({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-600 rounded-lg px-6 py-3 font-semibold"
      {...props}
    >
      {children}
    </button>
  );
}
