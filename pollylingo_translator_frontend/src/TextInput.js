import React from "react";
import PropTypes from "prop-types";

// PUBLIC_INTERFACE
/**
 * TextInput - Accessible, controlled text input for user entry.
 * @param {string} value - Current input value.
 * @param {function} onChange - Handler for value changes.
 * @param {string} [ariaLabel] - Optional ARIA label for accessibility.
 */
function TextInput({ value, onChange, ariaLabel = "Translation input" }) {
  return (
    <div style={{ width: "100%" }}>
      <label htmlFor="text-input-main" style={{
        position: "absolute",
        left: "-9999px",
        top: "auto",
        width: "1px",
        height: "1px",
        overflow: "hidden"
      }}>
        {ariaLabel}
      </label>
      <textarea
        id="text-input-main"
        className="input-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Type text to translate..."
        rows={4}
        style={{
          width: "100%",
          fontSize: "1.09rem",
          borderRadius: "9px",
          border: "1.5px solid var(--border-color)",
          padding: "14px 13px",
          resize: "vertical",
          background: "#f7fdfb",
          color: "var(--text-color)",
          transition: "border 0.18s"
        }}
        aria-label={ariaLabel}
        aria-multiline="true"
        required
      />
    </div>
  );
}

TextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  ariaLabel: PropTypes.string
};

export default TextInput;
