import React from 'react';
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
import { MapPin, Globe, Award, TrendingDown, Layers } from 'lucide-react';
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

export default function RegionalCharts({ regionalData, theme }) {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';

  const { regions, states } = regionalData;
  const topRegion = regions[0];
  const lowestRegion = regions[regions.length - 1];

  // Ranked Bar Chart
  const barChartData = {
    labels: regions.map((r) => `${r.region} Region`),
    datasets: [
      {
        label: 'Revenue ($)',
        data: regions.map((r) => r.revenue),
        backgroundColor: 'rgba(14, 165, 233, 0.85)',
        borderRadius: 4
      },
      {
        label: 'Profit ($)',
        data: regions.map((r) => r.profit),
        backgroundColor: 'rgba(20, 184, 166, 0.85)',
        borderRadius: 4
      }
    ]
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#1e293b' : '#0f172a',
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 11 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          font: { family: 'Plus Jakarta Sans', size: 11 },
          callback: (val) => formatCurrency(val, true)
        }
      }
    }
  };

  // Regional Share Doughnut Chart
  const doughnutData = {
    labels: regions.map((r) => `${r.region} (${r.revenueSharePct}%)`),
    datasets: [
      {
        data: regions.map((r) => r.revenue),
        backgroundColor: [
          '#0ea5e9',
          '#14b8a6',
          '#f59e0b',
          '#8b5cf6'
        ],
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#131d33' : '#ffffff'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
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
          label: (ctx) => ` Revenue: ${formatCurrency(ctx.raw)}`
        }
      }
    }
  };

  return (
    <div className="charts-grid-2">
      {/* 1. Territory Leader & Laggard Summary Cards */}
      <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {topRegion && (
          <div className="kpi-card" style={{ '--card-accent': 'var(--teal-500)' }}>
            <div className="kpi-header">
              <span className="kpi-title">Highest-Performing Territory</span>
              <div className="kpi-icon-badge" style={{ color: 'var(--teal-500)' }}>
                <Award size={18} />
              </div>
            </div>
            <div className="kpi-value">{topRegion.region} Region</div>
            <div className="kpi-footer">
              <span className="growth-badge positive">
                {topRegion.revenueSharePct}% Share
              </span>
              <span className="kpi-context-text">
                {formatCurrency(topRegion.revenue, true)} Revenue ({topRegion.marginPct}% Margin)
              </span>
            </div>
          </div>
        )}

        {lowestRegion && (
          <div className="kpi-card" style={{ '--card-accent': 'var(--warning)' }}>
            <div className="kpi-header">
              <span className="kpi-title">Expansion Opportunity Territory</span>
              <div className="kpi-icon-badge" style={{ color: 'var(--warning)' }}>
                <TrendingDown size={18} />
              </div>
            </div>
            <div className="kpi-value">{lowestRegion.region} Region</div>
            <div className="kpi-footer">
              <span className="growth-badge negative">
                {lowestRegion.revenueSharePct}% Share
              </span>
              <span className="kpi-context-text">
                {formatCurrency(lowestRegion.revenue, true)} Revenue ({lowestRegion.marginPct}% Margin)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Ranked Regional Revenue Bar Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>Regional Revenue & Profit Comparison</h3>
            <p>Direct comparison of revenue volume against net profit generated</p>
          </div>
        </div>

        <div className="chart-canvas-container" style={{ minHeight: '300px' }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* 3. Regional Contribution Donut */}
      <div className="chart-card">
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>Regional Contribution to Total Revenue</h3>
            <p>Percentage contribution of each territory to company-wide sales</p>
          </div>
        </div>

        <div className="chart-canvas-container" style={{ minHeight: '300px' }}>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* 4. State-Level Performance Drilldown Table */}
      <div className="chart-card" style={{ gridColumn: 'span 2' }}>
        <div className="chart-header">
          <div className="chart-title-wrap">
            <h3>State-Level Sales Breakdown</h3>
            <p>Detailed performance metrics across states and regional hubs</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto', maxHeight: '360px' }}>
          <table className="sales-table">
            <thead>
              <tr>
                <th>State</th>
                <th>Region</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Profit Margin</th>
                <th>Units Shipped</th>
              </tr>
            </thead>
            <tbody>
              {states.map((st) => (
                <tr key={st.state}>
                  <td style={{ fontWeight: 600 }}>{st.state}</td>
                  <td>
                    <span className="pill-tag" style={{ background: 'var(--bg-tertiary)' }}>
                      {st.region}
                    </span>
                  </td>
                  <td>{formatCurrency(st.revenue)}</td>
                  <td style={{ color: 'var(--teal-600)', fontWeight: 600 }}>
                    {formatCurrency(st.profit)}
                  </td>
                  <td>
                    <span
                      className={`margin-chip ${
                        st.marginPct >= 25 ? 'high' : st.marginPct >= 18 ? 'mid' : 'low'
                      }`}
                    >
                      {st.marginPct.toFixed(1)}%
                    </span>
                  </td>
                  <td>{st.quantity.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
