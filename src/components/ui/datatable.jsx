"use client"

import { useState } from "react"
import { QuestionModal } from "./questionmodel"
import { Microscope, Heart, Stethoscope, TrendingUp, TrendingDown } from "lucide-react"

// Default categories definition
export const defaultCategories = {
  "Basic Sciences": [
    "Anatomy",
    "Physiology",
    "Pharmacology",
    "Pathology",
    "Biochemistry",
    "Microbiology",
    "Behavioral Health",
    "Blood & Lymphatic",
    "Cardiovascular",
    "Endocrine",
    "Female Reproductive",
    "Gastrointestinal",
    "Male Reproductive",
    "Musculoskeletal",
    "Nervous System",
    "Renal",
    "Respiratory",
    "Skin",
    "Genetics",
    "Metabolism",
    "Cell and Molecular",
    "Nutrition",
    "Laboratory Techniques",
    "Clinical Bacteriology",
    "Virology",
    "Mycology",
    "Parasitology",
    "General/Mixed Topics",
    "Social Sciences",
    "Ethics",
    "Communication",
    "Population Health",
    "Risk Factors & Prognosis",
    "Screening",
    "Risk Factors",
    "Prognosis",
  ],
  "Organ Systems": [
    "Behavioral Health",
    "Blood & Lymphatic",
    "Cardiovascular",
    "Endocrine",
    "Female Reproductive",
    "Gastrointestinal",
    "Male Reproductive",
    "Musculoskeletal",
    "Nervous System",
    "Renal",
    "Respiratory",
    "Skin",
  ],
  "Clinical Specialties": [
    "Behavioral Health",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine",
    "Cardiology",
    "Neurology",
    "Gastroenterology",
    "Endocrinology",
    "Nephrology",
    "Pulmonology",
    "Rheumatology",
    "Hematology/Oncology",
    "Infectious Disease",
    "Skin",
    "Mixed Specialties",
    "OB/GYN",
    "Pediatrics",
    "Surgery",
    "General Surgery",
    "Orthopedic Surgery",
    "Neurosurgery",
    "Cardiovascular Surgery",
    "Thoracic Surgery",
    "Plastic Surgery",
    "Transplant Surgery",
    "Trauma Surgery",
    "Urologic Surgery",
    "Vascular Surgery",
    "Ophthalmology",
    "Otolaryngology",
    "Anesthesiology",
  ],
}

// Category icons and styles
const categoryConfig = {
  "Basic Sciences": {
    icon: Microscope,
    borderColor: "border-blue-200 dark:border-blue-800/30",
    headerBg: "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    headerText: "text-blue-800 dark:text-blue-200",
    iconColor: "text-blue-600 dark:text-blue-400",
    cardBg: "bg-white/80 dark:bg-gray-800/80",
  },
  "Organ Systems": {
    icon: Heart,
    borderColor: "border-emerald-200 dark:border-emerald-800/30",
    headerBg: "bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    headerText: "text-emerald-800 dark:text-emerald-200",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    cardBg: "bg-white/80 dark:bg-gray-800/80",
  },
  "Clinical Specialties": {
    icon: Stethoscope,
    borderColor: "border-purple-200 dark:border-purple-800/30",
    headerBg: "bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    headerText: "text-purple-800 dark:text-purple-200",
    iconColor: "text-purple-600 dark:text-purple-400",
    cardBg: "bg-white/80 dark:bg-gray-800/80",
  },
}

export const DataTable = ({ dataByCategory = {}, icon: Icon }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    category: "",
    type: "",
    count: 0,
    questions: [],
  })

  const safeNumber = (v, d = 0) => {
    const n = Number(v)
    return isNaN(n) || !isFinite(n) ? d : n
  }

  const getPercentage = (c, i) => {
    const total = safeNumber(c) + safeNumber(i)
    return total === 0 ? 0 : Math.round((safeNumber(c) / total) * 100)
  }

  const getRowHoverClass = (correct, incorrect) => {
    const total = correct + incorrect
    if (total === 0) return "hover:bg-gray-50 dark:hover:bg-gray-700/50"

    const percentage = (correct / total) * 100
    if (percentage >= 80) {
      return "hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
    } else if (percentage >= 60) {
      return "hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
    } else {
      return "hover:bg-red-50 dark:hover:bg-red-900/20"
    }
  }

  const getPerformanceIcon = (correct, incorrect) => {
    const total = correct + incorrect
    if (total === 0) return null

    const percentage = (correct / total) * 100
    if (percentage >= 70) {
      return <TrendingUp className="w-4 h-4 text-emerald-500 ml-1" />
    } else {
      return <TrendingDown className="w-4 h-4 text-red-500 ml-1" />
    }
  }

  const handleNumberClick = (category, type, count, questions) => {
    if (count > 0) {
      setModalState({ isOpen: true, category, type, count, questions })
    }
  }

  const closeModal = () =>
    setModalState({
      isOpen: false,
      category: "",
      type: "",
      count: 0,
      questions: [],
    })

  // Combine data with default categories
  const combinedData = Object.keys(defaultCategories).reduce((acc, category) => {
    const defaultSubjects = defaultCategories[category]
    const existingData = dataByCategory[category] || []

    // Map all subjects with their data or default values
    const allSubjects = defaultSubjects.map((subject) => {
      const existingSubject = existingData.find((item) => item.subject === subject)
      return (
        existingSubject || {
          subject,
          questions: [],
          correctAnswers: 0,
          incorrectAnswers: 0,
        }
      )
    })

    return { ...acc, [category]: allSubjects }
  }, {})

  return (
    <>
      {Object.entries(combinedData).map(([category, subjects]) => {
        const config = categoryConfig[category] || categoryConfig["Basic Sciences"]
        const CategoryIcon = config.icon

        return (
          <div
            key={category}
            className={`${config.cardBg} backdrop-blur-lg rounded-2xl shadow-xl border ${config.borderColor} mb-8 overflow-hidden transition-all duration-300 hover:shadow-2xl`}
          >
            {/* Enhanced Header */}
            <div className={`${config.headerBg} px-6 py-4 border-b ${config.borderColor}`}>
              <h3 className={`text-xl font-bold flex items-center ${config.headerText}`}>
                <CategoryIcon className={`mr-3 h-6 w-6 ${config.iconColor}`} />
                {category}
                <span className="ml-auto text-sm font-medium opacity-75">
                  {subjects.reduce((total, item) => total + item.questions.length, 0)} Total Questions
                </span>
              </h3>
            </div>

            {/* Enhanced Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-600">
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Subject</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Questions</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Correct</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">Incorrect</th>
                    <th className="text-center py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                      Success Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((item, idx) => {
                    const totalQ = item.questions.length
                    const percentage = getPercentage(item.correctAnswers, item.incorrectAnswers)
                    const hoverClass = getRowHoverClass(item.correctAnswers, item.incorrectAnswers)
                    const performanceIcon = getPerformanceIcon(item.correctAnswers, item.incorrectAnswers)

                    return (
                      <tr
                        key={idx}
                        className={`border-b border-gray-100 dark:border-gray-700/50 ${hoverClass} transition-all duration-200`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <span
                              className={`font-medium ${
                                totalQ > 0 ? "text-gray-800 dark:text-gray-200" : "text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              {item.subject}
                            </span>
                            {performanceIcon}
                          </div>
                        </td>
                        <td className="text-center py-4 px-4">
                          <span
                            className={`font-semibold px-3 py-1 rounded-full text-sm ${
                              totalQ > 0
                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                            }`}
                          >
                            {totalQ}
                          </span>
                        </td>
                        <td className="text-center py-4 px-4">
                          <button
                            onClick={() =>
                              handleNumberClick(
                                item.subject,
                                "correct",
                                item.correctAnswers,
                                item.questions.filter((q) => q.isCorrect),
                              )
                            }
                            disabled={item.correctAnswers === 0}
                            className={`font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                              item.correctAnswers > 0
                                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-800/40 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-default"
                            }`}
                          >
                            {item.correctAnswers}
                          </button>
                        </td>
                        <td className="text-center py-4 px-4">
                          <button
                            onClick={() =>
                              handleNumberClick(
                                item.subject,
                                "incorrect",
                                item.incorrectAnswers,
                                item.questions.filter((q) => !q.isCorrect),
                              )
                            }
                            disabled={item.incorrectAnswers === 0}
                            className={`font-semibold px-3 py-2 rounded-lg transition-all duration-200 ${
                              item.incorrectAnswers > 0
                                ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800/40 hover:scale-105 cursor-pointer shadow-sm hover:shadow-md"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-default"
                            }`}
                          >
                            {item.incorrectAnswers}
                          </button>
                        </td>
                        <td className="text-center py-4 px-4">
                          <div className="flex items-center justify-center">
                            <span
                              className={`font-bold px-3 py-1 rounded-full text-sm ${
                                totalQ > 0
                                  ? percentage >= 80
                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200"
                                    : percentage >= 60
                                      ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200"
                                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                              }`}
                            >
                              {totalQ > 0 ? `${percentage}%` : "0%"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}

      <QuestionModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        category={modalState.category}
        type={modalState.type}
        count={modalState.count}
        questions={modalState.questions}
      />
    </>
  )
}
