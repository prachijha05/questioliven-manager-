import { create } from "zustand";
import rawData from "../data/sheet.json";

const KEY = "questions";

const stored = JSON.parse(localStorage.getItem(KEY));

export const useSheetStore = create((set) => ({
  sheetInfo: rawData.data.sheet,

  questions:
    stored ||
    rawData.data.questions.map((q) => ({
      ...q,
      solved: false,
    })),

  /* ================= ADD ================= */
  addQuestion: (q) =>
    set((state) => {
      const updated = [...state.questions, q];
      localStorage.setItem(KEY, JSON.stringify(updated));
      return { questions: updated };
    }),

  /* ================= EDIT ================= */
  updateQuestion: (updatedQ) =>
    set((state) => {
      const updated = state.questions.map((q) =>
        q._id === updatedQ._id ? updatedQ : q,
      );
      localStorage.setItem(KEY, JSON.stringify(updated));
      return { questions: updated };
    }),

  /* ================= TOGGLE ================= */
  toggleSolved: (id) =>
    set((state) => {
      const updated = state.questions.map((q) =>
        q._id === id ? { ...q, solved: !q.solved } : q,
      );

      localStorage.setItem(KEY, JSON.stringify(updated));
      return { questions: updated };
    }),

  /* ================= DELETE QUESTION ================= */
  deleteQuestion: (id) =>
    set((state) => {
      const updated = state.questions.filter((q) => q._id !== id);

      localStorage.setItem(KEY, JSON.stringify(updated));
      return { questions: updated };
    }),

  /* ================= DELETE TOPIC ================= */
  deleteTopic: (topicName) =>
    set((state) => {
      const updated = state.questions.filter((q) => q.topic !== topicName);

      localStorage.setItem(KEY, JSON.stringify(updated));
      return { questions: updated };
    }),

  /* ================= REORDER ================= */
  reorderQuestions: (updated) =>
    set(() => {
      localStorage.setItem(KEY, JSON.stringify(updated));
      return { questions: updated };
    }),
}));
