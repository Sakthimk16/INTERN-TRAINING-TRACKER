import type { ReactNode } from 'react';

type Tone = 'blue' | 'grey' | 'green' | 'orange';

export default function SummaryCard({ icon, label, value, tone = 'blue' }: {
  icon: ReactNode; label: string; value: number | string; tone?: Tone;
}) {
  return (
    <div className="summary-card">
      <span className={`summary-icon tone-${tone}`} aria-hidden="true">{icon}</span>
      <div>
        <div className="summary-label">{label}</div>
        <div className="summary-value">{value}</div>
      </div>
    </div>
  );
}
