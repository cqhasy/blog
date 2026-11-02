import { type CollectionEntry, getCollection } from "astro:content";
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { getCategoryUrl } from "@utils/url-utils";

export type WritingCollection = "shares" | "notes";
export type WritingEntry = CollectionEntry<"shares"> | CollectionEntry<"notes">;

async function getRawSortedPosts(
	collection?: WritingCollection,
): Promise<WritingEntry[]> {
	const visible = ({ data }: WritingEntry) =>
		!import.meta.env.PROD || !data.draft;
	const allBlogPosts: WritingEntry[] = collection
		? await getCollection(collection, visible)
		: (
				await Promise.all([
					getCollection("shares", visible),
					getCollection("notes", visible),
				])
			).flat();

	const sorted = allBlogPosts.sort((a, b) => {
		// 首先按置顶状态排序，置顶文章在前
		if (a.data.pinned && !b.data.pinned) return -1;
		if (!a.data.pinned && b.data.pinned) return 1;

		// 如果置顶状态相同，则按发布日期排序
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateB.getTime() - dateA.getTime() || a.slug.localeCompare(b.slug);
	});
	return sorted;
}

export async function getSortedPosts(collection?: WritingCollection) {
	const sorted = await getRawSortedPosts(collection);
	// Previous/next navigation stays inside the entry's own collection.
	for (const name of ["shares", "notes"] as const) {
		const entries = sorted.filter((entry) => entry.collection === name);
		for (const [index, entry] of entries.entries()) {
			entry.data.nextSlug = entries[index - 1]?.slug || "";
			entry.data.nextTitle = entries[index - 1]?.data.title || "";
			entry.data.prevSlug = entries[index + 1]?.slug || "";
			entry.data.prevTitle = entries[index + 1]?.data.title || "";
		}
	}
	return sorted;
}
export type PostForList = {
	slug: string;
	collection: WritingCollection;
	data: WritingEntry["data"];
};
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// delete post.body
	const sortedPostsList = sortedFullPosts.map((post) => ({
		slug: post.slug,
		collection: post.collection,
		data: post.data,
	}));

	return sortedPostsList;
}
export type Tag = {
	name: string;
	count: number;
};

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getRawSortedPosts();

	const countMap: { [key: string]: number } = {};
	allBlogPosts.map((post: { data: { tags: string[] } }) => {
		post.data.tags.map((tag: string) => {
			if (!countMap[tag]) countMap[tag] = 0;
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export type Category = {
	name: string;
	count: number;
	url: string;
};

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getRawSortedPosts();
	const count: { [key: string]: number } = {};
	allBlogPosts.map((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}
