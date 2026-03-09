import type { UserForm } from "shared-types";
import { userFormFetch } from "../api/fetch";
import React, { useState } from "react";
import { validateCreateAccountForm } from "../utils/formValidation";
import { ApiError } from "../types";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { AccountCreationError } from "@/types/formErrors";

export default function CreateAccountForm({ formData, setFormData, setStep }:
  { formData: UserForm,
    setFormData: React.Dispatch<React.SetStateAction<UserForm>>
    setStep: React.Dispatch<React.SetStateAction<number>>
  }) {
  const { setUser } = useAuth();
  const [ errors, setErrors ] = useState< string | AccountCreationError | undefined>(undefined);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors(undefined)
    if(isSubmitting) return;
    setIsSubmitting(true)

    const tempErrors: AccountCreationError | false  = validateCreateAccountForm(formData);
    if(tempErrors) {
      setErrors(tempErrors);
      setIsSubmitting(false)
      return;
    }

    try {
      const res = await userFormFetch("/sign-up", formData);
      setUser(res.data)
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.type === 'validation') {
          const organizedErrors = {
            username: error.data.find(e => e.path === "username")?.msg,
            bio: error.data.find(e => e.path === "bio")?.msg
          }
          setErrors(organizedErrors)
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
        <CardTitle>Profile</CardTitle>
        <CardDescription>Enter your information to setup your profile</CardDescription>
        <CardAction><Button onClick={() => setStep(prev => prev - 1)} >Back</Button></CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="account-creation">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="username">Userame</FieldLabel>
              <Input aria-invalid={typeof errors === "object" && errors.username !== undefined} id="username" autoComplete="username" type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}/>
              <FieldError>{typeof errors === "object" && errors.username}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Input aria-invalid={typeof errors === "object" && errors.bio !== undefined} id="bio" type="text" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}/>
              <FieldDescription>Max. 160 characters</FieldDescription>
              <FieldError>{typeof errors === "object" && errors.bio}</FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="account-creation">{isSubmitting ? "Creating..." : "Create Account"}</Button>
      </CardFooter>
    </Card>  
  )
}