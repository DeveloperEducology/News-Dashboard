// export const API_BASE_URL = "http://localhost:4000/api";
export const API_BASE_URL = "https://twitterapi-node.onrender.com/api";
export const POSTS_PER_PAGE = 10;

export const ALL_CATEGORIES = [
  "General",
  "Politics",
  "Astrology",
  "Sports",
  "Entertainment",
  "Technology",
  "Business",
  "Education",
  "Health",
  "Science",
  "International",
  "National",
  "Crime",
  "Telangana",
  "AndhraPradesh",
  "Viral",
  "Photos",
  "Videos",
  "Lifestyle",
];

export const POST_TYPES = ["normal_post", "full_post", "youtube_video"];

export const DEFAULT_POST_STATE = {
  title: "",
  summary: "",
  text: "",
  url: "",
  imageUrl: "",
  videoUrl: "",
  source: "Manual",
  lang: "te",
  sourceType: "manual",
  categories: [],
  tags: [],
  isPublished: true,
  isBreaking: false,
  type: "normal_post",
  twitterUrl: "",
  relatedStories: [],
  scheduledFor: null,
  pinnedIndex: null,
  stackedImages: [], // ✅ ADDED: New field for stacked images
};