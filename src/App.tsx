import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, RotateCcw, Leaf, Dna } from 'lucide-react';
import { organelles, OrganelleData } from './data/organelles';
import CellSVG from './components/CellSVG';

export default function App() {
  const [cellType, setCellType] = useState<'animal' | 'plant'>('animal');
  const [selectedOrganelleId, setSelectedOrganelleId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});
  const [wrongMatch, setWrongMatch] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Shuffle functions for the list
  const [shuffledFunctions, setShuffledFunctions] = useState<OrganelleData[]>([]);

  useEffect(() => {
    setShuffledFunctions([...organelles].sort(() => Math.random() - 0.5));
  }, []);

  useEffect(() => {
    if (Object.keys(matchedPairs).length === organelles.length) {
      setIsComplete(true);
    }
  }, [matchedPairs]);

  const handleOrganelleClick = (id: string) => {
    if (matchedPairs[id]) return; // Already matched
    setSelectedOrganelleId(id);
    setWrongMatch(null);
  };

  const handleFunctionClick = (funcId: string) => {
    if (!selectedOrganelleId) return;
    if (matchedPairs[selectedOrganelleId]) return;

    if (funcId === selectedOrganelleId) {
      // Match!
      setMatchedPairs((prev) => ({ ...prev, [selectedOrganelleId]: funcId }));
      setSelectedOrganelleId(null);
      setWrongMatch(null);
    } else {
      // Wrong match
      setWrongMatch(funcId);
      setTimeout(() => setWrongMatch(null), 1000);
    }
  };

  const handleReset = () => {
    setMatchedPairs({});
    setSelectedOrganelleId(null);
    setWrongMatch(null);
    setIsComplete(false);
    setShuffledFunctions([...organelles].sort(() => Math.random() - 0.5));
  };

  const handleToggleCellType = (type: 'animal' | 'plant') => {
    setCellType(type);
    // Deselect if the selected organelle doesn't exist in the new cell type
    if (selectedOrganelleId) {
      const organelle = organelles.find(o => o.id === selectedOrganelleId);
      if (organelle && organelle.cellType !== 'both' && organelle.cellType !== type) {
        setSelectedOrganelleId(null);
      }
    }
  };

  const progress = (Object.keys(matchedPairs).length / organelles.length) * 100;

  return (
    <div className="w-full h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden flex">
      {/* 2D SVG Area */}
      <div className="flex-1 relative flex flex-col">
        {/* Header */}
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">
            真核細胞構造與功能
          </h1>
          <p className="text-slate-300 mt-2 max-w-md drop-shadow">
            探索真核細胞的內部構造。點選模型中的胞器，並在右側選單中配對其對應的功能。
            <br/>
            <span className="text-indigo-300 text-sm mt-1 block">提示：有些胞器只存在於特定細胞中，請切換細胞類型尋找。</span>
          </p>
        </div>

        {/* Cell Type Toggle */}
        <div className="absolute top-6 right-6 z-10 flex bg-slate-800/80 backdrop-blur-md p-1 rounded-xl border border-slate-700/50 shadow-xl">
          <button
            onClick={() => handleToggleCellType('animal')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              cellType === 'animal' 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Dna className="w-4 h-4" />
            動物細胞
          </button>
          <button
            onClick={() => handleToggleCellType('plant')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              cellType === 'plant' 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            <Leaf className="w-4 h-4" />
            植物細胞
          </button>
        </div>

        {/* SVG Container */}
        <div className="flex-1 relative bg-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-slate-900 pointer-events-none" />
          <CellSVG 
            cellType={cellType}
            selectedId={selectedOrganelleId} 
            matchedIds={Object.keys(matchedPairs)}
            onSelect={handleOrganelleClick} 
          />
        </div>

        {/* Info Box */}
        <div className="absolute bottom-6 left-6 pointer-events-none z-10">
          <div className="bg-slate-800/80 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Info className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400 font-medium">操作提示</p>
              <p className="text-slate-200">
                {selectedOrganelleId 
                  ? "已選擇胞器，請在右側點擊對應的功能。" 
                  : "請在畫面中點選一個尚未配對的胞器。"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Functions List */}
      <div className="w-[400px] bg-slate-800/90 backdrop-blur-xl border-l border-slate-700/50 flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">功能配對清單</h2>
            <span className="text-sm font-mono bg-slate-700 px-2 py-1 rounded-md text-slate-300">
              {Object.keys(matchedPairs).length} / {organelles.length}
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-indigo-500 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          <AnimatePresence>
            {shuffledFunctions.map((func) => {
              const isMatched = Object.values(matchedPairs).includes(func.id);
              const isWrong = wrongMatch === func.id;
              
              const matchedOrganelleId = Object.keys(matchedPairs).find(key => matchedPairs[key] === func.id);
              const matchedOrganelle = matchedOrganelleId ? organelles.find(o => o.id === matchedOrganelleId) : null;

              return (
                <motion.button
                  key={func.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    x: isWrong ? [-10, 10, -10, 10, 0] : 0,
                  }}
                  transition={{ 
                    x: { duration: 0.4 },
                    layout: { duration: 0.3 }
                  }}
                  onClick={() => handleFunctionClick(func.id)}
                  disabled={isMatched || !selectedOrganelleId}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden group
                    ${isMatched 
                      ? 'bg-emerald-500/10 border-emerald-500/30 cursor-default' 
                      : selectedOrganelleId
                        ? isWrong
                          ? 'bg-red-500/10 border-red-500/50'
                          : 'bg-slate-700/50 border-slate-600 hover:bg-slate-700 hover:border-indigo-400 cursor-pointer'
                        : 'bg-slate-800 border-slate-700 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  {isMatched && (
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
                  )}

                  <div className="flex items-start gap-3 relative z-10">
                    <div className="mt-0.5">
                      {isMatched ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : isWrong ? (
                        <XCircle className="w-5 h-5 text-red-400" />
                      ) : (
                        <div className={`w-5 h-5 rounded-full border-2 ${selectedOrganelleId ? 'border-slate-500 group-hover:border-indigo-400' : 'border-slate-600'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm leading-relaxed ${isMatched ? 'text-slate-200' : 'text-slate-300'}`}>
                        {func.description}
                      </p>
                      {isMatched && matchedOrganelle && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/20 border border-emerald-500/20"
                        >
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: matchedOrganelle.color }} />
                          <span className="text-xs font-bold text-emerald-300">{matchedOrganelle.name}</span>
                          {matchedOrganelle.cellType !== 'both' && (
                            <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                              {matchedOrganelle.cellType === 'animal' ? '動物限定' : '植物限定'}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Completion State */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border-t border-slate-700/50 bg-slate-800/95"
            >
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <h3 className="text-lg font-bold text-emerald-400 mb-2">恭喜完成配對！</h3>
                <p className="text-sm text-slate-300 mb-4">
                  你已經成功辨識出所有真核細胞的構造與功能。
                </p>
                <button 
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新開始
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
