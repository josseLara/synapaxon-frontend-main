const formatExplanation = (text) => {
  if (!text) return "No explanation available";

  // Convertir **texto** a <strong>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  const lines = formatted.split('\n');
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
        result.push('</ul></li>');
        inSubList = false;
      }
      if (inMainList) {
        result.push('</ul>');
        inMainList = false;
      }
      if (inLetterList) {
        result.push('</ul>');
        inLetterList = false;
      }
      if (inKeyPointsList) {
        result.push('</ul>');
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
        result.push('</ul></li>');
        inSubList = false;
      }
      if (inMainList) {
        result.push('</ul>');
        inMainList = false;
      }
      if (inLetterList) {
        result.push('</ul>');
        inLetterList = false;
      }
      if (inKeyPointsList) {
        result.push('</ul>');
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
        result.push('</ul></li>');
        inSubList = false;
      }
      line = line.replace(/^\*\s*/, '');
      result.push(`<li>${line}`);
      result.push('<ul class="list-[square] pl-6 mt-2">');
      inSubList = true;
      continue;
    }

    // Sublista con asterisco simple
    if (/^\*\s+/.test(line)) {
      const content = line.replace(/^\*\s+/, '');
      result.push(`<li>${boldColonTitles(content)}</li>`);
      continue;
    }

    // Listas con letras y puntos (ej: A. Texto)
    if (/^[A-Z]\.\s+/.test(line)) {
      if (!inLetterList) {
        // Cerrar listas abiertas antes
        if (inMainList) {
          result.push('</ul>');
          inMainList = false;
        }
        if (inSubList) {
          result.push('</ul></li>');
          inSubList = false;
        }
        if (inKeyPointsList) {
          result.push('</ul>');
          inKeyPointsList = false;
        }
        result.push('<ul class="list-disc pl-6 my-2">');
        inLetterList = true;
      }
      const letter = line.substr(0, 2);
      const content = line.substr(3);
      result.push(`<li><strong>${letter}</strong> ${boldColonTitles(content)}</li>`);
      continue;
    }

    // Elementos con guion "-" en Key points
    if (inKeyPointsList && /^-\s+/.test(line)) {
      result.push(`<li>${boldColonTitles(line.substr(2))}</li>`);
      continue;
    }

    // Texto normal, cerrar listas si están abiertas
    if (inSubList) {
      result.push('</ul></li>');
      inSubList = false;
    }
    if (inMainList) {
      result.push('</ul>');
      inMainList = false;
    }
    if (inLetterList) {
      result.push('</ul>');
      inLetterList = false;
    }
    if (inKeyPointsList) {
      result.push('</ul>');
      inKeyPointsList = false;
    }

    result.push(`<p class="mb-2">${boldColonTitles(line)}</p>`);
  }

  // Cerrar cualquier lista abierta al final
  if (inSubList) result.push('</ul></li>');
  if (inMainList) result.push('</ul>');
  if (inLetterList) result.push('</ul>');
  if (inKeyPointsList) result.push('</ul>');

  return result.join('\n');
};

export const ExplanationText = ({ explanation }) => {
  const html = formatExplanation(explanation);
  
  return (
    <div 
      className="text-base text-gray-900 dark:text-gray-300"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
