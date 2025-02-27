import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { useRouter } from 'next/router';
import SupaBaseUserAPI from '@/api/supabase-user.js';

export default function UserPage() {
  const router = useRouter();
  const userID = router.query.id;
  const [siblings, setSiblings] = useState([]);
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [spouses, setSpouses] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  const supabaseApi = new SupaBaseUserAPI();

  useEffect(() => {
    async function fetchData() {
      
      if (userID) {
        try {
          await getUserDetails();
          // Only fetch related data after user details are loaded
          
          
       
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    }
    fetchData();
  }, [userID]);

  useEffect( () => {
    async function fetchRelData() {
    try {
          if (userDetails?.rels) {
            await Promise.all([
              getSpouses(),
              getSiblings(),
              getParents(),
              getChildren()
            ]);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      fetchRelData();
    
  }, [userDetails]);



  function formatData(data) {
    if (!data ) return {};
    
    return  {
        id: data.id,
        data: {
          firstName: data.first_name,
          lastName: data.last_name,
          label: data.first_name + " " + data.last_name,
          gender: data.gender,
          birthday: data.dob,
          avatar: data.avatar || 'https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg',
          maritalStatus: data.marital_status,
          galleryPhotos: data.gallery_photos
        },
        rels: {
          father: data.father,
          mother: data.mother,
          spouses: data.spouse || [],
          children: data.children || [],
          siblings: data.siblings || []
        }
      }
    }
   
  

  async function getUserDetails() {
    let usersData = await supabaseApi.getUserDetails(userID);
    setUserDetails( formatData(usersData));
    

  }

  async function getSpouses() {
    if (!userDetails?.rels?.spouse) {
      return null;
    }
    //TODO: loop through data.rel.spouses and get data using each id
    let usersData = await supabaseApi.getUserDetails(userDetails.rels.spouses);
    setSpouses( formatData(usersData));
  }

  async function getSiblings() {
    if (!userDetails?.rels?.siblings || userDetails?.rels?.siblings.length==0) {
      return [];
    }
    // Initializing an empty array to hold the formatted user data
    let usersData = [];
  
    if (userDetails.rels.siblings) {
      // Using a for...of loop to iterate over each sibling
      for (const sibling of userDetails.rels.siblings) {
        // Await the result of the asynchronous API call
        let user = await supabaseApi.getUserDetails(sibling);
        // Format the user data and push it to the usersData array
        usersData.push(formatData(user));
      }
    }
    setSiblings( usersData); 
   }
  
   
  

  async function getParents() {
    let usersData = [];
    if (userDetails?.rels?.father) {
      let user = await supabaseApi.getUserDetails(userDetails.rels.father);
      usersData.push(formatData(user));
    }
    if (userDetails?.rels?.mother) {
      let user = await supabaseApi.getUserDetails(userDetails.rels.mother);
      usersData.push(formatData(user));
    }
  
    
    setParents(usersData);
  }

  async function getChildren() {
    if (!userDetails?.rels?.children || userDetails?.rels?.children.length==0) {
      return [];
    }
        // Initializing an empty array to hold the formatted user data
        let usersData = [];
  
        if (userDetails.rels.children) {
          // Using a for...of loop to iterate over each sibling
          for (const child of userDetails.rels.children) {
            // Await the result of the asynchronous API call
            let user = await supabaseApi.getUserDetails(child);
            
            // Format the user data and push it to the usersData array
            usersData.push(formatData(user));
          }
        }
        
        
    setChildren( usersData);
  }

  if (!userDetails?.data) {
    return <div className={styles.user}>Loading...</div>;
  }

  return (
    <div className={styles.user}>
      <div className={styles.header}>
        <label>
          {userDetails.data.firstName || ''} {userDetails.data.lastName || ''}
        </label>
      </div>

      <div className={styles.userinfo}>
        <div className={styles.avatar}>
          <img
            src={userDetails.data.avatar}
            alt={`${userDetails.data.firstName || 'User'}'s avatar`}
          />
        </div>

      

        <div className={styles.userdata}>

        <div className={styles.datarow}>
            <label>
              <span className={styles['label-title']}>Arabic Name:</span>
              {userDetails.data.arabicName ?
                (userDetails.data.arabicName ) :
                ' '}
            </label>
          </div>
          <div className={styles.datarow}>
            <label>
              <span className={styles['label-title']}>Date of birth:</span>
              {userDetails.data.birthday || 'N/A'}
            </label>
          </div>

          <div className={styles.datarow}>
            <label>
              <span className={styles['label-title']}>Gender:</span>
              {userDetails.data.gender ?
                (userDetails.data.gender === 'M' ? 'Male' : 'Female') :
                'N/A'}
            </label>
          </div>

          <div className={styles.datarow}>
            <label>
              <span className={styles['label-title']}>Marital status:</span>
              {userDetails.data.maritalStatus || 'N/A'}
            </label>
          </div>

          <div className={styles.datarow}>
            <label>
              <span className={styles['label-title']}>Spouse:</span>
              {spouses?.[0]?.data ?
                `${spouses[0].data.firstName || ''} ${spouses[0].data.lastName || ''}` :
                'N/A'}
            </label>
          </div>

          {siblings && siblings.length > 0 && (
            <div className={styles.datarow}>
              <label>
                <span className={styles['label-title']}>Siblings:</span>
                <div className={styles.relatives}>
                  {siblings.map((sibling) => (
                    <span key={sibling.id} className={styles.relative}>
                      {sibling.data.firstName} {sibling.data.lastName}
                    </span>
                  ))}
                </div>
              </label>
            </div>
          )}

          {parents && parents.length > 0 && (
            <div className={styles.datarow}>
              <label>
                <span className={styles['label-title']}>Parents:</span>
                <div className={styles.relatives}>
                  {parents.map((parent) => (
                    <span key={parent.id} className={styles.relative}>
                      {parent.data.firstName} {parent.data.lastName}
                    </span>
                  ))}
                </div>
              </label>
            </div>
          )}

          {children && children.length > 0 && (
            <div className={styles.datarow}>
              <label>
                <span className={styles['label-title']}>Children:</span>
                <div className={styles.relatives}>
                  {children.map((child) => (
                    <span key={child.id} className={styles.relative}>
                      {child.data.firstName} {child.data.lastName}
                    </span>
                  ))}
                </div>
              </label>
            </div>
          )}

        {userDetails?.data?.galleryPhotos?.length > 0 && (
          <div className={styles.gallerySection}>
            <h2>Gallery Photos</h2>
            <div className={styles.gallery}>
              {userDetails.data.galleryPhotos.map((photo, index) => (
                <div key={index} className={styles.galleryItem}>
                  <img src={photo} alt={`Gallery photo ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
      </div>

      <div className={styles.buttons}>
        <button onClick={() => router.back()}>Back</button>
        <button onClick={() => router.push(`/user/edit-request/${userID}`)}>
          Request change
        </button>
      </div>
    </div>
  );
}
