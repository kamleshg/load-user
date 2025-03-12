import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CreateUser from './components/createUser.tsx';
import ReadUsers from './components/readUsers.tsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <CreateUser />
      <ReadUsers />
    </>
  )
}

export default App
