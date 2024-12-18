export const initialAppState = {
    isCartOpen: false,
};

export const appReducer = (state = initialAppState, action) => {
    switch (action.type) {
        case "TOGGLE_CART":
            return {
                ...state,
                isCartOpen: !state.isCartOpen,
            };
        case "SET_CART_OPEN":
            return {
                ...state,
                isCartOpen: action.payload,
            };
        default:
            return state;
    }
};

// Action Creators
export const appActions = {
    toggleCart: () => ({
        type: "TOGGLE_CART",
    }),
    setCartOpen: (isOpen) => ({
        type: "SET_CART_OPEN",
        payload: isOpen,
    }),
};
