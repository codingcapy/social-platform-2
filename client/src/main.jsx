
/*
author: Paul Kim
date: December 8, 2023
version: 1.0
description: main for CapySocial2
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Auth from './components/Auth/Auth.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Auth>
    <App />
  </Auth>,
)
