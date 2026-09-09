import { useTranslations } from "next-intl";

export default function AnnouncementBar() {
  const t = useTranslations("AnnouncementBar");
  return (
    <div className="bg-primary-dark py-2 text-center text-xs font-medium uppercase tracking-wide text-background">
      {t("message")}
    </div>
  );
}
