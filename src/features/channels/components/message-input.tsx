import { Button } from "@/components/ui/button";
import "./message-input.css";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Link from "@tiptap/extension-link";
import { Editor, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Send,
  SendHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 border-b">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-800" : ""}`}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-800" : ""}`}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-1 rounded ${editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-800" : ""}`}
      >
        <Strikethrough size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        className={`p-1 rounded ${editor.isActive("code") ? "bg-gray-200 dark:bg-gray-800" : ""}`}
      >
        <Code size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${editor.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-800" : ""}`}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded ${editor.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-800" : ""}`}
      >
        <ListOrdered size={18} />
      </button>
    </div>
  );
};

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({
    // types: [ListItem.name],
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const MessageEditor = ({
  onSend,
  initialContent,
  isEditing,
  onCancel,
}: {
  onSend: (content: string) => void;
  initialContent?: string;
  isEditing?: boolean;
  onCancel?: () => void;
}) => {
  const [content, setContent] = useState(initialContent || "");
  const [hasText, setHasText] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  const handleSend = () => {
    if (editor?.isEmpty) {
      return;
    }
    onSend(content);
    if (editor) {
      editor.commands.clearContent();
    }
    setContent("");
    setHasText(false);
  };

  return (
    <div className="border bg-background rounded-lg shadow-sm mx-2 mb-2">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        editorProps={{
          attributes: {
            class:
              "max-w-full prose dark:prose-invert prose-sm prose-p:leading-none prose-ul:leading-none prose-li:leading-none prose-a:text-blue-500 prose-a:underline prose-a:font-semibold prose-a:text-sm p-4 focus:outline-none",
          },
        }}
        onUpdate={({ editor }) => {
          setContent(editor.getHTML());
          setHasText(!editor.isEmpty);
        }}
        onCreate={({ editor }) => setEditor(editor)}
        onDestroy={() => setEditor(null)}
      >
        <div className="relative">
          {isEditing ? (
            <>
              <Button
                onClick={handleSend}
                variant="outline"
                className={cn(
                  "absolute bottom-2 right-2",
                  hasText ? "bg-green-700 hover:bg-green-800" : "",
                )}
              >
                Save
              </Button>
              <Button
                onClick={() => {
                  if (editor) {
                    editor.commands.clearContent();
                  }
                  setContent("");
                  setHasText(false);
                  onCancel?.();
                }}
                variant="outline"
                className="absolute bottom-2 right-20"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={handleSend}
              variant="outline"
              size={"icon"}
              className={cn(
                "absolute bottom-2 right-2",
                hasText ? "bg-green-700 hover:bg-green-800" : "",
              )}
            >
              <SendHorizontal size={18} />
            </Button>
          )}
        </div>
      </EditorProvider>
    </div>
  );
};

export default MessageEditor;
