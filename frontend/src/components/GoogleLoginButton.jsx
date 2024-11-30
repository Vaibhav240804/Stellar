import React from "react";
import { Button } from "antd";

const GoogleLoginButton = () => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const googleAuth = () => {
    window.open(`${backendUrl}/api/auth/google`, "_self");
  };

  return (
    <Button type="primary" onClick={googleAuth} style={{ marginTop: "20px" }}>
      Login with Google
    </Button>
  );
};

export default GoogleLoginButton;
