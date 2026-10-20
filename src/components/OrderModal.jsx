import React from 'react';
import { X, CheckCircle, Package, Truck, User, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/analytics';

export default function OrderModal({ order, onClose }) {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
              <Package size={20} />
            </div>
            <div>
              <h3>Order Inspection: {order.Order_ID}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Ordered on {order.Order_Date} | Shipped on {order.Ship_Date}
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Financial Overview Banner */}
          <div className="modal-finance-box">
            <div className="finance-kpi">
              <h5>Net Revenue</h5>
              <p style={{ color: 'var(--cyan-500)' }}>{formatCurrency(order.Revenue)}</p>
            </div>
            <div className="finance-kpi">
              <h5>Total Cost (COGS)</h5>
              <p>{formatCurrency(order.Cost)}</p>
            </div>
            <div className="finance-kpi">
              <h5>Net Profit</h5>
              <p style={{ color: 'var(--teal-500)' }}>{formatCurrency(order.Profit)}</p>
            </div>
            <div className="finance-kpi">
              <h5>Profit Margin</h5>
              <p
                style={{
                  color:
                    order.Profit_Margin >= 25
                      ? 'var(--success)'
                      : order.Profit_Margin >= 18
                      ? 'var(--warning)'
                      : 'var(--danger)'
                }}
              >
                {formatPercent(order.Profit_Margin)}
              </p>
            </div>
          </div>

          {/* Product & Order Details Grid */}
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Product Name</span>
              <span className="detail-val">{order.Product_Name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category & Sub-Category</span>
              <span className="detail-val">
                {order.Category} &gt; {order.Sub_Category}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Customer Name</span>
              <span className="detail-val">
                {order.Customer_Name} ({order.Customer_ID})
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Customer Segment</span>
              <span className="detail-val">{order.Segment}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Geography & Destination</span>
              <span className="detail-val">
                {order.City}, {order.State} ({order.Region} Region)
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Sales Channel</span>
              <span className="detail-val">{order.Sales_Channel}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Unit Price & Quantity</span>
              <span className="detail-val">
                {formatCurrency(order.Unit_Price)} x {order.Quantity} Units
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Contract Discount</span>
              <span className="detail-val">
                {(order.Discount * 100).toFixed(0)}% Discount Applied
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Unit Cost</span>
              <span className="detail-val">{formatCurrency(order.Unit_Cost)} / unit</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Shipping Mode</span>
              <span className="detail-val">{order.Ship_Mode}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
