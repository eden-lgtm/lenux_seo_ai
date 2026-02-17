/**
 * WordPress API Client
 * Handles all WordPress REST API interactions
 */

import axios, { AxiosInstance } from "axios";

interface WordPressPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  status: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  meta?: {
    _yoast_wpseo_title?: string;
    _yoast_wpseo_metadesc?: string;
  };
}

interface CreatePostPayload {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  categories?: string[];
  status: "publish" | "draft" | "pending";
  featured_image_url?: string;
  seo_title?: string;
  seo_description?: string;
}

interface UpdatePostPayload {
  title?: string;
  content?: string;
  status?: "publish" | "draft" | "pending";
  seo_title?: string;
  seo_description?: string;
}

interface WordPressResponse {
  success: boolean;
  message: string;
  data?: any;
}

class WordPressClient {
  private client: AxiosInstance;
  private siteUrl: string;
  private username: string;
  private appPassword: string;

  constructor() {
    // Initialize from environment variables
    this.siteUrl = process.env.WORDPRESS_SITE_URL || "http://localhost";
    this.username = process.env.WORDPRESS_USERNAME || "admin";
    this.appPassword = process.env.WORDPRESS_APP_PASSWORD || "";

    // Create axios instance with WordPress REST API
    const credentials = Buffer.from(
      `${this.username}:${this.appPassword}`
    ).toString("base64");

    this.client = axios.create({
      baseURL: `${this.siteUrl}/wp-json/wp/v2`,
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });
  }

  async getPosts(
    search?: string,
    limit: number = 10,
    status: string = "publish"
  ): Promise<WordPressPost[]> {
    try {
      const params: any = {
        per_page: limit,
        status,
      };

      if (search) {
        params.search = search;
      }

      const response = await this.client.get("/posts", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  }

  async createPost(payload: CreatePostPayload): Promise<WordPressResponse> {
    try {
      const postData: any = {
        title: payload.title,
        content: payload.content,
        status: payload.status,
        excerpt: payload.excerpt || "",
      };

      // Handle categories
      if (payload.categories && payload.categories.length > 0) {
        // First, get or create categories
        postData.categories = payload.categories;
      }

      // Handle tags
      if (payload.tags && payload.tags.length > 0) {
        // First, get or create tags
        postData.tags = payload.tags;
      }

      // Handle SEO metadata (Yoast SEO)
      if (payload.seo_title || payload.seo_description) {
        postData.meta = {
          _yoast_wpseo_title: payload.seo_title || payload.title,
          _yoast_wpseo_metadesc:
            payload.seo_description || payload.excerpt || "",
        };
      }

      const response = await this.client.post("/posts", postData);

      // Handle featured image if provided
      if (payload.featured_image_url) {
        await this.setFeaturedImage(response.data.id, payload.featured_image_url);
      }

      return {
        success: true,
        message: "Post created successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error creating post:", error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create post",
        data: error.response?.data,
      };
    }
  }

  async updatePost(
    postId: number,
    payload: UpdatePostPayload
  ): Promise<WordPressResponse> {
    try {
      const updateData: any = {};

      if (payload.title) updateData.title = payload.title;
      if (payload.content) updateData.content = payload.content;
      if (payload.status) updateData.status = payload.status;

      // Handle SEO metadata
      if (payload.seo_title || payload.seo_description) {
        updateData.meta = {
          _yoast_wpseo_title: payload.seo_title,
          _yoast_wpseo_metadesc: payload.seo_description,
        };
      }

      const response = await this.client.post(`/posts/${postId}`, updateData);

      return {
        success: true,
        message: "Post updated successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error updating post:", error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update post",
        data: error.response?.data,
      };
    }
  }

  async deletePost(
    postId: number,
    force: boolean = false
  ): Promise<WordPressResponse> {
    try {
      const params = {
        force: force,
      };

      await this.client.delete(`/posts/${postId}`, { params });

      return {
        success: true,
        message: force
          ? "Post permanently deleted"
          : "Post moved to trash",
      };
    } catch (error: any) {
      console.error("Error deleting post:", error.response?.data || error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete post",
        data: error.response?.data,
      };
    }
  }

  private async setFeaturedImage(
    postId: number,
    imageUrl: string
  ): Promise<boolean> {
    try {
      // Download image from URL and upload to media library
      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });

      const fileName = imageUrl.split("/").pop() || "featured-image.jpg";

      const uploadResponse = await this.client.post(
        "/media",
        imageResponse.data,
        {
          headers: {
            "Content-Type": imageResponse.headers["content-type"],
            "Content-Disposition": `attachment; filename="${fileName}"`,
          },
        }
      );

      // Set as featured image
      await this.client.post(`/posts/${postId}`, {
        featured_media: uploadResponse.data.id,
      });

      return true;
    } catch (error) {
      console.error("Error setting featured image:", error);
      return false;
    }
  }
}

// Export functions
const wpClient = new WordPressClient();

export async function getWordPressPosts(
  search?: string,
  limit: number = 10,
  status: string = "publish"
): Promise<WordPressResponse> {
  const posts = await wpClient.getPosts(search, limit, status);
  return {
    success: true,
    message: "Posts retrieved successfully",
    data: posts,
  };
}

export async function createWordPressPost(
  title: string,
  content: string,
  excerpt?: string,
  tags?: string[],
  categories?: string[],
  status: "publish" | "draft" | "pending" = "draft",
  featured_image_url?: string,
  seo_title?: string,
  seo_description?: string
): Promise<WordPressResponse> {
  return await wpClient.createPost({
    title,
    content,
    excerpt,
    tags,
    categories,
    status,
    featured_image_url,
    seo_title,
    seo_description,
  });
}

export async function updateWordPressPost(
  postId: number,
  title?: string,
  content?: string,
  status?: "publish" | "draft" | "pending",
  seo_title?: string,
  seo_description?: string
): Promise<WordPressResponse> {
  return await wpClient.updatePost(postId, {
    title,
    content,
    status,
    seo_title,
    seo_description,
  });
}

export async function deleteWordPressPost(
  postId: number,
  force: boolean = false
): Promise<WordPressResponse> {
  return await wpClient.deletePost(postId, force);
}
