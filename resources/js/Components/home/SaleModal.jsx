import React, { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Button, Card, Checkbox } from "flowbite-react";
import { useGlobalState } from "@/Store/state";
import { cartActions } from "@/Store/state/cartState";
import { appActions } from "@/Store/state/appState";
import { isAbsoluteUrl } from "@/helpers";
import axios from "axios";

const ProductModal = ({ show, onClose, product }) => {
    const { state, dispatch } = useGlobalState();
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("S");
    const [sweetness, setSweetness] = useState("100%");
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [toppings, setToppings] = useState([]);

    const sizes = [
        { label: "S", price: 0, ml: "300ml" },
        { label: "M", price: 5, ml: "450ml" },
        { label: "L", price: 10, ml: "600ml" },
    ];

    const sweetnessLevels = ["0%", "25%", "50%", "75%", "100%"];

    useEffect(() => {
        if (show) {
            setQuantity(1);
            setSize("S");
            setSweetness("100%");
            setSelectedToppings([]);
            fetchToppings();
        }
    }, [show]);

    const fetchToppings = async () => {
        try {
            const response = await axios.get('/toppings');
            setToppings(response.data);
        } catch (error) {
            console.error('Error fetching toppings:', error);
        }
    };

    useEffect(() => {
        if (product) {
            const basePrice = parseFloat(product.sale_price || 0);
            const sizePrice = parseFloat(sizes.find((s) => s.label === size)?.price || 0);
            const toppingsPrice = selectedToppings.reduce((total, topping) => {
                const toppingItem = toppings.find((t) => t.id === topping);
                return total + parseFloat(toppingItem?.price || 0);
            }, 0);
            const pricePerItem = basePrice + sizePrice + toppingsPrice;
            setTotalPrice(pricePerItem * parseInt(quantity));
        }
    }, [product, quantity, size, selectedToppings, toppings]);

    const handleQuantityChange = (delta) => {
        const newQuantity = parseInt(quantity) + delta;
        if (newQuantity > 0) {
            setQuantity(newQuantity);
        }
    };

    const handleToppingToggle = (toppingId) => {
        setSelectedToppings((prev) => {
            if (prev.includes(toppingId)) {
                return prev.filter((t) => t !== toppingId);
            } else {
                return [...prev, toppingId];
            }
        });
    };

    const handleClose = () => {
        // Reset selections before closing
        setQuantity(1);
        setSize("S");
        setSweetness("100%");
        setSelectedToppings([]);
        onClose();
    };

    const handleAddToCart = () => {
        const selectedToppingItems = selectedToppings.map(toppingId => {
            const topping = toppings.find(t => t.id === toppingId);
            return {
                id: parseInt(topping.id),
                name: topping.name,
                price: parseFloat(topping.price)
            };
        });

        const item = {
            id: parseInt(product.id),
            name: product.name,
            quantity: parseInt(quantity),
            size: size,
            sweetness: sweetness,
            toppings: selectedToppingItems,
            price: parseFloat(totalPrice / parseInt(quantity)),
            total: parseFloat(totalPrice),
            image: product.image,
            categoryId: parseInt(product.category_id)
        };

        dispatch(cartActions.addToCart(item));
        dispatch(appActions.setCartOpen(true));
        onClose();
    };

    if (!show || !product) return null;

    return (
        <div className="flex fixed inset-0 z-50 justify-center items-center bg-black/50">
            <Card className="overflow-hidden w-full max-w-lg bg-white rounded-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <Button
                        color="gray"
                        size="sm"
                        onClick={handleClose}
                        className="!p-2"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex justify-center">
                        <img
                            src={`/images/products/${product.image}`}
                            alt={product.name}
                            className="object-cover w-40 h-40 rounded-lg"
                        />
                    </div>

                    <div className="flex justify-center items-center space-x-4">
                        <Button
                            color="light"
                            size="sm"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-xl font-semibold text-center">
                            {quantity}
                        </span>
                        <Button
                            color="light"
                            size="sm"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 99}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            ขนาด
                        </label>
                        <div className="flex gap-2 justify-between">
                            {sizes.map((sizeOption) => (
                                <Button
                                    key={sizeOption.label}
                                    color={
                                        size === sizeOption.label
                                            ? "blue"
                                            : "light"
                                    }
                                    className="flex-1"
                                    onClick={() => setSize(sizeOption.label)}
                                >
                                    <div className="text-center">
                                        <div>{sizeOption.label}</div>
                                        <div className="text-xs opacity-70">
                                            {sizeOption.ml}
                                        </div>
                                        <div className="text-xs">
                                            +฿{sizeOption.price}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            ความหวาน
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {sweetnessLevels.map((level) => (
                                <Button
                                    key={level}
                                    color={
                                        sweetness === level ? "blue" : "light"
                                    }
                                    onClick={() => setSweetness(level)}
                                    className="text-sm"
                                >
                                    {level}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            ท็อปปิ้ง (เลือกได้หลายอย่าง)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {toppings.map((toppingOption) => (
                                <label
                                    key={toppingOption.id}
                                    className="flex items-center p-2 space-x-2 rounded border cursor-pointer hover:bg-gray-50"
                                >
                                    <Checkbox
                                        checked={selectedToppings.includes(
                                            toppingOption.id
                                        )}
                                        onChange={() =>
                                            handleToppingToggle(
                                                toppingOption.id
                                            )
                                        }
                                    />
                                    <span>{toppingOption.name}</span>
                                    <span className="text-blue-600">
                                        +฿{toppingOption.price}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4 border-t">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">ราคารวม</span>
                        <span className="text-2xl font-bold">
                            ฿{totalPrice}
                        </span>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            color="gray"
                            onClick={handleClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button className="flex-1" onClick={handleAddToCart}>
                            Add to Order
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProductModal;
