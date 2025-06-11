import "./SocialMediaImageButton.css";
interface SocialMediaImageButton {
  imageUrl: string;
  linkToOpen: string;
}

export const SocialMediaImageButton = ({
  imageUrl,
  linkToOpen,
}: SocialMediaImageButton) => {
  return (
    <a href={linkToOpen} target="_blank" rel="noopener noreferrer">
      <img src={imageUrl} alt="Facebook" className="social-media-img" />
    </a>
  );
};
