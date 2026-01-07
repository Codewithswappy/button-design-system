import React, { useState } from "react";
import { ButtonConfig } from "@/lib/types";
import { generateCSS, generateTailwindClasses } from "@/lib/generators";
import {
  Copy,
  Download,
  Check,
  FileCode,
  Braces,
  Terminal,
  ImageIcon,
} from "lucide-react";
import * as htmlToImage from "html-to-image";
import { cn } from "@/lib/types";
import { Button } from "@/components/ui/controls";

interface ExportPanelProps {
  config: ButtonConfig;
}

export const ExportPanel = ({ config }: ExportPanelProps) => {
  const [activeTab, setActiveTab] = useState<"tailwind" | "css" | "tokens">(
    "tailwind"
  );
  const [copied, setCopied] = useState(false);

  const generateTokens = () => {
    const tokens = {
      base: {
        background: config.states.default.background,
        text: config.states.default.textColor,
        border: config.states.default.borderColor,
      },
      typography: config.typography,
      layout: config.layout,
      motion: config.motion,
      effects: config.effects,
      variants: {
        hover: config.states.hover,
        active: config.states.active,
        focus: config.states.focus,
        disabled: config.states.disabled,
      },
    };
    return JSON.stringify(tokens, null, 2);
  };

  const code =
    activeTab === "tailwind"
      ? generateTailwindClasses(config)
      : activeTab === "css"
        ? generateCSS(config)
        : generateTokens();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    const node = document.getElementById("preview-button");
    if (!node) return;

    try {
      const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 3 });
      const link = document.createElement("a");
      link.download = "button.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to export image", err);
    }
  };

  return (
    <div className="h-full bg-panel-bg border-l border-panel-border flex flex-col w-[300px] shrink-0 z-20 shadow-xl transition-colors">
      {/* Header */}
      <div className="p-3 border-b border-panel-border bg-panel-bg flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-blue-500/50 shadow-sm" />
          <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
            Export
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-3 pt-3 bg-panel-bg">
        <div className="p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex gap-1 border border-zinc-200 dark:border-zinc-800">
          {[
            { id: "tailwind", icon: Terminal, label: "TW" },
            { id: "css", icon: FileCode, label: "CSS" },
            { id: "tokens", icon: Braces, label: "JSON" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[10px] font-bold transition-all",
                activeTab === t.id
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
              )}
            >
              <t.icon size={12} strokeWidth={2.5} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Area */}
      <div className="flex-1 p-3 min-h-0 flex flex-col">
        <div className="relative group flex-1 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800/50 overflow-hidden flex flex-col shadow-inner pt-6">
          <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-zinc-50 dark:from-zinc-900 via-zinc-50/0 to-transparent z-10 pointer-events-none" />

          {/* Copy Button Floating */}
          <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium border shadow-sm transition-all backdrop-blur-md",
                copied
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-white/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
              )}
            >
              {copied ? (
                <Check size={10} strokeWidth={3} />
              ) : (
                <Copy size={10} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <pre className="flex-1 p-3 text-[10px] sm:text-[11px] font-mono text-zinc-600 dark:text-zinc-400 overflow-auto whitespace-pre-wrap break-all custom-scrollbar leading-relaxed selection:bg-blue-500/20 selection:text-blue-600">
            {code}
          </pre>

          <div className="absolute bottom-0 inset-x-0 h-6 bg-gradient-to-t from-zinc-50 dark:from-zinc-900 via-zinc-50/0 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Footer / Asset Export */}
      <div className="p-3 border-t border-panel-border bg-panel-bg/50 backdrop-blur-sm space-y-3">
        <div className="flex items-center gap-2 px-1">
          <ImageIcon size={12} className="text-zinc-500" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            Raster Asset
          </span>
        </div>
        <Button
          onClick={handleDownload}
          className="w-full bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 dark:hover:bg-white text-white dark:text-zinc-950 font-semibold h-9 rounded-lg shadow-sm hover:shadow-md transition-all"
        >
          <Download size={14} className="mr-2" />
          Download .PNG
        </Button>
      </div>
    </div>
  );
};
