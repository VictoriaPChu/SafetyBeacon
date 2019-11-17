import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import * as parkData from "./data/skateboard-parks.json";
import mapStyles from "./mapStyles";
import * as locationsData from "./data/locations.json";

import fire from './fire';

function Map(props) {
  const [selectedPark, setSelectedPark] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedPark(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
		
      window.removeEventListener("keydown", listener);
    };
  }, []);

  return (
    <GoogleMap
      defaultZoom={10}
      defaultCenter={{ lat: 45.4211, lng: -75.6903 }}
      defaultOptions={{ styles: mapStyles }}
    >
	{props.people.map(loc => (
		<Marker
		key={JSON.parse(loc["text"])["properties"]["ID"]}
		position={{
			lat:JSON.parse(loc["text"])["geometry"]["coordinates"][1],
			lng:JSON.parse(loc["text"])["geometry"]["coordinates"][0]
		}}
          onClick={() => {
            setSelectedPark(loc);
          }}

            icon={{
              url: "/green.png",
              scaledSize: new window.google.maps.Size(25,45)
            }}
		/>
	))}
	{props.crs.map(loc => (
		<Marker
		key={JSON.parse(loc["text"])["properties"]["ID"]}
		position={{
			lat:JSON.parse(loc["text"])["geometry"]["coordinates"][1],
			lng:JSON.parse(loc["text"])["geometry"]["coordinates"][0]
		}}
	    onClick={() => {
            setSelectedPark(loc);
          }}
            icon={{
              url: "/red.png",
              scaledSize: new window.google.maps.Size(25,45)
            }}
	
		/>
	))}
	{props.type.map(loc => (
		<Marker
		key={JSON.parse(loc["text"])["properties"]["ID"]}
		position={{
			lat:JSON.parse(loc["text"])["geometry"]["coordinates"][1],
			lng:JSON.parse(loc["text"])["geometry"]["coordinates"][0]
		}}
	onClick={() => {
            setSelectedPark(loc);
          }}
            icon={{
              url: "/blue.png",
              scaledSize: new window.google.maps.Size(45,45)
            }}
		/>
	))}
	{props.responders.map(loc => (
		<Marker
		key={JSON.parse(loc["text"])["properties"]["ID"]}
		position={{
			lat:JSON.parse(loc["text"])["geometry"]["coordinates"][1].toString(),
			lng:JSON.parse(loc["text"])["geometry"]["coordinates"][0].toString()
		}}
onClick={() => {
            setSelectedPark(loc);
          }}
            icon={{
              url: "/black.png",
              scaledSize: new window.google.maps.Size(45,45)
            }}
		/>
	))}
	
	{

	props.safeloc.map(loc => (
		<Marker
			key={JSON.parse(loc["text"])["properties"]["ID"]}
			position={{
				lat:parseFloat(JSON.parse(loc["text"])["geometry"]["coordinates"][1]),
				lng:parseFloat(JSON.parse(loc["text"])["geometry"]["coordinates"][0])
			}}
onClick={() => {
            setSelectedPark(JSON.parse(loc["text"]));
          }}
            icon={{
              url: "/logo.png",
              scaledSize: new window.google.maps.Size(45,45)
            }}
		/>
	))}


      {selectedPark && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedPark(null);
          }}
          position={{
            lat: selectedPark.geometry.coordinates[1],
            lng: selectedPark.geometry.coordinates[0]
          }}
        >
          <div>
	    <h1>{typeof(props.safeloc)}</h1>
            <p>{selectedPark.geometry.coordinates[0]}</p>
            <p>{selectedPark.geometry.coordinates[1]}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {people: [], safe_areas: [], not_safe_areas: [], responders: [], extra: []};
	}
	componentWillMount(){


		//
		// reference to SAFE in firebase database
		//
		let safe_areas_ref = fire.database().ref('safeloc').orderByKey().limitToLast(100);
		safe_areas_ref.on('child_added', snapshot => {
		  /* Update React state  */
		  let safe_area = { text: JSON.stringify(snapshot.val()), id: snapshot.key };
		  this.setState({ safe_areas: [safe_area].concat(this.state.safe_areas) });
		})

		//
		// reference to RESPONDERS in firebase database
		//
		safe_areas_ref = fire.database().ref('responders').orderByKey().limitToLast(100);
		safe_areas_ref.on('child_added', snapshot => {
		  /* Update React state  */
		  let safe_area = { text: JSON.stringify(snapshot.val()), id: snapshot.key };
		  this.setState({ responders: [safe_area].concat(this.state.responders) });
		})


		//
		// reference to EXTRA in firebase database
		//
		safe_areas_ref = fire.database().ref('type').orderByKey().limitToLast(100);
		safe_areas_ref.on('child_added', snapshot => {
		  /* Update React state  */
		  let safe_area = { text: JSON.stringify(snapshot.val()), id: snapshot.key };
		  this.setState({ extra: [safe_area].concat(this.state.extra) });
		})


		//
		// reference to NOTSAGE in firebase database
		//
		let not_safe_areas_ref = fire.database().ref('crs').orderByKey().limitToLast(100);
		not_safe_areas_ref.on('child_added', snapshot => {
		  /* Update React state e */
		  let not_safe_area = { text: JSON.stringify(snapshot.val()), id: snapshot.key };
		  this.setState({ not_safe_areas: [not_safe_area].concat(this.state.not_safe_areas) });
		})

		//
		// reference to PEOPLE in firebase database
		//
		let people_ref = fire.database().ref('people').orderByKey().limitToLast(100);
		people_ref.on('child_added', snapshot => {
		  /* Update React state */
		  let person = { text: JSON.stringify(snapshot.val()), id: snapshot.key };
		  this.setState({ people: [person].concat(this.state.people) });
		})
  

  
  
	  }

	render() {
	return (
		<div>
			<h5> SAFETY BEACON</h5>
			<div style={{ margin: "8em", width: "80vw", height: "80vh" }}>
				<div>{JSON.stringify(this.state.safe_areas)}</div>
			<MapWrapped
				safeloc = {this.state.safe_areas}
				responders = {this.state.responders}
				type = {this.state.extra}
				crs = {this.state.not_safe_areas}
				people = {this.state.people}
				googleMapURL={'https://maps.googleapis.com/maps/api/js?v=3.exp6libraries=geometry,drawing,places&key=AIzaSyBGW1DRYbhOUcZjsxLUE-pOeVE_6KbFQ20'}
				loadingElement={<div style={{ height: `100%` }} />}
				containerElement={<div style={{ height: `100%` }} />}
				mapElement={<div style={{ height: `100%` }} />}
			/>
			</div>

		</div>
		
	);
}
}
