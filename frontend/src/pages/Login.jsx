import React, { useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import stellar from "../assets/stellar.svg";
import { reset, signin } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { redirect } from "react-router-dom";

const { Text, Title, Link } = Typography;

export default function Login() {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      toast.success("Logged in successfully, now enter the OTP!");
      redirect("/otpscreen");
    }
    if (isError) {
      toast.error(message);
    }
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, isError, message]);

  const onFinish = async (values) => {
    try {
      dispatch(signin(values));
    } catch (error) {
      const errmsg = error.response.data.error || "Something went wrong!";
      toast.error(errmsg);
    }
  };

  return (
    <section className="flex h-screen items-center bg-gray-50 p-8 sm:p-0">
      <div className="mx-auto w-full max-w-sm rounded-lg bg-white p-6 shadow-md">
        <div className="mb-8 text-center">
          <img src={stellar} alt="Stellar" className="mx-auto mb-4" />
          <Title level={3} className="text-2xl font-bold">
            Sign in
          </Title>
          <Text className="text-gray-600">
            Welcome back to stellar! Please sign in to your account.
          </Text>
        </div>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark="optional"
        >
          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
              className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </Form.Item>
          <Form.Item className="mb-0">
            <Button
              block
              type="primary"
              htmlType="submit"
              className="w-full rounded bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              Log in
            </Button>
            <div className="mt-4 text-center">
              <Text className="text-gray-600">Don't have an account?</Text>{" "}
              <Link href="/signup" className="text-blue-500 hover:underline">
                Sign up now
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}