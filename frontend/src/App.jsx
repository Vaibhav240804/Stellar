import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OtpInputScreen from "./components/OtpInputScreen";
import { useDispatch, useSelector } from "react-redux";
import { shareToken } from "./redux/authSlice";
import SignUp from "./pages/SignUp";
import toast from "react-hot-toast";

const App = () => {
  const { email, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );
  const [authLoading, setAuthLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!email) {
      dispatch(shareToken()).finally(() => setAuthLoading(false));
    } else {
      setAuthLoading(false);
    }
  }, [dispatch, email]);

  useEffect(() => {
    if (isLoading && !loadingId) {
      const id = toast.loading("Loading...");
      setLoadingId(id);
    }
    if (!isLoading && loadingId) {
      toast.dismiss(loadingId);
      setLoadingId(null);
    }
    if (isSuccess) {
      toast.success(message);
    }
    if (isError) {
      toast.error(message);
    }
  }, [isLoading, isError, isSuccess, loadingId, message]);

  if (authLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/dashboard"
          element={
            email ? <Dashboard /> : <Navigate to="/login" replace={true} />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/otpscreen" element={<OtpInputScreen />} />
      </Routes>
    </Router>
  );
};

export const Loading = () => {
  return (
    <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
      <div className="animate-pulse flex space-x-4">
        <div className="flex-1 space-y-6 py-1">
          <div className="h-2 bg-slate-700 rounded"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-2 bg-slate-700 rounded col-span-2"></div>
              <div className="h-2 bg-slate-700 rounded col-span-1"></div>
            </div>
            <div className="h-2 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
