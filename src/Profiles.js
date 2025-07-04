import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import ProfileFormModal from './ProfileFormModal';
import CSVImport from './CSVImport';
import SAPGenerator from './SAPGenerator';
const liImg = process.env.PUBLIC_URL + '/li.png';
const thImg = process.env.PUBLIC_URL + '/th.png';

const initialForm = {
  name: '',
  'li-URL': '',
  'tb-URL': '',
  email: '',
  first: '',
  portal: '',
  SAP: '',
  section: '',
};

function Profiles() {
  const [sapModalOpen, setSapModalOpen] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [sectionFilter, setSectionFilter] = useState("");

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name');
    console.log('Supabase fetch:', { data, error });
    if (error) setError(error.message);
    else setProfiles(data);
    setLoading(false);
  }

  async function handleSave(form) {
    const payload = {
      name: form.name,
      'li-URL': form['li-URL'] || null,
      'tb-URL': form['tb-URL'] || null,
      email: form.email || null,
      first: form.first || null,
      portal: form.portal || null,
      SAP: form.SAP !== '' ? Number(form.SAP) : null,
      section: form.section !== '' ? Number(form.section) : null,
    };
    if (editingProfile) {
      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', editingProfile.id);
      if (error) setError(error.message);
    } else {
      const { error } = await supabase
        .from('profiles')
        .insert([payload]);
      if (error) setError(error.message);
    }
    setModalOpen(false);
    setEditingProfile(null);
    fetchProfiles();
  }

  function handleEdit(profile) {
    setEditingProfile(profile);
    setModalOpen(true);
  }

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) setError(error.message);
    fetchProfiles();
  }

  function handleAdd() {
    setEditingProfile(null);
    setModalOpen(true);
  }

  async function handleAssignSAP(toAssign, sapNumbers) {
    // Assign SAP numbers to profiles and update in Supabase
    const updates = toAssign.map((profile, idx) => ({ id: profile.id, SAP: sapNumbers[idx] }));
    for (const update of updates) {
      await supabase.from('profiles').update({ SAP: update.SAP }).eq('id', update.id);
    }
    fetchProfiles();
  }

  async function handleCSVImport(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return;
    // Detect LMS CSV by header keys
    const isLMS = rows[0] && (
      'Student Name' in rows[0] &&
      'Student SIS ID' in rows[0] &&
      'Email' in rows[0] &&
      'Section Name' in rows[0]
    );
    let profilesToInsert;
    if (isLMS) {
      profilesToInsert = rows.map(row => {
        const name = row['Student Name'] || '';
        const first = name.split(' ')[0] || '';
        const email = row['Email'] || '';
        // Parse portal from email
        const portal = email.split('@')[0] || '';
        // Parse section number from 'Section Name'
        let section = '';
        const sectionMatch = (row['Section Name'] || '').match(/MINS 301 - (\d+) Corporate Tech Integration/);
        if (sectionMatch) {
          section = sectionMatch[1];
        }
        // Assign Student SIS ID to id. SAP will be assigned later.
        const id = row['Student SIS ID'] !== undefined && row['Student SIS ID'] !== '' ? Number(row['Student SIS ID']) : null;
        return {
          id,
          name,
          'li-URL': '',
          'tb-URL': '',
          email,
          first,
          portal,
          SAP: null,
          section,
        };
      });
    } else {
      profilesToInsert = rows.map(row => ({
        name: row.name || '',
        'li-URL': row['li-URL'] || '',
        'tb-URL': row['tb-URL'] || '',
        email: row.email || '',
        first: row.first || '',
        portal: row.portal || '',
        SAP: row.SAP !== undefined && row.SAP !== '' ? Number(row.SAP) : null,
        section: row.section !== undefined && row.section !== '' ? Number(row.section) : null,
      }));
    }
    const { error } = await supabase.from('profiles').insert(profilesToInsert);
    if (error) {
      alert('Error importing some or all rows: ' + error.message);
    }
    fetchProfiles();
  }


  return (
    <>
      <div style={{ maxWidth: 700, margin: '2rem auto', fontFamily: 'verdana', fontSize: 18 }}>
        <h2>Student Profiles</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <CSVImport onImport={handleCSVImport} buttonStyle={{
            flex: 1,
            minWidth: 160,
            padding: '12px 0',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'background 0.2s',
            textAlign: 'center',
          }} hoverStyle={{ background: '#1565c0' }} label="Import students" />
          <button
            style={{
              flex: 1,
              minWidth: 160,
              padding: '12px 0',
              background: '#388e3c',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s',
              textAlign: 'center',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#2e7031')}
            onMouseOut={e => (e.currentTarget.style.background = '#388e3c')}
            onClick={() => setSapModalOpen(true)}
          >
            Assign SAP IDs
          </button>
          <button
            style={{
              flex: 1,
              minWidth: 160,
              padding: '12px 0',
              background: '#f57c00',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 16,
              cursor: 'pointer',
              transition: 'background 0.2s',
              textAlign: 'center',
            }}
            onMouseOver={e => (e.currentTarget.style.background = '#ef6c00')}
            onMouseOut={e => (e.currentTarget.style.background = '#f57c00')}
            onClick={handleAdd}
          >
            Add one student
          </button>
        </div>
        {/* Section Filter Dropdown */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <label htmlFor="section-filter" style={{ fontWeight: 500 }}>Filter by section:</label>
          <select
            id="section-filter"
            value={sectionFilter}
            onChange={e => setSectionFilter(e.target.value)}
            style={{ padding: '7px 14px', fontSize: 15, borderRadius: 5 }}
          >
            <option value="">All sections</option>
            {Array.from(new Set(profiles.map(p => p.section).filter(s => s !== null && s !== undefined && s !== '')))
              .sort((a,b) => a-b)
              .map(section => (
                <option key={section} value={section}>{section}</option>
              ))}
          </select>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div>
            {(sectionFilter
              ? profiles.filter(p => String(p.section) === String(sectionFilter))
              : profiles
            ).map((profile) => (
              <div key={profile.id} style={{ margin: '8px 0', lineHeight: 2 }}>
                <span style={{ cursor: 'pointer', color: '#1976d2', textDecoration: 'underline' }} onClick={() => handleEdit(profile)}>
                  {profile.name}
                </span>
                {profile['li-URL'] && (
                  <a href={profile['li-URL']} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
                    <img src={liImg} alt="LinkedIn" style={{ width: 22, height: 22, verticalAlign: 'middle' }} />
                  </a>
                )}
                {profile['tb-URL'] && (
                  <a href={profile['tb-URL']} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                    <img src={thImg} alt="Trailblazer" style={{ width: 18, height: 18, verticalAlign: 'middle' }} />
                  </a>
                )}
                {profile.portal && (
                  <span style={{ marginLeft: 8, color: '#444' }}>| {profile.portal}: {profile.SAP}</span>
                )}
              </div>
            ))}
          </div>
        )}


      </div>

      {/* SAP Generator Modal */}
      {sapModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 16px #0003', minWidth: 360, padding: 24, position: 'relative' }}>
            <button onClick={() => setSapModalOpen(false)} style={{ position: 'absolute', top: 8, right: 12, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
            <SAPGenerator profiles={profiles} onAssignSAP={async (...args) => { await handleAssignSAP(...args); setSapModalOpen(false); }} />
          </div>
        </div>
      )}
      <ProfileFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProfile(null); }}
        onSubmit={handleSave}
        initialData={editingProfile}
        isEditing={!!editingProfile}
        onDelete={handleDelete}
        editingProfile={editingProfile}
      />
    </>
  );
}

export default Profiles;
