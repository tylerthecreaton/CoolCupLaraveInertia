import { useState } from "react";
import CategorySection from "./CategorySection";
import SaleModal from "./SaleModal";

export default function MainContent({ categories, products }) {
    const [showSaleModal, setShowSaleModal] = useState(false);
    return (
        <div>
            <CategorySection products={products} categories={categories} />

            <SaleModal
                show={showSaleModal}
                onClose={() => setShowSaleModal(false)}
            />
        </div>
    );
}
