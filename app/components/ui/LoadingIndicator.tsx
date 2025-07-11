"use client";

export default function LoadingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="text-gray-900 max-w-[95%] sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl px-3 sm:px-4 py-3">
        <div className="flex items-center">
          <div className="flex space-x-1">
            <div
              className="w-2 h-2 rounded-full animate-loading-bounce"
              style={{
                backgroundColor: "#9CA3AF",
                animationDelay: "0s",
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-loading-bounce"
              style={{
                backgroundColor: "#9CA3AF",
                animationDelay: "0.2s",
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-loading-bounce"
              style={{
                backgroundColor: "#9CA3AF",
                animationDelay: "0.4s",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
