import React from "react";
import { Button, Tooltip } from "flowbite-react";
import { isAbsoluteUrl } from "@/helpers";
import { XCircle, AlertCircle, PackageOpen } from "lucide-react";

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

    const isOutOfStock = (product) => {
        // เพิ่ม console.log เพื่อตรวจสอบข้อมูล
        console.log('Checking product:', product.name, {
            ingredients: product.ingredients,
            hasIngredients: product.ingredients && product.ingredients.length > 0
        });

        // ถ้าไม่มี product หรือไม่มี ingredients ให้ถือว่าสินค้าไม่หมด
        if (!product || !product.ingredients || product.ingredients.length === 0) {
            return false;
        }

        // ตรวจสอบว่ามีวัตถุดิบที่ไม่เพียงพอหรือไม่
        return product.ingredients.some(ingredient => {
            console.log('Checking ingredient:', ingredient.name, {
                quantity: ingredient.quantity,
                quantity_size_s: ingredient.quantity_size_s
            });

            // ถ้าไม่มีข้อมูลวัตถุดิบ ให้ข้ามการตรวจสอบ
            if (!ingredient || !ingredient.quantity) {
                return false;
            }

            // แปลงค่าเป็นตัวเลขเพื่อเปรียบเทียบ
            const remaining = Number(ingredient.quantity);

            // ถ้า quantity เป็น 0 หรือน้อยกว่า 0 ให้ถือว่าสินค้าหมด
            if (remaining <= 0) {
                console.log('Out of stock - no quantity remaining:', {
                    name: ingredient.name,
                    remaining
                });
                return true;
            }

            // ถ้ามี quantity_size_s ให้เช็คว่าพอสำหรับการทำเมนูหรือไม่
            if (ingredient.quantity_size_s) {
                const required = Number(ingredient.quantity_size_s);
                if (!isNaN(required) && remaining < required) {
                    console.log('Out of stock - insufficient quantity:', {
                        name: ingredient.name,
                        remaining,
                        required
                    });
                    return true;
                }
            }

            return false;
        });
    };

    const getIngredientStatus = (product) => {
        if (!product.ingredients || product.ingredients.length === 0) {
            return '';
        }

        return (
            <div className="min-w-[280px] max-w-sm bg-gray-900/95 rounded-lg shadow-xl border border-gray-700/50">
                {/* Header */}
                <div className="p-3 border-b border-gray-700/50">
                    <div className="flex items-center gap-2 text-red-300">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">วัตถุดิบไม่เพียงพอ</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2.5">
                    {product.ingredients.map((ingredient, index) => {
                        if (!ingredient) return null;
                        // แปลงค่าเป็นตัวเลขเพื่อเปรียบเทียบ
                        const remaining = parseFloat(ingredient.quantity) || 0;
                        const required = parseFloat(ingredient.quantity_size_s) || 0;
                        const isLow = remaining < required;

                        return (
                            <div key={index} className="flex items-start gap-2.5">
                                <div className="mt-0.5">
                                    <PackageOpen className={`w-4 h-4 ${isLow ? 'text-red-400' : 'text-green-400'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline justify-between gap-2">
                                        <span className="font-medium text-gray-200 truncate">
                                            {ingredient.name}
                                        </span>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            <span className={`${isLow ? 'text-red-300' : 'text-gray-400'} text-sm tabular-nums`}>
                                                {remaining.toFixed(2)} {ingredient.unit_name || ''}
                                            </span>
                                        </div>
                                    </div>
                                    {isLow && (
                                        <div className="mt-1">
                                            <span className="inline-flex items-center px-1.5 py-0.5 text-xs bg-red-500/20 text-red-300 rounded border border-red-500/30">
                                                ต้องการ {required.toFixed(2)} {ingredient.unit_name || ''}
                                            </span>
                                        </div>
                                    )}
                                    {/* Progress bar */}
                                    <div className="mt-1.5 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isLow ? 'bg-red-500/50' : 'bg-green-500/50'
                                            }`}
                                            style={{ width: `${Math.min(100, Math.round((remaining / required) * 100))}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:grid-cols-6 2xl:grid-cols-5 gap-4 p-6">
            {products.map((product) => {
                const outOfStock = isOutOfStock(product);
                console.log('Product status:', {
                    name: product.name,
                    outOfStock,
                    ingredients: product.ingredients
                });
                return (
                    <div
                        key={product.id}
                        className={`group ${outOfStock ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                        onClick={() => {
                            if (!outOfStock) {
                                setCurrentProduct(product);
                                setShowSaleModal(true);
                            }
                        }}
                    >
                        <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-100 relative">
                            <div className="relative aspect-square p-4 bg-gray-50">
                                <img
                                    src={
                                        isAbsoluteUrl(product.image)
                                            ? product.image
                                            : `/images/products/${product.image}`
                                    }
                                    className={`object-contain w-full h-full transition-transform duration-300 ${outOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
                                    alt={product.name}
                                />
                                {outOfStock && (
                                    <Tooltip
                                        content={getIngredientStatus(product)}
                                        placement="top"
                                        style="dark"
                                        animation="duration-300"
                                        className="!w-auto"
                                        trigger="hover"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-[2px]">
                                            <div className="flex flex-col items-center">
                                                <div className="relative">
                                                    <div className="absolute -inset-1 bg-red-500/20 rounded-full animate-ping"></div>
                                                    <XCircle className="w-12 h-12 text-red-500/90 drop-shadow-glow animate-pulse relative" />
                                                </div>
                                                <span className="text-white font-medium px-6 py-2.5 bg-red-500/80 backdrop-blur-sm rounded-full shadow-lg border border-red-400/30 mt-3">
                                                    สินค้าหมด
                                                </span>
                                            </div>
                                        </div>
                                    </Tooltip>
                                )}
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
                );
            })}
        </div>
    );
}
