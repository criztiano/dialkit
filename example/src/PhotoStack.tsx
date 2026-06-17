import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useDialKit, DialStore } from 'dialkit';
import type { ChipOption, ListItemType } from 'dialkit';

const PANEL_NAME = 'Photo Stack';

const PHOTOS = [
  { id: 1, key: 'one', src: '/photos/one.avif', color: '#c41e3a' },
  { id: 2, key: 'two', src: '/photos/two.avif', color: '#1a1a2e' },
  { id: 3, key: 'three', src: '/photos/three.avif', color: '#e8d5b7' },
  { id: 4, key: 'four', src: '/photos/four.avif', color: '#2d5a27' },
];

// Demo data for the new Svelte-ported controls (swatch + chips).
const PALETTES = [
  { value: 'sunset', label: 'Sunset', colors: ['#ff5a3c', '#ffb38a', '#6366f1'] },
  { value: 'forest', label: 'Forest', colors: ['#10b981', '#6ee7b7'] },
  { value: 'ocean', label: 'Ocean', colors: ['#0ea5e9', '#67e8f9'] },
  { value: 'mono', label: 'Mono', colors: ['#1a1a1a'] },
];

const INITIAL_LOOKS: ChipOption[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'bold', label: 'Bold' },
  { value: 'warm', label: 'Warm', removable: true },
  { value: 'cool', label: 'Cool', removable: true },
];

// Effect-stack item types for the `list` control — each composes into the front
// photo's live CSS filter (or a tint overlay), the way a layer stack would.
const EFFECT_TYPES: Record<string, ListItemType> = {
  blur: { label: 'Blur', schema: { radius: [4, 0, 24] } },
  brightness: { label: 'Brightness', schema: { amount: [1.15, 0.2, 2, 0.05] } },
  saturate: { label: 'Saturate', schema: { amount: [1.5, 0, 3, 0.05] } },
  hueRotate: { label: 'Hue Rotate', schema: { angle: [0, 0, 360, 1] } },
  tint: { label: 'Tint', schema: { color: '#ff5a3c', strength: [0.35, 0, 1, 0.01] } },
};

export function PhotoStack() {
  const [step, setStep] = useState(0);
  const currentIndex = step % PHOTOS.length;

  // State for the new controls' events (file pick, chip removal).
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [looks, setLooks] = useState<ChipOption[]>(INITIAL_LOOKS);

  const next = () => {
    setStep((s) => s + 1);
  };

  const params = useDialKit(PANEL_NAME, {
    title: 'Japan',
    subtitle: { type: 'text' as const, default: 'December 2025', placeholder: 'Enter subtitle...' },
    shadowTint: '#000000',
    photoShape: {
      type: 'select' as const,
      options: [
        { value: 'portrait', label: 'Portrait' },
        { value: 'square', label: 'Square' },
        { value: 'landscape', label: 'Landscape' },
      ],
      default: 'portrait',
    },
    texture: { type: 'file' as const, accept: 'image/*' },
    palette: { type: 'swatch' as const, default: 'sunset', options: PALETTES },
    look: { type: 'chips' as const, default: 'calm', options: looks },
    effects: {
      type: 'list' as const,
      addLabel: 'Add effect',
      itemTypes: EFFECT_TYPES,
      default: [
        { type: 'brightness', params: { amount: 1.1 } },
        { type: 'saturate', params: { amount: 1.5 } },
      ],
    },
    cover: {
      type: 'gallery' as const,
      default: 'one',
      // aspect reserves each tile's space so the skeleton sizes correctly and the
      // masonry doesn't reflow as photos load (all four are 750×1124).
      items: PHOTOS.map((photo) => ({ id: photo.key, src: photo.src, alt: `Photo ${photo.key}`, aspect: 750 / 1124 })),
    },
    backPhoto: {
      _collapsed: true,
      offsetX: [239, 0, 400],
      offsetY: [0, 0, 150],
      scale: [0.7, 0.5, 0.95],
      overlayOpacity: [0.6, 0, 1],
    },
    shadow: {
      _collapsed: true,
      scale: [1.03, 1, 1.2],
      opacity: [0.25, 0, 1],
      blur: [14, 0, 60],
      yOffset: [8, 0, 60],
    },
    transitionSpring: {
      type: 'spring' as const,
      visualDuration: 0.5,
      bounce: 0.04,
    },
    darkMode: false,
    next: { type: 'action' as const },
  }, {
    shortcuts: {
      'backPhoto.offsetX': { key: 'x', mode: 'coarse' },
      'shadow.opacity': { key: 'o', mode: 'fine' },
    },
    onAction: (action) => {
      if (action === 'next') next();
    },
    onEvent: (_path, event) => {
      if (event.kind === 'file' && event.files[0]) {
        setTextureUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(event.files[0]);
        });
      } else if (event.kind === 'remove') {
        setLooks((ls) => ls.filter((l) => l.value !== event.value));
      }
    },
  });

  // Picking a cover springs the stack so that photo sits on top.
  useEffect(() => {
    const coverIndex = PHOTOS.findIndex((photo) => photo.key === params.cover);
    if (coverIndex >= 0) setStep(coverIndex);
  }, [params.cover]);

  // Resolve this panel's id so the gallery selection can be written back in sync.
  const [panelId, setPanelId] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setPanelId(DialStore.getPanels().find((p) => p.name === PANEL_NAME)?.id ?? null);
    sync();
    return DialStore.subscribeGlobal(sync);
  }, []);

  // Keep the "cover" gallery and the photo on top of the stack as one selection, so
  // the gallery's checkmark always matches the front photo — whichever drives it.

  // Stack → cover: reflect the current front photo as the selected cover.
  useEffect(() => {
    if (!panelId) return;
    const frontKey = PHOTOS[currentIndex].key;
    if (params.cover !== frontKey) DialStore.updateValue(panelId, 'cover', frontKey);
    // Only react to the stack moving (not the pick itself), so this can't clobber a
    // fresh selection before `step` has advanced to it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, panelId]);

  // Cover → stack: advance forward to the picked photo. Forward-only keeps `step`
  // monotonic so the entrance-animation keys (which use the lap count) stay stable.
  useEffect(() => {
    const coverIndex = PHOTOS.findIndex((photo) => photo.key === params.cover);
    if (coverIndex < 0) return;
    setStep((s) => s + ((coverIndex - (s % PHOTOS.length) + PHOTOS.length) % PHOTOS.length));
  }, [params.cover]);

  const visibleCount = 2;
  const visiblePhotos = [];
  for (let i = 0; i < visibleCount; i++) {
    const photoIndex = (currentIndex + i) % PHOTOS.length;
    const lap = Math.floor((step + i) / PHOTOS.length);
    visiblePhotos.push({ ...PHOTOS[photoIndex], stackIndex: i, entranceKey: `${photoIndex}-${lap}` });
  }

  const shapeSizes = {
    portrait: { width: 340, height: 480 },
    square: { width: 400, height: 400 },
    landscape: { width: 480, height: 320 },
  };
  const shape = shapeSizes[params.photoShape as keyof typeof shapeSizes] ?? shapeSizes.portrait;

  const bgColor = params.darkMode ? '#0d0d0d' : '#ffffff';
  const textColor = params.darkMode ? '#ffffff' : '#1a1a1a';
  const subtextColor = params.darkMode ? '#666' : '#888';

  // Visible wiring for the new controls so they can be tested at a glance.
  const palette = PALETTES.find((p) => p.value === params.palette);
  const titleAccent = palette?.colors[0] ?? textColor;
  const activeLook = looks.find((l) => l.value === params.look)?.label ?? params.look;

  // Compose the effect stack into a live CSS filter + tint overlays for the front photo.
  const effects = params.effects;
  const photoFilter = effects
    .map((fx) => {
      const p = fx.params;
      switch (fx.type) {
        case 'blur': return `blur(${p.radius}px)`;
        case 'brightness': return `brightness(${p.amount})`;
        case 'saturate': return `saturate(${p.amount})`;
        case 'hueRotate': return `hue-rotate(${p.angle}deg)`;
        default: return '';
      }
    })
    .filter(Boolean)
    .join(' ');
  const tints = effects.filter((fx) => fx.type === 'tint');

  useEffect(() => {
    document.documentElement.style.background = bgColor;
    document.body.style.background = bgColor;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [bgColor]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 24,
      height: '100vh',
      width: '100%',
      padding: 40,
      background: bgColor,
      transition: 'background 0.3s ease',
    }}>
      <div style={{ paddingLeft: 8 }}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 600,
          color: titleAccent,
          margin: 0,
          letterSpacing: '-0.02em',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          transition: 'color 0.3s ease',
        }}>
          {params.title}
        </h1>
        <p style={{
          fontSize: 18,
          color: subtextColor,
          margin: 0,
          marginTop: 4,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          {params.subtitle}
        </p>
        {/* Readouts so the new controls are testable at a glance */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginTop: 12,
          fontSize: 13,
          color: subtextColor,
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <span>palette <strong style={{ color: titleAccent }}>{palette?.label ?? params.palette}</strong></span>
          <span>·</span>
          <span>look <strong style={{ color: textColor }}>{activeLook}</strong></span>
          <span>·</span>
          <span>fx <strong style={{ color: textColor }}>{effects.length}</strong></span>
          {textureUrl && (
            <>
              <span>·</span>
              <img
                src={textureUrl}
                alt="texture"
                style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 6, border: `1px solid ${subtextColor}` }}
              />
            </>
          )}
        </div>
      </div>

      <div style={{
        position: 'relative',
        width: shape.width + 180,
        height: shape.height + 200,
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <AnimatePresence initial={false} mode="popLayout">
            {visiblePhotos.map((photo) => {
              const stackIndex = photo.stackIndex;
              const isTop = stackIndex === 0;
              const targetX = stackIndex * params.backPhoto.offsetX;
              const targetY = stackIndex * params.backPhoto.offsetY;
              const targetScale = stackIndex === 0 ? 1 : params.backPhoto.scale;
              const shadowOpacity = isTop ? params.shadow.opacity : params.shadow.opacity * 0.5;

              return (
                <motion.div
                  key={photo.entranceKey}
                  initial={{
                    x: params.backPhoto.offsetX,
                    y: params.backPhoto.offsetY,
                    scale: params.backPhoto.scale * 0.8,
                  }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    scale: targetScale,
                    zIndex: visibleCount - stackIndex,
                  }}
                  exit={{
                    x: -shape.width,
                    y: 0,
                    scale: 1,
                    opacity: 0,
                    zIndex: visibleCount + 1,
                  }}
                  transition={params.transitionSpring}
                  style={{
                    position: 'absolute',
                    width: shape.width,
                    height: shape.height,
                    transformOrigin: 'bottom left',
                  }}
                >
                  <motion.div
                    initial={false}
                    animate={{ opacity: shadowOpacity }}
                    transition={params.transitionSpring}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      transform: `scale(${params.shadow.scale}) translateY(${params.shadow.yOffset}px)`,
                      filter: `blur(${params.shadow.blur}px)`,
                      borderRadius: 2,
                      overflow: 'hidden',
                      background: photo.color,
                    }}
                  >
                    <img
                      src={photo.src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(-100px -200px 0 0)' }}>
          <AnimatePresence initial={false} mode="popLayout">
            {visiblePhotos.map((photo) => {
              const stackIndex = photo.stackIndex;
              const isTop = stackIndex === 0;
              const targetX = stackIndex * params.backPhoto.offsetX;
              const targetY = stackIndex * params.backPhoto.offsetY;
              const targetScale = stackIndex === 0 ? 1 : params.backPhoto.scale;
              const overlayOpacity = isTop ? 0 : params.backPhoto.overlayOpacity;

              return (
                <motion.div
                  key={photo.entranceKey}
                  initial={{
                    x: params.backPhoto.offsetX,
                    y: params.backPhoto.offsetY,
                    scale: params.backPhoto.scale * 0.8,
                  }}
                  animate={{
                    x: targetX,
                    y: targetY,
                    scale: targetScale,
                    zIndex: visibleCount - stackIndex,
                  }}
                  exit={{
                    x: -shape.width,
                    y: 0,
                    scale: 1,
                    zIndex: visibleCount + 1,
                  }}
                  transition={params.transitionSpring}
                  style={{
                    position: 'absolute',
                    width: shape.width,
                    height: shape.height,
                    transformOrigin: 'bottom left',
                    cursor: isTop ? 'pointer' : 'default',
                  }}
                  onClick={isTop ? next : undefined}
                  whileHover={isTop ? { scale: 1.01 } : undefined}
                  whileTap={isTop ? { scale: 0.99 } : undefined}
                >
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: photo.color,
                  }}>
                    <img
                      src={photo.src}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', filter: isTop && photoFilter ? photoFilter : undefined }}
                    />
                    {isTop && tints.map((fx, i) => (
                      <div
                        key={i}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: String(fx.params.color),
                          opacity: Number(fx.params.strength),
                          mixBlendMode: 'color',
                          pointerEvents: 'none',
                        }}
                      />
                    ))}
                    <motion.div
                      initial={false}
                      animate={{ opacity: overlayOpacity }}
                      transition={params.transitionSpring}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `linear-gradient(to right, ${params.shadowTint} 0%, transparent 100%)`,
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
