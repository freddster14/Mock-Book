import type { UserForm } from "shared-types";
import { userFormFetch } from "../api/fetch";
import { useState } from "react";
import { ApiError } from "../types";
import { Link } from "react-router";
import { validateAccountSetupForm } from "../utils/formValidation";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { AccountSetupError } from "@/types/formErrors";

export default function AccountSetupForm({ formData, setFormData, setStep }: {
  formData: UserForm,
  setFormData: React.Dispatch<React.SetStateAction<UserForm>>,
  setStep: React.Dispatch<React.SetStateAction<number>>
}) {
  const [ errors, setErrors ] = useState< string | AccountSetupError | undefined >(undefined);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors(undefined)
    if(isSubmitting) return;
    setIsSubmitting(true)

    const tempErrors: AccountSetupError | false = validateAccountSetupForm(formData);
    if(tempErrors) {
      setErrors(tempErrors);
      setIsSubmitting(false)
      return;
    }

    try {
      await userFormFetch("/set-up", formData);
      setStep(2)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.type === "validation") {
          const organizedErr = {
            email: error.data.find(e => e.path === "email")?.msg,
            password: error.data.find(e => e.path === "password")?.msg,
            confirm: error.data.find(e => e.path === "confirm")?.msg,
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
        <CardTitle>Account</CardTitle>
        <CardDescription>Enter your information to start creating your account</CardDescription>
        <CardAction>
          <Button variant="link"><Link to="/sign-in">Sign In</Link></Button> 
        </CardAction>
      </CardHeader>
      <CardContent>
      <form onSubmit={handleSubmit} id="account-set-up">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input placeholder="mock@book.com" aria-invalid={typeof errors === 'object' && errors.email !== undefined} id="email" autoComplete="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            <FieldError>{typeof errors === "object" && errors.email}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <InputGroup>
              <InputGroupInput aria-invalid={typeof errors === "object" && errors.password !== undefined} id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >{showPassword ? "Hide" : "Show"}</Button>
              </InputGroupAddon>  
            </InputGroup>
            <FieldDescription>Min. 6 characters, contain a uppercase letter and a special character</FieldDescription>
            <FieldError>{typeof errors === "object" && errors.password}</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm">Confirm</FieldLabel>
            <Input aria-invalid={typeof errors === "object" && errors.confirm !== undefined} id="confirm" type="password" value={formData.confirm} onChange={(e) => setFormData({...formData, confirm: e.target.value})}/>
            <FieldError>{typeof errors === "object" && errors.confirm}</FieldError>
          </Field>
        </FieldGroup>
      </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="account-set-up">{isSubmitting ? "Loading...": "Next"}</Button>
      </CardFooter>
     
    </Card>  
  )
}
