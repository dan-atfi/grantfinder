"use client";

interface SaveGrantButtonProps {
  isSaved: boolean;
  onSave: () => void;
  onUnsave: () => void;
}

export function SaveGrantButton({
  isSaved,
  onSave,
  onUnsave,
}: SaveGrantButtonProps) {
  return (
    <button
      onClick={isSaved ? onUnsave : onSave}
      className="inline-flex items-center gap-1 text-sm transition-colors"
      title={isSaved ? "Remove from saved" : "Save grant"}
    >
      <svg
        className={`h-5 w-5 ${
          isSaved ? "fill-blue-600 text-blue-600" : "text-gray-400 hover:text-blue-600"
        }`}
        fill={isSaved ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
      <span className={isSaved ? "text-blue-600" : "text-gray-500"}>
        {isSaved ? "Saved" : "Save"}
      </span>
    </button>
  );
}
