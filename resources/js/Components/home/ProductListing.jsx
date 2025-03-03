import React from "react";
import { Button, Tooltip } from "flowbite-react";
import { isAbsoluteUrl } from "@/helpers";
import { XCircle, AlertCircle, PackageOpen, Trophy } from "lucide-react";
import { useGlobalState } from "@/Store/state";

export default function ProductListing({
    products,
    setShowSaleModal,
    setCurrentProduct,
}) {
    const { state } = useGlobalState();
    const { isCartOpen } = state.app;

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
                    <div className="flex gap-2 items-center text-red-300">
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
                                    <div className="flex gap-2 justify-between items-baseline">
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

    // Dynamically adjust grid columns based on cart state
    const gridClasses = isCartOpen
        ? "grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 md:p-6"
        : "grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 p-2 sm:p-4 md:p-6";

    return (
        <div className={gridClasses}>
            {products.map((product, index) => {
                const outOfStock = isOutOfStock(product);
                console.log('Product status:', {
                    name: product.name,
                    outOfStock,
                    ingredients: product.ingredients
                });

                // สร้าง badge สำหรับ 3 อันดับแรก
                const getBestSellerBadge = () => {
                    if (index > 2) return null;

                    const badges = [
                        { text: "อันดับ 1", color: "bg-yellow-500", icon: "🏆" },
                        { text: "อันดับ 2", color: "bg-gray-400", icon: "🥈" },
                        { text: "อันดับ 3", color: "bg-amber-600", icon: "🥉" }
                    ];

                    return (
                        <div className={`absolute top-2 right-2 ${badges[index].color} text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full
                            shadow-lg border border-white/20 backdrop-blur-sm
                            animate-pulse-slow transform hover:scale-110 transition-transform duration-300
                            flex items-center gap-1 sm:gap-1.5 font-medium text-xs sm:text-sm z-10`}>
                            <span className="text-sm sm:text-lg">{badges[index].icon}</span>
                            <span className="hidden xs:inline">{badges[index].text}</span>
                        </div>
                    );
                };

                return (
                    <div
                        key={product.id}
                        className={`group ${outOfStock ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                        onClick={() => {
                            if (!outOfStock) {
                                setCurrentProduct(product);
                                setShowSaleModal(true);
                            }
                        }}
                    >
                        <div className="flex overflow-hidden relative flex-col h-full bg-white rounded-xl border border-gray-100 transition-all duration-300 hover:shadow-lg">
                            {/* เพิ่ม Best Seller Badge */}
                            {!outOfStock && getBestSellerBadge()}

                            <div className="relative p-2 bg-gray-50 aspect-square sm:p-4">
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
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="relative">
                                                <div className="absolute -inset-1 rounded-full animate-ping bg-red-500/30"></div>
                                                <XCircle className="relative w-8 h-8 animate-pulse sm:w-12 sm:h-12 text-red-500 drop-shadow-glow" />
                                            </div>
                                            <div
                                                onMouseEnter={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    const tooltipContent = document.createElement('div');
                                                    tooltipContent.className = 'fixed z-50 transform -translate-x-1/2 -translate-y-full';
                                                    tooltipContent.style.left = `${rect.left + rect.width / 2}px`;
                                                    tooltipContent.style.top = `${rect.top - 10}px`;

                                                    const ingredients = product.ingredients || [];
                                                    const ingredientsHtml = ingredients.map((ingredient, index) => {
                                                        if (!ingredient) return '';
                                                        const remaining = parseFloat(ingredient.quantity) || 0;
                                                        const required = parseFloat(ingredient.quantity_size_s) || 0;
                                                        const isLow = remaining < required;

                                                        return `
                                                            <div class="flex items-start gap-2.5">
                                                                <div class="mt-0.5">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 ${isLow ? 'text-red-400' : 'text-green-400'}">
                                                                        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                                                                        <path d="M16.5 9.4 7.55 4.24"></path>
                                                                        <polyline points="3.29 7 12 12 20.71 7"></polyline>
                                                                        <line x1="12" y1="22" x2="12" y2="12"></line>
                                                                    </svg>
                                                                </div>
                                                                <div class="flex-1 min-w-0">
                                                                    <div class="flex gap-2 justify-between items-baseline">
                                                                        <span class="font-medium text-gray-200 truncate">
                                                                            ${ingredient.name}
                                                                        </span>
                                                                        <div class="flex items-center gap-1.5 flex-shrink-0">
                                                                            <span class="${isLow ? 'text-red-300' : 'text-gray-400'} text-sm tabular-nums">
                                                                                ${remaining.toFixed(2)} ${ingredient.unit_name || ''}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    ${isLow ? `
                                                                        <div class="mt-1">
                                                                            <span class="inline-flex items-center px-1.5 py-0.5 text-xs bg-red-500/20 text-red-300 rounded border border-red-500/30">
                                                                                ต้องการ ${required.toFixed(2)} ${ingredient.unit_name || ''}
                                                                            </span>
                                                                        </div>
                                                                    ` : ''}
                                                                    <div class="mt-1.5 h-1 bg-gray-700/50 rounded-full overflow-hidden">
                                                                        <div
                                                                            class="h-full rounded-full transition-all duration-500 ${
                                                                                isLow ? 'bg-red-500/50' : 'bg-green-500/50'
                                                                            }"
                                                                            style="width: ${Math.min(100, Math.round((remaining / required) * 100))}%"
                                                                        ></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        `;
                                                    }).join('');

                                                    tooltipContent.innerHTML = `
                                                        <div class="min-w-[280px] max-w-sm bg-gray-900/95 rounded-lg shadow-xl border border-gray-700/50">
                                                            <div class="p-3 border-b border-gray-700/50">
                                                                <div class="flex gap-2 items-center text-red-300">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                                                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                                                        <line x1="12" y1="9" x2="12" y2="13"></line>
                                                                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                                                                    </svg>
                                                                    <span class="font-medium">วัตถุดิบไม่เพียงพอ</span>
                                                                </div>
                                                            </div>
                                                            <div class="p-3 space-y-2.5">
                                                                ${ingredientsHtml}
                                                            </div>
                                                        </div>
                                                        <div class="absolute w-3 h-3 bg-gray-900 rotate-45 -translate-x-1/2 left-1/2 -bottom-1.5"></div>
                                                    `;

                                                    document.body.appendChild(tooltipContent);

                                                    const handleMouseLeave = () => {
                                                        document.body.removeChild(tooltipContent);
                                                        e.currentTarget.removeEventListener('mouseleave', handleMouseLeave);
                                                    };

                                                    e.currentTarget.addEventListener('mouseleave', handleMouseLeave);
                                                }}
                                                className="cursor-help"
                                            >
                                                <span className="text-white text-xs sm:text-sm font-medium px-4 sm:px-6 py-2 sm:py-2.5 bg-red-500/90 backdrop-blur-sm rounded-full shadow-lg border border-red-400/50 mt-3 sm:mt-4 transition-all duration-300 hover:bg-red-500/95 hover:border-red-400/60">
                                                    สินค้าหมด
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 p-2 sm:p-3 md:p-4">
                                <h3 className="text-gray-900 text-sm sm:text-base font-medium mb-1 sm:mb-2 line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                                    {product.name}
                                </h3>
                                <div className="space-y-0.5 sm:space-y-1 mt-auto">
                                    {product.sale_price && product.sale_price < product.price && (
                                        <p className="text-xs text-gray-400 line-through sm:text-sm">
                                            {formatPrice(product.price)}
                                        </p>
                                    )}
                                    <p className="text-base font-semibold text-blue-600 sm:text-lg md:text-xl">
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
