import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  AlertCircle,
  BookOpen,
  Clock,
  Globe,
  Hash,
  Settings,
  Star,
  Brain,
} from "lucide-react";
import InputField from "../UI/InputField";
import TextInput from "../UI/TextInput";
import Select from "../UI/Select";
import Button from "../UI/Button";
import PdfPicker from "../UI/PdfPicker";
import QuestionBreakdownSelector from "../QuestionBreakdownSelector";
import { generateBreakdowns } from "../Helpers/breakdownUtils";

export default function ConfigurationStep({ onGenerate, isGenerating, formError }) {
  const [config, setConfig] = useState({
    subject: "",
    numQuestions: "10",
    breakdown: null,
    totalMarks: "50",
    duration: "90",
    difficulty: "Medium",
    language: "English",
    standard: "6",   // default class
    referenceIds: [] // will store refreshId after PDF upload
  });

  const [errors, setErrors] = useState({});
  const [breakdowns, setBreakdowns] = useState([]);

  // 🧠 Auto-generate breakdowns when question count or difficulty changes
  const handleGenerateBreakdowns = useCallback(() => {
    const b = generateBreakdowns(parseInt(config.numQuestions, 10), config.difficulty);
    setBreakdowns(b);
    setConfig((prev) => ({ ...prev, breakdown: b[0] || null }));
  }, [config.numQuestions, config.difficulty]);

  useEffect(() => {
    handleGenerateBreakdowns();
  }, [handleGenerateBreakdowns]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setConfig((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: null }));
  };

  // Update referenceIds after PDF upload
  const setReferenceId = (refreshId) => {
    setConfig((prev) => ({ ...prev, referenceIds: [refreshId] }));
  };

  const validate = () => {
    const newErrors = {};
    if (!config.subject.trim()) newErrors.subject = "Subject is required.";
    if (!config.breakdown) newErrors.breakdown = "Please select a breakdown.";
    if (parseInt(config.totalMarks) <= 0) newErrors.totalMarks = "Marks must be > 0.";
    if (parseInt(config.duration) <= 0) newErrors.duration = "Duration must be > 0.";
    if (!config.standard) newErrors.standard = "Please select a standard.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onGenerate(config);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-white shadow-sm rounded-2xl p-6 md:p-10 border border-gray-100 transition-all duration-200 hover:shadow-md"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Brain className="w-6 h-6 text-indigo-500" />
          Configure Your Paper
        </h2>
        <p className="text-gray-600 text-sm">
          Set up your paper preferences — subject, difficulty, duration, and more.
        </p>
      </div>

      {formError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{formError}</span>
        </div>
      )}

      {/* Subject & Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField id="subject" label="Subject" icon={<BookOpen />}>
          <TextInput
            id="subject"
            value={config.subject}
            onChange={handleChange}
            placeholder="E.g., Physics"
          />
        </InputField>

        <InputField id="numQuestions" label="Questions" icon={<Hash />}>
          <Select id="numQuestions" value={config.numQuestions} onChange={handleChange}>
            {Array.from({ length: 16 }, (_, i) => i + 5).map((n) => (
              <option key={n}>{n}</option>
            ))}
          </Select>
        </InputField>
      </div>

      {/* Breakdown Selector */}
      <QuestionBreakdownSelector
        breakdowns={breakdowns}
        selected={config.breakdown}
        onSelect={(b) => setConfig({ ...config, breakdown: b })}
        error={errors.breakdown}
      />

      {/* Marks, Duration, Difficulty */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InputField id="totalMarks" label="Total Marks" icon={<Star />}>
          <TextInput
            id="totalMarks"
            type="number"
            min="1"
            value={config.totalMarks}
            onChange={handleChange}
          />
        </InputField>

        <InputField id="duration" label="Duration (mins)" icon={<Clock />}>
          <TextInput
            id="duration"
            type="number"
            min="1"
            value={config.duration}
            onChange={handleChange}
          />
        </InputField>

        <InputField id="difficulty" label="Difficulty" icon={<Settings />}>
          <Select id="difficulty" value={config.difficulty} onChange={handleChange}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </Select>
        </InputField>
      </div>

      {/* Language */}
      <InputField id="language" label="Language" icon={<Globe />}>
        <Select id="language" value={config.language} onChange={handleChange}>
          <option>English</option>
          <option>Hindi</option>
        </Select>
      </InputField>

      {/* Standard */}
      <InputField id="standard" label="Class / Standard" icon={<Star />}>
        <Select
          id="standard"
          value={config.standard}
          onChange={(e) => setConfig((prev) => ({ ...prev, standard: e.target.value }))}
        >
          {Array.from({ length: 7 }, (_, i) => i + 6).map((n) => (
            <option key={n}>{n}</option>
          ))}
        </Select>
      </InputField>

      {/* PDF Picker */}
      <PdfPicker
        id="pdfFile"
        label="Select Book / PDF"
        file={config.pdfFile}
        onChange={(file) => setConfig((prev) => ({ ...prev, pdfFile: file }))}
        setReferenceId={setReferenceId}
        error={errors.pdfFile}
      />

      {/* Action */}
      <div className="pt-4 border-t border-gray-100 flex justify-end">
        <Button
          type="submit"
          disabled={isGenerating}
          className="transition-all duration-300 hover:scale-[1.02]"
        >
          {isGenerating ? "Generating..." : "Generate Paper"}
        </Button>
      </div>
    </form>
  );
}
