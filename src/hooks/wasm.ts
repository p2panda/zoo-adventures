import { useEffect } from 'react';

const sesamoid = import('sesamoid').then(({ setWasmPanicHook, ...rest }) => {
  // Set panic hooks for better logging of wasm errors. See:
  // https://github.com/rustwasm/console_error_panic_hook
  setWasmPanicHook();

  // Resolve sesamoid library
  return rest;
});

// This hook makes sure we only load the sesamoid library once even when it was
// used multiple times (singleton). Also it sets the panic hook automatically
// for better debugging.
export function useSesamoid (fn: Function) {
  useEffect(() => {
    sesamoid.then((lib) => {
      fn(lib);
    });
  }, []);
}
