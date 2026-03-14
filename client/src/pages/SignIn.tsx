import { useState } from "react";
import { userFormFetch } from "../api/fetch";
import { ApiError } from "../types";
import { Link, Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignIn() {
  const { user, loading, setUser } = useAuth();
  const [ identifier, setIdentifier ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errors, setErrors ] = useState<string | { identifier: undefined | string, password: string | undefined }>({ identifier: undefined, password: undefined })
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  if(!loading && user) {
    return <Navigate to="/dashboard"/>
  } else if (loading) {
    return <div>Loading...</div>
  }

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    setErrors({ identifier: undefined, password: undefined });
    if(isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await userFormFetch("/sign-in", { identifier, password });
      setUser(res.data)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.type === "validation") {
          const organizedErr = {
            identifier: error.data.find(e => e.path === "identifier")?.msg,
            password: error.data.find(e => e.path === "password")?.msg,
          }
          setErrors(organizedErr)
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
    <Card className="w-full max-w-lg p-5">
      <CardHeader>
        <CardTitle>Sign-In</CardTitle>
        <CardDescription>Enter email or username to sign-in to your account</CardDescription>
        <CardAction>
          <Button variant="link"><Link to="/sign-up">Sign Up</Link></Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="sign-in">
          <FieldGroup>
            <Field>
              <FieldLabel  htmlFor="identifier">Identifier</FieldLabel>
              <Input aria-invalid={(typeof errors === 'object' && errors.identifier !== undefined) || typeof errors === "string" } type="text" value={identifier} id="identifier" placeholder="Email or Username" onChange={(e) => setIdentifier(e.target.value)} />
              <FieldError>{typeof errors === 'object' && errors.identifier}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input aria-invalid={typeof errors === 'object' && errors.password !== undefined || typeof errors === "string"} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              <FieldError>{typeof errors === 'object' && errors.password}</FieldError>
            </Field>
          </FieldGroup>
          <FieldError>{typeof errors === "string" && errors}</FieldError>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" form="sign-in" type="submit">Sign In</Button>
      </CardFooter>
    </Card>
  )
}