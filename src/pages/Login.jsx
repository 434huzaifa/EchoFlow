import { Button, Card, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  function onFinish(v) {
    console.log(v);
    navigate("home")
  }
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Card>
        <Form name="login" onFinish={onFinish} form={form} layout="vertical">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter your email"></Input>
          </Form.Item>
          <Form.Item
            label="Password"
            name="pass"
            rules={[{ required: true, message: "Please input your password!" }]}
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
    </div>
  );
}

export default Login;
