import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../auth/auth.store";
import { ITag } from "../types/posts.types";
import { useRef, useState } from "react";
import { ArrowUpFromLine, Minus, Paperclip, Plus, Send } from "lucide-react";
import { CustomAlert } from "../../../utils";
import { useCreatePostMutation } from "../api/educators.mutations";
import { NavLink } from "react-router-dom";

const postSchema = z.object({
  title: z.string().nonempty({ message: "Title is required" }),
  content: z.string().nonempty({ message: "Content is required" }),
  tagsIds: z.array(z.string()).max(5, {
    message: "You can only select up to 5 tags",
  }),
  images: z
    .any()
    .refine(
      (files) => Array.isArray(files) && files.length <= 4,
      "You can only upload up to 4 images"
    ),
});

type FormSchema = z.infer<typeof postSchema>;

interface Props {
  tags: ITag[];
}

export const CreatePostForm = ({ tags }: Props) => {
  const user = useAuthStore((state) => state.user);
  const { mutate: createPost, isPending } = useCreatePostMutation();
  const [formVisible, setFormVisible] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      tagsIds: [],
      images: [],
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTags, setShowTags] = useState(false);

  const onSubmit = async (data: FormSchema) => {
    try {
      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("content", data.content);

      formData.append("tagsIds", JSON.stringify(data.tagsIds));

      if (data.images && data.images.length > 0) {
        data.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      createPost(formData, {
        onSuccess: () => {
          CustomAlert.toast("success", "Post created successfully!");
          reset(); // limpia el formulario si todo salió bien
          setFormVisible(false); // oculta el formulario
        },
        onError: () => {
          console.error("Error creating post");
          CustomAlert.toast("error", "Error posting post");
        },
      });
    } catch (error) {
      console.error("Error al crear post:", error);
    }
  };

  const selectedTags = watch("tagsIds");
  const uploadedImages = watch("images");

  const toggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter((t) => t !== tagId)
      : selectedTags.length < 5
      ? [...selectedTags, tagId]
      : selectedTags;
    setValue("tagsIds", updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const current = uploadedImages || [];

    if (files.length + current.length > 4) {
      CustomAlert.alert("error", {
        description: "You can only upload up to 4 images",
      });
      return;
    }

    // Guardar directamente los objetos File
    setValue("images", [...current, ...files]);
  };

  const toggleForm = () => {
    setFormVisible((prev) => !prev);
  };

  return (
    <div className="mb-4 bg-white p-4 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row gap-2">
        <NavLink
          to={`/educators/posts/author/${user?.educatorId}`}
          title="View profile"
        >
          <img
            src={user?.profilePicture}
            alt={user?.fullName}
            className="w-10 h-10 rounded-full inline-block"
          />
        </NavLink>
        <div className="w-full">
          {formVisible ? (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-2 w-full"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Title"
                    {...register("title")}
                    className="form-control font-medium"
                    disabled={isPending}
                  />
                  {errors.title && (
                    <div className="text-red-500 text-xs">
                      {errors.title.message}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={toggleForm}
                  className="bg-gray-100 text-gray-600 px-3 py-2 rounded-md text-sm text-center hover:bg-gray-200 hover:text-gray-700 transition"
                  title="Hide form"
                >
                  <ArrowUpFromLine className="w-4 h-4 inline-block" />
                </button>
              </div>

              <textarea
                placeholder="What's on your mind?"
                rows={4}
                {...register("content")}
                className="form-control resize-none"
                disabled={isPending}
              />
              {errors.content && (
                <div className="text-red-500 text-xs">
                  {errors.content.message}
                </div>
              )}

              {/* Tags */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs text-gray-500 block">
                    Add tags (max. 5)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTags((prev) => !prev)}
                    className="text-xs text-main-400 underline"
                  >
                    {showTags || selectedTags.length > 0 ? (
                      <span className="flex items-center">
                        <Minus className="w-4 h-4 me-1" /> Hide
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Plus className="w-4 h-4 me-1" /> Show
                      </span>
                    )}
                  </button>
                </div>
                {(showTags || selectedTags.length > 0) && (
                  <>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tags?.map((tag) => (
                        <button
                          type="button"
                          disabled={isPending}
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`px-2 py-1 rounded-full text-xs ${
                            selectedTags.includes(tag.id)
                              ? "bg-main-400 text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          #{tag.name}
                        </button>
                      ))}
                    </div>
                    {errors.tagsIds && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.tagsIds.message}
                      </div>
                    )}
                  </>
                )}

                {errors.tagsIds && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.tagsIds.message}
                  </div>
                )}
              </div>

              {/* Imágenes */}
              <div className=" gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-main-400 text-sm rounded-md hover:text-main-500 transition my-2"
                  title="Add images"
                  disabled={isPending}
                >
                  <Paperclip className="w-4 h-4 inline-block mr-2" />
                  Add images (max. 4)
                </button>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <div className="flex gap-2 my-2">
                  {uploadedImages?.map((file: File, index: number) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={URL.createObjectURL(file)} // ✅ se genera en tiempo real
                        alt={`preview-${index}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() =>
                          setValue(
                            "images",
                            uploadedImages.filter(
                              (_: any, i: number) => i !== index
                            )
                          )
                        }
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                {errors.images && (
                  <div className="text-red-500 text-xs mt-1">
                    {errors.images.message?.toString()}
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="bg-gray-200 text-gray-600 px-5 py-2 rounded-md text-sm text-center"
                  title="Reset form"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className=" bg-main-400 text-white px-5 py-2 rounded-md text-sm text-center disabled:opacity-50"
                  disabled={!watch("title") || !watch("content") || isPending}
                  title="Post your content"
                >
                  <Send className="w-4 h-4 inline-block mr-2" />
                  Post
                </button>
              </div>
            </form>
          ) : (
            <button
              title="Create a post"
              onClick={toggleForm}
              className="bg-gray-100 hover:bg-gray-200 transition text-gray-400 p-2 h-full rounded-lg text-sm w-full text-start"
            >
              What's on your mind?
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
