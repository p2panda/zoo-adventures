import React, { useEffect, useState } from 'react';
import { initWebAssembly } from 'p2panda-js';

type Props = {
  children: JSX.Element;
};

export const InitWasm: React.FC<Props> = ({ children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initWebAssembly();
      setReady(true);
    };

    init();
  }, []);

  return ready ? children : null;
};
