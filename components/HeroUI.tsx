'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const BODY_FADE_END   = 0.12
const HEADER_FADE_END = 0.20
const HINT_FADE_END   = 0.06

const ease = [0.16, 1, 0.3, 1] as const

interface Props { loaded: boolean }

export default function HeroUI({ loaded }: Props) {
  const headerWrapRef        = useRef<HTMLDivElement>(null)
  const bodyWrapRef          = useRef<HTMLDivElement>(null)
  const hintRef              = useRef<HTMLDivElement>(null)
  const leftBottomContentRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Sync isMobile on mount + resize
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (!loaded) return
    let alive = true

    function update() {
      if (!alive) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const p = Math.min(Math.max(window.scrollY / max, 0), 1)

      // Body — moves up & fades
      if (bodyWrapRef.current) {
        const t  = Math.min(p / BODY_FADE_END, 1)
        const op = 1 - t
        bodyWrapRef.current.style.opacity   = String(op)
        bodyWrapRef.current.style.transform = `translateY(${-t * 72}px)`
        // Only disable the interactive left-bottom block, NOT the whole body
        if (leftBottomContentRef.current) {
          leftBottomContentRef.current.style.pointerEvents = op < 0.05 ? 'none' : 'auto'
        }
      }

      // Header — subtle slide + fade
      if (headerWrapRef.current) {
        const t  = Math.min(p / HEADER_FADE_END, 1)
        const op = 1 - t
        headerWrapRef.current.style.opacity       = String(op)
        headerWrapRef.current.style.transform     = `translateY(${-t * 20}px)`
        // Always allow pointer events for header (fixes CTA click)
        headerWrapRef.current.style.pointerEvents = 'auto'
      }

      // Scroll hint — fades fast
      if (hintRef.current) {
        const t = Math.min(p / HINT_FADE_END, 1)
        hintRef.current.style.opacity = String(1 - t)
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => { alive = false; window.removeEventListener('scroll', update) }
  }, [loaded])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10, pointerEvents: 'none' }}>
      {/* HEADER */}
      <div
        ref={headerWrapRef}
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          willChange: 'opacity, transform',
          pointerEvents: 'auto', // Always allow clicks
        }}
      >
        <motion.div
          initial={{ opacity: 0, filter: 'blur(12px)' }}
          animate={{ opacity: loaded ? 1 : 0, filter: loaded ? 'blur(0px)' : 'blur(12px)' }}
          transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: isMobile ? '16px 20px' : '22px clamp(28px, 5vw, 64px)',
              background: 'transparent',
            } as React.CSSProperties}
          >
            <span
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: isMobile ? 11 : 13,
                fontWeight: 500,
                letterSpacing: '0.13em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              Anurag Adarsh
            </span>
            <a
              href="https://www.linkedin.com/in/adarshanurag/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 100,
                padding: isMobile ? '8px 18px' : '11px 28px',
                color: 'rgba(255,255,255,0.70)',
                fontSize: isMobile ? 11 : 12,
                fontFamily: 'var(--font-outfit)',
                fontWeight: 400,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                display: 'inline-block',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                cursor: 'pointer',
              } as React.CSSProperties}
            >
              Get in Touch ↗
            </a>
          </header>
        </motion.div>
      </div>

      {/* BODY */}
      <div
        ref={bodyWrapRef}
        style={{
          position: 'absolute',
          inset: 0,
          willChange: 'opacity, transform',
          pointerEvents: 'none',
        }}
      >
        {/* ── HEADLINE ── mobile: stacked centered ~38% top | desktop: split flanking 3D ── */}
        {isMobile ? (
          <div style={{
            position: 'absolute',
            top: '18%',
            left: 0,
            right: 0,
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 18 }}
              transition={{ duration: 1.1, ease, delay: 0.46 }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(44px, 16vw, 68px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.90)',
                letterSpacing: '-0.022em',
                lineHeight: 1.1,
                textAlign: 'center',
              }}
            >
              Product
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 18 }}
              transition={{ duration: 1.1, ease, delay: 0.56 }}
              style={{
                display: 'block',
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(44px, 16vw, 68px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.90)',
                letterSpacing: '-0.022em',
                lineHeight: 1.1,
                textAlign: 'center',
              }}
            >
              Designer
            </motion.span>
          </div>
        ) : (
          /* Desktop: split left / right flanking the 3D object */
          <div
            style={{
              position: 'absolute',
              top: '46%',
              left: 0,
              right: 0,
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -40 }}
              transition={{ duration: 1.1, ease, delay: 0.46 }}
              style={{ flex: 1, textAlign: 'right', paddingRight: '2.2vw' }}
            >
              <span style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(46px, 6.4vw, 94px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.90)',
                letterSpacing: '-0.022em',
                lineHeight: 1,
                display: 'block',
              }}>
                Product
              </span>
            </motion.div>
            <div style={{ width: 'clamp(250px, 25vw, 430px)', flexShrink: 0 }} />
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : 40 }}
              transition={{ duration: 1.1, ease, delay: 0.56 }}
              style={{ flex: 1, textAlign: 'left', paddingLeft: '2.2vw' }}
            >
              <span style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(46px, 6.4vw, 94px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.90)',
                letterSpacing: '-0.022em',
                lineHeight: 1,
                display: 'block',
              }}>
                Designer
              </span>
            </motion.div>
          </div>
        )}

        {/* ── BOTTOM — mobile: centered compact | desktop: full left-bottom block ── */}
        {isMobile ? (
          <div style={{
            position: 'absolute',
            bottom: 40,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <motion.div
              ref={leftBottomContentRef}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 18 }}
              transition={{ duration: 0.95, ease, delay: 0.78 }}
              style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
            >
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, fontWeight: 600, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)', margin: 0 }}>
                UI / UX Designer
              </p>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <a href="https://x.com/_anurag_adarsh" target="_blank" rel="noopener noreferrer" className="hero-social" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>X</span>
                </a>
                <a href="https://www.linkedin.com/in/adarshanurag/" target="_blank" rel="noopener noreferrer" className="hero-social" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>LinkedIn</span>
                </a>
                <a href="https://www.instagram.com/anurag__adarsh/" target="_blank" rel="noopener noreferrer" className="hero-social" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500 }}>Instagram</span>
                </a>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Desktop: full left-bottom block */
          <div
            style={{
              position: 'absolute',
              bottom: 'clamp(8px, 8vh, 48px)',
              left: 'clamp(24px, 5vw, 72px)',
              maxWidth: 360,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              ref={leftBottomContentRef}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 24 }}
              transition={{ duration: 0.95, ease, delay: 0.78 }}
              style={{ pointerEvents: 'auto' }}
            >
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, fontWeight: 500, letterSpacing: '0.36em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', margin: '0 0 4px' }}>
                UI / UX Designer
              </p>
              <p style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(22px, 2.2vw, 30px)', fontWeight: 400, fontStyle: 'italic', color: 'rgba(255,255,255,0.70)', lineHeight: 1.44, margin: '0 0 4px' }}>
                Crafting interfaces that<br />feel as good as they look.
              </p>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.36)', lineHeight: 1.82, letterSpacing: '0.01em', margin: '0 0 8px' }}>
                Turning complexity into clarity through<br />intentional design and obsessive craft.
              </p>
              <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
                <a href="https://x.com/_anurag_adarsh" target="_blank" rel="noopener noreferrer" className="hero-social" style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 400 }}>X</span>
                </a>
                <a href="https://www.linkedin.com/in/adarshanurag/" target="_blank" rel="noopener noreferrer" className="hero-social" style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 400 }}>LinkedIn</span>
                </a>
                <a href="https://www.instagram.com/anurag__adarsh/" target="_blank" rel="noopener noreferrer" className="hero-social" style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.98-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.98-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 400 }}>Instagram</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </div>{/* end bodyWrapRef */}

      {/* ── SCROLL HINT — desktop: bottom-right spinning ring | mobile: smaller centered ── */}
      <div
        ref={hintRef}
        style={{
          position: 'absolute',
          bottom: isMobile ? 112 : 'clamp(28px, 5vh, 52px)' as React.CSSProperties['bottom'],
          ...(isMobile
            ? { left: 0, right: 0, justifyContent: 'center' }
            : { right: 'clamp(24px, 5vw, 72px)' }),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          style={{ position: 'relative', width: isMobile ? 64 : 88, height: isMobile ? 64 : 88 }}
        >
          {isMobile ? (
            <svg width="64" height="64" viewBox="0 0 64 64" style={{ animation: 'scroll-spin 10s linear infinite' }}>
              <defs>
                <path id="scrollCircleMobile" d="M 32,32 m -26,0 a 26,26 0 1,1 52,0 a 26,26 0 1,1 -52,0" />
              </defs>
              <text fontFamily="var(--font-outfit)" fontSize="5.5" fill="rgba(255,255,255,0.24)" letterSpacing="2.2">
                <textPath href="#scrollCircleMobile" startOffset="0%">SCROLL · SCROLL · SCROLL ·</textPath>
              </text>
            </svg>
          ) : (
            <svg width="88" height="88" viewBox="0 0 88 88" style={{ animation: 'scroll-spin 10s linear infinite' }}>
              <defs>
                <path id="scrollCircle" d="M 44,44 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text fontFamily="var(--font-outfit)" fontSize="7" fill="rgba(255,255,255,0.28)" letterSpacing="2.5">
                <textPath href="#scrollCircle" startOffset="0%">SCROLL DOWN · SCROLL DOWN ·</textPath>
              </text>
            </svg>
          )}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.22)',
            fontSize: isMobile ? 12 : 14,
          }}>
            ↓
          </div>
        </motion.div>
      </div>
    </div>
  )
}
