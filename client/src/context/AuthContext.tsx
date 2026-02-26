import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../api/fetch";
import { UserContext } from "../types";
import { UserToken } from "shared-types";

export const AuthContext = createContext<UserContext>({ user: null, loading: false, setUser: () => {} }); 

export function AuthProvider( { children }: { children: React.ReactNode }) {
  const [ user, setUser ] = useState<null | UserToken>(null);
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await apiFetch('/auth/me')
        setUser(res.data)
      } catch (error) {
        console.log(error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])
  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      { children }  
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext);
}