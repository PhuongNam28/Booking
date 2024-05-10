import { cn } from "@/lib/utils";
import React from "react";

export const Metrics = ({ title, value }: { title: string; value: number }) => {
  return (
    <CardContent>
      <section className="flex justify-between gap-2">
        <p className="text-sm">{title}</p>
      </section>

      <section className="flex flex-col gap-1">
        <h2 className="text-2xl font-semibold">
          {value} {""}$
        </h2>
      </section>
    </CardContent>
  );
};

export function CardContent(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-5 shadow",
        props.className
      )}
    ></div>
  );
}

export default Metrics;
