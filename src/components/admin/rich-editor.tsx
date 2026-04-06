"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, Italic, List, ListOrdered, 
  Heading2, Quote, Undo, Redo 
} from "lucide-react";
import { cn } from "@/lib/utils";

export const RichTextEditor = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (content: string) => void 
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[150px] w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

//   if (!editor) return null;

  if (!editor) {
    return <div className="min-h-[150px] w-full rounded-2xl border border-zinc-200 bg-zinc-50 animate-pulse" />;
  }

  const ToolbarBtn = ({ onClick, active, children }: any) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-2 rounded-lg transition-all",
        active ? "bg-emerald-600 text-white shadow-sm" : "text-zinc-500 hover:bg-zinc-100"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="space-y-2 group">
      {/* --- PREMIUM TOOLBAR --- */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-zinc-50 border border-zinc-200 rounded-xl mb-2 transition-colors group-focus-within:border-emerald-200">
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading")}>
          <Heading2 size={16} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={16} />
        </ToolbarBtn>
        <div className="w-px h-4 bg-zinc-200 mx-1" />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()}>
          <Undo size={16} />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()}>
          <Redo size={16} />
        </ToolbarBtn>
      </div>

      {/* --- EDITOR CONTENT --- */}
      <EditorContent editor={editor} />
    </div>
  );
};