import { defineCollection, z } from "astro:content";

const postsCollection = defineCollection({
	schema: z.object({
		title: z.string(),
		published: z.date(),
		updated: z.date().optional(),
		draft: z.boolean().optional().default(false),
		description: z.string().optional().default(""),
		image: z.string().optional().default(""),
		tags: z.array(z.string()).optional().default([]),
		category: z.string().optional().default(""),
		lang: z.string().optional().default(""),

		/* For internal use */
		prevTitle: z.string().default(""),
		prevSlug: z.string().default(""),
		nextTitle: z.string().default(""),
		nextSlug: z.string().default(""),
	}),
});
const musicCollection = defineCollection({
	schema: z.object({
		category: z.string(), // 添加分类字段
		albums: z.array(
			z.object({
				title: z.string(),
				artist: z.string(),
				audio: z.string(), // 音频路径改为必填
				cover: z.string().optional(),
				rating: z.number().min(0).max(5).optional(),
				review: z.string().optional(),
				published: z.coerce.date().optional().default(new Date()),
			}),
		),
	}),
});

export const collections = {
	posts: postsCollection,
	music: musicCollection,
	// 新增spec集合
};
