'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
}

export default function Input({
  label,
  error,
  multiline = false,
  className = '',
  ...props
}: InputProps) {
  const inputClasses = `input ${error ? 'error' : ''} ${className}`.trim();

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={props.id} className="input-label">
          {label}
        </label>
      )}
      {multiline ? (
        <textarea
          className={inputClasses}
          {...(props as any)}
          rows={4}
        />
      ) : (
        <input className={inputClasses} {...props} />
      )}
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
}

