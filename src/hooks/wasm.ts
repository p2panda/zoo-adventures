import loadP2Panda from 'p2panda-js';
import { Resolved } from '~/typescript/helpers';

/**
 * Use this hook to access p2panda in a React component
 *
 * @param fn called with p2panda lib as argument
 */
export const useP2Panda = (
  fn: (lib: Resolved<typeof loadP2Panda>) => void,
): Promise<void> =>
  (async () => {
    fn(await loadP2Panda);
  })();
