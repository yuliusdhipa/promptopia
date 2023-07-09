"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Profile from "@components/Profile";
import Loading from "@components/loading";

const UserProfile = ({ params }) => {
  const searchParams = useSearchParams();
  const userName = searchParams.get("name");

  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    const response = await fetch(`/api/users/${params?.id}/posts`);
    const data = await response.json();

    setUserPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    if (params?.id) fetchPosts();
  }, [params.id]);

  return (
    <>
      {loading ? (
        <div className="absolute w-full h-screen top-1/4 left-0 flex-center">
          <Loading />
        </div>
      ) : (
        <Profile
          name={userName}
          desc={`Welcome to ${userName}'s personalized profile page. Explore ${userName}'s exceptional prompts and be inspired by the power of their imagination`}
          data={userPosts}
        />
      )}
    </>
  );
};

export default UserProfile;
