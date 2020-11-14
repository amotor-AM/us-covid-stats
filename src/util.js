import React from 'react';
// import numeral from 'numeral';
import {Circle, Popup} from "react-leaflet";
import numeral from 'numeral';

const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 350,
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 400,
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 1000,
    },
  };

export const sortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
}
//     sortedData.sort((a, b) => {
//         if (a.cases > b.cases) {
//             return -1;
//         } else {
//             return 1;
//         }
//     });
//     return sortedData;
// };


//Draw Ciricles On Map with Popup ToolTips
export const showDataOnMap = (data, casesType="cases") => (
  data.map(state => (
    <Circle
        center ={[state.lat, state.lng]}
        color={casesTypeColors[casesType].hex}
        fillColor={casesTypeColors[casesType].hex}
        fillOpacity={0.6}
        radius={
            Math.sqrt(state[casesType]) * casesTypeColors[casesType].multiplier
       }
    > 
        <Popup>
         <div className="info__container">
           <div className="info__name">{state.state}</div>
           <div className="info__confirmed">Total Cases: {numeral(state.cases).format("0,0")}</div>
           <div className="info__recovered">Total Recovered: {numeral(state.recovered).format("0,0")}</div>
           <div className="info__deaths">Total Deaths: {numeral(state.deaths).format("0,0")}</div>
         </div>
        </Popup>
    </Circle>
  ))
)
    
export const prettyPrintStat = (stat) =>
stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const prettyPrintStatTwo = (stat) => 
stat ? `${numeral(stat).format("0.0a")}` : "0";
