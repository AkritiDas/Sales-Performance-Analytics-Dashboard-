import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Package,
  AlertTriangle,
  Award,
  Layers,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function ProductCharts({ productsData, categoriesData, theme }) {
  const [metricMode, setMetricMode] = useState('revenue'); // 'revenue' | 'profit' | 'margin'
  const isDark = theme === 'dark';

  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  // Choose products list based on ranking metric
  let rankedList = [...productsData.allProducts];
  if (metricMode === 'revenue') {
    rankedList.sort((a, b) => b.revenue - a.revenue);
  } else if (metricMode === 'profit') {
    rankedList.sort((a, b) => b.profit - a.profit);
  } else {
    rankedList.sort((a, b) => b.marginPct - a.marginPct);
  }
  const top10 = rankedList.slice(0, 10);

  // Horizontal Bar Chart
  const barChartData = {
    labels: top10.map((p) => p.name.length > 25 ? p.name.slice(0, 25) + '...' : p.name),
    datasets: [
      {
        label: metricMode === 'revenue' ? 'Revenue ($)' : metricMode === 'profit' ? 'Profit ($)' : 'Margin (%)',
        data: top10.map((p) => metricMode === 'revenue' ? p.revenue : metricMode === 'profit' ? p.profit : p.marginPct),
        backgroundColor: top10.map((p) => {
          if (p.category === 'Technology') return 'rgba(14, 165, 233, 0.85)';
          if (p.category === 'Furniture') return 'rgba(245, 158, 11, 0.85)';
          return 'rgba(20, 184, 166, 0.85)';
        }),
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#0f172a',
        callbacks: {
          label: (context) => {
            const val = context.parsed.x;
            if (metricMode === 'margin') {
              return ` Margin: ${val.toFixed(1)}%`;
            }
            return ` ${metricMode === 'revenue' ? 'Revenue' : 'Profit'}: ${formatCurrency(val)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (value) => metricMode === 'margin' ? `${value}%` : formatCurrency(value, true)
        }
      },
      y: {
        grid: { display: false },
        ticks: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 }
        }
      }
    }
  };

  // Category Doughnut Chart
  const doughnutData = {
    labels: categoriesData.map((c) => c.name),
    datasets: [
      {
        data: categoriesData.map((c) => c.revenue),
        backgroundColor: [
          'rgba(14, 165, 233, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(20, 184, 166, 0.85)'
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#131d33' : '#ffffff'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#0f172a',
        callbacks: {
          label: (context) => {
            const val = context.raw;
            return ` ${context.label}: ${formatCurrency(val)}`;
          }
        }
      }
    }
  };

  return (
    <div className="charts-grid-2">
      {/* 1. Top 10 Ranked Products */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>Top 10 Products Performance</h3>
            <p>Ranked analysis color-coded by product category</p>
          </div>

          <div className="chart-controls">
            <button
              className={`chart-pill-btn ${metricMode === 'revenue' ? 'active' : ''}`}
              onClick={() => setMetricMode('revenue')}
            >
              Revenue
            </button>
            <button
              className={`chart-pill-btn ${metricMode === 'profit' ? 'active' : ''}`}
              onClick={() => setMetricMode('profit')}
            >
              Profit
            </button>
            <button
              className={`chart-pill-btn ${metricMode === 'margin' ? 'active' : ''}`}
              onClick={() => setMetricMode('margin')}
            >
              Margin %
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ width: '10px', height: '10px', background: 'var(--cyan-500)', borderRadius: '2px' }}></span>
            Technology
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ width: '10px', height: '10px', background: 'var(--warning)', borderRadius: '2px' }}></span>
            Furniture
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ width: '10px', height: '10px', background: 'var(--teal-500)', borderRadius: '2px' }}></span>
            Office Supplies
          </div>
        </div>

        <div className="chart-canvas-container" style={{ minHeight: '320px' }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* 2. Category Share Doughnut */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>Category Revenue Distribution</h3>
            <p>Proportion of sales volume across primary enterprise verticals</p>
          </div>
        </div>

        <div className="chart-canvas-container" style={{ minHeight: '320px' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* 3. Margin Risk Alert / Action Required Products */}
      <div className="chart-card" style={{ gridColumn: 'span 2' }}>
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="var(--warning)" />
              Product Margin Leakage & Optimization Watchlist
            </h3>
            <p>
              Products generating high top-line revenue (&gt;$100,000) but delivering compressed profit margins due to contract discounting
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Gross Revenue</th>
                <th>Total Profit</th>
                <th>Profit Margin</th>
                <th>Avg Discount</th>
                <th>Action Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {productsData.marginRiskItems.map((prod) => (
                <tr key={prod.name}>
                  <td style={{ fontWeight: 600 }}>{prod.name}</td>
                  <td>
                    <span
                      className={`pill-tag ${
                        prod.category === 'Technology'
                          ? 'tech'
                          : prod.category === 'Furniture'
                          ? 'furn'
                          : 'off'
                      }`}
                    >
                      {prod.category}
                    </span>
                  </td>
                  <td>{formatCurrency(prod.revenue)}</td>
                  <td>{formatCurrency(prod.profit)}</td>
                  <td>
                    <span
                      className={`margin-chip ${
                        prod.marginPct < 15 ? 'low' : 'mid'
                      }`}
                    >
                      {prod.marginPct.toFixed(1)}%
                    </span>
                  </td>
                  <td>{prod.avgDiscountPct.toFixed(1)}%</td>
                  <td>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {prod.marginPct < 15
                        ? 'Cap discount at 10% / Renegotiate supplier BOM'
                        : 'Review enterprise bundle price threshold'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
