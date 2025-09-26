import { useEffect } from "react";
import { AppRouter } from "./router/app.router";
import { generatePallete } from "./utils";
import { useAuthStore } from "./features/auth/auth.store";

function App() {
  
  const role = useAuthStore((state) => state.user?.roles[0]);
  
  useEffect(() => {
    generatePallete(role);
  }, [role]);

  return <AppRouter />;
}

export default App;
