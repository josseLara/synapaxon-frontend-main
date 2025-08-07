import { MoonIcon, Stethoscope, SunIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigation() {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`)
        navigate(path)
    }

    const toggleDarkMode = () => {
        const newMode = !isDarkMode
        setIsDarkMode(newMode)
        if (newMode) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }


    return (
        < header className="py-4 bg-gradient-to-r from-blue-900 to-blue-800 dark:from-blue-950 dark:to-blue-900 sticky top-0 z-50 transition-all duration-300" >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <a href="/" className="flex items-center space-x-2 gap-2 font-semibold text-xl text-white">
                    <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    Synapaxon
                </a>
                <nav className="hidden md:flex space-x-6">
                    <button
                        onClick={() => scrollToSection("features")}
                        className="text-white hover:text-blue-200 text-sm transition-colors"
                    >
                        Features
                    </button>
                    <button
                        onClick={() => scrollToSection("testimonials")}
                        className="text-white hover:text-blue-200 text-sm transition-colors"
                    >
                        Testimonials
                    </button>
                    <button
                        onClick={() => scrollToSection("pricing")}
                        className="text-white hover:text-blue-200 text-sm transition-colors"
                    >
                        Pricing
                    </button>
                    <button
                        onClick={() => scrollToSection("faq")}
                        className="text-white hover:text-blue-200 text-sm transition-colors"
                    >
                        FAQ
                    </button>
                    <button
                        onClick={() => scrollToSection("contact")}
                        className="text-white hover:text-blue-200 text-sm transition-colors"
                    >
                        Contact
                    </button>
                </nav>
                <div className="flex gap-2 items-center">
                    <Button
                        variant="outline"
                        className="bg-blue-700 text-white border-white hover:bg-blue-600 text-sm transition-all duration-300"
                        onClick={() => handleNavigation("/register")}
                    >
                        Free Access
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-white border-white text-blue-700 hover:bg-blue-600 hover:text-white text-sm transition-all duration-300"
                        onClick={() => handleNavigation("/login")}
                    >
                        Login
                    </Button>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-200"
                    >
                        {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </header >
    );
}

export default Navigation;