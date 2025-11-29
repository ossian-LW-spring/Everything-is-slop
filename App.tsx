
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, LogEntry, PlayerStats, Scene, ThesisOption } from './types';
import { SCENES, INITIAL_SANITY, CRITICAL_SANITY_THRESHOLD, AD_TRIGGER_CHANCE, CLOUT_SKIP_COST, PROLOGUE_SEQUENCE, THESIS_OPTIONS } from './constants';
import { generateReaction } from './services/geminiService';
import Terminal from './components/Terminal';
import SlopEditor from './components/SlopEditor';
import Meters from './components/Meters';
import ManualBreathing from './components/ManualBreathing';
import TherapySession from './components/TherapySession';
import PopupAd from './components/PopupAd';
import ThesisSelection from './components/ThesisSelection';
import TitleDrop from './components/TitleDrop';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('INTRO');
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedThesis, setSelectedThesis] = useState<ThesisOption | null>(null);
  
  const [stats, setStats] = useState<PlayerStats>({
    sanity: INITIAL_SANITY,
    slopIntegrity: 0,
    clout: 0
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScenePlaying, setIsScenePlaying] = useState(false); // New state to lock "Next" button
  const [showAd, setShowAd] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [hardModeUnlocked, setHardModeUnlocked] = useState(false);
  
  // Keep track of timeouts to clear them on skip
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
      const hasWon = localStorage.getItem('slop_game_won') === 'true';
      if (hasWon) {
          setHardModeUnlocked(true);
      }
  }, []);

  // Helper to add log
  const addLog = useCallback((source: LogEntry['source'], text: string) => {
    const timestamp = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [...prev, { source, text, timestamp }]);
  }, []);

  // Helper to clear all pending timeouts
  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Initial Boot / Prologue
  useEffect(() => {
    if (gameState === 'INTRO') {
      clearTimeouts();

      PROLOGUE_SEQUENCE.forEach(({ source, text, delay }, index) => {
        const timeout = setTimeout(() => {
          addLog(source as LogEntry['source'], text);
          if (index === PROLOGUE_SEQUENCE.length - 1) {
            setIntroFinished(true);
          }
        }, delay);
        timeoutsRef.current.push(timeout);
      });
      
      return () => {
        clearTimeouts();
      };
    }
    // Removed generic cleanup to prevent clearing timeouts during scene transitions
  }, [gameState, addLog]);

  // Handle Scene Transitions
  const advanceNarrative = () => {
    // Always clear existing narrative timeouts when moving forward
    clearTimeouts();
    setIsScenePlaying(false); // Release lock if forced

    // If user clicks continue during intro, cancel remaining intro logs and jump to start
    if (gameState === 'INTRO') {
       if (!introFinished) {
          setIntroFinished(true);
          addLog('SYSTEM', '...SEQUENCE SKIPPED...');
       }
       
       // Move to Thesis Selection instead of straight to Scene 1
       setGameState('THESIS_SELECTION');
       addLog('SYSTEM', 'INITIATING ACADEMIC PROTOCOLS...');

    } else if (gameState === 'SCENE_INTRO') {
      setGameState('SCENE_TASK');
      // Reset Slop for the new task
      setStats(prev => ({ ...prev, slopIntegrity: 0 }));
    } else if (gameState === 'SCENE_RESULT') {
        // CHECK FOR THERAPY INTERSTITIAL (Between Scene 2 and 3)
        // Array index 1 is Scene 2 (Eco-Summit).
        if (currentSceneIndex === 1) {
            setGameState('THERAPY_SESSION');
            addLog('SYSTEM', 'MANDATORY WELLNESS BREAK INITIATED...');
            return;
        }

        loadNextLevel(20); // Increased heal to make game winnable
    }
  };

  // Generic helper to queue scene logs sequentially
  const queueSceneLogs = (scene: Scene) => {
      clearTimeouts();
      setIsScenePlaying(true); // Lock the "Continue" button
      
      // Narrative log
      const t1 = setTimeout(() => {
          addLog('WORLD', scene.narrative);
          // If no logs follow, unlock immediately
          if (!scene.openingLogs || scene.openingLogs.length === 0) {
              setIsScenePlaying(false);
          }
      }, 500);
      timeoutsRef.current.push(t1);

      // Dialogue logs
      if (scene.openingLogs && scene.openingLogs.length > 0) {
        let delay = 2000; // Start dialogue after narrative
        scene.openingLogs.forEach((log, index) => {
            const t = setTimeout(() => {
                addLog(log.source, log.text);
                // Unlock after last log
                if (index === scene.openingLogs!.length - 1) {
                    setIsScenePlaying(false);
                }
            }, delay);
            timeoutsRef.current.push(t);
            delay += 1500; // 1.5 seconds between dialogue lines for natural reading
        });
    }
  };

  const handleThesisSelection = (thesis: ThesisOption) => {
    setSelectedThesis(thesis);
    // Transition to Title Drop instead of immediately to Scene
    setGameState('TITLE_DROP');
  };

  const handleTitleDropComplete = () => {
      setGameState('SCENE_INTRO');
      if (selectedThesis) {
        addLog('PLAYER', `> THESIS SELECTED: ${selectedThesis.label.toUpperCase()}`);
        addLog('SYSTEM', 'THESIS ACCEPTED. GENERATING SIMULATION PARAMETERS...');
        
        if (selectedThesis.difficulty === 'HARD') {
            addLog('SYSTEM', 'WARNING: HARD MODE ACTIVE. INCREASED SANITY DRAIN.');
        } else if (selectedThesis.difficulty === 'EASY') {
            addLog('SYSTEM', 'EASY MODE ACTIVE. CLOUT MULTIPLIER x2.');
        }

        // Load first scene
        const scene = SCENES[0];
        addLog('SYSTEM', `LOADING SCENE: ${scene.title.toUpperCase()}`);
        queueSceneLogs(scene);
      }
  };

  const loadNextLevel = (healAmount: number) => {
    if (currentSceneIndex < SCENES.length - 1) {
        setStats(prev => {
            const newSanity = Math.min(100, prev.sanity + healAmount);
            addLog('SYSTEM', `RECOVERING COGNITIVE FUNCTION... +${healAmount} SANITY`);
            return { ...prev, sanity: newSanity };
        });

        setCurrentSceneIndex(prev => prev + 1);
        setGameState('SCENE_INTRO');
        const nextScene = SCENES[currentSceneIndex + 1];
        addLog('SYSTEM', `LOADING SCENE: ${nextScene.title.toUpperCase()}`);
        
        // Use the queue helper for staggered logs
        queueSceneLogs(nextScene);

    } else {
        setGameState('VICTORY');
        // Unlock hard mode
        localStorage.setItem('slop_game_won', 'true');
        setHardModeUnlocked(true);
        addLog('DAEMON', 'Simulation complete. You have survived the Slop.');
        addLog('SYSTEM', 'Integrity Verified. Welcome to the New World.');
    }
  };

  const handleTherapyComplete = () => {
      // Massive heal before the boss fight
      loadNextLevel(50); 
  };

  // Handle Gameplay Actions
  const handleModify = (cost: number, impact: number) => {
    // Check for AD Trigger
    if (Math.random() < AD_TRIGGER_CHANCE) {
        setShowAd(true);
    }
    
    // Apply Difficulty Modifiers
    const multiplier = selectedThesis ? selectedThesis.sanityPenalty : 1;
    const finalCost = Math.ceil(cost * multiplier);

    setStats(prev => {
        let newSanity = prev.sanity - finalCost;
        // Cap sanity
        if (newSanity > 100) newSanity = 100;
        
        return {
            ...prev,
            sanity: newSanity,
            slopIntegrity: Math.min(100, prev.slopIntegrity + impact)
        };
    });
  };

  const handleAdComplete = () => {
      setShowAd(false);
  };

  const handleAdSkip = () => {
      if (stats.clout >= CLOUT_SKIP_COST) {
          setStats(prev => ({ ...prev, clout: prev.clout - CLOUT_SKIP_COST }));
          setShowAd(false);
          addLog('SYSTEM', 'PREMIUM AD SKIP ACTIVATED. SOCIAL CREDIT DEDUCTED.');
      }
  };

  const handleSubmitSlop = async (finalText: string) => {
    setIsProcessing(true);
    const scene = SCENES[currentSceneIndex];
    addLog('PLAYER', `> SUBMITTED: "${finalText.substring(0, 30)}..."`);
    
    // Generate opponent reaction
    const reaction = await generateReaction(finalText, scene.opponentName, stats.slopIntegrity);
    
    addLog('WORLD', reaction);
    setIsProcessing(false);

    if (stats.slopIntegrity >= scene.requiredSlopScore) {
        addLog('SYSTEM', 'VIBE CHECK PASSED.');
        const cloutMultiplier = selectedThesis ? selectedThesis.cloutMultiplier : 1;
        const cloutGain = 100 * cloutMultiplier;
        setStats(prev => ({ ...prev, clout: prev.clout + cloutGain }));
        setGameState('SCENE_RESULT');
    } else {
        addLog('SYSTEM', 'VIBE CHECK FAILED. AUTHENTICITY TOO LOW.');
        setGameState('GAME_OVER_CAUGHT');
    }
  };

  const handleDeath = () => {
    setGameState('GAME_OVER_SANITY');
    addLog('SYSTEM', 'CRITICAL FAILURE: User forgot to breathe manually.');
  };

  const handleRestart = () => {
    setStats({ sanity: INITIAL_SANITY, slopIntegrity: 0, clout: 0 });
    setLogs([]);
    setCurrentSceneIndex(0);
    setIntroFinished(false);
    setSelectedThesis(null);
    setGameState('INTRO');
    setShowAd(false);
  };

  // Render Logic
  const currentScene = SCENES[currentSceneIndex];
  
  // Get Thesis-specific scene data
  const currentThesisData = selectedThesis && currentScene 
    ? selectedThesis.scenes[currentScene.id] 
    : { taskPrompt: "ERROR", baseCleanText: "ERROR" }; // Fallback

  const isBreathingRequired = stats.sanity < CRITICAL_SANITY_THRESHOLD && gameState !== 'GAME_OVER_SANITY' && gameState !== 'GAME_OVER_CAUGHT' && gameState !== 'VICTORY' && gameState !== 'TITLE_DROP';

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center relative overflow-hidden selection:bg-pink-500 selection:text-white">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-end mb-8 border-b-2 border-slate-800 pb-2">
        <div>
            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-700 tracking-tighter">
            EVERYTHING IS SLOP
            </h1>
            <p className="text-xs text-slate-500 font-mono mt-1">
            BUILD_2060.05.12 // DEPT_OF_AUTHENTICITY
            </p>
        </div>
        <div className="text-right hidden md:block">
            <div className="text-xs text-pink-500 font-slop">CLOUT: {stats.clout}</div>
        </div>
      </header>

      {/* Main Game Container */}
      <main className="w-full max-w-5xl flex flex-col gap-4 flex-grow relative z-10">
        
        {/* Always show Meters if in game */}
        {gameState !== 'INTRO' && gameState !== 'THESIS_SELECTION' && gameState !== 'THERAPY_SESSION' && gameState !== 'TITLE_DROP' && (
            <Meters stats={stats} />
        )}

        {/* Narrative Terminal */}
        {gameState !== 'THERAPY_SESSION' && gameState !== 'THESIS_SELECTION' && gameState !== 'TITLE_DROP' && (
            <Terminal 
                logs={logs} 
                onNext={advanceNarrative}
                // Hide button if processing or if scene is playing out (cutscene mode)
                showNext={!isProcessing && !isScenePlaying && (gameState === 'INTRO' || gameState === 'SCENE_INTRO' || gameState === 'SCENE_RESULT')}
            />
        )}

        {/* Thesis Selection Screen */}
        {gameState === 'THESIS_SELECTION' && (
            <ThesisSelection onSelect={handleThesisSelection} hardModeUnlocked={hardModeUnlocked} />
        )}

        {/* Title Drop Interstitial */}
        {gameState === 'TITLE_DROP' && (
          <TitleDrop onComplete={handleTitleDropComplete} subtitle={selectedThesis?.label} />
        )}

        {/* Therapy Session Overlay */}
        {gameState === 'THERAPY_SESSION' && (
            <TherapySession onComplete={handleTherapyComplete} />
        )}

        {/* Task Editor */}
        {gameState === 'SCENE_TASK' && (
            <SlopEditor 
                scene={currentScene} 
                taskPrompt={currentThesisData.taskPrompt}
                baseCleanText={currentThesisData.baseCleanText}
                onModify={handleModify}
                onSubmit={handleSubmitSlop}
                isProcessing={isProcessing || showAd}
                setIsProcessing={setIsProcessing}
            />
        )}

        {/* Game Over Screens */}
        {(gameState === 'GAME_OVER_SANITY' || gameState === 'GAME_OVER_CAUGHT') && (
            <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-1000">
                <h2 className="text-6xl font-bold text-red-600 mb-4 font-slop animate-bounce">
                    {gameState === 'GAME_OVER_SANITY' ? 'BRAINROT FATAL' : 'CANCELLED'}
                </h2>
                <p className="text-xl text-slate-300 mb-8 font-mono max-w-lg">
                    {gameState === 'GAME_OVER_SANITY' 
                        ? "You focused so hard on the content you forgot to metabolize oxygen. The irony is palpable."
                        : "The Inquisition detected logic in your syntax. You have been sentenced to 10 years of reaction content moderation."}
                </p>
                <button 
                    onClick={handleRestart}
                    className="px-8 py-4 bg-green-600 text-black font-bold rounded hover:bg-green-500 transition-colors"
                >
                    TRY AGAIN
                </button>
            </div>
        )}

        {gameState === 'VICTORY' && (
             <div className="fixed inset-0 z-50 bg-yellow-100 flex flex-col items-center justify-center p-8 text-center">
             <h2 className="text-6xl font-bold text-pink-600 mb-4 font-slop">
                 TOTAL VIRALITY
             </h2>
             <p className="text-xl text-black mb-8 font-sans max-w-lg">
                 You have successfully integrated. No one suspects you can do math. The Slop flows through you.
             </p>
             <button 
                 onClick={handleRestart}
                 className="px-8 py-4 bg-black text-white font-bold rounded-full hover:scale-110 transition-transform"
             >
                 PRESTIGE (RESTART)
             </button>
         </div>
        )}

      </main>

      {/* Manual Breathing Mechanic - Visual blocked state if Ad is Up */}
      <ManualBreathing 
        isActive={isBreathingRequired} 
        onDie={handleDeath} 
        isBlocked={showAd}
      />

      {/* Pop Up Ad Overlay */}
      {showAd && (
          <PopupAd 
            onComplete={handleAdComplete}
            onSkipWithClout={handleAdSkip}
            cloutAvailable={stats.clout}
          />
      )}

      {/* Footer */}
      <footer className="mt-8 text-slate-700 text-xs font-mono text-center">
        Powered by Gemini 2.5 Flash // Warning: Prolonged exposure may cause IQ decay.
      </footer>
    </div>
  );
};

export default App;
