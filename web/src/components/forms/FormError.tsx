export default function FormError({ children }: { children?: string }) {
  return (
    <span className="font-semibold text-xs mb-1 text-red-400">
      {children}
    </span>
  )
}
