import { useState } from "react";
import CategorySection from "./CategorySection";
import SaleModal from "./SaleModal";
import { useGlobalState } from "@/Store/state";

export default function MainContent({ categories, products }) {
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const { state } = useGlobalState();

    return (
        <div
            className="transition-all duration-300 ease-in-out"
            style={{ marginRight: state.app.isCartOpen ? '384px' : '0' }}
        >
            <CategorySection
                products={products}
                categories={categories}
                setShowSaleModal={setShowSaleModal}
                setCurrentProduct={setCurrentProduct}
            />

            <SaleModal
                show={showSaleModal}
                setShowSaleModal={setShowSaleModal}
                onClose={() => setShowSaleModal(false)}
                product={currentProduct}
            />
        </div>
    );
}
