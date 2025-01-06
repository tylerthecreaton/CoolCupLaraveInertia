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

// Initial cart state
export const initialCartState = {
    orderNumber: 1,
    key: 0,
    items: [],
    subtotal: 0,
    discount: 0,
    total: 0,
    discountType: "", // 'promotion' | 'manual' | 'point'
    totalItems: 0,
    appliedPromotion: null,
    manualDiscountAmount: 0,
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

const calculateCartTotals = (items) => {
    const regularItems = items.filter((item) => item.price > 0);
    const discountItems = items.filter((item) => item.price < 0);

    const subtotal = regularItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const discountFromItems = discountItems.reduce(
        (sum, item) => sum + Math.abs(item.price) * item.quantity,
        0
    );

    const totalItems = regularItems.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return {
        subtotal,
        discount: discountFromItems,
        total: Math.max(0, subtotal - discountFromItems),
        totalItems,
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

            const totals = calculateCartTotals(newItems);
            newState = {
                ...state,
                key: state.key + 1,
                items: newItems,
                ...totals,
            };
            break;
        }

        case "REMOVE_FROM_CART": {
            const newItems = state.items.filter(
                (item) => item.id !== action.payload
            );
            const totals = calculateCartTotals(newItems);
            newState = {
                ...state,
                key: state.key + 1,
                items: newItems,
                ...totals,
            };
            break;
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

            const totals = calculateCartTotals(newItems);
            newState = {
                ...state,
                key: state.key + 1,
                items: newItems,
                ...totals,
            };
            break;
        }

        case "APPLY_PROMOTION": {
            const promotion = action.payload;
            newState = {
                ...state,
                discountType: promotion ? "promotion" : "",
                appliedPromotion: promotion,
                manualDiscountAmount: 0,
            };
            break;
        }

        case "APPLY_MANUAL_DISCOUNT": {
            const amount = Math.max(0, Number(action.payload) || 0);
            newState = {
                ...state,
                discountType: amount > 0 ? "manual" : "",
                manualDiscountAmount: amount,
                appliedPromotion: null,
                discount: amount,
                total: Math.max(0, state.subtotal - amount),
            };
            break;
        }

        case "APPLY_POINT_DISCOUNT": {
            const amount = Math.max(0, Number(action.payload) || 0);
            newState = {
                ...state,
                discountType: amount > 0 ? "point" : "",
                pointDiscountAmount: amount,
                appliedPromotion: null,
                discount: amount,
                total: Math.max(0, state.subtotal - amount),
            };
            break;
        }

        case "SET_ORDER_NUMBER": {
            const orderNumber = Math.max(1, parseInt(action.payload) || 1);
            newState = {
                ...state,
                orderNumber,
            };
            break;
        }

        case "INCREMENT_ORDER_NUMBER": {
            newState = {
                ...state,
                orderNumber: state.orderNumber + 1,
            };
            break;
        }

        case "CLEAR_CART": {
            newState = {
                ...initialCartState,
                orderNumber: state.orderNumber,
                key: state.key + 1,
                timestamp: new Date().toISOString(),
            };
            break;
        }

        case "SET_USER": {
            newState = {
                ...state,
                userId: action.payload?.id || null,
                userName: action.payload?.name || null,
            };
            break;
        }

        default:
            return state;
    }

    // Save to localStorage and return new state
    saveCartToStorage(newState);
    return newState;
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

    applyPointDiscount: (amount) => ({
        type: "APPLY_POINT_DISCOUNT",
        payload: amount,
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
