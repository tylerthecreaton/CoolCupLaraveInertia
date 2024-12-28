import React from "react";
import { Button } from "flowbite-react";
import { isAbsoluteUrl } from "@/helpers";

export default function PromotionListing({ promotions }) {
    return (
        <div className="container px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-6 md:gap-8 lg:gap-10 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {promotions?.map((promotion) => (
                    <Button
                        key={promotion.id}
                        type="button"
                        className="p-0 h-auto aspect-[4/5] w-full transition-transform duration-300 hover:scale-105"
                        href={promotion.url}
                    >
                        <div className="flex overflow-hidden flex-col justify-between items-center w-full h-full bg-white rounded-lg shadow-md">
                            <div className="relative w-full bg-gray-100 aspect-square">
                                <img
                                    src={
                                        promotion.image ??
                                        "/images/defaults/default-promotion.jpg"
                                    }
                                    className="object-cover absolute inset-0 w-full h-full transition-opacity duration-300"
                                    alt={promotion.title}
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.src =
                                            "/images/defaults/default-promotion.jpg";
                                    }}
                                />
                                {promotion.is_new && (
                                    <div className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                                        ใหม่
                                    </div>
                                )}
                                {promotion.end_date && (
                                    <div className="absolute right-2 bottom-2 px-2 py-1 text-xs text-white bg-black bg-opacity-70 rounded-md">
                                        หมดเขต: {promotion.end_date}
                                    </div>
                                )}
                            </div>
                            <div className="p-4 w-full">
                                <h3 className="mb-2 text-lg font-semibold text-gray-800 line-clamp-2">
                                    {promotion.title}
                                </h3>
                                <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                                    {promotion.description}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-bold text-purple-600">
                                        {promotion.discount_text}
                                    </span>
                                    {promotion.original_price && (
                                        <span className="text-sm text-gray-400 line-through">
                                            ฿{promotion.original_price}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Button>
                ))}
                {promotions?.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-500">
                        ไม่พบโปรโมชั่นในหมวดหมู่นี้
                    </div>
                )}
            </div>
        </div>
    );
}
