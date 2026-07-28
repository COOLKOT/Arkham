import React, { useState } from 'react';
import { ADDRESS_BOOK_SECTIONS } from '../addressBookSections';

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
    maxWidth: '900px',
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
  tabsBar: {
    width: '200px',
    backgroundColor: '#292524',
    borderRight: '2px solid #78350f',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    padding: '8px',
    gap: '4px',
    flexShrink: 0,
  },
  tab: {
    padding: '8px 10px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#a8a29e',
    backgroundColor: 'transparent',
    border: 'none',
    borderLeft: '3px solid transparent',
    cursor: 'pointer',
    fontFamily: 'Georgia, serif',
    transition: 'all 0.2s',
    textAlign: 'left',
    lineHeight: 1.2,
    minHeight: '36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tabActive: {
    color: '#f59e0b',
    borderLeftColor: '#f59e0b',
    backgroundColor: '#1c1917',
  },
  tabCount: {
    display: 'block',
    fontSize: '10px',
    color: '#78350f',
    fontWeight: 'normal',
    marginTop: '2px',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  breadcrumb: {
    padding: '10px 20px',
    borderBottom: '1px solid #78350f',
    backgroundColor: '#292524',
    fontSize: '14px',
    color: '#a8a29e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  breadcrumbBack: {
    background: 'none',
    border: 'none',
    color: '#f59e0b',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: 'Georgia, serif',
    padding: '0 8px',
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
    padding: '0 20px 12px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  tableTh: {
    position: 'sticky',
    top: 0,
    backgroundColor: '#292524',
    color: '#f59e0b',
    fontWeight: 'bold',
    padding: '10px 14px',
    textAlign: 'left',
    borderBottom: '2px solid #78350f',
    zIndex: 1,
    fontSize: '13px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  tableTd: {
    padding: '8px 14px',
    borderBottom: '1px solid #292524',
    color: '#d6d3d1',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  tableCode: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontFamily: '"Courier New", monospace',
    fontSize: '13px',
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
  const [selectedSection, setSelectedSection] = useState(null);

  if (!isOpen) return null;

  const hasSearch = search.trim().length > 0;

  const filteredEntries = hasSearch
    ? ADDRESS_BOOK_SECTIONS.flatMap(section =>
        section.entries.filter(
          entry =>
            entry.name.toLowerCase().includes(search.toLowerCase()) ||
            entry.code.toLowerCase().includes(search.toLowerCase())
        )
      )
    : null;

  const currentSection = selectedSection
    ? ADDRESS_BOOK_SECTIONS.find(s => s.name === selectedSection)
    : null;

  const entries = hasSearch ? filteredEntries : (currentSection?.entries || []);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <style>{`
        @media (max-width: 600px) {
          .ab-panel {
            max-width: 100% !important;
          }
          .ab-panel .ab-tabs {
            width: 140px !important;
          }
          .ab-panel .ab-breadcrumb {
            padding: 8px 12px !important;
            font-size: 12px !important;
          }
          .ab-panel .ab-search {
            padding: 8px 12px !important;
          }
          .ab-panel .ab-search input {
            padding: 8px 10px !important;
            font-size: 13px !important;
          }
          .ab-panel .ab-list {
            padding: 0 12px 8px !important;
          }
          .ab-panel .ab-table th {
            padding: 8px 10px !important;
            font-size: 11px !important;
          }
          .ab-panel .ab-table td {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
      <div className="ab-panel" style={styles.panel} onClick={e => e.stopPropagation()}>
        {/* Заголовок */}
        <div style={styles.header}>
          <h2 style={styles.title}>Адресная книга</h2>
          <button style={styles.closeBtn} onClick={onClose}>X</button>
        </div>

        {/* Вкладки слева и контент справа */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Вертикальные вкладки */}
          <div className="ab-tabs" style={styles.tabsBar}>
            {/* Вкладка "Все" */}
            <button
              style={{
                ...styles.tab,
                ...(selectedSection === null ? styles.tabActive : {}),
              }}
              onClick={() => {
                setSelectedSection(null);
                setSearch('');
              }}
            >
              Все
              <span style={styles.tabCount}>({ADDRESS_BOOK_SECTIONS.reduce((sum, s) => sum + s.entries.length, 0)})</span>
            </button>

            {/* Вкладки секций */}
            {ADDRESS_BOOK_SECTIONS.map(section => (
              <button
                key={section.name}
                style={{
                  ...styles.tab,
                  ...(selectedSection === section.name ? styles.tabActive : {}),
                }}
                onClick={() => {
                  setSelectedSection(section.name);
                  setSearch('');
                }}
              >
                {section.name}
                <span style={styles.tabCount}>({section.entries.length})</span>
              </button>
            ))}
          </div>

          {/* Контент */}
          <div style={styles.content}>
            {/* Хлебные крошки */}
            <div className="ab-breadcrumb" style={styles.breadcrumb}>
              {selectedSection && (
                <button
                  style={styles.breadcrumbBack}
                  onClick={() => {
                    setSelectedSection(null);
                    setSearch('');
                  }}
                >
                  Назад
                </button>
              )}
              <span style={{ color: '#fef3c7', fontWeight: 'bold' }}>
                {selectedSection ? selectedSection : 'Все секции'}
              </span>
              {hasSearch && <span style={{ color: '#a8a29e' }}>· "{search}"</span>}
            </div>

            {/* Поиск */}
            <div className="ab-search" style={styles.searchContainer}>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Поиск по названию или коду..."
                style={styles.searchInput}
                className="ab-search-input"
              />
            </div>

            {/* Список */}
            <div className="ab-list" style={styles.listContainer}>
              {entries.length === 0 ? (
                <div style={styles.noResults}>Ничего не найдено</div>
              ) : (
                <table className="ab-table" style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>Название</th>
                      <th style={styles.tableTh}>Код</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, idx) => (
                      <tr
                        key={idx}
                        onClick={() => onSelectAddress?.(entry.code)}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = '#3f3732';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <td style={styles.tableTd}>{entry.name}</td>
                        <td style={{ ...styles.tableTd, ...styles.tableCode }}>{entry.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
