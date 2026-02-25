import type { ExpressError, UserForm } from "shared-types";
import { formFetch } from "../api/fetch";
import { useState } from "react";
import { validateCreateAccountForm } from "../utils/formValidation";
import { ApiError } from "../types";
import { Navigate } from "react-router";

export default function CreateAccountForm({ formData, setFormData }:
  { formData: UserForm,
    setFormData: React.Dispatch<React.SetStateAction<UserForm>>
  }) {

  const [ errors, setErrors ] = useState<ExpressError[] | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors(null)
    if(isSubmitting) return;
    setIsSubmitting(true)

    const tempErrors: ExpressError[] = validateCreateAccountForm(formData);
    if(tempErrors.length > 0) {
      setErrors(tempErrors);
      setIsSubmitting(false)
      return;
    }

    try {
      await formFetch("/sign-up", formData);
      return <Navigate to="/dashboard" />;
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
        <h1>Edit Profile</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username
          <input id="username" autoComplete="username" type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
          <p>{errors?.find(err => err.path === "username")?.msg}</p>
        </label>
        <label htmlFor="bio">Bio
          <input id="bio" type="text" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
          <p>{errors?.find(err => err.path === "bio")?.msg}</p>
        </label>
        <button type="submit">Create Account</button>
      </form>
    </div>  
  )
}