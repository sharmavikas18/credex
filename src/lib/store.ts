import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ToolEntry, AuditFormData, AuditResult } from './types';

interface AuditState {
  // Form data
  formData: AuditFormData;
  setCompanyName: (name: string) => void;
  setTeamSize: (size: number) => void;
  addTool: (tool: ToolEntry) => void;
  removeTool: (id: string) => void;
  updateTool: (id: string, updates: Partial<ToolEntry>) => void;
  resetForm: () => void;

  // Results
  lastResult: AuditResult | null;
  setResult: (result: AuditResult) => void;
  clearResult: () => void;
}

const INITIAL_FORM: AuditFormData = {
  companyName: '',
  teamSize: 1,
  tools: [],
};

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      formData: { ...INITIAL_FORM },

      setCompanyName: (name) =>
        set((s) => ({ formData: { ...s.formData, companyName: name } })),

      setTeamSize: (size) =>
        set((s) => ({ formData: { ...s.formData, teamSize: size } })),

      addTool: (tool) =>
        set((s) => ({
          formData: { ...s.formData, tools: [...s.formData.tools, tool] },
        })),

      removeTool: (id) =>
        set((s) => ({
          formData: {
            ...s.formData,
            tools: s.formData.tools.filter((t) => t.id !== id),
          },
        })),

      updateTool: (id, updates) =>
        set((s) => ({
          formData: {
            ...s.formData,
            tools: s.formData.tools.map((t) =>
              t.id === id ? { ...t, ...updates } : t
            ),
          },
        })),

      resetForm: () => set({ formData: { ...INITIAL_FORM }, lastResult: null }),

      lastResult: null,
      setResult: (result) => set({ lastResult: result }),
      clearResult: () => set({ lastResult: null }),
    }),
    {
      name: 'audit-storage',
    }
  )
);
