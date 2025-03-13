import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import CreateUser from './components/createUser.tsx';
import ReadUsers from './components/readUsers.tsx';
import UpdateUsers from './components/updateUser.tsx';
import DeleteUsers from './components/deleteUser.tsx';
import FileUpload from './components/uploadFIle.tsx';
import ReadFiles from './components/readFiles.tsx';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div>
          <a href="https://docs.squid.cloud" target="_blank">
          <img src={reactLogo} className="logo" alt="Squid Cloud logo" />
        </a>
      </div>
      <CreateUser />
      <ReadUsers />
      <UpdateUsers />
      <DeleteUsers />
      <FileUpload/>
      <ReadFiles/>
    </>
  )
}

export default App
