import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`${className} px-5 py-3 font-semibold text-sm bg-blue-600 hover:bg-blue-700 rounded-lg`}
      {...props}
    >
      {children}
    </button>
  );
}
