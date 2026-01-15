import { Button, Card, Form, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api/UserApi";
import { extractErrorMessage } from "../utils/common";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function Login() {
  const [form] = Form.useForm();
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  
  if (status === "authenticated") {
    navigate("/");
  }

  const onFinish = async (values) => {
    try {
      await loginUser({
        email: values?.email,
        password: values?.pass,
      }).unwrap();
      toast.success("User login successful");
      form.resetFields();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Spin spinning={isLoading} size="large">
        <Card>
          <Form name="login" onFinish={onFinish} form={form} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>
            
            <Form.Item
              label="Password"
              name="pass"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "At least 6 characters" },
                { max: 20, message: "Max 20 characters" },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>
            
            <Form.Item className="flex justify-center">
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  );
}

export default Login;
