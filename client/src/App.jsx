
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: App for CapySocial2
 */

import { RouterProvider } from 'react-router-dom'
import './App.css'
import { Router } from './router'

function App() {

  const router = Router()

  return (
    <div >
      <RouterProvider router={router} />
    </div>
  )
}

export default App
