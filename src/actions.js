function reduceJackson(state, action){
  if (action.type === 'Jackson'){
    return Object.assign( {text: action.data} );
  } else {
    return state;
  }
}

function reducePollution(state, action){
  if (action.type === 'Pollution'){
    return Object.assign({ text: action.data });
  } else {
    return state;
  }
}

function combineReducers(map){
  return function _combineReducers(prevState, action) {
    const reducerMap = map;
    const keys = Object.keys(prevState);
    let newState = Object.assign(prevState);

    for (let i=0; i<keys.length; i++){
      newState[keys[i]] = reducerMap[keys[i]](newState, action);
    }

    return newState;
  }
}

const myNoiseReducer = (prevState = "peace and quiet", action) => {
  switch (action.type) {
    case "noisy action":
      return action.noise;
    default:
      return prevState;
  }
};

const myNoisyAction = {
  type: "noisy action",
  noise: "Car alarm"
};

const myInconsequentialAction = {
  type: "a type no one cares about",
  data: {
    thisThing: "will not get used anyway"
  }
};

const myInitialState = {
  noise: "peace and quiet"
};

const myRootReducer = combineReducers({
  noise: myNoiseReducer,
});

let newState = myRootReducer(myInitialState, myInconsequentialAction);
// => { noise: "peace and quiet" }

newState = myRootReducer(newState, myNoisyAction)
// => { noise: "Car alarm" }

myRootReducer(newState, myInconsequentialAction)
// => { noise: "Car alarm" }

myRootReducer(newState, myInconsequentialAction)


// const map = {
//   jackson: reduceJackson,
//   pollution: reducePollution
// };

// const rootReducer = combineReducers(map);

// const jax = { type: "Jackson", data: 'five'};
// const poll = { type: "Pollution", data: 'too high'};

// state1 = { text: 'None yet'}

// console.log(`Initial state is ${JSON.stringify(state1)}`);

// const resultJax = reduceJackson(state1, jax);
// console.log(resultJax);
// console.log(`Post Jackson, state is ${JSON.stringify(state1)}`);

// const resultPol = reducePollution(state1, poll);
// console.log(resultPol);
// console.log(`Post Pullution, state is ${JSON.stringify(state1)}`);