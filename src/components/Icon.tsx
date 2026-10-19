import { icons, filledIcons, type IconName } from '@/lib/icons';

export default function Icon({ name, className = 'size-5' }: { name: IconName; className?: string }) {
  const filled = filledIcons.includes(name);
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={icons[name]} />
    </svg>
  );
}
