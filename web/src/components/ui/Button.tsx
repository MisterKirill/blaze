import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isGhost?: boolean;
}

export default function Button({ children, isGhost = false, className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        className,
        "rounded-lg px-5 py-3 font-semibold text-sm disabled:opacity-80",
        isGhost ? "hover:bg-slate-800" : "bg-blue-500 hover:bg-blue-600"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
