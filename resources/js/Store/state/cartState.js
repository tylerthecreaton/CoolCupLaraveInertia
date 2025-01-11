// Local Storage Utilities
const isLocalStorageAvailable = () => {
    try {
        const testKey = "__test__";
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        console.warn("localStorage is not available:", e);
        return false;
    }
};

// BroadcastChannel for cross-tab state sync
const cartChannel = new BroadcastChannel('cart_state');

// Initial cart state
export const initialCartState = {
    orderNumber: 1,
    key: 0,
    items: [],
    subtotal: 0,
    cartDiscount: 0,
    pointDiscount: 0,
    totalDiscount: 0,
    total: 0,
    discountType: "", // 'promotion' | 'manual'
    totalItems: 0,
    appliedPromotion: null,
    manualDiscountAmount: 0,
    usedPoints: 0,
    pointDiscountAmount: 0,
    userId: null,
    userName: null,
    timestamp: new Date().toISOString(),
};

// Helper functions
const getItemKey = (item) => {
    const customizations = [
        item.id,
        item.size,
        item.sweetness,
        item.toppings?.sort().join("_"),
    ].filter(Boolean);
    return customizations.join("_");
};

const calculateCartTotals = (items, state) => {
    const regularItems = items.filter((item) => item.price > 0);
    const discountItems = items.filter((item) => item.price < 0);

    const subtotal = regularItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const cartDiscount = discountItems.reduce(
        (sum, item) => sum + Math.abs(item.price) * item.quantity,
        0
    );

    const pointDiscount = state.pointDiscountAmount || 0;
    const totalDiscount = cartDiscount + pointDiscount;
    const total = Math.max(0, subtotal - totalDiscount);

    return {
        subtotal,
        cartDiscount,
        pointDiscount,
        totalDiscount,
        total,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
};

// Local storage operations
const getCartFromStorage = () => {
    if (!isLocalStorageAvailable()) return initialCartState;

    try {
        const storedCart = localStorage.getItem("cartState");
        if (!storedCart) return initialCartState;

        const parsedCart = JSON.parse(storedCart);
        return {
            ...initialCartState,
            ...parsedCart,
            timestamp: new Date().toISOString(), // Always use current timestamp
        };
    } catch (error) {
        console.error("Error loading cart from storage:", error);
        return initialCartState;
    }
};

const saveCartToStorage = (cartState) => {
    if (!isLocalStorageAvailable()) return;
    try {
        localStorage.setItem("cartState", JSON.stringify(cartState));
    } catch (error) {
        console.error("Error saving cart to storage:", error);
    }
};

// Cart reducer
export const cartReducer = (state = getCartFromStorage(), action) => {
    let newState;

    switch (action.type) {
        case "ADD_TO_CART": {
            const newItemKey = getItemKey(action.payload);
            const existingItemIndex = state.items.findIndex(
                (item) => getItemKey(item) === newItemKey
            );

            const newItems =
                existingItemIndex >= 0
                    ? state.items.map((item, index) =>
                          index === existingItemIndex
                              ? {
                                    ...item,
                                    quantity:
                                        item.quantity +
                                        (action.payload.quantity || 1),
                                }
                              : item
                      )
                    : [
                          ...state.items,
                          {
                              ...action.payload,
                              quantity: action.payload.quantity || 1,
                          },
                      ];

            const totals = calculateCartTotals(newItems, state);
            newState = {
                ...state,
                key: state.key + 1,
                items: newItems,
                ...totals,
            };

            // Broadcast state update
            cartChannel.postMessage({ type: 'UPDATE_CART_STATE', payload: newState });
            saveCartToStorage(newState);
            return newState;
        }

        case "REMOVE_FROM_CART": {
            const newItems = state.items.filter(
                (item) => item.id !== action.payload
            );
            const totals = calculateCartTotals(newItems, state);
            newState = {
                ...state,
                key: state.key + 1,
                items: newItems,
                ...totals,
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "UPDATE_QUANTITY": {
            const { itemId, delta } = action.payload;
            const newItems = state.items
                .map((item) =>
                    item.id === itemId
                        ? {
                              ...item,
                              quantity: Math.max(0, item.quantity + delta),
                          }
                        : item
                )
                .filter((item) => item.quantity > 0);

            const totals = calculateCartTotals(newItems, state);
            newState = {
                ...state,
                key: state.key + 1,
                items: newItems,
                ...totals,
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "APPLY_PROMOTION": {
            const promotion = action.payload;
            newState = {
                ...state,
                discountType: promotion ? "promotion" : "",
                appliedPromotion: promotion,
                manualDiscountAmount: 0,
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "APPLY_MANUAL_DISCOUNT": {
            const amount = Math.max(0, Number(action.payload) || 0);
            newState = {
                ...state,
                discountType: amount > 0 ? "manual" : "",
                manualDiscountAmount: amount,
                appliedPromotion: null,
                cartDiscount: amount,
                total: Math.max(0, state.subtotal - amount),
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "APPLY_POINT_DISCOUNT": {
            const { amount, point } = action.payload;
            console.log("APPLY_POINT_DISCOUNT", action.payload);
            const pointDiscountAmount = Number(point) || 0;
            const usedPoints = Number(amount) || 0;
            newState = {
                ...state,
                usedPoints: usedPoints,
                pointDiscountAmount: pointDiscountAmount,
                totalDiscount: state.cartDiscount + pointDiscountAmount,
                total: Math.max(
                    0,
                    state.subtotal - (state.cartDiscount + pointDiscountAmount)
                ),
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "SET_ORDER_NUMBER": {
            const orderNumber = Math.max(1, parseInt(action.payload) || 1);
            newState = {
                ...state,
                orderNumber,
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "INCREMENT_ORDER_NUMBER": {
            newState = {
                ...state,
                orderNumber: state.orderNumber + 1,
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "CLEAR_CART": {
            newState = {
                ...initialCartState,
                orderNumber: state.orderNumber,
                key: state.key + 1,
                timestamp: new Date().toISOString(),
            };
            saveCartToStorage(newState);
            return newState;
        }

        case "SET_USER": {
            newState = {
                ...state,
                userId: action.payload?.id || null,
                userName: action.payload?.name || null,
            };
            saveCartToStorage(newState);
            return newState;
        }

        default:
            return state;
    }
};

// Action creators
export const cartActions = {
    addToCart: (item) => ({
        type: "ADD_TO_CART",
        payload: item,
    }),

    removeFromCart: (itemId) => ({
        type: "REMOVE_FROM_CART",
        payload: itemId,
    }),

    updateQuantity: (itemId, delta) => ({
        type: "UPDATE_QUANTITY",
        payload: { itemId, delta },
    }),

    applyPromotion: (promotion) => ({
        type: "APPLY_PROMOTION",
        payload: promotion,
    }),

    applyManualDiscount: (amount) => ({
        type: "APPLY_MANUAL_DISCOUNT",
        payload: amount,
    }),

    applyPointDiscount: (payload) => ({
        type: "APPLY_POINT_DISCOUNT",
        payload: payload,
    }),

    setOrderNumber: (number) => ({
        type: "SET_ORDER_NUMBER",
        payload: number,
    }),

    incrementOrderNumber: () => ({
        type: "INCREMENT_ORDER_NUMBER",
    }),

    clearCart: () => ({
        type: "CLEAR_CART",
    }),

    setUser: (user) => ({
        type: "SET_USER",
        payload: user,
    }),
};

// Setup broadcast channel listener
cartChannel.onmessage = (event) => {
    if (event.data.type === 'UPDATE_CART_STATE') {
        saveCartToStorage(event.data.payload);
    }
};

// Types for TypeScript (optional)
/**
 * @typedef {Object} CartItem
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {number} quantity
 * @property {string} [image]
 * @property {string} [size]
 * @property {string[]} [toppings]
 * @property {string} [sweetness]
 * @property {string} [options]
 */

/**
 * @typedef {Object} CartState
 * @property {number} orderNumber
 * @property {number} key
 * @property {CartItem[]} items
 * @property {number} subtotal
 * @property {number} discount
 * @property {number} total
 * @property {string} discountType
 * @property {number} totalItems
 * @property {Object|null} appliedPromotion
 * @property {number} manualDiscountAmount
 * @property {number} pointDiscountAmount
 * @property {string|null} userId
 * @property {string|null} userName
 * @property {string} timestamp
 */
