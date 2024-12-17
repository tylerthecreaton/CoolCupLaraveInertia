import React from "react";
import { Button } from "flowbite-react";
import { isAbsoluteUrl } from "@/helpers";
export default function ProductListing({ products, setShowSaleModal }) {
    return (
        <div className="grid grid-cols-5 gap-4 gap-y-5 p-5">
            {products.map((product) => (
                <Button
                    key={product.id}
                    type="button"
                    color="primary"
                    onClick={() => setShowSaleModal(true)}
                >
                    <div className="flex flex-col justify-between items-center py-5 w-52 h-72 border hover:bg-gray-100">
                        <img
                            src={
                                isAbsoluteUrl(product.image)
                                    ? product.image
                                    : `/images/products/${product.image}`
                            }
                            className="w-full"
                            alt=""
                        />
                        <p>{product.name}</p>
                    </div>
                </Button>
            ))}
        </div>
    );
}
