-- ==============================================================================
-- SALES PERFORMANCE ANALYTICS - ENTERPRISE SQL SCRIPT
-- Senior Data Analyst & BI Developer Portfolio
-- Database Target: PostgreSQL / Snowflake / MySQL 8.0+ / MS SQL Server
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE CREATION & SCHEMA DEFINITION
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS sales_transactions;

CREATE TABLE sales_transactions (
    order_id        VARCHAR(30) PRIMARY KEY,
    order_date      DATE NOT NULL,
    ship_date       DATE NOT NULL,
    ship_mode       VARCHAR(30),
    customer_id     VARCHAR(20) NOT NULL,
    customer_name   VARCHAR(100) NOT NULL,
    segment         VARCHAR(50) NOT NULL,
    region          VARCHAR(50) NOT NULL,
    state           VARCHAR(50) NOT NULL,
    city            VARCHAR(50) NOT NULL,
    category        VARCHAR(50) NOT NULL,
    sub_category    VARCHAR(50) NOT NULL,
    product_name    VARCHAR(150) NOT NULL,
    sales_channel   VARCHAR(50) NOT NULL,
    quantity        INT NOT NULL,
    unit_price      NUMERIC(12, 2) NOT NULL,
    unit_cost       NUMERIC(12, 2) NOT NULL,
    discount        NUMERIC(5, 2) DEFAULT 0.00,
    revenue         NUMERIC(14, 2) NOT NULL,
    cost            NUMERIC(14, 2) NOT NULL,
    profit          NUMERIC(14, 2) NOT NULL,
    profit_margin   NUMERIC(6, 2) NOT NULL
);

-- Indexing for high-performance analytics queries
CREATE INDEX idx_sales_order_date ON sales_transactions (order_date);
CREATE INDEX idx_sales_region ON sales_transactions (region);
CREATE INDEX idx_sales_category ON sales_transactions (category);
CREATE INDEX idx_sales_customer ON sales_transactions (customer_id);

-- ------------------------------------------------------------------------------
-- 2. EXECUTIVE OVERVIEW - CORE KPIS
-- ------------------------------------------------------------------------------
-- Calculates macro business KPIs across total sales volume
SELECT 
    COUNT(DISTINCT order_id)                                  AS total_orders,
    SUM(quantity)                                             AS total_units_sold,
    ROUND(SUM(revenue), 2)                                    AS total_revenue,
    ROUND(SUM(cost), 2)                                       AS total_cost,
    ROUND(SUM(profit), 2)                                     AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2)   AS overall_profit_margin_pct,
    ROUND(SUM(revenue) / COUNT(DISTINCT order_id), 2)         AS average_order_value_aov
FROM sales_transactions;

-- ------------------------------------------------------------------------------
-- 3. MONTH-OVER-MONTH (MoM) TRENDS & GROWTH ANALYSIS
-- ------------------------------------------------------------------------------
-- Uses LAG() window function to calculate monthly revenue, profit, and MoM % growth
WITH monthly_sales AS (
    SELECT 
        DATE_TRUNC('month', order_date)::DATE AS sales_month,
        TO_CHAR(order_date, 'YYYY-MM')        AS year_month,
        COUNT(DISTINCT order_id)              AS order_count,
        SUM(quantity)                         AS units_sold,
        ROUND(SUM(revenue), 2)                AS monthly_revenue,
        ROUND(SUM(profit), 2)                 AS monthly_profit,
        ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2) AS monthly_margin_pct
    FROM sales_transactions
    GROUP BY 1, 2
)
SELECT 
    year_month,
    order_count,
    units_sold,
    monthly_revenue,
    monthly_profit,
    monthly_margin_pct,
    LAG(monthly_revenue, 1) OVER (ORDER BY sales_month) AS prev_month_revenue,
    ROUND(
        (monthly_revenue - LAG(monthly_revenue, 1) OVER (ORDER BY sales_month)) 
        / NULLIF(LAG(monthly_revenue, 1) OVER (ORDER BY sales_month), 0) * 100, 
        2
    ) AS mom_revenue_growth_pct,
    ROUND(
        (monthly_profit - LAG(monthly_profit, 1) OVER (ORDER BY sales_month)) 
        / NULLIF(LAG(monthly_profit, 1) OVER (ORDER BY sales_month), 0) * 100, 
        2
    ) AS mom_profit_growth_pct
FROM monthly_sales
ORDER BY sales_month;

-- ------------------------------------------------------------------------------
-- 4. YEAR-OVER-YEAR (YoY) ANNUAL & QUARTERLY COMPARISON
-- ------------------------------------------------------------------------------
WITH quarterly_metrics AS (
    SELECT 
        EXTRACT(YEAR FROM order_date)  AS sales_year,
        EXTRACT(QUARTER FROM order_date) AS sales_quarter,
        ROUND(SUM(revenue), 2)         AS quarter_revenue,
        ROUND(SUM(profit), 2)          AS quarter_profit,
        COUNT(DISTINCT order_id)       AS quarter_orders
    FROM sales_transactions
    GROUP BY 1, 2
)
SELECT 
    curr.sales_year,
    curr.sales_quarter,
    curr.quarter_revenue,
    curr.quarter_profit,
    prev.quarter_revenue               AS prev_year_same_quarter_revenue,
    ROUND(
        (curr.quarter_revenue - prev.quarter_revenue) 
        / NULLIF(prev.quarter_revenue, 0) * 100, 
        2
    ) AS yoy_quarterly_growth_pct
FROM quarterly_metrics curr
LEFT JOIN quarterly_metrics prev
    ON curr.sales_quarter = prev.sales_quarter
   AND curr.sales_year = prev.sales_year + 1
ORDER BY curr.sales_year, curr.sales_quarter;

-- ------------------------------------------------------------------------------
-- 5. TOP 10 PRODUCTS BY REVENUE WITH PARETO CUMULATIVE SHARE (80/20 RULE)
-- ------------------------------------------------------------------------------
WITH product_summary AS (
    SELECT 
        product_name,
        category,
        sub_category,
        COUNT(DISTINCT order_id)                                AS orders_count,
        SUM(quantity)                                           AS total_quantity,
        ROUND(SUM(revenue), 2)                                  AS product_revenue,
        ROUND(SUM(profit), 2)                                   AS product_profit,
        ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2) AS profit_margin_pct
    FROM sales_transactions
    GROUP BY product_name, category, sub_category
),
product_ranked AS (
    SELECT 
        *,
        DENSE_RANK() OVER (ORDER BY product_revenue DESC) AS revenue_rank,
        ROUND(
            (SUM(product_revenue) OVER (ORDER BY product_revenue DESC ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) 
            / SUM(product_revenue) OVER ()) * 100,
            2
        ) AS cumulative_revenue_pct
    FROM product_summary
)
SELECT *
FROM product_ranked
WHERE revenue_rank <= 10
ORDER BY revenue_rank;

-- ------------------------------------------------------------------------------
-- 6. MARGIN RISK ANALYSIS: HIGH REVENUE BUT LOW MARGIN PRODUCTS
-- ------------------------------------------------------------------------------
-- Identifies products that generate substantial revenue volume but have profit margin < 20%
SELECT 
    product_name,
    category,
    ROUND(SUM(revenue), 2)                                  AS total_revenue,
    ROUND(SUM(profit), 2)                                   AS total_profit,
    ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2) AS profit_margin_pct,
    CASE 
        WHEN (SUM(profit) / NULLIF(SUM(revenue), 0)) < 0.15 THEN 'High Risk / Review Discounting'
        WHEN (SUM(profit) / NULLIF(SUM(revenue), 0)) BETWEEN 0.15 AND 0.25 THEN 'Moderate Margin'
        ELSE 'Healthy Margin'
    END AS profitability_status
FROM sales_transactions
GROUP BY product_name, category
HAVING SUM(revenue) > 200000
ORDER BY profit_margin_pct ASC;

-- ------------------------------------------------------------------------------
-- 7. REGIONAL PERFORMANCE RANKING & PERCENTAGE CONTRIBUTION
-- ------------------------------------------------------------------------------
SELECT 
    region,
    COUNT(DISTINCT state)                                   AS states_covered,
    COUNT(DISTINCT order_id)                                AS order_volume,
    SUM(quantity)                                           AS total_units,
    ROUND(SUM(revenue), 2)                                  AS regional_revenue,
    ROUND(SUM(profit), 2)                                   AS regional_profit,
    ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2) AS regional_margin_pct,
    ROUND(
        (SUM(revenue) / SUM(SUM(revenue)) OVER ()) * 100, 
        2
    ) AS revenue_share_pct
FROM sales_transactions
GROUP BY region
ORDER BY regional_revenue DESC;

-- ------------------------------------------------------------------------------
-- 8. SALES CHANNEL EFFICIENCY & CONVERSION BREAKDOWN
-- ------------------------------------------------------------------------------
SELECT 
    sales_channel,
    COUNT(DISTINCT order_id)                                AS total_orders,
    ROUND(SUM(revenue), 2)                                  AS channel_revenue,
    ROUND(SUM(profit), 2)                                   AS channel_profit,
    ROUND((SUM(profit) / NULLIF(SUM(revenue), 0)) * 100, 2) AS channel_margin_pct,
    ROUND(AVG(discount) * 100, 2)                           AS avg_discount_given_pct,
    ROUND(SUM(revenue) / COUNT(DISTINCT order_id), 2)       AS average_order_value
FROM sales_transactions
GROUP BY sales_channel
ORDER BY channel_revenue DESC;

-- ------------------------------------------------------------------------------
-- 9. CUSTOMER RFM (RECENCY, FREQUENCY, MONETARY) METRICS
-- ------------------------------------------------------------------------------
WITH customer_aggregations AS (
    SELECT 
        customer_id,
        customer_name,
        segment,
        MAX(order_date)                           AS last_order_date,
        COUNT(DISTINCT order_id)                  AS order_frequency,
        ROUND(SUM(revenue), 2)                    AS total_monetary_spend,
        ROUND(AVG(profit), 2)                     AS avg_profit_per_order
    FROM sales_transactions
    GROUP BY customer_id, customer_name, segment
)
SELECT 
    customer_id,
    customer_name,
    segment,
    last_order_date,
    ('2025-12-31'::DATE - last_order_date)        AS days_since_last_order_recency,
    order_frequency,
    total_monetary_spend,
    NTILE(4) OVER (ORDER BY total_monetary_spend DESC) AS monetary_tier
FROM customer_aggregations
ORDER BY total_monetary_spend DESC;
