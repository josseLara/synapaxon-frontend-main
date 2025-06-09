import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Image as ImageIcon, ArrowLeft } from "lucide-react";
import MediaDisplay from "./MediaDisplay";
import { categories, subjectsByCategory, topicsBySubject } from "../data/questionData";
import axios from '../api/axiosConfig';
import Preloader from "../components/Preloader";

const AttemptedQuestionsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pages: 1, limit: 10 });
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [questionDetails, setQuestionDetails] = useState({});
  const [questionStatusFilter, setQuestionStatusFilter] = useState("all");
  const [difficulty, setDifficulty] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [counts, setCounts] = useState({ all: 0, correct: 0, incorrect: 0 });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    subjects: [],
    topics: []
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "light");
    };
    window.addEventListener("storage", handleStorageChange);
    document.documentElement.classList.toggle("dark", theme === "dark");
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [theme]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let url = `/api/student-questions/history?page=${pagination.current}&limit=${pagination.limit}`;

      // Añadir filtro de estado (correct/incorrect)
      if (questionStatusFilter === "correct") url += "&isCorrect=true";
      if (questionStatusFilter === "incorrect") url += "&isCorrect=false&flagged=false";

      // Añadir filtros del objeto filters
      if (filters.difficulty) url += `&difficulty=${filters.difficulty}`;
      if (filters.category) url += `&category=${filters.category}`;
      if (filters.subjects.length > 0) url += `&subjects=${filters.subjects.join(",")}`;
      if (filters.topics.length > 0) url += `&topics=${filters.topics.join(",")}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.data.success) throw new Error(response.data.message || "Failed to fetch questions");
      setQuestions(response.data.data || []);
      setPagination({
        current: response.data.pagination?.current || 1,
        pages: response.data.pagination?.pages || 1,
        limit: response.data.pagination?.limit || 10,
      });
      setTotalQuestions(response.data.total || 0);

      const detailsPromises = response.data.data.map(async (q) => {
        try {
          const detailRes = await axios.get(`/api/questions/${q.question?._id || q._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          return detailRes.data.success
            ? { [q._id]: detailRes.data.data }
            : { [q._id]: { explanation: "No explanation", questionMedia: [], explanationMedia: [], options: [] } };
        } catch {
          return { [q._id]: { explanation: "Error fetching", questionMedia: [], explanationMedia: [], options: [] } };
        }
      });
      setQuestionDetails((await Promise.all(detailsPromises)).reduce((acc, curr) => ({ ...acc, ...curr }), {}));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setFilters({
      difficulty: filters.difficulty,
      category,
      subjects: [],
      topics: []
    });
  };

  const handleSubjectToggle = (subject) => {
    setFilters(prev => {
      const subjectExists = prev.subjects.includes(subject);
      return {
        ...prev,
        subjects: subjectExists
          ? prev.subjects.filter(s => s !== subject)
          : [...prev.subjects, subject],
        topics: subjectExists ? prev.topics : [] // Reset topics when changing subjects
      };
    });
  };

  const handleTopicToggle = (topic) => {
    setFilters(prev => {
      const topicExists = prev.topics.includes(topic);
      return {
        ...prev,
        topics: topicExists
          ? prev.topics.filter(t => t !== topic)
          : [...prev.topics, topic]
      };
    });
  };

  const fetchCounts = async () => {
    try {
      const allRes = await axios.get(
        `/api/student-questions/history?${difficulty ? `difficulty=${difficulty}&` : ""}${selectedCategory ? `category=${selectedCategory}&` : ""
        }${selectedSubject ? `subject=${selectedSubject}&` : ""}${selectedTopic ? `topic=${selectedTopic}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const correctRes = await axios.get(
        `/api/student-questions/history?isCorrect=true${difficulty ? `&difficulty=${difficulty}` : ""}${selectedCategory ? `&category=${selectedCategory}` : ""
        }${selectedSubject ? `&subject=${selectedSubject}&` : ""}${selectedTopic ? `topic=${selectedTopic}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const incorrectRes = await axios.get(
        `/api/student-questions/history?isCorrect=false&flagged=false${difficulty ? `&difficulty=${difficulty}` : ""}${selectedCategory ? `&category=${selectedCategory}&` : ""
        }${selectedSubject ? `subject=${selectedSubject}&` : ""}${selectedTopic ? `topic=${selectedTopic}` : ""}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCounts({
        all: allRes.data.total || 0,
        correct: correctRes.data.total || 0,
        incorrect: incorrectRes.data.total || 0,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  useEffect(() => {
    fetchCounts();
    fetchQuestions();
  }, [questionStatusFilter, filters, pagination.current]); // Usar filters como dependencia

  const filteredQuestions = useMemo(() => questions, [questions]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, current: page }));
  };

  const toggleQuestion = (questionId) => {
    setExpandedQuestions((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const formatDate = (dateString) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(new Date(dateString));
  };

  const resetFilters = () => {
    setDifficulty("");
    setSelectedCategory("");
    setSelectedSubject("");
    setSelectedTopic("");
  };

  return (
    <div className="min-h-screen py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">My Attempted Questions</h1>
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center px-4 py-2 bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 rounded-lg hover:bg-white/40 dark:hover:bg-black/20 transition backdrop-blur-sm border border-white/40 dark:border-gray-700/30"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Sección de Filtros */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-white/40 dark:border-gray-800/20 p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-200">Filter Questions</h2>

          {/* Filtro de dificultad */}
          <div className="mb-6">
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Difficulty</label>
            <div className="flex space-x-4">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, difficulty: prev.difficulty === level ? '' : level }))}
                  className={`px-4 py-2 rounded-lg font-medium backdrop-blur-sm border border-white/40 dark:border-gray-700/30 ${filters.difficulty === level
                    ? 'bg-blue-600/90 dark:bg-blue-600/80 text-white'
                    : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
                    }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro de categoría */}
          <div className="mb-6">
            <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">Category</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.keys(subjectsByCategory).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`py-3 px-4 text-center font-medium rounded-lg border border-white/40 dark:border-gray-700/30 ${filters.category === category
                    ? 'bg-blue-600/90 dark:bg-blue-600/80 text-white'
                    : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
                    } backdrop-blur-sm`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro de asignaturas (solo si hay categoría seleccionada) */}
          {filters.category && (
            <div className="mb-6">
              <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">
                Select Subjects (Click to select/deselect)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subjectsByCategory[filters.category]?.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectToggle(subject)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium border border-white/40 dark:border-gray-700/30 ${filters.subjects.includes(subject)
                      ? 'bg-blue-600/90 dark:bg-blue-600/80 text-white'
                      : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
                      } backdrop-blur-sm`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filtro de temas (solo si hay asignaturas seleccionadas) */}
          {filters.subjects.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-900 dark:text-gray-200 font-medium mb-2">
                Select Topics (Click to select/deselect)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {filters.subjects.flatMap(subject =>
                  (topicsBySubject[subject] || []).map(topic => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => handleTopicToggle(topic)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border border-white/40 dark:border-gray-700/30 ${filters.topics.includes(topic)
                        ? 'bg-green-600/90 dark:bg-green-600/80 text-white'
                        : 'bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20'
                        } backdrop-blur-sm`}
                    >
                      {topic}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Mostrar filtros aplicados */}
          {(filters.difficulty || filters.category || filters.subjects.length > 0 || filters.topics.length > 0) && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Applied Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.difficulty && (
                  <span className="px-3 py-1 bg-blue-600/30 dark:bg-blue-600/20 text-gray-900 dark:text-gray-300 rounded-full text-sm border border-blue-500/40 dark:border-blue-500/30">
                    Difficulty: {filters.difficulty}
                  </span>
                )}
                {filters.category && (
                  <span className="px-3 py-1 bg-blue-600/30 dark:bg-blue-600/20 text-gray-900 dark:text-gray-300 rounded-full text-sm border border-blue-500/40 dark:border-blue-500/30">
                    Category: {filters.category}
                  </span>
                )}
                {filters.subjects.map(subject => (
                  <span key={subject} className="px-3 py-1 bg-blue-600/30 dark:bg-blue-600/20 text-gray-900 dark:text-gray-300 rounded-full text-sm border border-blue-500/40 dark:border-blue-500/30">
                    Subject: {subject}
                  </span>
                ))}
                {filters.topics.map(topic => (
                  <span key={topic} className="px-3 py-1 bg-green-600/30 dark:bg-green-600/20 text-gray-900 dark:text-gray-300 rounded-full text-sm border border-green-500/40 dark:border-green-500/30">
                    Topic: {topic}
                  </span>
                ))}
                <button
                  onClick={() => setFilters({ difficulty: '', category: '', subjects: [], topics: [] })}
                  className="px-3 py-1 bg-red-600/30 dark:bg-red-600/20 text-gray-900 dark:text-gray-300 rounded-full text-sm hover:bg-red-700/40 dark:hover:bg-red-700/30 border border-red-500/40 dark:border-red-500/30"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/40 dark:border-gray-800/20">
          <div className="bg-blue-600/90 dark:bg-blue-600/80 p-6 text-white flex justify-between items-center backdrop-blur-sm">
            <h2 className="text-2xl font-bold">Filter Questions</h2>
            <div className="text-base font-semibold">
              Total Questions
            </div>
          </div>

          <div className="p-6">
            <div className="flex gap-4 mb-6">
              {[
                { value: "all", label: `All ` },
                { value: "correct", label: `Correct ` },
                { value: "incorrect", label: `Incorrect ` },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => {
                    setQuestionStatusFilter(filter.value);
                    setPagination((prev) => ({ ...prev, current: 1 }));
                  }}
                  className={`px-4 py-2 rounded-lg font-medium backdrop-blur-sm border border-white/40 dark:border-gray-700/30 ${questionStatusFilter === filter.value
                    ? "bg-blue-600/90 dark:bg-blue-600/80 text-white"
                    : "bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20"
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>


          </div>

          <div className="p-6 relative">
            {loading && (
                <div className="w-full">
                  <Preloader left="-10%"/>
                </div>
            )}
            {error && (
              <div className="p-6 bg-red-600/30 dark:bg-red-600/20 border border-red-500/40 dark:border-red-500/30 rounded-lg backdrop-blur-md">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-red-900 dark:text-red-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-900 dark:text-red-200">{error}</span>
                </div>
              </div>
            )}
            {!error && filteredQuestions.length === 0 && !loading && (
              <div className="p-16 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-32 h-32 bg-white/30 dark:bg-black/20 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/40 dark:border-gray-700/30">
                    <ImageIcon className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">No Questions Found</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">Adjust your filters or start a new test to attempt questions.</p>
                  <button
                    onClick={() => navigate("/dashboard/starttest")}
                    className="px-8 py-4 bg-blue-600/90 dark:bg-blue-600/80 text-white rounded-xl hover:bg-blue-700/95 dark:hover:bg-blue-500/90 transition-all text-lg font-semibold shadow-lg backdrop-blur-sm border border-white/40 dark:border-gray-700/20"
                  >
                    Start a New Test
                  </button>
                </div>
              </div>
            )}
            {!error && filteredQuestions.length > 0 && (
              <>
                {filteredQuestions.map((question, index) => (
                  <div
                    key={question._id}
                    className="mb-6 bg-white/30 dark:bg-black/20 backdrop-blur-sm border border-white/40 dark:border-gray-700/30 rounded-xl shadow-sm hover:shadow-lg transition-all"
                  >
                    <button
                      onClick={() => toggleQuestion(question._id)}
                      className="w-full p-6 flex justify-between items-center text-left hover:bg-white/40 dark:hover:bg-black/30"
                    >
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200">
                          Q{index + 1}: {questionDetails[question._id]?.questionText || question.question?.questionText || "Question not available"}
                        </h3>
                        {questionDetails[question._id]?.questionMedia?.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {questionDetails[question._id].questionMedia.map((media, i) => (
                              <MediaDisplay key={i} media={media} label={`Question Media ${i + 1}`} />
                            ))}
                          </div>
                        )}
                      </div>
                      {expandedQuestions[question._id] ? <ChevronUp className="w-6 h-6 text-gray-700 dark:text-gray-300" /> : <ChevronDown className="w-6 h-6 text-gray-700 dark:text-gray-300" />}
                    </button>
                    {expandedQuestions[question._id] && (
                      <div className="p-6 border-t border-white/40 dark:border-gray-700/30">
                        <div className="space-y-4 mb-6">
                          {questionDetails[question._id]?.options?.map((option, oIndex) => (
                            <div
                              key={oIndex}
                              className={`p-4 rounded-lg flex items-center space-x-4 backdrop-blur-sm ${question.selectedAnswer === oIndex && question.isCorrect
                                ? "bg-green-600/30 dark:bg-green-600/20 border border-green-500/40 dark:border-green-500/30"
                                : question.selectedAnswer === oIndex && !question.isCorrect
                                  ? "bg-red-600/30 dark:bg-red-600/20 border border-red-500/40 dark:border-red-500/30"
                                  : questionDetails[question._id]?.correctAnswer === oIndex
                                    ? "bg-blue-600/30 dark:bg-blue-600/20 border border-blue-500/40 dark:border-blue-500/30"
                                    : "bg-white/30 dark:bg-black/20 border border-white/40 dark:border-gray-700/30"
                                }`}
                            >
                              <div className="flex-shrink-0">
                                {question.selectedAnswer === oIndex ? (
                                  <svg
                                    className={`w-6 h-6 ${question.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    {question.isCorrect ? (
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    ) : (
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    )}
                                  </svg>
                                ) : questionDetails[question._id]?.correctAnswer === oIndex ? (
                                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                ) : (
                                  <div className="w-6 h-6"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="text-base text-gray-900 dark:text-gray-300">
                                  {String.fromCharCode(65 + oIndex)}. {option?.text || "Option not available"}
                                </p>
                                {option?.media?.length > 0 && (
                                  <div className="mt-2 flex flex-wrap gap-2">
                                    {option.media.map((media, i) => (
                                      <MediaDisplay
                                        key={i}
                                        media={media}
                                        label={`Option ${String.fromCharCode(65 + oIndex)} Media ${i + 1}`}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-200 mb-2">Explanation</h4>
                          {(() => {
                            const explanation = questionDetails[question._id]?.explanation || "";
                            if (!explanation) return <p className="text-base text-gray-900 dark:text-gray-300">No explanation available</p>;
                            const segments = explanation.split(".").map((s) => s.trim()).filter((s) => s);
                            return segments.length <= 1 ? (
                              <p className="text-base text-gray-900 dark:text-gray-300">{explanation}</p>
                            ) : (
                              <ul className="list-disc pl-5 space-y-2 text-gray-900 dark:text-gray-300 text-base">
                                {segments.map((segment, i) => (
                                  <li key={i}>{segment}.</li>
                                ))}
                              </ul>
                            );
                          })()}
                          {questionDetails[question._id]?.explanationMedia?.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {questionDetails[question._id].explanationMedia.map((media, i) => (
                                <MediaDisplay key={i} media={media} label={`Explanation Media ${i + 1}`} />
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 mt-4">
                          <span>Category: {question.category || "N/A"}</span>
                          <span className="mx-2">•</span>
                          <span>Subject: {question.subjects?.join(",") || "N/A"}</span>
                          <span className="mx-2">•</span>
                          <span>Topic: {question.topics?.join(",") || "N/A"}</span>
                          <span className="mx-2">•</span>
                          <span>Difficulty: {question.difficulty || "N/A"}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {pagination.pages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="inline-flex rounded-lg shadow-sm backdrop-blur-sm">
                      <button
                        onClick={() => handlePageChange(pagination.current - 1)}
                        disabled={pagination.current === 1}
                        className={`px-4 py-2 border text-base font-medium rounded-l-lg backdrop-blur-sm border-white/40 dark:border-gray-700/30 ${pagination.current === 1
                          ? "bg-white/20 dark:bg-black/20 text-gray-400 cursor-not-allowed"
                          : "bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20"
                          }`}
                      >
                        Previous
                      </button>
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-5 py-2 border text-base font-medium backdrop-blur-sm border-white/40 dark:border-gray-700/30 ${pagination.current === page
                            ? "bg-blue-600/90 dark:bg-blue-600/80 text-white"
                            : "bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20"
                            }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(pagination.current + 1)}
                        disabled={pagination.current === pagination.pages}
                        className={`px-4 py-2 border text-base font-medium rounded-r-lg backdrop-blur-sm border-white/40 dark:border-gray-700/30 ${pagination.current === pagination.pages
                          ? "bg-white/20 dark:bg-black/20 text-gray-400 cursor-not-allowed"
                          : "bg-white/30 dark:bg-black/10 text-gray-900 dark:text-gray-300 hover:bg-white/40 dark:hover:bg-black/20"
                          }`}
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttemptedQuestionsPage;