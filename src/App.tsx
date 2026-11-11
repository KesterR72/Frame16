import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Templates from './pages/Templates'
import HowToUse from './pages/HowToUse'
import Studio from './pages/Studio'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function AppShell() {
  const location = useLocation()
  const isStudio = location.pathname === '/yt-thumbnail'

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col">
      <ScrollToTop />
      {!isStudio && <Navbar />}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/how-to-use" element={<HowToUse />} />
            <Route path="/yt-thumbnail" element={<Studio />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isStudio && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
