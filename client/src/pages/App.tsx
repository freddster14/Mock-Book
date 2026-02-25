import { Link, Outlet } from 'react-router'
import '../styles/App.css'

function App() {

  return (
    <>
      <Link to="/sign-up">Sign-Up</Link>
      <Link to="/sign-in">Sign-In</Link>
      <Outlet />
    </>
  )
}

export default App
