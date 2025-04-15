import React, { useState, useRef, useEffect } from 'react';

const ChordWheel = () => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const coverRef = useRef(null);
  const containerRef = useRef(null);

  // Dados dos acordes da roda com cores correspondentes
  const chords = [
    { major: 'C', minor: 'Am', color: '#B05050' }, // Vermelho-marrom
    { major: 'G', minor: 'Em', color: '#DAAA56' }, // Dourado
    { major: 'D', minor: 'Bm', color: '#E9D186' }, // Amarelo claro
    { major: 'A', minor: 'F#m', color: '#B9D372' }, // Verde claro
    { major: 'E', minor: 'C#m', color: '#79B473' }, // Verde
    { major: 'B', minor: 'G#m', color: '#5A9A7F' }, // Verde-azulado
    { major: 'F#', minor: 'D#m', color: '#6B9AC4' }, // Azul claro
    { major: 'Db', minor: 'Bbm', color: '#6B78B4' }, // Azul-violeta
    { major: 'Ab', minor: 'Fm', color: '#322F5C' }, // Azul escuro
    { major: 'Eb', minor: 'Cm', color: '#634D80' }, // Roxo escuro
    { major: 'Bb', minor: 'Gm', color: '#8A5E97' }, // Roxo
    { major: 'F', minor: 'Dm', color: '#9A4D88' }, // Magenta-roxo
  ];

  // Função para calcular o ângulo entre dois pontos
  const getAngle = (cx, cy, px, py) => {
    const x = px - cx;
    const y = py - cy;
    return Math.atan2(y, x) * 180 / Math.PI;
  };

  // Manipuladores de eventos para arrastar a capa
  const handleMouseDown = (e) => {
    e.preventDefault();
    if (!coverRef.current || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setIsDragging(true);
    setStartAngle(getAngle(centerX, centerY, e.clientX, e.clientY) - rotation);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = getAngle(centerX, centerY, e.clientX, e.clientY);
    const newRotation = angle - startAngle;
    
    setRotation(newRotation);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Adicionar e remover event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  });

  // Manipuladores de eventos para dispositivos touch
  const handleTouchStart = (e) => {
    if (!coverRef.current || !containerRef.current) return;
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setIsDragging(true);
    setStartAngle(getAngle(centerX, centerY, touch.clientX, touch.clientY) - rotation);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = getAngle(centerX, centerY, touch.clientX, touch.clientY);
    const newRotation = angle - startAngle;
    
    setRotation(newRotation);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold mb-2">Roda de Acordes</h2>
        <p className="text-lg">Arraste a capa para revelar diferentes acordes</p>
      </div>
      
      <div 
        className="relative w-72 h-72 md:w-96 md:h-96 select-none" 
        ref={containerRef}
      >
        {/* Roda de acordes - camada inferior */}
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-gray-400">
          {/* Segmentos de acordes com cores */}
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Círculo externo com segmentos coloridos para acordes maiores */}
            {chords.map((chord, index) => {
              const startAngle = index * 30;
              const endAngle = (index + 1) * 30;
              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (endAngle - 90) * Math.PI / 180;
              
              const x1 = 100 + 100 * Math.cos(startRad);
              const y1 = 100 + 100 * Math.sin(startRad);
              const x2 = 100 + 100 * Math.cos(endRad);
              const y2 = 100 + 100 * Math.sin(endRad);
              
              // Criando o arco
              const largeArcFlag = 0; // 0 para < 180 graus, 1 para > 180 graus
              const path = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              return (
                <path 
                  key={`major-${index}`}
                  d={path}
                  fill={chord.color}
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Círculo central de acordes menores */}
            {chords.map((chord, index) => {
              const startAngle = index * 30;
              const endAngle = (index + 1) * 30;
              const startRad = (startAngle - 90) * Math.PI / 180;
              const endRad = (endAngle - 90) * Math.PI / 180;
              
              const x1 = 100 + 60 * Math.cos(startRad);
              const y1 = 100 + 60 * Math.sin(startRad);
              const x2 = 100 + 60 * Math.cos(endRad);
              const y2 = 100 + 60 * Math.sin(endRad);
              
              // Criando o arco interno
              const largeArcFlag = 0;
              const path = `M 100 100 L ${x1} ${y1} A 60 60 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
              
              // Versão mais clara da cor para acordes menores
              const lightenColor = (color, percent) => {
                const num = parseInt(color.slice(1), 16);
                const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * percent));
                const g = Math.min(255, Math.floor((num >> 8 & 0x00FF) + (255 - (num >> 8 & 0x00FF)) * percent));
                const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * percent));
                return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
              };
              
              return (
                <path 
                  key={`minor-${index}`}
                  d={path}
                  fill={lightenColor(chord.color, 0.4)} // Versão mais clara da cor
                  stroke="white"
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Círculo central preto com números */}
            <circle cx="100" cy="100" r="25" fill="black" stroke="white" strokeWidth="1" />
            
            {/* Números dos graus no círculo central */}
            {/* {[0, 1, 2, 3, 4, 5, 6].map((num, i) => {
              // Posicionamento dos números em volta do círculo central
              // Começando de cima (0) e seguindo em sentido horário
              const angle = ((i * 60) - 90) * Math.PI / 180;
              const r = 18;
              
              return (
                <g key={`num-${i}`}>
                  <circle 
                    cx={100 + r * Math.cos(angle)} 
                    cy={100 + r * Math.sin(angle)} 
                    r="5" 
                    fill="black" 
                    stroke="white" 
                    strokeWidth="0.5" 
                  />
                  <text 
                    x={100 + r * Math.cos(angle)} 
                    y={100 + r * Math.sin(angle)} 
                    fill="white" 
                    fontSize="8"
                    textAnchor="middle" 
                    dominantBaseline="middle"
                  >
                    {num}
                  </text>
                </g>
              );
            })} */}
            
            {/* Texto para acordes maiores */}
            {chords.map((chord, index) => {
              const angle = (index * 30 + 15 - 90) * Math.PI / 180;
              const r = 80;
              const x = 100 + r * Math.cos(angle);
              const y = 100 + r * Math.sin(angle);
              
              return (
                <text 
                  key={`major-text-${index}`}
                  x={x}
                  y={y}
                  fill="white"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {chord.major}
                </text>
              );
            })}
            
            {/* Texto para acordes menores */}
            {chords.map((chord, index) => {
              const angle = (index * 30 + 15 - 90) * Math.PI / 180;
              const r = 40;
              const x = 100 + r * Math.cos(angle);
              const y = 100 + r * Math.sin(angle);
              
              return (
                <text 
                  key={`minor-text-${index}`}
                  x={x}
                  y={y}
                  fill="black"
                  fontSize="10"
                  fontWeight="normal"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {chord.minor}
                </text>
              );
            })}
          </svg>
        </div>
        
        {/* Capa giratória - camada superior */}
        <div 
          ref={coverRef}
          className="absolute top-0 left-0 w-full h-full cursor-pointer"
          style={{ transform: `rotate(${rotation}deg)` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Parte preta cobrindo 3/4 da roda */}
            <path 
              d="M100,100 L200,100 A100,100 0 1,1 100,0 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Linhas verticais para marcações a cada 30 graus */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = i * 30;
              const radians = (angle - 90) * Math.PI / 180;
              const x1 = 100 + 100 * Math.cos(radians);
              const y1 = 100 + 100 * Math.sin(radians);
              const x2 = 100 + 60 * Math.cos(radians);
              const y2 = 100 + 60 * Math.sin(radians);
              
              return (
                <line 
                  key={i}
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke="white" 
                  strokeWidth="1"
                />
              );
            })}
            
            {/* Graus na capa - ajustados para o círculo de quintas */}
            {/* {[1, 4, 7, 3, 6, 2, 5].map((num, i) => {
              // Posicionamento correto para o círculo de quintas
              // Seguindo a ordem C(1°), F(4°), Bb(7°), Eb(3°), Ab(6°), Db(2°), Gb(5°)
              const offset = -90;
              const angle = (i * 30) + offset;
              const radians = angle * Math.PI / 180;
              const x = 100 + 80 * Math.cos(radians);
              const y = 100 + 80 * Math.sin(radians);
              
              return (
                <text 
                  key={num}
                  x={x} 
                  y={y} 
                  fill="white" 
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {num}°
                </text>
              );
            })} */}
            
            {/* Janela de visualização na parte inferior direita */}
            <path 
              d="M100,100 L200,100 A100,100 0 0,0 100,200 L100,100 Z" 
              fill="transparent"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ChordWheel;