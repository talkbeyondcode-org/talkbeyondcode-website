import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Creators from './pages/Creators'
import Podcast from './pages/Podcast'
import Articles from './pages/Articles'
import Signal from './pages/Signal'
import NotFound from './pages/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'creators', element: <Creators /> },
      { path: 'podcast', element: <Podcast /> },
      { path: 'articles', element: <Articles /> },
      { path: 'signal', element: <Signal /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
