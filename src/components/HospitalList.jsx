import { useState } from "react";
import HospitalCard from "./HospitalCard";

const HospitalList = ({ hospitals, userPosition }) => {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-4 overflow-y-auto">
      {hospitals.length === 0 ? (
        <p>No hospitals found nearby.</p>
      ) : (
        <div className="space-y-4">
          {hospitals.map((h) => {
            const isExpanded = expandedId === h.properties.place_id;
            return (
              <HospitalCard
                key={h.properties.place_id}
                hospital={h}
                userPosition={userPosition}
                expanded={isExpanded}
                onExpand={() =>
                  setExpandedId(isExpanded ? null : h.properties.place_id)
                }
                hideOther={expandedId !== null && !isExpanded}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HospitalList;
