// BroadcastChannel for cross-tab state sync
const clientScreenChannel = new BroadcastChannel('client_screen_state');

export const initialClientScreenState = {
    isShowing: true,
    selectedClient: null,
    qrCode: null,
    customerInfo: null,
    paymentInfo: null
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
        case 'SHOW_QR_CODE': {
            newState = {
                ...state,
                qrCode: action.payload,
            };
            // Broadcast state update
            clientScreenChannel.postMessage({ type: 'UPDATE_CLIENT_SCREEN_STATE', payload: newState });
            return newState;
        }
        case 'SHOW_CUSTOMER_INFO': {
            newState = {
                ...state,
                customerInfo: action.payload,
            };
            // Broadcast state update
            clientScreenChannel.postMessage({ type: 'UPDATE_CLIENT_SCREEN_STATE', payload: newState });
            return newState;
        }
        case 'SHOW_PAYMENT_INFO': {
            newState = {
                ...state,
                paymentInfo: action.payload,
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
        // Handle state update
    }
};

export const clientScreenActions = {
    toggleClientScreen() {
        return {
            type: 'TOGGLE_CLIENT_SCREEN',
        };
    },
    setSelectedClient(client) {
        return {
            type: 'SET_SELECTED_CLIENT',
            payload: client,
        };
    },
    showQRCode(qrCode) {
        return {
            type: 'SHOW_QR_CODE',
            payload: qrCode,
        };
    },
    showCustomerInfo(customerInfo) {
        return {
            type: 'SHOW_CUSTOMER_INFO',
            payload: customerInfo,
        };
    },
    showPaymentInfo(paymentInfo) {
        return {
            type: 'SHOW_PAYMENT_INFO',
            payload: paymentInfo,
        };
    },
};
