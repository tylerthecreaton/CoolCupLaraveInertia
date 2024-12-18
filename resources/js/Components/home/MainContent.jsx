import { useState } from "react";
import CategorySection from "./CategorySection";
import SaleModal from "./SaleModal";

export default function MainContent({ categories, products }) {
    const [showSaleModal, setShowSaleModal] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [cart, setCart] = useState([]);

    return (
        <div>
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
