
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



export default function UserPage() {
  const router = useRouter()

  function onSubmit(data) {
    console.log(data);
    //TODO: Send data to the database with pending status
    router.push('/');
  }



  return (


    <div className={styles.userform}>
      <UserFields onSubmit={onSubmit}/>
     

      <div className={styles.buttons}>
        <button onClick={() => router.back()}>Back</button>
        <input type="submit" value="Submit"/>
        </div>
    </div>

  );
}