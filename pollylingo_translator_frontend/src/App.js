import React, { useState } from 'react';
import './App.css';
import TextInput from './TextInput';
import VoiceInput from './VoiceInput';
import ModeToggle from './ModeToggle';

// PUBLIC_INTERFACE
function App() {
  // State management for input mode and input value.
  const [mode, setMode] = useState("text");
  const [inputValue, setInputValue] = useState("");

  // For integration: inputValue is the canonical text needing translation
  // In future: Provide to language selection and translation logic.

  return (
    <div className="app">
      <nav className="navbar">
        <div className="container nav-content">
          <div className="logo app-title">
            <span className="logo-symbol" aria-label="PolyLingo Symbol">λ</span>
            <span className="brand-main">PolyLingo Translator</span>
          </div>
          <div>
            <span className="brand-sub">powered by KAVIA AI</span>
          </div>
        </div>
      </nav>

      <main>
        <div className="container main-container">
          <section className="input-section">
            {/* Language selection placeholder */}
            <div className="placeholder placeholder-language-select">
              <span className="placeholder-label">[ Language Selection Placeholder ]</span>
            </div>
            {/* Input section: renders TextInput or VoiceInput per mode */}
            <div className="placeholder-input" style={{ background: "transparent", border: "none", padding: 0, margin: 0 }}>
              {mode === "text" ? (
                <TextInput value={inputValue} onChange={setInputValue} />
              ) : (
                <VoiceInput value={inputValue} onChange={setInputValue} />
              )}
            </div>
            {/* Mode toggles */}
            <div className="placeholder-toggle" style={{ background: "transparent", border: "none", padding: 0, margin: 0 }}>
              <ModeToggle mode={mode} onModeChange={mode => {
                setMode(mode);
                setInputValue(""); // Clear input on mode switch for clarity
              }} />
            </div>
          </section>
          <section className="results-section">
            {/* Results Placeholder */}
            <div className="placeholder placeholder-results">
              <span className="placeholder-label">[ Translation Results Placeholder ]</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;