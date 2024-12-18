export const initialCartState = {
    items: [],
    total: 0,
    totalItems: 0,
    discount: 0,
    finalTotal: 0,
};

export const cartReducer = (state = initialCartState, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const existingItemIndex = state.items.findIndex(
                (item) => item.id === action.payload.id
            );

            let newItems;
            if (existingItemIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, quantity: 1 }];
            }

            const total = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            return {
                ...state,
                items: newItems,
                total,
                totalItems,
                finalTotal: total - state.discount,
            };
        }

        case "REMOVE_FROM_CART": {
            const newItems = state.items.filter(
                (item) => item.id !== action.payload
            );
            const total = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            return {
                ...state,
                items: newItems,
                total,
                totalItems,
                finalTotal: total - state.discount,
            };
        }

        case "UPDATE_QUANTITY": {
            const { id, quantity } = action.payload;
            const newItems = state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
            );

            const total = newItems.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + item.quantity,
                0
            );

            return {
                ...state,
                items: newItems,
                total,
                totalItems,
                finalTotal: total - state.discount,
            };
        }

        case "APPLY_DISCOUNT": {
            const discount = action.payload;
            return {
                ...state,
                discount,
                finalTotal: state.total - discount,
            };
        }

        case "CLEAR_CART":
            return initialCartState;

        default:
            return state;
    }
};

// Action Creators
export const cartActions = {
    addToCart: (cartItem) => ({
        type: "ADD_TO_CART",
        payload: cartItem,
    }),

    removeFromCart: (productId) => ({
        type: "REMOVE_FROM_CART",
        payload: productId,
    }),

    updateQuantity: (id, quantity) => ({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity },
    }),

    applyDiscount: (amount) => ({
        type: "APPLY_DISCOUNT",
        payload: amount,
    }),

    clearCart: () => ({
        type: "CLEAR_CART",
    }),
};
