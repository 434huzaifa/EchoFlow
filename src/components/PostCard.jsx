import {
  Avatar,
  Button,
  Card,
  Divider,
  Form,
  Input,
  Popconfirm,
  Popover,
  Space,
  Spin,
} from "antd";
import { useState } from "react";
import {
  BiComment,
  BiDislike,
  BiEdit,
  BiLike,
  BiSolidComment,
  BiSolidDislike,
  BiSolidLike,
} from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";
import { MdChevronRight, MdDelete, MdOutlineTurnRight } from "react-icons/md";
import Comment from "./Comment";
import {
  useDeletePostMutation,
  useDislikePostMutation,
  useLikePostMutation,
} from "../api/PostApi";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";
import { useSelector } from "react-redux";

function PostCard({ post, setInitialValue,setIsModalOpen }) {
  const [form] = Form.useForm();
  const [showComment, setShowComment] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [likePost, { isLoading: isLikeLoading }] = useLikePostMutation();
  const [dislikePost, { isLoading: isDisLikeLoading }] =
    useDislikePostMutation();
  const [deletePost, { isLoading: isDeleteLoading }] = useDeletePostMutation();
  function onFinish(v) {
    console.info("🚀 ~ onFinish ~ v:", v);
  }
  function changeShowCommentState() {
    setShowComment(!showComment);
  }

  const handleLike = async (postId) => {
    try {
      await likePost(postId).unwrap();
      toast.success("Post liked");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleDislike = async (postId) => {
    try {
      await dislikePost(postId).unwrap();
      toast.success("Post dislike");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };
  const handleDelete = async (postId) => {
    try {
      await deletePost(postId).unwrap();
      toast.success("post deleted");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };
  const handleEdit = () => {
    setInitialValue({ title: post?.title, body: post?.body, postId: post?._id });
    setIsModalOpen(true)
  };

  const likeIcon = (() => {
    for (const objectId of post?.likes || []) {
      if (objectId == user?.id) {
        return BiSolidLike;
      } else {
        return BiLike;
      }
    }
    return BiLike;
  })();

  const dislikeIcon = (() => {
    for (const objectId of post?.dislikes || []) {
      if (objectId == user?.id) {
        return BiSolidDislike;
      } else {
        return BiDislike;
      }
    }
    return BiDislike;
  })();

  return (
    <Card>
      <p className="text-2xl font-bold">{post.title}</p>
      <p className="text-xl">{post.body}</p>
      <p className="text-xs text-gray-500">
        {post?.author?._id == user?.id ? "By Me" : `By ${post.author.name}`}
      </p>
      <Divider></Divider>
      <div className="flex justify-between text-xl">
        <div className="flex gap-4">
          <Spin spinning={isLikeLoading}>
            <div
              className="flex gap-0.5 items-center justify-center  hover:cursor-pointer"
              onClick={() => {
                handleLike(post._id);
              }}
            >
              <span>{post.likesCount}</span>
              {likeIcon()}
            </div>
          </Spin>
          <Spin spinning={isDisLikeLoading}>
            <div
              className="flex gap-0.5 items-center justify-center  hover:cursor-pointer"
              onClick={() => {
                handleDislike(post._id);
              }}
            >
              <span>{post.dislikesCount}</span>
              {dislikeIcon()}
            </div>
          </Spin>
          <div
            className="flex gap-0.5 items-center justify-center text-lg hover:cursor-pointer"
            onClick={changeShowCommentState}
          >
            <span>{post?.commentsCount}</span>
            {showComment ? (
              <BiSolidComment className="hover:cursor-pointer hover:border-b" />
            ) : (
              <BiComment className="hover:cursor-pointer hover:border-b" />
            )}
          </div>
        </div>
        <div className="flex gap-4">
          {post?.author?._id == user?.id && (
            <>
              <BiEdit
                className="hover:cursor-pointer hover:border-b"
                onClick={handleEdit}
              />
              <Popconfirm
                title="Delete the Post"
                description="Are you sure to delete this?"
                onConfirm={() => {
                  handleDelete(post._id);
                }}
                okButtonProps={{ loading: isDeleteLoading }}
              >
                <MdDelete className="hover:cursor-pointer hover:border-b" />
              </Popconfirm>
            </>
          )}
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
