import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styles from './review-request.module.css';
import SupaBaseAdminAPI from '@/api/supabase-admin';
import CloudinaryUserAPI from '@/api/cloudinary-user';
import { Controller, useForm } from "react-hook-form";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';

export default function ReviewRequest() {
  const router = useRouter();
  const { userId } = router.query;
  const [request, setRequest] = useState({});
  const supabaseApi = new SupaBaseAdminAPI();
  const cloudinaryApi = new CloudinaryUserAPI();
  const { register, handleSubmit, control, reset } = useForm();

  useEffect(() => {
    if (request?.data) {
      reset({
        firstName: request.data.firstName,
        lastName: request.data.lastName,
        spouses: request.data.spouses,
        father: request.data.father,
        mother: request.data.mother
      });
    }
  }, [request, reset]);


  const [users, setUsers] = useState([])

  async function getSimpleUsers() {
    //TODO: Get users from the database with only first name and last name and DOB
    let usersData = await supabaseApi.getAllUsersBrief();

    
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

  useEffect(() => {
    const init = async () => {
      if (!users || users.length==0) {
        await getSimpleUsers();

      }
      if (userId) {
        await fetchRequestDetails();
      }
    };
    init();
  }, [userId, users]);

  const fetchRequestDetails = async () => {
      // TODO: Fetch request details from the database
      const userData = await supabaseApi.getUserRequestById(userId);
      if (!userData) {
        console.error('No user data found');
        return;
      }
      setRequest({
        id: userData.id || null,
        data: {
         
          existing_id: userData.existing_id || null,
          avatar: userData.avatar || null,
          firstName: userData.first_name || null,
          lastName: userData.last_name || null,
          arabicName: userData.arabic_name || null,
          birthday: userData.dob || null,
          gender: userData.gender || null,
          maritalStatus: userData.marital_status || null,
          emailAddress: userData.email || null,
          publicEmail: userData.public_email || false,
          gallaryPhotos: userData.gallery_photos || null,
          identityDocuments: userData.id_documents || null,
          spouses: userData.spouses ? users.filter((user) => userData.spouses.includes(user.id)) || null : null,
          father: userData.father ? users.find((user) => user.id === userData.father) || null : null,
          mother: userData.mother ? users.find((user) => user.id === userData.mother) || null : null,
          siblings: userData.siblings ? users.filter((user) => userData.siblings.includes(user.id)) || null : null,
          children: userData.children ? users.filter((user) => userData.children.includes(user.id)) || null : null
        },
        requestedAt: userData.date_created || new Date().toISOString(),
      });

  };

  async function deleteImageByUrl(url) {
    let imageName = url.split('/').pop();

        let baseName = imageName.split('.')[0];
    await cloudinaryApi.deleteImage(baseName);
  }

  async function deleteImagesByUrl(urls) {
    if (Array.isArray(urls) )
    {
      for (let i=0;i<urls.length;i++) {

        await deleteImageByUrl(urls[i]);
      }
    } else if (urls) {
      await deleteImageByUrl(urls);
    }
   
  }

  const handleApprove = async (formData) => {
    try {
      if (!request?.data) {
        console.error('No request data available');
        return;
      }

      let userResponse;
      const isUpdate = !!request.data.existing_id;
      const userId = isUpdate ? request.data.existing_id : null;

      // Format the base request with all fields
      const formattedRequest = {
        first_name: formData.firstName || null,
        last_name: formData.lastName || null,
        arabic_name: formData.arabicName || null,
        gender: request.data.gender || null,
        dob: request.data.birthday || null,
        marital_status: request.data.maritalStatus || null,
        avatar: request.data.avatar || null,
        gallery_photos: request.data.gallaryPhotos || null,
        email: request.data.publicEmail ? request.data.emailAddress || null : null,
        father: formData.father?.id || null,
        mother: formData.mother?.id || null,
        siblings: request.data.siblings?.length > 0 ? request.data.siblings.map(sibling => sibling.id) : null,
        children: request.data.children?.length > 0 ? request.data.children.map(child => child.id) : null,
        spouses: request.data.spouses?.length > 0 ? request.data.spouses.map(spouse => spouse.id) : null,
      };

      if (isUpdate) {
        // Get existing user data to compare changes
        const existingUser = await supabaseApi.getUserDetails(userId);
        if (!existingUser) {
          throw new Error('Existing user not found');
        }

        // Create update request with only changed fields
        const updateRequest = { id: userId };
        const fields = Object.keys(formattedRequest);
        
        for (const field of fields) {
          if (JSON.stringify(formattedRequest[field]) !== JSON.stringify(existingUser[field])) {
            updateRequest[field] = formattedRequest[field];
          }
        }

        userResponse = await supabaseApi.updateUser(updateRequest);
        
      } else {
        userResponse = await supabaseApi.createUser(formattedRequest);
        
      }

      // Update family members' relationships
      const finalUserId = isUpdate ? userId : userResponse.id;
      await updateFamilyRelationships(formattedRequest, finalUserId);
      await supabaseApi.deleteRequest(request.id);
    } catch (error) {
      console.error('Error approving request:', error);
      return;
    }
    await deleteImagesByUrl(request.data.identityDocuments)
    
    router.push('/admin/list-requests');
  };

  const updateFamilyRelationships = async (formattedRequest, newUserId) => {
    try {
      // Update spouse relationship (reciprocal)
      if (formattedRequest.spouses && formattedRequest.spouses.length > 0) {
        // First, get the current user's siblings array
        const currentUserDetails = await supabaseApi.getUserDetails(newUserId);
        const currentUserSpouses = new Set(currentUserDetails?.spouses || []);
        
        for (const spouseId of formattedRequest.spouses) {
          // Skip if trying to add self as sibling
          if (spouseId === newUserId) continue;
          
          const spouseDetails = await supabaseApi.getUserDetails(spouseId);
          if (spouseDetails && spouseDetails.id) {
            // Update spouseDetails's spouseDetails array
            const updatedSpouse = Array.from(new Set([...(spouseDetails.spouses || []), newUserId]));
            await supabaseApi.updateUser({
              id: spouseDetails.id,
              spouses: updatedSpouse
            });
            
            // Add this sibling to current user's siblings set
            currentUserSpouses.add(spouseId);
          }
        }

        // Update current user's siblings array
        await supabaseApi.updateUser({
          id: newUserId,
          spouses: Array.from(currentUserSpouses)
        });
      }

      // Update father's children array
      if (formattedRequest.father) {
        const fatherDetails = await supabaseApi.getUserDetails(formattedRequest.father);
        if (fatherDetails && fatherDetails.id) {
          const updatedChildren = Array.from(new Set([...(fatherDetails.children || []), newUserId]));
          await supabaseApi.updateUser({
            id: fatherDetails.id,
            children: updatedChildren
          });
        }
      }

      // Update mother's children array
      if (formattedRequest.mother) {
        const motherDetails = await supabaseApi.getUserDetails(formattedRequest.mother);
        if (motherDetails && motherDetails.id) {
          const updatedChildren = Array.from(new Set([...(motherDetails.children || []), newUserId]));
          await supabaseApi.updateUser({
            id: motherDetails.id,
            children: updatedChildren
          });
        }
      }

      // Update siblings' siblings array and ensure reciprocal relationships
      if (formattedRequest.siblings && formattedRequest.siblings.length > 0) {
        // First, get the current user's siblings array
        const currentUserDetails = await supabaseApi.getUserDetails(newUserId);
        const currentUserSiblings = new Set(currentUserDetails?.siblings || []);
        
        for (const siblingId of formattedRequest.siblings) {
          // Skip if trying to add self as sibling
          if (siblingId === newUserId) continue;
          
          const siblingDetails = await supabaseApi.getUserDetails(siblingId);
          if (siblingDetails && siblingDetails.id) {
            // Update sibling's siblings array
            const updatedSiblings = Array.from(new Set([...(siblingDetails.siblings || []), newUserId]));
            await supabaseApi.updateUser({
              id: siblingDetails.id,
              siblings: updatedSiblings
            });
            
            // Add this sibling to current user's siblings set
            currentUserSiblings.add(siblingId);
          }
        }

        // Update current user's siblings array
        await supabaseApi.updateUser({
          id: newUserId,
          siblings: Array.from(currentUserSiblings)
        });
      }
    } catch (error) {
      console.error('Error updating family relationships:', error);
      throw error; // Re-throw to be handled by the caller
    }
  };

  const handleDecline = async () => {
    try {
      if (!userId) {
        console.error('No user ID available');
        return;
      }
      
      // Update request status to rejected in the database
      await supabaseApi.deleteRequest(userId);
      await deleteImagesByUrl(request.data.identityDocuments)
      await deleteImagesByUrl(request.data.avatar)
      await deleteImagesByUrl(request.data.gallaryPhotos)

      
      router.push('/admin/list-requests');
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (!request) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit(handleApprove)} className={styles.container}>
      <div className={styles.header}>
        <h1>Review Request</h1>
        
        <div className={styles.date}>
          Requested on: {request?.requestedAt ? formatDate(request.requestedAt) : 'Not available'}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.profileSection}>
          {request?.data?.avatar? <div className={styles.avatarSection}>
            <img
              src={request.data.avatar}
              alt="Profile"
              className={styles.avatar}
            />
          </div>: null}

          <div className={styles.infoSection}>
            <div className={styles.infoGroup}>
              <h2>Personal Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <label>First Name</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    defaultValue={request?.data?.firstName || ''}
                    className={styles.editInput}
                  />
                </div>
                <div className={styles.infoItem}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    defaultValue={request?.data?.lastName || ''}
                    className={styles.editInput}
                  />
                </div>
                <div className={styles.infoItem}>
                  <label>Arabic Name</label>
                  <input
                    type="text"
                    {...register("arabicName")}
                    defaultValue={request?.data?.arabicName || ''}
                    className={styles.editInput}
                  />
                </div>
           
                <div className={styles.infoItem}>
                  <label>Date of Birth</label>
                  <div>{request?.data?.birthday ? formatDate(request.data.birthday) : 'Not provided'}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Gender</label>
                  <div>{request?.data?.gender ? (request.data.gender === 'M' ? 'Male' : 'Female') : 'Not provided'}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Marital Status</label>
                  <div>{request?.data?.maritalStatus || 'Not provided'}</div>
                </div>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <div>{request?.data?.emailAddress || 'Not provided'}</div>
                </div>
              </div>
            </div>

            <div className={styles.infoGroup}>
              <h2>Family Information</h2>
              <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
            <label>Spouses: </label>
            <Controller
              control={control}
              name="spouses"
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                value={value || []}
                onChange={(_event, item) => {
                    onChange(item);
                  }}
                  multiple
                  disablePortal
                  options={users}
                  getOptionLabel={(option) => 
                    `${option.data.firstName} ${option.data.lastName} (DOB: ${option.data.birthday})`
                  }                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Spouses" />}
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
                <div className={styles.infoItem}>
                  <label>Father</label>
                  <Controller
                    control={control}
                    name="father"
                    defaultValue={request?.data?.father || null}
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
                        renderInput={(params) => <TextField {...params} label="Father" />}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option.data.firstName}{" "}{option.data.lastName}{" "}{"DOB: "}{option.data.birthday}
                          </Box>
                        )}
                      />
                    )}
                  />
                </div>
                <div className={styles.infoItem}>
                  <label>Mother</label>
                  <Controller
                    control={control}
                    name="mother"
                    defaultValue={request?.data?.mother || null}
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
                        renderInput={(params) => <TextField {...params} label="Mother" />}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            {option.data.firstName}{" "}{option.data.lastName}{" "}{"DOB: "}{option.data.birthday}
                          </Box>
                        )}
                      />
                    )}
                  />
                </div>
                  {request?.data?.children && (
                  <div className={styles.infoItem}>
                    <label>Children</label>
                   {request.data.children.map((child) => {
                    return <div>{`${child.data.firstName || ''} ${child.data.lastName || ''}  ${child.data.birthday || ''}`}</div>
                   }) }
                  </div>
                )}
                  {request?.data?.siblings && (
                  <div className={styles.infoItem}>
                    <label>Siblings</label>
                   {request.data.siblings.map((sibling) => {
                    return <div>{`${sibling.data.firstName || ''} ${sibling.data.lastName || ''}  ${sibling.data.birthday || ''}`}</div>
                   }) }
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {request?.data?.identityDocuments?.length>0 && (
          <div className={styles.documentsSection}>
            <h2>Identity Documents</h2>
            {request.data.identityDocuments.map ((document) =>
            <div className={styles.documentImage}>
              <img
                src={document}
                alt="Identity Document"
              />
            </div>)}
          </div>
        )}

        {request?.data?.gallaryPhotos?.length > 0 && (
          <div className={styles.gallerySection}>
            <h2>Gallery Photos</h2>
            <div className={styles.gallery}>
              {request.data.gallaryPhotos.map((photo, index) => (
                <div key={index} className={styles.galleryItem}>
                  <img src={photo} alt={`Gallery photo ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={() => router.back()} className={styles.backButton}>
          Back
        </button>
        <div className={styles.actionButtons}>
          <button
            type="button"
            onClick={handleDecline}
            className={`${styles.button} ${styles.declineButton}`}
          >
            Decline
          </button>
          <button
            type="submit"
            className={`${styles.button} ${styles.approveButton}`}
          >
            Approve
          </button>
        </div>
      </div>
    </form>
  );
}
