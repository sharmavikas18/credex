import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ToolEntry, AuditData } from './types';

interface AuditState {
  auditData: AuditData;
  setCompanyName: (name: string) => void;
  addTool: (tool: ToolEntry) => void;
  removeTool: (id: string) => void;
  updateTool: (id: string, tool: Partial<ToolEntry>) => void;
  resetAudit: () => void;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      auditData: {
        companyName: '',
        tools: [],
      },
      setCompanyName: (name) => 
        set((state) => ({ 
          auditData: { ...state.auditData, companyName: name } 
        })),
      addTool: (tool) => 
        set((state) => ({ 
          auditData: { ...state.auditData, tools: [...state.auditData.tools, tool] } 
        })),
      removeTool: (id) => 
        set((state) => ({ 
          auditData: { 
            ...state.auditData, 
            tools: state.auditData.tools.filter((t) => t.id !== id) 
          } 
        })),
      updateTool: (id, updatedTool) => 
        set((state) => ({ 
          auditData: { 
            ...state.auditData, 
            tools: state.auditData.tools.map((t) => t.id === id ? { ...t, ...updatedTool } : t) 
          } 
        })),
      resetAudit: () => 
        set({ 
          auditData: { companyName: '', tools: [] } 
        }),
    }),
    {
      name: 'audit-storage',
    }
  )
);
