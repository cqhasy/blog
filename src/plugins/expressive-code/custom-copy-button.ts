import { definePlugin } from "@expressive-code/core";
import { h } from "hastscript";
import type { Element } from "hast";

export function pluginCustomCopyButton() {
	return definePlugin({
		name: "Reading code toolbar",
		hooks: {
			postprocessRenderedBlockGroup: ({ renderData }) => {
				function visit(node: Element) {
					const pre = node.children.find((child): child is Element => child.type === "element" && child.tagName === "pre");
					if (pre) {
						const language = String(pre.properties["data-language"] || pre.properties.dataLanguage || "text");
						const icon = (className: string, d: string) => h("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", ariaHidden: "true" }, [h("path", { d })]);
						const toolbar = h("div.code-toolbar", { "data-pagefind-ignore": true }, [
							h("span.code-language", language),
							h("button.copy-btn", { type: "button", "aria-label": "复制代码", title: "复制代码" }, [
								icon("copy-icon", "M9 9h11v12H9z M15 5V2H3v14h3"),
								icon("success-icon", "m5 12 4 4L19 6"),
								h("span.copy-feedback", { role: "status" }),
							]),
						]);
						node.children.splice(node.children.indexOf(pre), 0, toolbar);
						return;
					}
					for (const child of node.children) if (child.type === "element") visit(child);
				}
				visit(renderData.groupAst);
			},
		},
	});
}
