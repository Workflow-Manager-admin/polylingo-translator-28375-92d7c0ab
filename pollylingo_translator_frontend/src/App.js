import React, { useState } from 'react';
import './App.css';
import TextInput from './TextInput';
import VoiceInput from './VoiceInput';
import ModeToggle from './ModeToggle';
import LanguageSelect from './LanguageSelect';
import { translateText } from './translationAPI';

// PUBLIC_INTERFACE
function App() {
  // State management for input mode and input value.
  const [mode, setMode] = useState("text");
  const [inputValue, setInputValue] = useState("");
  const [inputLang, setInputLang] = useState("auto"); // Detected or chosen input language
  const [outputLangs, setOutputLangs] = useState(["en", "es"]); // Defaults
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handles translation process when submitting input
  async function handleTranslate(e) {
    e && e.preventDefault();
    setError(null);

    // Skip empty input
    if (!inputValue.trim() || !outputLangs.length) {
      setError("Please provide text and select at least one output language.");
      setTranslations({});
      return;
    }

    setLoading(true);
    try {
      const results = await translateText(inputValue, {
        inputLang,
        outputLangs,
        // apiChoice: "mock", // For demo; replace with real integration configs
        // apiKey: "YOUR_API_KEY"
      });
      setTranslations(results);
    } catch (e) {
      setTranslations({});
      setError(e?.message || "Translation error.");
    }
    setLoading(false);
  }

  // Submission on input ("Enter" for text), could add a button for clarity
  // Not handling submit on input change automatically to avoid spamming API

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
          <form className="input-section" onSubmit={handleTranslate} aria-label="Translator input form">
            {/* Language selection */}
            <LanguageSelect
              inputLanguage={inputLang}
              outputLanguages={outputLangs}
              onInputLangChange={setInputLang}
              onOutputLangChange={setOutputLangs}
            />
            {/* Input section: renders TextInput or VoiceInput per mode */}
            <div className="placeholder-input" style={{ background: "transparent", border: "none", padding: 0, margin: 0 }}>
              {mode === "text" ? (
                <TextInput
                  value={inputValue}
                  onChange={setInputValue}
                />
              ) : (
                <VoiceInput
                  value={inputValue}
                  onChange={setInputValue}
                />
              )}
            </div>
            {/* Mode toggles */}
            <div className="placeholder-toggle" style={{ background: "transparent", border: "none", padding: 0, margin: 0 }}>
              <ModeToggle mode={mode} onModeChange={mode => {
                setMode(mode);
                setInputValue(""); // Clear input on mode switch for clarity
                setTranslations({});
              }} />
            </div>
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button
                type="submit"
                className="btn btn-large"
                disabled={loading || !inputValue.trim() || !outputLangs.length}
                aria-disabled={loading || !inputValue.trim() || !outputLangs.length}
              >
                {loading ? "Translating..." : "Translate"}
              </button>
            </div>
            {error && (
              <div style={{ color: "#cb2626", marginTop: 7, background: "#fff0f0", borderRadius: 6, padding: "7px 13px", fontSize: "1em" }} role="alert">
                {error}
              </div>
            )}
          </form>
          <section className="results-section">
            {/* Results placeholder replaced with actual translations */}
            {Object.keys(translations).length > 0 ? (
              <div className="translation-results" role="region" aria-live="polite">
                {Object.entries(translations).map(([lang, text]) => (
                  <div
                    key={lang}
                    style={{
                      background: "#f7fdfb",
                      borderLeft: "5px solid var(--secondary)",
                      borderRadius: 7,
                      marginBottom: 17,
                      padding: "14px 11px",
                      boxShadow: "0 1px 3px rgba(45,106,79,0.05)",
                      fontSize: "1.10em"
                    }}
                  >
                    <div style={{ fontWeight: 600, color: "var(--primary)", marginBottom: 4 }}>
                      {lang.toUpperCase()}
                    </div>
                    <div>{text}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="placeholder placeholder-results">
                <span className="placeholder-label">[ Translation Results Placeholder ]</span>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;