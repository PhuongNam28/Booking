import React, { useState } from "react";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import EmojiPicker from "emoji-picker-react";
import Image from "next/image";

interface Props {
  sendMessage: () => void;
  message: string;
  setMessage: (message: string) => void;
  image: string | null;
  setImage: (image: string | null) => void;
}

function MessageInput({
  sendMessage,
  message,
  setMessage,
  image,
  setImage,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);

  // Initialize storage object
  const storage = getStorage(app);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Display image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected.");
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Error uploading file:", error.message);
      },
      () => {
        // Upload complete, get download URL and log it
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          // Reset file state and update message with download URL
          setFile(null);
          setImage(downloadURL);
          // Clear image preview
          setImagePreview(null);
          document.getElementById("my_modal_3")?.closest;
        });
      }
    );
  };

  const handleEmojiClick = (emojiData: any, event: any) => {
    // Append the selected emoji to the message state
    const newMessage = message + emojiData.emoji;
    setMessage(newMessage);
  };

  return (
    <div className="relative flex items-center p-4 border-t border-gray-200">
      <FaPaperclip
        onClick={() =>
          (
            document.getElementById("my_modal_3") as HTMLDialogElement
          ).showModal()
        }
        className={`${
          image ? "text-blue-500" : "text-gray-500"
        } mr-2 cursor-pointer`}
      />
      {/* Emoji Picker Button */}
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type a message..."
        className="flex-1 border-none p-2 outline-none"
      />

      <FaPaperPlane
        onClick={() => sendMessage()}
        className="text-blue-500 cursor-pointer ml-2"
      />

      {showEmojiPicker && (
        <div className="absolute right-0 bottom-full p-2">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      {/* Image Upload Modal */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {imagePreview && (
              <Image
                src={imagePreview}
                alt="Uploaded"
                className="mb-4"
                width={60}
                height={60}
              />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div
              onClick={() => {
                handleUpload();
              }}
              className="btn btn-sm btn-primary"
            >
              Upload
            </div>
            <progress value={uploadProgress ?? 0} max="100"></progress>
          </form>
          <button
            onClick={() =>
              (
                document.getElementById("my_modal_3") as HTMLDialogElement
              ).close()
            }
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>
        </div>
      </dialog>
    </div>
  );
}

export default MessageInput;
