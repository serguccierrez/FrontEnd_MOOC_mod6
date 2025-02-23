const getById = (id) => document.getElementById(id);
const getAll = (sel) => document.querySelectorAll(sel);

const getIO = () => ({
    text: getById("text").value.normalize(),
    search: getById("search").value.normalize(),
    view: getById("view"),
});

// Limpia el texto dejando solo palabras, números y puntuación correcta.
const clean_string = (text) =>
    text.replace(/[\n\r\t]+/g, " ") 
        .replace(/[^a-zñáéíóú0-9 \.,;:()¿?¡!“”❝❞«»❛❜'‘’\-_]+/gi, "")
        .replace(/[ ]+/g, " ");

const char_array = (text) =>
    clean_string(text)
        .replace(/[^a-zñáéíóú]+/gi, "")
        .split("")
        .filter((w) => w !== "");

const word_array = (text) =>
    clean_string(text)
        .toLowerCase()
        .replace(/[^a-zñáéíóú\s]+/g, "")
        .trim()
        .split(/\s+/);

const sentence_array = (text) =>
    clean_string(text)
        .replace(/([\.:;?!\n]+)/g, "$1+")
        .split("+")
        .filter((w) => w !== "")
        .map((s) => s.replace(/^[ 0-9]+(.*$)/, "$1"));

const repetitions = (ordered_array) =>
    ordered_array.reduce((acc, el, i, a) => {
        if (i === 0) acc.push({ s: el, n: 1 });
        else if (el === a[i - 1]) acc[acc.length - 1].n++;
        else acc.push({ s: el, n: 1 });
        return acc;
    }, []);

const count = () => {
    let { text, view } = getIO();

    let result = `Caracteres: ${char_array(text).length}\n`;
    result += `Palabras: ${word_array(text).length}\n`;
    result += `Frases: ${sentence_array(text).length}\n`;
    result += `Líneas: ${text.split("\n").length}\n`;

    view.innerHTML = result;
};

const letter_index = () => {
    let { text, view } = getIO();

    let ordered_letters = char_array(text)
        .map((el) => el.toLowerCase())
        .sort();

    let result = repetitions(ordered_letters)
        .map((el) => `${el.s}: ${el.n}`)
        .join("\n");

    view.innerHTML = result;
};

const word_index = () => {
    let { text, view } = getIO();

    let ordered_words = word_array(text)
        .map((el) => el.toLowerCase())
        .sort();

    let result = repetitions(ordered_words)
        .map((el) => `${el.s}: ${el.n}`)
        .join("\n");

    view.innerHTML = result;
};

const sentence_index = () => {
    let { text, view } = getIO();

    let ordered_sentences = sentence_array(text)
        .map((el) => el.toLowerCase())
        .sort();

    let result = repetitions(ordered_sentences)
        .map((el) => `${el.s}: ${el.n}`)
        .join("\n");

    view.innerHTML = result;
};

const search_letters = () => {
    let { text, view, search } = getIO();

    let ordered_letters = char_array(text)
        .map((el) => el.toLowerCase())
        .filter((el) => el.includes(search.toLowerCase()))
        .sort();

    let result = `Hay ${ordered_letters.length} ocurrencias de la letra '${search}'.\n\n`;

    result += repetitions(ordered_letters)
        .map((el) => `${el.n} repeticiones de: ${el.s}`)
        .join("\n");

    view.innerHTML = result;
};

const search_words = () => {
    let { text, view, search } = getIO();

    let ordered_words = word_array(text)
        .map((el) => el.toLowerCase())
        .filter((el) => el.includes(search.toLowerCase()))
        .sort();

    let result = `Hay ${ordered_words.length} ocurrencias de la palabra '${search}'.\n\n`;

    result += repetitions(ordered_words)
        .map((el) => `${el.n} repeticiones de: ${el.s}`)
        .join("\n");

    view.innerHTML = result;
};

const search_sentences = () => {
    let { text, view, search } = getIO();

    let searched_sentences = sentence_array(text)
        .filter((el) => el.includes(search))
        .sort();

    let result = `Hay ${searched_sentences.length} frases que contienen '${search}'.\n\n`;

    result += repetitions(searched_sentences)
        .map((el) => `${el.n} repeticiones de: ${el.s}`)
        .join("\n");

    view.innerHTML = result;
};

// EVENT LISTENER
document.addEventListener("click", (ev) => {
    if (ev.target.matches(".count")) count();
    else if (ev.target.matches(".letter_index")) letter_index();
    else if (ev.target.matches(".word_index")) word_index();
    else if (ev.target.matches(".sentence_index")) sentence_index();
    else if (ev.target.matches(".search_letters")) search_letters();
    else if (ev.target.matches(".search_words")) search_words();
    else if (ev.target.matches(".search_sentences")) search_sentences();
});
