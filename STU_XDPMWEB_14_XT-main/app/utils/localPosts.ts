export type DemoSocialPost = {
  id: number;
  user_id: number;
  username: string;
  avatar: string;
  caption: string;
  image: string;
  likes: number;
  comments: number;
  shares: number;
  privacy: "public" | "private";
  createdAt: string;
};

const LOCAL_POSTS_KEY = "gunverse_posts";

export const loadLocalPosts = (): DemoSocialPost[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const savedPosts = localStorage.getItem(LOCAL_POSTS_KEY);
    return savedPosts ? JSON.parse(savedPosts) : [];
  } catch (error) {
    console.error("Không đọc được bài viết local:", error);
    return [];
  }
};

export const saveLocalPosts = (posts: DemoSocialPost[]) => {
  localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(posts));
};

export const appendLocalPost = (post: DemoSocialPost) => {
  const savedPosts = loadLocalPosts();
  const nextPosts = [post, ...savedPosts].slice(0, 50);
  saveLocalPosts(nextPosts);
  return nextPosts;
};

export const toProfilePost = (post: DemoSocialPost) => ({
  id: post.id,
  user_id: post.user_id,
  caption: post.caption,
  images: [
    {
      image_url: post.image,
      public_url: post.image,
      is_thumbnail: true,
    },
  ],
  like_count: post.likes,
  comment_count: post.comments,
  share_count: post.shares,
  comments: [],
  status: "active" as const,
  username: post.username,
  avatar: post.avatar,
});