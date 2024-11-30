import React, { useEffect, useState } from "react";
import { Button, Input, Typography } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { otpVal, reset } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const { Title, Text } = Typography;

export default function OtpInputScreen() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { otpemail, isSuccess } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!otpemail) {
      toast.error("Please log in first!", { duration: 4000 });
      navigate("/login");
    }
  }, [otpemail]);

  const handleChange = (value, index) => {
    if (!isNaN(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      if (value && index < otp.length - 1) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }
  };

  const handlePaste = (event) => {
    const paste = event.clipboardData.getData("text");
    if (!isNaN(paste) && paste.length === otp.length) {
      const updatedOtp = paste.split("").slice(0, otp.length);
      setOtp(updatedOtp);
      updatedOtp.forEach((value, index) => {
        document.getElementById(`otp-${index}`).value = value;
      });
    }
  };

  const handleSubmit = async () => {
    console.log("Entered OTP:", otp.join(""));
    try {
      dispatch(otpVal({ email: otpemail, otp: otp.join("") }));
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <Title level={3} className="text-center text-2xl font-semibold">
          Enter OTP
        </Title>
        <Text className="block text-center text-gray-600">
          Please enter the 6-digit code sent to your email.
        </Text>
        <div className="mt-6 flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : null}
              className="h-12 w-12 rounded-md border-gray-300 text-center text-lg font-semibold shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          ))}
        </div>
        <Button
          block
          type="primary"
          className="mt-6 h-10 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        <div className="mt-4 text-center">
          <Text className="text-gray-600">
            Didn’t receive the code?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          </Text>
        </div>
      </div>
    </div>
  );
}
