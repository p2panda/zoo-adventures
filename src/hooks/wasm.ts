import { useEffect } from 'react';

let promise = null;

export function useSesamoid (fn: Function) {
  useEffect(() => {
    // We already loaded the library or wait for it.
    if (promise) {
      return promise.then((sesamoidLib) => {
        fn(sesamoidLib);
      });
    }

    // Sesamoid Library doesn't exist yet and has to be dynamically imported.
    promise = new Promise((resolve) => {
      import('sesamoid').then(({ setWasmPanicHook, ...sesamoidLib }) => {
        // Set panic hooks for better logging of wasm errors. See:
        // https://github.com/rustwasm/console_error_panic_hook
        setWasmPanicHook();

        // Store instance of sesamoid library to only import it once.
        resolve(sesamoidLib);

        // Call hook function.
        fn(sesamoidLib);
      });
    });
  }, []);
}
