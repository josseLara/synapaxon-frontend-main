import React, { useState, useRef, useEffect } from 'react';
import { SketchPicker } from 'react-color';
import { Plus } from 'lucide-react';

export const ExplanationText = ({ explanation }) => {
  const [highlightColor, setHighlightColor] = useState('#FFFF00');
  const [highlights, setHighlights] = useState(() => {
    const saved = localStorage.getItem('savedHighlights');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectionData, setSelectionData] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [preferredColors, setPreferredColors] = useState(() => {
    const saved = localStorage.getItem('preferredHighlightColors');
    return saved ? JSON.parse(saved) : ['#FFFF00', '#4CAF50', '#F06292', '#64B5F6'];
  });
  const textRef = useRef(null);
  const popoverRef = useRef(null);
  const isInteractingWithPicker = useRef(false);

  useEffect(() => {
    localStorage.setItem('preferredHighlightColors', JSON.stringify(preferredColors));
  }, [preferredColors]);

  useEffect(() => {
    localStorage.setItem('savedHighlights', JSON.stringify(highlights));
  }, [highlights]);

  const addPreferredColor = (color) => {
    setPreferredColors(prev => {
      const newColors = [color, ...prev.slice(0, 3)];
      return newColors;
    });
    setHighlightColor(color);
    setShowColorPicker(false);
  };

  const getContrastColor = (hexcolor) => {
    const r = parseInt(hexcolor.slice(1, 3), 16);
    const g = parseInt(hexcolor.slice(3, 5), 16);
    const b = parseInt(hexcolor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  // Función para formatear el texto con símbolos especiales
  const formatExplanation = (text) => {
    if (!text) return "No explanation available";
    
    let cleanText = text.replace(/\*\*/g, '');
    
    const lines = cleanText.split('\n');
    let result = [];
    let indentLevel = 0;

    for (let line of lines) {
      const trimmed = line.trim();
      
      if (!trimmed) {
        result.push('');
        continue;
      }

      if (/^The correct answer is [A-Z]:/.test(trimmed)) {
        result.push(trimmed);
        continue;
      }

      if (/^\*\s/.test(trimmed)) {
        const content = trimmed.replace(/^\*\s?/, '');
        result.push('▣ ' + content);
        indentLevel = 1;
        continue;
      }

      if (/^\s+\*\s/.test(trimmed)) {
        const content = trimmed.replace(/^\s+\*\s/, '');
        result.push('  '.repeat(indentLevel) + '▢ ' + content);
        continue;
      }

      result.push(trimmed);
      indentLevel = 0;
    }

    return result.join('\n');
  };

  const handleTextSelect = () => {
    if (isInteractingWithPicker.current) return;

    const selection = window.getSelection();
    if (!selection.isCollapsed && textRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const selectedText = selection.toString().trim();

      if (selectedText) {
        setSelectionData({
          text: selectedText,
          position: {
            top: rect.bottom,
            left: rect.left + window.scrollX + rect.width / 2,
          }
        });
      }
    } else if (!isInteractingWithPicker.current) {
      setSelectionData(null);
      setShowColorPicker(false);
    }
  };

  const addHighlight = () => {
    if (!selectionData?.text) return;

    setHighlights(prev => [
      ...prev,
      {
        text: selectionData.text,
        color: highlightColor,
        id: Date.now()
      }
    ]);

    setSelectionData(null);
    window.getSelection().removeAllRanges();
    isInteractingWithPicker.current = false;
  };

  const removeHighlight = (id) => {
    setHighlights(prev => prev.filter(h => h.id !== id));
  };

  const getHighlightedText = () => {
    const formattedText = formatExplanation(explanation);
    if (!formattedText) return null;

    let result = [];
    let lastIndex = 0;

    const sortedHighlights = [...highlights].sort((a, b) => 
      formattedText.indexOf(a.text) - formattedText.indexOf(b.text)
    );

    sortedHighlights.forEach((highlight, i) => {
      const startIndex = formattedText.indexOf(highlight.text, lastIndex);
      if (startIndex === -1) return;

      if (startIndex > lastIndex) {
        result.push(
          <span style={{ whiteSpace: 'pre-wrap' }} key={`before-${i}`}>
            {formattedText.slice(lastIndex, startIndex)}
          </span>
        );
      }

      result.push(
        <span
          key={`highlight-${i}`}
          style={{
            backgroundColor: highlight.color,
            color: getContrastColor(highlight.color),
            padding: '0 2px',
            borderRadius: '3px',
            cursor: 'pointer',
            whiteSpace: 'pre-wrap'
          }}
          onClick={(e) => {
            e.stopPropagation();
            removeHighlight(highlight.id);
          }}
        >
          {highlight.text}
        </span>
      );

      lastIndex = startIndex + highlight.text.length;
    });

    if (lastIndex < formattedText.length) {
      result.push(
        <span key="after">
          {formattedText.slice(lastIndex)}
        </span>
      );
    }

    return result;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        if (!isInteractingWithPicker.current) {
          setSelectionData(null);
          window.getSelection().removeAllRanges();
        }
      }
    };

    document.addEventListener('selectionchange', handleTextSelect);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('selectionchange', handleTextSelect);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative explanation-text-container">
      <div
        ref={textRef}
        className="text-base text-gray-900 dark:text-gray-300 p-4 bg-white dark:bg-gray-800 whitespace-pre-wrap"
        style={{ minHeight: '200px', lineHeight: '1.6' }}
      >
        {getHighlightedText()}
      </div>

      {selectionData && (
        <div
          ref={popoverRef}
          className="fixed z-[1000] bg-white dark:bg-gray-800 shadow-xl rounded-md p-3"
          style={{
            top: `${selectionData.position.top + 5}px`,
            left: `${selectionData.position.left}px`,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {preferredColors.map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-md shadow-sm transition-transform hover:scale-110 ${color === highlightColor ? 'ring-2 ring-blue-500' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => {
                  setHighlightColor(color);
                }}
              />
            ))}
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

          {showColorPicker && (
            <div 
              onMouseEnter={() => isInteractingWithPicker.current = true}
              onMouseLeave={() => isInteractingWithPicker.current = false}
              className="mb-2"
            >
              <SketchPicker
                color={highlightColor}
                onChange={(color) => setHighlightColor(color.hex)}
                onChangeComplete={(color) => {
                  const newColor = color.hex;
                  setHighlightColor(newColor);
                  if (!preferredColors.includes(newColor)) {
                    addPreferredColor(newColor);
                  }
                }}
                width="220px"
              />
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => {
                setSelectionData(null);
                setShowColorPicker(false);
                window.getSelection().removeAllRanges();
              }}
              className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={addHighlight}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Highlight
            </button>
          </div>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-bold mb-3 text-gray-700 dark:text-gray-300">Applied Highlights:</h3>
          <ul className="space-y-2 max-h-40 overflow-y-auto">
            {highlights.map((h) => (
              <li
                key={h.id}
                className="flex items-center group hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition"
              >
                <span
                  className="inline-block w-4 h-4 mr-3 rounded-sm shadow-sm"
                  style={{ backgroundColor: h.color }}
                ></span>
                <span 
                  className="flex-1 truncate text-sm text-gray-800 dark:text-gray-200"
                  // style={{ color: getContrastColor(h.color) }}
                >
                  {h.text}
                </span>
                <button
                  onClick={() => removeHighlight(h.id)}
                  className="ml-2 text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                  title="Remove highlight"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};