export function formatTextWithNewlines(text) {
    return text
        // 1. Saltos antes de cada "•" y espacio especial después
        .replace(/•\s*/g, '\n•\t')

    // 2. Saltos antes de cada " o " (solo si está separando ideas, no parte del texto normal)
    .replace(/(?:^|\s)o\s+(?=[A-Z])/g, '\n•\t') // convierte " o Título..." en nueva viñeta (puedes ajustar esto)

    // 3. Saltos antes de "o " (sin viñeta), si no fue capturado antes
    .replace(/([^\n])\so\s(?=[A-Z])/g, '$1\n•\t')

    // 4. Saltos antes y después de cada "" (con dos espacios antes y uno después)
    .replace(/\s*/g, '\n  \t')

    // 5. Limpieza final: recorta espacios múltiples y líneas extra
    .replace(/[ \t]+/g, ' ')
        .replace(/\n{2,}/g, '\n')
        .trim();
}