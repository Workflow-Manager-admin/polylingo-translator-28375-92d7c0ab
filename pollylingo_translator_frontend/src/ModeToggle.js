import React from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
function ModeToggle({ mode, onModeChange }) {
  return (
    <div
      className="mode-toggle"
      role="radiogroup"
      aria-label="Input mode toggle"
    >
      <button
        type="button"
        className={`toggle-btn${mode === "text" ? " toggled" : ""}`}
        aria-pressed={mode === "text"}
        onClick={() => onModeChange("text")}
        tabIndex={0}
      >
        <span role="img" aria-label="Text input">
          📝
        </span>{" "}
        Text
      </button>
      <button
        type="button"
        className={`toggle-btn${mode === "voice" ? " toggled" : ""}`}
        aria-pressed={mode === "voice"}
        onClick={() => onModeChange("voice")}
        tabIndex={0}
      >
        <span role="img" aria-label="Voice input">
          🎤
        </span>{" "}
        Voice
      </button>
    </div>
  );
}

ModeToggle.propTypes = {
  mode: PropTypes.oneOf(["text", "voice"]).isRequired,
  onModeChange: PropTypes.func.isRequired,
};

export default ModeToggle;
