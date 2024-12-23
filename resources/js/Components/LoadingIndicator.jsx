import React from "react";

export default function LoadingIndicator({
    loading = false,
    size = "xl",
    message = "กรุณารอสักครู่",
}) {
    const spinnerSizes = {
        sm: "h-3 w-3",
        md: "h-5 w-5",
        lg: "h-7 w-7",
        xl: "h-10 w-10",
    };

    return (
        <div
            className={`fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/50 ${
                loading ? "flex" : "hidden"
            }`}
        >
            <div className="flex flex-col items-center justify-center bg-white w-96 p-4 rounded-lg h-40">
                <p className="mb-4 text-gray-800 text-2xl">{message}</p>
                <div
                    className={`${spinnerSizes[size]} animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 text-blue-600`}
                    role="status"
                />
            </div>
        </div>
    );
}
