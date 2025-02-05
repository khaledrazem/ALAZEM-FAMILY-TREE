import React, { useEffect, useState } from "react";

//This component creates a box to upload a number of images, to use it, import it to your page and assign the following paramters
//setImages(required): pass in the setter to your const object, this will directly assign to it a list of the uploaded files
//MAX or MIN _FILE_SIZE(optional): by defult it is set to require files below 5 mb, to change that pass a different number with these parameters
//MAX_IMAGES(optional): By default it will only accept 5 images, change this by using this parameter
// <FileUploadBox setImages={setImages}></FileUploadBox>
const  FileUploadBox = ({setImages = null, MAX_FILE_SIZE=5120, MIN_FILE_SIZE = 0, MAX_IMAGES=5, name, register, initialImages=[]}) => {
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
    <div>
        <div className="input-box pb--20">
            <div className="row">
                <div id="small-upload" className="img-upload-box">
                    <div
                        className="brows-file-wrapper"
                        style={{
                            height: "80px",
                        }}
                    >
                        <input
                            name="file"
                            id="file"
                            type="file"
                            accept="image/vnd.sealedmedia.softseal.jpg, image/jpeg, image/png"
                            data-multiple-caption="{count} files selected"
                            {...register(name, {
                                onChange: (event) => {
                                    event.preventDefault;
                                    fileSelectedHandler(event.target.files);
                                    event.target.value = null;
                                },
                              })}
                           
                            style={{display:'none'}}
                        />
                        {selectedImages.length>0 && (
                        
                        <div className="img-upload-row">
                        {selectedImages.map((image, i) =>
                        <img
                        alt="not found"
                        title="Click to remove"
                        width={"250px"}
                        src={ isRawImage(image)? URL.createObjectURL(image): image}
                        onClick= {(e) => {removeImage(image)}}
                    /> )}
                    {selectedImages.length<MAX_IMAGES &&(
                        <label  htmlFor="file">
                    <i className="feather-upload"/>
                    </label>
                    )}
                        </div>
                    )}
                        {!selectedImages.length>0 && (
                            <label
                            htmlFor="file"
                            title="No File Choosen"
                            style={{
                                height: "80px",
                            }}
                        >
                            <p className="text-center mt--10">
                                <i className="feather-upload" />
                                &nbsp;&nbsp;&nbsp;Click to upload image.
                            </p>
                        </label>
                        )}
                    </div>
                </div>
            </div>
            {fileErrorMsg  && 
                <span className={clsx("text-danger mt-2 d-inline-block", className)}>
                {fileErrorMsg}
            </span>}
            
        </div>
      
                          
        
    </div>
)

}

export default FileUploadBox;