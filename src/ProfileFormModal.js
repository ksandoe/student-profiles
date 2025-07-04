import React, { useState, useEffect } from 'react';
import './ProfileFormModal.css';

export default function ProfileFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isEditing,
  onDelete,
  editingProfile
}) {
  const [form, setForm] = useState({
    name: '',
    'li-URL': '',
    'tb-URL': '',
    email: '',
    first: '',
    portal: '',
    SAP: '',
    section: '',
  });

  useEffect(() => {
    if (open) {
      setForm(initialData || {
        name: '',
        'li-URL': '',
        'tb-URL': '',
        email: '',
        first: '',
        portal: '',
        SAP: '',
        section: '',
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit Student' : 'Add Student'}</h2>
        <form onSubmit={e => {
          e.preventDefault();
          onSubmit(form);
        }}>
          <input type="text" placeholder="Name*" value={form.name || ''} required autoFocus onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="url" placeholder="LinkedIn URL" value={form['li-URL'] || ''} onChange={e => setForm({ ...form, 'li-URL': e.target.value })} />
          <input type="url" placeholder="Trailblazer URL" value={form['tb-URL'] || ''} onChange={e => setForm({ ...form, 'tb-URL': e.target.value })} />
          <input type="email" placeholder="Email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="text" placeholder="First Name" value={form.first || ''} onChange={e => setForm({ ...form, first: e.target.value })} />
          <input type="text" placeholder="Portal" value={form.portal || ''} onChange={e => setForm({ ...form, portal: e.target.value })} />
          <input type="number" placeholder="SAP" value={form.SAP || ''} onChange={e => setForm({ ...form, SAP: e.target.value })} />
          <input type="number" placeholder="Section" value={form.section || ''} onChange={e => setForm({ ...form, section: e.target.value })} />
          <div className="modal-actions">
            <button type="submit">{isEditing ? 'Save' : 'Add'}</button>
            <button type="button" onClick={onClose}>Cancel</button>
            {isEditing && editingProfile && (
              <button
                type="button"
                style={{ background: '#e74c3c', color: '#fff', marginLeft: 'auto' }}
                onClick={() => {
                  onDelete(editingProfile.id);
                  onClose();
                }}
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
