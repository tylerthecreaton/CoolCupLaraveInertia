import React, { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import { Button, Card } from "flowbite-react";
import { useGlobalState } from "@/Store/state";
import { cartActions } from "@/Store/state/cartState";
import { appActions } from "@/Store/state/appState";

const ProductModal = ({ show, onClose, product }) => {
    const { state, dispatch } = useGlobalState();
    const [quantity, setQuantity] = useState(1);
    const [size, setSize] = useState("S");
    const [sweetness, setSweetness] = useState("100%");
    const [topping, setTopping] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    const sizes = [
        { label: "S", price: 0, ml: "300ml" },
        { label: "M", price: 5, ml: "400ml" },
        { label: "L", price: 10, ml: "500ml" },
    ];

    const sweetnessLevels = ["0%", "25%", "50%", "75%", "100%"];

    const toppings = [
        { name: "ไข่มุก", price: 10 },
        { name: "ฟองนม", price: 15 },
    ];

    useEffect(() => {
        if (product) {
            const basePrice = parseFloat(product.sale_price || 0);
            const sizePrice = sizes.find((s) => s.label === size)?.price || 0;
            const toppingPrice =
                toppings.find((t) => t.name === topping)?.price || 0;
            setTotalPrice((basePrice + sizePrice + toppingPrice) * quantity);
        }
    }, [size, topping, quantity, product]);

    const handleQuantityChange = (delta) => {
        const newQuantity = quantity + delta;
        if (newQuantity >= 1 && newQuantity <= 99) {
            setQuantity(newQuantity);
        }
    };

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            name: product.name,
            image: product.image,
            price: totalPrice,
            quantity: quantity,
            size: size,
            sweetness: sweetness,
            topping: topping,
        };
        dispatch(cartActions.addToCart(cartItem));
        dispatch(appActions.setCartOpen(true));
        onClose();
    };

    if (!show || !product) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg bg-white rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold">{product.name}</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Product Image */}
                    <div className="flex justify-center">
                        <img
                            src={`/images/products/${product.image}`}
                            alt={product.name}
                            className="w-40 h-40 object-cover rounded-lg"
                        />
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-center space-x-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(-1)}
                            disabled={quantity <= 1}
                        >
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-xl font-semibold w-12 text-center">
                            {quantity}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(1)}
                            disabled={quantity >= 99}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Size Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Size
                        </label>
                        <div className="flex justify-between gap-2">
                            {sizes.map((sizeOption) => (
                                <Button
                                    key={sizeOption.label}
                                    variant={
                                        size === sizeOption.label
                                            ? "default"
                                            : "outline"
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

                    {/* Sweetness Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Sweetness Level
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {sweetnessLevels.map((level) => (
                                <Button
                                    key={level}
                                    variant={
                                        sweetness === level
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setSweetness(level)}
                                    className="text-sm"
                                >
                                    {level}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Toppings Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">
                            Toppings
                        </label>
                        <div className="flex gap-2">
                            {toppings.map((toppingOption) => (
                                <Button
                                    key={toppingOption.name}
                                    variant={
                                        topping === toppingOption.name
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() =>
                                        setTopping(
                                            topping === toppingOption.name
                                                ? null
                                                : toppingOption.name
                                        )
                                    }
                                    className="flex-1"
                                >
                                    <div className="text-center">
                                        <div>{toppingOption.name}</div>
                                        <div className="text-xs">
                                            +฿{toppingOption.price}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer with Total and Actions */}
                <div className="border-t p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold">
                            ฿{totalPrice}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
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
