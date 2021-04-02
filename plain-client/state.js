
let state = {
    hoveringCar: false,
    draggingCar: false,
    videoRunning: true,
};

const stateKeys = Object.keys(state);

const checkValidStateKey = (key) => {
  if (!stateKeys.find((stateKey) => stateKey === key))
    throw new Error('Updating Inexisting State Prop');
}

const updateState = (newProps) => {
  Object.keys(newProps).forEach(prop => {
    checkValidStateKey(prop);

  });
  state = Object.assign(state, newProps);
};

const getState = (keys = stateKeys) => {
  return keys.reduce((res, key) => {
    return Object.assign(res, { [key]: state[key] });
  }, {});
};
