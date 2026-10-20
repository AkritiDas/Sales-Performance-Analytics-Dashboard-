import React from 'react';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  Compass,
  CheckCircle2,
  DollarSign,
  ShieldAlert,
  Target
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/analytics';

export default function InsightsSection({
  insights,
  recommendations,
  kpis
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Automated Executive Intelligence Banner */}
      <div className="insights-banner">
        <div className="insights-header">
          <div className="insights-title">
            <Lightbulb size={20} />
            <span>Automated Business Intelligence & Operational Findings</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Generated dynamically from active dataset metrics
          </span>
        </div>

        <div className="insights-grid">
          {insights.map((item, idx) => (
            <div key={idx} className="insight-item">
              <div
                className={`insight-icon ${
                  item.type === 'growth'
                    ? 'growth'
                    : item.type === 'warning'
                    ? 'warning'
                    : 'info'
                }`}
              >
                {item.type === 'growth' ? (
                  <TrendingUp size={18} />
                ) : item.type === 'warning' ? (
                  <AlertTriangle size={18} />
                ) : (
                  <Compass size={18} />
                )}
              </div>
              <div className="insight-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Strategic Management Recommendations */}
      <div>
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Strategic Leadership Recommendations & Action Plan
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Targeted management initiatives to accelerate growth, protect gross margin, and optimize sales territory execution
          </p>
        </div>

        <div className="recommendations-grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className="rec-card">
              <div className="rec-card-top">
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background:
                      rec.severity === 'high'
                        ? 'var(--danger-bg)'
                        : rec.severity === 'opp'
                        ? 'var(--success-bg)'
                        : 'var(--warning-bg)',
                    color:
                      rec.severity === 'high'
                        ? 'var(--danger)'
                        : rec.severity === 'opp'
                        ? 'var(--success)'
                        : 'var(--warning)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {rec.severity === 'high' ? (
                    <ShieldAlert size={20} />
                  ) : rec.severity === 'opp' ? (
                    <Target size={20} />
                  ) : (
                    <CheckCircle2 size={20} />
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      className={`rec-badge ${
                        rec.severity === 'high'
                          ? 'high'
                          : rec.severity === 'opp'
                          ? 'opp'
                          : 'medium'
                      }`}
                    >
                      {rec.severity === 'high'
                        ? 'High Priority'
                        : rec.severity === 'opp'
                        ? 'Revenue Expansion'
                        : 'Optimization'}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    {rec.title}
                  </h4>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    <strong>Observation:</strong> {rec.finding}
                  </p>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    <strong>Recommended Action:</strong> {rec.action}
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '10px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '12px',
                  color: 'var(--teal-600)',
                  fontWeight: 600,
                  marginTop: '12px'
                }}
              >
                Projected Business Impact: {rec.impact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
