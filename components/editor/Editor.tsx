import React, { useState } from "react";
import { ControlsPanel } from "./ControlsPanel";
import { PreviewPanel } from "./PreviewPanel";
import { ExportPanel } from "./ExportPanel";
import { INITIAL_CONFIG, ButtonConfig, cn } from "@/lib/types";

export const Editor = () => {
  const [config, setConfig] = useState<ButtonConfig>(INITIAL_CONFIG);
  const [canvasColor, setCanvasColor] = useState(""); // Empty = default based on theme

  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden transition-colors font-sans bg-gray-50 dark:bg-zinc-950 text-zinc-900 dark:text-white"
      )}
    >
      {/* Left Panel - Controls */}
      <ControlsPanel config={config} setConfig={setConfig} />

      {/* Center Panel - Preview */}
      <PreviewPanel
        config={config}
        canvasColor={canvasColor}
        setCanvasColor={setCanvasColor}
      />

      {/* Right Panel - Export */}
      <ExportPanel config={config} />
    </div>
  );
};
