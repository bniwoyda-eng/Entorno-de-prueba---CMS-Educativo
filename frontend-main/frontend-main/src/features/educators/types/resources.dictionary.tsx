import { Archive, BookOpenText, NotebookPen, Video } from "lucide-react";
import { Resource } from "./resources.types";
import React from "react";

export const resourcesDictionary: Record<
  Resource,
  {
    title: string;
    description: string;
    icon: React.ReactNode;
    plural: string;
    singular: string;
  }
> = {
  activity: {
    title: "Activities",
    description: "Activities for the classroom",
    icon: <NotebookPen />,
    plural: "activities",
    singular: "activity",
  },
  article: {
    title: "Articles",
    description: "Articles for the classroom",
    icon: <BookOpenText />,
    plural: "articles",
    singular: "article",
  },
  video: {
    title: "Videos",
    description: "Videos for the classroom",
    icon: <Video />,
    plural: "videos",
    singular: "video",
  },
  other: {
    title: "Other",
    description: "Other resources for the classroom",
    icon: <Archive />,
    plural: "other",
    singular: "other",
  },
};

export const resourcesSingularDictionary: Record<string, string> = {
  activities: "activity",
  articles: "article",
  videos: "video",
  other: "other",
};
