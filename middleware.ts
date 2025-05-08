import createMiddleware from "next-intl/middleware"

export default createMiddleware({
  // 사용 가능한 언어 목록
  locales: ["en", "ko"],

  // 기본 언어
  defaultLocale: "ko",

  // 사용자의 로케일이 없는 경우 기본 로케일로 리디렉션
  localeDetection: true,

  // 현재 경로에 로케일 접두사를 붙임
  // /tickets -> /ko/tickets
  localePrefix: "always",
})

export const config = {
  // 모든 경로에 미들웨어 적용
  matcher: ["/((?!api|_next|.*\\..*).*)"],
}
