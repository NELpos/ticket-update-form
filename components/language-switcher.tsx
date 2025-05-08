"use client"

import { useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Check, Globe } from "lucide-react"
import { useLocale } from "next-intl"

export function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const languages = [
    { code: "ko", name: "한국어" },
    { code: "en", name: "English" },
  ]

  const handleLanguageChange = (language: string) => {
    if (language === locale) return

    startTransition(() => {
      // 현재 경로에서 언어만 변경
      // /en/tickets -> /ko/tickets 또는 그 반대
      const newPathname = pathname.replace(`/${locale}`, `/${language}`)
      router.push(newPathname)
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full" disabled={isPending}>
          <Globe className="h-4 w-4" />
          <span className="sr-only">언어 변경</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="cursor-pointer flex items-center justify-between"
          >
            <span>{language.name}</span>
            {locale === language.code && <Check className="h-4 w-4 ml-2" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
