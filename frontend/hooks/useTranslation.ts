"use client";

import { useLocaleStore } from "@/stores/localeStore";
import { t } from "@/lib/i18n";

export function useTranslation() {
  const locale = useLocaleStore((s) => s.locale);
  return {
    locale,
    t: (key: string) => t(locale, key),
  };
}