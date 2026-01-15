import { Avatar, Popover, Popconfirm } from "antd";
import { useState } from "react";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import { extractErrorMessage } from "../utils/common";
import { useSelector } from "react-redux";
import {
  useDeleteReplyMutation,
  useUpdateReplyMutation,
} from "../api/CommentApi";

function Reply({ reply, refetchComments }) {
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editText, setEditText] = useState(reply?.text || "");
  
  const { user } = useSelector((state) => state.auth);

  const [deleteReply, { isLoading: isDeletingReply }] = useDeleteReplyMutation();
  const [updateReply, { isLoading: isUpdatingReply }] = useUpdateReplyMutation();

  const isReplyAuthor = reply?.author?._id === user?.id;

  const handleDeleteReply = async () => {
    try {
      await deleteReply(reply._id).unwrap();
      if (refetchComments) {
        await refetchComments();
      }
      toast.success("Reply deleted");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const handleUpdateReply = async () => {
    try {
      await updateReply({ replyId: reply._id, text: editText }).unwrap();
      setEditingReplyId(null);
      if (refetchComments) {
        await refetchComments();
      }
      toast.success("Reply updated");
    } catch (error) {
      toast.error(extractErrorMessage(error));
    }
  };

  const authorPopoverContent = (
    <>
      <p className="font-semibold">{reply?.author?.name}</p>
      <p className="text-sm text-gray-500">{reply?.author?.email}</p>
    </>
  );

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex gap-4 items-start">
        <div>
          <Popover content={authorPopoverContent} arrow={true} placement="left">
            <Avatar size="large" shape="square">
              {reply?.author?.name?.[0] || "U"}
            </Avatar>
          </Popover>
        </div>
        
        <div className="flex-1">
          {editingReplyId === reply._id ? (
            // Edit Mode
            <div className="flex gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="flex-1 border rounded px-2 py-1"
                placeholder="Edit reply..."
              />
              <button
                onClick={handleUpdateReply}
                disabled={isUpdatingReply}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                {isUpdatingReply ? "..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditingReplyId(null);
                  setEditText(reply.text);
                }}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-sm">{reply?.author?.name}</p>
              <p className="text-sm">{reply?.text}</p>
              
              {isReplyAuthor && (
                <div className="flex gap-4 items-center mt-2 text-sm">
                  <BiEdit
                    className="hover:cursor-pointer hover:text-purple-600"
                    onClick={() => {
                      setEditingReplyId(reply._id);
                      setEditText(reply.text);
                    }}
                  />
                  <Popconfirm
                    title="Delete the Reply"
                    description="Are you sure to delete this?"
                    onConfirm={handleDeleteReply}
                  >
                    <MdDelete className="hover:cursor-pointer hover:text-red-600" />
                  </Popconfirm>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reply;
