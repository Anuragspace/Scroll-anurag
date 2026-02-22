'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Config ────────────────────────────────────────────────────────────────────
const TOTAL_FRAMES      = 192
const SCROLL_HEIGHT_VH  = 600    // total scrollable height in vh  (~3.1vh per frame)
const LERP_FACTOR       = 0.072  // easing — lower = silkier/slower catch-up
const LERP_EPSILON      = 0.008  // stop RAF when diff is below this threshold
const EAGER_FRAMES      = 30     // show UI after this many frames are ready; rest load in bg

function frameSrc(index: number): string {
  const n = String(index + 1).padStart(3, '0')
  return `/images/ezgif-frame-${n}.jpg`
}

// ─── Component ─────────────────────────────────────────────────────────────────
interface Props {
  onLoaded?: () => void
}

export default function ScrollSequence({ onLoaded }: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const progressRef  = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded]   = useState(false)
  const [loadPct, setLoadPct] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    // ── All mutable state — zero React re-renders past this point ──────────
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)
    let loadedCount  = 0
    let currentFrame = 0   // lerp'd float
    let targetFrame  = 0   // raw target from scroll
    let raf          = 0
    let rafRunning   = false
    let alive        = true

    // ── Resize: match canvas pixel dimensions to DPR-scaled viewport ────────
    function resize() {
      if (!alive) return
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2)
      const w   = window.innerWidth
      // Use visualViewport.height on mobile so canvas tracks the *visual* viewport
      // (excludes iOS Safari URL bar) — prevents blank strips top/bottom
      const h   = window.visualViewport?.height ?? window.innerHeight
      canvas!.width  = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      canvas!.style.width  = w + 'px'
      canvas!.style.height = h + 'px'
      draw(Math.round(currentFrame))
    }

    // ── Draw: cover-fill one frame, centered ────────────────────────────────
    function draw(idx: number) {
      if (!alive) return
      // If this exact frame isn't ready yet, walk back to last loaded frame
      let img = images[idx]
      if (!img?.complete || !img.naturalWidth) {
        for (let j = idx - 1; j >= 0; j--) {
          if (images[j]?.complete && images[j].naturalWidth) { img = images[j]; break }
        }
      }
      if (!img?.complete || !img.naturalWidth) return
      const cw    = canvas!.width
      const ch    = canvas!.height
      // Cover-fill: image always fills the full canvas — no black bars on any device
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight)
      const dx    = (cw - img.naturalWidth  * scale) / 2
      const dy    = (ch - img.naturalHeight * scale) / 2
      ctx!.fillStyle = '#000'
      ctx!.fillRect(0, 0, cw, ch)
      ctx!.drawImage(img, dx, dy, img.naturalWidth * scale, img.naturalHeight * scale)
    }

    // ── RAF tick: lerp → draw → update progress bar → idle when converged ───
    function tick() {
      if (!alive) return
      const diff = targetFrame - currentFrame

      if (Math.abs(diff) < LERP_EPSILON) {
        // Close enough — snap to target, draw once, stop the loop
        currentFrame = targetFrame
        draw(Math.min(Math.max(Math.round(currentFrame), 0), TOTAL_FRAMES - 1))
        updateProgress(currentFrame / (TOTAL_FRAMES - 1))
        rafRunning = false
        return  // ← no next requestAnimationFrame = loop stops
      }

      currentFrame += diff * LERP_FACTOR
      const idx = Math.min(Math.max(Math.round(currentFrame), 0), TOTAL_FRAMES - 1)
      draw(idx)
      updateProgress(currentFrame / (TOTAL_FRAMES - 1))
      raf = requestAnimationFrame(tick)
    }

    // ── Progress bar DOM update (direct DOM, no React re-render) ────────────
    function updateProgress(p: number) {
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(Math.max(p, 0), 1)})`
      }
    }

    // ── Wake RAF loop if not already running ────────────────────────────────
    function wakeRaf() {
      if (!rafRunning && alive) {
        rafRunning = true
        raf = requestAnimationFrame(tick)
      }
    }

    // ── Scroll → target frame, wake RAF ─────────────────────────────────────
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const p = Math.min(Math.max(window.scrollY / max, 0), 1)
      targetFrame = p * (TOTAL_FRAMES - 1)
      wakeRaf()
    }

    // ── Preload all frames ───────────────────────────────────────────────────
    let eagerDone = false   // tracks whether we've fired onLoaded() yet
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.decoding = 'async'
      img.src = frameSrc(i)
      images[i] = img

      img.onload = () => {
        loadedCount++
        setLoadPct(Math.round((loadedCount / TOTAL_FRAMES) * 100))
        // Render the very first frame as soon as it is ready
        if (i === 0) {
          resize()
          draw(0)
        }
        // Fire onLoaded early after EAGER_FRAMES so the UI appears fast;
        // remaining frames keep loading silently in the background.
        if (!eagerDone && loadedCount >= EAGER_FRAMES) {
          eagerDone = true
          setLoaded(true)
          onLoaded?.()
        }
      }
      img.onerror = () => {
        loadedCount++
        setLoadPct(Math.round((loadedCount / TOTAL_FRAMES) * 100))
        if (!eagerDone && loadedCount >= EAGER_FRAMES) {
          eagerDone = true
          setLoaded(true)
          onLoaded?.()
        }
      }
    }

    // ── Bootstrap ────────────────────────────────────────────────────────────
    resize()
    wakeRaf()
    const onResize = () => { resize(); wakeRaf() }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    // Also listen to visualViewport so iOS Safari URL-bar show/hide triggers a resize
    window.visualViewport?.addEventListener('resize', onResize)

    // ── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.visualViewport?.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <>
      {/*
       * ── FIXED LAYER ──────────────────────────────────────────────────────
       * The canvas and all visual overlays are position:fixed.
       * They stay LOCKED to the viewport for the entire scroll journey.
       * This is the only bulletproof approach — position:sticky can be
       * silently broken by overflow on any ancestor element.
       */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          background: '#000',
        }}
      >
        {/* ── Canvas — willChange:contents = own GPU layer for drawImage ── */}
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            background: '#000',
            willChange: 'contents',
          }}
        />

        {/* ── Cinematic radial vignette ───────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 90% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Top / bottom letterbox bars ─────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Film-grain texture (fades in after load) ─────────────────────── */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 0.03 : 0 }}
          transition={{ duration: 2.5 }}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />

        {/* ── Scroll progress bar ─────────────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background: 'rgba(255,255,255,0.06)',
            zIndex: 5,
          }}
        >
          <div
            ref={progressRef}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.55)',
              transformOrigin: 'left center',
              transform: 'scaleX(0)',
              // No transition — updated directly in RAF for zero lag
            }}
          />
        </div>

        {/* ── Loading overlay ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {!loaded && (
            <motion.div
              key="loader"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                inset: 0,
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 18,
                zIndex: 10,
              }}
            >
              {/* Thin progress track */}
              <div
                style={{
                  width: 180,
                  height: 1,
                  background: 'rgba(255,255,255,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  animate={{ width: `${loadPct}%` }}
                  transition={{ ease: 'linear', duration: 0.1 }}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    background: 'rgba(255,255,255,0.7)',
                  }}
                />
              </div>

              {/* Percentage label */}
              <span
                style={{
                  color: 'rgba(255,255,255,0.18)',
                  fontSize: 10,
                  letterSpacing: '0.5em',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-outfit), sans-serif',
                  fontWeight: 300,
                  userSelect: 'none',
                }}
              >
                {loadPct} %
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/*
       * ── SCROLL SPACER ────────────────────────────────────────────────────
       * Transparent block — its ONLY job is to give the page enough height
       * to scroll through. The fixed canvas above reads window.scrollY and
       * maps it to the frame index. Nothing else lives here.
       */}
      <div
        aria-hidden
        style={{
          height: `${SCROLL_HEIGHT_VH}vh`,
          width: '100%',
          position: 'relative',
          zIndex: 1,
          background: 'transparent',
          pointerEvents: 'none',
          touchAction: 'pan-y', // ensure native momentum scroll on iOS/Android
        }}
      />
    </>
  )
}
