import { Avatar, Button, Form, Input, Popover } from "antd";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { MdChevronRight, MdDelete, MdOutlineTurnRight } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

function Comment() {
  const [form] = Form.useForm();
  const [replyInput, setReplayState] = useState(false);
  const [showReplay, setShowReplayState] = useState(false);
  function onFinish(v) {
    console.info("🚀 ~ onFinish ~ v:", v);
  }
  function popOverContent() {
    return (
      <>
        <p>Huzaifa</p>
        <p>saadhuzaifa2497@gmail.com</p>
      </>
    );
  }
  function changeReplayInputState() {
    setReplayState(!replyInput);
  }
  function changeShowReplayState() {
    setShowReplayState(!showReplay);
  }
  return (
    <div>
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <Popover content={popOverContent} arrow={true} placement="left">
              <Avatar size="large" shape="square">
                H
              </Avatar>
            </Popover>
          </div>
          <p className="text-md ">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Repellat,
            suscipit est obcaecati sapiente consectetur officiis eos beatae quo
            ut modi cupiditate a recusandae aut totam, ratione, autem aspernatur
            in saepe!
          </p>
        </div>
        <div className="pl-13 flex text-blue-700 justify-between">
          <div>
            {showReplay ? (
              <IoChevronUp
                className="hover:cursor-pointer hover:border-b"
                onClick={changeShowReplayState}
              />
            ) : (
              <IoChevronDown
                className="hover:cursor-pointer hover:border-b"
                onClick={changeShowReplayState}
              />
            )}
          </div>
          <div className="flex gap-3">
            <MdOutlineTurnRight
              className="hover:cursor-pointer hover:border-b"
              onClick={changeReplayInputState}
            />
            <BiEdit className="hover:cursor-pointer hover:border-b" />
            <MdDelete className="hover:cursor-pointer hover:border-b" />
          </div>
        </div>
        {replyInput ? (
          <div className="pl-13 mt-2">
            <Form
              name="replay_form"
              onFinish={onFinish}
              form={form}
              className="flex flex-row gap-3"
            >
              <Form.Item
                name="replay"
                rules={[{ required: true, message: "Replay can't be empty" }]}
                className="flex-1"
              >
                <Input placeholder="Write your thoughts......"></Input>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  <MdChevronRight className="text-2xl" />
                </Button>
              </Form.Item>
              <Button
                variant="solid"
                color="danger"
                onClick={changeReplayInputState}
              >
                <RxCross2 className="text-2xl" />
              </Button>
            </Form>
          </div>
        ) : (
          <></>
        )}
        {showReplay ? (
          <div className="pl-13 flex gap-4 items-center mt-1">
            <div className="flex-1">
              <Popover content={popOverContent} arrow={true} placement="left">
                <Avatar size="large" shape="square">
                  H
                </Avatar>
              </Popover>
            </div>
            <p className="text-md ">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Repellat, suscipit est obcaecati sapiente consectetur officiis eos
              beatae quo ut modi cupiditate a recusandae aut totam, ratione,
              autem aspernatur in saepe!
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Comment;
