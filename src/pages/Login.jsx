import { Button, Card, Form, Input, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api/UserApi";
import { extractErrorMessage } from "../utils/common";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

function Login() {
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const { status } = useSelector((state) => state.auth);
  if (status=="authenticated") {
    navigate("/");
  }
  const [form] = Form.useForm();
  async function onFinish(v) {
    try {
      await loginUser({
        email: v?.email,
        password: v?.pass,
      }).unwrap();
      toast.success("User Login success");
      form.resetFields();
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }
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
                { type: "email", message: "Please Enter a valid email" },
              ]}
            >
              <Input placeholder="Enter your email"></Input>
            </Form.Item>
            <Form.Item
              label="Password"
              name="pass"
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "At least 6 character" },
                { max: 6, message: "Max 6 character" },
              ]}
            >
              <Input.Password placeholder="Enter your Pass"></Input.Password>
            </Form.Item>
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

export default Login;
