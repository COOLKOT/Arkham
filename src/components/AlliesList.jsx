import React, { useMemo, useState } from 'react';
import { DEFAULT_ALLIES } from '../helpData';

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
    boxSizing: 'border-box',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    color: '#f59e0b',
    padding: '10px 12px',
    borderBottom: '2px solid #78350f',
    backgroundColor: '#292524',
  },
  row: {
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  cell: {
    padding: '10px 12px',
    borderBottom: '1px solid #3f3732',
    color: '#d6d3d1',
    verticalAlign: 'middle',
    lineHeight: 1.4,
  },
  selectedRow: {
    backgroundColor: '#3f3732',
  },
  expandedCell: {
    padding: '12px 14px',
    borderBottom: '2px solid #78350f',
    backgroundColor: '#1c1917',
  },
  selectedText: {
    color: '#d6d3d1',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    fontSize: '13px',
  },
  empty: {
    color: '#a8a29e',
    fontStyle: 'italic',
    padding: '16px 0',
  },
};

const AlliesList = React.memo(function AlliesList({ allies = DEFAULT_ALLIES, selectedAllyName, onSelectAlly, onGoToAddress }) {
  const [search, setSearch] = useState('');
  const resolvedAllies = Array.isArray(allies) && allies.length > 0 ? allies : DEFAULT_ALLIES;

  const filteredAllies = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return resolvedAllies;

    return resolvedAllies.filter((ally) => {
      const haystack = `${ally.name} ${ally.role} ${ally.description}`.toLowerCase();
      return haystack.includes(normalized);
    });
  }, [resolvedAllies, search]);

  const selectedAlly = resolvedAllies.find((ally) => ally.name === selectedAllyName) || null;

  return (
    <div style={styles.wrapper}>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск союза..."
        style={styles.searchInput}
      />

      {filteredAllies.length === 0 ? (
        <div style={styles.empty}>Ничего не найдено.</div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Имя</th>
              <th style={styles.th}>Адрес</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllies.map((ally) => {
              const isSelected = selectedAlly?.name === ally.name;
              return (
                <React.Fragment key={ally.name}>
                  <tr
                    style={{ ...styles.row, ...(isSelected ? styles.selectedRow : {}) }}
                    onClick={() => onSelectAlly?.(isSelected ? '' : ally.name)}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#3f3732';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={styles.cell}>{ally.name}</td>
                    <td style={{ ...styles.cell, fontFamily: '"Courier New", monospace', fontWeight: 'bold' }}>{ally.code}</td>
                  </tr>
                  {isSelected && (
                    <tr>
                      <td colSpan={2} style={styles.expandedCell}>
                        <div style={styles.selectedText}>{ally.description}</div>
                        {onGoToAddress && (
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ marginTop: '10px', fontSize: '13px', padding: '6px 12px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onGoToAddress(ally.code);
                            }}
                          >
                            🏃 Навестить ({ally.code})
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
});

export default AlliesList;
