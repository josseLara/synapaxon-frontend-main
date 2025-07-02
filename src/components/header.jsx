"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, PlayCircle, Clock, Edit, BookOpen, CheckCircle, Menu, X, ChevronDown, Stethoscope, LogOut, Moon, Sun, User } from 'lucide-react'

// Button component provided by user
const Button = ({ children, className = '', variant = 'default', size = 'default', onClick, ...props }) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none';

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-sm',
        lg: 'h-12 px-6'
    };

    return (
        <button
            className={`${baseClasses} ${sizes[size]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default function Header({
    activeComponent,
    handleNavClick,
    toggleDarkMode,
    isDarkMode,
    logout,
    currentUser,
}) {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const localStorageName = typeof window !== "undefined" ? localStorage.getItem("username") : null

    // Check if window is scrolled
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const userMenu = document.getElementById("user-menu")
            if (userMenu && !userMenu.contains(event.target)) {
                setIsUserMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const userName = currentUser?.name || localStorageName || "Usuario"
    const userInitial = userName.charAt(0).toUpperCase()

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? "bg-blue-900/95 dark:bg-blue-950/95 backdrop-blur-md shadow-lg"
                : "bg-blue-900 dark:bg-blue-950"
                }`}
        >
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-white text-xl font-bold tracking-wide">Synapaxon</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-2">
                        <NavButton
                            icon={<Home size={18} />}
                            label="Dashboard"
                            isActive={activeComponent === "welcome"}
                            onClick={() => handleNavClick("welcome", "/dashboard")}
                        />
                        <NavButton
                            icon={<PlayCircle size={18} />}
                            label="Start Test"
                            isActive={activeComponent === "test"}
                            onClick={() => handleNavClick("test", "/dashboard/starttest")}
                        />
                        <NavButton
                            icon={<Clock size={18} />}
                            label="History"
                            isActive={activeComponent === "history"}
                            onClick={() => handleNavClick("history", "/dashboard/history")}
                        />
                        <NavButton
                            icon={<Edit size={18} />}
                            label="Create"
                            isActive={activeComponent === "create"}
                            onClick={() => handleNavClick("create", "/dashboard/create")}
                        />
                        <NavButton
                            icon={<BookOpen size={18} />}
                            label="My Questions"
                            isActive={activeComponent === "my-questions"}
                            onClick={() => handleNavClick("my-questions", "/dashboard/my-questions")}
                        />
                        <NavButton
                            icon={<CheckCircle size={18} />}
                            label="Attempted"
                            isActive={activeComponent === "attempted-questions"}
                            onClick={() => handleNavClick("attempted-questions", "/dashboard/attempted-questions")}
                        />
                        <NavButton
                            icon={<CheckCircle size={18} />}
                            label="Subscription"
                            isActive={activeComponent === "subscription"}
                            onClick={() => handleNavClick("subscription", "/dashboard/subscription")}
                        />
                    </nav>

                    {/* Right side items */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="h-[40px] w-[40px] flex justify-center items-center p-2 rounded-lg bg-blue-800/50 dark:bg-blue-900/50 hover:bg-blue-700 dark:hover:bg-blue-800 text-white transition-colors"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {/* User Menu */}
                        <div className="relative" id="user-menu">
                            <Button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white"
                            >
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
                                    {currentUser?.photoURL ? (
                                        <img
                                            src={currentUser.photoURL || "/placeholder.svg"}
                                            alt={userName}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        userInitial
                                    )}
                                </div>
                                <span className="hidden lg:block text-sm font-medium truncate max-w-[100px]">{userName}</span>
                                <ChevronDown size={16} className="hidden lg:block" />
                            </Button>

                            <AnimatePresence>
                                {isUserMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{userName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {currentUser?.email || "usuario@ejemplo.com"}
                                            </p>
                                        </div>

                                        <div className="py-1 border-t border-gray-200 dark:border-gray-700">
                                            <MenuItem icon={<LogOut size={16} />} label="Log out" onClick={logout} danger />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile menu button */}
                        <Button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 h-9 w-9 bg-blue-700 hover:bg-blue-600 text-white rounded-full"
                        >
                            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden overflow-hidden"
                    >
                        <div className="px-4 py-3 space-y-1 bg-blue-800 dark:bg-blue-900">
                            <MobileNavButton
                                icon={<Home size={18} />}
                                label="Dashboard"
                                isActive={activeComponent === "welcome"}
                                onClick={() => {
                                    handleNavClick("welcome", "/dashboard")
                                    setIsMobileMenuOpen(false)
                                }}
                            />
                            <MobileNavButton
                                icon={<PlayCircle size={18} />}
                                label="Start Test"
                                isActive={activeComponent === "test"}
                                onClick={() => {
                                    handleNavClick("test", "/dashboard/starttest")
                                    setIsMobileMenuOpen(false)
                                }}
                            />
                            <MobileNavButton
                                icon={<Clock size={18} />}
                                label="History"
                                isActive={activeComponent === "history"}
                                onClick={() => {
                                    handleNavClick("history", "/dashboard/history")
                                    setIsMobileMenuOpen(false)
                                }}
                            />
                            <MobileNavButton
                                icon={<Edit size={18} />}
                                label="Create"
                                isActive={activeComponent === "create"}
                                onClick={() => {
                                    handleNavClick("create", "/dashboard/create")
                                    setIsMobileMenuOpen(false)
                                }}
                            />
                            <MobileNavButton
                                icon={<BookOpen size={18} />}
                                label="My Questions"
                                isActive={activeComponent === "my-questions"}
                                onClick={() => {
                                    handleNavClick("my-questions", "/dashboard/my-questions")
                                    setIsMobileMenuOpen(false)
                                }}
                            />
                            <MobileNavButton
                                icon={<CheckCircle size={18} />}
                                label="Attempted"
                                isActive={activeComponent === "attempted-questions"}
                                onClick={() => {
                                    handleNavClick("attempted-questions", "/dashboard/attempted-questions")
                                    setIsMobileMenuOpen(false)
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

// Navigation Button Component
function NavButton({ icon, label, isActive, onClick }) {
    return (
        <Button
            onClick={onClick}
            className={`flex items-center gap-2 ${isActive
                ? "bg-white text-blue-900 dark:bg-blue-100 dark:text-blue-900 font-medium shadow-md"
                : "bg-blue-700 hover:bg-blue-600 text-white"
                }`}
        >
            {icon}
            <span>{label}</span>
        </Button>
    )
}

// Mobile Navigation Button Component
function MobileNavButton({ icon, label, isActive, onClick }) {
    return (
        <Button
            onClick={onClick}
            className={`flex items-center gap-3 w-full justify-start ${isActive
                ? "bg-white text-blue-900 dark:bg-blue-100 dark:text-blue-900 font-medium shadow-md"
                : "bg-blue-700 hover:bg-blue-600 text-white"
                }`}
        >
            {icon}
            <span>{label}</span>
        </Button>
    )
}

// User Menu Item Component
function MenuItem({ icon, label, onClick, danger = false }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${danger ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-200"
                }`}
        >
            {icon}
            {label}
        </button>
    )
}
