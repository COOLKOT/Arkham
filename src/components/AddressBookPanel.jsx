import React, { useState } from 'react';
import { ADDRESS_BOOK } from '../addressBook';

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  panel: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#1c1917',
    color: '#fef3c7',
    fontFamily: 'Georgia, serif',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    borderLeft: '2px solid #78350f',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #78350f',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#292524',
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#f59e0b',
    margin: 0,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
  closeBtn: {
    background: 'none',
    border: '1px solid #78350f',
    color: '#a8a29e',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '4px 12px',
    borderRadius: '4px',
    lineHeight: 1,
  },
  searchContainer: {
    padding: '12px 20px',
    borderBottom: '1px solid #78350f',
  },
  searchInput: {
    width: '100%',
    backgroundColor: '#1c1917',
    border: '1px solid #78350f',
    borderRadius: '4px',
    padding: '10px 14px',
    color: '#fef3c7',
    fontSize: '15px',
    outline: 'none',
    fontFamily: 'Georgia, serif',
    boxSizing: 'border-box',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 20px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fbbf24',
    marginTop: '16px',
    marginBottom: '8px',
    paddingBottom: '4px',
    borderBottom: '1px solid #44403c',
  },
  entry: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    marginBottom: '4px',
    borderRadius: '4px',
    backgroundColor: '#292524',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  },
  entryName: {
    fontSize: '14px',
    color: '#d6d3d1',
    flex: 1,
  },
  entryCode: {
    fontSize: '13px',
    color: '#f59e0b',
    fontWeight: 'bold',
    fontFamily: '"Courier New", monospace',
    backgroundColor: '#1c1917',
    padding: '2px 8px',
    borderRadius: '3px',
    border: '1px solid #78350f',
    marginLeft: '12px',
    whiteSpace: 'nowrap',
  },
  noResults: {
    textAlign: 'center',
    color: '#a8a29e',
    fontSize: '14px',
    padding: '32px 0',
  },
};

export default function AddressBookPanel({ isOpen, onClose, onSelectAddress }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  // Фильтрация
  const hasSearch = search.trim().length > 0;

  const filtered = hasSearch
    ? ADDRESS_BOOK.filter(
        entry =>
          entry.name.toLowerCase().includes(search.toLowerCase()) ||
          entry.code.toLowerCase().includes(search.toLowerCase())
      )
    : ADDRESS_BOOK;

  const totalResults = filtered.length;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.panel} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>📖 Адресная книга</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.searchContainer}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по названию или коду..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.listContainer}>
          {totalResults === 0 ? (
            <div style={styles.noResults}>Ничего не найдено</div>
          ) : (
            filtered.map((entry, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.entry,
                  backgroundColor: onSelectAddress ? '#292524' : '#292524',
                  cursor: onSelectAddress ? 'pointer' : 'default',
                }}
                onClick={() => onSelectAddress?.(entry.code)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#f59e0b';
                  e.currentTarget.style.backgroundColor = '#3f3732';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'transparent';
                  e.currentTarget.style.backgroundColor = '#292524';
                }}
              >
                <span style={styles.entryName}>{entry.name}</span>
                <span style={styles.entryCode}>{entry.code}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
