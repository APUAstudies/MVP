export const NOTEBOOK_MAIN_ID = "default-lobby";

export const INITIAL_NOTEBOOK_CONTENT = [
  {
    id: "row-header",
    columns: [
      {
        id: "col-header",
        width: 100,
        blocks: [
          {
            id: "b-title",
            type: "text",
            data: { text: "<h1 style='font-size: 2.5rem; font-weight: 800; margin-bottom: 0.5rem;'>Main Workspace</h1><p style='color: rgba(255,255,255,0.5)'>Welcome to your centralized study hub. Organize your thoughts and tasks here.</p>" }
          }
        ]
      }
    ]
  },
  {
    id: "row-content",
    columns: [
      {
        id: "col-left",
        width: 60,
        blocks: [
          {
            id: "b-intro",
            type: "callout",
            colorProps: { bg: "bg-blue-500/10" },
            data: { text: "<h3>Quick Tip</h3><p>Press <b>'/'</b> anywhere to swap block types or add new widgets like timers and videos.</p>" }
          },
          {
            id: "b-todo-header",
            type: "text",
            data: { text: "<h2 style='margin-top: 1.5rem;'>Current Focus</h2>" }
          },
          { id: "b-todo-list", type: "todo", data: {} }
        ]
      },
      {
        id: "col-right",
        width: 40,
        blocks: [
          {
            id: "b-timer-card",
            type: "text",
            colorProps: { text: "text-blue-400" },
            data: { text: "<h4>Session Timer</h4>" }
          },
          { id: "b-timer", type: "timer", data: {} },
          {
            id: "b-resources",
            type: "callout",
            colorProps: { bg: "bg-white/5" },
            data: { text: "<h4>Resources</h4><p>Check the 'Help & Guide' in the sidebar for more info.</p>" }
          }
        ]
      }
    ]
  }
];