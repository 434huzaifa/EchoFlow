import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Popconfirm,
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
import { MdChevronRight, MdDelete } from "react-icons/md";
import Comment from "./Comment";
import {
  useDeletePostMutation,
  useDislikePostMutation,
  useLikePostMutation,
} from "../api/PostApi";
import { useGetCommentsQuery } from "../socketApi/SocketCommentsApi";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";
import { useSelector } from "react-redux";
import { useCreateCommentMutation } from "../api/CommentApi";

function PostCard({ post, setInitialValue, setIsModalOpen }) {
  const [form] = Form.useForm();
  const [showComment, setShowComment] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const [createComment, { isLoading: isCommentLoading }] = useCreateCommentMutation();
  const [likePost, { isLoading: isLikeLoading }] = useLikePostMutation();
  const [dislikePost, { isLoading: isDisLikeLoading }] = useDislikePostMutation();
  const [deletePost, { isLoading: isDeleteLoading }] = useDeletePostMutation();

  // Fetch comments only when showComment is true
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isFetching: isCommentsFetching,
    refetch: refetchComments,
  } = useGetCommentsQuery({ postId: post._id }, { skip: !showComment });

  // Submit new comment
  async function onCommentSubmit(values) {
    if (!user) {
      toast.error("Please login to comment");
      return;
    }
    try {
      await createComment({
        text: values?.comment,
        post: post?._id,
      }).unwrap();
      form.resetFields();
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  const toggleComments = () => setShowComment(!showComment);

  const handleLike = async () => {
    try {
      await likePost(post._id).unwrap();
      toast.success("Post liked");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleDislike = async () => {
    try {
      await dislikePost(post._id).unwrap();
      toast.success("Post disliked");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleEdit = () => {
    setInitialValue({
      title: post?.title,
      body: post?.body,
      postId: post?._id,
    });
    setIsModalOpen(true);
  };

  // Check if user liked/disliked
  const userLiked = post?.likes?.includes(user?.id);
  const userDisliked = post?.dislikes?.includes(user?.id);
  const isAuthor = post?.author?._id === user?.id;

  return (
    <Card>
      <p className="text-2xl font-bold">{post.title}</p>
      <p className="text-xl">{post.body}</p>
      <p className="text-xs text-gray-500">
        {isAuthor ? "By Me" : `By ${post.author.name}`}
      </p>
      
      <Divider />
      
      <div className="flex justify-between text-xl">
        <div className="flex gap-4">
          <Spin spinning={isLikeLoading}>
            <div
              className="flex gap-0.5 items-center justify-center hover:cursor-pointer"
              onClick={handleLike}
            >
              <span>{post.likesCount}</span>
              {userLiked ? <BiSolidLike /> : <BiLike />}
            </div>
          </Spin>
          
          <Spin spinning={isDisLikeLoading}>
            <div
              className="flex gap-0.5 items-center justify-center hover:cursor-pointer"
              onClick={handleDislike}
            >
              <span>{post.dislikesCount}</span>
              {userDisliked ? <BiSolidDislike /> : <BiDislike />}
            </div>
          </Spin>
          
          <div
            className="flex gap-0.5 items-center justify-center text-lg hover:cursor-pointer"
            onClick={toggleComments}
          >
            <span>{post?.commentsCount}</span>
            {showComment ? (
              <BiSolidComment className="hover:cursor-pointer hover:border-b" />
            ) : (
              <BiComment className="hover:cursor-pointer hover:border-b" />
            )}
          </div>
        </div>
        
        {/* Author action */}
        {isAuthor && (
          <div className="flex gap-4">
            <BiEdit
              className="hover:cursor-pointer hover:border-b"
              onClick={handleEdit}
            />
            <Popconfirm
              title="Delete the Post"
              description="Are you sure to delete this?"
              onConfirm={handleDelete}
              okButtonProps={{ loading: isDeleteLoading }}
            >
              <MdDelete className="hover:cursor-pointer hover:border-b" />
            </Popconfirm>
          </div>
        )}
      </div>
      
      <Divider />
      
      {/* Comment Input hidden if already commented*/}
      {!post?.hasMyComment && (
        <Form
          name="comment_form"
          onFinish={onCommentSubmit}
          form={form}
          className="flex flex-row gap-3"
        >
          <Form.Item
            name="comment"
            rules={[{ required: true, message: "Comment can't be empty" }]}
            className="flex-1"
          >
            <Input placeholder="Write your thoughts......" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <MdChevronRight className="text-2xl" />
            </Button>
          </Form.Item>
        </Form>
      )}

      {showComment && (
        <Spin spinning={isCommentsLoading || isCommentsFetching}>
          <div className="flex flex-col gap-2 mt-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  refetchComments={refetchComments}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </Spin>
      )}
    </Card>
  );
}

export default PostCard;
