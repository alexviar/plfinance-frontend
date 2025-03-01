type Command = {
  type: string
  payload?: any
}

declare global {
  interface Window {
    receiveNativeCommand?: (command: Command) => void;
    addNativeCommandHandler?: (handler: (command: Command) => void) => (() => void);
    ReactNativeWebView?: any
  }
}

(function () {
  let handlers: Array<(command: Command) => void> = []
  window.receiveNativeCommand = (command) => {
    console.log(command)
    handlers.forEach((handler) => handler(command))
  };

  window.addNativeCommandHandler = (handler) => {
    console.log("Adding native handler")
    handlers.push(handler)
    return () => handlers = handlers.filter(h => h != handler)
  }
})()