import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastProvider } from "./components/toast";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import SendPage from "./pages/SendPage";
import PixSuccess from "./pages/PixSuccess";
import NotFound from "./pages/NotFound";
import ChargePage from "./pages/ChargePage";
import AllTransactionsPage from "./pages/AllTransactionsPage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendPage />} />
          <Route path="/charge" element={<ChargePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/pixsuccess/:transaction_id" element={<PixSuccess />} />
          <Route path="/all-transactions" element={<AllTransactionsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
};

export default App;
