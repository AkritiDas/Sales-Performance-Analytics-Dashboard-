import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/analytics';

export default function SalesTable({
  data,
  onSelectOrder,
  onExportCsv
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('Order_Date');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Filter within table search
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const q = searchTerm.toLowerCase().trim();
    return data.filter(
      (r) =>
        r.Order_ID.toLowerCase().includes(q) ||
        r.Product_Name.toLowerCase().includes(q) ||
        r.Customer_Name.toLowerCase().includes(q) ||
        r.City.toLowerCase().includes(q) ||
        r.State.toLowerCase().includes(q) ||
        r.Category.toLowerCase().includes(q)
    );
  }, [data, searchTerm]);

  // Sort rows
  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [sortedRows, currentPage, pageSize]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} style={{ opacity: 0.4 }} />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp size={12} color="var(--teal-600)" />
    ) : (
      <ArrowDown size={12} color="var(--teal-600)" />
    );
  };

  return (
    <div className="table-card">
      <div className="table-toolbar">
        <div className="table-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="table-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
            <span>Show:</span>
            <select
              className="filter-select"
              style={{ width: '80px', height: '34px' }}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <button className="action-btn" onClick={onExportCsv}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="sales-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('Order_Date')}>
                <div className="th-content">
                  <span>Order Date</span>
                  {renderSortIcon('Order_Date')}
                </div>
              </th>
              <th onClick={() => handleSort('Order_ID')}>
                <div className="th-content">
                  <span>Order ID</span>
                  {renderSortIcon('Order_ID')}
                </div>
              </th>
              <th onClick={() => handleSort('Product_Name')}>
                <div className="th-content">
                  <span>Product Name</span>
                  {renderSortIcon('Product_Name')}
                </div>
              </th>
              <th onClick={() => handleSort('Category')}>
                <div className="th-content">
                  <span>Category</span>
                  {renderSortIcon('Category')}
                </div>
              </th>
              <th onClick={() => handleSort('Region')}>
                <div className="th-content">
                  <span>Region</span>
                  {renderSortIcon('Region')}
                </div>
              </th>
              <th onClick={() => handleSort('Quantity')}>
                <div className="th-content">
                  <span>Qty</span>
                  {renderSortIcon('Quantity')}
                </div>
              </th>
              <th onClick={() => handleSort('Revenue')}>
                <div className="th-content">
                  <span>Revenue</span>
                  {renderSortIcon('Revenue')}
                </div>
              </th>
              <th onClick={() => handleSort('Cost')}>
                <div className="th-content">
                  <span>Cost</span>
                  {renderSortIcon('Cost')}
                </div>
              </th>
              <th onClick={() => handleSort('Profit')}>
                <div className="th-content">
                  <span>Profit</span>
                  {renderSortIcon('Profit')}
                </div>
              </th>
              <th onClick={() => handleSort('Profit_Margin')}>
                <div className="th-content">
                  <span>Margin %</span>
                  {renderSortIcon('Profit_Margin')}
                </div>
              </th>
              <th style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={11} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                  No matching orders found. Try adjusting your search query or filters.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row) => (
                <tr key={row.Order_ID}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
                    {row.Order_Date}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--teal-600)' }}>
                    {row.Order_ID}
                  </td>
                  <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={row.Product_Name}>
                    {row.Product_Name}
                  </td>
                  <td>
                    <span
                      className={`pill-tag ${
                        row.Category === 'Technology'
                          ? 'tech'
                          : row.Category === 'Furniture'
                          ? 'furn'
                          : 'off'
                      }`}
                    >
                      {row.Category}
                    </span>
                  </td>
                  <td>
                    {row.City}, {row.State} ({row.Region})
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>{row.Quantity}</td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>
                    {formatCurrency(row.Revenue)}
                  </td>
                  <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                    {formatCurrency(row.Cost)}
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--teal-600)' }}>
                    {formatCurrency(row.Profit)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      className={`margin-chip ${
                        row.Profit_Margin >= 25
                          ? 'high'
                          : row.Profit_Margin >= 18
                          ? 'mid'
                          : 'low'
                      }`}
                    >
                      {formatPercent(row.Profit_Margin)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      className="icon-btn"
                      style={{ width: '30px', height: '30px', margin: '0 auto' }}
                      title="Inspect Order Details"
                      onClick={() => onSelectOrder(row)}
                    >
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
          Showing {(currentPage - 1) * pageSize + 1} to{' '}
          {Math.min(currentPage * pageSize, sortedRows.length)} of{' '}
          {sortedRows.length.toLocaleString()} records
        </span>

        <div className="pagination-controls">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={16} />
          </button>

          <span style={{ fontSize: '13px', fontWeight: 600, padding: '0 8px' }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
