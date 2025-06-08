"use client"

import { useState } from "react"
import { Activity, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react"
import { defaultCategories } from "../data/categories"
import { topicsBySubject } from "../data/questionData" // Import topicsBySubject from the form's data

const SubjectItem = ({ index, name, correct = 0, incorrect = 0, total = 0, highlighted = false, topics = [], onTopicClick }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const attempted = correct + incorrect
  const notAttempted = total - attempted
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0
  const incorrectPercentage = total > 0 ? (incorrect / total) * 100 : 0

  return (
    <div
      className={`subject-item bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750 border ${
        highlighted 
          ? 'border-blue-200 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-900/20' 
          : 'border-gray-200 dark:border-gray-700'
      }`}
      title={`${name}\nCorrect: ${correct}\nIncorrect: ${incorrect}\nTotal: ${total}`}
    >
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="subject-name flex items-center text-gray-900 dark:text-gray-100">
          <span className="subject-index text-gray-500 dark:text-gray-400 mr-2 font-medium">{index}.</span>
          <span className="font-medium">{name}</span>
        </div>
        {topics.length > 0 && (
          <div>{isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}</div>
        )}
      </div>
      <div className="progress-bar-container flex h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-3 overflow-hidden">
        <div
          className="progress-bar-right bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 transition-colors"
          style={{ width: `${correctPercentage}%` }}
        ></div>
        <div
          className="progress-bar-wrong bg-gradient-to-r from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 transition-colors"
          style={{ width: `${incorrectPercentage}%` }}
        ></div>
        {notAttempted > 0 && (
          <div
            className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
            style={{ width: `${(notAttempted / total) * 100}%` }}
          ></div>
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
        <span className="flex items-center">
          <CheckCircle className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
          {Math.round(correctPercentage)}% ({correct})
        </span>
        <span className="flex items-center">
          <XCircle className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
          {Math.round(incorrectPercentage)}% ({incorrect})
        </span>
        <span className="text-gray-700 dark:text-gray-300">Total: {total}</span>
      </div>
      {isExpanded && topics.length > 0 && (
        <div className="mt-4 space-y-3">
          {topics.map((topic, idx) => (
            <div key={topic.name} className="ml-4">
              <div
                className="flex items-center text-gray-900 dark:text-gray-100 cursor-pointer"
                onClick={() => onTopicClick?.(topic.name)}
              >
                <span className="text-sm font-medium">{topic.name}</span>
              </div>
              <div className="progress-bar-container flex h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                <div
                  className="progress-bar-right bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 transition-colors"
                  style={{ width: `${topic.correctPercentage}%` }}
                ></div>
                <div
                  className="progress-bar-wrong bg-gradient-to-r from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 transition-colors"
                  style={{ width: `${topic.incorrectPercentage}%` }}
                ></div>
                {topic.notAttempted > 0 && (
                  <div
                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    style={{ width: `${(topic.notAttempted / topic.total) * 100}%` }}
                  ></div>
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                <span className="flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                  {Math.round(topic.correctPercentage)}% ({topic.correct})
                </span>
                <span className="flex items-center">
                  <XCircle className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
                  {Math.round(topic.incorrectPercentage)}% ({topic.incorrect})
                </span>
                <span className="text-gray-700 dark:text-gray-300">Total: {topic.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const ScienceCategories = ({ dataByCategory = {}, title = "Subject Performance Overview" }) => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showOnlyAttempted, setShowOnlyAttempted] = useState(false)

  // Process category data
  const getCategoryData = (category) => {
    const realData = dataByCategory[category] || []
    const defaultSubjects = defaultCategories[category] || []

    // Map real data for quick access
    const realDataMap = realData.reduce((acc, item) => {
      acc[item.subject] = item
      return acc
    }, {})

    // Combine with default values and calculate totals
    let combinedData = defaultSubjects.map((subject) => {
      const realItem = realDataMap[subject] || {}
      const correct = realItem.correctAnswers || 0
      const incorrect = realItem.incorrectAnswers || 0
      const total = correct + incorrect

      // Process topics for this subject
      const topics = (topicsBySubject[subject] || []).map((topic) => {
        const topicQuestions = realItem.questions?.filter((q) => q.topics.includes(topic)) || []
        const topicCorrect = topicQuestions.filter((q) => q.isCorrect).length
        const topicIncorrect = topicQuestions.filter((q) => !q.isCorrect).length
        const topicTotal = topicCorrect + topicIncorrect
        const topicCorrectPercentage = topicTotal > 0 ? (topicCorrect / topicTotal) * 100 : 0
        const topicIncorrectPercentage = topicTotal > 0 ? (topicIncorrect / topicTotal) * 100 : 0
        const topicNotAttempted = topicTotal > 0 ? 0 : (realItem.questions?.length || 0)

        return {
          name: topic,
          correct: topicCorrect,
          incorrect: topicIncorrect,
          total: topicTotal,
          correctPercentage: topicCorrectPercentage,
          incorrectPercentage: topicIncorrectPercentage,
          notAttempted: topicNotAttempted,
        }
      })

      return {
        subject,
        correctAnswers: correct,
        incorrectAnswers: incorrect,
        total,
        hasAttempts: total > 0,
        topics: topics.filter((t) => t.total > 0 || !showOnlyAttempted), // Show topics with attempts or all if not filtering
      }
    })

    // Filter if needed
    if (showOnlyAttempted) {
      combinedData = combinedData.filter((item) => item.hasAttempts)
    }

    // Sort by total attempts (descending)
    return combinedData.sort((a, b) => b.total - a.total)
  }

  // Calculate category-level stats for cards
  const getCategoryStats = (category) => {
    const realData = dataByCategory[category] || []
    const correct = realData.reduce((sum, item) => sum + (item.correctAnswers || 0), 0)
    const incorrect = realData.reduce((sum, item) => sum + (item.incorrectAnswers || 0), 0)
    const total = correct + incorrect
    const correctPercentage = total > 0 ? (correct / total) * 100 : 0
    const incorrectPercentage = total > 0 ? (incorrect / total) * 100 : 0
    const notAttempted = total > 0 ? 0 : realData.length > 0 ? realData[0].questions?.length || 0 : 0

    return {
      correct,
      incorrect,
      total,
      correctPercentage,
      incorrectPercentage,
      notAttempted,
    }
  }

  const categories = Object.keys(defaultCategories)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
          {title}
        </h2>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyAttempted}
            onChange={() => setShowOnlyAttempted(!showOnlyAttempted)}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">Show only attempted</span>
        </label>
      </div>

      {/* Category Cards */}
      {!selectedCategory ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {categories.map((category) => {
            const { correct, incorrect, total, correctPercentage, incorrectPercentage, notAttempted } = getCategoryStats(category)
            return (
              <div
                key={category}
                className="category-card bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700 cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">{category}</h3>
                <div className="progress-bar-container flex h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="progress-bar-right bg-gradient-to-r from-green-400 to-green-600 hover:from-green-300 hover:to-green-500 transition-colors"
                    style={{ width: `${correctPercentage}%` }}
                  ></div>
                  <div
                    className="progress-bar-wrong bg-gradient-to-r from-red-400 to-red-600 hover:from-red-300 hover:to-red-500 transition-colors"
                    style={{ width: `${incorrectPercentage}%` }}
                  ></div>
                  {notAttempted > 0 && (
                    <div
                      className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                      style={{ width: `${(notAttempted / total) * 100}%` }}
                    ></div>
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-2">
                  <span className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                    {Math.round(correctPercentage)}% ({correct})
                  </span>
                  <span className="flex items-center">
                    <XCircle className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
                    {Math.round(incorrectPercentage)}% ({incorrect})
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">Total: {total}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div>
          <button
            className="mb-4 text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            onClick={() => setSelectedCategory(null)}
          >
            <ChevronUp className="h-5 w-5 mr-1" />
            Back to Categories
          </button>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{selectedCategory}</h3>
          <div className="category-section">
            {getCategoryData(selectedCategory).length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No hay asignaturas con intentos en esta categoría
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getCategoryData(selectedCategory).map((subject, idx) => (
                  <SubjectItem
                    key={`${selectedCategory}-${subject.subject}`}
                    index={idx + 1}
                    name={subject.subject}
                    correct={subject.correctAnswers}
                    incorrect={subject.incorrectAnswers}
                    total={subject.correctAnswers + subject.incorrectAnswers}
                    highlighted={subject.hasAttempts}
                    topics={subject.topics}
                    onTopicClick={(topic) => console.log(`Clicked topic: ${topic}`)} // Optional: Add topic click handler
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ScienceCategories