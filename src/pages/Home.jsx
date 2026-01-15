import { Button, Form, Input, Modal, Pagination, Spin, Empty } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useCreatePostMutation,
  useDeletePostMutation,
  useDislikePostMutation,
  useLikePostMutation,
  useUpdatePostMutation,
} from "../api/PostApi";
import { useGetPostsQuery } from "../socketApi/SocketPostsApi";
import PostCard from "../components/PostCard";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";

function Home() {
  const { user } = useSelector((state) => state.auth);
  const [cursor, setCursor] = useState(null);
  const [initialValue, setInitialValue] = useState({
    title: null,
    body: null,
    postId: null,
  });
  const [sort, setSort] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createPost, { isLoading }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdateLoading }] = useUpdatePostMutation();

  const {
    data,
    isLoading: isPostsLoading,
    isFetching,
  } = useGetPostsQuery(
    {
      cursor,
      currentUserId: user?._id,
      sort,
    },
    { skip: !user }
  );

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setInitialValue({ title: null, body: null, postId: null });
  };
  const [form] = Form.useForm();
  async function onFinish(v) {
    console.log("V", v);
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
      handleOk();
      toast.success(`Post ${v?.postId ? "Updated" : "Created"} `);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  }

  const handleLoadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  if (isPostsLoading) return <Spin />;

  return (
    <div className="p-5 flex gap-3 flex-col w-full h-full">
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
      <Modal
        title="Creat Post"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        destroyOnHidden={true}
        footer={false}
        loading={isLoading || isUpdateLoading}
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
              <Input value={initialValue.postId}></Input>
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
            <Input></Input>
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
            <Input.TextArea></Input.TextArea>
          </Form.Item>
          <Form.Item>
            <div className="flex justify-center gap-4">
              <Button type="primary" htmlType="submit">
                {initialValue.title || initialValue.body ? "Update" : "Submit"}
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
