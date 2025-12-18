export interface ToolItem {
  id: string;
  title: string;
  description: string;
  link: string;
  category: "Learning" | "Notion" | "Productivity";
  isPopular?: boolean;
}

export const chromeExtensions: ToolItem[] = [
  { id: "e1", title: "Save to Notion", description: "Clip web articles directly into your Notion databases with custom properties.", link: "#", category: "Notion", isPopular: true },
  { id: "e2", title: "Notion Boost", description: "Adds a sticky outline, back-to-top button, and more to Notion pages.", link: "#", category: "Notion" },
  { id: "e3", title: "Dark Reader", description: "Enforces high-quality dark mode on every website you visit.", link: "#", category: "Productivity", isPopular: true },
  { id: "e4", title: "Forest", description: "Stay focused by planting virtual trees that grow while you work.", link: "#", category: "Productivity" },
  { id: "e5", title: "Simplenote", description: "The easiest way to keep notes across all your devices.", link: "#", category: "Productivity" },
  { id: "e6", title: "Grammarly", description: "AI-powered writing assistant for better essays and emails.", link: "#", category: "Learning", isPopular: true },
  { id: "e7", title: "Language Reactor", description: "Learn languages while watching Netflix or YouTube with dual subtitles.", link: "#", category: "Learning" },
  { id: "e8", title: "Speechify", description: "Turns any text into a natural-sounding voice for listening on the go.", link: "#", category: "Learning" },
  { id: "e9", title: "Mochi", description: "Create flashcards using markdown and sync them to your Notion.", link: "#", category: "Learning" },
  { id: "e10", title: "Clockify", description: "Track how much time you spend on specific study modules.", link: "#", category: "Productivity" },
  { id: "e11", title: "TabbyCat", description: "Small tabs for focus; organizes your messy browser window.", link: "#", category: "Productivity" },
  { id: "e12", title: "Motion", description: "AI that builds your schedule based on your to-do list.", link: "#", category: "Productivity" },
  { id: "e13", title: "Workona", description: "Organize your tabs into workspaces to avoid context switching.", link: "#", category: "Productivity" },
  { id: "e14", title: "Toggl Track", description: "One-click time tracking inside 100+ web tools.", link: "#", category: "Productivity" },
  { id: "e15", title: "StayFocusd", description: "Restricts the amount of time you can spend on time-wasting websites.", link: "#", category: "Productivity" },
  { id: "e16", title: "Unhook", description: "Removes YouTube recommendations and comments to stop the scroll.", link: "#", category: "Learning", isPopular: true },
  { id: "e17", title: "Scribe", description: "Auto-generates step-by-step guides by watching you work.", link: "#", category: "Productivity" },
  { id: "e18", title: "Readwise", description: "Syncs your Kindle and web highlights into Notion automatically.", link: "#", category: "Notion" },
  { id: "e19", title: "Loom", description: "Record your screen and camera to explain complex topics fast.", link: "#", category: "Productivity" },
  { id: "e20", title: "Heptabase", description: "Visual note-taking tool that helps you make sense of complex topics.", link: "#", category: "Learning" },
];

export const usefulWebsites: ToolItem[] = [
  { id: "w1", title: "Notion.so", description: "The all-in-one workspace for your notes and tasks.", link: "https://notion.so", category: "Notion", isPopular: true },
  { id: "w2", title: "Khan Academy", description: "Free world-class education for anyone, anywhere.", link: "https://khanacademy.org", category: "Learning", isPopular: true },
  { id: "w3", title: "Coursera", description: "Take courses from top universities like Yale and Stanford.", link: "https://coursera.org", category: "Learning" },
  { id: "w4", title: "AnkiWeb", description: "Powerful, intelligent flashcards based on spaced repetition.", link: "https://apps.ankiweb.net", category: "Learning" },
  { id: "w5", title: "Wolfram Alpha", description: "Computational intelligence for complex math and science.", link: "https://wolframalpha.com", category: "Learning" },
  { id: "w6", title: "Pomofocus", description: "A simple, customizable Pomodoro timer for your browser.", link: "#", category: "Productivity" },
  { id: "w7", title: "Brainly", description: "Social learning community where students help each other.", link: "#", category: "Learning" },
  { id: "w8", title: "Quizlet", description: "The easiest way to practice and master what you’re learning.", link: "#", category: "Learning" },
  { id: "w9", title: "Indify", description: "The best custom widgets for your Notion dashboards.", link: "#", category: "Notion" },
  { id: "w10", title: "Apption", description: "A directory of embeddable widgets for Notion.", link: "#", category: "Notion" },
  { id: "w11", title: "Thomas Frank", description: "High-quality study advice and productivity systems.", link: "#", category: "Learning" },
  { id: "w12", title: "Z-Library", description: "The world's largest ebook library.", link: "#", category: "Learning" },
  { id: "w13", title: "Habitica", description: "Gamify your life by turning your tasks into a role-playing game.", link: "#", category: "Productivity" },
  { id: "w14", title: "MindMeister", description: "Collaborative online mind mapping for brainstorming.", link: "#", category: "Learning" },
  { id: "w15", title: "Focusmate", description: "Virtual coworking to keep you accountable with a partner.", link: "#", category: "Productivity", isPopular: true },
  { id: "w16", title: "Standard Notes", description: "End-to-end encrypted notes for the security-conscious.", link: "#", category: "Productivity" },
  { id: "w17", title: "Trello", description: "Visual boards to manage your projects and study schedule.", link: "#", category: "Productivity" },
  { id: "w18", title: "Reduct.video", description: "Summarize and search long video lectures quickly.", link: "#", category: "Learning" },
  { id: "w19", title: "Notion Ery", description: "Templates and guides for advanced Notion setups.", link: "#", category: "Notion" },
  { id: "w20", title: "Super.so", description: "Turn your Notion pages into fast, SEO-friendly websites.", link: "#", category: "Notion" },
];