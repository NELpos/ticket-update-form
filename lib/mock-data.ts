import type { ChatRoom, Message, User } from "./types"

export const mockUsers: User[] = [
  {
    id: "user-001",
    name: "김민준",
    email: "minjun.kim@example.com",
    avatar: "MK",
  },
  {
    id: "user-002",
    name: "이지은",
    email: "jieun.lee@example.com",
    avatar: "JL",
  },
  {
    id: "user-003",
    name: "박서준",
    email: "seojun.park@example.com",
    avatar: "SP",
  },
  {
    id: "user-004",
    name: "최수아",
    email: "sua.choi@example.com",
    avatar: "SC",
  },
]

export const mockChatRooms: ChatRoom[] = [
  {
    id: "chat-001",
    title: "날씨 문의 대화",
    lastActivity: "2025-05-10T15:30:00Z",
    messageCount: 8,
    userId: "user-001",
  },
  {
    id: "chat-002",
    title: "제품 추천 상담",
    lastActivity: "2025-05-11T09:45:00Z",
    messageCount: 12,
    userId: "user-002",
  },
  {
    id: "chat-003",
    title: "기술 지원 문의",
    lastActivity: "2025-05-11T14:20:00Z",
    messageCount: 15,
    userId: "user-003",
  },
  {
    id: "chat-004",
    title: "계정 설정 도움",
    lastActivity: "2025-05-09T11:15:00Z",
    messageCount: 6,
    userId: "user-001",
  },
  {
    id: "chat-005",
    title: "여행 계획 상담",
    lastActivity: "2025-05-08T16:40:00Z",
    messageCount: 20,
    userId: "user-004",
  },
  {
    id: "chat-006",
    title: "식단 추천 문의",
    lastActivity: "2025-05-07T13:25:00Z",
    messageCount: 9,
    userId: "user-002",
  },
  {
    id: "chat-007",
    title: "영화 추천 대화",
    lastActivity: "2025-05-06T19:10:00Z",
    messageCount: 14,
    userId: "user-003",
  },
  {
    id: "chat-008",
    title: "쇼핑 도움 요청",
    lastActivity: "2025-05-05T10:50:00Z",
    messageCount: 7,
    userId: "user-004",
  },
]

export const mockMessages: Message[] = [
  // Chat 001 - 날씨 문의 대화
  {
    chatId: "chat-001",
    messageId: "msg-001-1",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "오늘 서울 날씨는 어때요?",
    }),
    timestamp: "2025-05-10T15:30:00Z",
  },
  {
    chatId: "chat-001",
    messageId: "msg-001-2",
    role: "AI",
    content: JSON.stringify({
      type: "text",
      content: "서울의 현재 날씨는 맑고 기온은 22°C입니다. 오후에는 약간의 구름이 끼고 최고 기온은 25°C로 예상됩니다.",
    }),
    timestamp: "2025-05-10T15:30:30Z",
  },
  {
    chatId: "chat-001",
    messageId: "msg-001-3",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "내일은 비가 올까요?",
    }),
    timestamp: "2025-05-10T15:31:00Z",
  },
  {
    chatId: "chat-001",
    messageId: "msg-001-4",
    role: "AI",
    content: JSON.stringify({
      type: "text",
      content: "내일 서울에는 오전에 가벼운 비가 내릴 확률이 60%입니다. 오후에는 맑아질 것으로 예상됩니다.",
    }),
    timestamp: "2025-05-10T15:31:30Z",
  },
  {
    chatId: "chat-001",
    messageId: "msg-001-5",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "우산을 가져가야 할까요?",
    }),
    timestamp: "2025-05-10T15:32:00Z",
  },
  {
    chatId: "chat-001",
    messageId: "msg-001-6",
    role: "AI",
    content: JSON.stringify({
      type: "text",
      content: "네, 내일 오전에 비가 예상되므로 우산을 가져가시는 것이 좋겠습니다.",
    }),
    timestamp: "2025-05-10T15:32:30Z",
  },
  {
    chatId: "chat-001",
    messageId: "msg-001-7",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "이번 주말 날씨는 어떨까요?",
    }),
    timestamp: "2025-05-10T15:33:00Z",
  },
  {
    chatId: "chat-001",
    messageId: "msg-001-8",
    role: "AI",
    content: JSON.stringify({
      type: "text",
      content:
        "이번 주말은 토요일에는 맑고 기온은 23-27°C, 일요일에는 구름이 많고 기온은 21-25°C로 예상됩니다. 야외 활동하기 좋은 날씨가 될 것 같습니다.",
    }),
    timestamp: "2025-05-10T15:33:30Z",
  },

  // Chat 002 - 제품 추천 상담
  {
    chatId: "chat-002",
    messageId: "msg-002-1",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "노트북을 새로 구매하려고 하는데 추천해주세요.",
    }),
    timestamp: "2025-05-11T09:45:00Z",
  },
  {
    chatId: "chat-002",
    messageId: "msg-002-2",
    role: "AI",
    content: JSON.stringify({
      type: "text",
      content:
        "노트북 추천을 위해 몇 가지 정보가 필요합니다. 주로 어떤 용도로 사용하실 계획인가요? (업무, 게임, 디자인 등) 그리고 예산 범위는 어떻게 되나요?",
    }),
    timestamp: "2025-05-11T09:45:30Z",
  },
  {
    chatId: "chat-002",
    messageId: "msg-002-3",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "주로 프로그래밍과 가끔 영상 편집에 사용할 예정이에요. 예산은 200만원 정도로 생각하고 있어요.",
    }),
    timestamp: "2025-05-11T09:46:00Z",
  },
  {
    chatId: "chat-002",
    messageId: "msg-002-4",
    role: "AI",
    content: JSON.stringify({
      type: "product_recommendation",
      content: JSON.stringify([
        {
          name: "MacBook Pro 14인치",
          price: "2,190,000원",
          specs: "M2 Pro, 16GB RAM, 512GB SSD",
          pros: "뛰어난 성능, 긴 배터리 수명, 고품질 디스플레이",
          cons: "포트 제한, 높은 가격",
        },
        {
          name: "Dell XPS 15",
          price: "1,890,000원",
          specs: "Intel i7, 16GB RAM, 512GB SSD, RTX 3050",
          pros: "강력한 성능, 고품질 디스플레이, 다양한 포트",
          cons: "배터리 수명이 MacBook보다 짧음",
        },
        {
          name: "ASUS ProArt StudioBook 16",
          price: "2,050,000원",
          specs: "AMD Ryzen 9, 32GB RAM, 1TB SSD, RTX 3070",
          pros: "최고 성능, 넓은 디스플레이, 다이얼 컨트롤러",
          cons: "무게가 다소 무거움",
        },
      ]),
    }),
    timestamp: "2025-05-11T09:46:30Z",
  },
  {
    chatId: "chat-002",
    messageId: "msg-002-5",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "Dell XPS 15에 대해 더 자세히 알려주세요.",
    }),
    timestamp: "2025-05-11T09:47:00Z",
  },
  {
    chatId: "chat-002",
    messageId: "msg-002-6",
    role: "AI",
    content: JSON.stringify({
      type: "product_detail",
      content: JSON.stringify({
        name: "Dell XPS 15",
        model: "9520",
        price: "1,890,000원",
        specs: {
          processor: "Intel Core i7-12700H",
          ram: "16GB DDR5",
          storage: "512GB PCIe NVMe SSD",
          graphics: "NVIDIA GeForce RTX 3050 4GB",
          display: "15.6인치 FHD+ (1920 x 1200) InfinityEdge 디스플레이",
          battery: "86Whr",
          weight: "1.92kg",
          ports: ["Thunderbolt 4 x2", "USB-C 3.2", "SD 카드 리더", "3.5mm 헤드폰 잭"],
        },
        pros: [
          "알루미늄 바디로 견고하고 프리미엄 디자인",
          "뛰어난 디스플레이 품질과 색 정확도",
          "프로그래밍과 영상 편집에 충분한 성능",
          "좋은 키보드와 트랙패드",
        ],
        cons: ["발열이 다소 있을 수 있음", "배터리 수명은 약 7-8시간으로 MacBook보다 짧음", "업그레이드 옵션이 제한적"],
        reviews: {
          average: 4.5,
          count: 1245,
        },
      }),
    }),
    timestamp: "2025-05-11T09:47:30Z",
  },

  // Chat 003 - 기술 지원 문의 (일부만 구현)
  {
    chatId: "chat-003",
    messageId: "msg-003-1",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "앱이 자꾸 충돌하는데 어떻게 해결할 수 있을까요?",
    }),
    timestamp: "2025-05-11T14:20:00Z",
  },
  {
    chatId: "chat-003",
    messageId: "msg-003-2",
    role: "AI",
    content: JSON.stringify({
      type: "text",
      content:
        "앱 충돌 문제를 해결하기 위해 몇 가지 정보가 필요합니다. 어떤 기기와 운영체제를 사용 중이신가요? 그리고 어떤 앱에서 문제가 발생하고 있나요?",
    }),
    timestamp: "2025-05-11T14:20:30Z",
  },
  {
    chatId: "chat-003",
    messageId: "msg-003-3",
    role: "user",
    content: JSON.stringify({
      type: "text",
      content: "iPhone 13 Pro에서 iOS 16.5를 사용 중이고, 귀사의 쇼핑 앱에서 문제가 발생합니다.",
    }),
    timestamp: "2025-05-11T14:21:00Z",
  },
  {
    chatId: "chat-003",
    messageId: "msg-003-4",
    role: "AI",
    content: JSON.stringify({
      type: "troubleshooting_steps",
      content: JSON.stringify([
        {
          step: 1,
          action: "앱 강제 종료",
          description:
            "홈 화면에서 위로 스와이프하여 앱 전환 화면을 열고, 쇼핑 앱을 위로 스와이프하여 강제 종료합니다.",
        },
        {
          step: 2,
          action: "앱 재설치",
          description: "앱을 삭제한 후 App Store에서 다시 설치해보세요.",
        },
        {
          step: 3,
          action: "기기 재부팅",
          description: "iPhone을 완전히 종료한 후 다시 시작해보세요.",
        },
        {
          step: 4,
          action: "앱 업데이트 확인",
          description: "App Store에서 최신 버전으로 업데이트되었는지 확인하세요.",
        },
        {
          step: 5,
          action: "저장 공간 확인",
          description: "설정 > 일반 > iPhone 저장 공간에서 충분한 공간이 있는지 확인하세요.",
        },
      ]),
    }),
    timestamp: "2025-05-11T14:21:30Z",
  },
]
