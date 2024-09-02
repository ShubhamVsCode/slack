import { Button } from "@/components/ui/button";
import "./message-input.css";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import {
  Editor,
  EditorProvider,
  Extension,
  useCurrentEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap-pro/extension-file-handler";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  SendHorizontal,
  X,
  Loader,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useGenerateUploadUrl, useGetFileUrl } from "../api/actions";
import { Id } from "../../../../convex/_generated/dataModel";
import MessageImagesDialog from "./message-images-dialog";

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

const MessageEditor = ({
  onSend,
  initialContent,
  isEditing,
  onCancel,
  placeholder = "Message...",
}: {
  onSend: (content: string, files: Id<"_storage">[]) => void;
  initialContent?: string;
  isEditing?: boolean;
  onCancel?: () => void;
  placeholder?: string;
}) => {
  const [content, setContent] = useState(initialContent || "");
  const [hasText, setHasText] = useState(false);
  const [files, setFiles] = useState<
    {
      file: File;
      previewUrl: string;
      uploading: boolean;
      url?: string;
      storageId?: string;
    }[]
  >([]);
  const filesWithUrls = files
    .filter((file) => file.url || file.previewUrl)
    .map((file) => file.url || file.previewUrl);
  const editorRef = useRef<Editor>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  const generateUploadUrl = useGenerateUploadUrl();
  const getFileUrl = useGetFileUrl();

  const uploadFile = async (file: File) => {
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    const url = await getFileUrl({ storageId });

    return { url, storageId };
  };

  const handleSend = () => {
    if (editorRef.current?.isEmpty) {
      return;
    }
    const storageIds = files
      .filter((f) => !!f.storageId)
      .map((f) => f.storageId as Id<"_storage">);

    console.log(storageIds);

    onSend(editorRef.current?.getHTML() || "", storageIds);

    if (editorRef.current) {
      editorRef.current.commands.clearContent();
    }
    setFiles([]);
    setContent("");
    setHasText(false);
  };

  const addKeyboardShortcuts = () => {
    return {
      Enter: () => {
        if (editorRef.current) {
          if (editorRef.current?.isEmpty) {
            return false;
          }
          handleSend();
          return true;
        }

        return false;
      },
    };
  };

  const extensions: Extension[] = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    Placeholder.configure({
      placeholder,
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
    }).extend({
      addKeyboardShortcuts,
    }),
    FileHandler.configure({
      allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
      onDrop: (currentEditor, files, pos) => {
        files.forEach((file) => {
          const fileReader = new FileReader();

          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            const previewUrl = fileReader.result;
            // Show preview
            setFiles((prevFiles) => [
              ...prevFiles,
              { file, previewUrl: previewUrl as string, uploading: true },
            ]);

            // Start uploading
            uploadFile(file).then(({ url: uploadedUrl, storageId }) => {
              if (uploadedUrl) {
                setFiles((prevFiles) =>
                  prevFiles.map((f) =>
                    f.file === file
                      ? { ...f, uploading: false, url: uploadedUrl, storageId }
                      : f,
                  ),
                );
              }
            });
          };
        });
      },
      onPaste: (currentEditor, files, htmlContent) => {
        files.forEach((file) => {
          if (htmlContent) {
            console.log(htmlContent); // eslint-disable-line no-console
            return false;
          }

          const fileReader = new FileReader();

          fileReader.readAsDataURL(file);
          fileReader.onload = () => {
            const previewUrl = fileReader.result as string;
            // Show preview
            setFiles((prevFiles) => [
              ...prevFiles,
              { file, previewUrl, uploading: true },
            ]);

            // Start uploading
            uploadFile(file).then(({ url: uploadedUrl, storageId }) => {
              if (uploadedUrl) {
                setFiles((prevFiles) =>
                  prevFiles.map((f) =>
                    f.file === file
                      ? { ...f, uploading: false, url: uploadedUrl, storageId }
                      : f,
                  ),
                );
              }
            });
          };
        });
      },
    }),
  ];

  const openDialog = (index: number) => {
    setCurrentImageIndex(index);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    carouselApi.scrollTo(currentImageIndex);
  }, [carouselApi, currentImageIndex]);

  return (
    <div
      className={cn(
        "border bg-background rounded-lg shadow-sm",
        isEditing ? "" : "mx-2 mb-2",
      )}
    >
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        autofocus
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
        onCreate={(props) => {
          editorRef.current = props.editor;
        }}
        immediatelyRender={false}
      >
        <div className="relative">
          <div className="flex flex-wrap gap-2 mx-2 mb-2">
            {files.map((file, index) => (
              <div key={index} className="relative group w-16 h-16">
                <NextImage
                  src={file.url || file.previewUrl}
                  alt="preview"
                  width={100}
                  height={100}
                  className="w-16 h-16 object-cover rounded-xl cursor-pointer"
                  onClick={() => openDialog(index)}
                />
                {file.uploading && (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-blue-500 bg-opacity-50 rounded-xl">
                    <Loader className="animate-spin" />
                  </div>
                )}
                <Button
                  onClick={() => {
                    setFiles((prevFiles) =>
                      prevFiles.filter((f) => f !== file),
                    );
                  }}
                  size={"icon"}
                  variant={"secondary"}
                  className="absolute group-hover:opacity-100 opacity-0 -top-2 -right-2 rounded-full h-4 w-4"
                >
                  <X size={10} />
                </Button>
              </div>
            ))}
          </div>
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
                  if (editorRef.current) {
                    editorRef.current.commands.clearContent();
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
          <MessageImagesDialog
            fileUrls={filesWithUrls}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            setCarouselApi={setCarouselApi}
          />
        </div>
      </EditorProvider>
    </div>
  );
};

export default MessageEditor;
