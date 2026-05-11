import { describe, it, expect } from 'vitest';
import { runAudit } from '../index';
import { AuditFormData } from '@/lib/types';

describe('Audit Engine V2', () => {
  const baseData: AuditFormData = {
    companyName: 'TestCo',
    teamSize: 10,
    tools: [
      {
        id: '1',
        toolId: 'chatgpt',
        plan: 'Plus',
        monthlySpend: 20,
        seats: 1,
        useCase: 'general',
      },
    ],
  };

  it('should calculate total savings correctly', () => {
    const data: AuditFormData = {
      ...baseData,
      teamSize: 5,
      tools: [
        {
          id: '1',
          toolId: 'chatgpt',
          plan: 'Team',
          monthlySpend: 150, // $30/seat * 5
          seats: 10, // 5 ghost seats
          useCase: 'general',
        },
      ],
    };

    const result = runAudit(data);
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
    expect(result.recommendations.some(r => r.type === 'reduce-seats')).toBe(true);
  });

  it('should detect enterprise overkill for small teams', () => {
    const data: AuditFormData = {
      ...baseData,
      teamSize: 5,
      tools: [
        {
          id: '1',
          toolId: 'claude',
          plan: 'Enterprise',
          monthlySpend: 1000,
          seats: 5,
          useCase: 'general',
        },
      ],
    };

    const result = runAudit(data);
    const overkillRec = result.recommendations.find(r => r.type === 'downgrade');
    expect(overkillRec).toBeDefined();
    expect(overkillRec?.priority).toBe('high');
  });

  it('should detect tool overlaps for the same use case', () => {
    const data: AuditFormData = {
      ...baseData,
      tools: [
        {
          id: '1',
          toolId: 'chatgpt',
          plan: 'Plus',
          monthlySpend: 20,
          seats: 1,
          useCase: 'coding',
        },
        {
          id: '2',
          toolId: 'claude',
          plan: 'Pro',
          monthlySpend: 20,
          seats: 1,
          useCase: 'coding',
        },
      ],
    };

    const result = runAudit(data);
    expect(result.recommendations.some(r => r.type === 'remove-overlap')).toBe(true);
  });

  it('should suggest downgrading to individual plans for 1-2 seats on team plans', () => {
    const data: AuditFormData = {
      ...baseData,
      teamSize: 20,
      tools: [
        {
          id: '1',
          toolId: 'chatgpt',
          plan: 'Team',
          monthlySpend: 60,
          seats: 2,
          useCase: 'general',
        },
      ],
    };

    const result = runAudit(data);
    expect(result.recommendations.some(r => r.type === 'downgrade')).toBe(true);
  });

  it('should return no-change for optimized stacks', () => {
    const data: AuditFormData = {
      ...baseData,
      teamSize: 10,
      tools: [
        {
          id: '1',
          toolId: 'chatgpt',
          plan: 'Plus',
          monthlySpend: 20,
          seats: 1,
          useCase: 'general',
        },
      ],
    };

    const result = runAudit(data);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations.every(r => r.type === 'no-change')).toBe(true);
  });
});
