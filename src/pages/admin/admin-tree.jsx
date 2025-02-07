import React, { useEffect, useRef } from "react";
import f3 from '../../custome-modules/family-chart/dist/family-chart.js';

export default function FamilyTree() {
  const containerRef = useRef();
  const chartRef = useRef();
  const editTreeRef = useRef();

  useEffect(() => {
    // Cleanup function to destroy previous chart instance
    const cleanup = () => {
      if (chartRef.current && containerRef.current) {
        // Remove all event listeners and DOM elements
        containerRef.current.innerHTML = '';
        chartRef.current = null;
        editTreeRef.current = null;
      }
    };

    // Initialize chart
    const initializeChart = () => {
      if (!containerRef.current) return;

      cleanup(); // Clean up any existing chart

      function create(data) {
        const f3Chart = f3.createChart('#FamilyChart', data)
          .setTransitionTime(1000)
          .setCardXSpacing(450)
          .setCardYSpacing(450)
          .setOrientationVertical()
          .setSingleParentEmptyCard(true, {label: 'ADD'});
      
        const f3Card = f3Chart.setCard(f3.CardHtml)
          .setCardDisplay([["first name","last name"],["birthday"]])
          .setCardDim({})
          .setMiniTree(true)
          .setStyle('custom')
          .setOnHoverPathToMain();
      
        const f3EditTree = f3Chart.editTree()
          .fixed(true)
          .setFields(["first name","last name","birthday","avatar"])
          .setEditFirst(true);
        
        f3EditTree.setEdit();
        
        f3Card.setOnCardClick((e, d) => {
          f3EditTree.open(d);
          if (f3EditTree.isAddingRelative()) return;
          f3Card.onCardClickDefault(e, d);
        });
      
        f3Chart.updateTree({initial: true});
        f3EditTree.open(f3Chart.getMainDatum());
      
        // Store references for cleanup
        chartRef.current = f3Chart;
        editTreeRef.current = f3EditTree;
      }
      
      function data() {
        return [
          {
            "id": "0",
            "rels": {},
            "data": {
              "first name": "Name",
              "last name": "Surname",
              "birthday": 1970,
              "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
              "gender": "M"
            }
          }
        ];
      }

      create(data());
    };

    // Initialize chart when component mounts
    initializeChart();

    // Cleanup on unmount
    return cleanup;
  }, []); // Empty dependency array since we don't need to re-run on any dependencies

  return <div className="f3 f3-cont" id="FamilyChart" ref={containerRef}></div>;
}
