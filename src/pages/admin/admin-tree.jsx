import React, { useEffect, useRef, useState } from "react";
import f3 from '../../custome-modules/family-chart/dist/family-chart.js';
import SupaBaseAdminAPI from "@/api/supabase-admin.js";
import { useRouter } from "next/router.js";
import CloudinaryUserAPI from '@/api/cloudinary-user';
import styles from '@/styles/tree.module.css';

export default function FamilyTree() {
  const containerRef = useRef();
  const chartRef = useRef();
  const editTreeRef = useRef();
  const router = useRouter();

  const supabaseApi = new SupaBaseAdminAPI();
  const cloudinaryApi = new CloudinaryUserAPI();
  const [loading, setLoading] = useState(false);


  let f3Chart=null

  // Function to get the ID of the oldest user
  function getOldestUserId(users) {
    if (!users || users.length === 0) return null;

    let oldestUser = null;
    users.forEach(user => {
        // Skip users with no dob or invalid dob
        if (!user.dob) return;

        // Initialize oldestUser if it's null and user has a valid dob
        if (!oldestUser) {
            oldestUser = user;
            return;
        }

        // Compare dates if dob is present
        if (new Date(user.dob) < new Date(oldestUser.dob)) {
            oldestUser = user;
        }
    });

    console.log(oldestUser);
    return oldestUser ? oldestUser.id : null;
};


  // Initialize chart
  async function initializeChart() {


    setLoading(true); // Start loading
  
    if (!containerRef.current) {
      setLoading(false);
      return;
    }
  

    let usersData = await supabaseApi.getAllUsers();
    const oldestUserId ="6f7d2e96-e957-4208-944d-9f37d57e19c1"; //getOldestUserId(usersData); "6f7d2e96-e957-4208-944d-9f37d57e19c1";

    
    usersData = usersData.map((user) => {
      return formatDataForChart(user)
    });

    function create(data) {
      f3Chart = f3.createChart('#FamilyChart', data)
      .setMaxDepth(3)

        .setTransitionTime(1000)
        .setCardXSpacing(450)
        .setCardYSpacing(450)

        .setOrientationVertical()
        .updateMainId(oldestUserId)

        .setSingleParentEmptyCard(false, { label: 'ADD' });

      const f3Card = f3Chart.setCard(f3.CardHtml)
        .setCardDisplay([["first name", "last name"],["arabic name",], ["birthday"]])
        .setCardDim({})
        .setMiniTree(true)
        .setStyle('custom')
        .setOnHoverPathToMain();
        f3Chart
        .updateTree({
          initial: true,
          tree_position: 'main_to_middle',
          onComplete: () => {
            let f3EditTree = createEditTree();
            f3Card.setOnCardClick((e, d) => {
              f3EditTree.open(d);
        
              if (f3EditTree.isAddingRelative()) return;
              f3Card.onCardClickDefault(e, d);
            });
        
            f3Chart
            .updateTree({
              initial: true,
              tree_position: 'main_to_middle',
              onComplete: onCompleteFunction
            });        f3EditTree.open(f3Chart.getMainDatum());
    
          // Store references for cleanup
          chartRef.current = f3Chart;
          editTreeRef.current = f3EditTree;
          }
        });
      

       
    }

    function createEditTree() {
      const f3EditTree = f3Chart.editTree()
      .fixed(true)
      .setFields(["first name", "last name", "arabic name", "birthday", "avatar",{id: "avatar image", label: "avatar image", type: "image"}])
      .setEditFirst(false);

    f3EditTree.setEdit();
    f3EditTree.setOnChange((data) => {    
        createUser(data);
    });

    return f3EditTree;
    }



    function onCompleteFunction(){
      console.log("ONCVO<P{LEte")
      setLoading( false)
    }
    
    create( new Map(usersData.map(d => [d.id, d]))
  );
  };

  function cleanup() {
    if (chartRef.current && containerRef.current) {
      // Remove all event listeners and DOM elements
      containerRef.current.innerHTML = '';
      chartRef.current = null;
    }
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

  async function createUser(data) {
    try {
      
      if (!data) {
        console.error('No request data available');
        return;
      }

      if (data.op_type == "DELETE") {
        // Get user details before deletion to remove relationships
        const userToDelete = await supabaseApi.getUserDetails(data.id);
        if (userToDelete) {
          await removeFamilyRelationships(userToDelete);
          await deleteImagesByUrl(userToDelete.identityDocuments)
          await deleteImagesByUrl(userToDelete.avatar)
          await deleteImagesByUrl(userToDelete.gallaryPhotos)
                }
        await supabaseApi.deleteUser(data.id);
        return;
      }

      let userResponse;
      const userId = data.op_type == "EDIT" ? data.id : null;

      // Format the base request with all fields
      const formattedRequest = await formatDataForDatabase(data);

      if (data.op_type == "EDIT") {
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
      const finalUserId = data.op_type == "EDIT" ? userId : userResponse.id;
      await updateFamilyRelationships(formattedRequest, finalUserId);
      let usersData = await supabaseApi.getAllUsers();
      usersData = usersData.map((user) => {
        return formatDataForChart(user)
      });
      f3Chart.updateData({main_id: getOldestUserId(usersData), ...usersData});
      router.reload();

    } catch (error) {
      console.error('Error approving request:', error);
      return;
    }

  };

  const removeFamilyRelationships = async (userDetails) => {
    try {
      // Remove from spouse's relationship
      if (userDetails.spouses && userDetails.spouses.length > 0) {
        for (const spouseId of userDetails.spouses) {
          const spouseDetails = await supabaseApi.getUserDetails(spouseId);
          if (spouseDetails && spouseDetails.spouses) {
            const updatedSpouses = spouseDetails.spouses.filter(id => id !== userDetails.id);
            await supabaseApi.updateUser({
              id: spouseId,
              spouses: updatedSpouses
            });
          }
        }
      }

      // Remove from father's children array
      if (userDetails.father) {
        const fatherDetails = await supabaseApi.getUserDetails(userDetails.father);
        if (fatherDetails && fatherDetails.children) {
          const updatedChildren = fatherDetails.children.filter(id => id !== userDetails.id);
          await supabaseApi.updateUser({
            id: fatherDetails.id,
            children: updatedChildren
          });
        }
      }

      // Remove from mother's children array
      if (userDetails.mother) {
        const motherDetails = await supabaseApi.getUserDetails(userDetails.mother);
        if (motherDetails && motherDetails.children) {
          const updatedChildren = motherDetails.children.filter(id => id !== userDetails.id);
          await supabaseApi.updateUser({
            id: motherDetails.id,
            children: updatedChildren
          });
        }
      }

      // Remove from siblings' siblings arrays
      if (userDetails.siblings && userDetails.siblings.length > 0) {
        for (const siblingId of userDetails.siblings) {
          const siblingDetails = await supabaseApi.getUserDetails(siblingId);
          if (siblingDetails && siblingDetails.siblings) {
            const updatedSiblings = siblingDetails.siblings.filter(id => id !== userDetails.id);
            await supabaseApi.updateUser({
              id: siblingId,
              siblings: updatedSiblings
            });
          }
        }
      }

      // Remove from children's parent fields
      if (userDetails.children && userDetails.children.length > 0) {
        for (const childId of userDetails.children) {
          const childDetails = await supabaseApi.getUserDetails(childId);
          if (childDetails) {
            const updateData = {
              id: childId
            };
            if (childDetails.father === userDetails.id) {
              updateData.father = null;
            }
            if (childDetails.mother === userDetails.id) {
              updateData.mother = null;
            }
            await supabaseApi.updateUser(updateData);
          }
        }
      }
    } catch (error) {
      console.error('Error removing family relationships:', error);
      throw error;
    }
  };

  const updateFamilyRelationships = async (formattedRequest, newUserId) => {
    console.log(formattedRequest)
    try {
      // Update spouse relationship (reciprocal)
      if (formattedRequest.spouses && formattedRequest.spouses.length > 0) {

        for (const spouseId of formattedRequest.spouses) {
          // Skip if trying to add self as sibling
          if (spouseId === newUserId) continue;

          const spouseDetails = await supabaseApi.getUserDetails(spouseId);
          if (spouseDetails && spouseDetails.id) {
            // Update sibling's siblings array
            const updatedSpouses = Array.from(new Set([...(spouseDetails.spouses || []), newUserId]));
            await supabaseApi.updateUser({
              id: spouseDetails.id,
              spouses: updatedSpouses
            });

          }
        }


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

          }
        }


      }

      // Update spouse's children array and ensure reciprocal relationships
      if (formattedRequest.children && formattedRequest.children.length > 0) {

        for (const childId of formattedRequest.children) {
          // Skip if trying to add self as sibling
          if (childId === newUserId) continue;

          const childDetails = await supabaseApi.getUserDetails(childId);
          if (childDetails && childDetails.id) {
            // Update sibling's siblings array
            let updateData = {
              id: childDetails.id
            };
            
            if (formattedRequest.gender === "F") {
              updateData.mother = newUserId;
            } else if (formattedRequest.gender === "M") {
              updateData.father = newUserId;
            }
            
            await supabaseApi.updateUser(updateData);
          }
        }


      }
    } catch (error) {
      console.error('Error updating family relationships:', error);
      throw error; // Re-throw to be handled by the caller
    }
  };

  useEffect(() => {



    // Initialize chart when component mounts
    initializeChart();

    // Cleanup on unmount
    return cleanup;
  }, []); // Empty dependency array since we don't need to re-run on any dependencies


function formatDataForChart(user) {
  return {
    id: user.id,
    data: {
      "first name": user.first_name,
      "last name": user.last_name,
      "arabic name": user.arabic_name,
      "label": user.first_name + " " + user.last_name,
      "gender": user.gender,
      "birthday": user.dob,
      "avatar": user.avatar,
    },
    "rels": {
      "father": user.father,
      "mother": user.mother,
      "spouses": user.spouses ? user.spouses : null,
      "children": user.children ? user.children : null,
      "siblings": user.siblings ? user.siblings : null
    }
  };
}

async function formatDataForDatabase(data) {
  console.log(data.data)
  console.log(data.data["avatar image"])
  console.log(data.data["avatar image"]?.size)

  return {
    "first_name": data.data["first name"] ? data.data["first name"] : null,
    "last_name": data.data["last name"] ? data.data["last name"] : null,
    "arabic_name": data.data["arabic name"] ? data.data["arabic name"] : null,

    "gender": data.data["gender"] ? data.data["gender"] : null,
    "dob": data.data["birthday"] ? data.data["birthday"] : null,
    "marital_status": data.rels.spouses ? "Married" : "Single",
    "avatar": data.data["avatar image"]?.size>0 ? await uploadImage(data.data["avatar image"]) : data.data["avatar"]? data.data["avatar"] : null,

    "spouses": data?.rels?.spouses ? data?.rels?.spouses : null,
    "father": data.rels.father ? data.rels.father : null,
    "mother": data.rels.mother ? data.rels.mother : null,
    "siblings": data.rels.siblings && data.rels.siblings.length > 0 ? data.rels.siblings : null,
    "children": data.rels.children && data.rels.children.length > 0 ? data.rels.children : null,
  };

  async function uploadImage(image) {

    let response = await cloudinaryApi.uploadImage(image);
    return response;
  }
}

return <div className="f3 f3-cont" id="FamilyChart" ref={containerRef}>
{loading && (
        <div className={styles.loading}>
          {/* The loading spinner is created by CSS ::after pseudo-element */}
        </div>
      )}</div>;
}