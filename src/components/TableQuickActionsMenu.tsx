import React, { useEffect, useRef, useState } from 'react';
import {
  FileText,
  Pause,
  Play,
  RotateCcw,
  Terminal,
} from 'lucide-react';

export interface TableQuickActionsMenuProps {
  id: string;
  name: string;
  isPaused?: boolean;
  onRerun: () => void;
  onPause?: () => void;
  onViewLogs: () => void;
  onInspect?: () => void;
}

export const TableQuickActionsMenu: React.FC<TableQuickActionsMenuProps> = ({
  id,
  name,
  isPaused = false,
  onRerun,
  onPause,
  onViewLogs,
  onInspect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="w-7 h-7 inline-flex items-center justify-center rounded-[2px] text-[#5E6975] hover:text-[#182536] hover:bg-[#EFEFEB] border border-[#D5D5CE]/60 hover:border-[#182536] transition-colors focus:outline-none focus:border-[#182536] font-mono text-xs font-bold leading-none"
        title="Quick Actions"
        aria-label="Quick Actions"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        ...
      </button>

      {isOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-1 w-44 rounded-[2px] bg-[#FFFDF8] border border-[#D5D5CE] shadow-md py-1 z-50 text-xs font-sans animate-in fade-in zoom-in-95 duration-75 divide-y divide-[#EFEFEB]"
        >
          <div className="px-3 py-1.5 text-[9px] font-mono text-[#5E6975] uppercase tracking-wider bg-[#FAF9F5] flex items-center justify-between">
            <span>Quick Actions</span>
            <span className="text-[8px] font-mono text-[#5E6975]/80">{id}</span>
          </div>

          <div className="py-0.5">
            {onPause && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onPause();
                }}
                className="w-full px-3 py-1.5 text-left text-[#182536] hover:bg-[#FFF8E6] hover:text-[#A87405] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  {isPaused ? (
                    <>
                      <Play size={12} className="text-[#138468]" />
                      <span className="font-medium">Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause size={12} className="text-[#A87405]" />
                      <span className="font-medium">Pause</span>
                    </>
                  )}
                </div>
                <span className="text-[9px] font-mono text-[#5E6975]">{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onRerun();
              }}
              className="w-full px-3 py-1.5 text-left text-[#182536] hover:bg-[#FFF8E6] hover:text-[#A87405] flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <RotateCcw size={12} className="text-[#138468] group-hover:rotate-45 transition-transform" />
                <span className="font-medium">Re-run</span>
              </div>
              <span className="text-[9px] font-mono text-[#5E6975]">Trigger</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onViewLogs();
              }}
              className="w-full px-3 py-1.5 text-left text-[#182536] hover:bg-[#FFF8E6] hover:text-[#A87405] flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Terminal size={12} className="text-[#5E6975]" />
                <span className="font-medium">View Logs</span>
              </div>
              <span className="text-[9px] font-mono text-[#5E6975]">Trace</span>
            </button>

            {onInspect && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onInspect();
                }}
                className="w-full px-3 py-1.5 text-left text-[#182536] hover:bg-[#FFF8E6] hover:text-[#A87405] flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <FileText size={12} className="text-[#334256]" />
                  <span className="font-medium">Inspect</span>
                </div>
                <span className="text-[9px] font-mono text-[#5E6975]">Detail</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
