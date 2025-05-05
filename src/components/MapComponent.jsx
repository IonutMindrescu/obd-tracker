// src/MapComponent.jsx
import L from 'leaflet'; // Import Leaflet for custom marker icons
import 'leaflet/dist/leaflet.css'; // Leaflet CSS
import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'; // Use MapContainer instead of Map

// Import marker icon

const MapComponent = () => {
  return (
    <MapContainer
      center={[46.5166761, 19.2692762]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      {/* TileLayer is used to add map tiles */}
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapComponent;
