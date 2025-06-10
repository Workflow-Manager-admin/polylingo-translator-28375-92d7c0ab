import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

// Checks for browser speech recognition support.
const getSpeechRecognition = () => {
  const SpeechRec =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition;
  return SpeechRec ? new SpeechRec() : null;
};

// PUBLIC_INTERFACE
/**
 * VoiceInput - Accessible speech-to-text input using Web Speech API.
 * @param {string} value - Current input value (transcript).
 * @param {function} onChange - Handler for transcript value changes.
 * @param {string} [ariaLabel] - Optional ARIA label for accessibility.
 */
function VoiceInput({ value, onChange, ariaLabel = "Voice input for translation" }) {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState("");
  const recognitionRef = useRef(null);

  const handleStart = () => {
    setError("");
    if (!recognitionRef.current) {
      const rec = getSpeechRecognition();
      if (!rec) {
        setError("Speech recognition is not supported in this browser.");
        return;
      }
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "auto";
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onChange(transcript);
      };
      rec.onerror = (event) => {
        setError(event.error === "not-allowed"
          ? "Microphone access denied."
          : "Speech recognition error or unavailable.");
        setIsRecording(false);
      };
      rec.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = rec;
    }
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const handleStop = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  return (
    <div style={{ width: "100%" }}>
      <label htmlFor="voice-input-main" style={{
        position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden"
      }}>
        {ariaLabel}
      </label>
      <div
        className="voice-input-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <textarea
          id="voice-input-main"
          className="input-textarea"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Your spoken input will appear here..."
          rows={3}
          style={{
            width: "100%",
            fontSize: "1.09rem",
            borderRadius: "9px",
            border: "1.5px solid var(--border-color)",
            padding: "14px 13px",
            background: "#fafbf8",
            color: "var(--text-color)",
            resize: "vertical",
            minHeight: 56,
            marginBottom: 4,
            transition: "border 0.18s"
          }}
          aria-label={ariaLabel}
          aria-multiline="true"
          required
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="btn"
            onClick={isRecording ? handleStop : handleStart}
            style={{
              background: isRecording ? "var(--secondary)" : "var(--primary)",
              color: "#fff",
              outline: isRecording ? "2px solid var(--accent)" : undefined,
              position: "relative"
            }}
            aria-pressed={isRecording}
            aria-label={isRecording ? "Stop Recording" : "Start Voice Input"}
          >
            <span role="img" aria-label={isRecording ? "Stop" : "Microphone"}>
              {isRecording ? "⏹️" : "🎤"}
            </span>
            {isRecording ? " Stop" : " Start Recording"}
          </button>
          {isRecording && (
            <span
              style={{
                display: "inline-block",
                color: "#cb2626",
                fontWeight: 500,
                marginLeft: 8,
                fontSize: "1em"
              }}
              aria-live="polite"
            >
              Listening...
            </span>
          )}
        </div>
        {error && (
          <div
            style={{
              color: "#cb2626",
              fontSize: "0.98em",
              marginTop: 4,
              background: "#fff9f9",
              borderRadius: 5,
              padding: "4px 7px"
            }}
            role="alert"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

VoiceInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string
};

export default VoiceInput;
