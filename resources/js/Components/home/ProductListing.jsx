import React from "react";
import { Button } from "flowbite-react";
import { isAbsoluteUrl } from "@/helpers";

export default function ProductListing({
    products,
    setShowSaleModal,
    setCurrentProduct,
}) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price).replace('THB', '฿');
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6 p-6">
            {products.map((product) => (
                <div
                    key={product.id}
                    className="group cursor-pointer"
                    onClick={() => {
                        setCurrentProduct(product);
                        setShowSaleModal(true);
                    }}
                >
                    <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100">
                        <div className="relative aspect-square p-4 bg-gray-50">
                            <img
                                src={
                                    isAbsoluteUrl(product.image)
                                        ? product.image
                                        : `/images/products/${product.image}`
                                }
                                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                                alt={product.name}
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-gray-900 font-medium mb-2 line-clamp-2 min-h-[48px]">
                                {product.name}
                            </h3>
                            <div className="space-y-1">
                                {product.sale_price && product.sale_price < product.price && (
                                    <p className="text-sm text-gray-400 line-through">
                                        {formatPrice(product.price)}
                                    </p>
                                )}
                                <p className="text-xl font-semibold text-blue-600">
                                    {formatPrice(product.sale_price || product.price)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
