function isLocalStorageAvailable() {
    try {
        const testKey = "__test__";
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.warn("localStorage is not available:", e);
        return false;
    }
}

export const cartState = {
    key: 0,
    items: [],
    total: 0,
    totalItems: 0,
    discount: 0,
    finalTotal: 0,
    currentOrderNumber: 1,
};

const getItemKey = (item) => {
    if (!item.toppings && !item.sweetness) return item.id;
    return `${item.productId}_${item.toppings?.sort().join("_")}_${
        item.sweetness
    }`;
};

const getLasterKey = () => {
    const cartStateString = localStorage.getItem("cartState");
    return cartStateString ? JSON.parse(cartStateString).key : 0;
};

const getCartStateFromLocalStorage = () => {
    if (!isLocalStorageAvailable()) {
        return cartState;
    }

    try {
        const cartStateString = localStorage.getItem("cartState");
        if (!cartStateString) {
            return cartState;
        }
        const savedState = JSON.parse(cartStateString);
        
        // Ensure currentOrderNumber exists and is valid
        if (!savedState.currentOrderNumber || savedState.currentOrderNumber < 1) {
            savedState.currentOrderNumber = 1;
        }
        
        return savedState;
    } catch (error) {
        console.error("Error loading cart state:", error);
        return cartState;
    }
};

const saveCartStateToLocalStorage = (cartState) => {
    if (!isLocalStorageAvailable()) return;
    try {
        localStorage.setItem("cartState", JSON.stringify(cartState));
    } catch (error) {
        console.error("Error saving cart state:", error);
    }
};

export const initialCartState = getCartStateFromLocalStorage();

export const cartReducer = (state = initialCartState, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const newItemKey = getItemKey(action.payload);
            const existingItemIndex = state.items.findIndex(
                (item) => getItemKey(item) === newItemKey
            );

            let newItems;
            if (existingItemIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? {
                              ...item,
                              quantity:
                                  item.quantity +
                                  (action.payload.quantity || 1),
                          }
                        : item
                );
            } else {
                newItems = [
                    ...state.items,
                    {
                        ...action.payload,
                        quantity: action.payload.quantity || 1,
                    },
                ];
            }

            const total = newItems.reduce(
                (sum, item) =>
                    sum + (item.price > 0 ? item.price * item.quantity : 0),
                0
            );
            const discountFromItems = newItems.reduce(
                (sum, item) =>
                    sum +
                    (item.price < 0 ? Math.abs(item.price * item.quantity) : 0),
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.quantity : 0),
                0
            );

            const newState = {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            };

            saveCartStateToLocalStorage(newState);
            return newState;
        }

        case "REMOVE_FROM_CART": {
            const newItems = state.items.filter(
                (item) => item.id !== action.payload
            );

            const total = newItems.reduce(
                (sum, item) =>
                    sum + (item.price > 0 ? item.price * item.quantity : 0),
                0
            );
            const discountFromItems = newItems.reduce(
                (sum, item) =>
                    sum +
                    (item.price < 0 ? Math.abs(item.price * item.quantity) : 0),
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.quantity : 0),
                0
            );

            const newState = {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            };

            saveCartStateToLocalStorage(newState);
            return newState;
        }

        case "UPDATE_QUANTITY": {
            const { itemId, delta } = action.payload;
            const newItems = state.items
                .map((item) =>
                    item.id === itemId
                        ? { ...item, quantity: item.quantity + delta }
                        : item
                )
                .filter((item) => item.quantity > 0);

            const total = newItems.reduce(
                (sum, item) =>
                    sum + (item.price > 0 ? item.price * item.quantity : 0),
                0
            );
            const discountFromItems = newItems.reduce(
                (sum, item) =>
                    sum +
                    (item.price < 0 ? Math.abs(item.price * item.quantity) : 0),
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.quantity : 0),
                0
            );

            const newState = {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            };

            saveCartStateToLocalStorage(newState);
            return newState;
        }

        case "APPLY_DISCOUNT": {
            const discount = action.payload;
            const newState = {
                ...state,
                discount,
                finalTotal: state.total - discount,
            };
            saveCartStateToLocalStorage(newState);
            return newState;
        }

        case "SET_ORDER_NUMBER": {
            const newState = {
                ...state,
                currentOrderNumber: parseInt(action.payload) || 1
            };
            saveCartStateToLocalStorage(newState);
            return newState;
        }

        case "INCREMENT_ORDER_NUMBER": {
            const newState = {
                ...state,
                currentOrderNumber: (state.currentOrderNumber || 0) + 1
            };
            saveCartStateToLocalStorage(newState);
            return newState;
        }

        case "CLEAR_CART": {
            const clearedState = {
                ...cartState,
                currentOrderNumber: state.currentOrderNumber // Preserve order number when clearing cart
            };
            saveCartStateToLocalStorage(clearedState);
            return clearedState;
        }

        default:
            return state;
    }
};

export const cartActions = {
    addToCart: (cartItem) => ({
        type: "ADD_TO_CART",
        payload: cartItem,
    }),
    removeFromCart: (productId) => ({
        type: "REMOVE_FROM_CART",
        payload: productId,
    }),
    updateQuantity: ({ itemId, delta }) => ({
        type: "UPDATE_QUANTITY",
        payload: { itemId, delta },
    }),
    applyDiscount: (amount) => ({
        type: "APPLY_DISCOUNT",
        payload: amount,
    }),
    clearCart: () => ({
        type: "CLEAR_CART",
    }),
    incrementOrderNumber: () => ({
        type: "INCREMENT_ORDER_NUMBER",
    }),
    setOrderNumber: (number) => ({
        type: "SET_ORDER_NUMBER",
        payload: number,
    }),
};
