import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * Helper: Play text using Web Speech API (TTS) for the given language code.
 * Returns the utterance instance so playback can be managed (for replay, cancel, etc).
 */
function speakText(text, lang, onEnd, onError) {
  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    if (onError) onError(new Error("Speech synthesis not supported."));
    return null;
  }
  if (!text) return null;

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new window.SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onend = onEnd || null;
  utterance.onerror = onError || null;
  window.speechSynthesis.speak(utterance);
  return utterance;
}

// Map ISO code to BCP-47 for optimal TTS support
const LANG_TO_TTS = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  zh: "zh-CN",
  ar: "ar-SA",
  ru: "ru-RU",
  ja: "ja-JP",
  // fallback: use code itself if missing
};

/**
 * Accessible translation result cards with Copy and Play (TTS) actions.
 * Ensures keyboard accessibility and clear focus states.
 *
 * // PUBLIC_INTERFACE
 */
function TranslationResults({ translations }) {
  // Maintain TTS playing state for each language
  const [playing, setPlaying] = useState({});

  const handleCopy = async (text, langCode) => {
    // Prefer navigator clipboard
    try {
      await navigator.clipboard.writeText(text);
      // Optional: indicate copied, perhaps via aria-live or a small toast
      // For demo, no toast implemented
    } catch (err) {
      // fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch (e) {}
      document.body.removeChild(textarea);
    }
  };

  const handlePlay = (lang, text) => {
    const ttsLang = LANG_TO_TTS[lang] || lang;
    setPlaying(prev => ({ ...prev, [lang]: true }));
    speakText(
      text,
      ttsLang,
      () => setPlaying(prev => ({ ...prev, [lang]: false })),
      () => setPlaying(prev => ({ ...prev, [lang]: false }))
    );
  };

  const handleReplay = (lang, text) => {
    handlePlay(lang, text);
  };

  // Keyboard handler for Copy/Play buttons
  function keyButtonHandler(fn) {
    return e => {
      if (e.type === "keydown" && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        fn();
      }
    };
  }

  // List of translation cards sorted for consistent order (could order as needed)
  const resultArr = Object.entries(translations);

  if (!resultArr.length) {
    return null;
  }

  return (
    <div className="translation-results" role="region" aria-live="polite">
      {/* Each card: visually distinct, accessible */}
      {resultArr.map(([lang, text]) => (
        <div
          key={lang}
          className="translation-card"
          style={{
            background: "#f7fdfb",
            borderLeft: "5px solid var(--secondary)",
            borderRadius: 7,
            marginBottom: 17,
            padding: "14px 11px",
            boxShadow: "0 1px 3px rgba(45,106,79,0.05)",
            fontSize: "1.10em",
            display: "flex",
            flexDirection: "column",
            position: "relative"
          }}
          tabIndex={0}
          aria-label={`Translation result in ${lang.toUpperCase()}`}
          onKeyDown={e => {
            // Allow user to focus card for screen readers; no direct action on card enter.
          }}
        >
          <div style={{ fontWeight: 600, color: "var(--primary)", marginBottom: 4 }}>
            {lang.toUpperCase()}
          </div>
          <div style={{ wordBreak: "break-word", marginBottom: 12 }}>{text}</div>
          <div style={{ display: "flex", gap: 16 }}>
            {/* Copy button */}
            <button
              className="btn"
              type="button"
              aria-label={`Copy translated text for ${lang.toUpperCase()}`}
              tabIndex={0}
              onClick={() => handleCopy(text, lang)}
              onKeyDown={keyButtonHandler(() => handleCopy(text, lang))}
              style={{ fontSize: "1em", padding: "7px 18px" }}
            >
              <span role="img" aria-label="Copy">📋</span> Copy
            </button>
            {/* Play (TTS) / Replay */}
            <button
              className="btn"
              type="button"
              aria-label={
                playing[lang]
                  ? `Translation is playing. Press to replay in ${lang.toUpperCase()}`
                  : `Play translation in ${lang.toUpperCase()}`
              }
              tabIndex={0}
              onClick={() => (playing[lang] ? handleReplay(lang, text) : handlePlay(lang, text))}
              onKeyDown={keyButtonHandler(() =>
                playing[lang] ? handleReplay(lang, text) : handlePlay(lang, text)
              )}
              style={{
                fontSize: "1em",
                padding: "7px 18px",
                background: playing[lang] ? "var(--secondary)" : undefined,
              }}
              disabled={!text}
              aria-pressed={!!playing[lang]}
            >
              <span role="img" aria-label={playing[lang] ? "Replay" : "Play"}>
                {playing[lang] ? "🔁" : "▶️"}
              </span>
              {playing[lang] ? " Replay" : " Play"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

TranslationResults.propTypes = {
  translations: PropTypes.object.isRequired // { langCode: translatedText }
};

export default TranslationResults;
