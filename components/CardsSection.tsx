'use client'

import { useEffect, useRef, useState } from 'react'

// ── Cards: each defines a single continuous journey start→end ─────────────────
// At `start` the card enters from +110vh below; at `end` it has exited to -110vh above.
// There is NO pause — translateY moves in one unbroken linear sweep the whole time.
const CARDS = [
  {
    tag: 'Design',
    title: 'Design\nPhilosophy',
    body: 'I believe design is invisible — every decision exists to serve the person, not the portfolio.',
    start: 0.14, end: 0.38,
    pos: { left: '5%',  bottom: '22%' } as React.CSSProperties,
  },
  {
    tag: 'Work',
    title: 'Selected\nWork',
    body: 'Brand systems, digital products, and interfaces crafted for teams who care about every pixel.',
    start: 0.27, end: 0.51,
    pos: { left: '22%', bottom: '48%' } as React.CSSProperties,
  },
  {
    tag: 'Projects',
    title: 'Personal\nProjects',
    body: 'Explorations in type, motion, and interaction — pushing what screens can genuinely feel like.',
    start: 0.40, end: 0.64,
    pos: { right: '22%', bottom: '36%' } as React.CSSProperties,
  },
  {
    tag: 'Connect',
    title: "Let's Build\nSomething",
    body: 'Open to ambitious collaborations, full-time roles, and honest conversations about design.',
    start: 0.53, end: 0.77,
    pos: { right: '5%', bottom: '16%' } as React.CSSProperties,
  },
] as const

const BTN_IN_START  = 0.80   // dive-in button appears after last card exits
const BTN_IN_WINDOW = 0.07

export default function CardsSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const btnRef   = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    let alive = true

    function update() {
      if (!alive) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const p = Math.min(Math.max(window.scrollY / max, 0), 1)

      // Per-card: single continuous journey from +110vh (below) to -110vh (above)
      // t=0 → card at bottom edge | t=1 → card fully above top — zero pausing
      CARDS.forEach((card, i) => {
        const el = cardRefs.current[i]
        if (!el) return

        const t = Math.min(Math.max((p - card.start) / (card.end - card.start), 0), 1)

        // Linear sweep: +110vh → -110vh, no hold at any position
        const ty = 110 - t * 220

        const visible = p > card.start && p < card.end
        el.style.opacity       = visible ? '1' : '0'
        el.style.transform     = `translateY(${ty}vh)`
        el.style.pointerEvents = visible ? 'auto' : 'none'
      })

      // "Dive In" button — fades+rises at near-end of scroll
      if (btnRef.current) {
        const t = Math.min(Math.max((p - BTN_IN_START) / BTN_IN_WINDOW, 0), 1)
        btnRef.current.style.opacity       = String(t)
        btnRef.current.style.transform     = `translateY(${(1 - t) * 28}px)`
        btnRef.current.style.pointerEvents = t > 0.1 ? 'auto' : 'none'
      }
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => { alive = false; window.removeEventListener('scroll', update) }
  }, [])

  const glass: React.CSSProperties = {
    backdropFilter:       'blur(32px) saturate(180%)',
    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  }

  return (
    <>
      {/* Scattered cards — each at its own fixed screen coordinate */}
      {CARDS.map((card, i) => {
        // On mobile: all cards span full width centered; on desktop: scattered positions
        const mobilePos: React.CSSProperties = { left: '5%', right: '5%', bottom: '22%' }
        const pos = isMobile ? mobilePos : card.pos
        return (
        <div
          key={card.tag}
          ref={el => { cardRefs.current[i] = el }}
          className="glass-card"
          style={{
            position: 'fixed',
            ...pos,
            zIndex: 10,
            width: isMobile ? undefined : 'clamp(230px, 18vw, 288px)',
            background: 'rgba(255,255,255,0.04)',
            ...glass,
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 20,
            padding: isMobile ? '20px 18px 22px' : '24px 22px 26px',
            opacity: 0,
            transform: 'translateY(70px)',
            willChange: 'opacity, transform',
            pointerEvents: 'none',
          }}
        >
            {/* Tag */}
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 10,
                letterSpacing: '0.40em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.24)',
                margin: '0 0 14px',
              }}
            >
              {card.tag}
            </p>

            {/* Title */}
            <h3
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(22px, 2.0vw, 28px)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.84)',
                lineHeight: 1.22,
                margin: '0 0 13px',
                whiteSpace: 'pre-line',
              }}
            >
              {card.title}
            </h3>

            {/* Divider */}
            <div
              style={{
                width: 28,
                height: 1,
                background: 'rgba(255,255,255,0.10)',
                margin: '0 0 13px',
              }}
            />

            {/* Body */}
            <p
              style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 13,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.42)',
                lineHeight: 1.76,
                margin: 0,
              }}
            >
              {card.body}
            </p>
          </div>
        )
      })}
        {/* ── "Let's Dive In Deep" — centered, rises at 89%+ scroll ── */}
        <div
          ref={btnRef}
          style={{
            position: 'fixed',
            bottom: 'clamp(40px, 7vh, 68px)',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 20,
            opacity: 0,
            pointerEvents: 'none',
            willChange: 'opacity, transform',
          }}
        >
          <a
            href="https://www.anuragadarsh.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="dive-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(255,255,255,0.06)',
              backdropFilter: 'blur(28px) saturate(180%)',
              WebkitBackdropFilter: 'blur(28px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.14)',
              borderRadius: 100,
              padding: '16px 44px',
              color: 'rgba(255,255,255,0.84)',
              fontSize: 15,
              fontFamily: 'var(--font-outfit)',
              fontWeight: 400,
              letterSpacing: '0.03em',
              textDecoration: 'none',
            } as React.CSSProperties}
          >
            Let&apos;s Dive In Deep
            <span style={{ opacity: 0.40, fontSize: 16, lineHeight: 1 }}>↗</span>
          </a>
        </div>
      </>
  )
}
