const fs = require('fs');
const { program } = require('commander');

program
  .requiredOption('-i, --input <path>', 'input file')
  .option('-o, --output <path>', 'output file')
  .option('-d, --display', 'display result in console')
  .option('-f, --furnished', 'only furnished houses')
  .option('-p, --price <number>', 'max price filter');

program.parse(process.argv);

const options = program.opts();

// Перевірка input
if (!options.input) {
  console.error('Please, specify input file');
  process.exit(1);
}

// Перевірка існування файлу
if (!fs.existsSync(options.input)) {
  console.error('Cannot find input file');
  process.exit(1);
}

// 📖 Читання JSON
const dataRaw = fs.readFileSync(options.input, 'utf-8');
let data;

try {
  data = JSON.parse(dataRaw);
} catch (e) {
  console.error("Invalid JSON format");
  console.error(e.message);
  process.exit(1);
}

// Очікуємо масив або об'єкт з масивом
if (!Array.isArray(data)) {
  data = data.data || [];
}

//  Фільтрація
let result = data;

// тільки мебльовані
if (options.furnished) {
  result = result.filter(item =>
    String(item.furnishingstatus || '').toLowerCase() === 'furnished'
  );
}

// фільтр ціни
if (options.price) {
  const maxPrice = Number(options.price);
  result = result.filter(item => Number(item.price) < maxPrice);
}

//  Форматування виводу
const output = result.map(item => {
  const price = item.price ?? 'N/A';
  const area = item.area ?? 'N/A';
  return `${price} ${area}`;
}).join('\n');

//  запис у файл
if (options.output) {
  fs.writeFileSync(options.output, output);
}

//  вивід у консоль
if (options.display) {
  console.log(output);
}

// якщо нічого не задано
if (!options.output && !options.display) {
  // нічого не виводимо
}