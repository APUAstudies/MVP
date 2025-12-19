export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  indent: number; // 0 = main level, 1 = indented once, etc.
  parentId?: string; // Optional: if you want to link sub-tasks to parents
}

export type BlockType = 'callout' | 'text' | 'todo' | 'toggle' | 'video' | 'image' | 'embed' | 'timer';

export interface LobbyBlock {
  id: string;
  type: BlockType;
  content: any; // Stores the specific data for that widget
  width: string; // e.g., 'col-span-4'
}