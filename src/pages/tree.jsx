import React, { useEffect, useRef, useState } from "react";
import f3 from '../custome-modules/family-chart/dist/family-chart.js';
import { useRouter } from 'next/router'
import SupaBaseUserAPI from '@/api/supabase-user.js';
import styles from '../styles/tree.module.css';

export default function FamilyTree() {
  const containerRef = useRef();
  const chartRef = useRef();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const supabaseApi = new SupaBaseUserAPI();

  useEffect(() => {
    // Cleanup function to destroy previous chart instance
    const cleanup = () => {
      if (chartRef.current && containerRef.current) {
        // Remove all event listeners and DOM elements
        containerRef.current.innerHTML = '';
        chartRef.current = null;
      }
    };
// Initialize chart
const initializeChart = async () => {
  setLoading(true); // Start loading
  cleanup(); // Clean up any existing chart

  if (!containerRef.current) {
    setLoading(false);
    return;
  }

  try {


      let usersData = await supabaseApi.getAllUsers();
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

      const oldestUserId ="6f7d2e96-e957-4208-944d-9f37d57e19c1"; //getOldestUserId(usersData); "6f7d2e96-e957-4208-944d-9f37d57e19c1";
      
      
      usersData = usersData.map((user) => {
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
        }
});



      function toUserPage(id) {
        if (!id) return;
        router.push("/user/profile/" + id);
      }

      
       function create(data) {
        
        const f3Chart =  f3.createChart('#FamilyChart', data)
        console.log("NEXT")

        f3Chart
        .setMaxDepth(3)
          .setTransitionTime(1000)
          .setCardXSpacing(450)
          .setCardYSpacing(450)
          .setOrientationVertical()
          .updateMainId(oldestUserId)
          .setSingleParentEmptyCard(false, {label: 'ADD'})
        
          console.log("NEXT1")

        const f3Card = f3Chart.setCard(f3.CardHtml)
          .setCardDisplay([["first name","last name"],["arabic name"],["birthday"]])
          .setCardDim({
          })
          .setMiniTree(true)

          .setStyle('custom')
          .setOnHoverPathToMain();
          console.log("NEXT2")

        f3Card.setOnCardClick((e, d) => {
          if (!d.data.main) return;
         toUserPage(d.data.id);
        });
        console.log("NEXT3")

        f3Chart
          .updateTree({
            initial: true,
            tree_position: 'main_to_middle',
            onComplete: onCompleteFunction
          });
          console.log("NEXT24")

        // Store chart reference for cleanup
        chartRef.current = f3Chart;
      }

      function onCompleteFunction(){
        console.log("ONCVO<P{LEte")
        setLoading( false)
      }
      
      console.log("CRETING");
      console.log(usersData.length);
      create(    new Map(usersData.map(d => [d.id, d])));
      } catch (error) {
        console.error("Error initializing chart:", error);
        setLoading(false); // Ensure loading is turned off even if there's an error
      }
    };

    // Initialize chart when component mounts or route changes
    initializeChart();

    // Add event listener for route changes
    router.events.on('routeChangeComplete', initializeChart);

    // Cleanup on unmount or before re-initialization
    return () => {
      cleanup();
      router.events.off('routeChangeComplete', initializeChart);
    };
  }, [router]); // Re-run effect if router changes

  return (
    <div className="f3 f3-cont" id="FamilyChart" ref={containerRef}>
      {loading && (
        <div className={styles.loading}>
          {/* The loading spinner is created by CSS ::after pseudo-element */}
        </div>
      )}
    </div>
  );
}
