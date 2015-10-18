export default function makeGodAwfulDriver() {
  return function godAwfulDriver(input$) {
    return input$
      .filter(state => !!state.error)
      .map(state => window.alert(`error: ${state.error}`))
      .map(_ => state => Object.assign({}, state, {error: null}));
  }
}
