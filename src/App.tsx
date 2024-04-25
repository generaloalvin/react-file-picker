import { useState } from 'react'
import { Button } from './components/ui/button'

function App() {

  return (
    <div className="bg-gray-200">
      <h1 className="text-2xl font-bold text-center mt-8">
        Hello World
      </h1>
      <Button className="mt-4">
        Click Me
      </Button>
    </div>
  )
}

export default App
