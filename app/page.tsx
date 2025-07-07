import dynamic from "next/dynamic";
import Link from "next/link";

const ChatInterface = dynamic(() => import("./components/ChatInterface"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">
            AI Chat Assistant
          </h1>
          <div className="flex gap-4">
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Chat Original
            </Link>
            <Link
              href="/n8n-chat-widget-with-metadata.html"
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
              target="_blank"
            >
              Chat con Metadata
            </Link>
          </div>
        </div>
      </div>

      <ChatInterface />
    </div>
  );
}
