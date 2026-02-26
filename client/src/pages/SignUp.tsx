import { useState } from "react"
import type { UserForm } from "shared-types"
import AccountSetupForm from "../components/AccountSetupForm"
import CreateAccountForm from "../components/CreateAccountForm";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";

export default function SignUp() {
  const { loading, user } = useAuth()
  const [ step, setStep ] = useState<number>(1);
  const [ formData, setFormData ] = useState<UserForm>({
    username: '',
    email: '',
    bio: 'Hello World!',
    password: '',
    confirm: ''
  })

  if(!loading && user) {
    return <Navigate to="/dashboard"/>
  } else if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
    {step === 1 && <AccountSetupForm formData={formData} setFormData={setFormData} setStep={setStep}/>}
    {step === 2 && <CreateAccountForm formData={formData} setFormData={setFormData} />}
    </>
  )
}