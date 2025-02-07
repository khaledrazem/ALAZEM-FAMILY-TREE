import React, { useEffect, useState } from "react";
import styles from './file-upload-box.module.css';

/**
 * FileUploadBox Component
 * @param {Object} props
 * @param {Function} props.setImages - Setter function for uploaded images
 * @param {number} props.MAX_FILE_SIZE - Maximum file size in KB (default: 5120KB/5MB)
 * @param {number} props.MIN_FILE_SIZE - Minimum file size in KB (default: 0KB)
 * @param {number} props.MAX_IMAGES - Maximum number of images allowed (default: 5)
 * @param {string} props.name - Form field name
 * @param {Function} props.register - React Hook Form register function
 * @param {Array} props.initialImages - Initial images to display
 */
const FileUploadBox = ({
    setImages = null,
    MAX_FILE_SIZE = 5120,
    MIN_FILE_SIZE = 0,
    MAX_IMAGES = 5,
    name,
    register,
    initialImages = []
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
    const fileSelectedHandler = (e) => {

        if (validateSelectedFile(e[0])) {
            setSelectedImages([
                ...selectedImages,
                ...e,
            ]);
        }
    }

      const removeImage = (e) => {
        setSelectedImages(
            selectedImages.filter(item => item !== e)
        );

        if (setImages == null) {
            return;
        }
        setImages(selectedImages);
    };

return (
    <div className={styles['input-box']}>
        <div className={styles['img-upload-box']}>
            <div className={styles['brows-file-wrapper']}>
                <input
                    name="file"
                    id="file"
                    type="file"
                    accept="image/vnd.sealedmedia.softseal.jpg, image/jpeg, image/png"
                    data-multiple-caption="{count} files selected"
                    {...register(name, {
                        onChange: (event) => {
                            event.preventDefault();
                            fileSelectedHandler(event.target.files);
                            event.target.value = null;
                        },
                    })}
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
                            <label htmlFor="file">
                                <i className={styles['feather-upload']} />
                            </label>
                        )}
                    </div>
                ) : (
                    <label htmlFor="file" title="No File Chosen">
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