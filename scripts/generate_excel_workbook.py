import json
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def build_excel_workbook():
    with open("src/data/salesData.json", "r", encoding="utf-8") as f:
        records = json.load(f)

    wb = openpyxl.Workbook()
    # Remove default sheet
    default_sheet = wb.active
    wb.remove(default_sheet)

    # Styles
    navy_fill = PatternFill(start_color="0B132B", end_color="0B132B", fill_type="solid")
    teal_fill = PatternFill(start_color="0D9488", end_color="0D9488", fill_type="solid")
    header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
    bold_font = Font(name="Calibri", size=11, bold=True)
    normal_font = Font(name="Calibri", size=10)
    thin_border = Border(
        left=Side(style='thin', color='E2E8F0'),
        right=Side(style='thin', color='E2E8F0'),
        top=Side(style='thin', color='E2E8F0'),
        bottom=Side(style='thin', color='E2E8F0')
    )

    # -------------------------------------------------------------
    # SHEET 1: Transactions_Master
    # -------------------------------------------------------------
    ws1 = wb.create_sheet(title="Transactions_Master")
    headers = [
        "Order ID", "Order Date", "Ship Date", "Ship Mode", "Customer ID", 
        "Customer Name", "Segment", "Region", "State", "City", 
        "Category", "Sub-Category", "Product Name", "Sales Channel", 
        "Quantity", "Unit Price", "Unit Cost", "Discount", 
        "Revenue", "Cost", "Profit", "Profit Margin %"
    ]
    ws1.append(headers)

    for cell in ws1[1]:
        cell.fill = navy_fill
        cell.font = header_font
        cell.alignment = Alignment(horizontal="center", vertical="center")

    for r in records:
        row_vals = [
            r["Order_ID"], r["Order_Date"], r["Ship_Date"], r["Ship_Mode"], r["Customer_ID"],
            r["Customer_Name"], r["Segment"], r["Region"], r["State"], r["City"],
            r["Category"], r["Sub_Category"], r["Product_Name"], r["Sales_Channel"],
            r["Quantity"], r["Unit_Price"], r["Unit_Cost"], r["Discount"],
            r["Revenue"], r["Cost"], r["Profit"], r["Profit_Margin"]
        ]
        ws1.append(row_vals)

    # Format numbers
    for row in ws1.iter_rows(min_row=2, max_row=len(records)+1):
        for cell in row:
            cell.font = normal_font
            cell.border = thin_border
        row[14].number_format = '#,##0'       # Quantity
        row[15].number_format = '$#,##0.00'   # Unit Price
        row[16].number_format = '$#,##0.00'   # Unit Cost
        row[17].number_format = '0.0%'        # Discount
        row[18].number_format = '$#,##0.00'   # Revenue
        row[19].number_format = '$#,##0.00'   # Cost
        row[20].number_format = '$#,##0.00'   # Profit
        row[21].number_format = '0.0%'        # Margin %

    # -------------------------------------------------------------
    # SHEET 2: Executive_KPI_Summary
    # -------------------------------------------------------------
    ws2 = wb.create_sheet(title="Executive_KPI_Summary")
    ws2.append(["Enterprise Sales Performance - Executive Summary", ""])
    ws2["A1"].font = Font(name="Calibri", size=14, bold=True, color="0B132B")
    ws2.append([])

    kpis = [
        ("Total Gross Revenue", f"=SUM(Transactions_Master!S2:S{len(records)+1})", "$#,##0.00"),
        ("Total Cost of Goods Sold (COGS)", f"=SUM(Transactions_Master!T2:T{len(records)+1})", "$#,##0.00"),
        ("Total Net Profit", f"=B3-B4", "$#,##0.00"),
        ("Blended Profit Margin (%)", f"=(B5/B3)*100", "0.0%"),
        ("Total Units Sold", f"=SUM(Transactions_Master!O2:O{len(records)+1})", "#,##0"),
        ("Total Order Transactions", len(records), "#,##0"),
        ("Average Order Value (AOV)", f"=B3/B8", "$#,##0.00")
    ]

    ws2.append(["Executive Metric", "Calculated Value"])
    ws2["A3"].fill = teal_fill
    ws2["A3"].font = header_font
    ws2["B3"].fill = teal_fill
    ws2["B3"].font = header_font

    for label, formula, num_fmt in kpis:
        ws2.append([label, formula])
        last_row = ws2.max_row
        ws2[f"A{last_row}"].font = bold_font
        ws2[f"B{last_row}"].number_format = num_fmt
        ws2[f"B{last_row}"].font = bold_font
        ws2[f"A{last_row}"].border = thin_border
        ws2[f"B{last_row}"].border = thin_border

    # -------------------------------------------------------------
    # SHEET 3: Regional_Summary
    # -------------------------------------------------------------
    ws3 = wb.create_sheet(title="Regional_Breakdown")
    ws3.append(["Region", "Revenue", "Profit", "Profit Margin %", "Units Sold"])
    for cell in ws3[1]:
        cell.fill = navy_fill
        cell.font = header_font

    regions = ["East", "West", "Central", "South"]
    for reg in regions:
        reg_records = [r for r in records if r["Region"] == reg]
        rev = sum(r["Revenue"] for r in reg_records)
        prof = sum(r["Profit"] for r in reg_records)
        qty = sum(r["Quantity"] for r in reg_records)
        margin = (prof / rev) if rev > 0 else 0
        ws3.append([reg, rev, prof, margin, qty])
        row_idx = ws3.max_row
        ws3[f"A{row_idx}"].font = bold_font
        ws3[f"B{row_idx}"].number_format = '$#,##0.00'
        ws3[f"C{row_idx}"].number_format = '$#,##0.00'
        ws3[f"D{row_idx}"].number_format = '0.0%'
        ws3[f"E{row_idx}"].number_format = '#,##0'

    # Auto-adjust column widths for all sheets
    for ws in [ws1, ws2, ws3]:
        for col in ws.columns:
            max_len = 0
            col_letter = get_column_letter(col[0].column)
            for cell in col:
                val_str = str(cell.value or '')
                if len(val_str) > max_len:
                    max_len = len(val_str)
            ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

    output_path = "data/sales_performance_model.xlsx"
    wb.save(output_path)
    print(f"Successfully generated formatted Excel workbook: {output_path}")

if __name__ == "__main__":
    build_excel_workbook()
