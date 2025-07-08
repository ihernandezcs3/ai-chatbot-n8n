import dynamic from "next/dynamic";
import { ParentDataProvider } from "./components/ParentDataContext";

const ChatInterface = dynamic(() => import("./components/ChatInterface"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ParentDataProvider>
        <ChatInterface />
      </ParentDataProvider>
    </div>
  );
}
