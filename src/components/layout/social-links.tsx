import { AtSign, BriefcaseBusiness, Code2, GraduationCap, Mail, ScanFace } from "lucide-react";
import { t, type Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";

export function SocialLinks({ locale }: { locale: Locale }) {
  const labels = t(locale);
  return (
    <div className="social-links" aria-label={locale === "en" ? "Social profiles" : "社交主页"}>
      <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <Code2 aria-hidden="true" /><span>GitHub</span>
      </a>
      <a href={`mailto:${siteConfig.author.email}`} aria-label={labels.social.email}>
        <Mail aria-hidden="true" /><span>{labels.social.email}</span>
      </a>
      <span className="social-pending" aria-label={`Google Scholar · ${labels.social.soon}`} title={labels.social.soon}>
        <GraduationCap aria-hidden="true" /><span>{labels.social.scholar}</span>
      </span>
      <span className="social-pending" aria-label={`LinkedIn · ${labels.social.soon}`} title={labels.social.soon}>
        <BriefcaseBusiness aria-hidden="true" /><span>{labels.social.linkedin}</span>
      </span>
      <span className="social-pending" aria-label={`ORCID · ${labels.social.soon}`} title={labels.social.soon}>
        <ScanFace aria-hidden="true" /><span>{labels.social.orcid}</span>
      </span>
      <span className="social-pending" aria-label={`X · ${labels.social.soon}`} title={labels.social.soon}>
        <AtSign aria-hidden="true" /><span>{labels.social.x}</span>
      </span>
    </div>
  );
}
