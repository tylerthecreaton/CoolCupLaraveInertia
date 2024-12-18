import { createContext, useReducer, useContext } from "react";
import { cartReducer, initialCartState } from "./cartState";
import { appReducer, initialAppState } from "./appState";

export const GlobalStateContext = createContext();

// Combine multiple reducers into one
const combineReducers = (reducers) => {
    return (state = {}, action) => {
        const newState = {};
        for (const key in reducers) {
            newState[key] = reducers[key](state[key], action);
        }
        return newState;
    };
};

// Define all reducers here
const rootReducer = combineReducers({
    cart: cartReducer,
    app: appReducer,
    // Add more reducers here as needed
    // example: user: userReducer,
    // example: products: productsReducer,
});

// Initial state combining all feature states
const initialState = {
    app: initialAppState,
    cart: initialCartState,
    // Add more initial states here as needed
    // example: user: initialUserState,
    // example: products: initialProductsState,
};

// Global state provider component
export const GlobalStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(rootReducer, initialState);

    const value = {
        state,
        dispatch,
    };

    return (
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// Custom hook for using the global state
export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error(
            "useGlobalState must be used within a GlobalStateProvider"
        );
    }
    return context;
};
