import React, { useState, useEffect } from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
import * as parkData from "../data/skateboard-parks.json";
import mapStyles from "../mapStyles";
import * as locationsData from "../data/locations.json";


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
      defaultCenter={{ lat: 38.5052, lng: -122.4704 }}
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
			setSelectedPark(JSON.parse(loc["text"]));
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
            setSelectedPark(JSON.parse(loc["text"]));
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
		setSelectedPark(JSON.parse(loc["text"]));
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
			lat:JSON.parse(loc["text"])["geometry"]["coordinates"][1],
			lng:JSON.parse(loc["text"])["geometry"]["coordinates"][0]
		}}
onClick={() => {
	setSelectedPark(JSON.parse(loc["text"]));
          }}
            icon={{
              url: "/yellow.png",
              scaledSize: new window.google.maps.Size(45,45)
            }}
		/>
	))}
	
	{

	props.safeloc.map(loc => (
		<Marker
			key={JSON.parse(loc["text"])["properties"]["ID"]}
			position={{
				lat:JSON.parse(loc["text"])["geometry"]["coordinates"][1],
				lng:JSON.parse(loc["text"])["geometry"]["coordinates"][0]
			}}
onClick={() => {
            setSelectedPark(JSON.parse(loc["text"]));
          }}
            icon={{
			  url: "/white.png",
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
            <p>LATITUDE: {selectedPark.geometry.coordinates[0]}</p>
            <p>LONGITUDE: {selectedPark.geometry.coordinates[1]}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default Map;

