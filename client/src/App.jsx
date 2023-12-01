
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
