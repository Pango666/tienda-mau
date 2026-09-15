import { Outlet } from 'react-router-dom'
import TopBanner from './TopBanner'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest">
        <TopBanner />
        <Navbar />
      </div>
      <main className="w-full pt-28 pb-16 flex-1 bg-surface">
        <div className="flex flex-col w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}
