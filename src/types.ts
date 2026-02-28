export type Category = 'productivity' | 'entertainment' | 'relax';

export interface Session {
  id: string;
  category: Category;
  startTime: number;
  endTime: number;
  duration: number; // in seconds
}

export interface CategoryConfig {
  id: Category;
  label: string;
  color: string;
  icon: string;
}

export const CATEGORIES: CategoryConfig[] = [
  { id: 'productivity', label: 'Productivity', color: '#10b981', icon: 'Zap' },
  { id: 'entertainment', label: 'Entertainment', color: '#f59e0b', icon: 'Play' },
  { id: 'relax', label: 'Relax', color: '#3b82f6', icon: 'Coffee' },
];
