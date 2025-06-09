import { Stack } from "@mui/material";
import { SocialMediaImageButton } from "../SocialMediaImageButton/SocialMediaImageButton";

export const SocialMediaStack = () => {
  return (
    <Stack direction="row" spacing={3} sx={{ pt: 5, pb: 0 }}>
      <SocialMediaImageButton
        imageUrl="https://cdn2.downdetector.com/static/uploads/c/300/f0d8e/FB-f-Logo__blue_512.png"
        linkToOpen="https://facebook.com"
      />
      <SocialMediaImageButton
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/LinkedIn_logo_initials.png/480px-LinkedIn_logo_initials.png"
        linkToOpen="https://www.linkedin.com/in/example"
      />
      <SocialMediaImageButton
        imageUrl="https://m.media-amazon.com/images/I/31AGs2bX7mL.png"
        linkToOpen="https://www.twitter.com"
      />
    </Stack>
  );
};
