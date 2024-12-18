import { useState } from "react";
import { Button, Select } from "@mantine/core";
export default function CartItemList() {
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("S");
    const [sweetness, setSweetness] = useState("0%");
    const [topping, setTopping] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    return (
        <ul className="divide-y divide-gray-200">
            <li className="flex items-center py-4">
                <div className="flex-1">
                    <div className="flex items-center">
                        <span className="text-lg font-medium">Quantity</span>
                        <Button
                            size="xs"
                            onClick={() => setQuantity(quantity - 1)}
                            className="ml-2"
                            disabled={quantity <= 1}
                        >
                            -
                        </Button>
                        <span className="mx-2">{quantity}</span>
                        <Button
                            size="xs"
                            onClick={() => setQuantity(quantity + 1)}
                            className="mr-2"
                        >
                            +
                        </Button>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center">
                        <span className="text-lg font-medium">Size</span>
                        <Select
                            value={size}
                            onChange={(e) => setSize(e.target.value)}
                            className="ml-2"
                        >
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                        </Select>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center">
                        <span className="text-lg font-medium">Sweetness</span>
                        <Select
                            value={sweetness}
                            onChange={(e) => setSweetness(e.target.value)}
                            className="ml-2"
                        >
                            <option value="0%">0%</option>
                            <option value="25%">25%</option>
                            <option value="50%">50%</option>
                            <option value="75%">75%</option>
                            <option value="100%">100%</option>
                        </Select>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center">
                        <span className="text-lg font-medium">Topping</span>
                        <Select
                            value={topping}
                            onChange={(e) => setTopping(e.target.value)}
                            className="ml-2"
                        >
                            <option value="">None</option>
                            <option value="ไข่มุก">ไข่มุก</option>
                            <option value="ฟองนม">ฟองนม</option>
                        </Select>
                    </div>
                </div>
                <div className="flex-1 text-right">
                    <span className="text-lg font-medium">
                        {totalPrice} บาท
                    </span>
                </div>
            </li>
        </ul>
    );
}
