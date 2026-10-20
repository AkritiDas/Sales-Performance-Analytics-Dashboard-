import React from 'react';
import {
  Download,
  RotateCcw,
  Sun,
  Moon,
  Menu,
  FileSpreadsheet
} from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';

export default function Header({
  activeTab,
  theme,
  setTheme,
  onExportCsv,
  onResetFilters,
  activeFilterCount,
  filteredCount,
  totalCount,
  onToggleMobile
}) {
  const currentNav = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="icon-btn mobile-menu-btn"
          onClick={onToggleMobile}
          aria-label="Toggle menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>

        <div className="header-title-block">
          <h2>{currentNav.label}</h2>
          <span>
            Displaying {filteredCount.toLocaleString()} of {totalCount.toLocaleString()} Orders | Refreshed Live
          </span>
        </div>
      </div>

      <div className="header-actions">
        {activeFilterCount > 0 && (
          <button className="action-btn" onClick={onResetFilters} title="Reset all active filters">
            <RotateCcw size={14} />
            <span>Reset Filters ({activeFilterCount})</span>
          </button>
        )}

        <button
          className="action-btn primary"
          onClick={onExportCsv}
          title="Download filtered data as CSV for Excel/Power BI"
        >
          <Download size={15} />
          <span>Export CSV</span>
        </button>

        <button
          className="icon-btn"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
