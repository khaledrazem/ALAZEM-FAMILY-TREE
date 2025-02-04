
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



export default function UserPage() {
  const router = useRouter()
  const userIDqry = router.query.userId;
  const [userId, setUserId] = useState(null);
  function onSubmit(data) {
    console.log(data);
    //TODO: Send data to the database
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

