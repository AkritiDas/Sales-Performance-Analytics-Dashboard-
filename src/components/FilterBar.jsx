import React from 'react';
import {
  Filter,
  Calendar,
  Layers,
  MapPin,
  Building2,
  Search,
  X,
  Share2
} from 'lucide-react';

const DATE_PRESETS = [
  { id: 'all', label: 'All Time' },
  { id: '2025', label: 'FY 2025' },
  { id: '2024', label: 'FY 2024' },
  { id: 'q4_2025', label: 'Q4 2025 Surge' },
  { id: 'q3_2025', label: 'Q3 2025' },
  { id: 'last90', label: 'Last 90 Days' },
  { id: 'custom', label: 'Custom Range' }
];

export default function FilterBar({
  filters,
  setFilters,
  onResetFilters,
  activeFilterCount
}) {
  const updateFilter = (key, val) => {
    setFilters((prev) => ({
      ...prev,
      [key]: val
    }));
  };

  return (
    <div className="slicer-card">
      <div className="slicer-header">
        <div className="slicer-header-title">
          <Filter size={16} color="var(--teal-600)" />
          <span>Interactive Slicers & Global Filters</span>
          {activeFilterCount > 0 && (
            <span className="active-filters-count">
              {activeFilterCount} Active
            </span>
          )}
        </div>

        <div className="preset-pills-row">
          {DATE_PRESETS.map((p) => (
            <button
              key={p.id}
              className={`preset-pill ${filters.datePreset === p.id ? 'active' : ''}`}
              onClick={() => updateFilter('datePreset', p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="slicer-grid">
        {/* Custom Date Inputs if Custom Selected */}
        {filters.datePreset === 'custom' && (
          <>
            <div className="filter-group">
              <label className="filter-label">Start Date</label>
              <input
                type="date"
                className="filter-input"
                value={filters.startDate || '2024-01-01'}
                onChange={(e) => updateFilter('startDate', e.target.value)}
              />
            </div>
            <div className="filter-group">
              <label className="filter-label">End Date</label>
              <input
                type="date"
                className="filter-input"
                value={filters.endDate || '2025-12-31'}
                onChange={(e) => updateFilter('endDate', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Region */}
        <div className="filter-group">
          <label className="filter-label">Region</label>
          <select
            className="filter-select"
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
          >
            <option value="All">All Regions</option>
            <option value="East">East Region</option>
            <option value="West">West Region</option>
            <option value="Central">Central Region</option>
            <option value="South">South Region</option>
          </select>
        </div>

        {/* Category */}
        <div className="filter-group">
          <label className="filter-label">Product Category</label>
          <select
            className="filter-select"
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Furniture">Furniture</option>
            <option value="Office Supplies">Office Supplies</option>
          </select>
        </div>

        {/* Sales Channel */}
        <div className="filter-group">
          <label className="filter-label">Sales Channel</label>
          <select
            className="filter-select"
            value={filters.channel}
            onChange={(e) => updateFilter('channel', e.target.value)}
          >
            <option value="All">All Channels</option>
            <option value="Direct Sales">Direct Sales</option>
            <option value="Online Portal">Online Portal</option>
            <option value="Enterprise Partner">Enterprise Partner</option>
            <option value="Retail Wholesale">Retail Wholesale</option>
          </select>
        </div>

        {/* Customer Segment */}
        <div className="filter-group">
          <label className="filter-label">Customer Segment</label>
          <select
            className="filter-select"
            value={filters.segment}
            onChange={(e) => updateFilter('segment', e.target.value)}
          >
            <option value="All">All Segments</option>
            <option value="Enterprise">Enterprise</option>
            <option value="Corporate">Corporate</option>
            <option value="Small Business">Small Business</option>
            <option value="Consumer">Consumer</option>
          </select>
        </div>

        {/* Global Search */}
        <div className="filter-group">
          <label className="filter-label">Quick Search</label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="filter-input"
              placeholder="Search product, customer..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              style={{ paddingRight: '28px' }}
            />
            {filters.searchQuery && (
              <button
                onClick={() => updateFilter('searchQuery', '')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
