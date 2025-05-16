import type React from "react"
import { DotIcon as DashboardIcon, UsersIcon, ActivityIcon } from "lucide-react"

interface SidebarItem {
  title: string
  url: string
  icon: React.ComponentType
}

const sidebarItems: SidebarItem[] = [
  {
    title: "대시보드",
    url: "/",
    icon: DashboardIcon,
  },
  {
    title: "사용자 관리",
    url: "/users",
    icon: UsersIcon,
  },
  {
    title: "사용자 활동 로그",
    url: "/user-audit",
    icon: ActivityIcon,
  },
]

const AppSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <ul>
        {sidebarItems.map((item) => (
          <li key={item.title} className="mb-2">
            <a href={item.url} className="flex items-center text-gray-700 hover:text-blue-500">
              <item.icon className="mr-2 w-4 h-4" />
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AppSidebar
