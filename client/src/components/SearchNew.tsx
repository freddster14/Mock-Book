import React, { useEffect, useState } from "react";
import { UserRes } from "shared-types";
import { apiFetch } from "../api/fetch";
import { NavLink } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Spinner } from "./ui/spinner";
import { Button } from "./ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { toast } from "sonner";
import { ApiError } from "@/types";

export default function SearchNew() {
  const [ search, setSearch ] = useState("");
  const [ results, setResults ] = useState<UserRes[] | null>(null);
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    if (search === "") {
      setResults(null)
      setLoading(false)
      return;
    }
    setLoading(true)
    const searchUsers = setTimeout(async () => {
      try {
        const res = await apiFetch(`/users?limit=5&search=${search}`)
        setResults(res.data)
      } catch (error) {
        if (error instanceof ApiError) {
          toast(error.msg)
        } else {
          toast("Something went wrong, try again")
        }
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 1000)
    return () => clearTimeout(searchUsers)
  }, [search])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await apiFetch(`/users?search=${search}`)
      setResults(res.data)
    } catch (error) {
      if (error instanceof ApiError) {
        toast(error.msg)
      } else {
        toast("Something went wrong, try again")
      }
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="search">
          <InputGroup>
            <InputGroupInput type="text" value={search} onChange={e => setSearch(e.target.value)}/>
              <InputGroupAddon align="inline-end">
              <Button type="submit">Search</Button>
            </InputGroupAddon> 
          </InputGroup>
        </label>
      </form>
      { loading ? <Spinner />
      : !loading && results === null 
      ? <p>Search to find new users</p>
      : results !== null && results.length > 0 
      ? results.map(u => (
        <div key={u.id} >
          <NavLink to={`/dashboard/profile/${u.username}`} className="flex items-center gap-5 mb-4 mt-4 ">
            <Avatar size="lg">
              {u.avatarUrl
                ? <AvatarImage  src={u.avatarUrl} />
                : <AvatarFallback >{u.username[0]}</AvatarFallback>
              }
            </Avatar>
            <p className="text-m">{u.username}</p>
          </NavLink>
          <Separator />
        </div>
          
        ))
      : <p>No results</p>
      }
    </>
  )
}