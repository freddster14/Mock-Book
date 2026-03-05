import { Link, Outlet } from 'react-router'
import '../styles/App.css'

function App() {

  return (
    <>
      <h1>Join Mock-Book!</h1>
      <p>Create account or sign in to view your friends posts or to create ones yourself.</p>
      <Link to="/sign-up">Sign-Up </Link>
      <Link to="/sign-in">Sign-In</Link>
      <Outlet />
    </>
  )
}

export default App
