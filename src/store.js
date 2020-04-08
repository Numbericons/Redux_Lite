import React from 'react';

export default class Store extends React.Component {
  constructor( { rootReducer} ) {
    super();
    this.rootReducer = rootReducer;
    this.state = {};
  }

  deepDupe(obj){
    const keys = Object.keys();
    const retObj = {};
    for (let i=0;i<keys.length;i++) {
      retObj[keys[i]] = obj[keys[i]];
    }
    return retObj;
  }

  getState(){
    return this.deepDupe(obj);
  }
}