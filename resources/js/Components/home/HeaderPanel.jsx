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
        <div className="flex justify-between bg-blue-300 min-h-24 relative z-50">
            <div className="py-10 text-4xl font-bold text-black ms-8">
                หน้าขาย
            </div>
            <div className="flex items-center space-x-6 py-10 mr-8">
                <Button
                    color="light"
                    size="lg"
                    className="relative"
                    onClick={() => dispatch(appActions.setCartOpen(true))}
                >
                    <ShoppingCart className="w-6 h-6" />
                    {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
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
