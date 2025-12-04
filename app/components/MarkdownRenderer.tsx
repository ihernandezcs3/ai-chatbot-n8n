"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Process content to handle literal \n characters
  const processedContent = content.replace(/\\n/g, "\n");

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Custom styling for different elements
          h1: ({ children }) => <h1 className="text-lg font-bold text-gray-900 mb-2 sm:mb-3">{children}</h1>,
          h2: ({ children }) => <h2 className="text-base font-bold text-gray-900 mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-bold text-gray-900 mb-1 sm:mb-2">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-medium text-gray-900 mb-1">{children}</h4>,
          p: ({ children }) => <p className="text-sm text-gray-700 font-medium mb-2 leading-relaxed">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-4 text-sm text-gray-700 font-medium mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 text-sm text-gray-700 font-medium mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="text-sm text-gray-700 font-medium [&>p]:mb-0">{children}</li>,
          blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-2 sm:pl-4 italic text-gray-700 font-medium mb-2 text-sm">{children}</blockquote>,
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs font-mono">{children}</code>;
            }
            return (
              <pre className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">
                <code>{children}</code>
              </pre>
            );
          },
          pre: ({ children }) => <pre className="bg-gray-900 text-green-400 p-2 sm:p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">{children}</pre>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline text-sm font-medium">
              {children}
            </a>
          ),
          strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
          em: ({ children }) => <em className="italic text-gray-700 font-medium">{children}</em>,
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border border-gray-200 text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
          th: ({ children }) => <th className="border border-gray-200 px-2 sm:px-3 py-1 sm:py-2 text-left font-bold text-gray-900">{children}</th>,
          td: ({ children }) => <td className="border border-gray-200 px-2 sm:px-3 py-1 sm:py-2 text-gray-700 font-medium">{children}</td>,
          hr: () => <hr className="border-gray-200 my-3 sm:my-4" />,
          // GitHub Flavored Markdown support
          del: ({ children }) => <del className="line-through text-gray-500 font-medium">{children}</del>,
          // Task lists
          input: ({ checked, type }) => {
            if (type === "checkbox") {
              return <input type="checkbox" checked={checked} readOnly className="mr-2" />;
            }
            return null;
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
