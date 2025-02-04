
import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { useRouter } from 'next/router'



export default function UserPage() {
  const router = useRouter()

  const userID = router.query.id;
  const tempdata = data();
  const [siblings, setSiblings] = useState([]);
  const [parents, setParents] = useState([]);
  const [children, setChildren] = useState([]);
  const [spouses, setSpouses] = useState([]);


  useEffect(() => {
    if (userID) {
      console.log(userID);
      getSpouses();
      getSiblings();
      getParents();
      getChildren();
    }
  
  }, [userID]);


  function getSpouses() {
    //TODO: loop through data.rel.spouses and get data using each id
    const updatedSpouses = {
      "id": "0",
      "data": {
        "firstName": "Name",
        "lastName": "Surname",
        "birthday": 1970,
        "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg"
      }
    };
    setSpouses(prevSpouses => [...prevSpouses, updatedSpouses]);

  }

  function getSiblings() {
    //TODO: loop through data.rel.siblings and get data using each id
    const siblingsUpdate ={
      "id": "0",
      "data": {
        "firstName": "Name",
        "lastName": "Surname",
        "birthday": 1970,
        "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg"
      }
    };
    setSiblings(prevSiblings => [...prevSiblings, siblingsUpdate]);
  }

  function getParents() {
    //TODO: loop through data.rel.parents and get data using each id
    const parentsUpdate = {
      "id": "0",
      "data": {
        "firstName": "Name",
        "lastName": "Surname",
        "birthday": 1970,
        "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg"
      }
    };
    setParents(prevParents => [...prevParents, parentsUpdate]);
  }

  function getChildren() {
    //TODO: loop through data.rel.parents and get data using each id
    const children = {
      "id": "0",
      "data": {
        "firstName": "Name",
        "lastName": "Surname",
        "birthday": 1970,
        "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg"
      }
    };
    setChildren(prevChildren => [...prevChildren, children]);
  }

  return (


    <div className={styles.user}>
      <div className={styles.header}>

        <label>{tempdata.data.firstName} {" "} {tempdata.data.lastName}</label>
      </div>

      <div className={styles.userinfo}>
        <div className={styles.avatar}>
          <img src={tempdata.data.avatar} alt="avatar" />
        </div>

        <div className={styles.userdata}>
          <div className={styles.datarow}>
            <label>Date of birth: {tempdata.data.birthday}</label>
          </div>

          <div className={styles.datarow}>
            <label>Gender: {tempdata.data.gender == 'M' ? 'Male' : 'Female'}</label>
          </div>

          <div className={styles.datarow}>
            <label>Marital status: {tempdata.data.maritalStatus}</label>
          </div>

          <div className={styles.datarow}>
            <label>Spouse: {spouses && spouses.length > 0 ? spouses[0].data.firstName + " " + spouses[0].data.lastName : "N/A"}</label>
          </div>

          {siblings && siblings.length ?
            <div className={styles.datarow}>
              <label>Siblings: {siblings.map((sibling) => {
                <div>
                  <label>{sibling.data.firstName} {" "} {sibling.data.lastName}</label>
                </div>
              })}</label>
            </div>
            : null}

          {parents && parents.length ?
            <div className={styles.datarow}>
              <label>Parents: {parents.map((parent) => {
                <div>
                  <label>{parent.data.firstName} {" "} {parent.data.lastName}</label>
                </div>
              })}</label>
            </div>
            : null}

          {children && children.length ?
            <div className={styles.datarow}>
              <label>Children: {children.map((child) => {
                <div>
                  <label>{child.data.firstName} {" "} {child.data.lastName}</label>
                </div>
              })}</label>
            </div>
            : null}
        </div>
      </div>
      <div className={styles.buttons}>
        <button onClick={() => router.back()}>Back</button>
        <button onClick={() => router.push(`/user/edit-request/${userID}`)}>Request change</button>

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

