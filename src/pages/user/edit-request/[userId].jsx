
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



export default function UserPage() {
  const router = useRouter()
  const userIDqry = router.query.userId;
  const [userId, setUserId] = useState(null);
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
        "gallery_photos": data.galleryPhotos ? uploadImage(data.galleryPhotos) : null,
        "id_documents": data.identityDocument ?uploadImage(data.identityDocument) : null,
        "email": data.emailAddress ? data.emailAddress : null,
        "public_email": data.publicEmail ? data.publicEmail : false,
        "father": data.father ? data.father.id : null,
        "mother": data.mother ? data.mother.id : null,
        "siblings": data.siblings && data.siblings.length>0? data.siblings.map((sibling) => sibling.id) : null,
        "children": data.children && data.children.length>0 ? data.children.map((child) => child.id) : null,
        "is_editing": true,
        "existing_id": userId,
      } 
    );

    router.push('/');
  }

  function uploadImage(images) {
    //TODO: Upload images to the server and return url
    return [];
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

  function data() {
    return {
      "id": "0",
      "rels": {
        "spouses": [
          "055a439f-d985-4128-aca8-24a2f0b9af7e"
        ]
      },
      "data": {
        "firstName": "Name",
        "lastName": "Surname",
        "birthday": 1970,
        "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
        "gender": "M",
        "maritalStatus": "Married"
      }
    }
  }
}

