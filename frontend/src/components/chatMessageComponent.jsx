// frontend/src/components/agentChat/ChatMessage.jsx
import { CheckCircle, AlertCircle, Bot, User } from "lucide-react";

const ChatMessage = ({ message }) => {
    const isUser = message.sender === "user";
    const isError = message.isError;

    // Format timestamp
    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`flex gap-2 sm:gap-3 max-w-xs sm:max-w-md lg:max-w-lg ${
                    isUser ? "flex-row-reverse" : "flex-row"
                }`}
            >
                {/* Avatar */}
                <div
                    className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        isUser
                            ? "bg-blue-600 dark:bg-blue-700"
                            : isError
                            ? "bg-red-600 dark:bg-red-700"
                            : "bg-green-600 dark:bg-green-700"
                    }`}
                >
                    {isUser ? (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : isError ? (
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    )}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col gap-1">
                    <div
                        className={`rounded-lg p-3 sm:p-4 ${
                            isUser
                                ? "bg-blue-600 dark:bg-blue-700 text-white rounded-br-none"
                                : isError
                                ? "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-bl-none border border-red-300 dark:border-red-700"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                        }`}
                    >
                        <p className="text-sm sm:text-base leading-relaxed break-words">
                            {message.text}
                        </p>
                    </div>
                    <span className={`text-xs text-gray-500 dark:text-gray-400 ${
                        isUser ? "text-right" : "text-left"
                    }`}>
                        {formatTime(message.timestamp)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;