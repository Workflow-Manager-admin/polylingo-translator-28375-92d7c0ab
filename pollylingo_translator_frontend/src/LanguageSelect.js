import React from "react";
import PropTypes from "prop-types";

// Demo language options; in production, use a full dynamic or static ISO list.
const LANGUAGES = [
  { code: "auto", label: "Auto-Detect" },
  { code: "en", label: "English" },
  { code: "es", label: "Spanish" },
  { code: "zh", label: "Chinese" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "ar", label: "Arabic" },
  { code: "ru", label: "Russian" },
  { code: "ja", label: "Japanese" },
];

// PUBLIC_INTERFACE
function LanguageSelect({
  inputLanguage,
  outputLanguages,
  onInputLangChange,
  onOutputLangChange,
}) {
  return (
    <div
      className="language-select-block"
      aria-label="Language selection"
      role="group"
    >
      <div className="lang-select-row">
        <label htmlFor="input-language" className="lang-label">
          Input Language
        </label>
        <select
          id="input-language"
          className="lang-dropdown"
          value={inputLanguage}
          onChange={(e) => onInputLangChange(e.target.value)}
          aria-label="Select input language"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <div className="lang-select-row">
        <label htmlFor="output-languages" className="lang-label">
          Output Languages
        </label>
        <select
          id="output-languages"
          className="lang-dropdown"
          multiple
          value={outputLanguages}
          onChange={(e) => {
            // Convert selected options to array for multi-select
            const selected = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            onOutputLangChange(selected);
          }}
          aria-label="Select one or more output languages"
        >
          {LANGUAGES.filter((lang) => lang.code !== "auto").map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <div className="lang-multiselect-hint" aria-live="polite">
          (Ctrl/Cmd+Click for multiple)
        </div>
      </div>
    </div>
  );
}

LanguageSelect.propTypes = {
  inputLanguage: PropTypes.string.isRequired,
  outputLanguages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onInputLangChange: PropTypes.func.isRequired,
  onOutputLangChange: PropTypes.func.isRequired,
};

export default LanguageSelect;
