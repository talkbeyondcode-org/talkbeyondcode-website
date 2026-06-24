import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/martian-mono/400.css'
import '@fontsource/martian-mono/600.css'
import './index.css'
import Layout from './components/Layout'
import Home from './pages/Home'
import Creators from './pages/Creators'
import Podcast from './pages/Podcast'
import Articles from './pages/Articles'
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
      { path: '*', element: <NotFound /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
