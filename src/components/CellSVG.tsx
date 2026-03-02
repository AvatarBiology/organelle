import { motion } from 'motion/react';
import { organelles } from '../data/organelles';

interface CellSVGProps {
  cellType: 'animal' | 'plant';
  selectedId: string | null;
  matchedIds: string[];
  onSelect: (id: string) => void;
}

export default function CellSVG({ cellType, selectedId, matchedIds, onSelect }: CellSVGProps) {
  const isAnimal = cellType === 'animal';

  const getStyle = (id: string) => {
    const isSelected = selectedId === id;
    const isMatched = matchedIds.includes(id);
    const baseClass = "cursor-pointer transition-all duration-300 outline-none";
    
    if (isMatched) return `${baseClass} opacity-100 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]`;
    if (isSelected) return `${baseClass} opacity-100 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]`;
    if (selectedId) return `${baseClass} opacity-40 hover:opacity-80`;
    return `${baseClass} opacity-90 hover:opacity-100 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 relative">
      <svg 
        viewBox="0 0 1000 800" 
        className="w-full h-full max-w-4xl max-h-[80vh] drop-shadow-2xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="cytoplasmGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isAnimal ? "#fdf4ff" : "#f0fdf4"} />
            <stop offset="100%" stopColor={isAnimal ? "#f3e8ff" : "#dcfce3"} />
          </radialGradient>
          <radialGradient id="nucleusGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="100%" stopColor="#9333ea" />
          </radialGradient>
          <radialGradient id="vacuoleGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </radialGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Background & Borders --- */}
        
        {/* Cell Wall (Plant only) */}
        {!isAnimal && (
          <motion.rect
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            x="100" y="50" width="800" height="700" rx="60"
            fill="none" stroke="#15803d" strokeWidth="24"
            className={getStyle('cell_wall')}
            onClick={() => onSelect('cell_wall')}
          />
        )}

        {/* Cell Membrane & Cytoplasm */}
        <motion.path
          animate={{
            d: isAnimal 
              ? "M 500 90 C 720 70, 840 220, 810 420 C 780 620, 650 730, 480 710 C 280 690, 160 580, 190 380 C 220 180, 300 110, 500 90 Z"
              : "M 112 112 L 888 112 A 48 48 0 0 1 936 160 L 936 640 A 48 48 0 0 1 888 688 L 112 688 A 48 48 0 0 1 64 640 L 64 160 A 48 48 0 0 1 112 112 Z"
          }}
          transition={{ duration: 0.8, type: "spring" }}
          fill="url(#cytoplasmGrad)"
          stroke="#f59e0b"
          strokeWidth={isAnimal ? 12 : 8}
          className={getStyle('cell_membrane')}
          // Visual path only, click handled by the thicker invisible path below
        />

        {/* Invisible thicker path for easier cell membrane clicking */}
        <motion.path
          animate={{
            d: isAnimal 
              ? "M 500 90 C 720 70, 840 220, 810 420 C 780 620, 650 730, 480 710 C 280 690, 160 580, 190 380 C 220 180, 300 110, 500 90 Z"
              : "M 112 112 L 888 112 A 48 48 0 0 1 936 160 L 936 640 A 48 48 0 0 1 888 688 L 112 688 A 48 48 0 0 1 64 640 L 64 160 A 48 48 0 0 1 112 112 Z"
          }}
          transition={{ duration: 0.8, type: "spring" }}
          fill="none"
          stroke="transparent"
          strokeWidth="40"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelect('cell_membrane');
          }}
        />

        {/* Cytoplasm clickable area (slightly smaller than membrane) */}
        <motion.path
          animate={{
            d: isAnimal 
              ? "M 500 100 C 710 80, 825 225, 795 420 C 765 610, 640 715, 480 695 C 290 675, 175 575, 205 380 C 235 190, 310 120, 500 100 Z"
              : "M 120 120 L 880 120 A 40 40 0 0 1 920 160 L 920 640 A 40 40 0 0 1 880 680 L 120 680 A 40 40 0 0 1 80 640 L 80 160 A 40 40 0 0 1 120 120 Z"
          }}
          fill="transparent"
          className={getStyle('cytoplasm')}
          onClick={() => onSelect('cytoplasm')}
        />

        {/* --- Organelles --- */}

        {/* Vacuole */}
        <motion.g
          animate={{
            x: isAnimal ? 300 : 500,
            y: isAnimal ? 550 : 400,
            scale: isAnimal ? 1 : 1
          }}
          transition={{ duration: 0.8 }}
          className={getStyle('vacuole')}
          onClick={() => onSelect('vacuole')}
        >
          {isAnimal ? (
            <>
              <circle cx="0" cy="0" r="35" fill="url(#vacuoleGrad)" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
              <circle cx="60" cy="-30" r="25" fill="url(#vacuoleGrad)" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
              <circle cx="-50" cy="40" r="20" fill="url(#vacuoleGrad)" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
            </>
          ) : (
            <path 
              d="M -200 -180 C 100 -250, 250 -100, 280 100 C 300 280, 100 320, -150 280 C -350 220, -350 -100, -200 -180 Z" 
              fill="url(#vacuoleGrad)" stroke="#38bdf8" strokeWidth="6" opacity="0.85" 
            />
          )}
        </motion.g>

        {/* Nucleus */}
        <motion.g
          animate={{
            x: isAnimal ? 500 : 250,
            y: isAnimal ? 350 : 250,
          }}
          transition={{ duration: 0.8 }}
          className={getStyle('nucleus')}
          onClick={() => onSelect('nucleus')}
        >
          {/* Nuclear Envelope */}
          <circle r="90" fill="url(#nucleusGrad)" stroke="#7e22ce" strokeWidth="6" strokeDasharray="12,6" />
          {/* Nucleolus */}
          <circle cx="25" cy="-15" r="35" fill="#581c87" />
          {/* Chromatin */}
          <path d="M -40 20 Q -10 60, 20 10 T 50 40" fill="none" stroke="#4c1d95" strokeWidth="4" strokeLinecap="round" />
          <path d="M -50 -20 Q -30 -50, 0 -20 T 40 -50" fill="none" stroke="#4c1d95" strokeWidth="4" strokeLinecap="round" />
        </motion.g>

        {/* ER (Endoplasmic Reticulum) */}
        <motion.g
          animate={{
            x: isAnimal ? 500 : 250,
            y: isAnimal ? 350 : 250,
          }}
          transition={{ duration: 0.8 }}
          className={getStyle('er')}
          onClick={() => onSelect('er')}
        >
          {/* Rough ER */}
          <path d="M -110 0 A 110 110 0 0 1 110 0" fill="none" stroke="#3b82f6" strokeWidth="18" strokeLinecap="round" />
          <path d="M -135 20 A 135 135 0 0 1 135 20" fill="none" stroke="#3b82f6" strokeWidth="18" strokeLinecap="round" />
          <path d="M -160 40 A 160 160 0 0 1 160 40" fill="none" stroke="#3b82f6" strokeWidth="18" strokeLinecap="round" />
          
          {/* Smooth ER */}
          <path d="M 100 100 Q 130 150, 160 110 T 200 150" fill="none" stroke="#60a5fa" strokeWidth="14" strokeLinecap="round" />
          <path d="M 120 120 Q 150 170, 180 130 T 220 170" fill="none" stroke="#60a5fa" strokeWidth="14" strokeLinecap="round" />
        </motion.g>

        {/* Ribosomes */}
        <motion.g
          animate={{
            x: isAnimal ? 500 : 250,
            y: isAnimal ? 350 : 250,
          }}
          transition={{ duration: 0.8 }}
          className={getStyle('ribosome')}
          onClick={() => onSelect('ribosome')}
        >
          {/* On ER */}
          <circle cx="-77" cy="-77" r="5" fill="#ef4444" />
          <circle cx="0" cy="-110" r="5" fill="#ef4444" />
          <circle cx="77" cy="-77" r="5" fill="#ef4444" />
          
          <circle cx="-110" cy="-75" r="5" fill="#ef4444" />
          <circle cx="-40" cy="-128" r="5" fill="#ef4444" />
          <circle cx="40" cy="-128" r="5" fill="#ef4444" />
          <circle cx="110" cy="-75" r="5" fill="#ef4444" />

          <circle cx="-140" cy="-75" r="5" fill="#ef4444" />
          <circle cx="-80" cy="-138" r="5" fill="#ef4444" />
          <circle cx="0" cy="-160" r="5" fill="#ef4444" />
          <circle cx="80" cy="-138" r="5" fill="#ef4444" />
          <circle cx="140" cy="-75" r="5" fill="#ef4444" />

          {/* Free in cytoplasm (relative to nucleus center) */}
          <circle cx="-200" cy="100" r="5" fill="#ef4444" />
          <circle cx="-220" cy="120" r="5" fill="#ef4444" />
          <circle cx="-180" cy="140" r="5" fill="#ef4444" />
          
          <circle cx="200" cy="-100" r="5" fill="#ef4444" />
          <circle cx="230" cy="-80" r="5" fill="#ef4444" />
        </motion.g>

        {/* Golgi */}
        <motion.g
          animate={{
            x: isAnimal ? 700 : 200,
            y: isAnimal ? 250 : 550,
            rotate: isAnimal ? 45 : -30
          }}
          transition={{ duration: 0.8 }}
          className={getStyle('golgi')}
          onClick={() => onSelect('golgi')}
        >
          <path d="M -50 -20 Q 0 -40, 50 -20" fill="none" stroke="#f472b6" strokeWidth="14" strokeLinecap="round" />
          <path d="M -60 0 Q 0 -25, 60 0" fill="none" stroke="#ec4899" strokeWidth="14" strokeLinecap="round" />
          <path d="M -70 20 Q 0 -10, 70 20" fill="none" stroke="#db2777" strokeWidth="14" strokeLinecap="round" />
          <path d="M -80 40 Q 0 5, 80 40" fill="none" stroke="#be185d" strokeWidth="14" strokeLinecap="round" />
          {/* Vesicles */}
          <circle cx="85" cy="25" r="8" fill="#ec4899" />
          <circle cx="100" cy="10" r="6" fill="#f472b6" />
          <circle cx="-80" cy="-10" r="7" fill="#db2777" />
        </motion.g>

        {/* Mitochondria 1 */}
        <motion.g
          animate={{
            x: isAnimal ? 250 : 750,
            y: isAnimal ? 250 : 200,
            rotate: isAnimal ? -20 : 45
          }}
          transition={{ duration: 0.8 }}
          className={getStyle('mitochondria')}
          onClick={() => onSelect('mitochondria')}
        >
          <rect x="-50" y="-25" width="100" height="50" rx="25" fill="#fdba74" stroke="#ea580c" strokeWidth="4" />
          <path d="M -35 0 L -20 -15 L -5 15 L 10 -15 L 25 15 L 35 0" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinejoin="round" />
        </motion.g>

        {/* Mitochondria 2 */}
        <motion.g
          animate={{
            x: isAnimal ? 650 : 800,
            y: isAnimal ? 600 : 600,
            rotate: isAnimal ? 60 : -15
          }}
          transition={{ duration: 0.8 }}
          className={getStyle('mitochondria')}
          onClick={() => onSelect('mitochondria')}
        >
          <rect x="-40" y="-20" width="80" height="40" rx="20" fill="#fdba74" stroke="#ea580c" strokeWidth="4" />
          <path d="M -25 0 L -10 -10 L 0 10 L 10 -10 L 25 0" fill="none" stroke="#ea580c" strokeWidth="4" strokeLinejoin="round" />
        </motion.g>

        {/* Lysosomes (Animal Only) */}
        {isAnimal && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={getStyle('lysosome')}
            onClick={() => onSelect('lysosome')}
          >
            <g transform="translate(350, 150)">
              <circle r="18" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" />
              <circle cx="-5" cy="-4" r="2.5" fill="#ca8a04" />
              <circle cx="6" cy="3" r="2.5" fill="#ca8a04" />
              <circle cx="-2" cy="6" r="2.5" fill="#ca8a04" />
            </g>
            <g transform="translate(750, 450)">
              <circle r="15" fill="#fef08a" stroke="#ca8a04" strokeWidth="4" />
              <circle cx="-4" cy="-3" r="2" fill="#ca8a04" />
              <circle cx="5" cy="2" r="2" fill="#ca8a04" />
            </g>
          </motion.g>
        )}

        {/* Centriole (Animal Only) */}
        {isAnimal && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transform="translate(450, 600) rotate(15)"
            className={getStyle('centriole')}
            onClick={() => onSelect('centriole')}
          >
            <rect x="-12" y="-25" width="24" height="50" rx="4" fill="#34d399" stroke="#059669" strokeWidth="3" />
            <rect x="-25" y="-12" width="50" height="24" rx="4" fill="#10b981" stroke="#047857" strokeWidth="3" opacity="0.9" />
            {/* Lines to make it look like microtubules */}
            <line x1="-6" y1="-25" x2="-6" y2="25" stroke="#059669" strokeWidth="2" />
            <line x1="6" y1="-25" x2="6" y2="25" stroke="#059669" strokeWidth="2" />
            <line x1="-25" y1="-6" x2="25" y2="-6" stroke="#047857" strokeWidth="2" />
            <line x1="-25" y1="6" x2="25" y2="6" stroke="#047857" strokeWidth="2" />
          </motion.g>
        )}

        {/* Chloroplasts (Plant Only) */}
        {!isAnimal && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={getStyle('chloroplast')}
            onClick={() => onSelect('chloroplast')}
          >
            <g transform="translate(700, 400) rotate(-20)">
              <rect x="-55" y="-30" width="110" height="60" rx="30" fill="#86efac" stroke="#16a34a" strokeWidth="4" />
              <rect x="-30" y="-18" width="12" height="36" rx="3" fill="#15803d" />
              <rect x="0" y="-18" width="12" height="36" rx="3" fill="#15803d" />
              <rect x="30" y="-18" width="12" height="36" rx="3" fill="#15803d" />
              <line x1="-18" y1="0" x2="0" y2="0" stroke="#15803d" strokeWidth="3" />
              <line x1="12" y1="0" x2="30" y2="0" stroke="#15803d" strokeWidth="3" />
            </g>
            <g transform="translate(500, 650) rotate(10)">
              <rect x="-45" y="-25" width="90" height="50" rx="25" fill="#86efac" stroke="#16a34a" strokeWidth="4" />
              <rect x="-25" y="-15" width="10" height="30" rx="2" fill="#15803d" />
              <rect x="0" y="-15" width="10" height="30" rx="2" fill="#15803d" />
              <rect x="25" y="-15" width="10" height="30" rx="2" fill="#15803d" />
              <line x1="-15" y1="0" x2="0" y2="0" stroke="#15803d" strokeWidth="2" />
              <line x1="10" y1="0" x2="25" y2="0" stroke="#15803d" strokeWidth="2" />
            </g>
          </motion.g>
        )}

        {/* Labels for Matched Organelles */}
        {matchedIds.map(id => {
          const organelle = organelles.find(o => o.id === id);
          if (!organelle) return null;
          if (isAnimal && organelle.cellType === 'plant') return null;
          if (!isAnimal && organelle.cellType === 'animal') return null;

          // Determine label position based on organelle and cell type
          let lx = 0, ly = 0;
          if (id === 'nucleus') { lx = isAnimal ? 500 : 250; ly = isAnimal ? 350 : 250; }
          else if (id === 'er') { lx = isAnimal ? 350 : 100; ly = isAnimal ? 350 : 250; }
          else if (id === 'ribosome') { lx = isAnimal ? 350 : 100; ly = isAnimal ? 250 : 150; }
          else if (id === 'golgi') { lx = isAnimal ? 700 : 200; ly = isAnimal ? 250 : 550; }
          else if (id === 'mitochondria') { lx = isAnimal ? 250 : 750; ly = isAnimal ? 250 : 200; }
          else if (id === 'vacuole') { lx = isAnimal ? 300 : 500; ly = isAnimal ? 550 : 400; }
          else if (id === 'lysosome') { lx = 350; ly = 150; }
          else if (id === 'centriole') { lx = 450; ly = 600; }
          else if (id === 'chloroplast') { lx = 700; ly = 400; }
          else if (id === 'cell_membrane') { lx = isAnimal ? 800 : 880; ly = isAnimal ? 400 : 160; }
          else if (id === 'cell_wall') { lx = 100; ly = 100; }
          else if (id === 'cytoplasm') { lx = isAnimal ? 600 : 700; ly = isAnimal ? 500 : 600; }

          return (
            <motion.g 
              key={`label-${id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-none"
            >
              <rect x={lx - 40} y={ly - 15} width="80" height="30" rx="15" fill={organelle.color} opacity="0.9" />
              <text x={lx} y={ly + 5} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" fontFamily="sans-serif">
                {organelle.name}
              </text>
            </motion.g>
          );
        })}

      </svg>
    </div>
  );
}
