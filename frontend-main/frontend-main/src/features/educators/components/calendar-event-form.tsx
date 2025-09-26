import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { Minus, Paperclip, Plus, Save } from "lucide-react";
import { CustomAlert } from "../../../utils";
import {
  useCreateCalendarEventMutation,
  useUpdateCalendarEventMutation,
  useDeleteCalendarEventMutation,
  useDeleteCalendarEventImageMutation,
} from "../api/educators.mutations";
import { useCalendarEvent, useTags } from "../api/educators.queries";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const postSchema = z
  .object({
    title: z.string().nonempty({ message: "Title is required" }).max(50, {
      message: "Title cannot exceed 50 characters",
    }),
    description: z.string().nonempty({ message: "Description is required" }),
    eventUrl: z.string().optional(),
    startDate: z
      .date({ required_error: "Start date is required" })
      .min(new Date(), {
        message: "Start date cannot be in the past",
      }),
    endDate: z.date({ required_error: "End date is required" }),
    tagsIds: z.array(z.string()).max(5, {
      message: "You can only select up to 5 tags",
    }),
    image: z
      .instanceof(File)
      .optional()
      .refine((file) => !file || file.size <= 5 * 1054 * 1024, {
        message: "Image must be less than 5MB",
      }),
  })
  .refine((data) => data.endDate > data.startDate, {
    path: ["endDate"],
    message: "End date must be after start date",
  });

type FormSchema = z.infer<typeof postSchema>;

interface Props {
  calendarEventId?: string | null;
  handleClose?: () => void; // Optional prop to close the modal
}

export const CalendarEventForm = ({ calendarEventId, handleClose }: Props) => {
  const { mutate: create, isPending: creating } =
    useCreateCalendarEventMutation();
  const { mutate: update, isPending: updating } =
    useUpdateCalendarEventMutation();
  const { mutate: deleteEvent, isPending: deleting } =
    useDeleteCalendarEventMutation();
  const { mutate: deleteImage, isPending: deletingImage } =
    useDeleteCalendarEventImageMutation();

  const { data: calendarEvent, isLoading } = useCalendarEvent(
    calendarEventId || ""
  );

  const [wantsToDelete, setWantsToDelete] = useState(false);

  const isPending =
    creating || updating || deleting || wantsToDelete || deletingImage;

  const { data: tags } = useTags();

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
      description: "",
      eventUrl: "",
      startDate: undefined,
      endDate: undefined,
      image: undefined,
      tagsIds: [],
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showTags, setShowTags] = useState(false);

  useEffect(() => {
    if (calendarEvent) {
      reset({
        title: calendarEvent.title,
        description: calendarEvent.description,
        eventUrl: calendarEvent.eventUrl || "",
        startDate: new Date(calendarEvent.startDate),
        endDate: new Date(calendarEvent.endDate),
        tagsIds: calendarEvent.calendarEventTags.map((tag) => tag.tag.id),
        image: undefined,
      });
    }
  }, [calendarEvent, reset]);

  const onSubmit = async (data: FormSchema) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("startDate", data.startDate.toISOString());
      formData.append("eventUrl", data.eventUrl || "");
      formData.append("endDate", data.endDate.toISOString());

      if (data.image) {
        formData.append("image", data.image);
      }

      formData.append("tagsIds", JSON.stringify(data.tagsIds));

      if (calendarEventId) {
        update(
          { eventId: calendarEventId, calendarEvent: formData },
          {
            onSuccess: () => {
              CustomAlert.toast(
                "success",
                "Calendar event updated successfully!"
              );
              reset();
              if (handleClose) {
                handleClose();
              }
            },
            onError: () => {
              console.error("Error updating calendar event");
              CustomAlert.toast("error", "Error updating event");
            },
          }
        );
      } else {
        create(formData, {
          onSuccess: () => {
            CustomAlert.toast(
              "success",
              "Calendar event created successfully!"
            );
            reset();
            if (handleClose) {
              handleClose();
            }
          },
          onError: () => {
            console.error("Error creating calendar event");
            CustomAlert.toast("error", "Error creating event");
          },
        });
      }
    } catch (error) {
      console.error("Error al enviar evento:", error);
    }
  };

  const selectedTags = watch("tagsIds");
  const uploadedImage = watch("image");

  const toggleTag = (tagId: string) => {
    const updated = selectedTags.includes(tagId)
      ? selectedTags.filter((t) => t !== tagId)
      : selectedTags.length < 5
      ? [...selectedTags, tagId]
      : selectedTags;
    setValue("tagsIds", updated);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        CustomAlert.toast("error", "Image must be less than 5MB");
        return;
      }
      setValue("image", file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-center h-32">
        <div className="loader"></div>
      </div>
    );
  }

  const handleWantsDelete = async () => {
    if (!calendarEventId) return;
    setWantsToDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!calendarEventId) return;
    try {
      deleteEvent(calendarEventId, {
        onSuccess: () => {
          CustomAlert.toast("success", "Calendar event deleted successfully!");
          reset();
          if (handleClose) {
            handleClose();
          }
        },
        onError: () => {
          console.error("Error deleting calendar event");
          CustomAlert.toast("error", "Error deleting event");
        },
      });
      setWantsToDelete(false);
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      CustomAlert.toast("error", "Error deleting event");
    }
  };

  const handleDeleteImage = () => {
    if (!calendarEventId) return;
    deleteImage(calendarEventId, {
      onSuccess: () => {
        CustomAlert.toast("success", "Image removed successfully!");
        setValue("image", undefined);
      },
      onError: () => {
        console.error("Error deleting image");
        CustomAlert.toast("error", "Error removing image");
      },
    });
  };

  return (
    <div className="p-1">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 w-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex-1">
            <label className="text-sm text-gray-500 block mb-1" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter event title"
              {...register("title")}
              className="form-control font-medium"
              disabled={isPending}
            />
            {errors.title && (
              <div className="text-red-500 text-xs">{errors.title.message}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-sm text-gray-500 block mb-1">
              Start Date
            </label>
            <DatePicker
              selected={watch("startDate")}
              onChange={(date) => setValue("startDate", date as Date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd-MM-yyyy HH:mm"
              placeholderText="Start Date"
              className="form-control"
              wrapperClassName="w-full"
              disabled={isPending}
              minDate={new Date()} // Prevent past dates
            />
            {errors.startDate && (
              <div className="text-red-500 text-xs mt-1">
                {errors.startDate.message}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-500 block mb-1">End Date</label>
            <DatePicker
              selected={watch("endDate")}
              onChange={(date) => setValue("endDate", date as Date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd-MM-yyyy HH:mm"
              placeholderText="End Date"
              className="form-control"
              wrapperClassName="w-full"
              disabled={isPending}
              minDate={watch("startDate") || new Date()}
            />
            {errors.endDate && (
              <div className="text-red-500 text-xs mt-1">
                {errors.endDate.message}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <label className="text-sm text-gray-500 block">Description</label>
        <textarea
          placeholder="What is this event about?"
          rows={4}
          {...register("description")}
          className="form-control resize-none mt-0"
          disabled={isPending}
        />
        {errors.description && (
          <div className="text-red-500 text-xs">
            {errors.description.message}
          </div>
        )}

        {/* Event URL */}
        <div className="mt-2">
          <label className="text-sm text-gray-500 block mb-1">
            Event URL (optional)
          </label>
          <input
            type="text"
            placeholder="https://example.com/event"
            {...register("eventUrl")}
            className="form-control"
            disabled={isPending}
          />
          {errors.eventUrl && (
            <div className="text-red-500 text-xs mt-1">
              {errors.eventUrl.message}
            </div>
          )}
        </div>

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
        {calendarEvent?.bannerUrl ? (
          <button
            type="button"
            onClick={handleDeleteImage}
            className="bg-red-500 text-white px-3 py-1 rounded-md text-xs"
            disabled={isPending}
            title="Remove current image"
          >
            <Minus className="w-4 h-4 inline-block mr-1" />
            Remove current image
          </button>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-main-400 text-sm rounded-md hover:text-main-500 transition my-2"
                title="Add image"
                disabled={isPending}
              >
                <Paperclip className="w-4 h-4 inline-block mr-2" />
                Add image
              </button>
              {uploadedImage && (
                <button
                  type="button"
                  onClick={() => setValue("image", undefined)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-xs"
                  disabled={isPending}
                  title="Remove image"
                >
                  <Minus className="w-4 h-4 inline-block mr-1" />
                  Remove image
                </button>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </div>

            {uploadedImage && (
              <div className="flex items-center gap-2">
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt="Uploaded"
                  className="max-w-32 h-16 object-cover rounded-md"
                />
                <span className="text-xs text-gray-500">
                  {uploadedImage.name} ({(uploadedImage.size / 1024).toFixed(2)}{" "}
                  KB)
                </span>
              </div>
            )}
            {errors.image && (
              <div className="text-red-500 text-xs mt-1">
                {errors.image.message?.toString()}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            onClick={
              wantsToDelete ? () => setWantsToDelete(false) : () => reset()
            }
            className="bg-gray-200 text-gray-600 px-5 py-2 rounded-md text-sm text-center"
            title="Reset form"
          >
            {wantsToDelete ? "Cancel" : "Reset"}
          </button>
          {!wantsToDelete ? (
            <>
              {calendarEventId && (
                <button
                  type="button"
                  onClick={handleWantsDelete}
                  className="bg-red-200 text-red-600 px-5 py-2 rounded-md text-sm text-center"
                  title="Reset form"
                >
                  Delete
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-red-500 text-white px-5 py-2 rounded-md text-sm text-center"
              title="Confirm delete"
            >
              <Minus className="w-4 h-4 inline-block mr-2" />
              Confirm delete
            </button>
          )}
          <button
            type="submit"
            className=" bg-main-400 text-white px-5 py-2 rounded-md text-sm text-center disabled:opacity-50"
            disabled={
              !watch("title") ||
              !watch("description") ||
              isPending ||
              wantsToDelete
            }
            title="Submit your calendar event"
          >
            <Save className="w-4 h-4 inline-block mr-2" />
            {calendarEventId ? "Update event" : "Create event"}
          </button>
        </div>
      </form>
    </div>
  );
};
