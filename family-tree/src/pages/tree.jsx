
import React from "react";
import f3 from 'family-chart';  
import 'family-chart/styles/family-chart.css';
import { useRouter } from 'next/router'
import { redirect } from "next/dist/server/api-utils";

export default class FamilyTree extends React.Component {
  cont = React.createRef();



  componentDidMount() {
    if (!this.cont.current) return;
    const { router } = this.props;

    function toUserPage(id)   {
      console.log('id')
      console.log(id)
      console.log(router)
      if (!id) return;
      router.push("/user/profile/" + id);
    };

    
    create(data())

    function create(data) {
      const f3Chart = f3.createChart('#FamilyChart', data)
        .setTransitionTime(1000)
        .setCardXSpacing(250)
        .setCardYSpacing(150)
        .setOrientationVertical()
        .setSingleParentEmptyCard(true, {label: 'ADD'})
    
      const f3Card = f3Chart.setCard(f3.CardHtml)
        .setCardDisplay([["first name","last name"],["birthday"]])
        .setCardDim({})
        .setMiniTree(true)
        .setStyle('imageRect')
        .setOnHoverPathToMain()
    
      

      
      
      f3Card.setOnCardClick((e, d) => {
        console.log("clicked")
        console.log(d)
        console.log(e)
        toUserPage(d.data.id);
      })
    
    
      f3Chart.updateTree({initial: true})
    }
    
    function data() {
      return [
        {
          "id": "0",
          "rels": {
            "spouses": [
              "055a439f-d985-4128-aca8-24a2f0b9af7e"
            ]
          },
          "data": {
            "first name": "Name",
            "last name": "Surname",
            "birthday": 1970,
            "avatar": "https://static8.depositphotos.com/1009634/988/v/950/depositphotos_9883921-stock-illustration-no-user-profile-picture.jpg",
            "gender": "M"
          }
        },
        {
          "id": "055a439f-d985-4128-aca8-24a2f0b9af7e",
          "data": {
            "gender": "F",
            "first name": "surname ",
            "last name": "name",
            "birthday": "02/05/2000",
            "avatar": ""
          },
          "rels": {
            "spouses": [
              "0"
            ],
            "children": []
          }
        }
      ]
    }

  }

  render() {
    return <div className="f3 f3-cont" id="FamilyChart" ref={this.cont}></div>;
  }
}
