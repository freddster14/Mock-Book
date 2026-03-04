import { ApiError } from "../types";
import React, { useState } from "react";
import { ExpressError } from "shared-types";
import { apiFetch } from "../api/fetch";
import { useNavigate } from "react-router";

export default function CreatePostForm() {
  const [ errors, setErrors ] = useState<ExpressError[] | null>(null);
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ content, setContent ] = useState("");
  const [ imgUrl, setImgUrl ] = useState<File | null>(null);
  const [ imgPreview, setImgPreview ] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setErrors(null);
    if(isSubmitting) return;
    setIsSubmitting(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({ content, imgUrl: imgUrl ? imgUrl : undefined }),
        headers: {
          "Content-Type": "application/json",
        },
      }
      const res = await apiFetch("/posts", options);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors(error.data);
      }
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <div>
        <h1>Create Post</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        <p>{errors?.find(err => err.path === "content")?.msg}</p>
        <input type="file" onChange={(e) => {
          setImgUrl(e.target.files?.[0] || null);
          setImgPreview(e.target.files?.[0] ? URL.createObjectURL(e.target.files[0]) : null);
        }} />
        {imgPreview && <img src={imgPreview} alt="Preview" />}
        <p>{errors?.find(err => err.path === "imgUrl")?.msg}</p>
        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create"}</button>
      </form>
    </>
  )
}