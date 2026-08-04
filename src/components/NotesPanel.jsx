import React, { useState } from 'react';

export default function NotesPanel({ notes = '', onSaveNotes }) {
  const [text, setText] = useState(notes);
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSave = () => {
    onSaveNotes(text);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div style={{
      backgroundColor: '#1c1917',
      border: '1px solid #78350f',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ color: '#fbbf24', margin: 0, fontSize: '18px' }}>📓 Блокнот сыщика</h3>
        {savedStatus && <span style={{ color: '#22c55e', fontSize: '13px' }}>Сохранено!</span>}
      </div>
      <p style={{ color: '#a8a29e', fontSize: '13px', marginBottom: '12px' }}>
        Записывайте гипотезы, улики, подозрительные имена и адреса. Данные сохраняются вместе с игрой.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Мои заметки по делу..."
        rows={8}
        style={{
          width: '100%',
          backgroundColor: '#12100e',
          color: '#fef3c7',
          border: '1px solid #78350f',
          borderRadius: '4px',
          padding: '12px',
          fontFamily: "'Special Elite', 'Courier New', monospace",
          fontSize: '15px',
          lineHeight: '1.5',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
        <button type="button" className="btn-primary" style={{ fontSize: '14px', padding: '8px 16px' }} onClick={handleSave}>
          Сохранить заметку
        </button>
      </div>
    </div>
  );
}
