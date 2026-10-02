import React from 'react';
import { Check } from 'lucide-react';

const Toast = ({ message, visible }) => {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-[#08080A] border border-[#F3EFE6]/30 text-[#F3EFE6] shadow-[0_10px_30px_rgba(0,0,0,0.9)] animate-toast-slide pointer-events-none font-mono text-xs uppercase tracking-wider"
      role="status"
    >
      <div className="flex items-center justify-center w-5 h-5 bg-[#B8001F] text-[#F3EFE6]">
        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
      </div>
      <div>
        {message}
      </div>
    </div>
  );
};

export default Toast;
