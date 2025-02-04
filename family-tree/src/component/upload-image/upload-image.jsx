import { useEffect, useState } from "react";
import classes from "./upload-image.module.css";
import Image from 'next/image';

import UpArrowIcon from "@/public/svg/Up Arrow_Black.svg";

function UploadImage({
  formImage = null,
  height,
  width,
  register,
  name,
  text = "Upload",
}) {
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (formImage != null) {
      setImage(formImage);
    }
  }, [formImage]);

  function handleImageUpload(event) {
    const files = Array.from(event.target.files);

    setImage(URL.createObjectURL(files[0]));
  }

  return (
    <div className={classes.container} style={{ maxWidth: width }}>
      {image == null ? (
        <div
          className={classes.emptyimage}
          style={{ aspectRatio: width / height, maxWidth: width }}
        >
          <label>{text}</label>
          <UpArrowIcon />
        </div>
      ) : (
        <img src={image} style={{ aspectRatio: width / height }} />
      )}
      <input
        type="file"
        accept="image/*"
        {...register(name, {
          onChange: (event) => handleImageUpload(event),
        })}
      />
    </div>
  );
}

export default UploadImage;
