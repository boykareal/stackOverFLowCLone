"use client"

import dynamic from "next/dynamic";

const RTE = dynamic(
    () => import("@uiw/react-markdown-editor").then(mod => {
        return mod.default
    }),
    {ssr: false}
);

// The editor package accesses browser APIs during rendering. Keep both editor
// surfaces client-only so question detail pages can render on the server.
export const MarkdownPreview = dynamic(
    () => import("@uiw/react-markdown-editor").then(mod => mod.default.Markdown),
    {ssr: false},
);

export default RTE;

