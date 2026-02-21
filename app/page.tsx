'use client'

import { useState } from 'react'
import ScrollSequence from '@/components/ScrollSequence'
import HeroUI from '@/components/HeroUI'
import CardsSection from '@/components/CardsSection'

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  return (
    <main>
      <ScrollSequence onLoaded={() => setLoaded(true)} />
      <HeroUI loaded={loaded} />
      <CardsSection />
    </main>
  )
}
