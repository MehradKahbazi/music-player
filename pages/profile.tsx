// import { useState } from "react";
import GradientLayout from "../components/gradientLayout/GradientLayout";
import { useMe } from "../lib/hooks";
import ProfileForm from "../components/forms/ProfileForm";
import { useState } from "react";

const Profile = () => {
  const { user, isLoading } = useMe();
  const [message, setMessage] = useState("");
  return (
    <GradientLayout
      color="blue"
      subtitle="profile"
      title={`${user?.firstName} ${user?.lastName}`}
      description={`${user?.playListCount} public playlist`}
      image={user?.imageUrl || "/prof.avif"}
      roundImage
      edit
      id={user?.id}
      type="user"
    >
      <ProfileForm isLoading={isLoading} setMessage={setMessage} />
    </GradientLayout>
  );
};

export default Profile;
