import React, { useEffect } from "react";
import { Button, Form, Input, Typography } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import stellar from "../assets/stellar.svg";
import { logup, reset } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Text, Title, Link } = Typography;

export default function SignUp() {
  const dispatch = useDispatch();
  const { isSuccess, message } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
    }
  }, [isSuccess, message]);

  const onFinish = async (values) => {
    try {
      dispatch(logup(values));
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
            Sign Up
          </Title>
          <Text className="text-gray-600">
            New to Stellar? Create an account.
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
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your Name!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Name"
              className="rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </Form.Item>
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
          <Form.Item
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your Password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Confirm Password"
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
              Sign Up
            </Button>
            <div className="mt-4 text-center">
              <Text className="text-gray-600">Already have an account?</Text>{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                Log in
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
