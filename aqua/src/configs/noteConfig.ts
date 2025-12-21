export const NOTEBOOK_MAIN_ID = "default-lobby";

export const INITIAL_NOTEBOOK_CONTENT = [
  { 
    id: "row-1", 
    columns: [
      { 
        id: "c1", 
        width: 100, 
        blocks: [
          { 
            id: "b1", 
            type: "text",
            data: { text: "<h1>Welcome to your Notebook</h1>" } 
          },
          { 
            id: "b2", 
            type: "callout", 
            data: { text: "This is your main dashboard. You can edit this page just like any other!" } 
          }
        ] 
      }
    ] 
  }
];