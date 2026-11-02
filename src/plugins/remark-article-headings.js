// The article template already renders its title as the page's h1.
export function remarkArticleHeadings() {
	return (tree, file) => {
		const filePath = file.path || "";
		if (!/[/\\]content[/\\](shares|notes)[/\\]/.test(filePath)) return;
		if (tree.children[0]?.type === "heading" && tree.children[0].depth === 1) {
			tree.children.shift();
		}
		for (const node of tree.children) {
			if (node.type === "heading" && node.depth === 1) node.depth = 2;
		}
	};
}
