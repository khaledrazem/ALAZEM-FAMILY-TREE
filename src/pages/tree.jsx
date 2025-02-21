import React, { useEffect, useRef } from "react";
import f3 from '../custome-modules/family-chart/dist/family-chart.js';
import { useRouter } from 'next/router'
import SupaBaseUserAPI from '@/api/supabase-user.js';

export default function FamilyTree() {
  const containerRef = useRef();
  const chartRef = useRef();
  const router = useRouter();

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
      cleanup(); // Clean up any existing chart

      if (!containerRef.current) return;



      let usersData = await supabaseApi.getAllUsers();
      // Function to get the ID of the oldest user
      const getOldestUserId = (users) => {
        if (!users || users.length === 0) return null;
        let oldestUser = users[0];
        users.forEach(user => {
          if (new Date(user.dob) < new Date(oldestUser.dob)) {
        oldestUser = user;
          }
        });
        return oldestUser.id;
      };

      const oldestUserId = "6f7d2e96-e957-4208-944d-9f37d57e19c1";
      
      
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
            "spouses": user.spouse ? [user.spouse]:null,
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
        const f3Chart = f3.createChart('#FamilyChart', data)
          .setTransitionTime(1000)
          .setCardXSpacing(450)
          .setCardYSpacing(450)
          .setOrientationVertical()
          .updateMainId(oldestUserId)
          .setSingleParentEmptyCard(false, {label: 'ADD'})
        const f3Card = f3Chart.setCard(f3.CardHtml)
          .setCardDisplay([["first name","last name"],["arabic name"],["birthday"]])
          .setCardDim({
          })
          .setStyle('custom')
          .setOnHoverPathToMain();
      
        f3Card.setOnCardClick((e, d) => {
          toUserPage(d.data.id);
        });
      
        f3Chart
          .updateTree({
            initial: true,
            method: 'fit'
          });
        
        // Store chart reference for cleanup
        chartRef.current = f3Chart;
      }
      
 
      create(usersData);
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

  return <div className="f3 f3-cont" id="FamilyChart" ref={containerRef}></div>;
}
