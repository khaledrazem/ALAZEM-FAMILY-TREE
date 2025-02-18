
import UploadImage from '@/component/upload-image/upload-image';
import styles from './request-new.module.css';
import { useRouter } from 'next/router'
import { useForm } from "react-hook-form"
import LabelledDatePicker from '@/component/labelled-datepicker/labelled-datepicker';
import FileUploadBox from '@/component/file-upload-box';
import { useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import UserFields from '@/component/user-fields';
import SupaBaseUserAPI from '@/api/supabase-user';



export default function UserPage() {
  const router = useRouter()
  const supabaseApi = new SupaBaseUserAPI();

  async function onSubmit(data) {
    console.log(data);
    //TODO: Send data to the database with pending status

    await supabaseApi.createUserRequest(
      {
        "first_name": data.firstName ? data.firstName : null,
        "last_name": data.lastName ? data.lastName : null,
        "gender": data.gender ? data.gender : null,
        "dob" : data.dob ? data.dob : null,
        "marital_status": data.maritalStatus ? data.maritalStatus : null,
        "avatar": data.avatar ? data.avatar : null,
        "gallery_photos": data.galleryPhotos ? uploadImage(data.galleryPhotos) : [],
        "id_documents": data.identityDocument ?uploadImage(data.identityDocument) : [],
        "email": data.emailAddress ? data.emailAddress : null,
        "public_email": data.publicEmail ? data.publicEmail : false,
        "father": data.father ? data.father.id : null,
        "mother": data.mother ? data.mother.id : null,
        "siblings": data.siblings && data.siblings.length>0? data.siblings.map((sibling) => sibling.id) : null,
        "children": data.children && data.children.length>0 ? data.children.map((child) => child.id) : null,
        "is_editing": false,
        "existing_id": null,
      } 
    );

    router.push('/');
  }

  function uploadImage(images) {
    //TODO: Upload images to the server and return url
    return [];
  }


  return (


    <div className={styles.userform}>
      <UserFields onSubmit={onSubmit}/>
     

      <div className={styles.buttons}>
        <button onClick={() => router.back()}>Back</button>
        <input  type="submit" value="Submit"/>
        </div>
    </div>

  );
}