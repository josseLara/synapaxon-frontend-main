"use client"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { TrendingUp, Award, Check, X, Brain, BookOpen, Clock, Zap, Badge } from "lucide-react"

const PerformanceOverviewCard = ({
  totalQuestions,
  correctAnswers,
  incorrectAnswers,
  missedAnswers,
  totalQuestionsInSystem,
  timeTaken,
}) => {
  // Calculate percentages
  const questionsCompletedPercentage = Math.round((totalQuestions / totalQuestionsInSystem) * 100) || 0
  const questionsRemainingPercentage = 100 - questionsCompletedPercentage
  const correctPercentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  const incorrectPercentage =
    totalQuestions > 0 ? Math.round(((incorrectAnswers + missedAnswers) / totalQuestions) * 100) : 0

  // Prepare data for the pie charts
  const completionData = [
    { name: "Completed", value: questionsCompletedPercentage, color: "#3b82f6" },
    { name: "Remaining", value: questionsRemainingPercentage, color: "#e2e8f0" },
  ]

  const accuracyData = [
    { name: "Correct", value: correctAnswers, color: "#22c55e" },
    { name: "Incorrect", value: incorrectAnswers + missedAnswers, color: "#ef4444" },
  ]

  // Format time taken
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Calculate performance rating
  const getPerformanceRating = () => {
    if (correctPercentage >= 90) return { text: "Exceptional", color: "bg-emerald-500 text-white" }
    if (correctPercentage >= 80) return { text: "Excellent", color: "bg-green-500 text-white" }
    if (correctPercentage >= 70) return { text: "Very Good", color: "bg-blue-500 text-white" }
    if (correctPercentage >= 40) return { text: "Fair", color: "bg-orange-500 text-white" }
    return { text: "Needs Work", color: "bg-red-500 text-white" }
  }

  const performanceRating = getPerformanceRating()

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with performance rating */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center">
            <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
            Performance Overview
          </h3>
          <Badge className={`${performanceRating.color} px-4 py-1.5 text-sm font-medium rounded-full shadow-sm`}>
            {performanceRating.text}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Questions Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-5 shadow-md border-blue-200 dark:border-blue-700/30 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">Total Questions</div>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{totalQuestions}</div>
                <div className="text-xs text-blue-700 dark:text-blue-400 mt-2">
                  {questionsCompletedPercentage}% of library
                </div>
              </div>
              <div className="bg-blue-200 dark:bg-blue-700/50 rounded-full p-2.5 text-blue-600 dark:text-blue-300 shadow-inner">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Remaining Questions Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-2xl p-5 shadow-md border border-indigo-200 dark:border-indigo-700/30 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium mb-2">Remaining</div>
                <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
                  {totalQuestionsInSystem - totalQuestions}
                </div>
                <div className="text-xs text-indigo-700 dark:text-indigo-400 mt-2">
                  {questionsRemainingPercentage}% of library
                </div>
              </div>
              <div className="bg-indigo-200 dark:bg-indigo-700/50 rounded-full p-2.5 text-indigo-600 dark:text-indigo-300 shadow-inner">
                <Brain className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Correct Answers Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-5 shadow-md border border-green-200 dark:border-green-700/30 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">Correct</div>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100">{correctAnswers}</div>
                <div className="text-xs text-green-700 dark:text-green-400 mt-2">{correctPercentage}% accuracy</div>
              </div>
              <div className="bg-green-200 dark:bg-green-700/50 rounded-full p-2.5 text-green-600 dark:text-green-300 shadow-inner">
                <Check className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          {/* Incorrect Answers Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-2xl p-5 shadow-md border border-red-200 dark:border-red-700/30 hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-red-700 dark:text-red-300 font-medium mb-2">Incorrect</div>
                <div className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {incorrectAnswers + missedAnswers}
                </div>
                <div className="text-xs text-red-700 dark:text-red-400 mt-2">{incorrectPercentage}% of attempted</div>
              </div>
              <div className="bg-red-200 dark:bg-red-700/50 rounded-full p-2.5 text-red-600 dark:text-red-300 shadow-inner">
                <X className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Completion Progress Chart */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl  border-gray-200/50 hover:shadow-2xl transition-all"
          >
            <h4 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4 flex items-center">
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full p-1.5 mr-2 shadow-inner">
                <BookOpen className="w-4 h-4" />
              </span>
              Content Completion
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {completionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;

                      const completed = payload.find(item => item.name === 'Completed')?.value || 0;
                      const remaining = payload.find(item => item.name === 'Remaining')?.value || 0;
                      const total = completed + remaining;

                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Progress Overview
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Completed: {completed}% ({Math.round((completed / 100) * total)} items)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Remaining: {remaining}% ({Math.round((remaining / 100) * total)} items)
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/50 py-2 px-3 rounded-xl">
              You've completed {totalQuestions} of {totalQuestionsInSystem} total questions
            </div>
          </motion.div>

          {/* Accuracy Chart */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border-gray-200/50 hover:shadow-2xl transition-all"
          >
            <h4 className="text-lg font-medium text-slate-700 dark:text-slate-300 mb-4 flex items-center">
              <span className="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 rounded-full p-1.5 mr-2 shadow-inner">
                <Check className="w-4 h-4" />
              </span>
              Answer Accuracy
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accuracyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;

                      const correct = payload.find(item => item.name === 'Correct')?.value || 0;
                      const incorrect = payload.find(item => item.name === 'Incorrect')?.value || 0;
                      const total = correct + incorrect;
                      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

                      return (
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Accuracy: {accuracy}%
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Correct: {correct} ({Math.round((correct / total) * 100)}%)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Incorrect: {incorrect} ({Math.round((incorrect / total) * 100)}%)
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Total Attempts: {total}
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    layout="horizontal"
                    iconType="circle"
                    formatter={(value) => (
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-3 bg-slate-50 dark:bg-slate-800/50 py-2 px-3 rounded-xl">
              {correctAnswers} correct, {incorrectAnswers + missedAnswers} incorrect of {totalQuestions} attempted
            </div>
          </motion.div>
        </div>

        {/* Additional performance metrics */}
        <div className="flex flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center px-5 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <span className="bg-amber-200 dark:bg-amber-700/50 text-amber-600 dark:text-amber-300 rounded-full p-1.5 mr-2 shadow-inner">
              <Clock className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Test Time: {formatTime(timeTaken)}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center px-5 py-2.5 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/30 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <span className="bg-purple-200 dark:bg-purple-700/50 text-purple-600 dark:text-purple-300 rounded-full p-1.5 mr-2 shadow-inner">
              <Zap className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
              Avg. {timeTaken > 0 && totalQuestions > 0 ? (timeTaken / totalQuestions).toFixed(1) : 0}s per question
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center px-5 py-2.5 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-700/30 rounded-full shadow-md hover:shadow-lg transition-all"
          >
            <span className="bg-teal-200 dark:bg-teal-700/50 text-teal-600 dark:text-teal-300 rounded-full p-1.5 mr-2 shadow-inner">
              <Award className="h-4 w-4" />
            </span>
            <span className="text-sm font-medium text-teal-800 dark:text-teal-200">Performance score: 0</span>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceOverviewCard
