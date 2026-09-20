import { icon } from "@/lib/icons";

export default function Icon({ name, className = "", size = 24 }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon(name) }} />
  );
}
