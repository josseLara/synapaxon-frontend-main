import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color";
import { Plus } from "lucide-react";

export const formatExplanation = (text) => {
  if (!text) return "No explanation available";

  if (text.includes("**")) {
    // Convertir **texto** a <strong>
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

    const lines = formatted.split("\n");
    let result = [];
    let inMainList = false;
    let inSubList = false;
    let inLetterList = false;
    let inKeyPointsList = false;

    // Función para poner en negrita el texto que termina con ":"
    const boldColonTitles = (line) => {
      return line.replace(/(^|\s)([^:\n]+:)/g, (match, p1, p2) => {
        return p1 + `<strong>${p2}</strong>`;
      });
    };

    for (let rawLine of lines) {
      let line = rawLine.trim();
      if (!line) continue;

      // Línea "The correct answer is B: ..."
      if (/^The correct answer is [A-Z]:/.test(line)) {
        // Cerrar listas abiertas
        if (inSubList) {
          result.push("</ul></li>");
          inSubList = false;
        }
        if (inMainList) {
          result.push("</ul>");
          inMainList = false;
        }
        if (inLetterList) {
          result.push("</ul>");
          inLetterList = false;
        }
        if (inKeyPointsList) {
          result.push("</ul>");
          inKeyPointsList = false;
        }

        // Poner el párrafo con clase para resaltar en verde
        result.push(`<p class="mb-2 text-green-600 font-semibold">${line}</p>`);
        continue;
      }

      // Sección "Wrong answers", "Incorrect answers" o "Key points"
      if (/^(Wrong answers|Incorrect answers|Key points)/i.test(line)) {
        // Cerrar listas abiertas
        if (inSubList) {
          result.push("</ul></li>");
          inSubList = false;
        }
        if (inMainList) {
          result.push("</ul>");
          inMainList = false;
        }
        if (inLetterList) {
          result.push("</ul>");
          inLetterList = false;
        }
        if (inKeyPointsList) {
          result.push("</ul>");
          inKeyPointsList = false;
        }

        result.push(`<p class="font-bold mt-4">${line}</p>`);

        if (/^(Wrong answers|Incorrect answers)/i.test(line)) {
          result.push('<ul class="list-disc pl-6 my-2">');
          inMainList = true;
        } else if (/^Key points/i.test(line)) {
          result.push('<ul class="list-disc pl-6 my-2">');
          inKeyPointsList = true;
        }
        continue;
      }

      // Listas con asterisco y <strong> A)
      if (/^\*\s*<strong>[A-Z]\)/.test(line)) {
        if (!inMainList) {
          result.push('<ul class="list-disc pl-6 my-2">');
          inMainList = true;
        }
        if (inSubList) {
          result.push("</ul></li>");
          inSubList = false;
        }
        line = line.replace(/^\*\s*/, "");
        result.push(`<li>${line}`);
        result.push('<ul class="list-[square] pl-6 mt-2">');
        inSubList = true;
        continue;
      }

      // Sublista con asterisco simple
      if (/^\*\s+/.test(line)) {
        const content = line.replace(/^\*\s+/, "");
        result.push(`<li>${boldColonTitles(content)}</li>`);
        continue;
      }

      // Listas con letras y puntos (ej: A. Texto)
      if (/^[A-Z]\.\s+/.test(line)) {
        if (!inLetterList) {
          // Cerrar listas abiertas antes
          if (inMainList) {
            result.push("</ul>");
            inMainList = false;
          }
          if (inSubList) {
            result.push("</ul></li>");
            inSubList = false;
          }
          if (inKeyPointsList) {
            result.push("</ul>");
            inKeyPointsList = false;
          }
          result.push('<ul class="list-disc pl-6 my-2">');
          inLetterList = true;
        }
        const letter = line.substring(0, 2);
        const content = line.substring(3);
        result.push(
          `<li><strong>${letter}</strong> ${boldColonTitles(content)}</li>`
        );
        continue;
      }

      // Elementos con guion "-" en Key points
      if (inKeyPointsList && /^-\s+/.test(line)) {
        result.push(`<li>${boldColonTitles(line.substring(2))}</li>`);
        continue;
      }

      // Texto normal, cerrar listas si están abiertas
      if (inSubList) {
        result.push("</ul></li>");
        inSubList = false;
      }
      if (inMainList) {
        result.push("</ul>");
        inMainList = false;
      }
      if (inLetterList) {
        result.push("</ul>");
        inLetterList = false;
      }
      if (inKeyPointsList) {
        result.push("</ul>");
        inKeyPointsList = false;
      }

      result.push(`<p class="mb-2">${boldColonTitles(line)}</p>`);
    }

    // Cerrar cualquier lista abierta al final
    if (inSubList) result.push("</ul></li>");
    if (inMainList) result.push("</ul>");
    if (inLetterList) result.push("</ul>");
    if (inKeyPointsList) result.push("</ul>");

    return result.join("\n");
  } else {
    const data = parseMedicalTextToObject(text);
    const html = [];

    // Título principal
    if (data.title) {
      html.push(`<h2 class="text-lg font-bold mb-2">${data.title}</h2>`);
    }

    const renderItems = (items, level = 0) => {
      const indent = "pl-" + (6 + level * 2); // Tailwind padding increment
      const ulClass = `list-disc ${indent} my-2`;

      html.push(`<div class="${ulClass}">`);
      for (const item of items) {
        if (item.title && item.text) {
          html.push(`<div><strong>${item.title}</strong> ${item.text}</div>`);
        } else if (item.title && item.subitems) {
          html.push(`<div><strong>${item.title}</strong>`);
          renderItems(item.subitems, level + 1);
          html.push(`</div>`);
        } else if (item.text) {
          const formattedText = item.text
            .replace(/&/g, "&amp;") // escape HTML
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\n/g, "<br>"); // convert newlines to <br>
          html.push(`<div class="whitespace-pre-line">${formattedText}</div>`);
        }
      }
      html.push("</div>");
    };

    if (Array.isArray(data.items)) {
      renderItems(data.items);
    }

    return html.join("\n");
  }
};

function parseMedicalTextToObject(rawText) {
  const rawText2 = rawText;
  const cleanedText = rawText
    .replace(/\r?\n|\t/g, " ") // elimina saltos de línea y tabs
    .replace(/\s+/g, " ") // colapsa espacios
    .trim();

  const result = {
    title: "",
    items: [],
  };

  // Separar la sección principal (ejemplo: "C. Papillary muscle rupture") del resto
  // Detecta "C. " seguido de texto, hasta el inicio de "Primary Diagnosis" o "Key Supporting Evidence" o "Incorrect Answer Explanations"
  const mainSectionMatch = cleanedText.match(
    /^(C\.[^\n]+?)(Primary Diagnosis:|Key Supporting Evidence:|Incorrect Answer Explanations|$)/
  );
  if (mainSectionMatch) {
    result.title = mainSectionMatch[1].trim();
  }

  // Extraer subsecciones: Primary Diagnosis, Key Supporting Evidence, Incorrect Answer Explanations
  const sectionsRegex =
    /(Primary Diagnosis:|Key Supporting Evidence:|Incorrect Answer Explanations)/g;
  const splits = cleanedText
    .split(sectionsRegex)
    .filter((s) => s.trim() !== "");

  // Procesar cada sección según su título
  let currentSection = null;
  for (let i = 0; i < splits.length; i++) {
    const part = splits[i].trim();

    if (part === "Primary Diagnosis:") {
      currentSection = "Primary Diagnosis";
      continue;
    }
    if (part === "Key Supporting Evidence:") {
      currentSection = "Key Supporting Evidence";
      continue;
    }
    if (part === "Incorrect Answer Explanations") {
      currentSection = "Incorrect Answer Explanations";
      continue;
    }

    if (currentSection === "Primary Diagnosis") {
      result.items.push({
        title: "Primary Diagnosis",
        text: part.trim(),
      });
    } else if (currentSection === "Key Supporting Evidence") {
      // Parsear subitems en Key Supporting Evidence
      // Dividir por títulos principales (ejemplo: Timeline, Pathophysiology, Clinical Signs...)
      // Asumimos que los títulos están seguidos de ":" o empiezan con mayúscula y no tienen ""
      const keyEvidenceItems = [];
      // Separar por títulos o subitems usando mayúsculas al inicio seguido de ":" o líneas que no comienzan con viñeta
      const subSections = part
        .split(/(?=\b[A-Z][a-z]+(?: [A-Z][a-z]+)*:)|(?=)/g)
        .map((s) => s.trim())
        .filter(Boolean);

      let currentKEItem = null;
      for (const subSec of subSections) {
        if (/^[A-Z][a-z]+(?: [A-Z][a-z]+)*:/.test(subSec)) {
          // Es un nuevo título con ":"
          const [titlePart, ...rest] = subSec.split(":");
          const content = rest.join(":").trim();

          currentKEItem = {
            title: titlePart.trim(),
            subitems: [],
          };

          // Si tiene contenido con "" (subitems), parsear bullets
          if (content.includes("•")) {
            const bullets = content
              .split("•")
              .map((b) => b.trim())
              .filter(Boolean);
            for (const bullet of bullets) {
              currentKEItem.subitems.push({ text: bullet });
            }
          } else if (content.length > 0) {
            currentKEItem.text = content;
          }
          keyEvidenceItems.push(currentKEItem);
        } else if (subSec.startsWith("•")) {
          // Si es un bullet solitario sin título, añadir a último item
          if (currentKEItem) {
            currentKEItem.subitems.push({
              text: subSec.replace("•", "").trim(),
            });
          }
        } else {
          // Texto sin título ni viñeta, posiblemente continuación, anexar al último item
          if (currentKEItem) {
            currentKEItem.text =
              (currentKEItem.text ? currentKEItem.text + " " : "") + subSec;
          }
        }
      }

      result.items.push({
        title: "Key Supporting Evidence",
        subitems: keyEvidenceItems,
      });
    } else if (currentSection === "Incorrect Answer Explanations") {
      // Aquí parseamos respuestas incorrectas, que empiezan con letras A., B., D., E.
      const incorrects = [];
      // Dividir en cada respuesta por la regex de letra y punto al inicio
      const answers = part
        .split(/(?=[A-E]\. )/)
        .map((s) => s.trim())
        .filter(Boolean);

      for (const ans of answers) {
        // Primer título: "A. Ventricular free wall rupture"
        const titleMatch = ans.match(/^[A-E]\. [^\n]+/);
        const title = titleMatch ? titleMatch[0] : "";

        // Extraer por bullets (con "") o textos explicativos
        const restText = ans.slice(title.length).trim();

        // Separar por "Why it's incorrect:" y "Classic Presentation:"
        const whyIncorrectMatch = restText.match(
          /Why it's incorrect:(.*?)(Classic Presentation:|$)/s
        );
        const whyIncorrect = whyIncorrectMatch
          ? whyIncorrectMatch[1].trim()
          : "";

        const classicPresentationMatch = restText.match(
          /Classic Presentation:(.*)/s
        );
        const classicPresentationText = classicPresentationMatch
          ? classicPresentationMatch[1].trim()
          : "";

        // Parsear classicPresentationText por bullets (pueden no tener "", usar saltos de frase o puntos)
        const classicBullets = classicPresentationText
          .split(/(?:•|\.)\s*/)
          .map((s) => s.trim())
          .filter(Boolean);

        incorrects.push({
          title,
          subitems: [
            {
              title: "Why it's incorrect:",
              text: whyIncorrect,
            },
            {
              title: "Classic Presentation:",
              subitems: classicBullets.map((bullet) => ({ text: bullet })),
            },
          ],
        });
      }

      result.items.push({
        title: "Incorrect Answer Explanations",
        subitems: incorrects,
      });
    }
  }
  if ((!result.title || result.title === "") && result.items.length === 0) {
    result.title = "Here is the Explanation";

    result.items.push({
      title: "",
      text: rawText2,
    });
  }
  return result;
}

// Function to extract plain text from HTML
const stripHtml = (html) => {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || "";
};

export const ExplanationFormatText = ({ explanation }) => {
  const [highlightColor, setHighlightColor] = useState("#FFFF00");
  const [highlights, setHighlights] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("savedHighlights") || "[]");
    return saved;
  });
  const [selectionData, setSelectionData] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [preferredColors, setPreferredColors] = useState(() => {
    const saved = JSON.parse(
      localStorage.getItem("preferredHighlightColors") || "[]"
    );
    return saved.length > 0
      ? saved
      : ["#FFFF00", "#4CAF50", "#F06292", "#64B5F6", "#FF9800"];
  });
  const textRef = useRef(null);
  const popoverRef = useRef(null);
  const isInteractingWithPicker = useRef(false);
  const [formattedHtml, setFormattedHtml] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "preferredHighlightColors",
      JSON.stringify(preferredColors)
    );
  }, [preferredColors]);

  useEffect(() => {
    localStorage.setItem("savedHighlights", JSON.stringify(highlights));
  }, [highlights]);

  useEffect(() => {
    const html = formatExplanation(explanation);
    setFormattedHtml(html);
  }, [explanation]);

  const addPreferredColor = (color) => {
    setPreferredColors((prev) => {
      const newColors = [color, ...prev.slice(0, 4)];
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
    return brightness > 128 ? "#000000" : "#FFFFFF";
  };

  const handleTextSelect = () => {
    if (isInteractingWithPicker.current) return;

    const selection = window.getSelection();
    if (
      !selection.isCollapsed &&
      textRef.current?.contains(selection.anchorNode)
    ) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const selectedText = selection.toString().trim();

      if (selectedText) {
        setSelectionData({
          text: selectedText,
          position: {
            top: rect.bottom,
            left: rect.left + window.scrollX + rect.width / 2,
          },
        });
      }
    } else if (!isInteractingWithPicker.current) {
      setSelectionData(null);
      setShowColorPicker(false);
    }
  };

  const addHighlight = () => {
    if (!selectionData?.text) return;

    setHighlights((prev) => [
      ...prev,
      {
        text: selectionData.text,
        color: highlightColor,
        id: Date.now(),
      },
    ]);

    setSelectionData(null);
    window.getSelection().removeAllRanges();
    isInteractingWithPicker.current = false;
  };

  const removeHighlight = (id) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  const getHighlightedHtml = () => {
    let html = formattedHtml;
    const plainText = stripHtml(html);

    // Sort highlights by their position in the text to avoid overlapping issues
    const sortedHighlights = [...highlights].sort(
      (a, b) => plainText.indexOf(a.text) - plainText.indexOf(b.text)
    );

    // Apply highlights to HTML content
    sortedHighlights.forEach((highlight) => {
      const escapedText = highlight.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escapedText})`, "gi");

      html = html.replace(regex, (match) => {
        return `<span style="background-color: ${
          highlight.color
        }; color: ${getContrastColor(
          highlight.color
        )}; padding: 0 2px; border-radius: 3px; cursor: pointer;" data-highlight-id="${
          highlight.id
        }" onclick="removeHighlightById(${highlight.id})">${match}</span>`;
      });
    });

    return html;
  };

  // Make removeHighlight function globally accessible for onclick handlers
  useEffect(() => {
    window.removeHighlightById = removeHighlight;
    return () => {
      delete window.removeHighlightById;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        if (!isInteractingWithPicker.current) {
          setSelectionData(null);
          window.getSelection().removeAllRanges();
        }
      }
    };

    document.addEventListener("selectionchange", handleTextSelect);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("selectionchange", handleTextSelect);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={textRef}
        className="text-base text-gray-900 dark:text-gray-300 p-4 bg-white dark:bg-gray-800"
        style={{ minHeight: "200px", lineHeight: "1.6" }}
        dangerouslySetInnerHTML={{ __html: getHighlightedHtml() }}
      />

      {selectionData && (
        <div
          ref={popoverRef}
          className="fixed z-50 bg-white dark:bg-gray-800 shadow-xl rounded-md p-3"
          style={{
            top: `${selectionData.position.top + 5}px`,
            left: `${selectionData.position.left}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="flex flex-wrap gap-2 mb-2">
            {preferredColors.map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-md shadow-sm transition-transform hover:scale-110 ${
                  color === highlightColor ? "ring-2 ring-blue-500" : ""
                }`}
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
              onMouseEnter={() => (isInteractingWithPicker.current = true)}
              onMouseLeave={() => (isInteractingWithPicker.current = false)}
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
          <h3 className="font-bold mb-3 text-gray-700 dark:text-gray-300">
            Applied Highlights:
          </h3>
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
                <span className="flex-1 truncate text-sm text-gray-800 dark:text-gray-200">
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
