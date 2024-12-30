import React from "react";
import { isAbsoluteUrl } from "@/helpers";

export default function PromotionListing({ promotions }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-6 2xl:grid-cols-6 gap-8 p-8">
            {promotions?.map((promotion) => (
                <div
                    key={promotion.id}
                    className="group cursor-pointer transform transition-all duration-300 hover:-translate-y-1"
                >
                    <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 h-full flex flex-col">
                        <div className="relative aspect-[4/3] overflow-hidden">
                            <img
                                src={
                                    isAbsoluteUrl(promotion.image)
                                        ? promotion.image
                                        : promotion.image ?? "/images/defaults/default-promotion.jpg"
                                }
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                alt={promotion.title}
                                onError={(e) => {
                                    e.target.src = "/images/defaults/default-promotion.jpg";
                                }}
                            />
                            {promotion.is_new && (
                                <div className="absolute top-4 left-4 px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg">
                                    ใหม่
                                </div>
                            )}
                            {promotion.end_date && (
                                <div className="absolute right-4 bottom-4 px-3 py-1.5 text-xs font-medium text-white bg-black bg-opacity-75 backdrop-blur-sm rounded-lg shadow-lg">
                                    หมดเขต: {new Intl.DateTimeFormat("th-TH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: false,
                                        timeZone: "Asia/Bangkok",
                                    }).format(new Date(promotion.end_date))}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                                {promotion.name}
                            </h3>
                            <p className="text-base text-gray-600 line-clamp-3 mb-4 flex-1">
                                {promotion.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            {promotions?.length === 0 && (
                <div className="col-span-full py-16 text-center">
                    <div className="inline-block p-6 bg-gray-50 rounded-2xl">
                        <p className="text-lg text-gray-500">
                            ไม่พบโปรโมชั่นในหมวดหมู่นี้
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
