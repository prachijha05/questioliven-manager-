import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSheetStore } from "../store/useSheetStore";
import { useState } from "react";

/* ================= MAIN ================= */

export default function Home() {
  const sheetInfo = useSheetStore((s) => s.sheetInfo);
  const questions = useSheetStore((s) => s.questions);

  const addQuestion = useSheetStore((s) => s.addQuestion);
  const updateQuestion = useSheetStore((s) => s.updateQuestion);
  const deleteQuestion = useSheetStore((s) => s.deleteQuestion);
  const toggleSolved = useSheetStore((s) => s.toggleSolved);
  const reorderQuestions = useSheetStore((s) => s.reorderQuestions);
  const deleteTopic = useSheetStore((s) => s.deleteTopic);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  /* ============ GROUP QUESTIONS ============ */

  const grouped = {};
  questions.forEach((q) => {
    const topic = q.topic || "Other";
    const sub = q.subTopic || "General";

    if (!grouped[topic]) grouped[topic] = {};
    if (!grouped[topic][sub]) grouped[topic][sub] = [];

    grouped[topic][sub].push(q);
  });

  /* ============ DRAG ============ */

  function onDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);

    reorderQuestions(items);
  }

  /* ============ STATS ============ */

  const total = questions.length;
  const solved = questions.filter((q) => q.solved).length;
  const percent = Math.round((solved / total) * 100);

  /* ============ UI ============ */

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gray-950/80 border border-gray-800 rounded-3xl shadow-2xl p-10 space-y-12">
          {/* HEADER */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-extrabold">{sheetInfo.name}</h1>
              <p className="text-gray-400 mt-2 max-w-2xl">
                {sheetInfo.description}
              </p>
            </div>

            <button
              onClick={() => {
                setEditData(null);
                setShowModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg font-medium"
            >
              + Add Question
            </button>
          </div>

          {/* DASHBOARD */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
              <Stat label="Solved" value={`${solved}/${total}`} />
              <Stat label="Remaining" value={total - solved} />
              <Stat label="Completion" value={`${percent}%`} />
              <Stat
                label="Progress"
                value={percent >= 80 ? "Good" : "Improve"}
              />
            </div>

            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* TOPICS */}
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="space-y-6">
              {Object.entries(grouped).map(([topic, subTopics]) => (
                <TopicSection
                  key={topic}
                  topic={topic}
                  subTopics={subTopics}
                  toggleSolved={toggleSolved}
                  deleteQuestion={deleteQuestion}
                  deleteTopic={deleteTopic}
                  onEdit={(q) => {
                    setEditData(q);
                    setShowModal(true);
                  }}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <QuestionModal
          editData={editData}
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSave={addQuestion}
          onUpdate={updateQuestion}
        />
      )}
    </div>
  );
}

/* ================= TOPIC ================= */

function TopicSection({
  topic,
  subTopics,
  toggleSolved,
  deleteQuestion,
  deleteTopic,
  onEdit,
}) {
  const [open, setOpen] = useState(false);

  const total = Object.values(subTopics).flat().length;
  const solved = Object.values(subTopics)
    .flat()
    .filter((q) => q.solved).length;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden">
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-gray-800"
      >
        <h2 className="font-semibold text-lg">{topic}</h2>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>
            {solved}/{total}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this topic?")) deleteTopic(topic);
            }}
            className="text-red-400"
          >
            🗑
          </button>

          <span>{open ? "▾" : "▸"}</span>
        </div>
      </div>

      {open && (
        <div className="p-6 space-y-8 bg-gray-800/80">
          {Object.entries(subTopics).map(([sub, qs]) => (
            <div key={sub}>
              <h3 className="text-blue-400 font-semibold mb-4">{sub}</h3>

              <Droppable droppableId={`${topic}-${sub}`}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {qs.map((q, index) => (
                      <Draggable key={q._id} draggableId={q._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-700 rounded-xl p-4 mb-3"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={q.solved}
                                onChange={() => toggleSolved(q._id)}
                              />
                              <span
                                className={
                                  q.solved ? "line-through text-gray-400" : ""
                                }
                              >
                                {q.title}
                              </span>
                            </div>

                            <div className="flex justify-between mt-2 text-sm">
                              <a
                                href={q.questionId.problemUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-400"
                              >
                                Open
                              </a>

                              <div className="flex gap-3">
                                <button
                                  onClick={() => onEdit(q)}
                                  className="text-yellow-400"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteQuestion(q._id)}
                                  className="text-red-400"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function QuestionModal({ editData, onClose, onSave, onUpdate }) {
  const [title, setTitle] = useState(editData?.title || "");
  const [topic, setTopic] = useState(editData?.topic || "");
  const [sub, setSub] = useState(editData?.subTopic || "");
  const [url, setUrl] = useState(editData?.questionId?.problemUrl || "");

  function handleSave() {
    if (!title || !topic) return alert("Title & Topic required");

    const payload = {
      _id: editData?._id || Date.now().toString(),
      title,
      topic,
      subTopic: sub || "General",
      questionId: { problemUrl: url },
      solved: editData?.solved || false,
    };

    editData ? onUpdate(payload) : onSave(payload);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold">
          {editData ? "Edit Question" : "Add Question"}
        </h2>

        <input
          className="input"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input"
          placeholder="Topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <input
          className="input"
          placeholder="Sub Topic"
          value={sub}
          onChange={(e) => setSub(e.target.value)}
        />
        <input
          className="input"
          placeholder="Problem URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="text-gray-400">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= STAT ================= */

function Stat({ label, value }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      <p className="text-xs text-gray-400 uppercase">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
