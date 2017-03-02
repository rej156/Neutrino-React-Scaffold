import createReducer from '../../../lib/create-reducer'

const myReducer = createReducer([], { LOL: state => state });
const myReducer2 = createReducer([], { LOL: state => state });

export default { myReducer, myReducer2 };
