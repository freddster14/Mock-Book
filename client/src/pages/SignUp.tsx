import { useState } from "react"
import type { UserForm } from "shared-types"
import AccountSetupForm from "../components/AccountSetupForm"
import CreateAccountForm from "../components/CreateAccountForm";

export default function SignUp() {
  const [ step, setStep ] = useState<number>(1);
  const [ formData, setFormData ] = useState<UserForm>({
    username: '',
    email: '',
    bio: 'Hello World!',
    password: '',
    confirm: ''
  })
  console.log(step)
  return (
    <>
    {step === 1 && <AccountSetupForm formData={formData} setFormData={setFormData} setStep={setStep}/>}
    {step === 2 && <CreateAccountForm formData={formData} setFormData={setFormData} />}
    </>
  )
}