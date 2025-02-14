import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import { ColoredTextNode } from "./nodes/ColoredTextNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import "./globals.css";


// Enhanced Placeholder component
function Placeholder() {
  return (
    <div className="absolute top-4 left-4 text-zinc-500 pointer-events-none">
      Enter your content here...
    </div>
  );
}

// Initial editor content as a JSON object
const initialContent = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "This is a test",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
};

// Plugin to initialize the editor content
function InitializeEditorPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const state = editor.parseEditorState(initialContent);
      editor.setEditorState(state);
    });
  }, [editor]);

  return null;
}

// Updated Editor configuration
const editorConfig = {
  theme: {
    root: 'bg-zinc-800 text-zinc-100 rounded-xl',
    paragraph: 'mb-4',
    heading: {
      h1: 'text-3xl font-bold mb-4',
      h2: 'text-2xl font-semibold mb-3',
      h3: 'text-xl font-medium mb-2',
    },
    list: {
      ul: 'list-disc ml-6 mb-4',
      ol: 'list-decimal ml-6 mb-4',
      listitem: 'mb-1',
    },
    quote: 'border-l-4 border-zinc-600 pl-4 italic my-4 text-zinc-300',
    code: 'bg-zinc-700 rounded px-2 py-1 font-mono text-sm',
    text: {
      bold: 'font-bold',
      italic: 'italic',
      underline: 'underline',
      strikethrough: 'line-through',
      underlineStrikethrough: 'underline line-through',
    },
  },
  onError(error) {
    throw error;
  },
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    ColoredTextNode, // Register the custom node here
  ],
};

// Enhanced CustomContentEditable component
function CustomContentEditable({ className, ...props }) {
  return (
    <ContentEditable
      className={`min-h-[300px] p-4 bg-zinc-800 text-zinc-100 rounded-b-xl  rounded-t-none
        border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
        transition-all duration-200 ${className}`}
      {...props}
    />
  );
}

// Main Editor component
export default function Editor() {
  const [editorState, setEditorState] = useState(null);

  useEffect(() => {
    // Load the saved editor state from localStorage
    const savedState = localStorage.getItem("editorState");
    if (savedState) {
      setEditorState(JSON.parse(savedState));
    }
  }, []);

  const handleEditorChange = (editorState) => {
    // Save the editor state to localStorage
    localStorage.setItem("editorState", JSON.stringify(editorState));
    console.log(editorState);
    setEditorState(editorState);
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-800/95 to-zinc-900  rounded-xl shadow-xl">
      <LexicalComposer initialConfig={editorConfig}>
        <InitializeEditorPlugin />
        <div className="bg-zinc-800/40 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-zinc-700/30">
          <ToolbarPlugin />
          <div className="relative">
            <RichTextPlugin
              contentEditable={<CustomContentEditable />}
              placeholder={<Placeholder />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            
          </div>
        </div>
      </LexicalComposer>
    </div>
  );
}
