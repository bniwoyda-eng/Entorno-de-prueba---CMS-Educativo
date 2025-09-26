import { Image, Paperclip, Minus, Save } from "lucide-react";
import { useRef, useState } from "react";
import {
  useGetQuestionImage,
  useRemoveQuestionImage,
  useUploadQuestionImage,
} from "../hooks/questions.hooks";
import { CustomAlert } from "../../../utils";

export const QuestionImage = ({ questionId }: { questionId: string }) => {
  const { data: questionImage, isLoading } = useGetQuestionImage(questionId);
  const { mutate: uploadQuestionImage, isPending: isUploading } =
    useUploadQuestionImage();
  const { mutate: removeQuestionImage, isPending: isRemoving } =
    useRemoveQuestionImage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isPending = isUploading || isRemoving;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        CustomAlert.toast("error", "Image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        CustomAlert.toast("error", "Please select a valid image file");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Upload Image",
      description: "Are you sure you want to upload the image?",
    });
    if (!isConfirmed) return;

    uploadQuestionImage(
      { id: questionId, file: selectedFile },
      {
        onSuccess: () => {
          CustomAlert.toast("success", "Image uploaded successfully!");
          setSelectedFile(null);
          // Reset file input
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: (error) => {
          console.error("Error uploading image:", error);
          CustomAlert.toast("error", "Error uploading image");
        },
      }
    );
  };

  const handleRemove = async () => {
    const { isConfirmed } = await CustomAlert.confirm({
      title: "Remove Image",
      description: "Are you sure you want to remove the image?",
    });
    if (!isConfirmed) return;
    removeQuestionImage(questionId, {
      onSuccess: () => {
        CustomAlert.toast("success", "Image removed successfully!");
      },
      onError: (error) => {
        console.error("Error removing image:", error);
        CustomAlert.toast("error", "Error removing image");
      },
    });
  };

  const cancelSelection = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="card">
        <h1 className="card-title flex items-center">
          <Image className="w-4 h-4 mr-2 inline-block" />
          Question Image
        </h1>
        <div className="flex-center h-32">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h1 className="card-title flex items-center">
        <Image className="w-4 h-4 mr-2 inline-block" />
        Question Image
      </h1>

      <div>
        {/* Current Image Display */}
        {questionImage && questionImage.trim() !== "" && (
          <div className="space-y-3 mt-2">
            <div className="relative">
              <img
                src={questionImage}
                alt="Question"
                className="max-w-full object-cover rounded-md border"
                onError={(e) => {
                  console.error("Error loading image:", questionImage);
                  // Hide the image if it fails to load
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500 text-white px-3 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-red-600 transition-colors"
              disabled={isPending}
              title="Remove current image"
            >
              <Minus className="w-4 h-4" />
              Remove Image
            </button>
          </div>
        )}

        {/* Upload Section */}
        {(!questionImage || questionImage.trim() === "") && (
          <div>
            {/* File Selection */}
            <div className="flex items-center gap-2 my-5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-main-400 text-sm rounded-md hover:text-main-500 transition flex items-center gap-2"
                disabled={isPending}
                title="Select image"
              >
                <Paperclip className="w-4 h-4" />
                Select Image
              </button>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="hidden"
              />
            </div>

            {/* Selected File Preview */}
            {selectedFile && (
              <div className="space-y-3 mb-2">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={cancelSelection}
                    className="bg-gray-200 text-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition-colors"
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="bg-main-400 text-white px-4 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-main-500 transition-colors disabled:opacity-50"
                    disabled={isPending}
                    title="Upload image"
                  >
                    <Save className="w-4 h-4" />
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </div>
            )}

            {/* Upload Guidelines */}
            <div className="text-xs text-gray-500">
              <p>Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, Web</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
