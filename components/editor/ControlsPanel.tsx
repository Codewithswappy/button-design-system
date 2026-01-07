import React, { useEffect, useState } from "react";
import {
  ButtonConfig,
  Shadow,
  BackgroundInfo,
  Gradient,
  ButtonState,
  POPULAR_FONTS,
  Spacing,
  CornerRadius,
  StateStyles,
  cn,
} from "@/lib/types";
import {
  Section,
  ControlRow,
  SliderInput,
  Input,
  ColorPicker,
  Select,
  Toggle,
  Tabs,
  Label,
  SegmentedControl,
  Button,
} from "@/components/ui/controls";
import { Plus, Trash2, Save, Link2, Link2Off } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface ControlsPanelProps {
  config: ButtonConfig;
  setConfig: React.Dispatch<React.SetStateAction<ButtonConfig>>;
}

const DEFAULT_GRADIENT: Gradient = {
  type: "linear",
  angle: 135,
  stops: [
    { id: "1", color: "#18181b", position: 0, opacity: 1 },
    { id: "2", color: "#27272a", position: 100, opacity: 1 },
  ],
};

export const ControlsPanel = ({ config, setConfig }: ControlsPanelProps) => {
  const [activeTab, setActiveTab] = React.useState<
    "design" | "states" | "settings"
  >("design");
  const [activeState, setActiveState] = React.useState<ButtonState>("default");

  // UI State for linked controls
  const [paddingLinked, setPaddingLinked] = useState(true);
  const [radiusLinked, setRadiusLinked] = useState(true);

  // Preset Management
  const [presetName, setPresetName] = useState("");
  const [presetsList, setPresetsList] = useState<
    { name: string; config: ButtonConfig }[]
  >([]);

  useEffect(() => {
    const saved = localStorage.getItem("button_presets_v2");
    if (saved) {
      try {
        setPresetsList(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load presets", e);
      }
    }
  }, []);

  const savePreset = () => {
    if (!presetName) return;
    const newPreset = { name: presetName, config };
    const updated = [...presetsList, newPreset];
    localStorage.setItem("button_presets_v2", JSON.stringify(updated));
    setPresetsList(updated);
    setPresetName("");
  };

  const loadPreset = (name: string) => {
    const preset = presetsList.find((p) => p.name === name);
    if (preset) {
      setConfig(preset.config);
    }
  };

  // --- Type-Safe Updaters ---

  const updateLayout = (updates: Partial<ButtonConfig["layout"]>) => {
    setConfig((prev) => ({ ...prev, layout: { ...prev.layout, ...updates } }));
  };

  const updatePadding = (key: keyof Spacing | "all", value: number) => {
    setConfig((prev) => {
      const newPadding = { ...prev.layout.padding };
      if (key === "all") {
        newPadding.top =
          newPadding.right =
          newPadding.bottom =
          newPadding.left =
            value;
      } else {
        newPadding[key] = value;
        if (paddingLinked) {
          newPadding.top =
            newPadding.right =
            newPadding.bottom =
            newPadding.left =
              value;
        }
      }
      return { ...prev, layout: { ...prev.layout, padding: newPadding } };
    });
  };

  const updateRadius = (key: keyof CornerRadius | "all", value: number) => {
    setConfig((prev) => {
      const newRadius = { ...prev.layout.radius };
      if (key === "all") {
        newRadius.topLeft =
          newRadius.topRight =
          newRadius.bottomRight =
          newRadius.bottomLeft =
            value;
      } else {
        newRadius[key] = value;
        if (radiusLinked) {
          newRadius.topLeft =
            newRadius.topRight =
            newRadius.bottomRight =
            newRadius.bottomLeft =
              value;
        }
      }
      return { ...prev, layout: { ...prev.layout, radius: newRadius } };
    });
  };

  const updateTypography = (updates: Partial<ButtonConfig["typography"]>) => {
    setConfig((prev) => ({
      ...prev,
      typography: { ...prev.typography, ...updates },
    }));
  };

  const updateMotion = (updates: Partial<ButtonConfig["motion"]>) => {
    setConfig((prev) => ({ ...prev, motion: { ...prev.motion, ...updates } }));
  };

  const updateEffects = (updates: Partial<ButtonConfig["effects"]>) => {
    setConfig((prev) => ({
      ...prev,
      effects: { ...prev.effects, ...updates },
    }));
  };

  const updateInteractive = (
    updates: Partial<ButtonConfig["interactions"]>
  ) => {
    setConfig((prev) => ({
      ...prev,
      interactions: { ...prev.interactions, ...updates },
    }));
  };

  // State Management
  const updateState = (updates: Partial<StateStyles>) => {
    setConfig((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [activeState]: { ...prev.states[activeState], ...updates },
      },
    }));
  };

  const updateStateTransform = (updates: Partial<StateStyles["transform"]>) => {
    setConfig((prev) => ({
      ...prev,
      states: {
        ...prev.states,
        [activeState]: {
          ...prev.states[activeState],
          transform: { ...prev.states[activeState].transform, ...updates },
        },
      },
    }));
  };

  const updateStateFilter = (updates: Partial<StateStyles["filter"]>) => {
    setConfig((prev) => {
      const currentFilter = prev.states[activeState].filter || {
        blur: 0,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
      };
      return {
        ...prev,
        states: {
          ...prev.states,
          [activeState]: {
            ...prev.states[activeState],
            filter: { ...currentFilter, ...updates },
          },
        },
      };
    });
  };

  // Shadow Logic
  const addShadow = () => {
    setConfig((prev) => {
      const current = prev.states[activeState].shadows;
      return {
        ...prev,
        states: {
          ...prev.states,
          [activeState]: {
            ...prev.states[activeState],
            shadows: [
              ...current,
              {
                id: Date.now().toString(),
                enabled: true,
                x: 0,
                y: 4,
                blur: 6,
                spread: -1,
                color: "rgba(0,0,0,0.1)",
                inset: false,
              },
            ],
          },
        },
      };
    });
  };

  const updateShadow = (index: number, updates: Partial<Shadow>) => {
    setConfig((prev) => {
      const newShadows = [...prev.states[activeState].shadows];
      newShadows[index] = { ...newShadows[index], ...updates };
      return {
        ...prev,
        states: {
          ...prev.states,
          [activeState]: { ...prev.states[activeState], shadows: newShadows },
        },
      };
    });
  };

  const removeShadow = (index: number) => {
    setConfig((prev) => {
      const newShadows = prev.states[activeState].shadows.filter(
        (_, i) => i !== index
      );
      return {
        ...prev,
        states: {
          ...prev.states,
          [activeState]: { ...prev.states[activeState], shadows: newShadows },
        },
      };
    });
  };

  // Styles Helpers
  const currentStateStyle = config.states[activeState];
  const currentBg = currentStateStyle.background;

  const handleBgTypeChange = (type: "solid" | "linear") => {
    if (type === (currentBg.type === "solid" ? "solid" : "linear")) return;

    let newBg: BackgroundInfo;
    if (type === "solid") {
      newBg = {
        type: "solid",
        value:
          currentBg.type === "gradient"
            ? currentBg.value.stops[0]?.color
            : "#000000",
      };
    } else {
      newBg = { type: "gradient", value: DEFAULT_GRADIENT };
    }
    updateState({ background: newBg });
  };

  const updateGradient = (updates: Partial<Gradient>) => {
    if (currentBg.type !== "gradient") return;
    updateState({
      background: {
        type: "gradient",
        value: { ...currentBg.value, ...updates },
      },
    });
  };

  // RENDER helpers
  const renderPaddingControls = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Padding</Label>
        <button
          onClick={() => setPaddingLinked(!paddingLinked)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          {paddingLinked ? <Link2 size={12} /> : <Link2Off size={12} />}
        </button>
      </div>
      {paddingLinked ? (
        <SliderInput
          value={config.layout.padding.top}
          onChange={(v) => updatePadding("all", v)}
          min={0}
          max={64}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <ControlRow label="Top" compact>
            <SliderInput
              value={config.layout.padding.top}
              onChange={(v) => updatePadding("top", v)}
              min={0}
              max={64}
            />
          </ControlRow>
          <ControlRow label="Right" compact>
            <SliderInput
              value={config.layout.padding.right}
              onChange={(v) => updatePadding("right", v)}
              min={0}
              max={64}
            />
          </ControlRow>
          <ControlRow label="Bottom" compact>
            <SliderInput
              value={config.layout.padding.bottom}
              onChange={(v) => updatePadding("bottom", v)}
              min={0}
              max={64}
            />
          </ControlRow>
          <ControlRow label="Left" compact>
            <SliderInput
              value={config.layout.padding.left}
              onChange={(v) => updatePadding("left", v)}
              min={0}
              max={64}
            />
          </ControlRow>
        </div>
      )}
    </div>
  );

  const renderRadiusControls = () => (
    <div className="space-y-2 mt-4">
      <div className="flex items-center justify-between">
        <Label>Corner Radius</Label>
        <button
          onClick={() => setRadiusLinked(!radiusLinked)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          {radiusLinked ? <Link2 size={12} /> : <Link2Off size={12} />}
        </button>
      </div>
      {radiusLinked ? (
        <SliderInput
          value={config.layout.radius.topLeft}
          onChange={(v) => updateRadius("all", v)}
          min={0}
          max={50}
        />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <ControlRow label="TL" compact>
            <SliderInput
              value={config.layout.radius.topLeft}
              onChange={(v) => updateRadius("topLeft", v)}
              min={0}
              max={50}
            />
          </ControlRow>
          <ControlRow label="TR" compact>
            <SliderInput
              value={config.layout.radius.topRight}
              onChange={(v) => updateRadius("topRight", v)}
              min={0}
              max={50}
            />
          </ControlRow>
          <ControlRow label="BR" compact>
            <SliderInput
              value={config.layout.radius.bottomRight}
              onChange={(v) => updateRadius("bottomRight", v)}
              min={0}
              max={50}
            />
          </ControlRow>
          <ControlRow label="BL" compact>
            <SliderInput
              value={config.layout.radius.bottomLeft}
              onChange={(v) => updateRadius("bottomLeft", v)}
              min={0}
              max={50}
            />
          </ControlRow>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full bg-panel-bg border-r border-panel-border flex flex-col w-[350px] flex-shrink-0 select-none text-zinc-900 dark:text-zinc-300 shadow-2xl z-10 transition-colors">
      {/* Top Bar */}
      <div className="p-3 border-b border-panel-border bg-panel-bg">
        <div className="flex gap-2 items-center mb-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              Design System
            </span>
          </div>
          <ThemeToggle />
        </div>

        {/* Preset Selector */}
        <div className="flex gap-2">
          <Select
            className="flex-1 h-8 text-xs"
            onChange={(e) => loadPreset(e.target.value)}
            value=""
          >
            <option value="" disabled>
              Load Preset...
            </option>
            {presetsList.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </Select>
          <Button
            onClick={savePreset}
            disabled={!presetName}
            className="h-8 w-8 p-0"
            title="Save"
          >
            <Save size={14} />
          </Button>
        </div>
        <div className="mt-2">
          <Input
            placeholder="New preset name..."
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            className="h-8 text-xs border-dashed"
          />
        </div>
      </div>

      <div className="bg-panel-bg">
        <Tabs
          value={activeTab}
          onChange={(v) => setActiveTab(v as any)}
          options={[
            { label: "Layout", value: "design" },
            { label: "States", value: "states" },
            { label: "Settings", value: "settings" },
          ]}
        />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-0 space-y-0 pb-10">
        {/* --- DESIGN TAB --- */}
        {activeTab === "design" && (
          <>
            <Section title="Dimensions" className="px-5">
              <ControlRow label="Width Mode">
                <SegmentedControl
                  value={config.layout.widthMode}
                  options={[
                    { label: "Auto", value: "auto" },
                    { label: "Fixed", value: "fixed" },
                    { label: "Full", value: "full" },
                  ]}
                  onChange={(v) => updateLayout({ widthMode: v as any })}
                />
              </ControlRow>
              {config.layout.widthMode === "fixed" && (
                <ControlRow label="Width (px)">
                  <SliderInput
                    value={config.layout.fixedWidth}
                    onChange={(v) => updateLayout({ fixedWidth: v })}
                    min={40}
                    max={400}
                  />
                </ControlRow>
              )}
              <ControlRow label="Min Width">
                <SliderInput
                  value={config.layout.minWidth}
                  onChange={(v) => updateLayout({ minWidth: v })}
                  min={0}
                  max={200}
                />
              </ControlRow>

              {renderPaddingControls()}
            </Section>

            <Section title="Border & Shape" className="px-5">
              {renderRadiusControls()}

              <ControlRow label="Border Width" className="mt-4">
                <SliderInput
                  value={config.layout.borderWidth}
                  onChange={(v) => updateLayout({ borderWidth: v })}
                  min={0}
                  max={10}
                />
              </ControlRow>
              <ControlRow label="Style">
                <Select
                  value={config.layout.borderStyle}
                  onChange={(e) =>
                    updateLayout({ borderStyle: e.target.value as any })
                  }
                >
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </Select>
              </ControlRow>
            </Section>

            <Section title="Typography" className="px-5">
              <ControlRow label="Family">
                <Select
                  value={config.typography.fontFamily}
                  onChange={(e) =>
                    updateTypography({ fontFamily: e.target.value })
                  }
                >
                  {POPULAR_FONTS.map((f) => (
                    <option key={f.name} value={f.value}>
                      {f.name}
                    </option>
                  ))}
                </Select>
              </ControlRow>
              <ControlRow label="Size">
                <SliderInput
                  value={config.typography.fontSize}
                  onChange={(v) => updateTypography({ fontSize: v })}
                  min={8}
                  max={72}
                />
              </ControlRow>
              <ControlRow label="Weight">
                <Select
                  value={config.typography.fontWeight}
                  onChange={(e) =>
                    updateTypography({ fontWeight: e.target.value })
                  }
                >
                  <option value="100">Thin</option>
                  <option value="300">Light</option>
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="600">Semibold</option>
                  <option value="700">Bold</option>
                  <option value="900">Black</option>
                </Select>
              </ControlRow>
              <ControlRow label="Spacing">
                <SliderInput
                  value={config.typography.letterSpacing}
                  step={0.01}
                  onChange={(v) => updateTypography({ letterSpacing: v })}
                  min={-0.1}
                  max={0.5}
                />
              </ControlRow>
              <ControlRow label="Case">
                <Select
                  value={config.typography.textTransform}
                  onChange={(e) =>
                    updateTypography({ textTransform: e.target.value as any })
                  }
                >
                  <option value="none">Normal</option>
                  <option value="uppercase">Uppercase</option>
                  <option value="lowercase">Lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </Select>
              </ControlRow>
            </Section>

            <Section title="Icon" className="px-5">
              <div className="flex items-center justify-between mb-2">
                <Label>Enable Icon</Label>
                <Toggle
                  value={config.icon.enabled}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      icon: { ...p.icon, enabled: v },
                    }))
                  }
                />
              </div>
              {config.icon.enabled && (
                <div className="space-y-3 pt-2 border-t border-dashed border-zinc-200 dark:border-zinc-800">
                  <ControlRow label="Position">
                    <SegmentedControl
                      value={config.icon.position}
                      options={[
                        { label: "Left", value: "left" },
                        { label: "Right", value: "right" },
                      ]}
                      onChange={(v) =>
                        setConfig((p) => ({
                          ...p,
                          icon: { ...p.icon, position: v as any },
                        }))
                      }
                    />
                  </ControlRow>
                  <ControlRow label="Size">
                    <SliderInput
                      value={config.icon.size}
                      onChange={(v) =>
                        setConfig((p) => ({
                          ...p,
                          icon: { ...p.icon, size: v },
                        }))
                      }
                      min={8}
                      max={48}
                    />
                  </ControlRow>
                  <ControlRow label="Gap">
                    <SliderInput
                      value={config.icon.gap}
                      onChange={(v) =>
                        setConfig((p) => ({
                          ...p,
                          icon: { ...p.icon, gap: v },
                        }))
                      }
                      min={0}
                      max={32}
                    />
                  </ControlRow>
                  <ControlRow label="Anim">
                    <Select
                      value={config.icon.animation}
                      onChange={(e) =>
                        setConfig((p) => ({
                          ...p,
                          icon: { ...p.icon, animation: e.target.value as any },
                        }))
                      }
                    >
                      <option value="none">None</option>
                      <option value="spin">Spin</option>
                      <option value="pulse">Pulse</option>
                      <option value="bounce">Bounce</option>
                      <option value="ping">Ping</option>
                    </Select>
                  </ControlRow>
                  <ControlRow label="Rotate">
                    <SliderInput
                      value={config.icon.rotate}
                      onChange={(v) =>
                        setConfig((p) => ({
                          ...p,
                          icon: { ...p.icon, rotate: v },
                        }))
                      }
                      min={-180}
                      max={180}
                    />
                  </ControlRow>
                </div>
              )}
            </Section>
          </>
        )}

        {/* --- STATES TAB --- */}
        {activeTab === "states" && (
          <>
            {/* State Selector */}
            <div className="sticky top-0 bg-panel-bg z-20 p-3 pb-4 border-b border-panel-border border-dashed shadow-sm">
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    "default",
                    "hover",
                    "active",
                    "focus",
                    "disabled",
                    "loading",
                  ] as const
                ).map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveState(s)}
                    className={cn(
                      "px-0 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all border",
                      activeState === s
                        ? "bg-zinc-800 text-white border-zinc-700 shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Section title="Appearance" defaultOpen className="px-5">
              <ControlRow label="Type" className="mb-2">
                <SegmentedControl
                  value={currentBg.type === "solid" ? "solid" : "gradient"}
                  options={[
                    { label: "Solid", value: "solid" },
                    { label: "Gradient", value: "gradient" },
                  ]}
                  onChange={(v) => handleBgTypeChange(v as any)}
                />
              </ControlRow>

              {currentBg.type === "solid" ? (
                <ControlRow label="Fill Color">
                  <ColorPicker
                    value={currentBg.value}
                    onChange={(v) =>
                      updateState({ background: { type: "solid", value: v } })
                    }
                  />
                </ControlRow>
              ) : (
                <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-3">
                  <ControlRow label="Gradient">
                    <Select
                      value={currentBg.value.type}
                      onChange={(e) =>
                        updateGradient({ type: e.target.value as any })
                      }
                    >
                      <option value="linear">Linear</option>
                      <option value="radial">Radial</option>
                      <option value="conic">Conic</option>
                    </Select>
                  </ControlRow>
                  {currentBg.value.type !== "radial" && (
                    <ControlRow label="Angle">
                      <SliderInput
                        value={currentBg.value.angle}
                        onChange={(v) => updateGradient({ angle: v })}
                        min={0}
                        max={360}
                      />
                    </ControlRow>
                  )}
                  <Label>Stops</Label>
                  {currentBg.value.stops.map((stop, i) => (
                    <div key={stop.id} className="flex gap-2 mb-1">
                      <ColorPicker
                        value={stop.color}
                        onChange={(v) => {
                          const newStops = [...currentBg.value.stops];
                          newStops[i].color = v;
                          updateGradient({ stops: newStops });
                        }}
                      />
                      <Input
                        type="number"
                        className="w-12 h-6 text-xs"
                        value={stop.position}
                        onChange={(e) => {
                          const newStops = [...currentBg.value.stops];
                          newStops[i].position = Number(e.target.value);
                          updateGradient({ stops: newStops });
                        }}
                      />
                    </div>
                  ))}
                  <Button
                    onClick={() => {
                      updateGradient({
                        stops: [
                          ...currentBg.value.stops,
                          {
                            id: Date.now().toString(),
                            color: "#ffffff",
                            position: 100,
                            opacity: 1,
                          },
                        ],
                      });
                    }}
                    size="sm"
                    variant="outline"
                    className="w-full text-xs h-6"
                  >
                    Add Stop
                  </Button>
                </div>
              )}

              <div className="space-y-3 mt-4">
                <ControlRow label="Text Color">
                  <ColorPicker
                    value={currentStateStyle.textColor}
                    onChange={(v) => updateState({ textColor: v })}
                  />
                </ControlRow>
                <ControlRow label="Border Color">
                  <ColorPicker
                    value={currentStateStyle.borderColor}
                    onChange={(v) => updateState({ borderColor: v })}
                  />
                </ControlRow>
                <ControlRow label="Opacity">
                  <SliderInput
                    value={currentStateStyle.opacity}
                    min={0}
                    max={1}
                    step={0.05}
                    onChange={(v) => updateState({ opacity: v })}
                  />
                </ControlRow>
                <ControlRow label="Cursor">
                  <Select
                    value={currentStateStyle.cursor}
                    onChange={(e) =>
                      updateState({ cursor: e.target.value as any })
                    }
                  >
                    <option value="default">Default</option>
                    <option value="pointer">Pointer</option>
                    <option value="not-allowed">Not Allowed</option>
                    <option value="wait">Wait</option>
                  </Select>
                </ControlRow>
              </div>
            </Section>

            <Section title="Transforms (Motion)" className="px-5">
              <div className="grid grid-cols-2 gap-3">
                <ControlRow label="Scale" compact>
                  <SliderInput
                    value={currentStateStyle.transform.scale}
                    step={0.01}
                    min={0.5}
                    max={1.5}
                    onChange={(v) => updateStateTransform({ scale: v })}
                  />
                </ControlRow>
                <ControlRow label="Rotate" compact>
                  <SliderInput
                    value={currentStateStyle.transform.rotate}
                    min={-180}
                    max={180}
                    onChange={(v) => updateStateTransform({ rotate: v })}
                  />
                </ControlRow>
                <ControlRow label="X" compact>
                  <SliderInput
                    value={currentStateStyle.transform.translateX}
                    min={-50}
                    max={50}
                    onChange={(v) => updateStateTransform({ translateX: v })}
                  />
                </ControlRow>
                <ControlRow label="Y" compact>
                  <SliderInput
                    value={currentStateStyle.transform.translateY}
                    min={-50}
                    max={50}
                    onChange={(v) => updateStateTransform({ translateY: v })}
                  />
                </ControlRow>
              </div>
            </Section>

            <Section title="Filters" className="px-5">
              <ControlRow label="Blur">
                <SliderInput
                  value={currentStateStyle.filter?.blur || 0}
                  min={0}
                  max={20}
                  onChange={(v) => updateStateFilter({ blur: v })}
                />
              </ControlRow>
              <ControlRow label="Brightness">
                <SliderInput
                  value={currentStateStyle.filter?.brightness || 100}
                  min={0}
                  max={200}
                  onChange={(v) => updateStateFilter({ brightness: v })}
                />
              </ControlRow>
              <ControlRow label="Grayscale">
                <SliderInput
                  value={currentStateStyle.filter?.grayscale || 0}
                  min={0}
                  max={100}
                  onChange={(v) => updateStateFilter({ grayscale: v })}
                />
              </ControlRow>
            </Section>

            <Section title="Shadows" className="px-5">
              <div className="space-y-4">
                {currentStateStyle.shadows.map((shadow, i) => (
                  <div
                    key={shadow.id}
                    className="p-3 bg-dashed border border-zinc-200 dark:border-zinc-800 rounded relative group"
                  >
                    <button
                      onClick={() => removeShadow(i)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                    <div className="flex items-center gap-2 mb-2">
                      <Toggle
                        value={shadow.enabled}
                        onChange={(v) => updateShadow(i, { enabled: v })}
                      />
                      <Label className="mb-0">Shadow {i + 1}</Label>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        type="number"
                        placeholder="X"
                        value={shadow.x}
                        onChange={(e) =>
                          updateShadow(i, { x: Number(e.target.value) })
                        }
                        className="h-7 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Y"
                        value={shadow.y}
                        onChange={(e) =>
                          updateShadow(i, { y: Number(e.target.value) })
                        }
                        className="h-7 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Blur"
                        value={shadow.blur}
                        onChange={(e) =>
                          updateShadow(i, { blur: Number(e.target.value) })
                        }
                        className="h-7 text-xs"
                      />
                      <Input
                        type="number"
                        placeholder="Spread"
                        value={shadow.spread}
                        onChange={(e) =>
                          updateShadow(i, { spread: Number(e.target.value) })
                        }
                        className="h-7 text-xs"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <ColorPicker
                        value={shadow.color}
                        onChange={(v) => updateShadow(i, { color: v })}
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={shadow.inset}
                          onChange={(e) =>
                            updateShadow(i, { inset: e.target.checked })
                          }
                        />
                        <span className="text-[10px] text-zinc-500">Inset</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={addShadow}
                  variant="outline"
                  className="w-full h-8 text-xs border-dashed gap-1"
                >
                  <Plus size={12} /> Add Shadow
                </Button>
              </div>
            </Section>
          </>
        )}

        {/* --- SETTINGS TAB --- */}
        {activeTab === "settings" && (
          <>
            <Section title="Motion Global" className="px-5">
              <ControlRow label="Duration">
                <SliderInput
                  value={config.motion.duration}
                  min={0}
                  max={1000}
                  onChange={(v) => updateMotion({ duration: v })}
                />
              </ControlRow>
              <ControlRow label="Delay">
                <SliderInput
                  value={config.motion.delay}
                  min={0}
                  max={500}
                  onChange={(v) => updateMotion({ delay: v })}
                />
              </ControlRow>
              <ControlRow label="Easing">
                <Select
                  value={config.motion.easing}
                  onChange={(e) => updateMotion({ easing: e.target.value })}
                >
                  <option value="linear">Linear</option>
                  <option value="ease">Ease</option>
                  <option value="ease-in">Ease In</option>
                  <option value="ease-out">Ease Out</option>
                  <option value="ease-in-out">Ease In Out</option>
                  <option value="cubic-bezier(0.4, 0, 0.2, 1)">
                    Fast Out Slow In
                  </option>
                  <option value="cubic-bezier(0.34, 1.56, 0.64, 1)">
                    Spring
                  </option>
                </Select>
              </ControlRow>
            </Section>

            <Section title="Interactions" className="px-5">
              <ControlRow label="Ripple Effect">
                <Toggle
                  value={config.interactions.ripple}
                  onChange={(v) => updateInteractive({ ripple: v })}
                />
              </ControlRow>
              <ControlRow label="Magnetic">
                <Toggle
                  value={config.interactions.magnetic}
                  onChange={(v) => updateInteractive({ magnetic: v })}
                />
              </ControlRow>
              {config.interactions.magnetic && (
                <ControlRow label="Strength">
                  <SliderInput
                    value={config.interactions.magneticStrength}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={(v) => updateInteractive({ magneticStrength: v })}
                  />
                </ControlRow>
              )}
              <ControlRow label="Scale on Press">
                <SliderInput
                  value={config.interactions.scaleOnPress}
                  min={0.5}
                  max={1}
                  step={0.01}
                  onChange={(v) => updateInteractive({ scaleOnPress: v })}
                />
              </ControlRow>
            </Section>

            <Section title="Effects" className="px-5">
              <ControlRow label="Backdrop Blur">
                <SliderInput
                  value={config.effects.backdropBlur}
                  min={0}
                  max={20}
                  onChange={(v) => updateEffects({ backdropBlur: v })}
                />
              </ControlRow>
              <ControlRow label="BG Blur">
                <SliderInput
                  value={config.effects.bgBlur}
                  min={0}
                  max={20}
                  onChange={(v) => updateEffects({ bgBlur: v })}
                />
              </ControlRow>
            </Section>

            <Section title="3D Transform" className="px-5">
              <div className="flex items-center justify-between mb-2">
                <Label>Enable 3D</Label>
                <Toggle
                  value={config.transform.enabled}
                  onChange={(v) =>
                    setConfig((p) => ({
                      ...p,
                      transform: { ...p.transform, enabled: v },
                    }))
                  }
                />
              </div>
              {config.transform.enabled && (
                <>
                  <ControlRow label="Tilt X">
                    <SliderInput
                      value={config.transform.tilt}
                      min={-45}
                      max={45}
                      onChange={(v) =>
                        setConfig((p) => ({
                          ...p,
                          transform: { ...p.transform, tilt: v },
                        }))
                      }
                    />
                  </ControlRow>
                  <ControlRow label="Perspective">
                    <SliderInput
                      value={config.transform.perspective}
                      min={100}
                      max={2000}
                      onChange={(v) =>
                        setConfig((p) => ({
                          ...p,
                          transform: { ...p.transform, perspective: v },
                        }))
                      }
                    />
                  </ControlRow>
                </>
              )}
            </Section>
          </>
        )}
      </div>
    </div>
  );
};
