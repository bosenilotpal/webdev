interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="loading-state" style={{ padding: '2rem', textAlign: 'center' }}>
      <p>{message}</p>
    </div>
  );
}
