import React, { useState, useEffect } from "react";
import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { Button } from "flowbite-react";
import { ShoppingCart } from "lucide-react";
import { usePage } from "@inertiajs/react";

export default function HeaderPanel() {
    const { state, dispatch } = useGlobalState();
    const { totalItems } = state.cart;
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const user = usePage().props.auth.user;

    useEffect(() => {
        setInterval(() => {
            setTime(new Date().toLocaleTimeString());
        }, 1000);
    }, []);

    return (
        <div
            className="flex relative z-50 justify-between bg-blue-300 transition-all duration-300 ease-in-out min-h-24"
            style={{ marginRight: state.app.isCartOpen ? '384px' : '0' }}
        >
            <div className="py-10 text-4xl font-bold text-black ms-8">
                โปรโมชั่น
            </div>
            <div className="flex items-center py-10 mr-8 space-x-6">
                <Button
                    color="light"
                    size="lg"
                    className="relative"
                    onClick={() => dispatch(appActions.setCartOpen(true))}
                >
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                        <span className="flex absolute -top-2 -right-2 justify-center items-center w-6 h-6 text-sm text-white bg-red-500 rounded-full">
                            {totalItems}
                        </span>
                    )}
                </Button>
                <div className="text-black">
                    <ul>
                        <li>ผู้ใช้ : {user.name}</li>
                        <li id="current-time">
                            เวลา : <span id="time">{time}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
