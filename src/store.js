// import React from 'react';

// class Store extends React.Component {
class Store {
  constructor( rootReducer ) {
    this.rootReducer = rootReducer;
    this.state = {};
    this.subscriptions = [];
    this.getState = this.getState.bind(this);
  }

  // deepDupe(obj){
  //   const keys = Object.keys(obj);
  //   const retObj = {};
  //   for (let i=0;i<keys.length;i++) {
  //     retObj[keys[i]] = obj[keys[i]];
  //   }
  //   return retObj;
  // }

  getState(){
    return Object.assign({}, this.state);
    // return this.deepDupe(this.state);
  }

  dispatch(action){
    const result = this.rootReducer(this.state,action, this.subscriptions)
    if (result !== this.state) {
      result = this.subscriptionCbs();
    }
    this.state = result;
  }

  subscribe(cb){
    this.subscriptions.push(cb);
  }

  subscriptionCbs(){
    let newState = Object.assign(this.state);
    this.subscriptions.forEach(sub => {
      newState = sub(newState);
    })
    return newState;
  }
}

// function combineReducers(map) {
//   return function _combineReducers(prevState, action) {
//     const reducerMap = map;
//     const keys = Object.keys(prevState);
//     let newState = {};

//     for (let i = 0; i < keys.length; i++) {
//       newState[keys[i]] = reducerMap[keys[i]](newState, action)[keys[i]];
//       if (!action) {
//         const args = [, { type: "__initialize" }];
//         nextState[keys[i]] = config[keys[i]](...args);
//       } else {
//         // newState[keys[i]] = reducerMap[keys[i]](newState, action)[keys[i]];
//         newState[keys[i]] = reducerMap[keys[i]](newState[keys[i]], action);
//       }
//     }

//     return newState;
//   }
// }

const combineReducers = config => {
  return (prevState, action) => {
    const nextState = {};
    Object.keys(config).forEach(k => {
      if (!action) {
        const args = [, { type: "__initialize" }];
        nextState[k] = config[k](...args);
      } else {
        nextState[k] = config[k](prevState[k], action);
      }
    });
    return nextState;
  }
}

// // define a reducer for user:
// const userReducer = (oldUser = null, action) => {
//   if (action.type === "new user") {
//     return action.user;
//   }
//   return oldUser;
// };

// // create a rootReducer:
// const rootReducer = combineReducers({
//   user: userReducer
// });

// // create a store using the rootReducer:
// const store = new Store(rootReducer);

// // get the state:
// store.getState(); // => {}

// // invoke the dispatch function to update the user key:
// const action = {
//   type: "new user",
//   user: "Jeffrey Fiddler"
// };

// store.dispatch(action);
// store.getState(); // => { user: "Jeffrey Fiddler" }

const actionCreator1 = value => ({
  type: "add",
  value
});

const actionCreator2 = value => ({
  type: "subtract",
  value
});

const actionCreator3 = value => ({
  type: "no change",
  value
});

const numberReducer = (num = 0, action) => {
  switch (action.type) {
    case "add":
      return num + action.value;
    case "subtract":
      return num - action.value;
    default:
      return num;
  }
}

const rootReducer = combineReducers({
  number: numberReducer
});

const store = new Store(rootReducer);

store.getState() // => { number: 0 }

const announceStateChange = nextState => {
  console.log(`That action changed the state! Number is now ${nextState.number}`);
}

store.subscribe(announceStateChange);

store.dispatch(actionCreator1(5)); // => "That action changed the state! Number is now 5"
store.dispatch(actionCreator1(5)); // => "That action changed the state! Number is now 10"
store.dispatch(actionCreator2(7)); // => "That action changed the state! Number is now 3"
store.dispatch(actionCreator3(7)); // => Nothing should happen! The reducer doesn't do anything for type "no change"
store.dispatch(actionCreator1(0)) // => Nothing should happen here either. Even though the reducer checks for the "add" action type, adding 0 to the number won't result in a state change.

store.getState(); // => { number: 3 }