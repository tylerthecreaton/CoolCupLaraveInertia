export const cartState = {
    key: 0, // unique key
    items: [],
    total: 0,
    totalItems: 0,
    discount: 0,
    finalTotal: 0,
};

const getCartStateFromLocalStorage = () => {
    const cartStateString = localStorage.getItem("cartState");
    return cartStateString ? JSON.parse(cartStateString) : cartState;
};

const saveCartStateToLocalStorage = (cartState) => {
    localStorage.setItem("cartState", JSON.stringify(cartState));
};

const removeCartStateFromLocalStorageByKey = (key) => {
    const cartStateString = localStorage.getItem("cartState");
    if (cartStateString) {
        const cartState = JSON.parse(cartStateString);
        if (cartState.key === key) {
            localStorage.removeItem("cartState");
        }
    }
};

const updateCartStateFromLocalStorageByKey = (key, cartState) => {
    localStorage.setItem("cartState", JSON.stringify({ ...cartState, key }));
};

const clearCartStateFromLocalStorage = () => {
    localStorage.removeItem("cartState");
};

const getLasterKey = () => {
    const cartStateString = localStorage.getItem("cartState");
    return cartStateString ? JSON.parse(cartStateString).key : 0;
};

// Create a utility function to generate item key
const getItemKey = (item) => {
    if (!item.toppings && !item.sweetness) return item.id;
    return `${item.drinkId}_${item.toppings?.sort().join('_')}_${item.sweetness}`;
};

export const initialCartState = getCartStateFromLocalStorage();

export const cartReducer = (state = cartState, action) => {
    switch (action.type) {
        case "ADD_TO_CART": {
            const newItemKey = getItemKey(action.payload);
            
            // Find existing item with same combination
            const existingItemIndex = state.items.findIndex(item => 
                getItemKey(item) === newItemKey
            );

            let newItems;
            if (existingItemIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
                        : item
                );
            } else {
                newItems = [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
            }

            const total = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.price * item.quantity : 0),
                0
            );
            const discountFromItems = newItems.reduce(
                (sum, item) => sum + (item.price < 0 ? Math.abs(item.price * item.quantity) : 0),
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.quantity : 0),
                0
            );

            saveCartStateToLocalStorage({
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            });

            return {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            };
        }

        case "REMOVE_FROM_CART": {
            const itemToRemove = state.items.find(item => item.id === action.payload);
            const itemKey = getItemKey(itemToRemove);
            
            const newItems = state.items.filter(item => 
                getItemKey(item) !== itemKey || item.id !== action.payload
            );

            const total = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.price * item.quantity : 0),
                0
            );
            const discountFromItems = newItems.reduce(
                (sum, item) => sum + (item.price < 0 ? Math.abs(item.price * item.quantity) : 0),
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.quantity : 0),
                0
            );

            removeCartStateFromLocalStorageByKey(state.key);
            updateCartStateFromLocalStorageByKey(getLasterKey() + 1, {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            });

            return {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            };
        }

        case "UPDATE_QUANTITY": {
            const { id, quantity } = action.payload;
            const itemToUpdate = state.items.find(item => item.id === id);
            
            const newItems = state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
            );

            const total = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.price * item.quantity : 0),
                0
            );
            const discountFromItems = newItems.reduce(
                (sum, item) => sum + (item.price < 0 ? Math.abs(item.price * item.quantity) : 0),
                0
            );
            const totalItems = newItems.reduce(
                (sum, item) => sum + (item.price > 0 ? item.quantity : 0),
                0
            );

            removeCartStateFromLocalStorageByKey(state.key);
            updateCartStateFromLocalStorageByKey(getLasterKey() + 1, {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
            });

            return {
                ...state,
                key: getLasterKey() + 1,
                items: newItems,
                total,
                totalItems,
                discount: discountFromItems,
                finalTotal: total - discountFromItems,
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
            clearCartStateFromLocalStorage();
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
