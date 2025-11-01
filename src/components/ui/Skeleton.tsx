import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={clsx(
      "animate-pulse rounded-full bg-slate-200/80",
      className
    )}
  />
);
