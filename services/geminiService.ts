
import { GoogleGenAI, Type } from "@google/genai";
import { Post, Comment, PostInsights, Story, Video, VideoInsights, Conversation, Message } from "../types";

// Initialize the Google GenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const POST_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      username: { type: Type.STRING },
      location: { type: Type.STRING },
      caption: { type: Type.STRING },
      likes: { type: Type.STRING },
      timeAgo: { type: Type.STRING }
    },
    required: ["id", "username", "location", "caption", "likes", "timeAgo"]
  }
};

const STORY_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      username: { type: Type.STRING }
    },
    required: ["id", "username"]
  }
};

export const fetchFeedPosts = async (): Promise<Post[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 10 realistic Instagram-style post descriptions. Themes: travel, tech, food, lifestyle, and art. Include usernames and locations.",
      config: {
        responseMimeType: "application/json",
        responseSchema: POST_SCHEMA
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((p: any) => ({
      ...p,
      mediaUrl: `https://picsum.photos/seed/${p.id}/1080/1350`,
      userAvatar: `https://picsum.photos/seed/${p.username}/150/150`,
    }));
  } catch (error) {
    console.error("Feed error:", error);
    return [];
  }
};

export const fetchUserPosts = async (username: string): Promise<Post[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 12 realistic social media post descriptions specifically for the user "${username}". The posts should reflect a consistent lifestyle (e.g., photographer, traveler, or chef).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: POST_SCHEMA
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((p: any) => ({
      ...p,
      username,
      mediaUrl: `https://picsum.photos/seed/${p.id}/1080/1080`,
      userAvatar: `https://picsum.photos/seed/${username}/150/150`,
    }));
  } catch (error) {
    return [];
  }
};

export const fetchUserReels = async (username: string): Promise<Video[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 9 realistic short-form vertical video (Reels) metadata for user "${username}". Include trendy titles and view counts like "1.2M".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              views: { type: Type.STRING },
              postedAt: { type: Type.STRING }
            },
            required: ["id", "title", "views", "postedAt"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || '[]');
    return data.map((v: any) => ({
      ...v,
      channelName: username,
      thumbnail: `https://picsum.photos/seed/reel-${v.id}/1080/1920`,
      channelAvatar: `https://picsum.photos/seed/${username}/100/100`,
      duration: '0:15'
    }));
  } catch (error) {
    return [];
  }
};

export const fetchUserProfile = async (username: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a profile bio for a social media user named "${username}". Include a short bio, follower count (e.g., "1.2M"), and following count.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            bio: { type: Type.STRING },
            followers: { type: Type.STRING },
            following: { type: Type.STRING },
            postCount: { type: Type.STRING }
          },
          required: ["bio", "followers", "following", "postCount"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { bio: "AI-powered account", followers: "0", following: "0", postCount: "0" };
  }
};

export const fetchFollowers = async (username: string): Promise<{ username: string; fullName: string; avatar: string }[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 15 followers for the user "${username}". For each follower, provide a unique username and a full name.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              username: { type: Type.STRING },
              fullName: { type: Type.STRING }
            },
            required: ["username", "fullName"]
          }
        }
      }
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((u: any) => ({
      ...u,
      avatar: `https://picsum.photos/seed/${u.username}/100/100`
    }));
  } catch (error) {
    return [];
  }
};

export const fetchConversations = async (): Promise<Conversation[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate a list of 8 realistic social media direct message conversations. Include username, a short catchy last message, and a timestamp.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              username: { type: Type.STRING },
              lastMessage: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              unread: { type: Type.BOOLEAN },
              isOnline: { type: Type.BOOLEAN }
            },
            required: ["id", "username", "lastMessage", "timestamp", "unread", "isOnline"]
          }
        }
      }
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((c: any) => ({
      ...c,
      userAvatar: `https://picsum.photos/seed/${c.username}/150/150`
    }));
  } catch (error) {
    return [];
  }
};

export const fetchChatHistory = async (username: string): Promise<Message[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic chat history of 6-8 messages between me (GeminiUser) and "${username}". The conversation should be friendly and casual. Some messages should be from me and some from them.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              sender: { type: Type.STRING },
              text: { type: Type.STRING },
              timestamp: { type: Type.STRING },
              isMe: { type: Type.BOOLEAN }
            },
            required: ["id", "sender", "text", "timestamp", "isMe"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    return [];
  }
};

export const fetchStories = async (): Promise<Story[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate 12 unique usernames for social media stories.",
      config: {
        responseMimeType: "application/json",
        responseSchema: STORY_SCHEMA
      }
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((s: any) => ({
      ...s,
      avatar: `https://picsum.photos/seed/${s.username}/150/150`,
    }));
  } catch (error) {
    return [];
  }
};

export const getPostComments = async (caption: string): Promise<Comment[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 5 trendy and realistic comments for a post with this caption: "${caption}". Use emojis and modern internet slang.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              author: { type: Type.STRING },
              text: { type: Type.STRING },
              likes: { type: Type.STRING },
              time: { type: Type.STRING }
            },
            required: ["author", "text", "likes", "time"]
          }
        }
      }
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((c: any, i: number) => ({
      ...c,
      id: `c-${i}`,
      avatar: `https://picsum.photos/seed/${c.author}/100/100`,
    }));
  } catch (error) {
    return [];
  }
};

// Advanced reasoning tasks use gemini-3-pro-preview.
export const getPostInsights = async (post: Post): Promise<PostInsights> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze this post: Caption: "${post.caption}". Location: "${post.location}". Provide a "vibe" description, 5 trending hashtags, and an engagement prediction (High/Medium/Low).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vibe: { type: Type.STRING },
            hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
            engagementPrediction: { type: Type.STRING }
          },
          required: ["vibe", "hashtags", "engagementPrediction"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { vibe: "Chilled", hashtags: [], engagementPrediction: "Medium" };
  }
};

export const searchVideos = async (query: string): Promise<Video[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 6 realistic video search results for the query: "${query}". Return as JSON array of video objects.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              channelName: { type: Type.STRING },
              views: { type: Type.STRING },
              postedAt: { type: Type.STRING },
              duration: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["id", "title", "channelName", "views", "postedAt", "duration", "description"]
          }
        }
      }
    });
    const data = JSON.parse(response.text || '[]');
    return data.map((v: any) => ({
      ...v,
      thumbnail: `https://picsum.photos/seed/${v.id}/640/360`,
      channelAvatar: `https://picsum.photos/seed/${v.channelName}/100/100`,
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
};

export const getVideoComments = async (title: string): Promise<Comment[]> => {
  return getPostComments(`Video: ${title}`);
};

// Advanced reasoning tasks use gemini-3-pro-preview.
export const getVideoInsights = async (video: Video): Promise<VideoInsights> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Provide AI analysis for this video: Title: "${video.title}". Description: "${video.description}". Include summary, key takeaways, and sentiment.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            keyTakeaways: { type: Type.ARRAY, items: { type: Type.STRING } },
            sentiment: { type: Type.STRING }
          },
          required: ["summary", "keyTakeaways", "sentiment"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Insights error:", error);
    return { summary: "Analysis unavailable.", keyTakeaways: [], sentiment: "Neutral" };
  }
};
