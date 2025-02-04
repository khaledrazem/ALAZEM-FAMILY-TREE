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

export default function UserFields({isEdit=false, isAdminPreview=false, userId=null, onSubmit, submitLabel="Submit"}) {
  const router = useRouter()
  const { register, handleSubmit, reset, getValues, control, watch } = useForm();

  const [users, setUsers] = useState([])
  const [initialGallaries, setInitialGallaries] = useState([])


  var userDetails = {};

  useEffect(() => { 
    console.log("UserFields");
    console.log(userId);
    console.log(isEdit);
  }, [userId]);

  function getSimpleUsers() {
    //TODO: Get users from the database with only first name and last name and DOB
    setUsers([{
      "id": "110",
      "data": {
        "firstName": "Name",
        "lastName": "Surname",
        "birthday": 1970,
      }
    },
    {
      "id": "1120",
      "data": {
        "firstName": "sName",
        "lastName": "tSurname",
        "birthday": 1940,
      }
    }]);
  }

  function getDisplayUserDetails() {
    //TODO: Get user details from the database using userId
    userDetails = {
      "data": {
        "avatar": "https://example.com/avatar.jpg",
        "firstName": "John",
        "lastName": "Doe",
        "birthday": "1990-05-15",
        "gender": "M",
        "maritalStatus": "Married",
        "emailAddress": "john.doe@example.com",
        "publicEmail": "johndoe.public@example.com",
        "gallaryPhotos": [
          "https://dummyimage.com/16:9x1080/",
          "https://dummyimage.com/16:9x720/"
        ],
        "siblings":[
          {
              "id": "110",
              "data": {
                  "firstName": "Name",
                  "lastName": "Surname",
                  "birthday": 1970
              }
          }
      ],
      "father": {
          "id": "110",
          "data": {
              "firstName": "Name",
              "lastName": "Surname",
              "birthday": 1970
          }
      },
      "mother": {
          "id": "110",
          "data": {
              "firstName": "Name",
              "lastName": "Surname",
              "birthday": 1970
          }
        },
      
      "spouse": {
        "id": "110",
        "data": {
            "firstName": "Name",
            "lastName": "Surname",
            "birthday": 1970
        }
      }
    },
      "rels": {
        "spouses": [
          {
            "ID": "055a439f-d985-4128-aca8-24a2f0b9af7e",
            "firstName": "Jane",
            "lastName": "Doe",
            "birthday": "1992-08-22"
          }
        ],
        "siblings": [
          {
            "id": "1120",
            "data": {
              "firstName": "sName",
              "lastName": "tSurname",
              "birthday": 1940,
            }
          }
        ],
        "parents": [
          {
            "ID": "055a439f-d985-4128-aca8-24a2f0b9af7e",
            "firstName": "Michael",
            "lastName": "Doe",
            "birthday": "1965-02-25"
          },
          {
            "ID": "055a439f-d985-4128-aca8-24a2f0b9af7e",
            "firstName": "Sarah",
            "lastName": "Doe",
            "birthday": "1967-07-30"
          }
        ],
        "children": [
          {
            "id": "1120",
            "data": {
              "firstName": "sName",
              "lastName": "tSurname",
              "birthday": 1940,
            }
          }
        ]
      }
    };
  }

  useEffect(() => {
    getSimpleUsers();
  
    console.log(userId);
    console.log(isEdit);
    if (isEdit && userId) {
      getDisplayUserDetails();
      reset({
        avatar: userDetails.data.avatar,
        firstName: userDetails.data.firstName,
        lastName: userDetails.data.lastName,
        dob: userDetails.data.birthday,
        gender: userDetails.data.gender,
        maritalStatus: userDetails.data.maritalStatus,
        emailAddress: userDetails.data.emailAddress,
        publicEmail: userDetails.data.publicEmail,
        gallaryPhotos: userDetails.data.gallaryPhotos,
        spouse: userDetails.data.spouse,
        siblings: userDetails.rels.siblings,
        father: userDetails.data.father,
        children: userDetails.rels.children,
      })
      setInitialGallaries(userDetails.data.gallaryPhotos);
    }
  }, [userId]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.userform}>
      <label>Keep in mind that all infomraiton provided here will be avaliable publicly (except for identity documents)</label>

      <div className={styles.userinfo}>
        <div className={styles.avatar}>
          <UploadImage register={register} 
           name={"profileicon"}
           height={296}
           width={285}
           text={"Profile Photo"}/>
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
              {...register("emailAddress", {
                required: "Please enter your email address.",
              })} 
            />
          </div>

          <div className={styles.datarow}>
            <label>Show email in public profile? </label>
            <input
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

          {!isEdit ? <div className={styles.datarow}>
            <label>Identity document (To verify your Identity we require an idenitity document that shows your full name and parents name, this image will be deleted as soon as the request is accepted/rejected ): </label>
            <FileUploadBox
              register={register}
              name={"identityDocument"}
            />
          </div> 
          : null}
          <div className={styles.datarow}>
            <label>Gallary Photos </label>
            <FileUploadBox
              register={register}
              name={"galleryPhotos"}
              initialImages={initialGallaries}
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
