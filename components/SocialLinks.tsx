import { SOCIALS } from "@/content/site";
import { cn } from "@/lib/utils";
import { InstagramIcon, TikTokIcon } from "./icons";

const ICONS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

/** Row of social profile links. Presentational; data comes from SOCIALS in content/site. */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {SOCIALS.map((sN) => {
        const Icon = ICONS[sN.platform];
        if (!Icon) return null;
        return (
          <a
            key={sN.platform}
            href={sN.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Goya na ${sN.label}`}
            className="grid h-9 w-9 place-items-center rounded-full border border-ink/12 text-ink-soft transition hover:border-ink hover:bg-ink hover:text-paper"
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
