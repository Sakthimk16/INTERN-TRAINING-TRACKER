import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  id: string;
  label: string;
  required?: boolean;
  optionalNote?: boolean;
  icon?: ReactNode;
  error?: string;
  /** Label above the input (used on the login card). */
  stacked?: boolean;
  children: ReactNode;
}

/** Label, required marker, optional icon, input (children) and inline error with a warning icon. */
export default function FormField({ id, label, required, optionalNote, icon, error, stacked, children }: Props) {
  return (
    <div className={`field${stacked ? ' field-stacked' : ''}`}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
        {optionalNote && <span className="optional"> (optional)</span>}
      </label>
      <div className="field-control">
        <div className={`input-wrap${error ? ' has-error' : ''}`}>
          {icon && <span className="input-icon" aria-hidden="true">{icon}</span>}
          {children}
        </div>
        {error && (
          <p className="field-error" id={`${id}-error`} role="alert">
            <AlertTriangle size={14} aria-hidden="true" /> {error}
          </p>
        )}
      </div>
    </div>
  );
}
