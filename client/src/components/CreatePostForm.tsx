import React, { useState } from "react";
import { avatarFetch } from "../api/fetch";
import { useNavigate } from "react-router";
import { PostCreationError } from "@/types/formErrors";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ApiError } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { Textarea } from "./ui/textarea";
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function CreatePostForm() {
  const { user } = useAuth()
  const [ errors, setErrors ] = useState<PostCreationError | null | string>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ content, setContent ] = useState("");
  const [ selectedFile, setSelectedFile ] = useState<File | null>(null);
  const [ preview, setPreview ] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors(null);
    if(isSubmitting) return;
    setIsSubmitting(true);
   
    try {
      const formData = new FormData()
      formData.append("content", content)
      if (selectedFile) formData.append("image", selectedFile)
      const options = {
        method: "POST",
        body: formData
      }
      await avatarFetch(`/posts`, options)
      navigate(`/dashboard/profile/${user?.username}`);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.type === 'validation') {
          const organizedErrors = {
            content: error.data.find(e => e.path === "content")?.msg,
            image: error.data.find(e => e.path === "image")?.msg
          }
          setErrors(organizedErrors)
        } else {
          setErrors("An unexpected error occurred. Please try again.")
        }
      }
    } finally {
      setIsSubmitting(false);
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

  const removeImg = () => {
    setPreview(null)
    setSelectedFile(null)
  }
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Create Post</CardTitle>
        <CardDescription>Be creative. Make it unique</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} encType="multipart/form-data" id="create-post">
          <FieldGroup>
            <Field>
              <div>{preview
              ? <img src={preview} className="m-h-50" />
              : <p>Image place holder</p>
              }</div>
              <Button type="button" onClick={removeImg}>X</Button>
              <Input aria-invalid={typeof errors === "object" && errors?.image !== undefined} onChange={previewImg} id="image" type="file" name="image" accept="image/*"/>
              <FieldError>{typeof errors === "object" && errors?.image}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea aria-invalid={typeof errors === "object" && errors?.content !== undefined} value={content} onChange={(e) => setContent(e.target.value)}/>
              <FieldError>{typeof errors === "object" && errors?.content}</FieldError>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="create-post" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</Button>
      </CardFooter>
    </Card>
  )
}