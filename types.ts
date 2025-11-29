
export type GameState = 'INTRO' | 'THESIS_SELECTION' | 'TITLE_DROP' | 'SCENE_INTRO' | 'SCENE_TASK' | 'SCENE_RESULT' | 'THERAPY_SESSION' | 'GAME_OVER_SANITY' | 'GAME_OVER_CAUGHT' | 'VICTORY';

export interface ThesisSceneData {
  taskPrompt: string;
  baseCleanText: string;
}

export interface ThesisOption {
  id: string;
  label: string;
  description: string;
  difficulty: 'EASY' | 'NORMAL' | 'HARD';
  cloutMultiplier: number;
  sanityPenalty: number; // Multiplier for sanity cost (e.g. 1.0 or 1.2)
  requiresUnlock?: boolean; // If true, hidden until game is won
  scenes: Record<string, ThesisSceneData>; // Key matches Scene ID
}

export interface SceneLog {
  source: 'SYSTEM' | 'DAEMON' | 'WORLD' | 'PLAYER';
  text: string;
}

export interface Scene {
  id: string;
  title: string;
  narrative: string;
  opponentName: string;
  opponentTitle: string;
  requiredSlopScore: number;
  openingLogs?: SceneLog[];
  // These are now optional as they might be overridden by the Thesis choice
  taskPrompt?: string; 
  baseCleanText?: string;
}

export interface Modifier {
  id: string;
  label: string;
  description: string;
  slopImpact: number; // + adds to Slop Score
  sanityCost: number; // - removes from Sanity
  type: 'EMOTION' | 'TRIBALISM' | 'INEFFICIENCY' | 'BRAINROT';
  promptInstruction: string; // Instruction for Gemini
}

export interface PlayerStats {
  sanity: number; // 0-100
  slopIntegrity: number; // 0-100 (Per task)
  clout: number;
}

export interface LogEntry {
  source: 'SYSTEM' | 'DAEMON' | 'WORLD' | 'PLAYER';
  text: string;
  timestamp: string;
}