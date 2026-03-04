import React, { useEffect, useState } from "react";
import { UserRes } from "shared-types";
import { apiFetch } from "../api/fetch";
import { NavLink } from "react-router";

export default function SearchNew() {
  const [ search, setSearch ] = useState("");
  const [ results, setResults ] = useState<UserRes[]>([]);
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    setLoading(true);
    if (search === "") {
      setLoading(false);
      return;
    };
    const searchUsers = setTimeout(async () => {
      
      try {
        const res = await apiFetch(`/users?limit=10&search=${search}`)
        setResults(res.data)
      } catch (error) {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 1000)
    return () => clearTimeout(searchUsers)
  }, [search])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await apiFetch('/users')
      setResults(res.data)
    } catch (error) {
      setResults([])
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} />
          <button type="submit">Search</button>
        </label>

      </form>
      { 
      loading ? <p>Loading...</p>
      : !loading && results.length > 0 
      ? results.map(r => (
          <NavLink key={r.id} to={`/dashboard/profile/${r.username}`}>
            {r.avatarUrl ? <img src={r.avatarUrl} /> : <div>{r.username[0]}</div>}
            <p>{r.username}</p>
          </NavLink>
        ))
    
      : <p>No results</p>
      }
    </>
  )
}