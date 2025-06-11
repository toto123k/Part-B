import "./ProfilePicture.css";

interface ProfilePictureProps {
  imageUrl: string;
}

export const ProfilePicture = ({ imageUrl }: ProfilePictureProps) => {
  return (
    <>
      <div className="logo">
        <img src={imageUrl} className="logo" />
      </div>
    </>
  );
};
