import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  ShoppingBag,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent } from '../utils/analytics';

export default function KpiCards({ kpis }) {
  const isRevenueGrowthPos = kpis.revenueGrowthPct >= 0;
  const isProfitGrowthPos = kpis.profitGrowthPct >= 0;
  const isMarginHealthy = kpis.profitMargin >= 22;

  const cards = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: formatCurrency(kpis.totalRevenue),
      accent: 'var(--cyan-500)',
      icon: DollarSign,
      growth: {
        value: formatPercent(kpis.revenueGrowthPct, true),
        isPositive: isRevenueGrowthPos,
        text: kpis.baselineDescription
      }
    },
    {
      id: 'profit',
      title: 'Total Profit',
      value: formatCurrency(kpis.totalProfit),
      accent: 'var(--teal-500)',
      icon: Sparkles,
      growth: {
        value: formatPercent(kpis.profitGrowthPct, true),
        isPositive: isProfitGrowthPos,
        text: 'Gross Earnings'
      }
    },
    {
      id: 'margin',
      title: 'Profit Margin',
      value: formatPercent(kpis.profitMargin),
      accent: isMarginHealthy ? 'var(--success)' : 'var(--warning)',
      icon: Percent,
      growth: {
        value: isMarginHealthy ? 'Healthy' : 'Caution',
        isPositive: isMarginHealthy,
        text: 'Target >= 22%'
      }
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: formatNumber(kpis.totalOrders),
      accent: 'var(--purple)',
      icon: ShoppingBag,
      growth: {
        value: formatCurrency(kpis.aov, true),
        isPositive: true,
        text: 'Avg Order Value'
      }
    },
    {
      id: 'units',
      title: 'Units Sold',
      value: formatNumber(kpis.unitsSold),
      accent: 'var(--warning)',
      icon: Layers,
      growth: {
        value: `${(kpis.unitsSold / Math.max(1, kpis.totalOrders)).toFixed(1)} / Order`,
        isPositive: true,
        text: 'Avg Basket Size'
      }
    },
    {
      id: 'growth',
      title: 'Revenue Growth',
      value: formatPercent(kpis.revenueGrowthPct, true),
      accent: isRevenueGrowthPos ? 'var(--success)' : 'var(--danger)',
      icon: isRevenueGrowthPos ? TrendingUp : TrendingDown,
      growth: {
        value: isRevenueGrowthPos ? 'Expanding' : 'Contracting',
        isPositive: isRevenueGrowthPos,
        text: kpis.baselineDescription
      }
    }
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="kpi-card"
            style={{ '--card-accent': card.accent }}
          >
            <div className="kpi-header">
              <span className="kpi-title">{card.title}</span>
              <div
                className="kpi-icon-badge"
                style={{ color: card.accent }}
              >
                <Icon size={18} />
              </div>
            </div>

            <div className="kpi-value">{card.value}</div>

            <div className="kpi-footer">
              <span
                className={`growth-badge ${
                  card.growth.isPositive ? 'positive' : 'negative'
                }`}
              >
                {card.growth.isPositive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}
                {card.growth.value}
              </span>
              <span className="kpi-context-text">{card.growth.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
