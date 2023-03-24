const setError = (item, state, setState, indexCard) => {
 if (Array.isArray(state)) {
  let state2 = [...state]

  if (!state2[indexCard][item].value || (state2[indexCard][item].length ? Array.from(state2[indexCard][item].value).length < state2[indexCard][item].length : false)) {
   state2[indexCard][item].error = true
   setState(state2)
  }

 } else {
  let state2 = { ...state }

  if (!state2[item].value || (state2[item].length ? Array.from(state2[item].value).length < state2[item].length : false)) {
   state2[item].error = true
   setState(state2)
  }
 }
}

export default setError