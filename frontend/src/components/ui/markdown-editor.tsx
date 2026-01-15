import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import { Textarea } from "./textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Eye, Edit3 } from "lucide-react";
import "prismjs/themes/prism.css"; // Import Prism CSS for syntax highlighting

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  compact?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter text... (Supports Markdown)",
  rows = 3,
  className = "",
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  const hasContent = value.trim().length > 0;
  const hasMarkdown = /[#*`_\[\]()~-]/.test(value) || value.includes("```");

  if (compact) {
    return (
      <div className={`border rounded-lg relative ${className}`}>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1">
            <TabsList className="grid w-auto grid-cols-2 h-7 bg-background/95 backdrop-blur">
              <TabsTrigger value="write" className="flex items-center gap-1 px-2 text-xs h-7">
                <Edit3 className="h-3 w-3" />
                Write
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="flex items-center gap-1 px-2 text-xs h-7"
                disabled={!hasContent}
              >
                <Eye className="h-3 w-3" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="write" className="m-0">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              rows={rows}
              className="border-0 rounded-lg resize-none focus:ring-0 focus:border-0 pr-24"
            />
          </TabsContent>

          <TabsContent value="preview" className="m-0">
            <div className="min-h-[80px] p-3 pr-24">
              {hasContent ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                    components={{
                      code({ node, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isBlockCode = className?.includes('language-') && match;
                        
                        if (isBlockCode) {
                          return (
                            <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                              <code className={className} {...props}>
                                {children}
                              </code>
                            </pre>
                          );
                        }
                        
                        return (
                          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                            {children}
                          </code>
                        );
                      },
                      blockquote({ children }) {
                        return (
                          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-muted-foreground">
                            {children}
                          </blockquote>
                        );
                      },
                      table({ children }) {
                        return (
                          <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse border border-border">
                              {children}
                            </table>
                          </div>
                        );
                      },
                      th({ children }) {
                        return (
                          <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
                            {children}
                          </th>
                        );
                      },
                      td({ children }) {
                        return (
                          <td className="border border-border px-3 py-2">
                            {children}
                          </td>
                        );
                      },
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Nothing to preview
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
        <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/30">
          <TabsList className="grid w-auto grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="flex items-center gap-2"
              disabled={!hasContent}
            >
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          {hasMarkdown && (
            <div className="text-xs text-muted-foreground">
              Markdown detected
            </div>
          )}
        </div>

        <TabsContent value="write" className="m-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="border-0 rounded-none resize-none focus:ring-0 focus:border-0"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="min-h-[120px] p-3">
            {hasContent ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    // Custom styling for code blocks
                    code({ node, className, children, ...props }: any) {
                      const match = /language-(\w+)/.exec(className || '');
                      const isBlockCode = className?.includes('language-') && match;
                      
                      if (isBlockCode) {
                        return (
                          <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        );
                      }
                      
                      return (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                          {children}
                        </code>
                      );
                    },
                    blockquote({ children }) {
                      return (
                        <blockquote className="border-l-4 border-blue-500 pl-4 italic text-muted-foreground">
                          {children}
                        </blockquote>
                      );
                    },
                    // Custom styling for tables
                    table({ children }) {
                      return (
                        <div className="overflow-x-auto">
                          <table className="min-w-full border-collapse border border-border">
                            {children}
                          </table>
                        </div>
                      );
                    },
                    th({ children }) {
                      return (
                        <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
                          {children}
                        </th>
                      );
                    },
                    td({ children }) {
                      return (
                        <td className="border border-border px-3 py-2">
                          {children}
                        </td>
                      );
                    },
                  }}
                >
                  {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                Nothing to preview
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkdownEditor;
