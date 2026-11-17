import { useState, useCallback, useRef } from 'react';

const generatePasswordValue = (length, numberAllowed, charAllowed) => {
  let pass = "";
  let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  if (numberAllowed) str += "0123456789";
  if (charAllowed) str += "!@#$%^&*";

  for (let i = 0; i < length; i++) {
    const charIndex = Math.floor(Math.random() * str.length);
    pass += str.charAt(charIndex);
  }

  return pass;
};

const App = () => {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState(() => generatePasswordValue(8, false, false));
  const [copied, setCopied] = useState(false);
  const passwordRef = useRef(null);

  const passwordGenerator = useCallback(() => {
    setPassword(generatePasswordValue(length, numberAllowed, charAllowed));
  }, [length, numberAllowed, charAllowed]);

  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 100);
    window.navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [password]);

  // Strength calculation
  const getStrength = () => {
    if (length < 8) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
    if (length < 12 && !numberAllowed && !charAllowed) return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (length >= 12 && (numberAllowed || charAllowed)) return { label: "Strong", color: "bg-green-500", width: "w-4/4" };
    return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">

      {/* Card */}
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-800">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-violet-600 rounded-2xl mb-4 shadow-lg shadow-violet-500/30">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Password Generator</h1>
          <p className="text-gray-400 text-sm mt-1">Generate a secure password instantly</p>
        </div>

        {/* Password Display */}
        <div className="relative mb-3">
          <input
            type="text"
            value={password}
            className="w-full bg-gray-800 text-violet-300 font-mono text-lg tracking-widest
                       rounded-xl px-4 py-4 pr-28 outline-none border border-gray-700
                       focus:border-violet-500 transition-all duration-200 select-all"
            placeholder="Your password"
            readOnly
            ref={passwordRef}
          />
          <button
            onClick={copyPasswordToClipboard}
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg
                        text-sm font-semibold transition-all duration-200
                        ${copied
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                          : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                        }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Strength Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400 uppercase tracking-wider">Strength</span>
            <span className={`text-xs font-semibold ${
              strength.label === 'Weak' ? 'text-red-400' :
              strength.label === 'Fair' ? 'text-yellow-400' :
              strength.label === 'Good' ? 'text-blue-400' : 'text-green-400'
            }`}>{strength.label}</span>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-5">

          {/* Length Slider */}
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-300">Length</label>
              <span className="text-sm font-bold text-violet-400 bg-violet-500/10 px-3 py-0.5 rounded-full">
                {length}
              </span>
            </div>
            <input
              type="range"
              min={6}
              max={100}
              value={length}
              className="w-full h-1.5 bg-gray-600 rounded-full appearance-none cursor-pointer accent-violet-500"
              onChange={(e) => {
                const newLength = Number(e.target.value);
                setLength(newLength);
                setPassword(generatePasswordValue(newLength, numberAllowed, charAllowed));
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">6</span>
              <span className="text-xs text-gray-500">100</span>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="grid grid-cols-2 gap-3">

            {/* Numbers Toggle */}
            <label
              htmlFor="numberInput"
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                          transition-all duration-200
                          ${numberAllowed
                            ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                               transition-all duration-200
                               ${numberAllowed ? 'bg-violet-500 border-violet-500' : 'border-gray-500'}`}>
                {numberAllowed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                id="numberInput"
                checked={numberAllowed}
                onChange={() => {
                  const newValue = !numberAllowed;
                  setNumberAllowed(newValue);
                  setPassword(generatePasswordValue(length, newValue, charAllowed));
                }}
                className="hidden"
              />
              <span className="text-sm font-medium">Numbers</span>
            </label>

            {/* Symbols Toggle */}
            <label
              htmlFor="charInput"
              className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer
                          transition-all duration-200
                          ${charAllowed
                            ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                          }`}
            >
              <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                               transition-all duration-200
                               ${charAllowed ? 'bg-violet-500 border-violet-500' : 'border-gray-500'}`}>
                {charAllowed && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                id="charInput"
                checked={charAllowed}
                onChange={() => {
                  const newValue = !charAllowed;
                  setCharAllowed(newValue);
                  setPassword(generatePasswordValue(length, numberAllowed, newValue));
                }}
                className="hidden"
              />
              <span className="text-sm font-medium">Symbols</span>
            </label>

          </div>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={passwordGenerator}
          className="w-full mt-6 py-3.5 bg-violet-600 hover:bg-violet-500 active:scale-95
                     text-white font-semibold rounded-xl transition-all duration-200
                     shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Regenerate Password
        </button>

      </div>
    </div>
  );
};

export default App;