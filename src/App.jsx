import React, { useState, useMemo, useEffect } from 'react';
import salesDataRaw from './data/salesData.json';
import {
  filterDataset,
  calculateExecutiveKpis,
  aggregateSalesTrends,
  aggregateProductPerformance,
  aggregateRegionalPerformance,
  aggregateCategoryChannel,
  generateExecutiveInsights,
  getStrategicRecommendations,
  formatCurrency,
  formatPercent
} from './utils/analytics';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KpiCards from './components/KpiCards';
import TrendCharts from './components/TrendCharts';
import ProductCharts from './components/ProductCharts';
import RegionalCharts from './components/RegionalCharts';
import SalesTable from './components/SalesTable';
import InsightsSection from './components/InsightsSection';
import OrderModal from './components/OrderModal';
import DaxModal from './components/DaxModal';

const DEFAULT_FILTERS = {
  datePreset: 'all',
  startDate: '2024-01-01',
  endDate: '2025-12-31',
  region: 'All',
  category: 'All',
  channel: 'All',
  segment: 'All',
  searchQuery: ''
};

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sales_bi_theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sales_bi_theme', theme);
  }, [theme]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Modals state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDaxModalOpen, setIsDaxModalOpen] = useState(false);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.datePreset !== 'all') count++;
    if (filters.region !== 'All') count++;
    if (filters.category !== 'All') count++;
    if (filters.channel !== 'All') count++;
    if (filters.segment !== 'All') count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Filtered dataset
  const filteredData = useMemo(() => {
    return filterDataset(salesDataRaw, filters);
  }, [filters]);

  // Analytics Aggregations
  const kpis = useMemo(() => {
    return calculateExecutiveKpis(filteredData, salesDataRaw, filters);
  }, [filteredData, filters]);

  const trends = useMemo(() => {
    return aggregateSalesTrends(filteredData);
  }, [filteredData]);

  const productsData = useMemo(() => {
    return aggregateProductPerformance(filteredData);
  }, [filteredData]);

  const regionalData = useMemo(() => {
    return aggregateRegionalPerformance(filteredData);
  }, [filteredData]);

  const categoryChannelData = useMemo(() => {
    return aggregateCategoryChannel(filteredData);
  }, [filteredData]);

  const insights = useMemo(() => {
    return generateExecutiveInsights(
      kpis,
      productsData,
      regionalData,
      categoryChannelData.categories
    );
  }, [kpis, productsData, regionalData, categoryChannelData]);

  const recommendations = useMemo(() => {
    return getStrategicRecommendations(kpis, productsData, regionalData);
  }, [kpis, productsData, regionalData]);

  // Export CSV handler
  const handleExportCsv = () => {
    if (filteredData.length === 0) {
      alert('No records to export with current filters.');
      return;
    }

    const headers = [
      'Order_ID',
      'Order_Date',
      'Ship_Date',
      'Ship_Mode',
      'Customer_ID',
      'Customer_Name',
      'Segment',
      'Region',
      'State',
      'City',
      'Category',
      'Sub_Category',
      'Product_Name',
      'Sales_Channel',
      'Quantity',
      'Unit_Price',
      'Unit_Cost',
      'Discount',
      'Revenue',
      'Cost',
      'Profit',
      'Profit_Margin'
    ];

    const csvRows = [headers.join(',')];
    filteredData.forEach((row) => {
      const values = headers.map((header) => {
        const val = row[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_performance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalRecords={salesDataRaw.length}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onOpenDaxModal={() => setIsDaxModalOpen(true)}
      />

      {/* Main Content View */}
      <div className="main-wrapper">
        <Header
          activeTab={activeTab}
          theme={theme}
          setTheme={setTheme}
          onExportCsv={handleExportCsv}
          onResetFilters={handleResetFilters}
          activeFilterCount={activeFilterCount}
          filteredCount={filteredData.length}
          totalCount={salesDataRaw.length}
          onToggleMobile={() => setMobileOpen(!mobileOpen)}
        />

        <main className="content-body">
          {/* Global Slicers & Filters */}
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            onResetFilters={handleResetFilters}
            activeFilterCount={activeFilterCount}
          />

          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              <KpiCards kpis={kpis} />

              {/* Dynamic Insights Highlights */}
              <div className="insights-banner">
                <div className="insights-header">
                  <div className="insights-title">
                    <span>Executive Summary & Key Takeaways</span>
                  </div>
                  <button
                    className="chart-pill-btn"
                    onClick={() => setActiveTab('insights')}
                  >
                    View All Strategic Actions
                  </button>
                </div>
                <div className="insights-grid">
                  {insights.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="insight-item">
                      <div className="insight-content">
                        <h4>{item.title}</h4>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Level Overview Visuals */}
              <div className="charts-grid-2">
                <TrendCharts trends={trends} theme={theme} />
              </div>

              <div className="charts-grid-2">
                <ProductCharts
                  productsData={productsData}
                  categoriesData={categoryChannelData.categories}
                  theme={theme}
                />
              </div>

              {/* Data Table Preview */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Recent Orders Drill-Through
                  </h3>
                  <button
                    className="action-btn"
                    onClick={() => setActiveTab('table')}
                  >
                    Open Full Data Explorer &rarr;
                  </button>
                </div>
                <SalesTable
                  data={filteredData.slice(0, 15)}
                  onSelectOrder={(order) => setSelectedOrder(order)}
                  onExportCsv={handleExportCsv}
                />
              </div>
            </>
          )}

          {/* TAB 2: SALES TRENDS */}
          {activeTab === 'trends' && (
            <>
              <KpiCards kpis={kpis} />
              <TrendCharts trends={trends} theme={theme} />
            </>
          )}

          {/* TAB 3: PRODUCTS & PROFITABILITY */}
          {activeTab === 'products' && (
            <>
              <KpiCards kpis={kpis} />
              <ProductCharts
                productsData={productsData}
                categoriesData={categoryChannelData.categories}
                theme={theme}
              />
            </>
          )}

          {/* TAB 4: REGIONAL PERFORMANCE */}
          {activeTab === 'regions' && (
            <>
              <KpiCards kpis={kpis} />
              <RegionalCharts regionalData={regionalData} theme={theme} />
            </>
          )}

          {/* TAB 5: DATA EXPLORER & RECORDS */}
          {activeTab === 'table' && (
            <SalesTable
              data={filteredData}
              onSelectOrder={(order) => setSelectedOrder(order)}
              onExportCsv={handleExportCsv}
            />
          )}

          {/* TAB 6: STRATEGIC INSIGHTS & ACTIONS */}
          {activeTab === 'insights' && (
            <>
              <KpiCards kpis={kpis} />
              <InsightsSection
                insights={insights}
                recommendations={recommendations}
                kpis={kpis}
              />
            </>
          )}
        </main>
      </div>

      {/* Order Details Inspection Modal */}
      <OrderModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* DAX Measures & SQL Queries Portfolio Modal */}
      <DaxModal
        isOpen={isDaxModalOpen}
        onClose={() => setIsDaxModalOpen(false)}
      />
    </div>
  );
}
