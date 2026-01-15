import { Button, Form, Input, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../api/UserApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";
import { useSelector } from "react-redux";
import GlassCard from "../components/GlassCard";

function Signup() {
  const [form] = Form.useForm();
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);

  if (status === "authenticated") {
    navigate("/");
  }

  const onFinish = async (values) => {
    if (values?.pass1 !== values?.pass2) {
      setIsPasswordMatch(false);
      return;
    }

    try {
      await createUser({
        name: values?.name,
        email: values?.email,
        password: values?.pass1,
      }).unwrap();
      toast.success("User registration successful");
      form.resetFields();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="min-h-screen w-screen flex justify-center items-center my-bg">
      <Spin spinning={isLoading} size="large">
        <GlassCard title="Sign Up" width="w-96">
          <Form
            name="signup"
            onFinish={onFinish}
            form={form}
            variant="underlined"
            layout="vertical"
            size="large"
            disabled={isLoading}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your name!" },
                { min: 3, message: "At least 3 characters" },
                { max: 15, message: "Max 15 characters" },
              ]}
            >
              <Input
                placeholder="Enter your name"
                style={{ background: "none", color: "white" }}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter your email"
                style={{ background: "none", color: "white" }}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="pass1"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "At least 6 characters" },
                { max: 20, message: "Max 20 characters" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                onChange={() => setIsPasswordMatch(true)}
                style={{ background: "none", color: "white" }}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="pass2"
              rules={[
                { required: true, message: "Please confirm your password!" },
                { min: 6, message: "At least 6 characters" },
                { max: 20, message: "Max 20 characters" },
              ]}
            >
              <Input.Password
                placeholder="Re-enter your password"
                onChange={() => setIsPasswordMatch(true)}
                style={{ background: "none", color: "white" }}
              />
            </Form.Item>

            {!isPasswordMatch && (
              <p className="text-center text-red-400 text-md font-semibold">
                Passwords do not match
              </p>
            )}

            <Form.Item className="flex justify-center">
              <Button
                htmlType="submit"
                variant="outlined"
                ghost
                style={{ background: "none" }}
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
          <p className="font-semibold text-gray-900 text-center">
            if you have account then{" "}
            <Link className="text-blue-500 hover:underline" to="/login">
              Login
            </Link>
          </p>
        </GlassCard>
      </Spin>
    </div>
  );
}

export default Signup;
