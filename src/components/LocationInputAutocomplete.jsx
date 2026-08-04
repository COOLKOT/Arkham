import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ADDRESS_BOOK_SECTIONS } from '../addressBookSections';
import { playClickSound, playPageTurnSound } from '../utils/soundEffects';

export default function LocationInputAutocomplete({
  value,
  onChange,
  onSubmit,
  activeScenario,
  visitedLocations,
  disabled,
  inputRef
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Flatten address book entries once for fast lookup
  const allAddressEntries = useMemo(() => {
    const entries = [];
    ADDRESS_BOOK_SECTIONS.forEach(sec => {
      if (Array.isArray(sec.entries)) {
        sec.entries.forEach(e => {
          if (e.code && e.name) {
            entries.push({ name: e.name, code: e.code });
          }
        });
      }
    });

    // Add scenario allies
    if (activeScenario && Array.isArray(activeScenario.allies)) {
      activeScenario.allies.forEach(ally => {
        if (ally.code && ally.name) {
          entries.push({ name: `${ally.name} (${ally.role || 'Союзник'})`, code: ally.code });
        }
      });
    }

    return entries;
  }, [activeScenario]);

  const query = value.trim().toLowerCase();

  const suggestions = useMemo(() => {
    if (!query || query.length < 1) return [];

    const matches = [];
    const seenCodes = new Set();

    for (const entry of allAddressEntries) {
      const codeMatch = entry.code.toLowerCase().includes(query);
      const nameMatch = entry.name.toLowerCase().includes(query);

      if ((codeMatch || nameMatch) && !seenCodes.has(entry.code + entry.name)) {
        seenCodes.add(entry.code + entry.name);
        matches.push(entry);
        if (matches.length >= 6) break;
      }
    }

    return matches;
  }, [query, allAddressEntries]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    playClickSound();
    playPageTurnSound();
    onChange(code);
    setIsOpen(false);
    onSubmit(code);
  };

  const isVisited = (code) => {
    return visitedLocations.some(loc => String(loc.code).toUpperCase() === String(code).toUpperCase());
  };

  return (
    <div style={{ position: 'relative', flex: 1 }} ref={dropdownRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Код локации или имя..."
        className="arkham-input"
        style={{ width: '100%' }}
        disabled={disabled}
        ref={inputRef}
      />

      {isOpen && suggestions.length > 0 && !disabled && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: 0,
          right: 0,
          marginBottom: '6px',
          backgroundColor: '#1c1815',
          border: '1px solid #78350f',
          borderRadius: '6px',
          boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.85)',
          zIndex: 100,
          maxHeight: '220px',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '6px 10px', fontSize: '11px', color: '#a8a29e', borderBottom: '1px solid #3f3732', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💡 Найденные адреса ({suggestions.length})
          </div>
          {suggestions.map((item, idx) => {
            const visited = isVisited(item.code);
            return (
              <div
                key={idx}
                style={{
                  padding: '8px 12px',
                  borderBottom: '1px solid #2d2621',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background-color 0.15s'
                }}
                onClick={() => handleSelect(item.code)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3f3732'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold', fontFamily: 'monospace', marginRight: '8px' }}>
                    {item.code}
                  </span>
                  <span style={{ color: '#e7e5e4', fontSize: '14px' }}>
                    {item.name}
                  </span>
                </div>
                {visited && (
                  <span style={{ fontSize: '11px', color: '#22c55e', backgroundColor: 'rgba(34, 197, 94, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                    ✓ Посещено
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
