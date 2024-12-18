import { useGlobalState } from "@/Store/state";
import { appActions } from "@/Store/state/appState";
import { Button } from "flowbite-react";

export default function CartComponent() {
    const { state, dispatch } = useGlobalState();
    const { items, total, totalItems, discount, finalTotal } = state.cart;
    const { isCartOpen } = state.app;

    const handleAddToCart = (product) => {
        dispatch(cartActions.addToCart(product));
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        dispatch(cartActions.updateQuantity(productId, newQuantity));
    };

    const handleApplyDiscount = (discountAmount) => {
        dispatch(cartActions.applyDiscount(discountAmount));
    };

    return (
        <div className="absolute top-0 right-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="flex flex-col items-center justify-center h-20 bg-blue-200">
                <h2 className="text-2xl font-bold text-gray-800">
                    ตะกร้าสินค้า
                </h2>
                <Button
                    onClick={() => {
                        dispatch(appActions.setCartOpen(false));
                    }}
                >
                    ปิด
                </Button>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
                {JSON.stringify(items)}
                <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center justify-between w-full px-2">
                        <span className="text-gray-600">ราคารวม:</span>
                        <span className="text-gray-800">{total} บาท</span>
                    </div>
                    <div className="flex items-center justify-between w-full px-2">
                        <span className="text-gray-600">จํานวนสินค้า:</span>
                        <span className="text-gray-800">{totalItems}</span>
                    </div>
                    <div className="flex items-center justify-between w-full px-2">
                        <span className="text-gray-600">ส่วนลด:</span>
                        <span className="text-gray-800">{discount} บาท</span>
                    </div>
                    <div className="flex items-center justify-between w-full px-2">
                        <span className="text-gray-600">ราคารวมสุทธิ:</span>
                        <span className="text-gray-800">{finalTotal} บาท</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
