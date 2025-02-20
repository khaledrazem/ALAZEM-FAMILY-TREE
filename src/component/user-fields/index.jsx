import UploadImage from '@/component/upload-image/upload-image';
import styles from './user-fields.module.css';
import { useRouter } from 'next/router'
import { Controller, useForm } from "react-hook-form"
import LabelledDatePicker from '@/component/labelled-datepicker/labelled-datepicker';
import FileUploadBox from '@/component/file-upload-box';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import SupaBaseUserAPI from '@/api/supabase-user';

export default function UserFields({isEdit=false, isAdminPreview=false, userId=null, onSubmit, submitLabel="Submit"}) {
  const router = useRouter()
  const { register, handleSubmit, reset, getValues, control, watch } = useForm();
  const supabaseApi = new SupaBaseUserAPI();

  const [users, setUsers] = useState([])
  const [initialGallaries, setInitialGallaries] = useState([])
  const [userDetails, setUserDetails] = useState({});


  async function getSimpleUsers() {
    //TODO: Get users from the database with only first name and last name and DOB
    let usersData = await supabaseApi.getAllUsersBrief();

    console.log(usersData);
    usersData = usersData.map((user) => {
      return {
        id: user.id,
        data: {
          "firstName": user.first_name,
          "lastName": user.last_name,
      
          "birthday": user.dob,
        }
      
  }
});
    setUsers(usersData);
  }

  async function getDisplayUserDetails() {
    if (isEdit && !userId){
      console.log("userid not provided");
      router.push("/")
    }

    setUserDetails(await supabaseApi.getUserDetails(userId));

    
  }


  useEffect(() => {
    const fetchData = async () => {
        await getSimpleUsers();

        console.log(userId);
        console.log(isEdit);
        if (isEdit && userId) {
            await getDisplayUserDetails();
           
        }
    };

    fetchData();
    console.log(userDetails)
}, [userId]);

useEffect(() => {
  const fetchData = async () => {
    
          console.log(userDetails)
          reset({
              avatar: userDetails.avatar,
              firstName: userDetails.first_name,
              lastName: userDetails.last_name,
              dob: userDetails.dob,
              gender: userDetails.gender,
              maritalStatus: userDetails.marital_status,
              emailAddress: userDetails.email,
              publicEmail: userDetails.publicEmail,
              galleryPhotos: userDetails.gallery_photos,
              spouse: users.find((item) => item.id === userDetails?.spouse),
              siblings: userDetails?.siblings ? users.filter((item) => userDetails.siblings.includes(item.id)) : [],
              father: users.find((item) => item.id === userDetails?.father),
              mother: users.find((item) => item.id === userDetails?.mother),
              children: userDetails?.children ? users.filter((item) => userDetails.children.includes(item.id)) : [],
          });
          setInitialGallaries(userDetails.gallery_photos);
      }


  fetchData();
  console.log(users.filter((item) => item.id == userDetails.siblings) )
  console.log(users)
  console.log(userDetails)
}, [userDetails]);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.userform}>
      <label>Keep in mind that all infomraiton provided here will be avaliable publicly (except for identity documents)</label>

      <div className={styles.userinfo}>
        <div className={styles.avatar}>
          <UploadImage register={register} 
           name={"avatar"}
           height={296}
           width={285}
           text={"Profile Photo"}
           formImage={userDetails.avatar}/>
        </div>

        <div className={styles.userdata}>
          <div className={styles.datarow}>
            <label>first name: </label>
            <input
              type='text'
              {...register("firstName", {
                required: "Please enter your first name.",
              })} 
            />
          </div>

          <div className={styles.datarow}>
            <label>Last name: </label>
            <input
              type='text'
              {...register("lastName", {
                required: "Please enter your last name.",
              })} 
            />
          </div>

          <div className={styles.datarow}>
            <label>Arabic full name: </label>
            <input
              type='text'
              {...register("arabicName", {
              })} 
            />
          </div>

          <div className={styles.datarow}>
            <LabelledDatePicker
              name="dob"
              title="Date of Birth"
              register={register}
              rules={{ required: "Please select a date of birth" }}
            />
          </div>

          <div className={styles.datarow}>
            <label>Email Address: </label>
            <input
              type='text'
              {...register("emailAddress")} 
            />
          </div>

          <div className={styles.datarow}>
            <label for="publicEmail">Show email in public profile? </label>
            <input
            id='publicEmail'
              type='checkBox'
              {...register("publicEmail")} 
            />
          </div>

          <div className={styles.datarow}>
            <label>Gender: </label>
            <label>
              <input
                type="radio"
                value="M"
                {...register("gender", {
                  required: "Please select gender.",
                })}
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                value="F"
                {...register("gender")}
              />
              Female
            </label>
          </div>

          <div className={styles.datarow}>
            <label>Marital status: </label>
            <label>
              <input
                type="radio"
                value="Married"
                {...register("maritalStatus", {
                  required: "Please select gender.",
                })}
              />
              Married
            </label>
            <label>
              <input
                type="radio"
                value="Single"
                {...register("maritalStatus")}
              />
              Single
            </label>
          </div>

          <div className={styles.datarow}>
            <label>Spouse: </label>
            <Controller
              control={control}
              name="spouse"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                value={value || null}
                  onChange={(event, item) => {
                    onChange(item);
                  }}
                  disablePortal
                  options={users}
                  getOptionLabel={(option) => 
                    `${option.data.firstName} ${option.data.lastName} (DOB: ${option.data.birthday})`
                  }
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Spouse" />}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...optionProps}
                      >
                        {option.data.firstName}{" "} {option.data.lastName} {" "}{"DOB: "}{option.data.birthday}
                      </Box>
                    );
                  }}
                />
              )}
            />
          </div>

          <div className={styles.datarow}>
            <label>Father: </label>
            <Controller
              control={control}
              name="father"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                value={value || null}

                  onChange={(event, item) => {
                    onChange(item);
                  }}
                  disablePortal
                  options={users}
                  getOptionLabel={(option) => 
                    `${option.data.firstName} ${option.data.lastName} (DOB: ${option.data.birthday})`
                  }                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Father" />}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...optionProps}
                      >
                        {option.data.firstName}{" "} {option.data.lastName} {" "}{"DOB: "}{option.data.birthday}
                      </Box>
                    );
                  }}
                />
              )}
            />
          </div>

          <div className={styles.datarow}>
            <label>Mother: </label>
            <Controller
              control={control}
              name="mother"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                value={value || null}
                onChange={(event, item) => {
                    onChange(item);
                  }}
                  disablePortal
                  options={users}
                  getOptionLabel={(option) => 
                    `${option.data.firstName} ${option.data.lastName} (DOB: ${option.data.birthday})`
                  }                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Mother" />}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...optionProps}
                      >
                        {option.data.firstName}{" "} {option.data.lastName} {" "}{"DOB: "}{option.data.birthday}
                      </Box>
                    );
                  }}
                />
              )}
            />
          </div>

          <div className={styles.datarow}>
            <label>Siblings: </label>
            <Controller
              control={control}
              name="siblings"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                value={value || []}

                onChange={(event, item) => {
                    onChange(item);
                  }}
                  multiple
                  disablePortal
                  options={users}
                  getOptionLabel={(option) => 
                    `${option.data.firstName} ${option.data.lastName} (DOB: ${option.data.birthday})`
                  }                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Siblings" />}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...optionProps}
                      >
                        {option.data.firstName}{" "} {option.data.lastName} {" "}{"DOB: "}{option.data.birthday}
                      </Box>
                    );
                  }}
                />
              )}
            />
          </div>

          <div className={styles.datarow}>
            <label onClick={() => console.log(getValues())}>Children: </label>
            <Controller
              control={control}
              name="children"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                value={value || []}

                onChange={(event, item) => {
                    onChange(item);
                  }}
                  multiple
                  disablePortal
                  options={users}
                  getOptionLabel={(option) => 
                    `${option.data.firstName} ${option.data.lastName} (DOB: ${option.data.birthday})`
                  }                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Children" />}
                  renderOption={(props, option) => {
                    const { key, ...optionProps } = props;
                    return (
                      <Box
                        key={key}
                        component="li"
                        {...optionProps}
                      >
                        {option.data.firstName}{" "} {option.data.lastName} {" "}{"DOB: "}{option.data.birthday}
                      </Box>
                    );
                  }}
                />
              )}
            />
          </div>

           <div className={styles.datarow}>
            <label onClick={() => console.log(getValues())}>Identity document (To verify your Identity we require an idenitity document that shows your full name and parents name, this image will be deleted as soon as the request is accepted/rejected ): </label>
            <FileUploadBox
              control={control}
              name={"identityDocument"}
              required={"Please upload an identity document"}

            />
          </div> 
          <div className={styles.datarow}>
            <label>Gallary Photos </label>
            <FileUploadBox
              control={control}
              name={"galleryPhotos"}
              initialImages={userDetails.gallery_photos}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <input type="submit" value={submitLabel}/>
      </div>
    </form>
  );

  
}
