import { Avatar, Button, Form, Input, Popover, Spin, Popconfirm } from "antd";
import { useState } from "react";
import {
  BiEdit,
  BiDislike,
  BiLike,
  BiSolidDislike,
  BiSolidLike,
} from "react-icons/bi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { MdChevronRight, MdDelete, MdOutlineTurnRight } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";
import { useSelector, useDispatch } from "react-redux";
import {
  useCreateReplyMutation,
  useDeleteCommentMutation,
  useDislikeCommentMutation,
  useLikeCommentMutation,
  useUpdateCommentMutation,
} from "../api/CommentApi";
import { postsApi } from "../socketApi/SocketPostsApi";
import Reply from "./Reply";

function Comment({ comment, postId, refetchComments }) {
  const [form] = Form.useForm();
  const [replyInput, setReplyInput] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState(comment?.text || "");
  
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [likeComment, { isLoading: isLikingComment }] = useLikeCommentMutation();
  const [dislikeComment, { isLoading: isDislikingComment }] = useDislikeCommentMutation();
  const [deleteComment, { isLoading: isDeletingComment }] = useDeleteCommentMutation();
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation();
  const [createReply, { isLoading: isCreatingReply }] = useCreateReplyMutation();

  const replies = comment?.replies || [];
  const isCommentAuthor = comment?.author?._id === user?.id;
  const userLiked = comment?.userLiked;
  const userDisliked = comment?.userDisliked;

  const popOverContent = () => (
    <>
      <p className="text-sm text-gray-500">{comment?.author?.email}</p>
    </>
  );

  const toggleReplyInput = () => setReplyInput(!replyInput);
  
  const toggleShowReply = () => setShowReply(!showReply);

  const handleLikeComment = async () => {
    try {
      await likeComment(comment._id).unwrap();
      toast.success("Comment liked");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleDislikeComment = async () => {
    try {
      await dislikeComment(comment._id).unwrap();
      toast.success("Comment disliked");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleDeleteComment = async () => {
    try {
      dispatch(postsApi.util.invalidateTags([{ type: "Posts", id: "LIST" }]));
      await deleteComment(comment._id).unwrap();
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleEditComment = async () => {
    try {
      dispatch(postsApi.util.invalidateTags([{ type: "Posts", id: "LIST" }]));
      await updateComment({ commentId: comment._id, text: editText }).unwrap();
      setEditingCommentId(null);
      toast.success("Comment updated");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const onReplySubmit = async (values) => {
    try {
      if (!user) {
        toast.error("Please login to reply");
        return;
      }
      await createReply({
        commentId: comment._id,
        text: values.replay,
      }).unwrap();
      form.resetFields();
      setReplyInput(false);
      if (refetchComments) {
        await refetchComments();
      }
      toast.success("Reply added");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  return (
    <div className="border-l-2 border-gray-300 pl-4">
      {/* Main Comment */}
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-4 items-start">
          <div>
            <Popover content={popOverContent} arrow={true} placement="left">
              <Avatar size="large" shape="square" style={{ backgroundColor: "#87d068" }}>
                {comment?.author?.name?.[0] || "U"}
              </Avatar>
            </Popover>
          </div>
          
          {/*  Body */}
          <div className="flex-1">
            {editingCommentId === comment._id ? (
              // Toggle between edit and normal view
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 border rounded px-2 py-1"
                  placeholder="Edit comment..."
                />
                <button
                  onClick={handleEditComment}
                  disabled={isUpdatingComment}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {isUpdatingComment ? "..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setEditingCommentId(null);
                    setEditText(comment.text);
                  }}
                  className="px-3 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-sm text-[#F78D60]">{comment?.author?.name}</p>
                <p className="text-sm text-[#D2C1B6]">{comment?.text}</p>
              </div>
            )}
          </div>
        </div>

        {/*  Actions */}
        <div className="pl-16 flex text-gray-600 justify-between mt-2">
          {/*  Replies Button */}
          <div>
            {replies.length > 0 && (
              <div className="flex items-center gap-0.5 hover:cursor-pointer hover:text-blue-600 hover:border-b">
                <span className="text-xs">{replies.length}</span>
                {showReply ? (
                  <IoChevronUp onClick={toggleShowReply} />
                ) : (
                  <IoChevronDown onClick={toggleShowReply} />
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-3 items-center">
            <Spin spinning={isLikingComment}>
              <div
                className="flex gap-0.5 items-center hover:cursor-pointer hover:text-blue-600"
                onClick={handleLikeComment}
              >
                <span className="text-sm">{comment?.likes?.length || 0}</span>
                {userLiked ? <BiSolidLike /> : <BiLike />}
              </div>
            </Spin>
            
            <Spin spinning={isDislikingComment}>
              <div
                className="flex gap-0.5 items-center hover:cursor-pointer hover:text-red-600"
                onClick={handleDislikeComment}
              >
                <span className="text-sm">{comment?.dislikes?.length || 0}</span>
                {userDisliked ? <BiSolidDislike /> : <BiDislike />}
              </div>
            </Spin>
            
            <MdOutlineTurnRight
              className="hover:cursor-pointer hover:text-green-600"
              onClick={toggleReplyInput}
            />
            
            
            {isCommentAuthor && (
              <>
                <BiEdit
                  className="hover:cursor-pointer hover:text-purple-600"
                  onClick={() => setEditingCommentId(comment._id)}
                />
                <Popconfirm
                  title="Delete the Comment"
                  description="Are you sure to delete this?"
                  onConfirm={handleDeleteComment}
                >
                  <MdDelete className="hover:cursor-pointer hover:text-red-600" />
                </Popconfirm>
              </>
            )}
          </div>
        </div>

        {replyInput && (
          <div className="pl-0 sm:pl-12 mt-2">
            <Form
              name="replay_form"
              onFinish={onReplySubmit}
              form={form}
              variant="underlined"
              className="flex flex-row gap-3"
            >
              <Form.Item
                name="replay"
                rules={[{ required: true, message: "Reply can't be empty" }]}
                className="flex-1"
              >
                <Input placeholder="Write your reply......" style={{background:"none"}}/>
              </Form.Item>
              <Form.Item>
                <Spin spinning={isCreatingReply}>
                  <Button type="primary" htmlType="submit">
                    <MdChevronRight className="text-2xl" />
                  </Button>
                </Spin>
              </Form.Item>
              <Button
                variant="solid"
                color="danger"
                onClick={toggleReplyInput}
              >
                <RxCross2 className="text-2xl" />
              </Button>
            </Form>
          </div>
        )}

        {showReply && replies.length > 0 && (
          <div className="pl-0 sm:pl-4 mt-4 flex flex-col gap-3 border-l border-gray-200">
            {replies.map((reply) => (
              <Reply
                key={reply._id}
                reply={reply}
                refetchComments={refetchComments}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
