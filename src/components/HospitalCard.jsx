import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const HospitalCard = ({
  hospital,
  userPosition,
  expanded,
  onExpand,
  hideOther,
}) => {
  const [lon, lat] = hospital.geometry.coordinates;

  if (hideOther) return null; // hide other cards when one is expanded

  const gUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

  return (
    <div className="border rounded-lg p-3 shadow-sm h-full">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={onExpand}
      >
        <div>
          <h3 className="font-semibold">
            {hospital.properties.name || "Unnamed hospital"}
          </h3>
          <p className="text-sm text-gray-600">
            {hospital.properties.address_line1 || "No address available"}
          </p>
          <p className="text-xs text-gray-500">
            {hospital.distance.toFixed(2)} km away
          </p>
          {hospital.properties.opening_hours && (
            <p className="text-xs text-green-600">
              {hospital.properties.opening_hours}
            </p>
          )}
          <a
            href={gUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline text-sm mt-2 inline-block"
          >
            Get directions
          </a>
        </div>
        <span className="text-blue-500">{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div className="mt-3">
          <MapContainer
            center={[lat, lon]}
            zoom={15}
            style={{ height: "200px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lon]}>
              <Popup>{hospital.properties.name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default HospitalCard;
