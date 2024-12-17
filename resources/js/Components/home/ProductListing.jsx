import React from "react";
import { Button } from "flowbite-react";
export default function ProductListing() {
    return (
        <div className="grid grid-cols-5 gap-4 gap-y-5 p-5">
            <Button
                type="button"
                color="primary"
                onClick={() => setShowSaleModal(true)}
            >
                <div className="flex flex-col justify-between items-center py-5 w-52 h-72 border hover:bg-gray-100">
                    <img
                        src="/images/1687847225574.jpg"
                        className="w-full"
                        alt=""
                    />
                    <p>ชาเขียว</p>
                </div>
            </Button>

            <a href="#">
                <div className="flex flex-col justify-between items-center py-5 w-52 h-72 border hover:bg-gray-100">
                    <img
                        src="/images/BGW974YKFT5V0SLCY3FY5XAJHZ0AHU.jpg"
                        className="object-cover w-full max-h-48"
                        alt=""
                    />
                    <p>กาแฟ</p>
                </div>
            </a>
            <a href="#">
                <div className="flex flex-col justify-between items-center py-5 w-52 h-72 border hover:bg-gray-100">
                    <img
                        src="/images/JasmineTea.jpg"
                        className="w-full"
                        alt=""
                    />

                    <p>ชามะลิ</p>
                </div>
            </a>
        </div>
    );
}
