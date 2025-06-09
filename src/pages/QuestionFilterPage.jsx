"use client"
import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import axios from "../api/axiosConfig"
import { useNavigate } from "react-router-dom"
import { categories, subjectsByCategory, topicsBySubject } from "../data/questionData"
export default function QuestionFilterPage() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.name || "")
  const [selectedSubjects, setSelectedSubjects] = useState(new Set())
  const [selectedTopics, setSelectedTopics] = useState(new Map())
  const [categoryCounts, setCategoryCounts] = useState({})
  const [subjectCounts, setSubjectCounts] = useState({})
  const [topicCounts, setTopicCounts] = useState({})
  const [difficulty, setDifficulty] = useState("all")
  const [useTimer, setUseTimer] = useState(false)
  const [testDuration, setTestDuration] = useState("90")
  const [numberOfItems, setNumberOfItems] = useState(5)
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [activeSubject, setActiveSubject] = useState(null)
  const [questionStatusFilter, setQuestionStatusFilter] = useState("all")
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const token = localStorage.getItem("token")
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
  useEffect(() => {
    const handleStorageChange = () => {
      setTheme(localStorage.getItem("theme") || "light")
    }
    window.addEventListener("storage", handleStorageChange)
    document.documentElement.classList.toggle("dark", theme === "dark")
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [theme])
  // Reset subjects and topics when top-level filters change
  useEffect(() => {
    setSelectedSubjects(new Set())
    setSelectedTopics(new Map())
    setActiveSubject(null)
  }, [questionStatusFilter, difficulty, selectedCategory])
  // Normalize StudentQuestion subjects to match Question schema
  const normalizeStudentQuestion = (sq) => {
    if (!sq || !sq.question) {
      console.warn("Skipping invalid student question:", sq)
      return null
    }
    return {
      ...sq.question,
      _id: sq.question._id,
      subjects: (sq.subjects || []).map((name) => ({
        name,
        topics: (sq.topics || []).filter((t) => (topicsBySubject[name] || []).includes(t)),
      })),
      isCorrect: sq.isCorrect,
      selectedAnswer: sq.selectedAnswer,
    }
  }
  // Helper function to build query parameters
  const buildQueryParams = () => {
    const params = []
    if (selectedCategory) params.push(`category=${selectedCategory}`)
    if (difficulty !== "all") params.push(`difficulty=${difficulty}`)
    if (selectedSubjects.size > 0) {
      params.push(`subjects=${Array.from(selectedSubjects).join(",")}`)
    }
    if (selectedTopics.size > 0) {
      const topics = Array.from(selectedTopics.values()).flat()
      if (topics.length > 0) params.push(`topics=${topics.join(",")}`)
    }
    return params.length > 0 ? `?${params.join("&")}` : ""
  }

  // Fetch counts for categories, subjects, and topics
  const fetchCounts = async () => {
    setErrorMessage("")
    const categoryCountMap = {}
    const subjectCountMap = {}
    const topicCountMap = {}

    try {
      if (!token) {
        throw new Error("Authentication token missing. Please log in.")
      }

      // Initialize counts for all categories
      categories.forEach((cat) => {
        categoryCountMap[cat.name] = { all: 0, correct: 0, incorrect: 0, unattempted: 0, flagged: 0 }
      })

      // Build API query for history (without difficulty)
      const historyQueryParams = [`category=${selectedCategory}`]
      if (selectedSubjects.size > 0) {
        historyQueryParams.push(`subjects=${Array.from(selectedSubjects).join(",")}`)
      }
      if (selectedTopics.size > 0) {
        const topics = Array.from(selectedTopics.values()).flat()
        if (topics.length > 0) historyQueryParams.push(`topics=${topics.join(",")}`)
      }
      const historyQuery = `/api/student-questions/history?${historyQueryParams.join("&")}`
      const historyRes = await axios.get(historyQuery, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!historyRes.data.success) {
        throw new Error(historyRes.data.message || "Failed to fetch question history")
      }

      const historyQuestions = (historyRes.data.data || []).map(normalizeStudentQuestion).filter(Boolean)

      // Build API query for all questions
      const questionsQuery = `/api/questions?category=${selectedCategory}&createdBy=me${difficulty !== "all" ? `&difficulty=${difficulty}` : ""}${selectedSubjects.size > 0 ? `&subjects=${Array.from(selectedSubjects).join(",")}` : ""}${selectedTopics.size > 0 ? `&topics=${Array.from(selectedTopics.values()).flat().join(",")}` : ""}`
      const allQuestionsRes = await axios.get(questionsQuery, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!allQuestionsRes.data.success) {
        throw new Error(allQuestionsRes.data.message || "Failed to fetch questions")
      }

      const allQuestions = allQuestionsRes.data.data || []

      // Compute status counts
      const correctIds = historyQuestions.filter((q) => q.isCorrect).map((q) => q._id.toString())
      const incorrectIds = historyQuestions
        .filter((q) => !q.isCorrect && q.selectedAnswer !== -1)
        .map((q) => q._id.toString())
      const flaggedIds = historyQuestions.filter((q) => q.selectedAnswer === -1).map((q) => q._id.toString())
      const allIds = allQuestions.map((q) => q._id.toString())
      const unattemptedIds = allIds.filter(
        (id) => !correctIds.includes(id) && !incorrectIds.includes(id) && !flaggedIds.includes(id),
      )

      categoryCountMap[selectedCategory] = {
        all: allQuestions.length,
        correct: correctIds.length,
        incorrect: incorrectIds.length,
        unattempted: unattemptedIds.length,
        flagged: flaggedIds.length,
      }

      // Derive subjects and topics counts
      const subjects = [...new Set(allQuestions.flatMap((q) => q.subjects.map((s) => s.name)))]

      subjects.forEach((subject) => {
        const subjectQuestions = allQuestions.filter((q) => q.subjects.some((s) => s.name === subject))
        const subjectHistory = historyQuestions.filter((q) => q.subjects.some((s) => s.name === subject))
        const subjectCorrectIds = subjectHistory.filter((q) => q.isCorrect).map((q) => q._id.toString())
        const subjectIncorrectIds = subjectHistory
          .filter((q) => !q.isCorrect && q.selectedAnswer !== -1)
          .map((q) => q._id.toString())
        const subjectFlaggedIds = subjectHistory.filter((q) => q.selectedAnswer === -1).map((q) => q._id.toString())
        const subjectAllIds = subjectQuestions.map((q) => q._id.toString())
        const subjectUnattemptedIds = subjectAllIds.filter(
          (id) =>
            !subjectCorrectIds.includes(id) && !subjectIncorrectIds.includes(id) && !subjectFlaggedIds.includes(id),
        )

        subjectCountMap[subject] =
          questionStatusFilter === "all"
            ? subjectQuestions.length
            : questionStatusFilter === "correct"
              ? subjectCorrectIds.length
              : questionStatusFilter === "incorrect"
                ? subjectIncorrectIds.length
                : questionStatusFilter === "unattempted"
                  ? subjectUnattemptedIds.length
                  : subjectFlaggedIds.length

        const topics = [
          ...new Set(subjectQuestions.flatMap((q) => q.subjects.find((s) => s.name === subject)?.topics || [])),
        ]

        topics.forEach((topic) => {
          const topicQuestions = subjectQuestions.filter((q) =>
            q.subjects.some((s) => s.name === subject && s.topics.includes(topic)),
          )
          const topicHistory = subjectHistory.filter((q) =>
            q.subjects.some((s) => s.name === subject && s.topics.includes(topic)),
          )
          const topicCorrectIds = topicHistory.filter((q) => q.isCorrect).map((q) => q._id.toString())
          const topicIncorrectIds = topicHistory
            .filter((q) => !q.isCorrect && q.selectedAnswer !== -1)
            .map((q) => q._id.toString())
          const topicFlaggedIds = topicHistory.filter((q) => q.selectedAnswer === -1).map((q) => q._id.toString())
          const topicAllIds = topicQuestions.map((q) => q._id.toString())
          const topicUnattemptedIds = topicAllIds.filter(
            (id) => !topicCorrectIds.includes(id) && !topicIncorrectIds.includes(id) && !topicFlaggedIds.includes(id),
          )

          topicCountMap[`${subject}||${topic}`] =
            questionStatusFilter === "all"
              ? topicQuestions.length
              : questionStatusFilter === "correct"
                ? topicCorrectIds.length
                : questionStatusFilter === "incorrect"
                  ? topicIncorrectIds.length
                  : questionStatusFilter === "unattempted"
                    ? topicUnattemptedIds.length
                    : topicFlaggedIds.length
        })
      })

      setCategoryCounts(categoryCountMap)
      setSubjectCounts(subjectCountMap)
      setTopicCounts(topicCountMap)
      setTotalQuestions(allQuestions.length)
    } catch (err) {
      console.error("Error fetching counts:", err)
      setErrorMessage(err.message || "Failed to load question counts. Please try again.")
      setCategoryCounts(categoryCountMap)
      setSubjectCounts({})
      setTopicCounts({})
      setTotalQuestions(0)
    }
  }

  // Fetch questions based on top-level filters
  const fetchQuestions = async () => {
    setErrorMessage("")
    try {
      if (!token) {
        throw new Error("Authentication token missing. Please log in.")
      }

      setIsLoading(true)
      let allQuestions = []

      // Build base history query without difficulty
      const baseHistoryQueryParams = [`category=${selectedCategory}`]
      if (selectedSubjects.size > 0) {
        baseHistoryQueryParams.push(`subjects=${Array.from(selectedSubjects).join(",")}`)
      }
      if (selectedTopics.size > 0) {
        const topics = Array.from(selectedTopics.values()).flat()
        if (topics.length > 0) baseHistoryQueryParams.push(`topics=${topics.join(",")}`)
      }
      const baseHistoryQuery = `/api/student-questions/history?${baseHistoryQueryParams.join("&")}`

      if (questionStatusFilter === "correct") {
        const res = await axios.get(`${baseHistoryQuery}&isCorrect=true`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.data.success) {
          throw new Error(res.data.message || "Failed to fetch correct questions")
        }
        allQuestions = res.data.data.map(normalizeStudentQuestion).filter((q) => q !== null)
        setTotalQuestions(res.data.count || allQuestions.length)
      } else if (questionStatusFilter === "incorrect") {
        const res = await axios.get(`${baseHistoryQuery}&isCorrect=false&flagged=false`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.data.success) {
          throw new Error(res.data.message || "Failed to fetch incorrect questions")
        }
        allQuestions = res.data.data.map(normalizeStudentQuestion).filter((q) => q !== null)
        setTotalQuestions(res.data.count || allQuestions.length)
      } else if (questionStatusFilter === "flagged") {
        const res = await axios.get(`${baseHistoryQuery}&flagged=true`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.data.success) {
          throw new Error(res.data.message || "Failed to fetch flagged questions")
        }
        allQuestions = res.data.data.map(normalizeStudentQuestion).filter((q) => q !== null)
        setTotalQuestions(res.data.count || allQuestions.length)
      } else if (questionStatusFilter === "unattempted") {
        const allQuestionsRes = await axios.get(
          `/api/questions?category=${selectedCategory}&createdBy=me${difficulty !== "all" ? `&difficulty=${difficulty}` : ""}${selectedSubjects.size > 0 ? `&subjects=${Array.from(selectedSubjects).join(",")}` : ""}${selectedTopics.size > 0 ? `&topics=${Array.from(selectedTopics.values()).flat().join(",")}` : ""}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (!allQuestionsRes.data.success) {
          throw new Error(allQuestionsRes.data.message || "Failed to fetch all questions")
        }
        const historyRes = await axios.get(baseHistoryQuery, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!historyRes.data.success) {
          throw new Error(historyRes.data.message || "Failed to fetch question history")
        }
        const allAvailableQuestions = allQuestionsRes.data.data || []
        const historyQuestions = historyRes.data.data || []
        const historyIds = historyQuestions.map((q) => q.question._id.toString())
        allQuestions = allAvailableQuestions.filter((q) => !historyIds.includes(q._id.toString()))
        setTotalQuestions(allQuestions.length)
      } else {
        const res = await axios.get(
          `/api/questions?category=${selectedCategory}&createdBy=me${difficulty !== "all" ? `&difficulty=${difficulty}` : ""}${selectedSubjects.size > 0 ? `&subjects=${Array.from(selectedSubjects).join(",")}` : ""}${selectedTopics.size > 0 ? `&topics=${Array.from(selectedTopics.values()).flat().join(",")}` : ""}`,
          { headers: { Authorization: `Bearer ${token}` } },
        )
        if (!res.data.success) {
          throw new Error(res.data.message || "Failed to fetch questions")
        }
        allQuestions = res.data.data || []
        setTotalQuestions(res.data.count || allQuestions.length)
      }

      setQuestions(allQuestions)
    } catch (err) {
      console.error("Error fetching questions:", err)
      setErrorMessage(err.message || "Failed to load questions. Please try again.")
      setQuestions([])
      setTotalQuestions(0)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      fetchCounts()
      fetchQuestions()
    }
  }, [questionStatusFilter, difficulty, selectedCategory,selectedSubjects,selectedTopics])

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) => {
      const newSelection = new Set(prev)
      if (newSelection.has(subject)) {
        newSelection.delete(subject)
        setSelectedTopics((prevTopics) => {
          const newTopics = new Map(prevTopics)
          newTopics.delete(subject)
          return newTopics
        })
      } else {
        newSelection.add(subject)
      }
      setActiveSubject(newSelection.size > 0 ? subject : null)
      return newSelection
    })
  }

  const toggleTopic = (topic, subject) => {
    setSelectedTopics((prev) => {
      const newTopics = new Map(prev)
      const subjectTopics = newTopics.get(subject) || []
      if (subjectTopics.includes(topic)) {
        newTopics.set(
          subject,
          subjectTopics.filter((t) => t !== topic),
        )
      } else {
        newTopics.set(subject, [...subjectTopics, topic])
      }
      if (newTopics.get(subject).length === 0) {
        newTopics.delete(subject)
      }
      return newTopics
    })
  }

  const startTest = async () => {
    if (selectedSubjects.size === 0 || questions.length === 0) {
      setErrorMessage("Select at least one subject with available questions")
      return
    }

    setIsLoading(true)
    setErrorMessage("")
    try {
      if (!token) {
        throw new Error("Authentication token missing. Please log in.")
      }

      const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)
      const maxQuestions = Math.min(numberOfItems, questions.length, 50)
      const selectedQuestions = shuffledQuestions.slice(0, maxQuestions)
      const questionIds = selectedQuestions.map((q) => q._id || q.question._id)

      const payload = {
        questionIds,
        difficulty: difficulty === "all" ? undefined : difficulty,
        count: questionIds.length,
        duration: useTimer ? Number.parseInt(testDuration) : 0,
      }

      const res = await axios.post("/api/tests", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!res.data.success) {
        throw new Error(res.data.message || "Failed to create test session")
      }

      const { _id: testSessionId, questions: returnedQuestions } = res.data.data
      if (!testSessionId || !returnedQuestions || returnedQuestions.length === 0) {
        throw new Error("Invalid test session data: Missing testSessionId or questions")
      }

      const testData = {
        testSessionId,
        questions: returnedQuestions,
        testDuration: useTimer ? Number.parseInt(testDuration) : 0,
        selectedFilters: {
          category: selectedCategory,
          subjects: Array.from(selectedSubjects),
          topics: Array.from(selectedTopics.entries()).reduce(
            (acc, [subject, topics]) => ({ ...acc, [subject]: topics }),
            {},
          ),
          difficulty,
          questionStatus: questionStatusFilter,
        },
      }

      sessionStorage.setItem("testData", JSON.stringify(testData))
      navigate("/dashboard/test-runner", { state: testData })
    } catch (error) {
      console.error("Error starting test:", error)
      setErrorMessage(error.message || "Failed to start test. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* Error Message */}
      {errorMessage && (
        <div className="mx-4 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-xl shadow-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{errorMessage}</p>
              {errorMessage.includes("token") && (
                <button
                  onClick={() => navigate("/login")}
                  className="mt-2 text-sm underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-blue-200/30 dark:border-gray-700/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Question Status Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Question Status</h3>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                {[
                  { value: "all", label: `All`, count: categoryCounts[selectedCategory]?.all || 0, color: "blue" },
                  {
                    value: "correct",
                    label: `Correct`,
                    count: categoryCounts[selectedCategory]?.correct || 0,
                    color: "green",
                  },
                  {
                    value: "incorrect",
                    label: `Incorrect`,
                    count: categoryCounts[selectedCategory]?.incorrect || 0,
                    color: "red",
                  },
                  {
                    value: "unattempted",
                    label: `Unattempted`,
                    count: categoryCounts[selectedCategory]?.unattempted || 0,
                    color: "gray",
                  },
                  {
                    value: "flagged",
                    label: `Flagged`,
                    count: categoryCounts[selectedCategory]?.flagged || 0,
                    color: "yellow",
                  },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() => setQuestionStatusFilter(filter.value)}
                    className={`p-3 text-center font-medium transition-all duration-200 rounded-xl border ${
                      questionStatusFilter === filter.value
                        ? filter.color === "blue"
                          ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                          : filter.color === "green"
                            ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/25"
                            : filter.color === "red"
                              ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/25"
                              : filter.color === "gray"
                                ? "bg-gray-600 text-white border-gray-600 shadow-lg shadow-gray-600/25"
                                : "bg-yellow-600 text-white border-yellow-600 shadow-lg shadow-yellow-600/25"
                        : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                    }`}
                  >
                    <div className="text-sm font-medium">{filter.label}</div>
                    <div className="text-xs opacity-90">Q{filter.count}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Difficulty</h3>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              >
                <option value="all">All difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Selection */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/30 dark:border-gray-700/30 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Select Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setSelectedCategory(cat.name)}
                className={`p-4 text-center font-medium transition-all duration-200 rounded-xl border ${
                  selectedCategory === cat.name
                    ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25 transform scale-105"
                    : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:scale-102"
                }`}
              >
                <div className="text-lg font-semibold">{cat.name}</div>
                <div className="text-sm opacity-90">Q{categoryCounts[cat.name]?.[questionStatusFilter] || 0}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selection */}
        {selectedCategory && (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/30 dark:border-gray-700/30 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">Select Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(subjectsByCategory[selectedCategory] || []).map((subject) => {
                const count = subjectCounts[subject] || 0
                const isSelected = selectedSubjects.has(subject)
                return (
                  <label
                    key={subject}
                    className={`p-4 rounded-xl border select-none flex items-center justify-between cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                        : count === 0
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                          : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      disabled={count === 0}
                      onChange={() => toggleSubject(subject)}
                      className="hidden"
                    />
                    <div>
                      <div className="font-medium">{subject}</div>
                      <div
                        className={`text-sm ${count > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"} font-semibold`}
                      >
                        Q{count}
                      </div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Topic Selection */}
        {selectedSubjects.size > 0 && (
          <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/30 dark:border-gray-700/30 shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">Select Topics (Optional)</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Leave topics unselected to include all topics from the selected subjects.
            </p>

            {/* Subject Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {Array.from(selectedSubjects).map((subject) => (
                <button
                  key={subject}
                  onClick={() => setActiveSubject(subject)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeSubject === subject
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Topics for Active Subject */}
            {activeSubject && (
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{activeSubject}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(topicsBySubject[activeSubject] || []).map((topic) => {
                    const key = `${activeSubject}||${topic}`
                    const count = topicCounts[key] || 0
                    const isSelected = (selectedTopics.get(activeSubject) || []).includes(topic)
                    return (
                      <label
                        key={key}
                        className={`p-3 rounded-lg border select-none flex items-center justify-between cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600 shadow-md"
                            : count === 0
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                              : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          disabled={count === 0}
                          onChange={() => toggleTopic(topic, activeSubject)}
                          className="hidden"
                        />
                        <div>
                          <div className="font-medium text-sm">{topic}</div>
                          <div
                            className={`text-xs ${count > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"} font-semibold`}
                          >
                            Q{count}
                          </div>
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selected Filters Summary */}
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Selected Filters</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(selectedSubjects).map((subject) => (
                  <span
                    key={subject}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                  >
                    {subject}
                    {selectedTopics.get(subject)?.length > 0 ? ` → ${selectedTopics.get(subject).join(", ")}` : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Available Questions Summary */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 shadow-lg mt-8">
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-3">Available Questions</h3>
          <div className="space-y-2">
            <p className="text-green-700 dark:text-green-300 text-lg">
              <span className="font-semibold">{questions.length}</span> questions available with current filters
            </p>
            <p className="text-green-700 dark:text-green-300">
              <span className="font-semibold">{Math.min(numberOfItems, questions.length, 50)}</span> questions
              selected for the test
              {numberOfItems > questions.length && (
                <span className="text-orange-600 dark:text-orange-400 ml-2">
                  (Requested {numberOfItems}, but only {questions.length} available)
                </span>
              )}
              {numberOfItems > 50 && (
                <span className="text-orange-600 dark:text-orange-400 ml-2">(Limited to 50 questions maximum)</span>
              )}
            </p>
          </div>
        </div>

        {/* Test Configuration */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-blue-200/30 dark:border-gray-700/30 shadow-lg mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Test Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Timer Configuration */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setUseTimer(!useTimer)}
                  className={`relative inline-block w-14 h-7 rounded-full transition-all duration-300 ${
                    useTimer ? "bg-blue-600 shadow-lg shadow-blue-600/25" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label="Toggle timer"
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full transition-all duration-300 bg-white shadow-md ${
                      useTimer ? "left-[calc(100%-1.5rem-0.125rem)]" : "left-0.5"
                    }`}
                  ></span>
                </button>
                <label className="text-lg font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
                  Use timer
                </label>
              </div>
              {useTimer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={testDuration}
                    onChange={(e) => setTestDuration(e.target.value || "90")}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="10"
                    max="3600"
                    placeholder="90"
                  />
                </div>
              )}
            </div>

            {/* Number of Questions */}
            <div>
              <label className="block text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                Number of Questions
              </label>
              <input
                type="number"
                value={numberOfItems}
                onChange={(e) => setNumberOfItems(Math.min(Number.parseInt(e.target.value) || 1, 50))}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="50"
              />
              {questions.length > 0 && numberOfItems > questions.length && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                  Maximum available: {questions.length}
                </p>
              )}
              {numberOfItems > 50 && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">Maximum allowed: 50</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft size={20} className="mr-2" />
            Return to Dashboard
          </button>

          <button
            onClick={startTest}
            disabled={isLoading || selectedSubjects.size === 0 || questions.length === 0}
            className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedSubjects.size > 0 && questions.length > 0
                ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30"
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? "Starting..." : `Start Test (${Math.min(numberOfItems, questions.length, 50)} questions)`}
          </button>
        </div>
      </div>
    </div>
  )
}