import {
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Empty,
  Tabs,
  Popover,
  Avatar,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCreatePostMutation, useUpdatePostMutation } from "../api/PostApi";
import { useGetPostsQuery } from "../socketApi/SocketPostsApi";
import PostCard from "../components/PostCard";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";
import { setSortBy } from "../slice/sortSlice";
import { useLogoutUserMutation } from "../api/UserApi";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useSelector((state) => state.auth);
  const { sortBy } = useSelector((state) => state.sort);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [cursor, setCursor] = useState(null);
  const [initialValue, setInitialValue] = useState({
    title: null,
    body: null,
    postId: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [createPost, { isLoading }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdateLoading }] = useUpdatePostMutation();
  const [logoutUser, { isLoading: isLoggingOut }] = useLogoutUserMutation();

  const {
    data,
    isLoading: isPostsLoading,
    isFetching,
    refetch: refetchPosts,
  } = useGetPostsQuery(
    {
      cursor,
      currentUserId: user?._id,
      sortBy,
    },
    { skip: !user }
  );

  const showModal = () => setIsModalOpen(true);

  const handleCancel = () => {
    setIsModalOpen(false);
    setInitialValue({ title: null, body: null, postId: null });
  };

  async function onFinish(v) {
    try {
      if (v?.postId) {
        await updatePost({
          postId: v?.postId,
          updatedPost: { title: v?.title, body: v?.body },
        }).unwrap();
        setInitialValue({ title: null, body: null, postId: null });
      } else {
        await createPost({
          title: v?.title,
          body: v?.body,
        }).unwrap();
      }
      form.resetFields();
      setIsModalOpen(false);
      toast.success(`Post ${v?.postId ? "Updated" : "Created"}`);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  const handleLoadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser({}).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  function tabOnchange(v) {
    setCursor(null);
    dispatch(setSortBy(v));
  }

  const popOverContent = () => (
    <div className="flex flex-col justify-center items-center gap-1">
      <p className="font-semibold">{user?.name}</p>
      <p className="text-sm text-gray-500">{user?.email}</p>
      <Button onClick={handleLogout} loading={isLoggingOut} danger>
        Logout
      </Button>
    </div>
  );
  return (
    <div className="p-5 flex gap-3 flex-col w-full h-full min-h-screen min-w-screen my-bg">
      <Spin fullscreen spinning={isPostsLoading} />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-0.5 sm:gap-2 sm:text-base text-xs">
          <div
            onClick={() => {
              if (sortBy !== "1") {
                tabOnchange("1");
              }
            }}
            className={`p-2  rounded-t-lg border  border-white ${
              sortBy == "1"
                ? "bg-green-400 text-black hover:cursor-default hover:text-black hover:border-blue-400"
                : "bg-none text-white hover:cursor-pointer hover:text-blue-300 hover:border-blue-400"
            }`}
          >
            Newest
          </div>
          <div
            onClick={() => {
              if (sortBy !== "2") {
                tabOnchange("2");
              }
            }}
            className={`p-2  rounded-t-lg border  border-white ${
              sortBy == "2"
                ? "bg-green-400 text-black hover:cursor-default hover:text-black hover:border-blue-400"
                : "bg-none text-white hover:cursor-pointer hover:text-blue-300 hover:border-blue-400"
            }`}
          >
            Most Liked
          </div>
          <div
            onClick={() => {
              if (sortBy !== "3") {
                tabOnchange("3");
              }
            }}
            className={`p-2  rounded-t-lg border  border-white ${
              sortBy == "3"
                ? "bg-green-400 text-black hover:cursor-default hover:text-black hover:border-blue-400"
                : "bg-none text-white hover:cursor-pointer hover:text-blue-300 hover:border-blue-400"
            }`}
          >
            Most Disliked
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center gap-0.5 sm:gap-3">
          <button
            className="text-xs sm:text-base p-1 sm:p-1.5 hover:text-blue-300 hover:border-blue-400 text-white border rounded-lg"
            onClick={showModal}
            variant="outlined"
            ghost
          >
            Create Post
          </button>
          <Popover content={popOverContent} arrow={true} placement="left">
            <Avatar
              size="large"
              shape="square"
              style={{ backgroundColor: "#87d068" }}
            >
              {user?.name?.[0] || "U"}
            </Avatar>
          </Popover>
        </div>
        {/*  */}
      </div>

      {data?.posts && data.posts.length > 0 ? (
        <>
          {data.posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              setInitialValue={setInitialValue}
              setIsModalOpen={setIsModalOpen}
              refetchPosts={refetchPosts}
            />
          ))}
          {data.nextCursor && (
            <Button onClick={handleLoadMore} loading={isFetching} block>
              Load More
            </Button>
          )}
        </>
      ) : (
        <Empty description="No posts found" />
      )}

      {/*Post Modal */}
      <Modal
        title="Create Post"
        open={isModalOpen}
        footer={false}
        onCancel={handleCancel}
      >
        <Form
          name="post_form"
          onFinish={onFinish}
          layout="vertical"
          form={form}
          initialValues={initialValue}
        >
          {initialValue.postId && (
            <Form.Item hidden name="postId">
              <Input />
            </Form.Item>
          )}
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Title is required" },
              { max: 50 },
              { min: 3 },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Body"
            name="body"
            rules={[
              { required: true, message: "Body is required" },
              { min: 1 },
              { max: 10000 },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-center gap-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading || isUpdateLoading}
              >
                {initialValue.postId ? "Update" : "Submit"}
              </Button>
              <Button color="danger" variant="solid" onClick={handleCancel}>
                Close
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default Home;
