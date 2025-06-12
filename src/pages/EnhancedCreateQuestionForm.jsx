"use client"

import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { X, PlusCircle, Upload, ImageIcon, File, CheckCircle, Plus, Trash2, Paperclip, Link, YoutubeIcon } from "lucide-react"
import axios from "../api/axiosConfig"
import { subjectsByCategory, topicsBySubject } from "../data/questionData"

const EnhancedCreateQuestionForm = ({ onQuestionCreated = () => { } }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    questionText: "",
    explanation: "",
    options: ["", ""],
    correctAnswer: null,
    difficulty: "medium",
    category: "Basic Sciences",
    subjects: [],
    questionMedia: [],
    explanationMedia: [],
    optionMedia: Array(2).fill([]),
    sourceUrl: "",
  })

  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingFor, setUploadingFor] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [urlInput, setUrlInput] = useState("")
  const [mediaType, setMediaType] = useState("file")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...formData.options]
    updatedOptions[index] = value
    setFormData({ ...formData, options: updatedOptions })
  }

  const handleCorrectAnswerSelect = (index) => {
    setFormData({ ...formData, correctAnswer: index })
  }

  const handleCategoryChange = (category) => {
    setFormData({
      ...formData,
      category,
      subjects: [],
    })
  }

  const handleSubjectToggle = (subject) => {
    let updatedSubjects
    if (formData.subjects.some((s) => s.name === subject)) {
      updatedSubjects = formData.subjects.filter((s) => s.name !== subject)
    } else {
      updatedSubjects = [...formData.subjects, { name: subject, topics: [] }]
    }
    setFormData({
      ...formData,
      subjects: updatedSubjects,
    })
  }

  const handleTopicToggle = (topic, subjectName) => {
    const updatedSubjects = formData.subjects.map((subject) => {
      if (subject.name === subjectName) {
        const updatedTopics = subject.topics.includes(topic)
          ? subject.topics.filter((t) => t !== topic)
          : [...subject.topics, topic]
        return { ...subject, topics: updatedTopics }
      }
      return subject
    })
    setFormData({
      ...formData,
      subjects: updatedSubjects,
    })
  }

  const handleAddOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
      optionMedia: [...formData.optionMedia, []],
    })
  }

  const handleRemoveOption = (index) => {
    if (formData.options.length <= 2) {
      setErrorMessage("Minimum 2 options required")
      setTimeout(() => setErrorMessage(""), 3000)
      return
    }

    const updatedOptions = [...formData.options]
    updatedOptions.splice(index, 1)

    const updatedOptionMedia = [...formData.optionMedia]
    updatedOptionMedia.splice(index, 1)

    let newCorrectAnswer = formData.correctAnswer
    if (formData.correctAnswer === index) {
      newCorrectAnswer = null
    } else if (formData.correctAnswer > index) {
      newCorrectAnswer = formData.correctAnswer - 1
    }

    setFormData({
      ...formData,
      options: updatedOptions,
      optionMedia: updatedOptionMedia,
      correctAnswer: newCorrectAnswer,
    })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      setUploadedFiles(files)
      setUploadSuccess(false)
      setUploadError("")
    }
  }

  const startMediaUpload = (target) => {
    setUploadingFor(target)
    setUploadedFiles([])
    setUrlInput("")
    setMediaType("file")
    setUploadSuccess(false)
    setUploadError("")
  }

  const validateUrl = (url) => {
    try {
      new URL(url);
      // Verificar si es una URL de YouTube
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return true;
      }
      return true; // También aceptar otras URLs válidas
    } catch {
      return false;
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      setUploadError("Please enter a URL")
      return
    }
    if (!validateUrl(urlInput.trim())) {
      setUploadError("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    const url = urlInput.trim()
    const filename = url.split("/").pop() || `url-${Date.now()}`
    const mediaObject = {
      type: "url",
      path: url,
      filename: filename,
      originalname: filename,
      mimetype: "text/url",
      size: 0,
    }

    if (uploadingFor === "question") {
      setFormData({
        ...formData,
        questionMedia: [...formData.questionMedia, mediaObject],
      })
    } else if (uploadingFor === "explanation") {
      setFormData({
        ...formData,
        explanationMedia: [...formData.explanationMedia, mediaObject],
      })
    } else if (typeof uploadingFor === "number") {
      const updatedOptionMedia = [...formData.optionMedia]
      updatedOptionMedia[uploadingFor] = [...updatedOptionMedia[uploadingFor], mediaObject]
      setFormData({ ...formData, optionMedia: updatedOptionMedia })
    }

    setUploadSuccess(true)
    setUrlInput("")
  }

  const handleUploadMedia = async () => {
    if (!uploadedFiles.length) {
      setUploadError("Please select at least one file to upload")
      return
    }

    if (!uploadedFiles.length) {
      setUploadError("Please select at least one file to upload");
      return;
    }

    // Verificar tamaño de archivos (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    const oversizedFiles = uploadedFiles.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      // Si hay archivos que superan el tamaño máximo, pedir URL de YouTube
      const youtubeUrl = prompt("One or more files exceed 10MB. Please enter the YouTube URL instead:");

      if (youtubeUrl && validateUrl(youtubeUrl)) {
        const filename = `youtube-${Date.now()}`;
        const mediaObject = {
          type: "youtube",
          path: youtubeUrl,
          filename: filename,
          originalname: "YouTube Video",
          mimetype: "video/youtube",
          size: 0,
        };

        if (uploadingFor === "question") {
          setFormData({
            ...formData,
            questionMedia: [...formData.questionMedia, mediaObject],
          });
        } else if (uploadingFor === "explanation") {
          setFormData({
            ...formData,
            explanationMedia: [...formData.explanationMedia, mediaObject],
          });
        } else if (typeof uploadingFor === "number") {
          const updatedOptionMedia = [...formData.optionMedia];
          updatedOptionMedia[uploadingFor] = [...updatedOptionMedia[uploadingFor], mediaObject];
          setFormData({ ...formData, optionMedia: updatedOptionMedia });
        }

        setUploadSuccess(true);
        setUploadedFiles([]);
        return;
      } else if (youtubeUrl && !validateUrl(youtubeUrl)) {
        setUploadError("Por favor ingresa una URL válida de YouTube");
        return;
      } else {
        // Si el usuario cancela, no hacer nada
        return;
      }
    }


    setIsUploading(true)
    setUploadError("")

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        setUploadError("Authentication required. Please log in again.")
        setIsUploading(false)
        return
      }

      const formDataObj = new FormData()
      uploadedFiles.forEach((file) => formDataObj.append("media", file))

      const response = await axios.post("/api/uploads/multiple", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data.success) {
        setUploadSuccess(true)

        const mediaObjects = response.data.data.map((file) => {
          if (!file.filename || !file.originalname || !file.mimetype || !file.size || !file.path) {
            throw new Error("Invalid media object from server")
          }
          let type
          if (file.mimetype.startsWith("image/")) {
            type = "image"
          } else if (file.mimetype.startsWith("video/")) {
            type = "video"
          } else {
            type = "raw"
          }
          return {
            type,
            path: file.path,
            filename: file.filename,
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          }
        })

        if (uploadingFor === "question") {
          setFormData({
            ...formData,
            questionMedia: [...formData.questionMedia, ...mediaObjects],
          })
        } else if (uploadingFor === "explanation") {
          setFormData({
            ...formData,
            explanationMedia: [...formData.explanationMedia, ...mediaObjects],
          })
        } else if (typeof uploadingFor === "number") {
          const updatedOptionMedia = [...formData.optionMedia]
          updatedOptionMedia[uploadingFor] = [...updatedOptionMedia[uploadingFor], ...mediaObjects]
          setFormData({ ...formData, optionMedia: updatedOptionMedia })
        }
      } else {
        setUploadError(response.data.message || "Failed to upload files")
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      setUploadError(error.message || "An error occurred while uploading the files")
    } finally {
      setIsUploading(false)
    }
  }


  const handleRemoveUploadedMedia = async (target, index) => {
    const token = localStorage.getItem("token")
    let media
    if (target === "question") {
      media = formData.questionMedia[index]
    } else if (target === "explanation") {
      media = formData.explanationMedia[index]
    } else if (typeof target === "number") {
      media = formData.optionMedia[target][index]
    }

    if (media && media.type !== "url") {
      try {
        await axios.delete(`/api/uploads/${media.filename}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch (error) {
        console.error("Error deleting media:", error)
        setErrorMessage("Failed to delete media from Cloudinary")
        return
      }
    }

    if (target === "question") {
      const updatedQuestionMedia = [...formData.questionMedia]
      updatedQuestionMedia.splice(index, 1)
      setFormData({ ...formData, questionMedia: updatedQuestionMedia })
    } else if (target === "explanation") {
      const updatedExplanationMedia = [...formData.explanationMedia]
      updatedExplanationMedia.splice(index, 1)
      setFormData({ ...formData, explanationMedia: updatedExplanationMedia })
    } else if (typeof target === "number") {
      const updatedOptionMedia = [...formData.optionMedia]
      updatedOptionMedia[target].splice(index, 1)
      setFormData({ ...formData, optionMedia: updatedOptionMedia })
    }

    if (uploadingFor === target) {
      setUploadedFiles([])
      setUrlInput("")
      setUploadSuccess(false)
      setUploadError("")
    }
  }

  const handleCancelUpload = () => {
    setUploadingFor(null)
    setUploadedFiles([])
    setUrlInput("")
    setMediaType("file")
    setUploadSuccess(false)
    setUploadError("")
  }

  const validateMediaObject = (media) => {
    return (
      media &&
      typeof media === "object" &&
      media.filename &&
      media.originalname &&
      media.mimetype &&
      media.path &&
      media.size !== undefined
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.questionText.trim() === "") {
      setErrorMessage("Question text is required")
      return
    }

    if (formData.options.some((option) => option.trim() === "")) {
      setErrorMessage("All options must be filled")
      return
    }

    if (formData.correctAnswer === null) {
      setErrorMessage("Please select the correct answer")
      return
    }

    if (formData.subjects.length === 0) {
      setErrorMessage("At least one subject is required")
      return
    }

    if (!formData.explanation.trim()) {
      setErrorMessage("Explanation is required")
      return
    }

    if (formData.questionMedia.some((media) => !validateMediaObject(media))) {
      setErrorMessage("All question media objects must include filename, originalname, mimetype, size, and path")
      return
    }
    if (formData.explanationMedia.some((media) => !validateMediaObject(media))) {
      setErrorMessage("All explanation media objects must include filename, originalname, mimetype, size, and path")
      return
    }
    for (let i = 0; i < formData.optionMedia.length; i++) {
      if (formData.optionMedia[i].some((media) => !validateMediaObject(media))) {
        setErrorMessage(
          `All media objects for option ${String.fromCharCode(65 + i)} must include filename, originalname, mimetype, size, and path`,
        )
        return
      }
    }

    try {
      setIsSubmitting(true)
      setErrorMessage("")

      const token = localStorage.getItem("token")

      if (!token) {
        setErrorMessage("Authentication required. Please log in again.")
        return
      }

      const submissionData = {
        questionText: formData.questionText,
        explanation: formData.explanation,
        options: formData.options.map((text, index) => ({
          text,
          media: formData.optionMedia[index],
        })),
        correctAnswer: formData.correctAnswer,
        difficulty: formData.difficulty,
        category: formData.category,
        subjects: formData.subjects,
        questionMedia: formData.questionMedia,
        explanationMedia: formData.explanationMedia,
        sourceUrl: formData.sourceUrl,
      }

      const response = await axios.post("/api/questions", submissionData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setSuccessMessage("Question created successfully!")
        setFormData({
          questionText: "",
          explanation: "",
          options: ["", ""],
          correctAnswer: null,
          difficulty: "medium",
          category: "Basic Sciences",
          subjects: [],
          questionMedia: [],
          explanationMedia: [],
          optionMedia: Array(2).fill([]),
          sourceUrl: "",
        })

        onQuestionCreated(response.data.data)

        setTimeout(() => {
          setSuccessMessage("")
        }, 3000)
      } else {
        setErrorMessage(response.data.message || "Failed to create question")
      }
    } catch (error) {
      console.error("Error creating question:", error)
      setErrorMessage(error.response?.data?.message || "An error occurred while creating the question")
    } finally {
      setIsSubmitting(false)
    }
  }


  const renderMediaButton = (target, media) => {
    const mediaArray = Array.isArray(media) ? media : [media].filter(Boolean);

    return (
      <div className="mt-3">
        {mediaArray.length > 0 && (
          <div className="space-y-2 mb-3">
            {mediaArray.map((mediaItem, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm"
              >
                <div className="flex items-center flex-1 overflow-hidden">
                  {mediaItem.type === "image" ? (
                    <ImageIcon className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  ) : mediaItem.type === "url" ? (
                    <Link className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  ) : mediaItem.type === "youtube" ? (
                    <YoutubeIcon className="w-4 h-4 mr-2 text-red-600 dark:text-red-400" /> // Asegúrate de importar YoutubeIcon
                  ) : (
                    <File className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  )}
                  <span className="truncate text-blue-800 dark:text-blue-200">
                    {mediaItem.type === "youtube" ? "YouTube Video" : mediaItem.originalname}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveUploadedMedia(target, index)}
                  className="ml-2 p-1 text-blue-600 dark:text-blue-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Remove media"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => startMediaUpload(target)}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
        >
          <Paperclip size={14} className="mr-1" />
          Add Media or URL (Optional)
        </button>
      </div>
    );
  };

  const getFileIcon = (file) => {
    if (!file) return null

    const type = file.type.split("/")[0]

    switch (type) {
      case "image":
        return <ImageIcon className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
      case "video":
        return <File className="w-6 h-6 mr-2 text-purple-600 dark:text-purple-400" />
      case "application":
        return <File className="w-6 h-6 mr-2 text-orange-600 dark:text-orange-400" />
      default:
        return <File className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-400" />
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-blue-200/30 dark:border-gray-700/30">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Create New Question</h2>
            <button
              onClick={() => navigate("/dashboard/create/AIQuestionAssistant")}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-200"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Use AI Assistant
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-xl flex items-center shadow-sm">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-xl shadow-sm">
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
                </div>
              </div>
            </div>
          )}

          {/* Upload Modal */}
          {uploadingFor !== null && (
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-white/90 dark:bg-black/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-blue-200/30 dark:border-gray-700/30 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                  Add Media or URL{" "}
                  {uploadingFor === "question"
                    ? "for the Question"
                    : uploadingFor === "explanation"
                      ? "for the Explanation"
                      : `for Option ${String.fromCharCode(65 + uploadingFor)}`}
                </h3>

                {/* Media Type Selection */}
                <div className="mb-6 flex space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="file"
                      checked={mediaType === "file"}
                      onChange={() => setMediaType("file")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">Upload File</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="mediaType"
                      value="url"
                      checked={mediaType === "url"}
                      onChange={() => setMediaType("url")}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">Paste URL</span>
                  </label>
                </div>

                {/* Upload Area */}
                <div className="mb-6">
                  {mediaType === "file" && !uploadedFiles.length ? (
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl cursor-pointer bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-blue-600 dark:text-blue-400" />
                          <p className="mb-2 text-sm text-blue-700 dark:text-blue-300">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">Images, videos, PDFs (MAX 10MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                          accept="image/*,video/*,application/pdf"
                          multiple
                        />
                      </label>
                    </div>
                  ) : mediaType === "file" && uploadedFiles.length > 0 ? (
                    <div className="space-y-3">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
                        >
                          <div className="flex items-center overflow-hidden">
                            {getFileIcon(file)}
                            <div>
                              <span className="block text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-xs">
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                ({Math.round(file.size / 1024)} KB)
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {uploadSuccess && (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                            )}
                            <button
                              type="button"
                              onClick={() => {
                                const updatedFiles = uploadedFiles.filter((_, i) => i !== index)
                                setUploadedFiles(updatedFiles)
                              }}
                              className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full transition-colors"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="Paste URL (e.g., https://example.com/image.jpg)"
                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddUrl}
                        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center"
                      >
                        <Link size={16} className="mr-2" />
                        Add URL
                      </button>
                    </div>
                  )}
                </div>

                {/* Error/Success Messages */}
                {uploadError && (
                  <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {uploadError}
                  </div>
                )}

                {uploadSuccess && (
                  <div className="mb-4 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg flex items-center">
                    <CheckCircle size={16} className="mr-2" />
                    {mediaType === "file" ? "File(s) uploaded successfully!" : "URL added successfully!"}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancelUpload}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>

                  {mediaType === "file" && uploadedFiles.length > 0 && !uploadSuccess && (
                    <button
                      type="button"
                      onClick={handleUploadMedia}
                      disabled={isUploading}
                      className={`px-4 py-2 rounded-xl flex items-center font-medium transition-colors ${isUploading
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                    >
                      <Upload size={16} className="mr-2" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                  )}

                  {uploadSuccess && (
                    <button
                      type="button"
                      onClick={() => setUploadingFor(null)}
                      className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
                    >
                      Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question Text */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100" htmlFor="questionText">
                Question Text*
              </label>
              <textarea
                id="questionText"
                name="questionText"
                value={formData.questionText}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter the question text here..."
                required
              />
              {renderMediaButton("question", formData.questionMedia)}
            </div>

            {/* Options */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Options* (Select the correct answer)
                </label>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
                >
                  <Plus size={16} className="mr-1" />
                  Add Option
                </button>
              </div>
              <div className="space-y-4">
                {formData.options.map((option, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div
                        onClick={() => handleCorrectAnswerSelect(index)}
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer font-bold text-lg transition-all duration-200 ${formData.correctAnswer === index
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/25"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="flex-grow px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Remove option"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {renderMediaButton(index, formData.optionMedia[index])}
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100" htmlFor="explanation">
                Explanation*
              </label>
              <textarea
                id="explanation"
                name="explanation"
                value={formData.explanation}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Explain the correct answer..."
                required
              />
              {renderMediaButton("explanation", formData.explanationMedia)}
            </div>

            {/* Difficulty */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">Difficulty*</label>
              <div className="flex space-x-4">
                {[
                  { value: "easy", label: "Easy", color: "green" },
                  { value: "medium", label: "Medium", color: "yellow" },
                  { value: "hard", label: "Hard", color: "red" },
                ].map((level) => (
                  <label key={level.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="difficulty"
                      value={level.value}
                      checked={formData.difficulty === level.value}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-900 dark:text-gray-100 font-medium">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">Category*</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["Basic Sciences", "Organ Systems", "Clinical Specialties"].map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`py-3 px-4 text-center font-medium rounded-xl border transition-all duration-200 ${formData.category === cat
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/25"
                      : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                Select Subjects* (Click to select/deselect)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {subjectsByCategory[formData.category]?.map((subject) => (
                  <button
                    type="button"
                    key={subject}
                    onClick={() => handleSubjectToggle(subject)}
                    className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-200 ${formData.subjects.some((s) => s.name === subject)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
                      }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Topics */}
            {formData.subjects.length > 0 && (
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Select Topics (Click to select/deselect)
                </label>
                {formData.subjects.map((subject) => (
                  <div key={subject.name} className="space-y-3">
                    <h4 className="text-md font-semibold text-blue-600 dark:text-blue-400">{subject.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {(topicsBySubject[subject.name] || []).map((topic) => (
                        <button
                          type="button"
                          key={topic}
                          onClick={() => handleTopicToggle(topic, subject.name)}
                          className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all duration-200 ${subject.topics.includes(topic)
                            ? "bg-green-600 text-white border-green-600 shadow-md"
                            : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800"
                            }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Source URL */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-gray-900 dark:text-gray-100" htmlFor="sourceUrl">
                Source URL (Optional)
              </label>
              <input
                id="sourceUrl"
                name="sourceUrl"
                type="url"
                value={formData.sourceUrl}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white/70 dark:bg-gray-800/70 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter the source URL (e.g., https://example.com)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
                  }`}
              >
                {isSubmitting ? "Creating..." : "Create Question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EnhancedCreateQuestionForm