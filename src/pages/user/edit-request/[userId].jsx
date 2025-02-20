
import UploadImage from '@/component/upload-image/upload-image';
import styles from './edit-request.module.css';
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form"
import LabelledDatePicker from '@/component/labelled-datepicker/labelled-datepicker';
import FileUploadBox from '@/component/file-upload-box';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import UserFields from '@/component/user-fields';
import SupaBaseUserAPI from '@/api/supabase-user';
import CloudinaryUserAPI from '@/api/cloudinary-user';



export default function UserPage() {
  const router = useRouter()
  const userIDqry = router.query.userId;
  const [userId, setUserId] = useState(null);
  const supabaseApi = new SupaBaseUserAPI();
  const cloudinaryApi = new CloudinaryUserAPI();

  async function onSubmit(data) {
    console.log(data);
    //TODO: Send data to the database with pending status

    let requestData =   {
      "first_name": data.firstName ? data.firstName : null,
      "last_name": data.lastName ? data.lastName : null,
      "arabic_name": data.arabicName ? data.arabicName: null,
      "gender": data.gender ? data.gender : null,
      "dob" : data.dob ? data.dob : null,
      "marital_status": data.maritalStatus ? data.maritalStatus : null,
      "avatar":  data.avatar ? await uploadImage( data.avatar[0]) : null,
      "gallery_photos": data.galleryPhotos && data.galleryPhotos.length > 0
      ? await uploadImages(data.galleryPhotos)
      : [],
    "id_documents": data.identityDocument && data.identityDocument.length > 0
      ? await uploadImages(data.identityDocument)
      : [],
      "email": data.emailAddress ? data.emailAddress : null,
      "public_email": data.publicEmail ? data.publicEmail : false,
      "father": data.father ? data.father.id : null,
      "mother": data.mother ? data.mother.id : null,
      "siblings": data.siblings && data.siblings.length>0? data.siblings.map((sibling) => sibling.id) : null,
      "children": data.children && data.children.length>0 ? data.children.map((child) => child.id) : null,
      "is_editing": true,
      "existing_id": userId,
    } 

    await supabaseApi.createUserRequest(
    requestData
    );

    router.push('/');
  }



  useEffect(() => {
    console.log("userIDqry");
    console.log(userIDqry);

    if (userIDqry) {
      setUserId(userIDqry);
    }

  }, [userIDqry]);
  return (


    <div  className={styles.useredit}>
     
     <UserFields onSubmit={onSubmit} isEdit={true} userId={userId}/>
      <div className={styles.buttons}>
        <button onClick={() => router.back()}>Back</button>
        </div>
    </div>

  );

  async function uploadImages(images) {

    let uploaded = [];
    for (let count=0;count<images.length;count++) {
      uploaded.push(await uploadImage(images[count]));

    }
    return uploaded;
  }

  async function uploadImage(image) {

    let response = await cloudinaryApi.uploadImage(image);
    return response;
  }
}

