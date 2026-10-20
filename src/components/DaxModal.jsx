import React, { useState } from 'react';
import { X, Code2, Database, Copy, Check } from 'lucide-react';

export default function DaxModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('dax');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const daxCode = `// ========================================================
// POWER BI DAX MEASURES - SALES PERFORMANCE SUITE
// ========================================================

// 1. Total Gross Revenue
Total Revenue = SUM(sales_transactions[revenue])

// 2. Cost of Goods Sold (COGS)
Total Cost = SUM(sales_transactions[cost])

// 3. Total Net Profit
Total Profit = [Total Revenue] - [Total Cost]

// 4. Profit Margin (%)
Profit Margin % = 
DIVIDE([Total Profit], [Total Revenue], 0) * 100

// 5. Total Orders (Distinct Transactions)
Total Orders = DISTINCTCOUNT(sales_transactions[order_id])

// 6. Units Sold
Units Sold = SUM(sales_transactions[quantity])

// 7. Average Order Value (AOV)
Average Order Value = 
DIVIDE([Total Revenue], [Total Orders], 0)

// 8. Month-over-Month (MoM) Revenue Growth
Revenue Prior Month = 
CALCULATE([Total Revenue], DATEADD('Dim_Date'[Date], -1, MONTH))

Revenue MoM Growth % = 
DIVIDE([Total Revenue] - [Revenue Prior Month], [Revenue Prior Month], 0) * 100

// 9. Year-over-Year (YoY) Revenue Growth
Revenue Prior Year = 
CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Dim_Date'[Date]))

Revenue YoY Growth % = 
DIVIDE([Total Revenue] - [Revenue Prior Year], [Revenue Prior Year], 0) * 100

// 10. Regional Contribution Share (%)
Regional Revenue Share % = 
DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALL(sales_transactions[region])), 0) * 100`;

  const sqlCode = `-- ========================================================
-- SALES PERFORMANCE ANALYTICS - CORE SQL AGGREGATION
-- ========================================================

-- Executive KPIs
SELECT 
    COUNT(DISTINCT order_id)                                  AS total_orders,
    SUM(quantity)                                             AS total_units_sold,
    ROUND(SUM(revenue), 2)                                    AS total_revenue,
    ROUND(SUM(profit), 2)                                     AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2)   AS overall_profit_margin_pct,
    ROUND(SUM(revenue) / COUNT(DISTINCT order_id), 2)         AS average_order_value_aov
FROM sales_transactions;

-- Monthly Trend with Window Functions (LAG)
WITH monthly_metrics AS (
    SELECT 
        TO_CHAR(order_date, 'YYYY-MM') AS sales_month,
        ROUND(SUM(revenue), 2)         AS monthly_revenue,
        ROUND(SUM(profit), 2)          AS monthly_profit
    FROM sales_transactions
    GROUP BY 1
)
SELECT 
    sales_month,
    monthly_revenue,
    monthly_profit,
    LAG(monthly_revenue, 1) OVER (ORDER BY sales_month) AS prev_month_revenue,
    ROUND(
        (monthly_revenue - LAG(monthly_revenue, 1) OVER (ORDER BY sales_month)) 
        / NULLIF(LAG(monthly_revenue, 1) OVER (ORDER BY sales_month), 0) * 100, 
        2
    ) AS mom_growth_pct
FROM monthly_metrics;`;

  const currentCode = activeTab === 'dax' ? daxCode : sqlCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: '750px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--teal-100)',
                color: 'var(--teal-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Code2 size={20} />
            </div>
            <div>
              <h3>DAX Formulas & SQL Queries Library</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Production-ready code powering Power BI & Relational Data Warehouses
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '16px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`chart-pill-btn ${activeTab === 'dax' ? 'active' : ''}`}
              style={{ fontSize: '13px', padding: '6px 14px' }}
              onClick={() => setActiveTab('dax')}
            >
              Power BI DAX Measures
            </button>
            <button
              className={`chart-pill-btn ${activeTab === 'sql' ? 'active' : ''}`}
              style={{ fontSize: '13px', padding: '6px 14px' }}
              onClick={() => setActiveTab('sql')}
            >
              SQL Analytics Queries
            </button>
          </div>

          <button className="action-btn" onClick={handleCopy} style={{ fontSize: '12px', padding: '6px 12px' }}>
            {copied ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="modal-body">
          <pre
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12.5px',
              lineHeight: 1.6,
              color: 'var(--text-primary)',
              overflowX: 'auto',
              maxHeight: '400px'
            }}
          >
            {currentCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
