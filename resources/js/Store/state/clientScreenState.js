// BroadcastChannel for cross-tab state sync
const clientScreenChannel = new BroadcastChannel('client_screen_state');

export const initialClientScreenState = {
    isShowing: false,
    selectedClient: null,
};

export const clientScreenReducer = (state = initialClientScreenState, action) => {
    let newState;
    
    switch (action.type) {
        case 'TOGGLE_CLIENT_SCREEN': {
            newState = {
                ...state,
                isShowing: !state.isShowing,
            };
            // Broadcast state update
            clientScreenChannel.postMessage({ type: 'UPDATE_CLIENT_SCREEN_STATE', payload: newState });
            return newState;
        }
        case 'SET_SELECTED_CLIENT': {
            newState = {
                ...state,
                selectedClient: action.payload,
            };
            // Broadcast state update
            clientScreenChannel.postMessage({ type: 'UPDATE_CLIENT_SCREEN_STATE', payload: newState });
            return newState;
        }
        default:
            return state;
    }
};

// Setup broadcast channel listener
clientScreenChannel.onmessage = (event) => {
    if (event.data.type === 'UPDATE_CLIENT_SCREEN_STATE') {
        // Update local state when receiving broadcast
        return event.data.payload;
    }
};

export const clientScreenActions = {
    toggleClientScreen: () => ({
        type: 'TOGGLE_CLIENT_SCREEN',
    }),
    setSelectedClient: (client) => ({
        type: 'SET_SELECTED_CLIENT',
        payload: client,
    }),
};
