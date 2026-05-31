interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" style={{ padding: '2rem', textAlign: 'center' }}>
      <p style={{ color: 'var(--color-error, #c00)' }}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Try again
        </button>
      )}
    </div>
  );
}
