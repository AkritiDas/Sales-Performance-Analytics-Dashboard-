# Power BI Implementation & DAX Architecture Guide

This guide outlines how to recreate this enterprise dashboard inside **Power BI Desktop**, including star-schema dimensional modeling, DAX time-intelligence calculations, and theme configurations.

---

## 1. Dimensional Data Modeling (Star Schema)

For enterprise scalability in Power BI, normalize `sales_data.csv` into a **Star Schema**:

```
                  +-------------------+
                  |     Dim_Date      |
                  +-------------------+
                  | Date (PK)         |
                  | Year, Month, Qtr  |
                  +---------+---------+
                            | 1
                            |
                            | *
+------------------+      +--v------------------+      +-------------------+
|   Dim_Product    |      |     Fact_Sales      |      |   Dim_Customer    |
+------------------+      +---------------------+      +-------------------+
| Product_Name(PK) |<1--* | Order_ID            | *--1>| Customer_ID (PK)  |
| Category         |      | Order_Date (FK)     |      | Customer_Name     |
| Sub_Category     |      | Customer_ID (FK)    |      | Segment           |
+------------------+      | Product_Name (FK)   |      +-------------------+
                          | Region (FK)         |
                          | Quantity            |
                          | Unit_Price          |
                          | Unit_Cost           |
                          | Discount            |
                          | Revenue             |
                          | Profit              |
                          +----------+----------+
                                     | *
                                     |
                                     | 1
                          +----------v----------+
                          |     Dim_Region      |
                          +---------------------+
                          | Region (PK)         |
                          | State, City         |
                          +---------------------+
```

---

## 2. Power BI DAX Measures Quick-Paste Library

Create a dedicated measure table called `_KPI Measures`:

```dax
// Base Aggregations
Total Revenue = SUM(Fact_Sales[Revenue])
Total Cost = SUM(Fact_Sales[Cost])
Total Profit = SUM(Fact_Sales[Profit])
Total Orders = DISTINCTCOUNT(Fact_Sales[Order_ID])
Units Sold = SUM(Fact_Sales[Quantity])

// Margin Calculation
Profit Margin % = 
DIVIDE([Total Profit], [Total Revenue], 0)

// Time Intelligence - Month over Month
Revenue Prior Month = 
CALCULATE([Total Revenue], DATEADD(Dim_Date[Date], -1, MONTH))

Revenue MoM % = 
DIVIDE([Total Revenue] - [Revenue Prior Month], [Revenue Prior Month], 0)

// Time Intelligence - Year over Year
Revenue Prior Year = 
CALCULATE([Total Revenue], SAMEPERIODLASTYEAR(Dim_Date[Date]))

Revenue YoY % = 
DIVIDE([Total Revenue] - [Revenue Prior Year], [Revenue Prior Year], 0)

// Contribution Share
Region % Share = 
DIVIDE([Total Revenue], CALCULATE([Total Revenue], ALL(Fact_Sales[Region])), 0)

// Dynamic Status Alert
Margin Health Status = 
SWITCH(
    TRUE(),
    [Profit Margin %] >= 0.28, "Excellent Margin (>=28%)",
    [Profit Margin %] >= 0.18, "Standard Margin (18-27%)",
    "Compressed Margin (<18%)"
)
```

---

## 3. Recommended Visual Configuration

1. **Top Row**: 6 KPI cards with dynamic trend badges and sparkline indicators.
2. **Left Mid Section**: Combo Visual (Line & Clustered Column Chart) displaying Revenue bars and Profit Margin % line across months.
3. **Right Mid Section**: Ranked Horizontal Bar Chart for Regional Revenue with % contribution data labels.
4. **Lower Left Section**: Top 10 Products by Revenue with interactive Category filter drill-through.
5. **Lower Right Section**: Scatter Chart / Matrix comparing Margin % against Revenue volume.
6. **Detailed Inspection**: Interactive drill-through grid with column sort, search, and CSV export.
