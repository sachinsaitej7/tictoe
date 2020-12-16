
const initialState = {
    loading: false
};

const LOADING = 'peer/LOADING';
const SUCCESS = 'peer/SUCCESS';
const SEND_SUCCESS = 'peer/SEND_SUCCESS';
const SET_SUCCESS = 'peer/SET_SUCCESS';

export default function peer(state = initialState, action = {}) {
    switch (action.type) {
        case LOADING:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS:
            return {
                ...state,
                data: action.result,
                loading: false,
            };
        case SEND_SUCCESS:
            return {
                ...state,
                data: action.result,
                loading: false,
            };
        case SET_SUCCESS:
            return{
                ...state,
                connection: action.result
            }

        default:
            return state;
    }
}


export function syncData(data){
    return {
        type: SUCCESS,
        result: data
    }
}


export function pushData(data){
    return {
        type: SEND_SUCCESS,
        result: data
    }
}

export function setConnection(connection){
    console.log(connection,'redux');
    return {
        type: SET_SUCCESS,
        result: connection
    }
}
