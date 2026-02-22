import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'Anurag Adarsh — Product Designer'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          background: '#000',
          padding: '72px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 70% at 60% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Top-left: site name */}
        <span
          style={{
            position: 'absolute',
            top: 72,
            left: 80,
            fontSize: 14,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.30)',
            fontFamily: 'sans-serif',
            fontWeight: 400,
          }}
        >
          anuragadarsh.in
        </span>

        {/* Role */}
        <span
          style={{
            fontSize: 14,
            letterSpacing: '0.36em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)',
            fontFamily: 'sans-serif',
            fontWeight: 400,
            marginBottom: 20,
          }}
        >
          UI / UX · Product Designer
        </span>

        {/* Main headline */}
        <span
          style={{
            fontSize: 86,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.92)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          Anurag Adarsh
        </span>

        {/* Tagline */}
        <span
          style={{
            marginTop: 24,
            fontSize: 20,
            fontFamily: 'sans-serif',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.36)',
            letterSpacing: '0.01em',
          }}
        >
          Crafting interfaces that feel as good as they look.
        </span>

        {/* Bottom-right: thin line decoration */}
        <div
          style={{
            position: 'absolute',
            bottom: 72,
            right: 80,
            width: 40,
            height: 1,
            background: 'rgba(255,255,255,0.18)',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
