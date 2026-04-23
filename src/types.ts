export type ThemeId = 'hellokitty' | 'mymelody' | 'kuromi' | 'cinnamoroll';

export interface Kid {
  id: string;
  name: string;
  stamps: number;
  theme: ThemeId;
}

export interface AppState {
  kids: Kid[];
  currentKidId: string | null;
}
