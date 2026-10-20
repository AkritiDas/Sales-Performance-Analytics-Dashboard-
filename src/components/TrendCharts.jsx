import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { TrendingUp, Calendar, BarChart2 } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function TrendCharts({ trends, theme }) {
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'quarterly'
  const isDark = theme === 'dark';

  const dataset = viewMode === 'monthly' ? trends.monthly : trends.quarterly;
  const labels = dataset.map((d) => d.label);

  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  const chartData = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Gross Revenue ($)',
        data: dataset.map((d) => d.revenue),
        backgroundColor: isDark ? 'rgba(14, 165, 233, 0.75)' : 'rgba(2, 132, 199, 0.85)',
        borderRadius: 4,
        yAxisID: 'y'
      },
      {
        type: 'bar',
        label: 'Net Profit ($)',
        data: dataset.map((d) => d.profit),
        backgroundColor: isDark ? 'rgba(20, 184, 166, 0.75)' : 'rgba(13, 148, 136, 0.85)',
        borderRadius: 4,
        yAxisID: 'y'
      },
      {
        type: 'line',
        label: 'Profit Margin (%)',
        data: dataset.map((d) => d.marginPct),
        borderColor: '#f59e0b',
        backgroundColor: '#f59e0b',
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#ffffff',
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        tension: 0.3,
        yAxisID: 'y1'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#0f172a',
        titleColor: '#f8fafc',
        bodyColor: '#cbd5e1',
        padding: 12,
        borderRadius: 8,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const val = context.parsed.y;
            if (label.includes('Margin')) {
              return ` ${label}: ${val.toFixed(1)}%`;
            }
            return ` ${label}: ${formatCurrency(val)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 }
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (value) => formatCurrency(value, true)
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          color: '#f59e0b',
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (value) => `${value}%`
        }
      }
    }
  };

  // Quarterly YoY comparison data
  const qComparison = trends.quarterly;

  return (
    <div className="charts-grid-2">
      {/* 1. Combo Trend Chart */}
      <div className="chart-card" style={{ gridColumn: 'span 2' }}>
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>Revenue & Profit Margin Trend Analysis</h3>
            <p>
              Dual-axis combo visual analyzing monthly/quarterly sales volume alongside profit margin %
            </p>
          </div>

          <div className="chart-controls">
            <button
              className={`chart-pill-btn ${viewMode === 'monthly' ? 'active' : ''}`}
              onClick={() => setViewMode('monthly')}
            >
              Monthly View
            </button>
            <button
              className={`chart-pill-btn ${viewMode === 'quarterly' ? 'active' : ''}`}
              onClick={() => setViewMode('quarterly')}
            >
              Quarterly View
            </button>
          </div>
        </div>

        <div className="chart-canvas-container" style={{ minHeight: '340px' }}>
          <Chart type="bar" data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 2. MoM Growth Velocity Cards / Quick Table */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>Quarterly Performance Velocity</h3>
            <p>Aggregated quarterly volume & margin consistency</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Margin %</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {qComparison.map((q) => (
                <tr key={q.key}>
                  <td style={{ fontWeight: 600 }}>{q.label}</td>
                  <td>{formatCurrency(q.revenue)}</td>
                  <td style={{ color: 'var(--teal-600)', fontWeight: 600 }}>
                    {formatCurrency(q.profit)}
                  </td>
                  <td>
                    <span
                      className={`margin-chip ${
                        q.marginPct >= 25 ? 'high' : q.marginPct >= 18 ? 'mid' : 'low'
                      }`}
                    >
                      {q.marginPct.toFixed(1)}%
                    </span>
                  </td>
                  <td>{q.orders.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Seasonality & Cycle Analysis Notes */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>Seasonal Cycle & Growth Observations</h3>
            <p>Key seasonality patterns identified across fiscal cycles</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="insight-item">
            <div className="insight-icon growth">
              <TrendingUp size={18} />
            </div>
            <div className="insight-content">
              <h4>Q4 Enterprise Budget Flush Surge</h4>
              <p>
                Sales consistently spike in November and December (+28% over Q1-Q3 averages), driven by annual enterprise budget exhaustion and holiday procurement cycles.
              </p>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon info">
              <Calendar size={18} />
            </div>
            <div className="insight-content">
              <h4>Q1 Baseline Reset</h4>
              <p>
                First quarter volumes stabilize as enterprise contract renewals reset. Margins remain healthy (~27.4%) with lower discounting pressure.
              </p>
            </div>
          </div>

          <div className="insight-item">
            <div className="insight-icon warning">
              <BarChart2 size={18} />
            </div>
            <div className="insight-content">
              <h4>Summer Mid-Year Stability</h4>
              <p>
                Q2 and Q3 display steady linear demand across Direct Sales and Online channels with predictable replenishment cycles in Office Supplies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
