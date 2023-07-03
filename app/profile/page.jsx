"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [myPosts, setMyPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await fetch(`/api/users/${session?.user.id}/posts`);
    const data = await res.json();

    setMyPosts(data);
  };

  useEffect(() => {
    if (session?.user.id) fetchPosts();
  }, [session?.user.id]);

  const handleEdit = () => {
    console.log("edit");
  };

  const handleDelete = async () => {
    console.log("delete");
  };

  return (
    <Profile
      name="my"
      desc="Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination"
      data={myPosts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
