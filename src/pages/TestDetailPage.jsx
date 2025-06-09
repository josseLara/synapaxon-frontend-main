"use client"

import { useEffect, useRef, useState } from "react"
import {
  Activity,
  Microscope,
  TrendingUp,
  BarChart,
  CheckCircle,
  XCircle,
  Database,
  FileText,
  AlertCircle,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Label,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { AnimatedDiv } from "../components/ui/animatediv"
import { DataTable } from "../components/ui/datatable"
import { TooltipProvider } from "../components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import PerformanceOverviewCard from "../components/PerformanceOverviewCard"
import FilterSection from "../components/FilterSection"
import QuestionList from "../components/QuestionList"
import { useNavigate, useParams } from "react-router-dom"
import ScienceCategories from "../components/progressCard"

const OverallPerformanceView = () => {
  const statsRef = useRef(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [activeFilter, setActiveFilter] = useState("all")
  const { testId } = useParams()
  const navigate = useNavigate()
  const [subjectPerformanceBarData, getSubjectPerformanceBarData] = useState([])

  // API Data States
  const [testDetail, setTestDetail] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analytics, setAnalytics] = useState({})
  const [filter, setFilter] = useState("all")
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    limit: 20,
  })
  const [dataByCategory, setDataByCategory] = useState({})

  // Helper function to safely convert to number and handle NaN
  const safeNumber = (value, defaultValue = 0) => {
    const num = Number(value)
    return isNaN(num) || !isFinite(num) ? defaultValue : num
  }

  useEffect(() => {
    const fetchTestDetail = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Authentication token not found")
        }
        // Fetch test session details
        const sessionResponse = await fetch(
          `${import.meta.env.VITE_API_URL || "https://synapaxon-backend.onrender.com"}/api/tests/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (!sessionResponse.ok) {
          throw new Error(`Failed to fetch test session: ${sessionResponse.statusText}`)
        }

        const sessionData = await sessionResponse.json()
        if (!sessionData.success) {
          throw new Error(sessionData.message || "Test session not found")
        }

        // Fetch paginated questions (filtered)
        let query = `page=${pagination.current}&limit=${pagination.limit}`
        if (filter !== "all") {
          query += `&filter=${filter}`
        }

        const questionsResponse = await fetch(
          `${import.meta.env.VITE_API_URL || "https://synapaxon-backend.onrender.com"}/api/student-questions/history/${testId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        const allquestionsResponse = await fetch(
          `${import.meta.env.VITE_API_URL || "https://synapaxon-backend.onrender.com"}/api/student-questions/history`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        )

        if (!questionsResponse.ok) {
          throw new Error(`Failed to fetch test questions: ${questionsResponse.statusText}`)
        }

        const questionsData = await questionsResponse.json()
        const allquestionsData = await allquestionsResponse.json()
        if (!questionsData.success) {
          throw new Error(questionsData.message || "Failed to fetch test questions")
        }

        const questionsList = questionsData.data || []

        const groupedData = Object.values(
          (allquestionsData.data || []).reduce((acc, q) => {
            const category = q.category || "Uncategorized"
            const subjects = q.subjects?.length > 0 ? q.subjects : ["Unknown"]

            subjects.forEach((subj) => {
              const subjectName = typeof subj === "string" ? subj : subj.name || "Unknown"
              const key = `${category}|||${subjectName}`

              if (!acc[key]) {
                acc[key] = {
                  category,
                  subject: subjectName,
                  questions: [],
                  correctAnswers: 0,
                  incorrectAnswers: 0,
                }
              }

              const isCorrect = !!q.isCorrect
              acc[key].questions.push({ ...q, isCorrect })
              if (isCorrect) acc[key].correctAnswers += 1
              else acc[key].incorrectAnswers += 1
            })

            return acc
          }, {}),
        )
        const dataByCategory = groupedData.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = []
          }
          acc[item.category].push(item)
          return acc
        }, {})
        const subjectPerformanceBarData = groupedData.map((item) => {
          const correct = safeNumber(item.correctAnswers)
          const incorrect = safeNumber(item.incorrectAnswers)
          const total = correct + incorrect
          const correctPercent = total ? (correct / total) * 100 : 0
          const incorrectPercent = total ? (incorrect / total) * 100 : 0
          return {
            subject: item.subject || "Unknown",
            Correct: +correctPercent.toFixed(2),
            Incorrect: +incorrectPercent.toFixed(2),
            Total: total,
          }
        })
        getSubjectPerformanceBarData(subjectPerformanceBarData)
        setTestDetail(sessionData.data)
        setQuestions(questionsList)
        setDataByCategory(dataByCategory)
        setPagination({
          current: questionsData.pagination?.current || 1,
          pages: questionsData.pagination?.pages || 1,
          limit: questionsData.pagination?.limit || 20,
        })

        // Compute analytics from the same paginated data
        if (questionsList.length > 0) {
          const categoryStats = questionsList.reduce((acc, q) => {
            const category = q.category || "Unknown"
            if (!acc[category]) {
              acc[category] = { correct: 0, total: 0, incorrect: 0 }
            }
            acc[category].total += 1
            if (q.isCorrect) acc[category].correct += 1
            else acc[category].incorrect += 1
            return acc
          }, {})

          const subjectStats = questionsList.reduce((acc, q) => {
            const subject = q.question?.subject || "Unknown"
            if (!acc[subject]) {
              acc[subject] = { correct: 0, total: 0, incorrect: 0 }
            }
            acc[subject].total += 1
            if (q.isCorrect) acc[subject].correct += 1
            else acc[subject].incorrect += 1
            return acc
          }, {})

          const questionStats = {
            correct: questionsList.filter((q) => q.isCorrect).length,
            incorrect: questionsList.filter((q) => !q.isCorrect && q.selectedAnswer !== -1).length,
            flagged: questionsList.filter((q) => q.selectedAnswer === -1).length,
            avgTimePerQuestion: sessionData.data.completedAt
              ? (() => {
                const start = new Date(sessionData.data.startedAt)
                const end = new Date(sessionData.data.completedAt)
                const totalSeconds = (end - start) / 1000
                return sessionData.data.totalQuestions > 0
                  ? Math.round(totalSeconds / sessionData.data.totalQuestions)
                  : 0
              })()
              : "N/A",
          }

          setAnalytics({ categoryStats, subjectStats, questionStats })
        }
      } catch (err) {
        console.error("Error fetching test details:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (testId) {
      fetchTestDetail()
    }
  }, [testId, filter, pagination.current])

  // Transform API data for charts
  const getCorrectVsIncorrectData = () => {
    if (!testDetail || !dataByCategory) return []

    let totalCorrect = 0
    let totalIncorrect = 0

    Object.values(dataByCategory).forEach((subjects) => {
      subjects.forEach((item) => {
        totalCorrect += safeNumber(item.correctAnswers)
        totalIncorrect += safeNumber(item.incorrectAnswers)
      })
    })

    // Optionally add flaggedAnswers to incorrect if needed
    totalIncorrect += safeNumber(testDetail.flaggedAnswers)

    return [
      { name: "Correct", value: totalCorrect, color: "#10b981" },
      { name: "Incorrect", value: totalIncorrect, color: "#ef4444" },
    ]
  }

  const getUsedVsUnusedData = () => {
    if (!testDetail) return []

    const totalQuestions = safeNumber(testDetail.totalQuestions - testDetail.flaggedAnswers)

    const unused = Math.max(0, testDetail.flaggedAnswers)

    return [
      { name: "Used", value: totalQuestions, color: "#3b82f6" },
      { name: "Unused", value: unused, color: "#9ca3af" },
    ]
  }

  // Transform analytics data for tables
  const getCategoryTableData = () => {
    if (!analytics.categoryStats) return []
    return Object.entries(analytics.categoryStats).map(([name, stats]) => {
      const correct = safeNumber(stats.correct)
      const incorrect = safeNumber(stats.incorrect)
      const total = safeNumber(stats.total)
      const ratio = total > 0 ? Math.round((correct / total) * 100) : 0

      return {
        name,
        correct,
        incorrect,
        ratio: safeNumber(ratio),
      }
    })
  }

  const getSubjectTableData = () => {
    if (!analytics.subjectStats) return []
    return Object.entries(analytics.subjectStats).map(([name, stats]) => {
      const correct = safeNumber(stats.correct)
      const incorrect = safeNumber(stats.incorrect)
      const total = safeNumber(stats.total)
      const ratio = total > 0 ? Math.round((correct / total) * 100) : 0

      return {
        name,
        correct,
        incorrect,
        ratio: safeNumber(ratio),
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const correctVsIncorrectData = getCorrectVsIncorrectData()
  const usedVsUnusedData = getUsedVsUnusedData()

  // Safe calculation for pie chart percentages
  const getPercentage = (value1, value2) => {
    const total = safeNumber(value1) + safeNumber(value2)
    if (total === 0) return 0
    return Math.round((safeNumber(value1) / total) * 100)
  }

  return (
    <>
      <TooltipProvider>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4">
            <TabsList className="mt-2">
              <TabsTrigger value="overview" className="flex items-center dark:text-blue-600">
                <Activity className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="overall-overview" className="flex items-center dark:text-blue-600">
                <BarChart className="mr-2 h-4 w-4" />
                Overall Overview
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="border-none">
            <PerformanceOverviewCard
              totalQuestions={safeNumber(testDetail?.totalQuestions)}
              correctAnswers={safeNumber(testDetail?.correctAnswers)}
              incorrectAnswers={safeNumber(testDetail?.incorrectAnswers)}
              missedAnswers={safeNumber(testDetail?.flaggedAnswers)}
              totalQuestionsInSystem={testDetail?.totalQuestions}
              timeTaken={
                testDetail ? Math.round((new Date(testDetail.completedAt) - new Date(testDetail.startedAt)) / 1000) : 0
              }
            />

            <FilterSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

            <QuestionList
              testPairs={questions.map((item) => ({
                id: item._id,
                term1: item.question.questionText,
                term2: item.options ? item.options[item?.selectedAnswer ?? 0]?.text : "",
                category: item.category,
                activeFilter: activeFilter,
                difficulty: item.question.difficulty || "medium",
                notes: {
                  explanation: item.explanation,
                  image:
                    item.questionMedia && item.questionMedia[0]
                      ? `https://synapaxon-backend.onrender.com${item.questionMedia[0].path}`
                      : null,
                },
              }))}
              pairPerformance={{
                current: questions.map((item) => ({
                  pairId: item._id,
                  isCorrect: item.isCorrect,
                  selectedAnswer: item.selectedAnswer,
                })),
              }}
              activeFilter={activeFilter}
            />
          </TabsContent>

          <TabsContent value="overall-overview" className="border-none">
            <div className="h-full overflow-y-auto">
              <div className="p-6 max-w-7xl mx-auto">
                <AnimatedDiv delay={1} className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col gap-4">
                      <AnimatedDiv
                        delay={1}
                        className=" backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                          Correct vs Incorrect
                        </h3>
                        <div className="h-[280px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={correctVsIncorrectData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {correctVsIncorrectData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label
                                  value={`${getPercentage(
                                    correctVsIncorrectData[0]?.value,
                                    correctVsIncorrectData[1]?.value,
                                  )}%`}
                                  position="center"
                                  className="text-2xl font-bold fill-gray-800 dark:fill-gray-200"
                                />
                              </Pie>
                              <Tooltip
                                content={({ payload }) => {
                                  if (!payload || payload.length === 0) return null;

                                  const total = payload.reduce((sum, item) => sum + (item.value || 0), 0);
                                  const correct = payload.find(item => item.name === 'Correct')?.value || 0;
                                  const incorrect = payload.find(item => item.name === 'Incorrect')?.value || 0;

                                  return (
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Total: {total} Questions
                                      </div>
                                      <div className="flex items-center space-x-2 mb-1">
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          Correct: {correct} ({getPercentage(correct, incorrect)}%)
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          Incorrect: {incorrect} ({100 - getPercentage(correct, incorrect)}%)
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex justify-center space-x-6 mt-[-20px]">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Correct</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Incorrect</span>
                            </div>
                          </div>
                        </div>
                      </AnimatedDiv>

                      <div className="grid grid-cols-2 gap-4">
                        <AnimatedDiv
                          delay={1}
                          className="h-[120px] bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-4 shadow-lg border border-green-200 dark:border-green-700/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
                        >
                          <div className="text-green-500 mb-2">
                            <CheckCircle className="h-7 w-7" />
                          </div>
                          <div className="text-xs text-green-700 dark:text-green-300 font-medium">Correct Answers</div>
                          <div className="text-2xl font-bold mt-1 text-green-800 dark:text-green-200">
                            {safeNumber(correctVsIncorrectData[0]?.value).toLocaleString()}
                          </div>
                        </AnimatedDiv>

                        <AnimatedDiv
                          delay={1}
                          className="h-[120px] bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-4 shadow-lg border border-red-200 dark:border-red-700/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
                        >
                          <div className="text-red-500 mb-2">
                            <XCircle className="h-7 w-7" />
                          </div>
                          <div className="text-xs text-red-700 dark:text-red-300 font-medium">Incorrect Answers</div>
                          <div className="text-2xl font-bold mt-1 text-red-800 dark:text-red-200">
                            {safeNumber(correctVsIncorrectData[1]?.value).toLocaleString()}
                          </div>
                        </AnimatedDiv>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <AnimatedDiv
                        delay={1}
                        className=" backdrop-blur-lg rounded-2xl p-6 shadow-xl border-gray-200/50 hover:shadow-2xl transition-all duration-300"
                      >
                        <h3 className="text-center text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center justify-center">
                          <Database className="h-5 w-5 mr-2 text-blue-500" />
                          Used vs Unused Questions
                        </h3>
                        <div className="h-[280px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={usedVsUnusedData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                paddingAngle={2}
                                dataKey="value"
                              >
                                {usedVsUnusedData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                                <Label
                                  value={`${getPercentage(
                                    testDetail?.totalQuestions - testDetail?.flaggedAnswers,
                                    testDetail?.flaggedAnswers,
                                  )}%`}
                                  position="center"
                                  className="text-2xl font-bold fill-gray-800 dark:fill-gray-200"
                                />
                              </Pie>
                              <Tooltip
                                content={({ payload }) => {
                                  if (!payload || payload.length === 0) return null;

                                  const total = testDetail?.totalQuestions || 0;
                                  const used = payload.find(item => item.name === 'Used')?.value || 0;
                                  const unused = payload.find(item => item.name === 'Unused')?.value || 0;

                                  return (
                                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Total: {total} Questions
                                      </div>
                                      <div className="flex items-center space-x-2 mb-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          Used: {used} ({getPercentage(used, unused)}%)
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          Unused: {unused} ({100 - getPercentage(used, unused)}%)
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="flex justify-center space-x-6 mt-[-20px]">
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Used</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">Unused</span>
                            </div>
                          </div>
                        </div>
                      </AnimatedDiv>

                      <div className="grid grid-cols-3 gap-3">
                        <AnimatedDiv
                          delay={1}
                          className="h-[120px] bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-3 shadow-lg border border-purple-200 dark:border-purple-700/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
                        >
                          <div className="text-purple-500 mb-1">
                            <Database className="h-6 w-6" />
                          </div>
                          <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">Total</div>
                          <div className="text-lg font-bold mt-1 text-purple-800 dark:text-purple-200">
                            {safeNumber(testDetail?.totalQuestions).toLocaleString()}
                          </div>
                        </AnimatedDiv>

                        <AnimatedDiv
                          delay={1}
                          className="h-[120px] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-3 shadow-lg border border-blue-200 dark:border-blue-700/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
                        >
                          <div className="text-blue-500 mb-1">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">Used</div>
                          <div className="text-lg font-bold mt-1 text-blue-800 dark:text-blue-200">
                            {safeNumber(testDetail?.totalQuestions).toLocaleString()}
                          </div>
                        </AnimatedDiv>

                        <AnimatedDiv
                          delay={1}
                          className="h-[120px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20 rounded-2xl p-3 shadow-lg border border-gray-200 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center"
                        >
                          <div className="text-gray-500 mb-1">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 font-medium">Unused</div>
                          <div className="text-lg font-bold mt-1 text-gray-800 dark:text-gray-200">
                            {safeNumber(testDetail?.flaggedAnswers).toLocaleString()}
                          </div>
                        </AnimatedDiv>
                      </div>
                    </div>
                  </div>
                </AnimatedDiv>

                <div className="backdrop-blur-lgspace-y-8">
                  {/* <DataTable dataByCategory={dataByCategory} icon={Microscope} colorScheme="green" /> */}

                  {/* Subject Performance Area Chart */}
                  <AnimatedDiv delay={1} className="mt-8">

                    <ScienceCategories
                      title="Subject Performance Overview"
                      dataByCategory={dataByCategory}
                    />
                  </AnimatedDiv>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </TooltipProvider>

    </>
  )
}

export default OverallPerformanceView
