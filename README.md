# Enterprise Sales Performance Analytics Dashboard

[![React](https://img.shields.io/badge/React-19.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.5-FF6384?style=flat&logo=chartdotjs&logoColor=white)](https://www.chartjs.org/)
[![Power BI Style](https://img.shields.io/badge/UI_Style-Power_BI_Slate_&_Teal-0D9488?style=flat)](https://powerbi.microsoft.com/)

A modern, executive-grade **Sales Performance Analytics Dashboard** built to analyze multi-million-dollar sales operations, identify revenue and profit trends, diagnose margin leakages, evaluate regional territory contributions, and deliver automated, data-driven business intelligence.

---

## 📊 Live Features & Core Capabilities

### 1. Executive KPI Overview
- **Total Revenue**: Tracks gross revenue with comparative delta indicators (`+14.8% YoY`).
- **Total Profit & Profit Margin (%)**: Dynamic profit tracking with margin threshold indicators.
- **Total Orders & Units Sold**: Transaction volume and average basket size metrics.
- **Average Order Value (AOV)**: Revenue per unique transactional order event.
- **Dynamic Comparisons**: Real-time comparison against prior period baselines (YoY / QoQ / MoM).

### 2. Multi-Period Trend & Seasonality Analysis
- **Dual-Axis Combo Visual**: Gross revenue bars combined with a profit margin % line overlay on secondary Y-axis.
- **Monthly & Quarterly Toggle**: Seamless toggle between monthly granular view and high-level quarterly velocity.
- **Seasonal Cycles**: Analysis of Q4 enterprise budget flushes, Q1 baseline renewals, and mid-year replenishment trends.

### 3. Product Performance & Profitability Matrix
- **Top 10 Ranked Visual**: Dynamic ranking by **Revenue**, **Net Profit**, or **Profit Margin %**, color-coded by category (*Technology*, *Furniture*, *Office Supplies*).
- **Category Contribution Doughnut**: Visual breakdown of vertical revenue shares.
- **Margin Leakage Watchlist**: Automatically flags high-revenue products (`>$100,000`) experiencing margin compression (`<20%`) due to enterprise contract discounting.

### 4. Regional Territory Breakdown
- **Ranked Territory Visual**: Direct comparison of revenue and profit across **East**, **West**, **Central**, and **South** regions.
- **Territory Contribution Donut**: Percentage contribution of each territory to company-wide gross sales.
- **Leader & Opportunity Cards**: Automatic identification of top-performing territory vs underperforming expansion regions.
- **State-Level Drilldown Table**: Detailed drill-through of all states and regional hubs.

### 5. Interactive Slicers & Global Cross-Filtering
- **Date Presets**: Quick-select buttons for `All Time`, `FY 2025`, `FY 2024`, `Q4 2025 Surge`, `Q3 2025`, `Last 90 Days`, and `Custom Date Range`.
- **Dimensional Slicers**: Multi-select dropdowns for **Region**, **Category**, **Sales Channel**, and **Customer Segment**.
- **Global Search**: Search by Order ID, Product Name, Customer, City, or State.
- **Active Filter Counter & Reset**: Instant one-click filter reset with active counter badge.

### 6. Searchable, Sortable Sales Data Explorer
- **Interactive Data Grid**: Inspect underlying transactional records with multi-column sorting (Order Date, Order ID, Product, Category, Region, Quantity, Revenue, Cost, Profit, Margin).
- **Pagination & Page Size Controls**: Configurable display of 10, 15, 25, or 50 rows per page.
- **Direct Order Inspection Modal**: Detailed view of customer profile, shipping mode, and financial unit economics.
- **Export to CSV**: Download filtered datasets directly into CSV for Excel or Power BI imports.

### 7. Automated Business Intelligence & Strategic Insights
- **Dynamic Observation Engine**: Algorithmically evaluates filtered metrics to highlight top revenue drivers, margin health, and regional territory opportunities.
- **Strategic Management Recommendations**: Concrete, prioritized leadership action items complete with projected business impact.

### 8. Built-in DAX & SQL Queries Library
- Integrated in-app code modal presenting copyable, production-ready **Power BI DAX Measures** and **SQL Warehouse Queries** for data analysts and BI developers.

---

## 🗂️ Project Structure

```text
├── data/
│   └── sales_data.csv                 # 1,500 enterprise transactions (CSV for Excel/Power BI)
├── docs/
│   ├── KPI_AND_FORMULAS.md            # Mathematical formulas, SQL, and DAX definitions
│   └── POWER_BI_GUIDE.md              # Power BI star schema model and DAX library
├── sql/
│   └── sales_performance_queries.sql  # Production SQL scripts (KPIs, MoM/YoY, RFM, Pareto)
├── scripts/
│   └── generate_sales_data.py         # Realistic sales dataset generation script
├── src/
│   ├── components/
│   │   ├── DaxModal.jsx               # DAX & SQL query code viewer modal
│   │   ├── FilterBar.jsx              # Interactive date presets and slicers
│   │   ├── Header.jsx                 # Top bar with export, filter reset, theme switch
│   │   ├── InsightsSection.jsx        # Dynamic insights and executive recommendations
│   │   ├── KpiCards.jsx               # Executive KPI metric cards
│   │   ├── OrderModal.jsx             # Detailed order inspection drawer
│   │   ├── ProductCharts.jsx          # Top 10 products, category donut, margin risk table
│   │   ├── RegionalCharts.jsx         # Regional ranked bars, donut, state drilldown
│   │   ├── SalesTable.jsx             # Searchable, sortable, paginated data grid
│   │   ├── Sidebar.jsx                # Power BI sidebar navigation
│   │   └── TrendCharts.jsx            # Combo revenue/margin chart and quarterly table
│   ├── data/
│   │   └── salesData.json             # 1,500 records JSON dataset for client-side analytics
│   ├── utils/
│   │   └── analytics.js               # Core KPI math, filter engine, insights generator
│   ├── App.jsx                        # Master application coordinator
│   ├── index.css                      # Corporate Navy-Blue/Teal Power BI design system
│   └── main.jsx                       # React 19 entry point
├── package.json
└── README.md
```

---

## 📐 KPI Formulas & Mathematical Definitions

| KPI Metric | Business Rationale | Mathematical Formula | SQL Window / Aggregation |
| :--- | :--- | :--- | :--- |
| **Total Revenue** | Top-line gross sales income | $\sum (\text{Qty} \times \text{Price} \times (1 - \text{Discount}))$ | `SUM(revenue)` |
| **Total Cost** | Total Cost of Goods Sold (COGS) | $\sum (\text{Qty} \times \text{Unit Cost})$ | `SUM(cost)` |
| **Total Profit** | Net earnings from product sales | $\text{Revenue} - \text{Cost}$ | `SUM(profit)` |
| **Profit Margin (%)** | Profit retention per revenue dollar | $(\text{Total Profit} / \text{Total Revenue}) \times 100$ | `(SUM(profit) / SUM(revenue)) * 100` |
| **Total Orders** | Total distinct purchases | $\text{Distinct Count}(\text{Order ID})$ | `COUNT(DISTINCT order_id)` |
| **Units Sold** | Physical inventory shipped | $\sum \text{Quantity}$ | `SUM(quantity)` |
| **Revenue Growth (%)** | Expansion velocity vs prior baseline | $((\text{Rev}_{\text{Curr}} - \text{Rev}_{\text{Prev}}) / \text{Rev}_{\text{Prev}}) \times 100$ | `(rev - LAG(rev) OVER (...)) / LAG(rev) * 100` |
| **Average Order Value** | Average spend per transaction | $\text{Total Revenue} / \text{Total Orders}$ | `SUM(revenue) / COUNT(DISTINCT order_id)` |

---

## 🚀 Running the Project Locally

### Prerequisites
- **Node.js** (v18.0 or newer)
- **npm** (v9.0 or newer)
- **Python** (v3.8 or newer, optional for dataset re-generation)

### 1. Installation
Clone the repository or navigate to the directory:
```bash
cd "Sales Performance"
npm install
```

### 2. Start the Interactive Dev Server
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:5173
```

### 3. Build for Production
To create an optimized production bundle:
```bash
npm run build
```

### 4. (Optional) Regenerate Sales Dataset
To regenerate the 1,500 transaction dataset with new random seeds:
```bash
python scripts/generate_sales_data.py
```

---

## 💼 Portfolio & Interview Talking Points

When presenting this dashboard to hiring managers or stakeholders, highlight:
1. **Business-First Metric Design**: Focusing not just on top-line revenue, but on **profit margin retention** and **margin leakage**, demonstrating commercial acumen.
2. **Time Intelligence & Window Calculations**: Utilizing `LAG()` and cumulative window functions in SQL and `SAMEPERIODLASTYEAR()` / `DATEADD()` in DAX for YoY and MoM comparisons.
3. **80/20 Pareto Product Analysis**: Identifying the critical 20% of catalog items driving 80% of top-line revenue.
4. **Actionable Insights Engine**: Translating passive charts into automated, prioritized executive recommendations with quantifiable business impact.
