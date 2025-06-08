"use client"

import { useState } from "react"
import { Activity, CheckCircle, XCircle } from "lucide-react"
import { defaultCategories } from "../data/categories"

const SubjectItem = ({ index, name, correct = 0, incorrect = 0, total = 0 }) => {
  const attempted = correct + incorrect
  const notAttempted = total - attempted
  const correctPercentage = total > 0 ? (correct / total) * 100 : 0
  const incorrectPercentage = total > 0 ? (incorrect / total) * 100 : 0

  return (
    <div
      className="subject-item bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-750 border border-gray-200 dark:border-gray-700"
      title={`${name}\nCorrect: ${correct}\nIncorrect: ${incorrect}\nTotal: ${total}`}
    >
      <div className="subject-name flex items-center text-gray-900 dark:text-gray-100">
        <span className="subject-index text-gray-500 dark:text-gray-400 mr-2 font-medium">{index}.</span>
        <span className="font-medium">{name}</span>
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
    </div>
  )
}

const ScienceCategories = ({ dataByCategory = {}, title = "Subject Performance Overview" }) => {
  const [activeTab, setActiveTab] = useState(Object.keys(defaultCategories)[0])

  // Combine real data with default values
  const getCategoryData = (category) => {
    const realData = dataByCategory[category] || []
    const defaultSubjects = defaultCategories[category] || []

    // Map real data for quick access
    const realDataMap = realData.reduce((acc, item) => {
      acc[item.subject] = item
      return acc
    }, {})

    // Combine with default values
    return defaultSubjects.map((subject, idx) => {
      if (realDataMap[subject]) {
        return {
          subject,
          correctAnswers: realDataMap[subject].correctAnswers || 0,
          incorrectAnswers: realDataMap[subject].incorrectAnswers || 0,
        }
      }
      return {
        subject,
        correctAnswers: 0,
        incorrectAnswers: 0,
      }
    })
  }

  const categories = Object.keys(defaultCategories)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
        {title}
      </h2>

      {/* Category tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
                activeTab === category
                  ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                  : "text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Active tab content */}
      <div className="category-section">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getCategoryData(activeTab).map((subject, idx) => (
            <SubjectItem
              key={`${activeTab}-${subject.subject}`}
              index={idx + 1}
              name={subject.subject}
              correct={subject.correctAnswers}
              incorrect={subject.incorrectAnswers}
              total={subject.correctAnswers + subject.incorrectAnswers}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScienceCategories
