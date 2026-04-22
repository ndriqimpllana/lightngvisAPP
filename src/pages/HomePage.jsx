import { useEffect } from 'react'
import { useRouterState } from '@tanstack/react-router'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import About from '../components/About'

export default function HomePage() {
  const hash = useRouterState({ select: s => s.location.hash })

  useEffect(() => {
    document.documentElement.classList.add('snap-home')
    return () => document.documentElement.classList.remove('snap-home')
  }, [])

  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [hash])

  return <><Hero /><Gallery /><About /></>
}
