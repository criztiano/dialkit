import type { Ref } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

interface PresenceMotionDivProps extends HTMLMotionProps<'div'> {
  divRef?: Ref<HTMLDivElement>;
}

/**
 * motion.div for use as the direct child of AnimatePresence. Takes its DOM
 * ref via `divRef` because motion 12's AnimatePresence reads `props.ref` on
 * its child, which triggers React 18's dev-mode "`ref` is not a prop"
 * warning on any element created with a JSX ref.
 */
export function PresenceMotionDiv({ divRef, ...props }: PresenceMotionDivProps) {
  return <motion.div ref={divRef} {...props} />;
}
