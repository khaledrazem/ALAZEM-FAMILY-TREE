
import CloudinaryUserAPI from '@/api/cloudinary-user';
import SupaBaseUserAPI from '@/api/supabase-user';
import UserFields from '@/component/user-fields';
import { useRouter } from 'next/router';
import styles from './request-new.module.css';



export default function UserPage() {
  const router = useRouter()
  const supabaseApi = new SupaBaseUserAPI();
  const cloudinaryApi = new CloudinaryUserAPI();

  async function onSubmit(data) {
    console.log(data);

    let requestdata = {
      "first_name": data.firstName ? data.firstName : null,
      "last_name": data.lastName ? data.lastName : null,
      "gender": data.gender ? data.gender : null,
      "dob" : data.dob ? data.dob : null,
      "marital_status": data.maritalStatus ? data.maritalStatus : null,
      "avatar": data.avatar ? await uploadImage( data.avatar[0]) : null,
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
      "is_editing": false,
      "existing_id": null,
    } 
    await supabaseApi.createUserRequest(
      requestdata
    );

    router.push('/');
  }

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