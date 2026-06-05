// Centralised React Query key factory.
// Every hook imports from here — ensures cache invalidation is precise.

export const QUERY_KEYS = {
  devotees: {
    all: ['devotees'] as const,
    list: (orgId: string, teamId?: string, status?: string, category?: string) =>
      ['devotees', 'list', orgId, teamId, status, category] as const,
    detail: (id: string) => ['devotees', id] as const,
    search: (orgId: string, term: string) => ['devotees', 'search', orgId, term] as const,
  },
  teams: {
    all: ['teams'] as const,
    list: (orgId: string) => ['teams', 'list', orgId] as const,
    detail: (id: string) => ['teams', id] as const,
  },
  attendance: {
    session: (orgId: string, dateString: string, category: string) =>
      ['attendance', 'session', orgId, dateString, category] as const,
    records: (sessionId: string) => ['attendance', 'records', sessionId] as const,
    sheet: (orgId: string, weekString: string, teamId?: string) =>
      ['attendance', 'sheet', orgId, weekString, teamId] as const,
    lateComers: (sessionId: string) => ['attendance', 'late', sessionId] as const,
    newComers: (orgId: string, weekString: string) =>
      ['attendance', 'newcomers', orgId, weekString] as const,
  },
  calling: {
    list: (listId: string) => ['calling', 'list', listId] as const,
    records: (listId: string) => ['calling', 'records', listId] as const,
    weekList: (orgId: string, weekString: string) =>
      ['calling', 'week', orgId, weekString] as const,
    history: (orgId: string) => ['calling', 'history', orgId] as const,
  },
  care: {
    overview: (orgId: string, weekString: string) =>
      ['care', 'overview', orgId, weekString] as const,
    absent: (orgId: string, dateString: string) =>
      ['care', 'absent', orgId, dateString] as const,
    inactive: (orgId: string, teamId?: string) =>
      ['care', 'inactive', orgId, teamId] as const,
    followUps: (orgId: string, teamId?: string) =>
      ['care', 'followups', orgId, teamId] as const,
    followUp: (id: string) => ['care', 'followup', id] as const,
  },
  reports: {
    weekly: (orgId: string, weekString: string) =>
      ['reports', 'weekly', orgId, weekString] as const,
    monthly: (orgId: string, month: number, year: number) =>
      ['reports', 'monthly', orgId, month, year] as const,
    leaderboard: (orgId: string, period: 'weekly' | 'monthly') =>
      ['reports', 'leaderboard', orgId, period] as const,
  },
} as const;
