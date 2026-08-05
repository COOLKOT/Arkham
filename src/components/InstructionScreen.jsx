import React, { useState, useEffect } from 'react';
import { INSTRUCTION_PAGES, INSTRUCTION_BOOK_INFO } from '../instructionData';

export default function InstructionScreen({ onBack }) {
  // Page 0: Cover page, Pages 1..N: Chapters
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [flipAnimation, setFlipAnimation] = useState('');

  const totalPages = INSTRUCTION_PAGES.length;

  const handleNext = () => {
    if (currentPageIndex < totalPages) {
      setFlipAnimation('flip-next');
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setFlipAnimation('flip-prev');
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleGoToPage = (index) => {
    if (index !== currentPageIndex) {
      setFlipAnimation(index > currentPageIndex ? 'flip-next' : 'flip-prev');
      setCurrentPageIndex(index);
    }
  };

  // Keyboard navigation listener (Left / Right arrow keys)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex]);

  // Reset animation class after transition finishes
  useEffect(() => {
    if (flipAnimation) {
      const timer = setTimeout(() => setFlipAnimation(''), 450);
      return () => clearTimeout(timer);
    }
  }, [flipAnimation]);

  const renderFormattedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} style={{ color: '#78350f', fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={idx} style={{ fontStyle: 'italic', color: '#854d0e' }}>
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const currentPage = currentPageIndex > 0 ? INSTRUCTION_PAGES[currentPageIndex - 1] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <div className="book-wrapper animate-fade-in">
        
        {/* Chapter Bookmarks Navigation Tabs */}
        <div className="book-tabs-nav">
          <button
            className={`book-tab-btn ${currentPageIndex === 0 ? 'active' : ''}`}
            onClick={() => handleGoToPage(0)}
          >
            📖 Обложка
          </button>
          {INSTRUCTION_PAGES.map((page, idx) => (
            <button
              key={page.id}
              className={`book-tab-btn ${currentPageIndex === idx + 1 ? 'active' : ''}`}
              onClick={() => handleGoToPage(idx + 1)}
            >
              {page.chapter}
            </button>
          ))}
        </div>

        {/* Outer Book Container */}
        <div className="book-container">
          <div className="book-ribbon"></div>

          {/* Book Content Page or Cover */}
          {currentPageIndex === 0 ? (
            <div className={`book-cover-inner ${flipAnimation}`}>
              <div className="book-cover-title">{INSTRUCTION_BOOK_INFO.title}</div>
              <div className="book-cover-subtitle">{INSTRUCTION_BOOK_INFO.subtitle}</div>
              
              <div className="book-cover-emblem">📜</div>
              
              <p style={{ fontSize: '16px', color: '#d6d3d1', maxWidth: '480px', marginTop: '12px' }}>
                Официальное руководство для сыщиков, расследующих таинственные происшествия в городе Аркхэм.
              </p>

              <button
                className="btn-primary"
                onClick={handleNext}
                style={{ marginTop: '28px', padding: '14px 28px', fontSize: '17px' }}
              >
                Открыть книгу ➔
              </button>

              <div className="book-cover-meta">
                <div>{INSTRUCTION_BOOK_INFO.author}</div>
                <div>{INSTRUCTION_BOOK_INFO.city} • {INSTRUCTION_BOOK_INFO.year}</div>
              </div>
            </div>
          ) : (
            <div className={`book-page ${flipAnimation}`}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="book-chapter-badge">{currentPage.chapter}</span>
                  <span style={{ fontSize: '13px', color: '#854d0e', fontStyle: 'italic' }}>
                    {INSTRUCTION_BOOK_INFO.title}
                  </span>
                </div>

                <h2 className="book-page-header-title">{currentPage.title}</h2>
                <div className="book-page-header-subtitle">{currentPage.subtitle}</div>

                <div style={{ marginTop: '16px' }}>
                  {currentPage.content.map((paragraph, index) => (
                    <p key={index} className="book-paragraph">
                      {renderFormattedText(paragraph)}
                    </p>
                  ))}
                </div>

                {currentPage.tip && (
                  <div className="book-tip-box">
                    {renderFormattedText(currentPage.tip)}
                  </div>
                )}
              </div>

              {/* Page Footer */}
              <div className="book-footer">
                <button
                  onClick={handlePrev}
                  style={{ background: 'none', border: 'none', color: '#78350f', cursor: 'pointer', fontFamily: 'var(--font-title)', fontSize: '14px', fontWeight: 'bold' }}
                >
                  ◀ Пред. страница
                </button>
                
                <span style={{ fontFamily: 'var(--font-title)', fontWeight: 'bold' }}>
                  — {currentPageIndex} из {totalPages} —
                </span>

                <button
                  onClick={handleNext}
                  disabled={currentPageIndex === totalPages}
                  style={{ background: 'none', border: 'none', color: currentPageIndex === totalPages ? '#a8a29e' : '#78350f', cursor: currentPageIndex === totalPages ? 'default' : 'pointer', fontFamily: 'var(--font-title)', fontSize: '14px', fontWeight: 'bold' }}
                >
                  {currentPageIndex === totalPages ? 'Конец' : 'След. страница ▶'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Outer Bottom Controls */}
        <div className="book-controls">
          <button className="btn-secondary" onClick={onBack}>
            ↩ Назад в меню
          </button>

          <div style={{ color: '#a8a29e', fontSize: '14px', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡 Перелистывайте клавишами <strong>←</strong> и <strong>→</strong></span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
            >
              ◀ Назад
            </button>
            <button
              className="btn-primary"
              onClick={handleNext}
              disabled={currentPageIndex === totalPages}
            >
              Вперед ▶
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
