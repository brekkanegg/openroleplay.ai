export default function TextLogo({ className }: { className?: string }) {
  return (
    <span
      className={`flex items-center font-medium ${className} hover:opacity-50`}
    >
      openroleplay.ai
    </span>
  );
}
