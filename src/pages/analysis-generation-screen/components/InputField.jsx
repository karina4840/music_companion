import React from "react";

const InputField = ({
  value,
  onChange,
  placeholder,
  maxLength = 100,
  label,
  error,
  required = false,
}) => {
  const characterCount = value ? value.length : 0;
  const isNearLimit = characterCount > maxLength * 0.8;

  return (
    <div className="mb-6">
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full bg-surface border rounded-lg px-4 py-3 text-text-primary placeholder-text-disabled focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
            error
              ? "border-error focus:ring-error"
              : "border-border hover:border-text-disabled"
          }`}
          required={required}
        />

        <div className="flex items-center justify-between mt-2">
          {error && <span className="text-sm text-error">{error}</span>}
          <span
            className={`text-xs ml-auto ${
              isNearLimit ? "text-warning" : "text-text-disabled"
            }`}
          >
            {characterCount}/{maxLength}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputField;
