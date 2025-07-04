import React, { useState } from 'react';

export default function SAPGenerator({ profiles, onAssignSAP }) {
  const [rangeStart, setRangeStart] = useState(100);
  const [rangeEnd, setRangeEnd] = useState(999);
  const [blackoutStart, setBlackoutStart] = useState('');
  const [blackoutEnd, setBlackoutEnd] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');

  function getAvailableSAPs(count) {
    let sapList = [];
    let start = parseInt(rangeStart, 10);
    let end = parseInt(rangeEnd, 10);
    let blackoutS = blackoutStart ? parseInt(blackoutStart, 10) : null;
    let blackoutE = blackoutEnd ? parseInt(blackoutEnd, 10) : null;
    for (let i = start; i <= end; i++) {
      if (
        (blackoutS !== null && blackoutE !== null && i >= blackoutS && i <= blackoutE)
      ) continue;
      sapList.push(i);
    }
    return sapList.slice(0, count);
  }

  async function handleAssignSAP() {
    setError('');
    setAssigning(true);
    const toAssign = profiles.filter(p => !p.SAP || isNaN(Number(p.SAP)));
    const sapNumbers = getAvailableSAPs(toAssign.length);
    if (sapNumbers.length < toAssign.length) {
      setError('Not enough SAP numbers available for all students.');
      setAssigning(false);
      return;
    }
    await onAssignSAP(toAssign, sapNumbers);
    setAssigning(false);
  }

  return (
    <div style={{ border: '1px solid #ccc', padding: 16, margin: '16px 0', borderRadius: 8 }}>
      <h3>Generate SAP Numbers</h3>
      <div style={{ marginBottom: 8 }}>
        <label>Range Start: <input type="number" min={100} max={999} value={rangeStart} onChange={e => setRangeStart(e.target.value)} style={{ width: 60 }}/></label>
        <label style={{ marginLeft: 12 }}>Range End: <input type="number" min={100} max={999} value={rangeEnd} onChange={e => setRangeEnd(e.target.value)} style={{ width: 60 }}/></label>
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>Blackout Start: <input type="number" min={100} max={999} value={blackoutStart} onChange={e => setBlackoutStart(e.target.value)} style={{ width: 60 }}/></label>
        <label style={{ marginLeft: 12 }}>Blackout End: <input type="number" min={100} max={999} value={blackoutEnd} onChange={e => setBlackoutEnd(e.target.value)} style={{ width: 60 }}/></label>
      </div>
      <button onClick={handleAssignSAP} disabled={assigning}>Assign SAP Numbers</button>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
    </div>
  );
}
