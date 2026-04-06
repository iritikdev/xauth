"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, Italic, List, ListOrdered, 
  Heading2, Quote, Undo, Redo, Strikethrough,
  Code, Type
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
    // StarterKit contains BulletList, OrderedList, Blockquote, etc.
    extensions: [StarterKit],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[200px] w-full rounded-b-2xl border border-t-0 border-zinc-200 bg-white px-5 py-4",
          "text-sm leading-relaxed prose prose-slate max-w-none focus:outline-none",
          "prose-p:my-2 prose-headings:font-black prose-headings:italic prose-headings:tracking-tighter"
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div className="w-full space-y-2">
        <div className="h-10 w-full rounded-t-2xl bg-zinc-100 animate-pulse" />
        <div className="h-40 w-full rounded-b-2xl bg-zinc-50 animate-pulse" />
      </div>
    );
  }

  const ToolbarBtn = ({ 
    onClick, 
    active, 
    title, 
    children 
  }: { 
    onClick: () => void; 
    active?: boolean; 
    title: string;
    children: React.ReactNode 
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded-md transition-all duration-200 flex items-center justify-center",
        active 
          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105" 
          : "text-zinc-500 hover:bg-zinc-200/50 hover:text-zinc-900"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="relative w-full group border-none">
      {/* ── PREMIUM TOOLBAR ── */}
      <div className={cn(
        "flex flex-wrap items-center gap-1 p-1.5 bg-zinc-50 border border-zinc-200 rounded-t-2xl transition-all duration-300",
        "group-focus-within:bg-white group-focus-within:border-emerald-500/30 group-focus-within:shadow-[0_-4px_20px_-10px_rgba(16,185,129,0.1)]"
      )}>
        <div className="flex items-center gap-1 px-1 mr-1 border-r border-zinc-200">
           <ToolbarBtn 
             onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
             active={editor.isActive("heading")}
             title="Heading"
           >
            <Heading2 size={15} strokeWidth={2.5} />
          </ToolbarBtn>
          <ToolbarBtn 
             onClick={() => editor.chain().focus().setParagraph().run()} 
             active={editor.isActive("paragraph")}
             title="Normal Text"
           >
            <Type size={15} strokeWidth={2.5} />
          </ToolbarBtn>
        </div>

        <div className="flex items-center gap-1 px-1">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <Bold size={15} strokeWidth={2.5} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <Italic size={15} strokeWidth={2.5} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
            <Strikethrough size={15} strokeWidth={2.5} />
          </ToolbarBtn>
        </div>

        <div className="w-px h-4 bg-zinc-200 mx-1" />

        <div className="flex items-center gap-1 px-1">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
            <List size={15} strokeWidth={2.5} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered List">
            <ListOrdered size={15} strokeWidth={2.5} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
            <Quote size={15} strokeWidth={2.5} />
          </ToolbarBtn>
        </div>

        <div className="hidden sm:flex items-center gap-1 ml-auto border-l border-zinc-200 pl-2">
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo size={14} />
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo size={14} />
          </ToolbarBtn>
        </div>
      </div>

      {/* ── EDITOR CONTENT ── */}
      <div className="relative transition-all duration-300 group-focus-within:shadow-xl group-focus-within:shadow-emerald-900/5">
        <EditorContent editor={editor} />
        
        {/* Subtle Branding/Word Count area can go here */}
        <div className="absolute bottom-3 right-4 flex items-center gap-2 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
           <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600/40">
             Amaze Formulator
           </span>
        </div>
      </div>
    </div>
  );
};