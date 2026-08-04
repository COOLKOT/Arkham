import React from 'react';
import { ALL_SCENARIOS } from '../scenarios';

export default function CaseSelector({ onSelectScenario, onBack }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="arkham-card animate-fade-in" style={{ padding: '36px', maxWidth: '750px', width: '100%' }}>
        <h2 style={{ fontSize: '26px', color: '#fbbf24', borderBottom: '1px solid #78350f', paddingBottom: '12px', marginBottom: '24px' }}>
          Выберите расследование
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {ALL_SCENARIOS.map((scen) => (
            <div
              key={scen.id}
              className="arkham-card arkham-card-interactive"
              style={{ padding: '20px', cursor: 'pointer', backgroundColor: '#1c1815' }}
              onClick={() => onSelectScenario(scen)}
            >
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '6px', fontFamily: 'var(--font-title)' }}>
                {scen.title}
              </div>
              <div style={{ fontSize: '16px', color: '#d6d3d1', lineHeight: '1.5' }}>
                {scen.description}
              </div>
            </div>
          ))}
        </div>
        <button className="btn-secondary" style={{ width: '100%' }} onClick={onBack}>
          ↩ Назад в меню
        </button>
      </div>
    </div>
  );
}
