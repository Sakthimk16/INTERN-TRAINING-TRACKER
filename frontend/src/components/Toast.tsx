import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

/** Transient success message; dismisses itself after 3 seconds. */
export default function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onClose, 3000);
    return () => window.clearTimeout(t);
  }, [message, onClose]);

  return (
    <div className="toast" role="status">
      <CheckCircle2 size={18} aria-hidden="true" /> {message}
    </div>
  );
}
