import { ToolFrame } from "../../components/ToolFrame";
import { Card } from "../../components/UI";

export default function Settings() {
  return (
    <ToolFrame
      eyebrow="Preferences"
      title="Settings"
      description="Manage app preferences and workspace settings."
      toolId="settings"
    >
      <Card>
        <div className="text-sm text-muted">This tool is ready for workspace settings.</div>
      </Card>
    </ToolFrame>
  );
}
