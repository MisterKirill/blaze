"use client";

import Button from "@/components/ui/Button";
import { useState } from "react";

export default function StreamKey({ streamKey }: { streamKey: string }) {
  const [keyHidden, setKeyHidden] = useState(true);

  const copyKey = () => {
    navigator.clipboard.writeText(streamKey);
  };

  return (
    <div className="flex gap-3">
      <span className="p-3 bg-slate-800 rounded-lg font-semibold">
        {keyHidden ? streamKey.replace(/./g, "*") : streamKey}
      </span>
      <Button onClick={() => setKeyHidden((keyHidden) => !keyHidden)}>
        {keyHidden ? "Show" : "Hide"}
      </Button>
      <Button onClick={copyKey}>Copy</Button>
    </div>
  );
}
