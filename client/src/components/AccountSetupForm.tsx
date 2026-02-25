import type { UserForm } from "shared-types";
import { formFetch } from "../api/fetch";
import { useState } from "react";
import { ExpressError } from "shared-types";
import { ApiError } from "../types";
import { Link } from "react-router";
import { validateAccountSetupForm } from "../utils/formValidation";

export default function AccountSetupForm({ formData, setFormData, setStep }: {
  formData: UserForm,
  setFormData: React.Dispatch<React.SetStateAction<UserForm>>,
  setStep: React.Dispatch<React.SetStateAction<number>>
}) {
  const [ errors, setErrors ] = useState<ExpressError[] | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ showPassword, setShowPassword ] = useState(false);
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors(null)
    if(isSubmitting) return;
    setIsSubmitting(true)

    const tempErrors: ExpressError[] = validateAccountSetupForm(formData);
    if(tempErrors.length > 0) {
      setErrors(tempErrors);
      setIsSubmitting(false)
      return;
    }

    try {
      await formFetch("/set-up", formData);
      setStep(2)
    } catch (error) {
      if (error instanceof ApiError) {
        console.log(error.type, error.data)
        setErrors(error.data)
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div>
      <div>
        <h1>Account Setup</h1>
        <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
        <p>Password must be at least 6 characters, have an uppercase letter and a special character</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email
          <input id="email" autoComplete="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <p>{errors?.find(err => err.path === "email")?.msg}</p>
        </label>
        <label htmlFor="password">Password
          <input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >{showPassword ? "Hide" : "Show"}</button>
          <p>{errors?.find(e => e.path === "password")?.msg}</p>
        </label>
        <label htmlFor="confirm">Confirm
          <input id="confirm" type="password" value={formData.confirm} onChange={(e) => setFormData({...formData, confirm: e.target.value})} />
          <p>{errors?.find(e => e.path === "confirm")?.msg}</p>
        </label>
        <button type="submit">Next</button>
      </form>
    </div>  
  )
}
