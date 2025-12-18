function formatPostDate(date) {
    const now = new Date();
    const d = new Date(date);

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const diffDays = Math.round((today - target) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Ontem";
    if (diffDays === 2) return "Anteontem";

    // Capitaliza o mês (toLocaleDateString deixa minúsculo em alguns ambientes)
    const formatted = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    // Deixa primeira letra maiúscula
    const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);

    return `Publicado em ${capitalized}`;
}

module.exports = formatPostDate;
