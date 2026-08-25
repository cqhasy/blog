export type ProjectStatus = "持续迭代" | "开发中" | "学习项目";

export interface PortfolioProject {
	name: string;
	description: string;
	highlights: string[];
	tech: string[];
	status: ProjectStatus;
	repo: string;
	icon: string;
	featured?: boolean;
}

export const portfolioProjects: PortfolioProject[] = [
	{
		name: "AI PR Review",
		description:
			"面向真实代码仓库的 AI Pull Request 审查工具，不只读取 Diff，还会结合完整仓库上下文、依赖关系与团队规则进行多维度分析。",
		highlights: [
			"覆盖安全、逻辑、性能、测试、质量与架构等审查维度",
			"支持自定义规则、SARIF、PR 行级评论与 CI/CD 集成",
			"提供 React Web Dashboard 管理审查、规则与历史记录",
		],
		tech: ["Go", "React", "TypeScript", "Cobra", "Viper", "LLM"],
		status: "持续迭代",
		repo: "https://github.com/cqhasy/pr-review",
		icon: "material-symbols:rate-review-outline",
		featured: true,
	},
	{
		name: "Smart Pet",
		description:
			"以大模型为能力内核的智能桌宠实验项目，探索桌面交互、Agent 能力与本地应用之间的结合。",
		highlights: [
			"使用 Wails 构建跨平台桌面应用",
			"后端采用 Go，并按业务层次组织模块",
			"持续完善桌宠动画、交互与智能能力",
		],
		tech: ["Go", "Wails", "JavaScript", "LLM", "Desktop"],
		status: "开发中",
		repo: "https://github.com/cqhasy/smart-pet",
		icon: "material-symbols:pets",
		featured: true,
	},
	{
		name: "A2A Agent Demo",
		description:
			"围绕 Agent2Agent 协议构建的 Go 学习项目，包含天气 Agent Server 与终端交互 Client。",
		highlights: [
			"基于 a2a-go 实现 Agent 间通信",
			"使用 CloudWeGo Eino 编排 Agent 工作流",
			"接入 OpenAI 兼容模型并实践 gRPC 通信",
		],
		tech: ["Go", "A2A", "Eino", "gRPC", "OpenAI API"],
		status: "学习项目",
		repo: "https://github.com/cqhasy/a2a",
		icon: "material-symbols:hub-outline",
		featured: true,
	},
	{
		name: "Agent Pilot",
		description:
			"基于即时通讯场景的飞书智能协同助手，探索 AI Agent 在团队沟通与任务协作中的落地方式。",
		highlights: ["面向飞书 IM 协作场景", "使用 Go 构建轻量后端", "聚焦 Agent 驱动的协作体验"],
		tech: ["Go", "Feishu", "AI Agent", "IM Bot"],
		status: "开发中",
		repo: "https://github.com/cqhasy/agent-pilot",
		icon: "material-symbols:smart-toy-outline",
	},
	{
		name: "Muxi Clock",
		description:
			"面向命令行使用的任务与时间提醒工具，通过简洁指令创建待办并管理提醒。",
		highlights: ["Cobra 命令行交互", "任务创建与时间管理", "轻量、直接的本地工具体验"],
		tech: ["Go", "Cobra", "CLI"],
		status: "学习项目",
		repo: "https://github.com/cqhasy/muxi-clock",
		icon: "material-symbols:alarm-outline",
	},
	{
		name: "昊の月",
		description:
			"当前正在访问的个人博客，用于沉淀 Go、AI Agent、性能分析、可观测性与工程实践相关内容。",
		highlights: ["Astro 静态站点", "响应式布局与深浅色主题", "Markdown 内容管理与全文搜索"],
		tech: ["Astro", "TypeScript", "Tailwind CSS", "Pagefind"],
		status: "持续迭代",
		repo: "https://github.com/cqhasy/blog",
		icon: "material-symbols:article-outline",
	},
];

export interface SkillGroup {
	title: string;
	description: string;
	icon: string;
	accent: string;
	skills: {
		name: string;
		level: "主要方向" | "熟悉" | "持续实践";
		detail: string;
	}[];
}

export const skillGroups: SkillGroup[] = [
	{
		title: "Go 后端开发",
		description: "以 Go 为主力语言，关注清晰的领域边界、稳定的服务接口与可维护的工程结构。",
		icon: "material-symbols:deployed-code-outline",
		accent: "#00add8",
		skills: [
			{ name: "Go", level: "主要方向", detail: "服务端、CLI、并发与工程化开发" },
			{ name: "Web / RPC", level: "熟悉", detail: "REST、gRPC、Kratos、Gin" },
			{ name: "架构设计", level: "持续实践", detail: "DDD、分层架构、依赖注入" },
			{ name: "命令行工具", level: "熟悉", detail: "Cobra、Viper、配置与自动化" },
		],
	},
	{
		title: "AI Agent 与大模型应用",
		description: "围绕 Agent 通信、上下文获取、模型接入和开发者工具探索可落地的 AI 应用。",
		icon: "material-symbols:neurology-outline",
		accent: "#8b5cf6",
		skills: [
			{ name: "Agent 工程", level: "主要方向", detail: "工具调用、工作流、上下文工程" },
			{ name: "A2A / Eino", level: "持续实践", detail: "Agent2Agent 协议与工作流编排" },
			{ name: "模型接入", level: "熟悉", detail: "OpenAI 兼容 API、本地与云端模型" },
			{ name: "AI 开发工具", level: "持续实践", detail: "代码审查、规则引擎、智能协作" },
		],
	},
	{
		title: "数据与服务基础设施",
		description: "具备常见业务服务的数据持久化、缓存、鉴权与接口治理实践。",
		icon: "material-symbols:database-outline",
		accent: "#10b981",
		skills: [
			{ name: "MySQL / GORM", level: "熟悉", detail: "关系数据建模与持久化" },
			{ name: "Redis", level: "熟悉", detail: "缓存与服务状态管理" },
			{ name: "JWT / Auth", level: "持续实践", detail: "身份认证与接口权限" },
			{ name: "可观测性", level: "持续实践", detail: "性能分析、日志与链路追踪" },
		],
	},
	{
		title: "前端与桌面体验",
		description: "能够为后端与 AI 项目补齐可用的 Web Dashboard、博客和桌面交互界面。",
		icon: "material-symbols:devices-outline",
		accent: "#f97316",
		skills: [
			{ name: "TypeScript", level: "熟悉", detail: "类型化前端与工具开发" },
			{ name: "React / Vite", level: "持续实践", detail: "管理后台与单页应用" },
			{ name: "Astro / Tailwind", level: "熟悉", detail: "内容站点与响应式 UI" },
			{ name: "Wails", level: "持续实践", detail: "Go 驱动的跨平台桌面应用" },
		],
	},
	{
		title: "工程效率与协作",
		description: "重视可重复的开发流程、版本管理、自动化验证和团队协作。",
		icon: "material-symbols:construction",
		accent: "#eab308",
		skills: [
			{ name: "Git / GitHub", level: "熟悉", detail: "分支协作、PR 与代码审查" },
			{ name: "CI/CD", level: "持续实践", detail: "GitHub Actions、质量门禁" },
			{ name: "Docker / Linux", level: "持续实践", detail: "环境构建、部署与 Shell" },
			{ name: "测试与质量", level: "持续实践", detail: "单元测试、静态检查与规范" },
		],
	},
];
