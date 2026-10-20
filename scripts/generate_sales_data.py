import csv
import json
import random
import os
from datetime import datetime, timedelta

random.seed(42)

# Directory setup
os.makedirs("data", exist_ok=True)
os.makedirs("src/data", exist_ok=True)

# Master Data Definitions
PRODUCTS = [
    # Technology
    {"name": "MacBook Pro M3 Max 16-inch", "category": "Technology", "sub_category": "Laptops & Computers", "price": 3499.00, "cost": 2380.00},
    {"name": "Dell XPS 15 Enterprise", "category": "Technology", "sub_category": "Laptops & Computers", "price": 2199.00, "cost": 1580.00},
    {"name": "Lenovo ThinkPad X1 Carbon Gen 12", "category": "Technology", "sub_category": "Laptops & Computers", "price": 1899.00, "cost": 1350.00},
    {"name": "Apple iPhone 15 Pro Max 256GB", "category": "Technology", "sub_category": "Phones & Mobile", "price": 1199.00, "cost": 890.00},
    {"name": "Samsung Galaxy S24 Ultra", "category": "Technology", "sub_category": "Phones & Mobile", "price": 1299.00, "cost": 920.00},
    {"name": "Cisco Catalyst 9300 48-Port Switch", "category": "Technology", "sub_category": "Servers & Networking", "price": 4200.00, "cost": 2750.00},
    {"name": "HP Enterprise LaserJet Pro MFP", "category": "Technology", "sub_category": "Printers & Copiers", "price": 1450.00, "cost": 1120.00},
    {"name": "Dell UltraSharp 32 4K USB-C Monitor", "category": "Technology", "sub_category": "Accessories", "price": 899.00, "cost": 590.00},
    {"name": "Poly Studio X50 Video Bar", "category": "Technology", "sub_category": "Servers & Networking", "price": 2850.00, "cost": 1950.00},
    {"name": "Logitech MX Master 3S Wireless Mouse", "category": "Technology", "sub_category": "Accessories", "price": 99.00, "cost": 52.00},
    {"name": "Sony WH-1000XM5 ANC Headset", "category": "Technology", "sub_category": "Accessories", "price": 399.00, "cost": 240.00},
    {"name": "APC Smart-UPS 1500VA LCD", "category": "Technology", "sub_category": "Servers & Networking", "price": 750.00, "cost": 540.00},
    
    # Furniture
    {"name": "Herman Miller Aeron Ergonomic Chair", "category": "Furniture", "sub_category": "Executive Chairs", "price": 1695.00, "cost": 1050.00},
    {"name": "Steelcase Gesture Executive Chair", "category": "Furniture", "sub_category": "Executive Chairs", "price": 1480.00, "cost": 960.00},
    {"name": "Autonomous SmartDesk 4 Pro", "category": "Furniture", "sub_category": "Standing Desks", "price": 849.00, "cost": 510.00},
    {"name": "Vari Electric Standing Desk 60x30", "category": "Furniture", "sub_category": "Standing Desks", "price": 795.00, "cost": 530.00},
    {"name": "Bush Business Furniture 10ft Conference Table", "category": "Furniture", "sub_category": "Conference Tables", "price": 2150.00, "cost": 1590.00},
    {"name": "Hon Ignition 2.0 Task Chair", "category": "Furniture", "sub_category": "Executive Chairs", "price": 465.00, "cost": 310.00},
    {"name": "Sauder Heritage Hill 5-Shelf Bookcase", "category": "Furniture", "sub_category": "Bookcases & Storage", "price": 380.00, "cost": 290.00},
    {"name": "Safco Impromptu Mobile Training Table", "category": "Furniture", "sub_category": "Conference Tables", "price": 620.00, "cost": 440.00},
    {"name": "BenQ WiT e-Reading LED Desk Lamp", "category": "Furniture", "sub_category": "Office Lighting", "price": 229.00, "cost": 135.00},
    {"name": "Alera Elusion High-Back Mesh Chair", "category": "Furniture", "sub_category": "Executive Chairs", "price": 320.00, "cost": 240.00},

    # Office Supplies
    {"name": "Hammermill Premium Multipurpose Paper (Case)", "category": "Office Supplies", "sub_category": "Paper & Stationery", "price": 68.00, "cost": 42.00},
    {"name": "Fellowes Powershred 99Ci Cross-Cut Shredder", "category": "Office Supplies", "sub_category": "Breakroom Appliances", "price": 325.00, "cost": 215.00},
    {"name": "Avery Heavy-Duty 3-Ring View Binders (Pack of 12)", "category": "Office Supplies", "sub_category": "Binders & Filing", "price": 54.00, "cost": 29.00},
    {"name": "Keurig K-1500 Commercial Coffee Maker", "category": "Office Supplies", "sub_category": "Breakroom Appliances", "price": 249.00, "cost": 165.00},
    {"name": "Quartet Magnetic Glass Dry-Erase Board 4x3", "category": "Office Supplies", "sub_category": "Office Art & Boards", "price": 185.00, "cost": 105.00},
    {"name": "Dymo LabelWriter 550 Turbo", "category": "Office Supplies", "sub_category": "Paper & Stationery", "price": 149.00, "cost": 92.00},
    {"name": "Fellowes Bankers Box Heavy-Duty Storage (12-pk)", "category": "Office Supplies", "sub_category": "Storage & Organizers", "price": 72.00, "cost": 40.00},
    {"name": "3M Privacy Filter for 27-inch Monitors", "category": "Office Supplies", "sub_category": "Storage & Organizers", "price": 115.00, "cost": 65.00},
    {"name": "Expo Low-Odor Dry Erase Markers (Pack of 36)", "category": "Office Supplies", "sub_category": "Office Art & Boards", "price": 45.00, "cost": 22.00},
    {"name": "Smead Poly Expanding File Folders (Box of 10)", "category": "Office Supplies", "sub_category": "Binders & Filing", "price": 58.00, "cost": 31.00}
]

CUSTOMERS = [
    ("CUST-1001", "Apex Global Logistics", "Enterprise"),
    ("CUST-1002", "Nexus Health Systems", "Enterprise"),
    ("CUST-1003", "Vanguard Media Group", "Corporate"),
    ("CUST-1004", "Horizon Tech Labs", "Corporate"),
    ("CUST-1005", "Pinnacle Financial Services", "Enterprise"),
    ("CUST-1006", "Beacon Management Consulting", "Corporate"),
    ("CUST-1007", "Meridian Supply Chain", "Corporate"),
    ("CUST-1008", "Silverline Retail Partners", "Small Business"),
    ("CUST-1009", "Summit Industrial Works", "Enterprise"),
    ("CUST-1010", "BlueSky Cloud Solutions", "Corporate"),
    ("CUST-1011", "Crestview BioTech", "Small Business"),
    ("CUST-1012", "Atlas Architecture & Design", "Small Business"),
    ("CUST-1013", "OmniCorp International", "Enterprise"),
    ("CUST-1014", "Starlight Media Studios", "Small Business"),
    ("CUST-1015", "Kensington Law LLP", "Corporate"),
    ("CUST-1016", "Prime Retail Solutions", "Small Business"),
    ("CUST-1017", "Zenith Energy Dynamics", "Enterprise"),
    ("CUST-1018", "Elevate Marketing Agency", "Small Business"),
    ("CUST-1019", "Quantum AI Robotics", "Enterprise"),
    ("CUST-1020", "Heritage Financial Advisors", "Corporate"),
    ("CUST-1021", "Urban Retail Ventures", "Consumer"),
    ("CUST-1022", "Metro Design Collective", "Consumer"),
    ("CUST-1023", "Pacific Rim Trading", "Corporate"),
    ("CUST-1024", "Evergreen Healthcare", "Enterprise"),
    ("CUST-1025", "Liberty Insurance Group", "Enterprise")
]

REGIONS = {
    "East": [
        ("New York", "New York City"),
        ("Massachusetts", "Boston"),
        ("Pennsylvania", "Philadelphia"),
        ("New Jersey", "Newark"),
        ("Virginia", "Richmond")
    ],
    "West": [
        ("California", "Los Angeles"),
        ("California", "San Francisco"),
        ("Washington", "Seattle"),
        ("Colorado", "Denver"),
        ("Arizona", "Phoenix"),
        ("Oregon", "Portland")
    ],
    "Central": [
        ("Illinois", "Chicago"),
        ("Texas", "Dallas"),
        ("Texas", "Houston"),
        ("Ohio", "Columbus"),
        ("Michigan", "Detroit"),
        ("Minnesota", "Minneapolis")
    ],
    "South": [
        ("Florida", "Miami"),
        ("Florida", "Orlando"),
        ("Georgia", "Atlanta"),
        ("North Carolina", "Charlotte"),
        ("Tennessee", "Nashville"),
        ("Texas", "Austin")
    ]
}

CHANNELS = ["Direct Sales", "Online Portal", "Enterprise Partner", "Retail Wholesale"]
SHIP_MODES = ["Standard Class", "Second Class", "First Class", "Same Day"]

def generate_transactions(count=1500):
    start_date = datetime(2024, 1, 1)
    end_date = datetime(2025, 12, 31)
    total_days = (end_date - start_date).days

    rows = []
    
    for i in range(1, count + 1):
        # Weight year: 2024 (approx 44%), 2025 (approx 56% - showing ~15% YoY growth)
        is_2025 = random.random() < 0.55
        if is_2025:
            day_offset = random.randint(366, total_days)
        else:
            day_offset = random.randint(0, 365)
            
        order_date = start_date + timedelta(days=day_offset)
        order_id = f"ORD-{order_date.year}-{10000 + i}"
            
        ship_days = random.choices([1, 2, 3, 5, 7], weights=[10, 25, 35, 20, 10])[0]
        ship_date = order_date + timedelta(days=ship_days)
        ship_mode = random.choices(SHIP_MODES, weights=[55, 25, 15, 5])[0]
        
        customer = random.choice(CUSTOMERS)
        cust_id, cust_name, cust_segment = customer
        
        # Select Region
        region_name = random.choices(["East", "West", "Central", "South"], weights=[34, 32, 20, 14])[0]
        state, city = random.choice(REGIONS[region_name])
        
        product = random.choice(PRODUCTS)
        channel = random.choices(CHANNELS, weights=[35, 30, 20, 15])[0]
        
        # Quantity based on segment
        if cust_segment == "Enterprise":
            qty = random.randint(4, 18)
        elif cust_segment == "Corporate":
            qty = random.randint(2, 12)
        elif cust_segment == "Small Business":
            qty = random.randint(1, 8)
        else:
            qty = random.randint(1, 4)
            
        # Realistic discount structure
        discount_choice = random.choices([0.0, 0.05, 0.10, 0.15, 0.20, 0.25], weights=[45, 25, 15, 8, 5, 2])[0]
        
        gross_revenue = round(qty * product["price"], 2)
        revenue = round(gross_revenue * (1.0 - discount_choice), 2)
        cost = round(qty * product["cost"], 2)
        profit = round(revenue - cost, 2)
        profit_margin = round((profit / revenue * 100.0), 2) if revenue > 0 else 0.0
        
        row = {
            "Order_ID": order_id,
            "Order_Date": order_date.strftime("%Y-%m-%d"),
            "Ship_Date": ship_date.strftime("%Y-%m-%d"),
            "Ship_Mode": ship_mode,
            "Customer_ID": cust_id,
            "Customer_Name": cust_name,
            "Segment": cust_segment,
            "Region": region_name,
            "State": state,
            "City": city,
            "Category": product["category"],
            "Sub_Category": product["sub_category"],
            "Product_Name": product["name"],
            "Sales_Channel": channel,
            "Quantity": qty,
            "Unit_Price": product["price"],
            "Unit_Cost": product["cost"],
            "Discount": discount_choice,
            "Revenue": revenue,
            "Cost": cost,
            "Profit": profit,
            "Profit_Margin": profit_margin
        }
        rows.append(row)
        
    rows.sort(key=lambda x: x["Order_Date"])
    return rows

if __name__ == "__main__":
    records = generate_transactions(1500)
    
    # Save CSV
    csv_file = "data/sales_data.csv"
    fieldnames = list(records[0].keys())
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(records)
    print(f"Generated {len(records)} records into {csv_file}")
    
    # Save JSON for React frontend
    json_file = "src/data/salesData.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
    print(f"Generated JSON dataset into {json_file}")
    
    # Quick sanity metrics
    total_rev = sum(r["Revenue"] for r in records)
    total_prof = sum(r["Profit"] for r in records)
    total_qty = sum(r["Quantity"] for r in records)
    margin = (total_prof / total_rev) * 100.0
    print(f"Summary: Total Revenue = ${total_rev:,.2f}, Total Profit = ${total_prof:,.2f}, Overall Margin = {margin:.2f}%, Units = {total_qty:,}")
