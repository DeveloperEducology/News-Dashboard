export const questionsGenerator = {
  // A.1 Skip Counting
  "A.0 Even or Odd": () => {
    const emojis = ["🍎", "🍊", "🍇", "🍓", "🐶", "🐱", "⚽", "🏀", "🚗", "🚀"];
    const count = Math.floor(Math.random() * 10) + 3; // 3 to 12 emojis
    const answer = count % 2 === 0 ? "Even" : "Odd";

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const visualEmojis = Array.from({ length: count }, () => randomEmoji);

    return {
      type: "mcq",
      question: "Is the number of items Even or Odd?",
      answer: answer,
      visuals: visualEmojis,
      options: ["Even", "Odd"],
    };
  },
  "A.1 Skip Counting": () => {
    const skip = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = Math.floor(Math.random() * 5);
    const series = Array.from({ length: 5 }, (_, i) => start + i * skip);
    return {
      question: `What number comes next in this skip-counting sequence by ${skip}?`,
      type: "input",
      visuals: series.slice(0, 4),
      answer: series[4],
    };
  },

  // A.2 Place Value
  "A.2 Place Value": () => {
    const number = Math.floor(100 + Math.random() * 900);
    const digits = number.toString().split("");
    const index = Math.floor(Math.random() * digits.length);
    const place = ["ones", "tens", "hundreds"][digits.length - 1 - index];
    return {
      question: `What digit is in the ${place} place in ${number}?`,
      type: "input",
      answer: parseInt(digits[index]),
    };
  },

  // A.3 Odd or Even
  "A.3 Odd or Even": () => {
    const number = Math.floor(Math.random() * 100);
    return {
      question: `Is ${number} an odd or even number?`,
      type: "mcq",
      options: ["Odd", "Even"],
      answer: number % 2 === 0 ? "Even" : "Odd",
    };
  },

  // A.4 Compare Numbers
  "A.4 Compare Numbers": () => {
    const a = Math.floor(Math.random() * 1000);
    const b = Math.floor(Math.random() * 1000);
    return {
      question: `Which number is greater?`,
      type: "mcq",
      options: [a, b],
      answer: a > b ? a : b,
    };
  },

  // A.5 Number Line Estimation
  "A.5 Number Line Estimation": () => {
    const number = Math.floor(Math.random() * 900) + 100;
    const rounded = Math.round(number / 100) * 100;
    return {
      question: `Estimate the position of ${number} on a number line.`,
      type: "mcq",
      options: [rounded - 100, rounded, rounded + 100],
      answer: rounded,
    };
  },

  // A.6 Rounding Off
  "A.6 Rounding Off": () => {
    const number = Math.floor(100 + Math.random() * 900);
    const roundTo = [10, 100][Math.floor(Math.random() * 2)];
    const rounded = Math.round(number / roundTo) * roundTo;
    return {
      question: `Round ${number} to the nearest ${roundTo}.`,
      type: "input",
      answer: rounded,
    };
  },
  // --- B. Arithmetic Operations ---
  "B.1 Addition": () => {
    const a = Math.floor(Math.random() * 100);
    const b = Math.floor(Math.random() * 100);
    return {
      question: `What is ${a} + ${b}?`,
      type: "input",
      answer: a + b,
    };
  },
  "B.2 Subtraction": () => {
    const a = Math.floor(Math.random() * 100) + 50;
    const b = Math.floor(Math.random() * 50);
    return {
      question: `What is ${a} - ${b}?`,
      type: "input",
      answer: a - b,
    };
  },
  "B.3 Multiplication": () => {
    const a = Math.floor(Math.random() * 12);
    const b = Math.floor(Math.random() * 12);
    return {
      question: `What is ${a} × ${b}?`,
      type: "input",
      answer: a * b,
    };
  },
  "B.4 Division": () => {
    const b = Math.floor(Math.random() * 9) + 2;
    const a = b * Math.floor(Math.random() * 10 + 1);
    return {
      question: `What is ${a} ÷ ${b}?`,
      type: "input",
      answer: a / b,
    };
  },
  "B.5 Word Problems - Operations": () => {
    const apples = Math.floor(Math.random() * 10 + 5);
    const friends = Math.floor(Math.random() * 3 + 2);
    return {
      question: `You have ${apples} apples and ${friends} friends. If you give each friend 1 apple, how many will be left?`,
      type: "input",
      answer: apples - friends,
    };
  },
  "B.6 Estimation in Operations": () => {
    const a = Math.floor(Math.random() * 1000);
    const b = Math.floor(Math.random() * 1000);
    const roundedSum = Math.round(a / 100) * 100 + Math.round(b / 100) * 100;
    return {
      question: `Estimate the sum of ${a} and ${b} by rounding to the nearest hundred.`,
      type: "input",
      answer: roundedSum,
    };
  },

  // --- C. Factors & Multiples ---
  "C.1 Factors": () => {
    const num = Math.floor(Math.random() * 20 + 10);
    return {
      question: `Which of these is a factor of ${num}?`,
      type: "mcq",
      options: [1, 2, 3, 5, 10].filter((x) => num % x === 0),
      answer: num % 5 === 0 ? 5 : 1,
    };
  },
  "C.2 Multiples": () => {
    const base = Math.floor(Math.random() * 10 + 1);
    const multiple = base * Math.floor(Math.random() * 5 + 2);
    return {
      question: `Which of these is a multiple of ${base}?`,
      type: "mcq",
      options: [multiple, multiple + 1, multiple + 2],
      answer: multiple,
    };
  },
  "C.3 Prime and Composite Numbers": () => {
    const num = [7, 11, 13, 17, 19, 21, 22, 25][Math.floor(Math.random() * 8)];
    const isPrime = [7, 11, 13, 17, 19].includes(num);
    return {
      question: `Is ${num} a prime or composite number?`,
      type: "mcq",
      options: ["Prime", "Composite"],
      answer: isPrime ? "Prime" : "Composite",
    };
  },

  // --- D. Fractions ---
  "D.1 What is a Fraction": () => {
    const numerator = Math.floor(Math.random() * 9 + 1);
    const denominator = Math.floor(Math.random() * 9 + 1);
    return {
      question: `Which part is the numerator in the fraction ${numerator}/${denominator}?`,
      type: "mcq",
      options: [numerator, denominator],
      answer: numerator,
    };
  },
  "D.2 Equivalent Fractions": () => {
    const base = Math.floor(Math.random() * 5 + 1);
    const multiplier = Math.floor(Math.random() * 5 + 1);
    return {
      question: `What is an equivalent fraction to ${base}/${base + 1}?`,
      type: "mcq",
      options: [
        `${base * multiplier}/${(base + 1) * multiplier}`,
        `${base}/${base + 2}`,
        `${base + 1}/${base}`,
      ],
      answer: `${base * multiplier}/${(base + 1) * multiplier}`,
    };
  },
  "D.3 Comparing Fractions": () => {
    const a = [1 / 2, 1 / 3, 2 / 5][Math.floor(Math.random() * 3)];
    const b = [3 / 4, 2 / 3, 1 / 6][Math.floor(Math.random() * 3)];
    return {
      question: `Which is greater: ${a} or ${b}?`,
      type: "mcq",
      options: [a, b],
      answer: a > b ? a : b,
    };
  },

  // --- E. Decimals ---
  "E.1 Decimal Place Value": () => {
    const num = (Math.random() * 10).toFixed(2);
    return {
      question: `What digit is in the tenths place in ${num}?`,
      type: "input",
      answer: parseInt(num.split(".")[1][0]),
    };
  },
  "E.2 Comparing Decimals": () => {
    const a = (Math.random() * 10).toFixed(1);
    const b = (Math.random() * 10).toFixed(1);
    return {
      question: `Which is greater: ${a} or ${b}?`,
      type: "mcq",
      options: [a, b],
      answer: parseFloat(a) > parseFloat(b) ? a : b,
    };
  },
  "E.3 Addition of Decimals": () => {
    const a = parseFloat((Math.random() * 10).toFixed(1));
    const b = parseFloat((Math.random() * 10).toFixed(1));
    return {
      question: `What is ${a} + ${b}?`,
      type: "input",
      answer: parseFloat((a + b).toFixed(1)),
    };
  },
};
