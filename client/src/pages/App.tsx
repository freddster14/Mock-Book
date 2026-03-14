import { Link } from 'react-router'
import '../styles/App.css'
import { Button } from '@/components/ui/button'

function App() {

  return (
    <>
      <h1>Join Mock-Book!</h1>
      <p>Create account or sign in to view your friends posts or to create ones yourself.</p>
      <Link to="/sign-up"><Button variant="link">Sign Up</Button></Link>
      <Link to="/sign-in"><Button variant="link">Sign In</Button></Link>
    </>
  )
}

export default App
