import { Button, Form, Input, Modal, Pagination } from "antd";
import PostCard from "../components/PostCard";
import { useState } from "react";

function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();
  function onFinish(v) {
    console.info("🚀 ~ onFinish ~ v:", v);
  }
  return (
    <div className="p-5 flex gap-3 flex-col w-full h-full">
      <PostCard></PostCard>
      <Pagination align="center" defaultCurrent={1} total={50} />
      <Button onClick={showModal}>Create Post</Button>
      <Modal
        title="Basic Modal"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name="post_form" onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Title is required" },
              { max: 50 },
              { min: 3 },
            ]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[
              { required: true, message: "Body is required" },
              { max: 1 },
              { min: 10000 },
            ]}
          >
            <Input.TextArea></Input.TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Home;
