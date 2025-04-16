import React, { useState, useRef, useEffect } from 'react';

const ChordWheel = () => {
  // Começamos na posição 3 (equivalente a 90 graus de rotação)
  const [position, setPosition] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const coverRef = useRef(null);
  const containerRef = useRef(null);
  
  // Converter posição (0-11) para ângulo de rotação (em graus)
  const rotation = position * 30;

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
  
  // Funções simplificadas para navegação
  const advanceTone = () => {
    setPosition((prev) => (prev + 1) % 12);
  };
  
  const reduceTone = () => {
    setPosition((prev) => (prev - 1 + 12) % 12);
  };

  // Manipulação do arrasto
  const handleDragStart = (clientX, clientY) => {
    if (!coverRef.current || !containerRef.current) return;
    
    setIsDragging(true);
  };
  
  const handleDragMove = (clientX, clientY) => {
    if (!isDragging || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calcular o ângulo entre o ponto central e o cursor
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    // Converter o ângulo (-180 a 180) para uma posição (0-11)
    // Primeiro normalizamos para 0-360
    const normalizedAngle = ((angle + 180) % 360);
    // Depois convertemos para posição (inverter direção para girar como esperado)
    const newPosition = Math.round(normalizedAngle / 30) % 12;
    const adjustedPosition = (12 - newPosition) % 12;
    
    setPosition(adjustedPosition);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Mouse events
  const handleMouseDown = (e) => {
    e.preventDefault();
    handleDragStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleDragMove(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch events
  const handleTouchStart = (e) => {
    if (e.touches.length > 0) {
      handleDragStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length > 0) {
      e.preventDefault();
      handleDragMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Add and remove event listeners
  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  });

  return (
    <div className="flex flex-col items-center justify-start h-full w-full p-2 pt-0">
      
      <div 
        className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square select-none" 
        ref={containerRef}
      >
        {/* Roda de acordes - camada inferior */}
        <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-gray-400 overflow-hidden shadow-lg mb-10">
          {/* Segmentos de acordes com cores */}
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
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
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
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
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Segmentos pretos cobrindo a roda, exceto posições 0, 10, 11 (juntas) e 4 (separada) */}
            
            {/* Posição 1 */}
            <path 
              d="M100,100 L150,13.4 A100,100 0 0,1 186.6,50 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Posição 2 */}
            <path 
              d="M100,100 L186.6,50 A100,100 0 0,1 200,100 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Posição 3 */}
            <path 
              d="M100,100 L200,100 A100,100 0 0,1 186.6,150 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Posição 5 */}
            <path 
              d="M100,100 L150,186.6 A100,100 0 0,1 100,200 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Posição 6 */}
            <path 
              d="M100,100 L100,200 A100,100 0 0,1 50,186.6 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Posição 7 */}
            <path 
              d="M100,100 L50,186.6 A100,100 0 0,1 13.4,150 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Posição 8 */}
            <path 
              d="M100,100 L13.4,150 A100,100 0 0,1 0,100 L100,100 Z" 
              fill="#222"
              opacity="0.85"
            />
            
            {/* Posição 9 */}
            <path 
              d="M100,100 L0,100 A100,100 0 0,1 13.4,50 L100,100 Z" 
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
            
            {/* Janelas transparentes nas posições agrupadas 0, 10, 11 */}
            <path 
              d="M100,100 L100,0 A100,100 0 0,1 150,13.4 L100,100 Z" 
              fill="transparent"
            />
            
            <path 
              d="M100,100 L13.4,50 A100,100 0 0,1 50,13.4 L100,100 Z" 
              fill="transparent"
            />
            
            <path 
              d="M100,100 L50,13.4 A100,100 0 0,1 100,0 L100,100 Z" 
              fill="transparent"
            />
            
            {/* Janela transparente na posição 4 (separada) - apenas o acorde maior */}
            <path 
              d="M100,100 L186.6,150 A100,100 0 0,1 150,186.6 L100,100 Z" 
              fill="transparent"
            />
            
            {/* Cobertura preta para o acorde menor na janela separada */}
            <path 
              d="M100,100 L151.96,130 A60,60 0 0,1 130,151.96 Z" 
              fill="#222"
              opacity="0.85"
            />
          </svg>
        </div>
      </div>

      <div className="mt-10"></div>
      
      {/* Botões de navegação */}
      <div className="mt-10 flex justify-center gap-4">
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-lg transition touch-manipulation w-20 h-12 flex items-center justify-center"
          onClick={reduceTone}
          type="button"
        >
          <span>-1</span>
        </button>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full text-lg transition touch-manipulation w-20 h-12 flex items-center justify-center"
          onClick={advanceTone}
          type="button"
        >
          <span>+1</span>
        </button>
      </div>
    </div>
  );
};

export default ChordWheel;