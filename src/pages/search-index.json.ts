import type { APIRoute } from "astro";
import { getSortedPosts } from "../utils/content-utils";
import { getPostUrlBySlug } from "../utils/url-utils";

// Loaded only when search needs a fallback; article pages never embed full texts.
export const GET: APIRoute = async () => {
	const entries = await getSortedPosts();
	return new Response(
		JSON.stringify(
			entries.map((entry) => ({
				title: entry.data.title,
				url: getPostUrlBySlug(entry.slug, entry.collection),
				text: [entry.data.description, ...entry.data.tags, entry.body].join(
					" ",
				),
			})),
		),
		{ headers: { "Content-Type": "application/json; charset=utf-8" } },
	);
};
