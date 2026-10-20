import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  MapPin,
  Table,
  Lightbulb,
  Code2,
  Database,
  BarChart3
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
  { id: 'trends', label: 'Sales Trends & Growth', icon: TrendingUp },
  { id: 'products', label: 'Product & Profitability', icon: Package },
  { id: 'regions', label: 'Regional Performance', icon: MapPin },
  { id: 'table', label: 'Sales Data Explorer', icon: Table },
  { id: 'insights', label: 'Strategic Insights', icon: Lightbulb }
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  totalRecords,
  mobileOpen,
  setMobileOpen,
  onOpenDaxModal
}) {
  return (
    <aside className={`app-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon-wrapper">
          <BarChart3 size={22} strokeWidth={2.5} />
        </div>
        <div className="brand-text">
          <h1>Sales BI Suite</h1>
          <div className="brand-subtitle">Power BI Executive</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-title">Analytics Dashboards</div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="nav-section-title" style={{ marginTop: '16px' }}>Developer & Portfolio</div>
        <button
          className="nav-item"
          onClick={onOpenDaxModal}
          style={{ color: 'var(--teal-600)', fontWeight: 600 }}
        >
          <Code2 size={18} />
          <span>DAX & SQL Queries</span>
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="dataset-pill">
          <div className="status-dot"></div>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Live Data Pipeline</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {totalRecords.toLocaleString()} Enterprise Records
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
