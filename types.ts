
export interface Post {
  id: string;
  username: string;
  userAvatar: string;
  location: string;
  mediaUrl: string;
  caption: string;
  likes: string;
  timeAgo: string;
  isLiked?: boolean;
}

export interface Story {
  id: string;
  username: string;
  avatar: string;
  hasSeen?: boolean;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: string;
  time: string;
  replies?: Comment[];
}

export interface PostInsights {
  vibe: string;
  hashtags: string[];
  engagementPrediction: string;
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  channelName: string;
  channelAvatar: string;
  views: string;
  postedAt: string;
  duration?: string;
  description?: string;
}

export interface VideoInsights {
  summary: string;
  keyTakeaways: string[];
  sentiment: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  username: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  isOnline: boolean;
}
