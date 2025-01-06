export const initialAppState = {
    isCartOpen: false,
    settings: {},
};

export const appReducer = (state = initialAppState, action) => {
    switch (action.type) {
        case "SET_GLOBAL_SETTINGS":
            return {
                ...state,
                settings: action.payload,
            };
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
    setGlobalSettings: (settings) => ({
        type: "SET_GLOBAL_SETTINGS",
        payload: settings,
    }),
    toggleCart: () => ({
        type: "TOGGLE_CART",
    }),
    setCartOpen: (isOpen) => ({
        type: "SET_CART_OPEN",
        payload: isOpen,
    }),
};
