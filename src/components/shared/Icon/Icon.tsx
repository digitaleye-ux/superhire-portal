import { forwardRef } from "react";
import type { CSSProperties, ComponentType } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BookmarkX,
  BriefcaseBusiness,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  CircleHelp,
  Download,
  ExternalLink,
  Eye,
  File,
  FileText,
  HandCoins,
  IndianRupee,
  Link,
  Link2,
  Mail,
  MapPin,
  MoreVertical,
  Pause,
  Search,
  Sparkles,
  Upload,
  UsersRound,
  X,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { IconBaseProps, IconName, IconProps, IconSize } from "./Icon.types";
import linkedinImg from "@/components/recruiter/CandidateCard/assets/linkedin.png";
import githubImg from "@/components/recruiter/CandidateCard/assets/github.png";
import styles from "./Icon.module.css";

/** Design token icon sizes mapped to pixels */
export const ICON_SIZE_PX: Record<"xs" | "sm" | "md" | "lg", number> = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
};

export function resolveIconSize(size: IconSize = "md"): number {
  if (typeof size === "number") return size;
  return ICON_SIZE_PX[size] ?? 20;
}

/** Helper to wrap a Lucide icon with design system IconBaseProps and size token resolution */
function createIconComponent(
  LucideComponent: ComponentType<LucideProps>,
  displayName: string
) {
  const Comp = forwardRef<SVGSVGElement, IconBaseProps>(function SvgIcon(
    {
      size = "md",
      color = "currentColor",
      strokeWidth = 2,
      label,
      className,
      style,
      onClick,
      ...rest
    },
    ref
  ) {
    const px = resolveIconSize(size);
    return (
      <LucideComponent
        ref={ref}
        size={px}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        style={style}
        onClick={onClick}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? "img" : undefined}
        {...rest}
      />
    );
  });
  Comp.displayName = displayName;
  return Comp;
}

/* -------------------------------------------------------------------------- */
/* Design System Icons (Proper Design System Naming Convention: <Name>Icon)   */
/* -------------------------------------------------------------------------- */

export const ArrowLeftIcon = createIconComponent(ArrowLeft, "ArrowLeftIcon");
export const ArrowRightIcon = createIconComponent(ArrowRight, "ArrowRightIcon");
export const ArrowUpRightIcon = createIconComponent(ArrowUpRight, "ArrowUpRightIcon");
export const BookOpenIcon = createIconComponent(BookOpen, "BookOpenIcon");
export const BookmarkXIcon = createIconComponent(BookmarkX, "BookmarkXIcon");
export const BriefcaseBusinessIcon = createIconComponent(BriefcaseBusiness, "BriefcaseBusinessIcon");
export const CheckIcon = createIconComponent(Check, "CheckIcon");
export const ChevronDownIcon = createIconComponent(ChevronDown, "ChevronDownIcon");
export const ChevronUpIcon = createIconComponent(ChevronUp, "ChevronUpIcon");
export const CircleCheckBigIcon = createIconComponent(CircleCheckBig, "CircleCheckBigIcon");
export const CircleHelpIcon = createIconComponent(CircleHelp, "CircleHelpIcon");
export const DownloadIcon = createIconComponent(Download, "DownloadIcon");
export const ExternalLinkIcon = createIconComponent(ExternalLink, "ExternalLinkIcon");
export const EyeIcon = createIconComponent(Eye, "EyeIcon");
export const FileIcon = createIconComponent(File, "FileIcon");
export const FileTextIcon = createIconComponent(FileText, "FileTextIcon");
export const HandCoinsIcon = createIconComponent(HandCoins, "HandCoinsIcon");
export const IndianRupeeIcon = createIconComponent(IndianRupee, "IndianRupeeIcon");
export const LinkIcon = createIconComponent(Link, "LinkIcon");
export const Link2Icon = createIconComponent(Link2, "Link2Icon");
export const MailIcon = createIconComponent(Mail, "MailIcon");
export const MapPinIcon = createIconComponent(MapPin, "MapPinIcon");
export const MoreVerticalIcon = createIconComponent(MoreVertical, "MoreVerticalIcon");
export const PauseIcon = createIconComponent(Pause, "PauseIcon");
export const SearchIcon = createIconComponent(Search, "SearchIcon");
export const SparklesIcon = createIconComponent(Sparkles, "SparklesIcon");
export const UploadIcon = createIconComponent(Upload, "UploadIcon");
export const UsersRoundIcon = createIconComponent(UsersRound, "UsersRoundIcon");
export const XIcon = createIconComponent(X, "XIcon");

/** Official LinkedIn brand icon */
export const LinkedinIcon = forwardRef<HTMLImageElement, IconBaseProps>(
  function LinkedinIcon(
    { size = "md", label, className, style, onClick, ...rest },
    ref
  ) {
    const px = resolveIconSize(size);
    return (
      <img
        ref={ref}
        src={linkedinImg}
        alt={label ?? ""}
        width={px}
        height={px}
        className={[styles.brandIcon, className].filter(Boolean).join(" ")}
        style={{ width: px, height: px, ...style }}
        onClick={onClick}
        aria-hidden={label ? undefined : true}
        role={label ? "img" : undefined}
        {...rest}
      />
    );
  }
);
LinkedinIcon.displayName = "LinkedinIcon";

/** Official GitHub brand icon */
export const GithubIcon = forwardRef<HTMLImageElement, IconBaseProps>(
  function GithubIcon(
    { size = "md", label, className, style, onClick, ...rest },
    ref
  ) {
    const px = resolveIconSize(size);
    return (
      <img
        ref={ref}
        src={githubImg}
        alt={label ?? "GitHub"}
        width={px}
        height={px}
        className={[styles.brandIcon, className].filter(Boolean).join(" ")}
        style={{ width: px, height: px, ...style }}
        onClick={onClick}
        aria-hidden={label ? undefined : true}
        role={label ? "img" : undefined}
        {...rest}
      />
    );
  }
);
GithubIcon.displayName = "GithubIcon";

/* Semantic & Ergonomic Aliases */
export const BriefcaseIcon = BriefcaseBusinessIcon;
export const RupeeIcon = IndianRupeeIcon;
export const LocationIcon = MapPinIcon;
export const CommissionIcon = HandCoinsIcon;
export const ResumeIcon = EyeIcon;
export const CloseIcon = XIcon;
export const UnclaimIcon = BookmarkXIcon;
export const CircleCheckIcon = CircleCheckBigIcon;
export const UsersIcon = UsersRoundIcon;
export const HelpCircleIcon = CircleHelpIcon;

/* -------------------------------------------------------------------------- */
/* Icon Registry by Name                                                      */
/* -------------------------------------------------------------------------- */

export const ICON_REGISTRY: Record<IconName, ComponentType<IconBaseProps>> = {
  "arrow-left": ArrowLeftIcon,
  "arrow-right": ArrowRightIcon,
  "arrow-up-right": ArrowUpRightIcon,
  "book-open": BookOpenIcon,
  "bookmark-x": BookmarkXIcon,
  "briefcase": BriefcaseBusinessIcon,
  "briefcase-business": BriefcaseBusinessIcon,
  "check": CheckIcon,
  "chevron-down": ChevronDownIcon,
  "chevron-up": ChevronUpIcon,
  "circle-check": CircleCheckBigIcon,
  "circle-check-big": CircleCheckBigIcon,
  "circle-help": CircleHelpIcon,
  "close": XIcon,
  "commission": HandCoinsIcon,
  "download": DownloadIcon,
  "external-link": ExternalLinkIcon,
  "eye": EyeIcon,
  "file": FileIcon,
  "file-text": FileTextIcon,
  "github": GithubIcon,
  "hand-coins": HandCoinsIcon,
  "help": CircleHelpIcon,
  "indian-rupee": IndianRupeeIcon,
  "link": LinkIcon,
  "link-2": Link2Icon,
  "linkedin": LinkedinIcon,
  "location": MapPinIcon,
  "mail": MailIcon,
  "map-pin": MapPinIcon,
  "more-vertical": MoreVerticalIcon,
  "pause": PauseIcon,
  "resume": Link2Icon,
  "rupee": IndianRupeeIcon,
  "search": SearchIcon,
  "sparkles": SparklesIcon,
  "unclaim": BookmarkXIcon,
  "upload": UploadIcon,
  "users": UsersRoundIcon,
  "users-round": UsersRoundIcon,
  "x": XIcon,
};

/* -------------------------------------------------------------------------- */
/* Polymorphic Design System <Icon /> Component                               */
/* -------------------------------------------------------------------------- */

/**
 * Design System Icon Component.
 *
 * Usage:
 *  - `<Icon name="briefcase" size="sm" />`
 *  - `<Icon icon={BriefcaseBusiness} size={16} />`
 *  - `<Icon src="/path/to/legacy.svg" size="md" />`
 *  - Or direct named exports: `<BriefcaseBusinessIcon size="sm" />`
 */
export const Icon = forwardRef<HTMLElement, IconProps>(function Icon(
  { name, icon: CustomIcon, src, size = "md", color, strokeWidth = 2, label, className, style, onClick, ...rest },
  ref
) {
  const px = resolveIconSize(size);

  // 1. Explicit Lucide or React SVG component
  if (CustomIcon) {
    const Component = CustomIcon;
    return (
      <Component
        ref={ref as any}
        size={px}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        style={style}
        onClick={onClick as any}
        aria-hidden={label ? undefined : true}
        aria-label={label}
        role={label ? "img" : undefined}
        {...rest}
      />
    );
  }

  // 2. Named design system icon
  if (name && ICON_REGISTRY[name]) {
    const Component = ICON_REGISTRY[name];
    return (
      <Component
        size={px}
        color={color}
        strokeWidth={strokeWidth}
        label={label}
        className={className}
        style={style}
        onClick={onClick as any}
        {...rest}
      />
    );
  }

  // 3. Backward-compatible CSS mask for legacy SVG URLs
  if (src) {
    const maskUrl = `url("${src.replace(/"/g, "%22")}")`;
    const maskStyle: CSSProperties = {
      width: px,
      height: px,
      maskImage: maskUrl,
      WebkitMaskImage: maskUrl,
      ...style,
    };
    return (
      <span
        ref={ref as any}
        className={[styles.icon, className].filter(Boolean).join(" ")}
        style={maskStyle}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        onClick={onClick as any}
        {...rest}
      />
    );
  }

  return null;
});

Icon.displayName = "Icon";

/** Grouped design system icons namespace */
export const Icons = {
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  ArrowUpRight: ArrowUpRightIcon,
  BookOpen: BookOpenIcon,
  BookmarkX: BookmarkXIcon,
  Briefcase: BriefcaseBusinessIcon,
  BriefcaseBusiness: BriefcaseBusinessIcon,
  Check: CheckIcon,
  ChevronDown: ChevronDownIcon,
  ChevronUp: ChevronUpIcon,
  CircleCheck: CircleCheckBigIcon,
  CircleCheckBig: CircleCheckBigIcon,
  CircleHelp: CircleHelpIcon,
  Close: XIcon,
  Commission: HandCoinsIcon,
  Download: DownloadIcon,
  ExternalLink: ExternalLinkIcon,
  File: FileIcon,
  FileText: FileTextIcon,
  Github: GithubIcon,
  HandCoins: HandCoinsIcon,
  Help: CircleHelpIcon,
  IndianRupee: IndianRupeeIcon,
  Link: LinkIcon,
  Link2: Link2Icon,
  Linkedin: LinkedinIcon,
  Location: MapPinIcon,
  Mail: MailIcon,
  MapPin: MapPinIcon,
  MoreVertical: MoreVerticalIcon,
  Pause: PauseIcon,
  Resume: Link2Icon,
  Rupee: IndianRupeeIcon,
  Search: SearchIcon,
  Sparkles: SparklesIcon,
  Unclaim: BookmarkXIcon,
  Upload: UploadIcon,
  Users: UsersRoundIcon,
  UsersRound: UsersRoundIcon,
  X: XIcon,
};

export default Icon;
