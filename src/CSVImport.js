import React, { useRef } from 'react';
import Papa from 'papaparse';

export default function CSVImport({ onImport, label = 'Import from CSV', buttonStyle = {}, hoverStyle = {} }) {
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        onImport(results.data);
        fileInputRef.current.value = '';
      },
      error: (err) => {
        alert('CSV parsing error: ' + err.message);
      },
    });
  };

  return (
    <>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        style={buttonStyle}
        onMouseOver={e => {
          if (hoverStyle && Object.keys(hoverStyle).length) {
            Object.entries(hoverStyle).forEach(([k, v]) => (e.currentTarget.style[k] = v));
          }
        }}
        onMouseOut={e => {
          if (buttonStyle && Object.keys(buttonStyle).length) {
            Object.entries(buttonStyle).forEach(([k, v]) => (e.currentTarget.style[k] = v));
          }
        }}
      >
        {label}
      </button>
    </>
  );
}
