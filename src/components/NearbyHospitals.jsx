import { useEffect, useState } from "react";
import HospitalList from "./HospitalList";

const NearbyHospitals = () => {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;
      setPosition([latitude, longitude]);

      const res = await fetch(
        `https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${longitude},${latitude},5000&apiKey=${
          import.meta.env.VITE_GEOAPIFY_KEY
        }`
      );
      const data = await res.json();

      const hospitalsWithDist = (data.features || []).map((h) => {
        const [lon, lat] = h.geometry.coordinates;
        return {
          ...h,
          distance: distanceKm(latitude, longitude, lat, lon),
        };
      });

      // Add user location as the first card
      const userCard = {
        properties: {
          name: "You are here",
          address_line1: "Your current location",
        },
        geometry: {
          coordinates: [longitude, latitude],
        },
        distance: 0,
      };

      setHospitals([userCard, ...hospitalsWithDist]);
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!position) return <p>Locating...</p>;

  return <HospitalList hospitals={hospitals} userPosition={position} />;
};

export default NearbyHospitals;
