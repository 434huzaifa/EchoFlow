import { Avatar, Button, Card, Divider, Form, Input, Popover } from "antd";
import { useState } from "react";
import {
  BiComment,
  BiDislike,
  BiEdit,
  BiLike,
  BiSolidComment,
} from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";
import { MdChevronRight, MdDelete, MdOutlineTurnRight } from "react-icons/md";
import Comment from "./Comment";

function PostCard() {
  const [form] = Form.useForm();
  const [showComment, setShowComment] = useState(false);
  function onFinish(v) {
    console.info("🚀 ~ onFinish ~ v:", v);
  }
  function changeShowCommentState() {
    setShowComment(!showComment);
  }

  return (
    <Card>
      <p className="text-2xl font-bold">Title</p>
      <p className="text-xl">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perspiciatis
        rerum molestias aliquid, magni provident veniam eligendi corporis
        commodi ad fuga. Dignissimos aperiam amet quo. Eaque sequi voluptatibus
        perferendis assumenda sit.
      </p>
      <Divider></Divider>
      <div className="flex justify-between text-xl">
        <div className="flex gap-4">
          <div className="flex gap-0.5 items-center justify-center  hover:cursor-pointer">
            <span>1</span>
            <BiLike className="hover:cursor-pointer hover:border-b" />
            {/* <BiSolidLike /> */}
          </div>
          <div className="flex gap-0.5 items-center justify-center  hover:cursor-pointer">
            <span>1</span>
            <BiDislike className="hover:cursor-pointer hover:border-b" />
            {/* <BiSolidDislike /> */}
          </div>
          <div
            className="flex gap-0.5 items-center justify-center text-lg hover:cursor-pointer"
            onClick={changeShowCommentState}
          >
            <span>1</span>
            {showComment ? (
              <BiSolidComment className="hover:cursor-pointer hover:border-b" />
            ) : (
              <BiComment className="hover:cursor-pointer hover:border-b" />
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <BiEdit className="hover:cursor-pointer hover:border-b" />
          <MdDelete className="hover:cursor-pointer hover:border-b" />
        </div>
      </div>
      <Divider></Divider>
      <Form
        name="comment_form"
        onFinish={onFinish}
        form={form}
        className="flex flex-row gap-3"
      >
        <Form.Item
          name="comment"
          rules={[{ required: true, message: "Comment can't be empty" }]}
          className="flex-1"
        >
          <Input placeholder="Write your thoughts......"></Input>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <MdChevronRight className="text-2xl" />
          </Button>
        </Form.Item>
      </Form>
      {showComment ? (
        <div className="flex flex-col gap-2">
          {Array.from([1, 2]).map(() => (
            <Comment></Comment>
          ))}
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
}

export default PostCard;
