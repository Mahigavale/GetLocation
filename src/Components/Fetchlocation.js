import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to calculate the distance between two coordinates using the Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return distance.toFixed(2); // Returning distance rounded to 2 decimal places
};

const LocationDetails = () => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [addressDetails, setAddressDetails] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
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
  }, []);

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
        );
        out body;
      `;
      const response = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      
      if (response.data && response.data.elements) {
        const hospitalList = response.data.elements.filter(element => element.tags.amenity === 'hospital');
        const policeList = response.data.elements.filter(element => element.tags.amenity === 'police');

        setHospitals(hospitalList);
        setPoliceStations(policeList);
      } else {
        setError('Unable to fetch nearby places.');
      }
    } catch (error) {
      setError('Error fetching nearby places.');
    }
  };

  return (
    <div>
      {error ? (
        <p>Error: {error}</p>
      ) : location.latitude && location.longitude ? (
        <>
          <p>Your current coordinates are:</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>

          {addressDetails ? (
            <div>
              <h3>Current Address Details:</h3>
              <p>State: {addressDetails.state}</p>
              <p>City: {addressDetails.city}</p>
              <p>Locality: {addressDetails.locality}</p>
              <p>Division: {addressDetails.division}</p>
              <p>Pincode: {addressDetails.pincode}</p>
            </div>
          ) : (
            <p>Fetching address details...</p>
          )}

          <div>
            <h3>Nearby Hospitals:</h3>
            {hospitals.length > 0 ? (
              <ul>
                {hospitals.map((hospital, index) => (
                  <li key={index}>
                    {hospital.tags.name || 'Unnamed Hospital'} -{' '}
                    {calculateDistance(location.latitude, location.longitude, hospital.lat, hospital.lon)} km away
                  </li>
                ))}
              </ul>
            ) : (
              <p>No nearby hospitals found.</p>
            )}
          </div>

          <div>
            <h3>Nearby Police Stations:</h3>
            {policeStations.length > 0 ? (
              <ul>
                {policeStations.map((station, index) => (
                  <li key={index}>
                    {station.tags.name || 'Unnamed Police Station'} -{' '}
                    {calculateDistance(location.latitude, location.longitude, station.lat, station.lon)} km away
                  </li>
                ))}
              </ul>
            ) : (
              <p>No nearby police stations found.</p>
            )}
          </div>
        </>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
};

export default LocationDetails;
