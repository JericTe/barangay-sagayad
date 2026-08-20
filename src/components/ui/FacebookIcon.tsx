export function FacebookIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.6 9.2h1.6V6.9h-1.9c-1.6 0-2.7 1.1-2.7 2.8v1.3H9v2.3h1.6V17h2.3v-3.7h1.7l.3-2.3h-2V9.9c0-.4.2-.7.7-.7Z"
        fill="currentColor"
      />
    </svg>
  );
}
