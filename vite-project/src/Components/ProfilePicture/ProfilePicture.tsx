import "./ProfilePicture.css";

interface ProfilePictureProps {
  imageUrl: string;
}

function ProfilePicture({ imageUrl }: ProfilePictureProps) {
  return (
    <>
      <div className="logo">
        <img src={imageUrl} className="logo" />
      </div>
    </>
  );
}

export default ProfilePicture;
