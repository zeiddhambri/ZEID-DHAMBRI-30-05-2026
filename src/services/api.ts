// Typed API client for RecovAI Express Backend

export const api = {
  health: {
    check: async () => {
      const res = await fetch('/api/health');
      return res.json();
    }
  },

  dossiers: {
    getAll: async (params?: { status?: string; search?: string; management_level?: string; portfolio?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/dossiers?${query}`);
      return res.json();
    },
    getStats: async () => {
      const res = await fetch('/api/dossiers/stats/summary');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`/api/dossiers/${id}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch('/api/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    update: async (id: string, data: any) => {
      const res = await fetch(`/api/dossiers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/dossiers/${id}`, { method: 'DELETE' });
      return res.json();
    },
    recordAction: async (id: string, action: any) => {
      const res = await fetch(`/api/dossiers/${id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action)
      });
      return res.json();
    }
  },

  leasing: {
    getAll: async (params?: { status?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/portefeuilles/leasing?${query}`);
      return res.json();
    },
    getStats: async () => {
      const res = await fetch('/api/portefeuilles/leasing/stats');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`/api/portefeuilles/leasing/${id}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch('/api/portefeuilles/leasing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    simulateEarlyTermination: async (id: string, formula: string) => {
      const res = await fetch(`/api/portefeuilles/leasing/${id}/early-termination`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formula })
      });
      return res.json();
    }
  },

  factoring: {
    getDebtors: async () => {
      const res = await fetch('/api/portefeuilles/factoring/debtors');
      return res.json();
    },
    getInvoices: async (params?: { status?: string; debtorId?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/portefeuilles/factoring/invoices?${query}`);
      return res.json();
    },
    createInvoice: async (data: any) => {
      const res = await fetch('/api/portefeuilles/factoring/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    }
  },

  contentieux: {
    getAll: async (params?: { stage?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      const res = await fetch(`/api/contentieux/dossiers?${query}`);
      return res.json();
    },
    getStats: async () => {
      const res = await fetch('/api/contentieux/stats');
      return res.json();
    },
    getById: async (id: string) => {
      const res = await fetch(`/api/contentieux/dossiers/${id}`);
      return res.json();
    },
    create: async (data: any) => {
      const res = await fetch('/api/contentieux/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    updateStage: async (id: string, stage: string) => {
      const res = await fetch(`/api/contentieux/dossiers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
      return res.json();
    },
    addHearing: async (id: string, hearing: any) => {
      const res = await fetch(`/api/contentieux/dossiers/${id}/hearings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hearing)
      });
      return res.json();
    },
    addPayment: async (id: string, payment: any) => {
      const res = await fetch(`/api/contentieux/dossiers/${id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment)
      });
      return res.json();
    },
    getLawyers: async () => {
      const res = await fetch('/api/contentieux/lawyers');
      return res.json();
    },
    getBailiffs: async () => {
      const res = await fetch('/api/contentieux/bailiffs');
      return res.json();
    }
  },

  relances: {
    getAll: async () => {
      const res = await fetch('/api/relances');
      return res.json();
    },
    send: async (data: { dossierId: string; channel?: string; templateId?: string; customMessage?: string }) => {
      const res = await fetch('/api/relances/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    getTemplates: async () => {
      const res = await fetch('/api/relances/templates');
      return res.json();
    },
    previewTemplate: async (content: string, values?: any) => {
      const res = await fetch('/api/relances/templates/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, values })
      });
      return res.json();
    },
    getEscaladeRules: async () => {
      const res = await fetch('/api/relances/escalade');
      return res.json();
    },
    runEscalationEngine: async () => {
      const res = await fetch('/api/relances/escalade/run-engine', { method: 'POST' });
      return res.json();
    }
  },

  creditIfrs9: {
    calculateEcl: async (params: any) => {
      const res = await fetch('/api/credit-ifrs9/calculate-ecl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return res.json();
    },
    analyzeAi: async (params: any) => {
      const res = await fetch('/api/credit-ifrs9/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return res.json();
    }
  },

  clients: {
    search: async (q: string) => {
      const res = await fetch(`/api/clients/search?q=${encodeURIComponent(q)}`);
      return res.json();
    },
    getProfile: async (nameOrId: string) => {
      const res = await fetch(`/api/clients/${encodeURIComponent(nameOrId)}/profile`);
      return res.json();
    }
  },

  pilotage: {
    getDashboardSummary: async () => {
      const res = await fetch('/api/pilotage/tableau-de-bord-global/summary');
      return res.json();
    },
    getDashboardCharts: async () => {
      const res = await fetch('/api/pilotage/tableau-de-bord-global/charts');
      return res.json();
    }
  }
};
