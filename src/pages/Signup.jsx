import { Button, Card, Form, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../api/UserApi";
import { useState } from "react";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";
import { useSelector } from "react-redux";

function Signup() {
  const [createUser, { isLoading }] = useCreateUserMutation();
  const navigate=useNavigate()
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const { status } = useSelector((state) => state.auth);
  if (status=="authenticated") {
    navigate("/")
  }
  const [form] = Form.useForm();
  async function onFinish(v) {
    if (v?.pass1 !== v?.pass2) {
      setIsPasswordMatch(false);
    } else {
      try {
        await createUser({
          name: v?.name,
          email: v?.email,
          password: v?.pass1,
        }).unwrap();
        toast.success("User creation success");
        form.resetFields();
      } catch (error) {
        toast.error(extractErrorMessage(error));
      }
    }
  }
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Spin spinning={isLoading} size="large">
        <Card>
          <Form
            name="login"
            onFinish={onFinish}
            form={form}
            layout="vertical"
            size="large"
            disabled={isLoading}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please input your Name!" },
                { min: 3, message: "At least 3 character" },
                { max: 15, message: "Max 15 character" },
                { type: "string", message: "Enter a valid name" },
              ]}
            >
              <Input placeholder="Enter your name"></Input>
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Enter a valid Email" },
              ]}
            >
              <Input placeholder="Enter your email"></Input>
            </Form.Item>
            <Form.Item
              label="Password"
              name="pass1"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "At least 6 character" },
                { max: 6, message: "Max 6 character" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                onChange={() => {
                  setIsPasswordMatch(true);
                }}
              ></Input.Password>
            </Form.Item>
            <Form.Item
              label="Re-Password"
              name="pass2"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "At least 6 character" },
                { max: 6, message: "Max 6 character" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                onChange={() => {
                  setIsPasswordMatch(true);
                }}
              ></Input.Password>
            </Form.Item>
            {isPasswordMatch || (
              <p className="text-center text-red-400 text-md font-semibold">
                Password did not match
              </p>
            )}
            <Form.Item className="flex justify-center">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default Signup;
