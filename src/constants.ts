import { ThemeId } from './types';

export const THEMES: Record<ThemeId, {
  name: string;
  color: string;
  secondary: string;
  accent: string;
  gradient: string;
  stampIcon: string;
  character: string;
  headerColor: string;
}> = {
  hellokitty: {
    name: 'Hello Kitty',
    color: '#FFBCCD', 
    secondary: '#FF69B4',
    accent: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFB6C1 100%)',
    stampIcon: '🐱',
    character: '🐱',
    headerColor: '#FF69B4'
  },
  mymelody: {
    name: 'My Melody',
    color: '#FFD1DC',
    secondary: '#FF1493',
    accent: '#FFFFFF',
    gradient: 'linear-gradient(135deg, #FFF0F5 0%, #FFD1DC 100%)',
    stampIcon: '🐰',
    character: '🐰',
    headerColor: '#FF69B4'
  },
  kuromi: {
    name: 'Kuromi',
    color: '#B19CD9',
    secondary: '#1A1A1A',
    accent: '#E6E6FA',
    gradient: 'linear-gradient(135deg, #F8F4FF 0%, #B19CD9 100%)',
    stampIcon: '😈',
    character: '😈',
    headerColor: '#9370DB'
  },
  cinnamoroll: {
    name: 'Cinnamoroll',
    color: '#89CFF0',
    secondary: '#4682B4',
    accent: '#FFFDD0',
    gradient: 'linear-gradient(135deg, #E0F7FF 0%, #89CFF0 100%)',
    stampIcon: '🐶',
    character: '🐶',
    headerColor: '#4682B4'
  }
};

export const MAX_STAMPS = 100;
