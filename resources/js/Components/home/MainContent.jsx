import { useState } from "react";
import CategorySection from "./CategorySection";
import ProductListing from "./ProductListing";
import SaleModal from "./SaleModal";

export default function MainContent({ categories }) {
    const [showSaleModal, setShowSaleModal] = useState(false);
    return (
        <div>
            <CategorySection categories={categories} />
            <ProductListing />
            <SaleModal
                show={showSaleModal}
                onClose={() => setShowSaleModal(false)}
            />
        </div>
    );
}
