import { useState } from "react";
import { useGlobalState } from "@/Store/state";
import CategorySection from "./CategorySection";

export default function MainContent({ promotions, types }) {
    const { state } = useGlobalState();
    const [selectedType, setSelectedType] = useState(null);

    const handleTypeChange = (typeId) => {
        setSelectedType(typeId);
    };
    return (
        <div
            className="transition-all duration-300 ease-in-out"
            style={{ marginRight: state.app.isCartOpen ? "384px" : "0" }}
        >
            <CategorySection
                promotions={promotions}
                types={types}
                onTypeChange={handleTypeChange}
            />
        </div>
    );
}
