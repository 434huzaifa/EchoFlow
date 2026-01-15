import { Button, Form, Input, Spin } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../api/UserApi";
import { extractErrorMessage } from "../utils/common";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import GlassCard from "../components/GlassCard";
import { IoMdMail } from "react-icons/io";

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
    <div className="min-h-screen w-screen flex justify-center items-center my-bg">
      <Spin spinning={isLoading} size="large">
        <GlassCard title="Login" width="w-80">
          <Form
            name="login"
            onFinish={onFinish}
            form={form}
            layout="vertical"
            size="large"
            variant="underlined"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your Email!" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                placeholder="Enter your email"
                style={{ background: "none" ,color:"white"}}
              />
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
              <Input.Password
                placeholder="Enter your password"
                style={{ background: "none",color:"white" }}
              />
            </Form.Item>

            <Form.Item className="flex justify-center">
              <Button
                htmlType="submit"
                variant="outlined"
                ghost
                style={{ background: "none" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
          <p className="font-semibold text-gray-900 text-center">
            if you don't have account then{" "}
            <Link className="text-blue-500 hover:underline" to="/signup">Signup</Link>
          </p>
        </GlassCard>
      </Spin>
    </div>
  );
}

export default Login;
