import { create } from "zustand";
import type { PrescreenQuestion, PrescreenQuestionType } from "@/types/prescreen";

type BuilderState = {
  questions: PrescreenQuestion[];
  setQuestions: (questions: PrescreenQuestion[]) => void;
  addQuestion: (type: PrescreenQuestionType) => void;
  updateQuestion: (id: string, patch: Partial<PrescreenQuestion>) => void;
  removeQuestion: (id: string) => void;
  reorderQuestion: (fromIndex: number, toIndex: number) => void;
};

function makeId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function emptyQuestion(type: PrescreenQuestionType, order: number): PrescreenQuestion {
  return {
    id: makeId("q"),
    type,
    title: "Untitled question",
    description: "",
    helperText: "",
    required: false,
    placeholder: "",
    defaultValue: null,
    options:
      type === "radio" || type === "checkbox" || type === "dropdown"
        ? [
            { id: makeId("opt"), label: "Option 1", value: "option_1" },
            { id: makeId("opt"), label: "Option 2", value: "option_2" },
          ]
        : [],
    validation: {},
    randomizeOptions: false,
    order,
  };
}

export const usePrescreenBuilderStore = create<BuilderState>()((set) => ({
  questions: [],
  setQuestions: (questions) =>
    set({
      questions: [...questions]
        .sort((a, b) => a.order - b.order)
        .map((q, idx) => ({ ...q, order: idx })),
    }),
  addQuestion: (type) =>
    set((state) => {
      const next = [...state.questions, emptyQuestion(type, state.questions.length)];
      return { questions: next };
    }),
  updateQuestion: (id, patch) =>
    set((state) => ({
      questions: state.questions.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    })),
  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id).map((q, idx) => ({ ...q, order: idx })),
    })),
  reorderQuestion: (fromIndex, toIndex) =>
    set((state) => {
      const next = [...state.questions];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return { questions: next.map((q, idx) => ({ ...q, order: idx })) };
    }),
}));
