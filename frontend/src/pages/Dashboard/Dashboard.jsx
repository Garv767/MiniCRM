import React, { useEffect, useState } from 'react';
import { getLeads, updateLead, deleteLead } from '../../api/leadApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  // State Management
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('monthly');
  const [selectedLead, setSelectedLead] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const { data } = await getLeads();
      setLeads(data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  // Logic Handlers
  const handleStatusUpdate = async (id, newStatus) => {
    await updateLead(id, { status: newStatus });
    fetchData();
  };

  const handleAddFollowUp = async () => {
    if (!newNote) return;
    const updatedFollowUps = [...(selectedLead.followUps || []), { note: newNote, date: new Date() }];
    const { data } = await updateLead(selectedLead._id, { followUps: updatedFollowUps });
    setSelectedLead(data);
    setNewNote('');
    fetchData();
  };

  const confirmDelete = async (id) => {
    await deleteLead(id);
    setDeletingId(null);
    fetchData();
  };

  // Search and Analytics Filtering
  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChartData = () => {
    const now = new Date();
    const days = timeFilter === 'weekly' ? 7 : 30;
    const filteredByTime = leads.filter(l => (now - new Date(l.createdAt)) / (1000 * 60 * 60 * 24) <= days);
    
    return [
      { name: 'New', value: filteredByTime.filter(l => l.status === 'New').length, color: '#3b82f6' },
      { name: 'Contacted', value: filteredByTime.filter(l => l.status === 'Contacted').length, color: '#eab308' },
      { name: 'Converted', value: filteredByTime.filter(l => l.status === 'Converted').length, color: '#10b981' },
    ];
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header-flex">
        <h1 className="dashboard-title">CRM Command Center</h1>
        <select className="filter-select" value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
          <option value="monthly">Last 30 Days</option>
          <option value="weekly">Last 7 Days</option>
        </select>
      </div>

      {/* Analytics Grid */}
      <div className="analytics-grid">
        <div className="stats-cards">
          <div className="stat-card"><h3>Total Leads</h3><p>{leads.length}</p></div>
          <div className="stat-card"><h3>Active (New)</h3><p className="text-blue">{leads.filter(l => l.status === 'New').length}</p></div>
          <div className="stat-card"><h3>Converted</h3><p className="text-green">{leads.filter(l => l.status === 'Converted').length}</p></div>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={getChartData()} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                {getChartData().map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Controls */}
      <div className="dashboard-controls">
        <input 
          className="search-bar" 
          placeholder="Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="dashboard-table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th className="table-header">Contact</th>
              <th className="table-header">Status</th>
              <th className="table-header">Manage</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead._id} className="table-row">
                <td className="table-data">
                  <strong>{lead.name}</strong><br/>
                  <small className="text-slate">{lead.email}</small>
                </td>
                <td className="table-data">
                  <span className={`status-pill ${lead.status.toLowerCase()}`}>{lead.status}</span>
                </td>
                <td className="table-data">
                  <select 
                    className="status-select"
                    value={lead.status}
                    onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </td>
                <td className="table-data">
                  <div className="action-buttons">
                    <button className="view-btn" onClick={() => setSelectedLead(lead)}>Details</button>
                    {deletingId === lead._id ? (
                      <div className="confirm-group">
                        <button className="btn-confirm" onClick={() => confirmDelete(lead._id)}>Confirm</button>
                        <button className="btn-cancel" onClick={() => setDeletingId(null)}>X</button>
                      </div>
                    ) : (
                      <button className="btn-delete" onClick={() => setDeletingId(lead._id)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedLead(null)}>&times;</button>
            <h3>{selectedLead.name}</h3>
            <p className="lead-msg"><strong>Initial Message:</strong><br/>{selectedLead.notes || "No message provided"}</p>
            
            <div className="follow-up-section">
              <h4>Follow-up Notes</h4>
              <div className="history-list">
                {selectedLead.followUps?.map((f, i) => (
                  <div key={i} className="history-item">
                    <small>{new Date(f.date).toLocaleDateString()}</small>
                    <p>{f.note}</p>
                  </div>
                ))}
              </div>
              <textarea 
                className="note-input" 
                placeholder="Type a follow-up note..." 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button className="add-note-btn" onClick={handleAddFollowUp}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;