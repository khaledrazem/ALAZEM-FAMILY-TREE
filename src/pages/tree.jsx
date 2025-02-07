import React, { useEffect, useRef } from "react";
import f3 from '../custome-modules/family-chart/dist/family-chart.js';
import { useRouter } from 'next/router'

export default function FamilyTree() {
  const containerRef = useRef();
  const chartRef = useRef();
  const router = useRouter();

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
    const initializeChart = () => {
      if (!containerRef.current) return;

      cleanup(); // Clean up any existing chart

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
                
        const f3Card = f3Chart.setCard(f3.CardHtml)
          .setCardDisplay([["first name","last name"],["birthDay"]])
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
      
 function data() {
          return [
              {
                  "id": "P1",
                  "data": {
                      "first name": "Reyad",
                      "last name": "Alazem",
                      "desc": "Father of the Alazem family",
                      "label": "Reyad Alazem",
                      "gender": "M",
                      "birthDay": 1971,
                      "avatar": "https://i.postimg.cc/TyV8CgRc/20240609-135001.jpg"
                  },
                  "rels": {
                      "father": "P3",
                      "mother": "P4",
                      "spouses": ["P2"],
                      "children": ["C1", "C2", "C3", "C4", "C5"]
                  }
              },
              {
                  "id": "P2",
                  "data": {
                      "first name": "Salma",
                      "last name": "Alazem",
                      "desc": "Mother of the Alazem family",
                      "label": "Salma Alazem",
                      "gender": "F",
                      "birthDay": 1976,
                      "avatar": "https://i.postimg.cc/JyVVNPWn/Clipped-image-20240104-204621.png"

                  },
                  "rels": {
                      "father": "P5",
                      "mother": "P6",
                      "spouses": ["P1"],
                      "children": ["C1", "C2", "C3", "C4", "C5"]
                  }
              },
             
              {
                  "id": "C1",
                  "data": {
                      "first name": "Khaled",
                      "last name": "Alazem",
                      "desc": "Eldest son",
                      "label": "Khaled Alazem",
                      "gender": "M",
                      "birthDay": 2000,
                      "avatar": "https://i.postimg.cc/WdJcqxCC/20250120-151848.jpg"

                  },
                  "rels": {
                      "father": "P1",
                      "mother": "P2"
                  }
              },
              {
                  "id": "C2",
                  "data": {
                      "first name": "Fatima",
                      "last name": "Alazem",
                      "desc": "Daughter",
                      "label": "Fatima Alazem",
                      "gender": "F",
                      "birthDay": 2005,
                      "avatar": "https://i.postimg.cc/mtnGDTX7/20241226-144505.jpg"

                  },
                  "rels": {
                      "father": "P1",
                      "mother": "P2"
                  }
              },
              {
                  "id": "C3",
                  "data": {
                      "first name": "Rama",
                      "last name": "Alazem",
                      "desc": "Daughter",
                      "label": "Rama Alazem",
                      "gender": "F",
                      "birthDay": 2007
                  },
                  "rels": {
                      "father": "P1",
                      "mother": "P2"
                  }
              },
              {
                  "id": "C4",
                  "data": {
                      "first name": "Leen",
                      "last name": "Alazem",
                      "desc": "Daughter",
                      "label": "Leen Alazem",
                      "gender": "F",
                      "birthDay": 2011
                  },
                  "rels": {
                      "father": "P1",
                      "mother": "P2"
                  }
              },
              {
                  "id": "C5",
                  "data": {
                      "first name": "Abdularahman",
                      "last name": "Alazem",
                      "desc": "Youngest son",
                      "label": "Abdularahman Alazem",
                      "gender": "M",
                      "birthDay": 2015
                  },
                  "rels": {
                      "father": "P1",
                      "mother": "P2"
                  }
              },
              {
                  "id": "P3",
                  "data": {
                      "first name": "Khaled",
                      "last name": "Alazem",
                      "desc": "Father of Reyad Alazazem",
                      "label": "Khaled Alazem",
                      "gender": "M",
                      "birthDay": 1953
                  },
                  "rels": {
                      "spouses": ["P4"],
                      "children": ["P1"]
                  }
              },
              {
                  "id": "P4",
                  "data": {
                      "first name": "Salma",
                      "last name": "Alazem",
                      "desc": "Mother of Reyad Alazazem",
                      "label": "Salma Alazem",
                      "gender": "F",
                      "birthDay": 1953
                  },
                  "rels": {
                      "spouses": ["P3"],
                      "children": ["P1"]
                  }
              },
              {
                "id": "P5",
                "data": {
                    "first name": "Mohammad Ali",
                    "last name": "Keylani",
                    "desc": "Father of Salma Alazem",
                    "label": "Mohammad Ali",
                    "gender": "M",
                    "birthDay": 1951
                },
                "rels": {
                    "spouses": ["P6"],
                    "children": ["P2"],
                    "father": null,
                    "mother": null
                }
            },
              {
                  "id": "P6",
                  "data": {
                      "first name": "Fatima",
                      "last name": "Keylani",
                      "desc": "Mother of Salma Alazem",
                      "label": "Fatima Keylani",
                      "gender": "F",
                      "birthDay": 1952
                  },
                  "rels": {
                      "spouses": ["P5"],
                      "children": ["P2"],
                      "father": null,
                      "mother": null
                  }
              },
           
          ];
      }
      ;
      

      create(data());
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
