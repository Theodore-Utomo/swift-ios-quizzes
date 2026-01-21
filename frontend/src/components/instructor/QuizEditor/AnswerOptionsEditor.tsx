import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/ui/markdown-editor";

interface AnswerOptionsEditorProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
}

export const AnswerOptionsEditor: React.FC<AnswerOptionsEditorProps> = ({
  options,
  onOptionsChange,
}) => {
  const [draft, setDraft] = useState("");

  const handleOptionChange = (optionIndex: number, value: string) => {
    const updated = [...options];
    updated[optionIndex] = value;
    onOptionsChange(updated);
  };

  const handleRemoveOption = (optionIndex: number) => {
    onOptionsChange(options.filter((_, i) => i !== optionIndex));
  };

  const handleAddOption = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onOptionsChange([...options, trimmed]);
    setDraft("");
  };

  return (
    <div className="space-y-2">
      <Label>Answer Options</Label>
      <div className="space-y-3">
        {options.map((option, optionIndex) => (
          <div key={optionIndex} className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-sm text-muted-foreground">
                Option {optionIndex + 1}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveOption(optionIndex)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <MarkdownEditor
              value={option}
              onChange={(value) => handleOptionChange(optionIndex, value)}
              placeholder="Enter answer option... (Supports Markdown)"
              rows={2}
              compact={true}
            />
          </div>
        ))}
        <div className="space-y-1">
          <Label className="text-sm text-muted-foreground">Add New Option</Label>
          <div className="flex items-start space-x-2">
            <div className="flex-1">
              <MarkdownEditor
                value={draft}
                onChange={setDraft}
                placeholder="Add new option... (Supports Markdown)"
                rows={2}
                compact={true}
              />
            </div>
            <Button
              onClick={handleAddOption}
              disabled={!draft.trim()}
              className="mt-1"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
