import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const Chatbox = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef: any = useRef(null);
  const textareaRef = useRef(null);

  const handleFocus = () => setIsExpanded(true);

  const handleClickOutside = (event: any) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="fixed bottom-0 flex flex-col left-1/2 transform -translate-x-1/2 w-full max-w-[752px] items-stretch bg-primary-200 pl-4 pt-2.5 pr-2.5 pb-2.5 border border-gray-300 rounded-t-2xl"
      ref={containerRef}
      onClick={handleFocus}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "50vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-t-lg overflow-y-auto mb-4"
          >
            {/* Chat messages would go here */}
            <div className="p-4">
              <p>Sample chat message 1</p>
              <p>Sample chat message 2</p>
              {/* Add more messages as needed */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex gap-2 items-center">
        <div
          aria-label="Write your prompt to Claude"
          className="mt-1 max-h-96 w-full overflow-y-auto break-words"
        >
          <textarea
            ref={textareaRef}
            contentEditable="true"
            translate="no"
            placeholder="Write your message here"
            className="ProseMirror break-words w-full max-h-96 resize-none"
          ></textarea>
        </div>
        <input
          data-testid="file-upload"
          aria-hidden="true"
          className="absolute -z-10 h-0 w-0 overflow-hidden opacity-0"
          accept=".pdf,.doc,.docx,.rtf,.epub,.odt,.odp,.pptx,.txt,.py,.ipynb,.js,.jsx,.html,.css,.java,.cs,.php,.c,.cc,.cpp,.cxx,.h,.hh,.hpp,.rs,.R,.Rmd,.swift,.go,.rb,.kt,.kts,.ts,.tsx,.m,.mm,.scala,.rs,.dart,.lua,.pl,.pm,.t,.sh,.bash,.zsh,.csv,.log,.ini,.cfg,.config,.json,.proto,.yaml,.yml,.toml,.lua,.sql,.bat,.md,.coffee,.tex,.latex,.gd,.gdshader,.tres,.tscn,.jpg,.jpeg,.png,.gif,.webp"
          multiple
          aria-label="Upload files"
          type="file"
        />
        <button
          className="inline-flex items-center justify-center relative shrink-0 ring-offset-2 ring-offset-gray-300 ring-accent-main-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none bg-gradient-to-r from-gray-500 to-gray-700 border border-gray-400 text-gray-100 transition-colors active:bg-gray-600 hover:text-white hover:bg-gray-700 h-8 w-8 rounded-md active:scale-95"
          aria-label="Upload content"
          data-state="closed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            viewBox="0 0 256 256"
            className="text-gray-300"
          >
            <path d="M209.66,122.34a8,8,0,0,1,0,11.32l-82.05,82a56,56,0,0,1-79.2-79.21L147.67,35.73a40,40,0,1,1,56.61,56.55L105,193A24,24,0,1,1,71,159L154.3,74.38A8,8,0,1,1,165.7,85.6L82.39,170.31a8,8,0,1,0,11.27,11.36L192.93,81A24,24,0,1,0,159,47L59.76,147.68a40,40,0,1,0,56.53,56.62l82.06-82A8,8,0,0,1,209.66,122.34Z"></path>
          </svg>
        </button>
        <div style={{ width: "auto" }}>
          <div style={{ opacity: 1, transform: "none" }}>
            <button
              className="inline-flex items-center justify-center relative shrink-0 ring-offset-2 ring-offset-gray-300 ring-accent-main-100 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none bg-primary-500 text-white transition-colors hover:bg-accent-main-200 h-8 w-8 rounded-md active:scale-95"
              aria-label="Send Message"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="text-right text-sm text-gray-400 mt-2">
        Use <span className="font-bold">shift + return</span> for new line
      </div>
    </div>
  );
};

export default Chatbox;
