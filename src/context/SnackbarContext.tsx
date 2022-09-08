import { createContext, useContext, useMemo, useState } from "react";

const SnachbarContext = createContext<SnachbarContextProps | null>(null);

interface SnachbarContextProps {
  openSnackbar: boolean;
  handleOpenSnackbar: () => void;
  handleCloseSnackbar: () => void;
}

export const SnachbarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleOpenSnackbar = () => {
    setOpenSnackbar(true);
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const values = useMemo<SnachbarContextProps>(
    () => ({
      openSnackbar,
      handleOpenSnackbar,
      handleCloseSnackbar,
    }),
    [openSnackbar]
  );

  return (
    <SnachbarContext.Provider value={values}>
      {children}
    </SnachbarContext.Provider>
  );
};

export const useSnachbar = (): SnachbarContextProps => {
  const context = useContext(SnachbarContext);

  if (context == null) {
    throw new Error(
      "useSnachbar hook must be used with a SnachbarProvider component"
    );
  }

  return context;
};
