import React, { useState } from 'react';
import { Calendar, Filter, Archive, Building, MapPin, AlertTriangle, RefreshCw } from 'lucide-react';

interface FilterState {
  startDate: string;
  endDate: string;
  portfolio: string;
  institution: string;
  branch: string;
  riskLevel: string;
}

interface PilotageFiltersProps {
  onFilter: (filters: FilterState) => void;
  initialFilters?: Partial<FilterState>;
}

export const PilotageFilters: React.FC<PilotageFiltersProps> = ({ onFilter, initialFilters }) => {
  const [filters, setFilters] = useState<FilterState>({
    startDate: initialFilters?.startDate || '',
    endDate: initialFilters?.endDate || '',
    portfolio: initialFilters?.portfolio || 'All',
    institution: initialFilters?.institution || 'All',
    branch: initialFilters?.branch || 'All',
    riskLevel: initialFilters?.riskLevel || 'All',
  });

  const handleChange = (field: keyof FilterState, value: string) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onFilter(updated);
  };

  const handleReset = () => {
    const cleared = {
      startDate: '',
      endDate: '',
      portfolio: 'All',
      institution: 'All',
      branch: 'All',
      riskLevel: 'All',
    };
    setFilters(cleared);
    onFilter(cleared);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-50 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Filter size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-800">Filtres de consolidation</h3>
            <p className="text-xs text-gray-500 font-mono">Consolidez les données en temps réel</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
          id="btn-filters-reset"
        >
          <RefreshCw size={12} className="text-gray-400" />
          Réinitialiser
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Date Début */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Calendar size={11} /> Date Début
          </label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="w-full text-xs bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200/80 rounded-lg px-2.5 py-2 outline-none font-mono transition-all text-gray-700"
            id="filter-start-date"
          />
        </div>

        {/* Date Fin */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Calendar size={11} /> Date Fin
          </label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="w-full text-xs bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200/80 rounded-lg px-2.5 py-2 outline-none font-mono transition-all text-gray-700"
            id="filter-end-date"
          />
        </div>

        {/* Portefeuille */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Archive size={11} /> Portefeuille
          </label>
          <select
            value={filters.portfolio}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            className="w-full text-xs bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200/80 rounded-lg px-2.5 py-2 outline-none transition-all text-gray-700 font-medium"
            id="filter-portfolio"
          >
            <option value="All">Tous les portefeuilles</option>
            <option value="Microfinance">Microfinance</option>
            <option value="Factoring">Affacturage / Factoring</option>
            <option value="Leasing">Crédit-bail / Leasing</option>
          </select>
        </div>

        {/* Institution */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <Building size={11} /> Institution
          </label>
          <select
            value={filters.institution}
            onChange={(e) => handleChange('institution', e.target.value)}
            className="w-full text-xs bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200/80 rounded-lg px-2.5 py-2 outline-none transition-all text-gray-700 font-medium"
            id="filter-institution"
          >
            <option value="All">Toutes institutions</option>
            <option value="Enda Tamweel">Enda Tamweel</option>
            <option value="Amen Bank">Amen Bank</option>
            <option value="Tunisie Leasing">Tunisie Leasing</option>
          </select>
        </div>

        {/* Agence / Branche */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <MapPin size={11} /> Branche / Agence
          </label>
          <select
            value={filters.branch}
            onChange={(e) => handleChange('branch', e.target.value)}
            className="w-full text-xs bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200/80 rounded-lg px-2.5 py-2 outline-none transition-all text-gray-700 font-medium"
            id="filter-branch"
          >
            <option value="All">Toutes les agences</option>
            <option value="Tunis Centre">Tunis Centre</option>
            <option value="Tunis Belvédère">Tunis Belvédère</option>
            <option value="Lac Tunis">Lac Tunis</option>
            <option value="Sousse Corniche">Sousse Corniche</option>
            <option value="Sfax El Jadida">Sfax El Jadida</option>
          </select>
        </div>

        {/* Niveau de Risque */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
            <AlertTriangle size={11} /> Niveau Risque
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => handleChange('riskLevel', e.target.value)}
            className="w-full text-xs bg-gray-50 hover:bg-gray-100/50 focus:bg-white border border-gray-200/80 rounded-lg px-2.5 py-2 outline-none transition-all text-gray-700 font-medium"
            id="filter-risk"
          >
            <option value="All">Tous les risques</option>
            <option value="Faible">Faible</option>
            <option value="Moyen">Moyen</option>
            <option value="Élevé">Élevé</option>
            <option value="Critique">Critique</option>
          </select>
        </div>
      </div>
    </div>
  );
};
