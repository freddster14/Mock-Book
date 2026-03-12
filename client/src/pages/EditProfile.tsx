import { avatarFetch } from "@/api/fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardAction, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/types";
import { AccountCreationError } from "@/types/formErrors";
import React, { useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";

export default function EditProfile() {
  const { setUser } = useAuth()
  const res = useLoaderData()
  const user = res.data;
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ username, setUsername ] = useState(user.username);
  const [ bio, setBio ] = useState(user.bio)
  const [ errors, setErrors ] = useState<undefined | string | AccountCreationError>(undefined)
  const [ selectedFile, setSelectedFile ] = useState<null | File>(null)
  const [ preview, setPreview ] = useState("")
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("username", username);
      formData.append("bio", bio)
      if (selectedFile) formData.append("avatar", selectedFile)
        console.log(...formData.entries())
      const options = {
        method: "PATCH",
        body: formData
      }
      const res = await avatarFetch(`/users`, options)
      setUser(res.data)
      navigate(`/dashboard/profile/${username}`)
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

  const previewImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file){
      setErrors("Could not upload image try again")
      return;
    }
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  return (
    <div className="mt-6">
      <Card className="w-full max-w-xl p-5 pr-0 pl-0">
        <CardHeader>
          <CardTitle>Edit</CardTitle>
          <CardDescription>Update your profile</CardDescription>
          <CardAction>
            <Button variant="link"><Link to={`/dashboard/profile/${user.username}`}>Back to Profile</Link></Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="sign-in" className="flex gap-5" encType="multipart/form-data">
            <Field>
              <FieldLabel htmlFor="avatar">Avatar</FieldLabel>
              <Avatar className=" !w-30 !h-30">
                {user.avatarUrl && preview === ""
                  ? <AvatarImage src={user.avatarUrl} className="img-full" />
                  : <AvatarImage src={preview}/>
                }
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <Input onChange={previewImg} id="avatar" type="file" name="avatar" accept="image/*"/>
            </Field>
            <FieldGroup>
              <Field>
                <FieldLabel  htmlFor="identifier">Username</FieldLabel>
                <Input aria-invalid={(typeof errors === 'object' && errors.username !== undefined) || typeof errors === "string" } type="text" value={username} id="identifier" placeholder="Email or Username" onChange={(e) => setUsername(e.target.value)} />
                <FieldError>{typeof errors === 'object' && errors.username}</FieldError>
              </Field>
              <Field className="mt-auto">
                <FieldLabel htmlFor="password">Bio</FieldLabel>
                <Input aria-invalid={typeof errors === 'object' && errors.bio !== undefined || typeof errors === "string"} type="text" value={bio} onChange={(e) => setBio(e.target.value)} />
                <FieldError>{typeof errors === 'object' && errors.bio}</FieldError>
              </Field>
            </FieldGroup>
            <FieldError>{errors && typeof errors === "string" ? errors : null}</FieldError>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" form="sign-in" type="submit">{isSubmitting ? "Editing..." : "Edit"}</Button>
        </CardFooter>
      </Card>
    </div>
   
  )
}