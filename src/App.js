import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
  Button
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat, prettyPrintStatTwo } from "./util";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import Image from "./Covid-19.png"

// For all numbers in brackets IE: (1), check the index found at the bottom of this page

// "https://disease.sh/v3/covid-19/states"


function App() {
  const [states, setStates] = useState([]); //(2)
  const [state, setState] = useState('countrywide');
  const [stateInfo, setStateInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 39.809860, lng: -98.555183 });
  const [mapZoom, setMapZoom] = useState(4.3);
  const [mapStates, setMapStates] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  // The data we are accessing from the API does not have any lat lng attached to it. So I created an array of 
  // objects so I can push data onto the mapped array
  var StateLatLng = [
    {Name: "Alabama", lat: 32.806671, lng: -86.791130},
    {Name: "Alaska", lat: 61.370716, lng: -152.404419},
    {Name: "Arizona", lat: 33.729759, lng: -111.431221},
    {Name: "Arkansas", lat: 34.969704, lng: -92.373123},
    {Name: "California", lat: 36.116203, lng: -119.681564},
    {Name: "Colorado", lat: 39.059811, lng: -105.311104},
    {Name: "Connecticut", lat: 41.597782, lng: -72.755371},
    {Name: "Delaware", lat: 39.318523, lng: -75.507141},
    {Name: "District Of Columbia", lat: 38.897438, lng: -77.026817},
    {Name: "Florida", lat: 27.766279, lng: -81.686783},
    {Name: "Georgia", lat: 33.040619, lng: -83.643074},
    {Name: "Hawaii", lat: 21.094318, lng: -157.498337},
    {Name: "Idaho", lat: 44.240459, lng: -114.478828},
    {Name: "Illinois", lat: 40.349457, lng: -88.986137},
    {Name: "Indiana", lat: 39.849426, lng: -86.258278},
    {Name: "Iowa", lat: 42.011539, lng: -93.210526},
    {Name: "Kansas", lat: 38.526600, lng: -96.726486},
    {Name: "Kentucky", lat: 37.668140, lng: -84.670067},
    {Name: "Louisiana", lat: 31.169546, lng: -91.867805},
    {Name: "Maine", lat: 44.693947, lng: -69.381927},
    {Name: "Maryland", lat: 39.063946, lng: -76.802101},
    {Name: "Massachusetts", lat: 42.230171, lng: -71.530106},
    {Name: "Michigan", lat: 43.326618, lng: -84.536095},
    {Name: "Minnesota", lat: 45.694454, lng: -93.900192},
    {Name: "Mississippi", lat: 32.741646, lng: -89.678696},
    {Name: "Missouri", lat: 38.456085, lng: -92.288368},
    {Name: "Montana", lat: 46.921925, lng: -110.454353},
    {Name: "Nebraska", lat: 41.125370, lng: -98.268082},
    {Name: "Nevada", lat: 38.313515, lng: -117.055374},
    {Name: "New Hampshire", lat: 43.452492, lng: -71.563896},
    {Name: "New Jersey", lat: 40.298904, lng: -74.521011},
    {Name: "New Mexico", lat: 34.840515, lng: -106.248482},
    {Name: "New York", lat: 42.165726, lng: -74.948051},
    {Name: "North Carolina", lat: 35.630066, lng: -79.806419},
    {Name: "North Dakota", lat: 47.528912, lng: -99.784012},
    {Name: "Ohio", lat: 40.388783, lng: -82.764915},
    {Name: "Oklahoma", lat: 35.565342, lng: -96.928917},
    {Name: "Oregon", lat: 44.572021, lng: -122.070938},
    {Name: "Pennsylvania", lat: 40.590752, lng: -77.209755},
    {Name: "Rhode Island", lat: 41.680893, lng: -71.511780},
    {Name: "South Carolina", lat: 33.856892, lng: -80.945007},
    {Name: "South Dakota", lat: 44.299782, lng: -99.438828},
    {Name: "Tennessee", lat: 35.747845, lng: -86.692345},
    {Name: "Texas", lat: 31.054487, lng: -97.563461},
    {Name: "Utah", lat: 40.150032, lng: -111.862434},
    {Name: "Vermont", lat: 44.045876, lng: -72.710686},
    {Name: "Virginia", lat: 37.769337, lng: -78.169968},
    {Name: "Washington", lat: 47.400902, lng: -121.490494},
    {Name: "West Virginia", lat: 38.491226, lng: -80.954453},
    {Name: "Wisconsin", lat: 44.268543, lng: -89.616508},
    {Name: "Wyoming", lat: 42.755966, lng: -107.302490}, 
    {Name: "Puerto Rico", lat: 18.283265, lng: -66.002737},
    {Name: "Guam", lat: 13.444304, lng: 144.793732},
    {Name: "United States Virgin Islands", lat: 17.72751, lng: -64.9307},
    {Name: "Northern Mariana Islands", lat: 14.96823, lng: 145.61998},
    {Name: "US Military", lat: 38.869256523, lng: -77.0535764524},
    {Name: "Veteran Affairs", lat: 38.897957, lng: -77.036560},
    {Name: "Federal Prisons", lat: 37.828125, lng: -122.422844},
    {Name: "Navajo Nation", lat: 36.075321, lng: -109.196930},
    {Name: "Grand Princess Ship", lat: 32.773419, lng: -438.824688},
    {Name: "Wuhan Repatriated", lat: 30.593088, lng: 114.305172},
    {Name: "Diamond Princess Ship", lat: 28.945669, lng: -440.012015},
    {Name: "American Samoa", lat: -14.306407, lng: -170.69619090000003}
  ]   


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries/USA?strict=true")
    .then((response) => response.json())
    .then((data) => {
      setStateInfo(data);
    });
  }, []);

  useEffect(() => { // (3)
  const getStatesData = async() => { // (4)
    await fetch ("https://disease.sh/v3/covid-19/states")
    .then((response) => response.json())
    .then((data) => {
      for(let o of data) {
        for(let p of StateLatLng){
          if (o.state === p.Name) {
            o.lat = p.lat;
            o.lng = p.lng;
          };
        };
      };
      const states = data.map((state) => ({
        name : state.state
      }));
      let sortedData = sortData(data);
      setMapStates(data);
      setTableData(sortedData);
      setStates(states);
    });
  };

  getStatesData();
}, []);

const changeStates = async (e) => {
  const newState = e.target.value;
  setState(newState);
  console.log(newState)

  let stateLat = 0;
  let stateLng = 0;
  
  StateLatLng.forEach((state) => {
   if (newState === state.Name)
  { 
    stateLng = state.lng;
    stateLat = state.lat;
    setMapZoom(5.4);
    setMapCenter([stateLat, stateLng]);
  }
  else if(newState === "countrywide"){
    setMapZoom(4.3);
    setMapCenter({ lat: 39.809860, lng: -98.555183 });
  }
})

  const url = newState ==="countrywide" 
  ? "https://disease.sh/v3/covid-19/countries/USA?strict=true" 
  : `https://disease.sh/v3/covid-19/states/${newState}`;

  await fetch(url) 
  .then((response) => response.json())
  .then((data) => {
    setState(newState);
    setStateInfo(data);
    console.log(`stateInfo${stateInfo}`)
  })
  
}

 
  return (
    <div className="app"> 
      <div className="app__left">
        <div className="app__header">
          <img className="logo" src={Image} alt="logo" />
          <FormControl className="app__dropdown"> {/* (1) */}
            <Select
              variant = "outlined"
              value = {state}
              onChange = {changeStates}
              >
                <MenuItem value="countrywide">Country Wide</MenuItem>
                {states.map((state) => (
                  <MenuItem value={state.name}>{state.name}</MenuItem>
                ))}
            </Select>

          </FormControl>
        </div>
        
        <div className="app__stats"> {/* (5) */}
        {/* infoBoxes */}
        <InfoBox isRed active={casesType === "cases"} onClick={e => setCasesType('cases')} title="Caronavirus Cases" cases={`${prettyPrintStat(stateInfo.todayCases)} Today`} total={`${prettyPrintStatTwo(stateInfo.cases)} Total Cases`}/>
        <InfoBox active={casesType === "recovered"} onClick={e => setCasesType('recovered')} className="infoBoxRecovered" title="Recovered" cases={`${prettyPrintStatTwo(stateInfo.recovered)} Total`} total={`${prettyPrintStatTwo(stateInfo.active)} Currently Sick`}/>
        <InfoBox isRed active={casesType === "deaths"} onClick={e => setCasesType('deaths')} title="Deaths" cases={`${prettyPrintStat(stateInfo.todayDeaths)} Today`} total={`${prettyPrintStatTwo(stateInfo.deaths)} Total Deaths`}/>
        </div>
        {/* Map */}
        <Map
        casesType={casesType}
          states={mapStates}
          center={mapCenter}
          zoom={mapZoom}
        /> 
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By State</h3>
          <p className="CardContent__p">Sorted By Case Count</p>
          {/* Table */}
          <Table states={tableData} />
                <h3 className="Table__h3">Country Wide New Cases</h3>  
          {/* Graph */}
          <LineGraph className="app_graph"/>  
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;

/* INDEX 
1. (BEM naming convention) - app that we are referring to and then the element (app__element)

2. (State) - State is a short term memory for React. Think of state as a variable for React.

3. (useEffect) = Runs a piece of code based on a given condition. useEffect takes a function and has a square bracket condition. If the condition is left blank 
the code inside the function will run once when the component loads and not again after. If we put a variable inside the condition the function will run once when 
the component loads and then run again every time the variable changes

4. (async / await) - component of asyncronous JS code. Essentially we are saying wait for specific data to be returned asyncronously with (async) and then run whatever 
we define with (await)

5. (props) - allows one component to be different than another one even if they are using the same component layout
*/