const INITIAL_STATE = {
    user: {},
    cart_items: [],
    token: null,
    breshop: null,
    toggled: false,
    collapsed: false,
};

export default (state = INITIAL_STATE, action) => {
    console.log('action redux', action)
    switch (action.type) {
        case 'dados':

            return {
                ...state,
                ...action.payload
            };

        case 'logout':
            return {
                ...state,
                token: null,
                user: {},
            };
        case 'user':
            return {
                ...state,
                user: action.payload,
            };
        case 'login':
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,

            };
        case 'cart_items':
            return {
                ...state,
                cart_items: action.payload,

            };

        case 'toggle_cart':
            return {
                ...state,
                toggled: action.toggled,

            };
        default:
            return { ...state };
    }
};
