# Sales Performance Analytics - KPI & Formula Reference

This document provides complete, audit-grade definitions, mathematical formulas, SQL implementations, and Power BI DAX formulas for all Key Performance Indicators (KPIs) utilized throughout the Sales Performance Analytics platform.

---

## 1. Executive KPIs

### Total Revenue ($)
- **Business Purpose**: Measures the top-line gross income generated from sales across all products and channels after applied discounts.
- **Mathematical Formula**:
  $$\text{Total Revenue} = \sum (\text{Quantity} \times \text{Unit Price} \times (1 - \text{Discount}))$$
- **SQL Implementation**:
  ```sql
  SUM(revenue)
  ```
- **Power BI DAX**:
  ```dax
  Total Revenue = SUM(sales_transactions[revenue])
  ```

---

### Total Cost ($)
- **Business Purpose**: Measures the total Cost of Goods Sold (COGS) incurred to procure or manufacture the sold inventory.
- **Mathematical Formula**:
  $$\text{Total Cost} = \sum (\text{Quantity} \times \text{Unit Cost})$$
- **SQL Implementation**:
  ```sql
  SUM(cost)
  ```
- **Power BI DAX**:
  ```dax
  Total Cost = SUM(sales_transactions[cost])
  ```

---

### Total Profit ($)
- **Business Purpose**: Measures net operating earnings directly derived from order sales, evaluating true commercial viability.
- **Mathematical Formula**:
  $$\text{Total Profit} = \text{Total Revenue} - \text{Total Cost}$$
- **SQL Implementation**:
  ```sql
  SUM(revenue) - SUM(cost)
  ```
- **Power BI DAX**:
  ```dax
  Total Profit = [Total Revenue] - [Total Cost]
  ```

---

### Profit Margin (%)
- **Business Purpose**: Evaluates efficiency and pricing leverage by measuring how many cents of net profit are retained per dollar of revenue generated.
- **Mathematical Formula**:
  $$\text{Profit Margin (\%)} = \left( \frac{\text{Total Profit}}{\text{Total Revenue}} \right) \times 100$$
- **Edge Case Handling**: If Total Revenue is 0 or negative, return 0.0% to avoid division-by-zero errors.
- **SQL Implementation**:
  ```sql
  ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2)
  ```
- **Power BI DAX**:
  ```dax
  Profit Margin Pct = 
  DIVIDE([Total Profit], [Total Revenue], 0) * 100
  ```

---

### Total Orders (Count)
- **Business Purpose**: Measures total distinct transactional purchase events.
- **Mathematical Formula**:
  $$\text{Total Orders} = \text{Distinct Count}(\text{Order ID})$$
- **SQL Implementation**:
  ```sql
  COUNT(DISTINCT order_id)
  ```
- **Power BI DAX**:
  ```dax
  Total Orders = DISTINCTCOUNT(sales_transactions[order_id])
  ```

---

### Units Sold (Quantity)
- **Business Purpose**: Total volume of physical product units shipped.
- **Mathematical Formula**:
  $$\text{Units Sold} = \sum \text{Quantity}$$
- **SQL Implementation**:
  ```sql
  SUM(quantity)
  ```
- **Power BI DAX**:
  ```dax
  Total Units Sold = SUM(sales_transactions[quantity])
  ```

---

### Revenue Growth (%)
- **Business Purpose**: Quantifies the rate of top-line expansion between the active selected period and the corresponding prior baseline period (e.g. Month-over-Month or Year-over-Year).
- **Mathematical Formula**:
  $$\text{Revenue Growth (\%)} = \left( \frac{\text{Revenue}_{\text{Current}} - \text{Revenue}_{\text{Previous}}}{\text{Revenue}_{\text{Previous}}} \right) \times 100$$
- **SQL Implementation (Window Function)**:
  ```sql
  ROUND(
    (monthly_revenue - LAG(monthly_revenue, 1) OVER (ORDER BY sales_month)) 
    / NULLIF(LAG(monthly_revenue, 1) OVER (ORDER BY sales_month), 0) * 100,
    2
  )
  ```
- **Power BI DAX (MoM & YoY Time Intelligence)**:
  ```dax
  Revenue Prior Month = 
  CALCULATE([Total Revenue], DATEADD('Dim_Date'[Date], -1, MONTH))

  Revenue MoM Growth Pct = 
  DIVIDE([Total Revenue] - [Revenue Prior Month], [Revenue Prior Month], 0) * 100

  Revenue Prior Year = 
  CALCULATE([Total Revenue], SAMEPERIODLASTYEAR('Dim_Date'[Date]))

  Revenue YoY Growth Pct = 
  DIVIDE([Total Revenue] - [Revenue Prior Year], [Revenue Prior Year], 0) * 100
  ```

---

### Average Order Value (AOV)
- **Business Purpose**: Average revenue generated per distinct transaction.
- **Mathematical Formula**:
  $$\text{AOV} = \frac{\text{Total Revenue}}{\text{Total Orders}}$$
- **SQL Implementation**:
  ```sql
  ROUND(SUM(revenue) / NULLIF(COUNT(DISTINCT order_id), 0), 2)
  ```
- **Power BI DAX**:
  ```dax
  Average Order Value = 
  DIVIDE([Total Revenue], [Total Orders], 0)
  ```

---

## 2. Advanced Diagnostic Metrics

### Regional Contribution Share (%)
- **Formula**:
  $$\text{Regional Share (\%)} = \left( \frac{\text{Revenue}_{\text{Region}}}{\text{Total Revenue}_{\text{All Regions}}} \right) \times 100$$
- **Power BI DAX**:
  ```dax
  Regional Revenue Share Pct = 
  DIVIDE(
      [Total Revenue], 
      CALCULATE([Total Revenue], ALL(sales_transactions[region])), 
      0
  ) * 100
  ```

### High Revenue Low Margin Flag ("Margin Leakage")
- **Criterion**: $\text{Revenue} > \$250,000 \text{ AND } \text{Profit Margin} < 15\%$
- **Purpose**: Flags high-volume revenue drivers that fail to convert top-line growth into bottom-line equity.
- **Power BI DAX**:
  ```dax
  Margin Risk Flag = 
  IF(
      [Total Revenue] > 250000 && [Profit Margin Pct] < 15, 
      "Action Required", 
      "Healthy"
  )
  ```
