import { create } from 'zustand';

interface SettingsState {
  collapsed: boolean;
  layout: 'sidemenu' | 'topmenu';
  navTheme: string;
  fixedHeader: boolean;
  fixSiderbar: boolean;
  toggleCollapsed: () => void;
  setSettings: (settings: Partial<SettingsState>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  collapsed: false,
  layout: 'sidemenu',
  navTheme: '#1890FF',
  fixedHeader: false,
  fixSiderbar: false,
  toggleCollapsed: () => set((s) => ({ collapsed: !s.collapsed })),
  setSettings: (settings) => set(settings),
}));
