import React, { useState } from 'react';
import { Play, Code, Cpu, Terminal, ArrowRight, Layers } from 'lucide-react';

function App() {
  const [code, setCode] = useState(
`def count_up(n):
    total = 0
    for i in range(1, n + 1):
        total += i
    return total`
  );
  const [functionCall, setFunctionCall] = useState('count_up(3)');
  const [traceData, setTraceData] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRunTrace = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://127.0.0.1:8000/api/trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, function_call: functionCall }),
      });
      
      const data = await response.json();
      if (data.success) {
        setTraceData(data.trace);
        setCurrentStep(0);
      } else {
        setError(data.detail || 'Failed to execute trace.');
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure Uvicorn is running!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800/60 bg-[#0F1422]/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/20 p-2 rounded-lg border border-indigo-500/30">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-wide text-white">debuggy</h1>
            <p className="text-xs text-slate-400">Python Execution Visualizer Engine</p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
        
        {/* Left Hand Column: Code Inputs */}
        <div className="flex flex-col gap-4 bg-[#0F1422] rounded-xl border border-slate-800/50 p-5">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <Code className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-medium uppercase tracking-wider text-slate-300">Source Script Input</h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 bg-[#131A2C] border border-slate-800 rounded-lg p-4 font-mono text-sm text-indigo-200 focus:outline-none focus:border-indigo-500/50 resize-none tab-size-4"
              spellCheck="false"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Trigger Execution Call String
            </label>
            <input
              type="text"
              value={functionCall}
              onChange={(e) => setFunctionCall(e.target.value)}
              className="bg-[#131A2C] border border-slate-800 rounded-lg px-4 py-2.5 font-mono text-sm text-emerald-400 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <button
            onClick={handleRunTrace}
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:bg-indigo-800/40 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition duration-150"
          >
            <Play className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing Code Call Matrix...' : 'Execute Timeline Trace'}
          </button>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg p-3 text-sm font-mono mt-2">
              {error}
            </div>
          )}
        </div>

        {/* Right Hand Column: Step Timeline Logs */}
        <div className="flex flex-col gap-4 bg-[#0F1422] rounded-xl border border-slate-800/50 p-5 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-medium uppercase tracking-wider text-slate-300">Live Tracer Timeline State</h2>
            </div>
            {traceData.length > 0 && (
              <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400 font-mono">
                Step {currentStep + 1} / {traceData.length}
              </span>
            )}
          </div>

          {traceData.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2 border border-dashed border-slate-800 rounded-lg">
              <p className="text-sm">No code trace active yet</p>
              <p className="text-xs text-slate-600">Write an algorithm and hit trace to generate timeline frames</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
              {/* Sliders and Playback controls */}
              <div className="bg-[#131A2C] border border-slate-800 rounded-lg p-4 flex flex-col gap-3">
                <input
                  type="range"
                  min="0"
                  max={traceData.length - 1}
                  value={currentStep}
                  onChange={(e) => setCurrentStep(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between">
                  <button 
                    disabled={currentStep === 0}
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    className="text-xs px-3 py-1 bg-slate-800 border border-slate-700/60 rounded hover:bg-slate-700 disabled:opacity-30"
                  >
                    Prev Frame
                  </button>
                  <button 
                    disabled={currentStep === traceData.length - 1}
                    onClick={() => setCurrentStep(prev => Math.min(traceData.length - 1, prev + 1))}
                    className="text-xs px-3 py-1 bg-indigo-600 rounded hover:bg-indigo-500 disabled:opacity-30 flex items-center gap-1"
                  >
                    Next Frame <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* State Frames Display box */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1">
                {/* Meta Frame */}
                <div className="bg-[#131A2C] border border-slate-800 rounded-lg p-4 flex flex-col gap-2.5">
                  <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Interpreter Coordinates</div>
                  <div className="bg-[#0B0F17] rounded-lg p-3 font-mono text-sm border border-slate-900 flex flex-col gap-1.5">
                    <div><span className="text-slate-500">Current Line:</span> <span className="text-amber-400 font-bold">{traceData[currentStep].line}</span></div>
                    <div><span className="text-slate-500">Function Target:</span> <span className="text-indigo-400">{traceData[currentStep].function}</span></div>
                    <div><span className="text-slate-500">Tracer Event:</span> <span className="text-purple-400 text-xs uppercase px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-900/30">{traceData[currentStep].event}</span></div>
                  </div>
                </div>

                {/* Variable Memory State */}
                <div className="bg-[#131A2C] border border-slate-800 rounded-lg p-4 flex flex-col gap-2.5">
                  <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Memory Snapshots</div>
                  <div className="bg-[#0B0F17] rounded-lg p-3 font-mono text-sm border border-slate-900 flex-1 min-h-[120px]">
                    {Object.keys(traceData[currentStep].variables).length === 0 ? (
                      <span className="text-slate-600 text-xs italic">No initialized variables in this frame allocation scope</span>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        {Object.entries(traceData[currentStep].variables).map(([key, val]) => (
                          <div key={key} className="flex justify-between border-b border-slate-900/50 pb-1 last:border-none">
                            <span className="text-slate-400">{key}:</span>
                            <span className="text-emerald-400 font-medium">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;