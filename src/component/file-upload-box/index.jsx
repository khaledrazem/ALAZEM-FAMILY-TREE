import React, { useEffect, useState } from "react";
import styles from './file-upload-box.module.css';
import { Controller } from "react-hook-form";

/**
 * FileUploadBox Component
 * @param {Object} props
 * @param {Function} props.setImages - Setter function for uploaded images
 * @param {number} props.MAX_FILE_SIZE - Maximum file size in KB (default: 5120KB/5MB)
 * @param {number} props.MIN_FILE_SIZE - Minimum file size in KB (default: 0KB)
 * @param {number} props.MAX_IMAGES - Maximum number of images allowed (default: 5)
 * @param {string} props.name - Form field name
 * @param {Function} props.control - React Hook Form control function
 * @param {Array} props.initialImages - Initial images to display
 */
const FileUploadBox = ({
    setImages = null,
    MAX_FILE_SIZE = 5120,
    MIN_FILE_SIZE = 0,
    MAX_IMAGES = 5,
    name,
    control,
    initialImages = [],
    required = false,
}) => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [fileErrorMsg, setFileErrorMsg] = useState(false);

    useEffect(() => {
        if (setImages == null) {
            return;
        }
        setImages(selectedImages);
    }, [selectedImages]);
    
    useEffect(() => {
        console.log("INITIAL IMAGES", initialImages);
        if (initialImages == null || initialImages.length == 0) {
            return;
        }
        setSelectedImages(initialImages);
        console.log("INITIAL IMAGES", initialImages.length);
    }, [initialImages]);
    const validateSelectedFile = (file) => {
        
        setFileErrorMsg("");
        if (!file) {
            return false
        }
    
        const fileSizeKiloBytes = file.size / 1024
    
        if(fileSizeKiloBytes < MIN_FILE_SIZE ){
            setFileErrorMsg("File size is less than minimum limit");
            return false 
          }
        if(fileSizeKiloBytes > MAX_FILE_SIZE){
            setFileErrorMsg("File size is greater than maximum limit");
           return false
        }
        
        return true
      };

 
      const isImageUrl = (image) => {
        return typeof image === "string" && image.match(/\.(jpeg|jpg|gif|png|webp|svg)$/) !== null;
      };

      const isRawImage = (image) => {
        return image instanceof File || image instanceof Blob;
      };
      
      const checkImageType = (image) => {
        if (typeof image === "string") {
          return isImageUrl(image) ? "URL" : "Unknown";
        } else if (isRawImage(image)) {
          return "Raw Image";
        }
        return "Unknown";
      };
      const removeImage = (imageToRemove) => {
       const updatedImages = selectedImages.filter(item => item !== imageToRemove);
       setSelectedImages(updatedImages);
       
       // Create a new FileList using DataTransfer
       const dataTransfer = new DataTransfer();
       updatedImages.forEach(image => {
           if (image instanceof File) {
               dataTransfer.items.add(image);
           }
       });
       
       // Update form data
       const input = document.querySelector(`input[name="${name}"]`);
       if (input) {
           input.files = dataTransfer.files;
           // Trigger change event to update react-hook-form
           const event = new Event('change', { bubbles: true });
           input.dispatchEvent(event);
       }

       if (setImages) {
           setImages(updatedImages);
       }
   };

return (
    <div className={styles['input-box']}>
        <div className={styles['img-upload-box']}>
            <div className={styles['brows-file-wrapper']}>
           <Controller
  name={name}
  control={control}
  rules={{ required }}
  render={({ field: { onChange, ref } }) => (
    <input
      id={name}
      type="file"
      accept="image/*"
      data-multiple-caption="{count} files selected"
      onChange={(event) => {
        const files = Array.from(event.target.files);
        if (files.every((file) => validateSelectedFile(file))) {
          const newImages = [...selectedImages, ...files];
          setSelectedImages(newImages);
          console.log("SELECTED");
          console.log(newImages);

          // Create a new FileList using DataTransfer
          const dataTransfer = new DataTransfer();
          newImages.forEach((image) => {
            dataTransfer.items.add(image);
          });

          // Update the form field with the new FileList
          event.target.files = dataTransfer.files;

          if (setImages) {
            setImages(newImages);
          }

          onChange(dataTransfer.files);
        }
      }}
      style={{ display: 'none' }}
    />
  )}
    style={{ display: 'none' }}

/>

                
                {selectedImages.length > 0 ? (
                    <div className={styles['img-upload-row']}>
                        {selectedImages.map((image, i) => (
                            <img
                                key={i}
                                alt="Uploaded preview"
                                title="Click to remove"
                                src={isRawImage(image) ? URL.createObjectURL(image) : image}
                                onClick={() => removeImage(image)}
                            />
                        ))}
                        {selectedImages.length < MAX_IMAGES && (
                            <label htmlFor={name}>
                                <i className={styles['feather-upload']} />
                            </label>
                        )}
                    </div>
                ) : (
                    <label htmlFor={name} title="No File Chosen">
                        <p>
                            <i className={styles['feather-upload']} />
                            <span>Click to upload image</span>
                        </p>
                    </label>
                )}
            </div>
        </div>
        
        {fileErrorMsg && (
            <span className={styles['text-danger']}>
                {fileErrorMsg}
            </span>
        )}
    </div>
)

}

export default FileUploadBox;