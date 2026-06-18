"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  ListsToggle,
  Separator,
  linkPlugin,
  CreateLink,
  imagePlugin,
  tablePlugin,
  InsertTable,
  InsertImage,
  linkDialogPlugin,
  
} from "@mdxeditor/editor";

// CSS Import is mandatory
import "@mdxeditor/editor/style.css";

interface MdxEditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
}

/**
 * MDX Editor with Amaze Ayurveda Theme Styling
 */
export default function MdxEditor({ markdown, onChange }: MdxEditorProps) {
  return (
    <div className="mdx-editor-wrapper border-2 border-slate-100 rounded-[2rem] overflow-hidden bg-white shadow-inner min-h-[500px]">
      <MDXEditor
        markdown={markdown}
        onChange={onChange}
        className="prose prose-slate max-w-none prose-emerald"
        contentEditableClassName="outline-none min-h-[450px] p-8 md:p-12 font-sans text-slate-700 leading-relaxed"
        plugins={[
          // Core Layout & Logic Plugins
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          imagePlugin({
            imageUploadHandler: async (file) => {
              // Yahan aap apna Cloudinary Upload Action call kar sakte hain
              // For now, it returns a local blob URL
              const formData = new FormData();
              formData.append("file", file);
              return URL.createObjectURL(file);
            },
          }),
          markdownShortcutPlugin(),
          
          // Toolbar Configuration
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap items-center gap-1.5 p-3 bg-slate-50 border-b border-slate-100 w-full">
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <Separator />
                <div className="flex items-center">
                    <ListsToggle />
                    {/* <ListsStatus /> */}
                </div>
                <Separator />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <Separator />
                {/* Custom Branding for Admin */}
                <div className="ml-auto px-4 text-[9px] font-black uppercase tracking-widest text-slate-300">
                    Amaze MDX v1.0
                </div>
              </div>
            ),
          }),
        ]}
      />

      <style jsx global>{`
        /* Toolbar Overrides */
        .mdx-editor-wrapper [role="toolbar"] {
          background: #f8fafc !important;
          border-bottom: 1px solid #f1f5f9 !important;
        }
        .mdx-editor-wrapper button[aria-pressed="true"] {
          background-color: #ecfdf5 !important;
          color: #059669 !important;
        }
        .mdx-editor-wrapper .mdxeditor-root-content {
           font-size: 1.05rem;
        }
        /* Custom Table Styling in Editor */
        .mdx-editor-wrapper table {
           width: 100%;
           border-collapse: collapse;
           margin: 20px 0;
           background: #fcfcfc;
        }
        .mdx-editor-wrapper th, .mdx-editor-wrapper td {
           border: 1px solid #e2e8f0;
           padding: 12px;
        }
      `}</style>
    </div>
  );
}