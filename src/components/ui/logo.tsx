import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-mono text-[14px] font-bold tracking-[0.10em] text-foreground select-none',
        className,
      )}
    >
      KURIO
    </span>
  );
}