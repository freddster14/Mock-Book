import { AccountCreationError, AccountSetupError } from "@/types/formErrors";
import { ExpressError, UserForm } from "shared-types";

export const validateAccountSetupForm = (formData: UserForm) => {
  const tempErrors: AccountSetupError = { email: undefined , password: undefined, confirm: undefined };

  if(!formData.email) {
    tempErrors.email = "Required";
  } else if(formData.email.includes("@") === false || formData.email.includes(".") === false) {
    tempErrors.email = "Invalid email";
  }

  if(!formData.password) {
    tempErrors.password = "Required";
  } else if(formData.password.length < 6) {
    tempErrors.password = "Password must be at least 6 characters";
  } else if(!/[A-Z]/.test(formData.password)) {
    tempErrors.password = "Password must have an uppercase letter";
  } else if(!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
    tempErrors.password = "Password must have a special character";
  }

  if(!formData.confirm) {
    tempErrors.confirm = "Required";
  } else if(formData.password !== formData.confirm) {
    tempErrors.confirm = "Passwords do not match";
  }
  
  if(!tempErrors.email && !tempErrors.password && !tempErrors.confirm) return false
  return tempErrors;
}


export const validateCreateAccountForm = (formData: UserForm) => {
  const tempErrors: AccountCreationError = { username: undefined, bio: undefined };

  if(!formData.username) {
    tempErrors.username = "Required";
  } else if(/\s/.test(formData.username)) {
    tempErrors.username = "Username cannot contain spaces";
  }

  if(formData.bio.length > 160) {
    tempErrors.bio = "Bio cannot be longer than 160 characters";
  }

  if(!tempErrors.username && !tempErrors.bio) return false;
  return tempErrors;
}