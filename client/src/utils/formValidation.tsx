import { ExpressError, UserForm } from "shared-types";

export const validateAccountSetupForm = (formData: UserForm) => {
  const tempErrors: ExpressError[] = [];

  if(!formData.email) {
    tempErrors.push({ path: "email", value: formData.email, msg: "Required"});
  } else if(formData.email.includes("@") === false || formData.email.includes(".") === false) {
    tempErrors.push({ path: "email", value: formData.email, msg: "Invalid email"});
  }

  if(!formData.password) {
    tempErrors.push({ path: "password", value: formData.password, msg: "Required"});
  } else if(formData.password.length < 6) {
    tempErrors.push({ path: "password", value: formData.password, msg: "Password must be at least 6 characters"});
  } else if(!/[A-Z]/.test(formData.password)) {
    tempErrors.push({ path: "password", value: formData.password, msg: "Password must have an uppercase letter"});
  } else if(!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
    tempErrors.push({ path: "password", value: formData.password, msg: "Password must have a special character"});
  }

  if(!formData.confirm) {
    tempErrors.push({ path: "confirm", value: formData.confirm, msg: "Required"});
  } else if(formData.password !== formData.confirm) {
    tempErrors.push({ path: "confirm", value: formData.confirm, msg: "Passwords do not match"});
  }
  
  return tempErrors;
}


export const validateCreateAccountForm = (formData: UserForm) => {
  const tempErrors: ExpressError[] = [];

  if(!formData.username) {
    tempErrors.push({ path: "username", value: formData.username, msg: "Required"});
  } else if(/\s/.test(formData.username)) {
    tempErrors.push({ path: "username", value: formData.username, msg: "Username cannot contain spaces"});
  }

  if(formData.bio.length > 160) {
    tempErrors.push({ path: "bio", value: formData.bio, msg: "Bio cannot be longer than 160 characters"});
  }

  return tempErrors;
}