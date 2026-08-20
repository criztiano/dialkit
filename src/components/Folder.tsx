import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ICON_PANEL, ICON_CHEVRON } from '../icons';

interface FolderProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  /** `false` renders a plain section header: no caret, no click-to-collapse, body always open. */
  collapsible?: boolean;
  isRoot?: boolean;
  inline?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  toolbar?: ReactNode;
  /** Root only — the tab bar, riding the panel header under the toolbar. */
  tabs?: ReactNode;
  /** One line of help for the section, revealed on hover over the header. */
  hint?: string;
  hintId?: string;
}

export function Folder({ title, children, defaultOpen = true, collapsible = true, isRoot = false, inline = false, onOpenChange, toolbar, tabs, hint, hintId }: FolderProps) {
  const [isOpen, setIsOpen] = useState(collapsible ? defaultOpen : true);
  const [isCollapsed, setIsCollapsed] = useState(collapsible ? !defaultOpen : false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);
  const [windowHeight, setWindowHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    if (!isRoot) return;
    const onResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isRoot]);

  // Track content height for explicit panel sizing (no height: 'auto')
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (isOpen) {
        const h = el.offsetHeight;
        setContentHeight(prev => prev === h ? prev : h);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  const handleToggle = () => {
    if (!collapsible) return;
    if (inline && isRoot) return;
    const next = !isOpen;
    setIsOpen(next);
    if (next) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
    onOpenChange?.(next);
  };

  const folderContent = (
    <div ref={isRoot ? contentRef : undefined} className={`tweakers-folder ${isRoot ? 'tweakers-folder-root' : ''}`}>
      <div
        className={`tweakers-folder-header ${isRoot ? 'tweakers-panel-header' : ''} ${collapsible ? '' : 'tweakers-folder-header-static'}`}
        onClick={collapsible ? handleToggle : undefined}
        data-hint={hint ? 'true' : undefined}
        aria-describedby={hint ? hintId : undefined}
      >
        <div className="tweakers-folder-header-top">
          {isRoot ? (
            isOpen && (
              <div className="tweakers-folder-title-row">
                <span className="tweakers-folder-title tweakers-folder-title-root">
                  {title}
                </span>
              </div>
            )
          ) : (
            <div className="tweakers-folder-title-row">
              <span className="tweakers-folder-title">
                {title}
              </span>
            </div>
          )}
          {!isRoot && toolbar && (
            <div className="tweakers-folder-toolbar" onClick={(e) => e.stopPropagation()}>
              {toolbar}
            </div>
          )}
          {isRoot && !inline && (
            <svg
              className="tweakers-panel-icon"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path opacity="0.5" d={ICON_PANEL.path} fill="currentColor"/>
              {ICON_PANEL.circles.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill="currentColor" stroke="currentColor" strokeWidth="1.25"/>
              ))}
            </svg>
          )}
          {!isRoot && collapsible && (
            <motion.svg
              className="tweakers-folder-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ rotate: isOpen ? 0 : 180 }}
              transition={{ type: 'spring', visualDuration: 0.35, bounce: 0.15 }}
            >
              <path d={ICON_CHEVRON} />
            </motion.svg>
          )}
        </div>

        {isRoot && toolbar && isOpen && (
          <div className="tweakers-panel-toolbar" onClick={(e) => e.stopPropagation()}>
            {toolbar}
          </div>
        )}

        {isRoot && tabs && isOpen && (
          <div className="tweakers-panel-tabs" onClick={(e) => e.stopPropagation()}>
            {tabs}
          </div>
        )}

        {hint && (
          <span className="tweakers-hint" id={hintId} role="tooltip">
            {hint}
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="tweakers-folder-content"
            initial={isRoot ? undefined : { height: 0, opacity: 0 }}
            animate={isRoot ? undefined : { height: 'auto', opacity: 1 }}
            exit={isRoot ? undefined : { height: 0, opacity: 0 }}
            transition={isRoot ? undefined : { type: 'spring', visualDuration: 0.35, bounce: 0.1 }}
            style={isRoot ? undefined : { clipPath: 'inset(0 -20px)' }}
          >
            <div className="tweakers-folder-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isRoot) {
    if (inline) {
      return (
        <div className="tweakers-panel-inner tweakers-panel-inline">
          {folderContent}
        </div>
      );
    }

    const panelStyle = isOpen
      ? { width: 280, height: contentHeight !== undefined ? Math.min(contentHeight + 10, windowHeight - 32) : 'auto' as const, borderRadius: 14, boxShadow: 'var(--tweak-shadow)', cursor: undefined as string | undefined, overflowY: 'auto' as const }
      : { width: 42, height: 42, borderRadius: '50%', boxSizing: 'border-box' as const, boxShadow: 'var(--tweak-shadow-collapsed)', overflow: 'hidden' as const, cursor: 'pointer' as const };

    return (
      <motion.div
        className="tweakers-panel-inner"
        style={panelStyle}
        onClick={!isOpen ? handleToggle : undefined}
        data-collapsed={isCollapsed}
        whileTap={!isOpen ? { scale: 0.9 } : undefined}
        transition={{ type: 'spring', visualDuration: 0.15, bounce: 0.3 }}
      >
        {folderContent}
      </motion.div>
    );
  }

  return folderContent;
}
