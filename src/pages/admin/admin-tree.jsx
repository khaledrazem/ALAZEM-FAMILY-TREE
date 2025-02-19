import React, { useEffect, useRef } from "react";
import f3 from '../../custome-modules/family-chart/dist/family-chart.js';
import SupaBaseAdminAPI from "@/api/supabase-admin.js";
import { useRouter } from "next/router.js";

export default function FamilyTree() {
  const containerRef = useRef();
  const chartRef = useRef();
  const editTreeRef = useRef();
  const router = useRouter();

  const supabaseApi = new SupaBaseAdminAPI();
  let f3Chart=null

  // Function to get the ID of the oldest user
  function getOldestUserId(users) {
    if (!users || users.length === 0) return null;
    let oldestUser = users[0];
    users.forEach(user => {
      if (new Date(user.dob) < new Date(oldestUser.dob)) {
    oldestUser = user;
      }
    });
    return oldestUser.id;
  };

  // Initialize chart
  async function initializeChart() {
    if (!containerRef.current) return;




    let usersData = await supabaseApi.getAllUsers();
    const oldestUserId = getOldestUserId(usersData);

    console.log(usersData);
    usersData = usersData.map((user) => {
      return formatDataForChart(user)
    });

    function create(data) {
      f3Chart = f3.createChart('#FamilyChart', data)
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

      const f3EditTree = f3Chart.editTree()
        .fixed(true)


        .setFields(["first name", "last name", "arabic name", "birthday", "avatar"])
        .setEditFirst(false);

      f3EditTree.setEdit();
      f3EditTree.setOnChange((data) => {
        console.log("UPDATE")
          createUser(data);
        console.log(data)
        console.log(f3EditTree.history)
        console.log(f3EditTree.getStoreData())
        console.log(f3EditTree.getDataJson())
        
      });


      f3Card.setOnCardClick((e, d) => {
        f3EditTree.open(d);
        if (f3EditTree.isAddingRelative()) return;
        f3Card.onCardClickDefault(e, d);
      });

      f3Chart.updateTree({ initial: true });
      f3EditTree.open(f3Chart.getMainDatum());

      // Store references for cleanup
      chartRef.current = f3Chart;
      editTreeRef.current = f3EditTree;
    }



    console.log("INITT")
    console.log(usersData)
    create(usersData);
  };

  function cleanup() {
    if (chartRef.current && containerRef.current) {
      // Remove all event listeners and DOM elements
      containerRef.current.innerHTML = '';
      chartRef.current = null;
    }
  };


  async function createUser(data) {
    try {
      console.log("DATA")
      console.log(data)
      if (!data) {
        console.error('No request data available');
        return;
      }

      if (data.op_type == "DELETE") {
        // Get user details before deletion to remove relationships
        const userToDelete = await supabaseApi.getUserDetails(data.id);
        if (userToDelete) {
          await removeFamilyRelationships(userToDelete);
        }
        await supabaseApi.deleteUser(data.id);
        return;
      }

      let userResponse;
      const userId = data.op_type == "EDIT" ? data.id : null;

      // Format the base request with all fields
      const formattedRequest = formatDataForDatabase(data);

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
        console.log(updateRequest)

        userResponse = await supabaseApi.updateUser(updateRequest);
        console.log('Updated user:', userResponse);
      } else {
        userResponse = await supabaseApi.createUser(formattedRequest);
        console.log('Created user:', userResponse);
      }

      // Update family members' relationships
      const finalUserId = data.op_type == "EDIT" ? userId : userResponse.id;
      await updateFamilyRelationships(formattedRequest, finalUserId);
      let usersData = await supabaseApi.getAllUsers();
      usersData = usersData.map((user) => {
        return formatDataForChart(user)
      });
      f3Chart.updateData({main_id: getOldestUserId(usersData), ...usersData});
      router.reload()

    } catch (error) {
      console.error('Error approving request:', error);
      return;
    }

  };

  const removeFamilyRelationships = async (userDetails) => {
    try {
      // Remove from spouse's relationship
      if (userDetails.spouse) {
        const spouseDetails = await supabaseApi.getUserDetails(userDetails.spouse);
        if (spouseDetails) {
          await supabaseApi.updateUser({
            id: spouseDetails.id,
            spouse: null
          });
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
    try {
      // Update spouse relationship (reciprocal)
      if (formattedRequest.spouse) {
        const spouseDetails = await supabaseApi.getUserDetails(formattedRequest.spouse);
        if (spouseDetails && spouseDetails.id) {
          // Update spouse's spouse field
          await supabaseApi.updateUser({
            id: spouseDetails.id,
            spouse: newUserId
          });
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

  return <div className="f3 f3-cont" id="FamilyChart" ref={containerRef}></div>;
}
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
      "spouses": user.spouse ? [user.spouse] : null,
      "children": user.children ? user.children : null,
      "siblings": user.siblings ? user.siblings : null
    }
  };
}

function formatDataForDatabase(data) {
  return {
    "first_name": data.data["first name"] ? data.data["first name"] : null,
    "last_name": data.data["last name"] ? data.data["last name"] : null,
    "arabic_name": data.data["arabic name"] ? data.data["arabic name"] : null,

    "gender": data.data["gender"] ? data.data["gender"] : null,
    "dob": data.data["birthday"] ? data.data["birthday"] : null,
    "marital_status": data.rels.spouses ? "Married" : "Single",
    "avatar": data.data["avatar"] ? data.data["avatar"] : null,

    "spouse": data?.rels?.spouses ? data?.rels?.spouses[0] : null,
    "father": data.rels.father ? data.rels.father : null,
    "mother": data.rels.mother ? data.rels.mother : null,
    "siblings": data.rels.siblings && data.rels.siblings.length > 0 ? data.rels.siblings : null,
    "children": data.rels.children && data.rels.children.length > 0 ? data.rels.children : null,
  };
}

