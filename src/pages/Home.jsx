import { Button, Form, Input, Modal, Spin, Empty, Tabs } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../api/PostApi";
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

  if (isPostsLoading) return <Spin />;

  const items = [
    { key: "1", label: "Newest" },
    { key: "2", label: "Most Liked" },
    { key: "3", label: "Most Disliked" }
  ];

  return (
    <div className="p-5 flex gap-3 flex-col w-full h-full">
      <div className="flex justify-between items-center">
        <Tabs defaultActiveKey={sortBy} items={items} onChange={tabOnchange} />
        <Button onClick={handleLogout} loading={isLoggingOut} danger>
          Logout
        </Button>
      </div>

      {data?.posts && data.posts.length > 0 ? (
        <>
          {data.posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              setInitialValue={setInitialValue}
              setIsModalOpen={setIsModalOpen}
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
      
      <Button onClick={showModal}>Create Post</Button>

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
              <Button type="primary" htmlType="submit" loading={isLoading || isUpdateLoading}>
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
