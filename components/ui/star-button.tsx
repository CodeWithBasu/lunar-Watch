"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

export interface StarButtonProps {
  text?: string;
  initialCount?: number;
}

export const StarButton = ({ text = "WISHLIST", initialCount = 99 }: StarButtonProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    if (checked) {
      setCount((prev) => prev + 1);
      toast.success(`Added to ${text.toLowerCase()}! ✨`, {
        style: {
          background: '#000',
          color: '#FBBF24',
          border: '1px solid #FBBF24',
        }
      });
    } else {
      setCount((prev) => prev - 1);
      toast("Removed from " + text.toLowerCase());
    }
  };

  return (
    <div className="flex items-center gap-4">
      <label className="">
        <input 
          type="checkbox" 
          checked={isChecked}
          onChange={handleChange}
          className="peer hidden" 
        />
        <div
          className={cn(
            "relative group flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full border border-yellow-400 fill-none p-2 px-3 font-extrabold text-yellow-500 transition-all active:scale-90",
            "peer-checked:fill-yellow-400 peer-checked:hover:text-black",
            // Pure golden glow
            "peer-checked:drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]",
            "drop-shadow-[0_0_4px_rgba(250,204,21,0.4)] hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]"
          )}
        >
          {/* Shine Sweep Effect */}
          <div className="absolute top-0 bottom-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-yellow-300/40 to-transparent animate-shine pointer-events-none z-0" />
          
          <div className="z-10 transition group-hover:translate-x-4 peer-checked:translate-x-4 peer-checked:text-black group-hover:text-black">
            {text}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 transition duration-500 group-hover:scale-[1500%] group-hover:-translate-x-10 peer-checked:scale-[1500%] peer-checked:-translate-x-10"
          >
            <path
              d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              strokeLinejoin="round"
              strokeLinecap="round"
            ></path>
          </svg>
        </div>
      </label>
      
      {/* Counter */}
      <div className="flex flex-col items-start border-l border-gray-200 dark:border-neutral-800 pl-4 py-1">
        <span className="text-xl font-bold font-mono text-gray-900 dark:text-gray-100">
          {count.toLocaleString()}
        </span>
        <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
          Favorited
        </span>
      </div>
    </div>
  );
};
