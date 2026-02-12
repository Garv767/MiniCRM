import React, { useState } from 'react';
import { createLead } from '../../api/leadApi';
import './Home.css';

const Home = () => {
  const [formData, setFormData] = useState({ name: '', email: '', notes: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createLead(formData);
      alert('Lead submitted successfully!');
      setFormData({ name: '', email: '', notes: '' });
    } catch (err) {
      alert('Error submitting lead');
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h2 className="home-title">Contact Us</h2>
        <form onSubmit={handleSubmit} className="home-form">
          <input 
            className="home-input" 
            placeholder="Name" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required 
          />
          <input 
            className="home-input" 
            type="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />
          <textarea 
            className="home-textarea" 
            placeholder="Message/Notes" 
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
          <button className="home-button">Submit Lead</button>
        </form>
      </div>
    </div>
  );
};

export default Home;