import React from 'react';

export default function InstructionScreen({ onBack }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="arkham-card animate-fade-in" style={{ padding: '36px', maxWidth: '750px', width: '100%' }}>
        <h2 style={{ fontSize: '26px', color: '#fbbf24', borderBottom: '1px solid #78350f', paddingBottom: '12px', marginBottom: '20px' }}>
          Инструкция сыщика
        </h2>
        <div style={{ fontSize: '18px', lineHeight: '1.7', color: '#d6d3d1', marginBottom: '28px' }}>
          <p style={{ marginBottom: '16px' }}>
            Играя в <strong>«Тайны Аркхэма»</strong>, вы расследуете цепочку странных и зловещих событий. Посещайте адреса в городе, опрашивайте свидетелей, собирайте улики в Блокноте и разгадывайте тайны древнего города.
          </p>
          <p style={{ marginBottom: '16px' }}>
            В начале каждого дела изучите <strong>Сложность дела</strong> и выберите количество поездок. Каждый день делится на 3 периода — <em>Рассвет</em>, <em>Полдень</em> и <em>Закат</em>.
          </p>
          <p style={{ marginBottom: '16px' }}>
            Пользуйтесь <strong>Адресной книгой</strong> и помощью <strong>Союзников</strong> (например, профессором Армитеджем из библиотеки Мискатоникского университета).
          </p>
          <p style={{ marginBottom: '16px' }}>
            Когда вы соберете достаточно улик, нажмите кнопку <strong>«Перейти к ответам»</strong> и ответьте на итоговые вопросы дела.
          </p>
        </div>
        <button className="btn-primary" onClick={onBack}>
          ↩ Назад в меню
        </button>
      </div>
    </div>
  );
}
