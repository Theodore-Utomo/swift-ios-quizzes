import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { QuestionType } from "../../../types/quiz";

interface CorrectAnswerInputProps {
  questionType: QuestionType;
  options: string[];
  value: string | string[];
  onChange: (v: string | string[]) => void;
}

function normalizeToAnswers(value: string | string[]): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    if (value.startsWith("[") && value.endsWith("]")) {
      try {
        return JSON.parse(value);
      } catch {
        return [];
      }
    }
    return value ? value.split(", ").filter((a) => a.trim()) : [];
  }
  return [];
}

export const CorrectAnswerInput: React.FC<CorrectAnswerInputProps> = ({
  questionType,
  options,
  value,
  onChange,
}) => {
  if (questionType === QuestionType.MCQ) {
    const strValue = typeof value === "string" ? value : "";
    return (
      <div className="space-y-2">
        <Label>Correct Answer</Label>
        <Select
          value={strValue}
          onValueChange={(v) => onChange(v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select the correct answer" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (questionType === QuestionType.MULTIPLE_ANSWER) {
    const currentAnswers = normalizeToAnswers(value);
    return (
      <div className="space-y-2">
        <Label>Correct Answers</Label>
        {options.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add answer options first</p>
        ) : (
          <div className="space-y-2">
            {options.map((option) => {
              const isChecked = currentAnswers.includes(option);
              return (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`answer-${option}`}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      const newAnswers = checked
                        ? [...currentAnswers, option]
                        : currentAnswers.filter((a) => a !== option);
                      onChange(newAnswers);
                    }}
                  />
                  <Label
                    htmlFor={`answer-${option}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // SHORT_ANSWER
  const strValue =
    typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value.join(", ")
        : "";
  return (
    <div className="space-y-2">
      <Label>Correct Answer</Label>
      <Textarea
        value={strValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Expected answer (Supports line breaks)"
        rows={3}
      />
    </div>
  );
};
