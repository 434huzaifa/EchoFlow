import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Outlet></Outlet>
      <Toaster 
      position="bottom-left"
      />
    </>
  );
}

export default App;
