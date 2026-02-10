import { cn } from "@/lib/utils";

export default function Loading() {
  return (
    <main>
      {/* Header Skeleton */}
      <article className="flex rounded-border justify-between p-6 animate-pulse bg-gray-50/50">
        <div className="flex items-center gap-2">
          {/* Avatar Placeholder */}
          <div className="size-18 flex items-center justify-center rounded-lg bg-gray-200 max-md:hidden" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* Name Placeholder */}
              <div className="h-8 w-48 bg-gray-200 rounded-md" />
              {/* Badge Placeholder */}
              <div className="h-6 w-20 bg-gray-200 rounded-full max-sm:hidden" />
            </div>
            {/* Topic Placeholder */}
            <div className="h-6 w-64 bg-gray-200 rounded-md" />
          </div>
        </div>
        {/* Duration Placeholder */}
        <div className="h-8 w-24 bg-gray-200 rounded-md max-md:hidden" />
      </article>

      {/* Companion Component Skeleton */}
      <section className="flex flex-col h-[70vh] animate-pulse">
        <section className="flex gap-8 max-sm:flex-col w-full mt-6">
          {/* Companion Side */}
          <div className="companion-section border-gray-200 bg-gray-50/50">
            <div className="size-[300px] max-sm:size-[100px] rounded-lg bg-gray-200 mt-4" />
            <div className="h-8 w-40 bg-gray-200 rounded-md mt-4" />
          </div>

          {/* User Side */}
          <div className="user-section">
            <div className="flex flex-col gap-2 w-full">
              <div className="aspect-square w-full bg-gray-200 rounded-lg max-sm:hidden" />
              <div className="h-6 w-32 bg-gray-200 rounded-md" />
            </div>

            {/* Controls */}
            <div className="h-24 w-full bg-gray-200 rounded-lg mt-4" />
            <div className="h-12 w-full bg-gray-200 rounded-lg mt-4" />
          </div>
        </section>

        {/* Transcript Area */}
        <div className="grow bg-gray-50/50 mt-6 rounded-lg w-full" />
      </section>
    </main>
  );
}
