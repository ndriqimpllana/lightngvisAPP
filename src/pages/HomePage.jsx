import { useEffect } from 'react'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import About from '../components/About'

export default function HomePage() {
  useEffect(() => {
    document.documentElement.classList.add('snap-home')
    return () => document.documentElement.classList.remove('snap-home')
  }, [])
  return <><Hero /><Gallery /><About /></>
}
