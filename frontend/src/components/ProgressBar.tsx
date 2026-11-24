export default function ProgressBar({ percent }: { percent: number }) {
  const value = Math.max(0, Math.min(100, percent));
  return (
    <div className="progress-row">
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label="Completion">
        <div className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="progress-text">{value}%</span>
    </div>
  );
}
