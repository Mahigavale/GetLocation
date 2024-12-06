import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'; // Import the external CSS file

function Home() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [addressDetails, setAddressDetails] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [error, setError] = useState(null);

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          fetchAddressDetails(latitude, longitude);
          fetchNearbyPlaces(latitude, longitude);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const fetchAddressDetails = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );

      if (response.data && response.data.address) {
        const address = response.data.address;
        const locationData = {
          division: address.state_district || '',
          state: address.state || '',
          city: address.city || address.town || address.village || '',
          locality: address.neighbourhood || '',
          pincode: address.postcode || '',
        };

        setAddressDetails(locationData);
      } else {
        setError('Unable to fetch address details.');
      }
    } catch (error) {
      setError('Error fetching address details.');
    }
  };

  const fetchNearbyPlaces = async (latitude, longitude) => {
    try {
      const query = `
        [out:json];
        (
          node[amenity=hospital](around:1000, ${latitude}, ${longitude});
          node[amenity=police](around:1000, ${latitude}, ${longitude});
          node[emergency=police](around:1000, ${latitude}, ${longitude});
        );
        out body;
      `;
      
      const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      
      if (response.data && response.data.elements) {
        const hospitalList = response.data.elements.filter(element => element.tags.amenity === 'hospital');
        const policeList = response.data.elements.filter(element => element.tags.amenity === 'police' || element.tags.emergency === 'police');

        setHospitals(hospitalList);
        setPoliceStations(policeList);
      } else {
        setError('Unable to fetch nearby places.');
      }
    } catch (error) {
      setError('Error fetching nearby places.');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; 
    return distance.toFixed(2); 
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>In a new location?</h1>
        <h2>Unaware of address?</h2>
        <h3>We got you covered!</h3>
        <p>Click the button below to get your location details and nearby hospitals and police stations within  1 km radius, instantly!</p>
        <button className="fetch-button" onClick={fetchLocation}>Fetch Location Details</button>
      </div>

      {error && <p className="error-message">Error: {error}</p>}
      
      {location.latitude && location.longitude && (
        <>
          <div className="location-details">
            <h4>Current Location Details:</h4>
            <p><strong>Latitude:</strong> {location.latitude}</p>
            <p><strong>Longitude:</strong> {location.longitude}</p>
            {addressDetails && (
              <div className="address-details">
                <p><strong>State:</strong> {addressDetails.state}</p>
                <p><strong>City:</strong> {addressDetails.city}</p>
                <p><strong>Locality:</strong> {addressDetails.locality}</p>
                <p><strong>Division:</strong> {addressDetails.division}</p>
                <p><strong>Pincode:</strong> {addressDetails.pincode}</p>
              </div>
            )}
          </div>

          <div className="nearby-places">
            <h4>Nearby Hospitals:</h4>
            {hospitals.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th style={{color:'red'}}>Name</th>
                    <th style={{color:'red'}}>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {hospitals.map((hospital, index) => (
                    <tr key={index}>
                      <td style={{color:'green'}}><b>{hospital.tags.name || 'Unnamed Hospital'}</b></td>
                      <td style={{color:'green'}}><b>{calculateDistance(location.latitude, location.longitude, hospital.lat, hospital.lon)} km</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No nearby hospitals found.</p>
            )}
          </div>

          <div className="nearby-places">
            <h4>Nearby Police Stations:</h4>
            {policeStations.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th style={{color:'red'}}>Name</th>
                    <th style={{color:'red'}}>Distance (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {policeStations.map((station, index) => (
                    <tr key={index}>
                      <td style={{color:'green'}}><b>{station.tags.name || 'Unnamed Police Station'}</b></td>
                      <td style={{color:'green'}}><b>{calculateDistance(location.latitude, location.longitude, station.lat, station.lon)}</b> km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No nearby police stations found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
