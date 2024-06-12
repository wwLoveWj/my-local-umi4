import { createContext, useContext } from "react";

type LayoutContextType = {
  globalEditPages: any;
  setGlobalEditPages: (editPages: any) => void;
};

const LayoutContext = createContext<LayoutContextType>({
  globalEditPages: {},
  setGlobalEditPages: () => {},
});
const LayoutProvider = LayoutContext.Provider;

const useLayoutContext = () => {
  return useContext(LayoutContext);
};

export { LayoutProvider, useLayoutContext };
