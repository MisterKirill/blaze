export default function FormError({ children }: { children?: string }) {
  return (
    <span className="font-semibold text-xs ml-1 mb-1 text-red-400">
      {children}
    </span>
  )
}
