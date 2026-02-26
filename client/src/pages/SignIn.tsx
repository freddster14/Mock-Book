import { useState } from "react";
import { formFetch } from "../api/fetch";
import { ApiError } from "../types";
import { Link, Navigate } from "react-router";
import { ExpressError } from "shared-types";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const { user, loading, setUser } = useAuth();
  const [ identifier, setIdentifier ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errors, setErrors ] = useState<string | ExpressError[] | null >(null)
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  if(!loading && user) {
    return <Navigate to="/dashboard"/>
  } else if (loading) {
    return <div>Loading...</div>
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setErrors(null);
    if(isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await formFetch("/sign-in", { identifier, password });
      setUser(res.data)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.type === "validation") {
          setErrors(error.data)
        } else if (error.type === "authentication") {
          setErrors(error.msg)
        } else {
          setErrors("An unexpected error occurred. Please try again.")
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div>
      <div>
        <h1>Sign-In</h1>
        <p>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="identifier">Identifier
          <input type="text" value={identifier} placeholder="Email or Username" onChange={(e) => setIdentifier(e.target.value)} />
          <p>{Array.isArray(errors) && errors.find(e => e.path === "identifier")?.msg}</p>
        </label>
        <label htmlFor="password">Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <p>{Array.isArray(errors) && errors.find(e => e.path === "password")?.msg}</p>
        </label>
        <p>{errors && typeof errors === "string" ? errors : null}</p>
        <button type="submit">Sign In</button>
      </form>
    </div>
  )
}