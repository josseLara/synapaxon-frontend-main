import { useEffect } from "react";

export const formatExplanation = (text) => {
    if (!text) return "No explanation available";

    if (text.includes('**')) {
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
    } else {
        const data = parseMedicalTextToObject(text);
        const html = [];

        // Título principal
        if (data.title) {
            html.push(`<h2 class="text-lg font-bold mb-2">${data.title}</h2>`);
        }

        const renderItems = (items, level = 0) => {
            const indent = 'pl-' + (6 + level * 2); // Tailwind padding increment
            const ulClass = `list-disc ${indent} my-2`;

            html.push(`<ul class="${ulClass}">`);
            for (const item of items) {
                if (item.title && item.text) {
                    html.push(`<li><strong>${item.title}</strong> ${item.text}</li>`);
                } else if (item.title && item.subitems) {
                    html.push(`<li><strong>${item.title}</strong>`);
                    renderItems(item.subitems, level + 1);
                    html.push(`</li>`);
                } else if (item.text) {
                    html.push(`<li>${item.text}</li>`);
                }
            }
            html.push('</ul>');
        };

        if (Array.isArray(data.items)) {
            renderItems(data.items);
        }

        return html.join('\n');
    }
};

function parseMedicalTextToObject(rawText) {
    const cleanedText = rawText
        .replace(/\r?\n|\t/g, ' ')     // elimina saltos de línea y tabs
        .replace(/\s+/g, ' ')          // colapsa espacios
        .trim();

    const result = {
        title: '',
        items: []
    };

    // Separar la sección principal (ejemplo: "C. Papillary muscle rupture") del resto
    // Detecta "C. " seguido de texto, hasta el inicio de "Primary Diagnosis" o "Key Supporting Evidence" o "Incorrect Answer Explanations"
    const mainSectionMatch = cleanedText.match(/^(C\.[^\n]+?)(Primary Diagnosis:|Key Supporting Evidence:|Incorrect Answer Explanations|$)/);
    if (mainSectionMatch) {
        result.title = mainSectionMatch[1].trim();
    }

    // Extraer subsecciones: Primary Diagnosis, Key Supporting Evidence, Incorrect Answer Explanations
    const sectionsRegex = /(Primary Diagnosis:|Key Supporting Evidence:|Incorrect Answer Explanations)/g;
    const splits = cleanedText.split(sectionsRegex).filter(s => s.trim() !== '');

    // Procesar cada sección según su título
    let currentSection = null;
    for (let i = 0; i < splits.length; i++) {
        const part = splits[i].trim();

        if (part === 'Primary Diagnosis:') {
            currentSection = 'Primary Diagnosis';
            continue;
        }
        if (part === 'Key Supporting Evidence:') {
            currentSection = 'Key Supporting Evidence';
            continue;
        }
        if (part === 'Incorrect Answer Explanations') {
            currentSection = 'Incorrect Answer Explanations';
            continue;
        }

        if (currentSection === 'Primary Diagnosis') {
            result.items.push({
                title: 'Primary Diagnosis',
                text: part.trim()
            });
        } else if (currentSection === 'Key Supporting Evidence') {
            // Parsear subitems en Key Supporting Evidence
            // Dividir por títulos principales (ejemplo: Timeline, Pathophysiology, Clinical Signs...)
            // Asumimos que los títulos están seguidos de ":" o empiezan con mayúscula y no tienen ""
            const keyEvidenceItems = [];
            // Separar por títulos o subitems usando mayúsculas al inicio seguido de ":" o líneas que no comienzan con viñeta
            const subSections = part.split(/(?=\b[A-Z][a-z]+(?: [A-Z][a-z]+)*:)|(?=)/g).map(s => s.trim()).filter(Boolean);

            let currentKEItem = null;
            for (const subSec of subSections) {
                if (/^[A-Z][a-z]+(?: [A-Z][a-z]+)*:/.test(subSec)) {
                    // Es un nuevo título con ":"
                    const [titlePart, ...rest] = subSec.split(':');
                    const content = rest.join(':').trim();

                    currentKEItem = {
                        title: titlePart.trim(),
                        subitems: []
                    };

                    // Si tiene contenido con "" (subitems), parsear bullets
                    if (content.includes('')) {
                        const bullets = content.split('').map(b => b.trim()).filter(Boolean);
                        for (const bullet of bullets) {
                            currentKEItem.subitems.push({ text: bullet });
                        }
                    } else if (content.length > 0) {
                        currentKEItem.text = content;
                    }
                    keyEvidenceItems.push(currentKEItem);
                } else if (subSec.startsWith('')) {
                    // Si es un bullet solitario sin título, añadir a último item
                    if (currentKEItem) {
                        currentKEItem.subitems.push({ text: subSec.replace('', '').trim() });
                    }
                } else {
                    // Texto sin título ni viñeta, posiblemente continuación, anexar al último item
                    if (currentKEItem) {
                        currentKEItem.text = (currentKEItem.text ? currentKEItem.text + ' ' : '') + subSec;
                    }
                }
            }

            result.items.push({
                title: 'Key Supporting Evidence',
                subitems: keyEvidenceItems
            });
        } else if (currentSection === 'Incorrect Answer Explanations') {
            // Aquí parseamos respuestas incorrectas, que empiezan con letras A., B., D., E.
            const incorrects = [];
            // Dividir en cada respuesta por la regex de letra y punto al inicio
            const answers = part.split(/(?=[A-E]\. )/).map(s => s.trim()).filter(Boolean);

            for (const ans of answers) {
                // Primer título: "A. Ventricular free wall rupture"
                const titleMatch = ans.match(/^[A-E]\. [^\n]+/);
                const title = titleMatch ? titleMatch[0] : '';

                // Extraer por bullets (con "") o textos explicativos
                const restText = ans.slice(title.length).trim();

                // Separar por "Why it's incorrect:" y "Classic Presentation:"
                const whyIncorrectMatch = restText.match(/Why it's incorrect:(.*?)(Classic Presentation:|$)/s);
                const whyIncorrect = whyIncorrectMatch ? whyIncorrectMatch[1].trim() : '';

                const classicPresentationMatch = restText.match(/Classic Presentation:(.*)/s);
                const classicPresentationText = classicPresentationMatch ? classicPresentationMatch[1].trim() : '';

                // Parsear classicPresentationText por bullets (pueden no tener "", usar saltos de frase o puntos)
                const classicBullets = classicPresentationText.split(/(?:|\.)\s*/).map(s => s.trim()).filter(Boolean);

                incorrects.push({
                    title,
                    subitems: [
                        {
                            title: "Why it's incorrect:",
                            text: whyIncorrect
                        },
                        {
                            title: "Classic Presentation:",
                            subitems: classicBullets.map(bullet => ({ text: bullet }))
                        }
                    ]
                });
            }

            result.items.push({
                title: 'Incorrect Answer Explanations',
                subitems: incorrects
            });
        }
    }

    return result;
}


export const ExplanationFormatText = ({ explanation }) => {
    const html = formatExplanation(explanation);
    return (
        <div
            className="text-base text-gray-900 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};
