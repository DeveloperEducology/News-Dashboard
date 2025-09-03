import { number } from "framer-motion";
import { ReactComponent as BearIcon } from "../assets/bear.svg";

export const generateNumberLineQuestion = () => {
  const start = Math.floor(Math.random() * 10) - 5; // -5 to 5
  const end = start + 6; // Always show 7 numbers
  const numbers = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  // Randomly choose between even or odd question
  const questionType = Math.random() > 0.5 ? "even" : "odd";

  const targetNumbers = numbers.filter((n) =>
    questionType === "even" ? n % 2 === 0 : Math.abs(n % 2) === 1
  );

  return {
    type: "number-line",
    question: `Select the ${questionType} numbers on the number line.`,
    answer: targetNumbers,
    questionType, // 'even' or 'odd'
    range: { start, end },
    numbers,
    correctDots: targetNumbers,
    userDots: [],
  };
};

// Helper function for ordinal suffixes
export const getOrdinalSuffix = (num) => {
  if (num >= 11 && num <= 13) return "th";
  switch (num % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

// ✅ helper for random numbers
const generateRandomNumbers = (count, min, max, unique = true) => {
  const numbers = [];
  while (numbers.length < count) {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!unique || !numbers.some((n) => n.value === value)) {
      numbers.push({ id: numbers.length + 1, value });
    }
  }
  return numbers;
};

// Helper for circle segment math
function polarToCartesian(cx, cy, r, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

// Helper function to shuffle array
export const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getPicnicQuestion() {
  const total = getRandomFromArray([60, 80, 100]);
  const girlPercent = getRandomFromArray([20, 25, 30]);
  const targetBoysPercent = getRandomFromArray([60, 65, 70]);

  const girls = Math.floor((girlPercent / 100) * total);
  const boys = total - girls;
  const targetBoys = Math.floor((targetBoysPercent / 100) * total);
  const replace = boys - targetBoys;

  const correctAnswer = replace;
  const options = shuffleArray([
    correctAnswer.toString(),
    (correctAnswer + 4).toString(),
    (correctAnswer - 2 > 0 ? correctAnswer - 2 : correctAnswer + 3).toString(),
    (correctAnswer + 6).toString(),
  ]);

  return {
    type: "mcq",
    question: `A group of ${total} students went on a picnic. ${girlPercent}% of them are girls. How many girls should replace the boys so that boys become ${targetBoysPercent}% of total students?`,
    options,
    answer: correctAnswer.toString(),
    hint: `Calculate current boys and target boys. Difference = girls replacing boys.`,
    explanation: [
      `Total = ${total}, Girls = ${girlPercent}% = ${girls}, Boys = ${boys}, Target Boys = ${targetBoys}, Replace = ${replace}`,
    ],
  };
}

function getFootballTeamQuestion() {
  const total = getRandomFromArray([40, 50, 60]);
  const girls = getRandomFromArray([10, 15, 20]);
  const boys = total - girls;
  const targetGirlsPercent = getRandomFromArray([35, 40, 45]);
  const targetGirls = Math.floor((targetGirlsPercent / 100) * total);
  const girlsToReplace = targetGirls - girls;

  const correctAnswer = girlsToReplace;
  const options = shuffleArray([
    correctAnswer.toString(),
    (correctAnswer + 2).toString(),
    (correctAnswer + 4).toString(),
    (correctAnswer - 2 > 0 ? correctAnswer - 2 : correctAnswer + 3).toString(),
  ]);

  return {
    type: "mcq",
    question: `In a football camp of ${total} students, ${girls} are girls. How many boys should be replaced by girls to make girls ${targetGirlsPercent}% of the total?`,
    options,
    answer: correctAnswer.toString(),
    hint: `Find target number of girls, subtract current girls.`,
    explanation: [
      `Target girls = ${targetGirls}, Current girls = ${girls}, Need = ${girlsToReplace} more girls.`,
    ],
  };
}

function getClassroomQuestion() {
  const total = getRandomFromArray([30, 35, 40]);
  const boys = getRandomFromArray([15, 18, 20]);
  const girls = total - boys;
  const targetBoysPercent = getRandomFromArray([40, 45, 50]);
  const targetBoys = Math.floor((targetBoysPercent / 100) * total);
  const boysToBeRemoved = boys - targetBoys;

  const correctAnswer = boysToBeRemoved;
  const options = shuffleArray([
    correctAnswer.toString(),
    (correctAnswer + 1).toString(),
    (correctAnswer + 3).toString(),
    (correctAnswer - 1 > 0 ? correctAnswer - 1 : correctAnswer + 2).toString(),
  ]);

  return {
    type: "mcq",
    question: `A classroom has ${total} students, out of which ${boys} are boys. How many boys should be replaced by girls to make boys ${targetBoysPercent}% of the total?`,
    options,
    answer: correctAnswer.toString(),
    hint: `Target boys = ${targetBoysPercent}% of total. Subtract current boys.`,
    explanation: [
      `Current boys = ${boys}, Target = ${targetBoys}, Replace = ${boysToBeRemoved}.`,
    ],
  };
}

export const questionsGenerator = {
  "🔢 Number Line": generateNumberLineQuestion,
  "Skip-Counting-picturessss": () => {
    const candies = [
      {
        imageUrl:
          "https://static.vecteezy.com/system/resources/thumbnails/044/242/751/small/colorful-swirl-lollipops-collection-on-a-transparent-background-png.png",
        name: "lollipops",
      },
      {
        imageUrl:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPWTc2HHiloowuXUMqtvFcEmphABRIfA5Cpw&s",
        name: "candies",
      },
      {
        imageUrl: "https://placehold.co/40x40/8b4513/fff?text=Ch",
        name: "chocolates",
      },
      {
        imageUrl: "https://placehold.co/40x40/ff69b4/fff?text=Cu",
        name: "cupcakes",
      },
      {
        imageUrl: "https://placehold.co/40x40/fdd835/000?text=D",
        name: "donuts",
      },
      {
        imageUrl: "https://placehold.co/40x40/e1bee7/000?text=U",
        name: "unicorns",
      },
    ];

    const steps = [2, 3, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const numGroups = Math.floor(Math.random() * 5) + 2; // 2 to 6 groups
    const { imageUrl, name } =
      candies[Math.floor(Math.random() * candies.length)];
    const total = step * numGroups;

    // Each group is an array of images
    const visualGroups = Array.from({ length: numGroups }, () =>
      Array.from({ length: step }, () => imageUrl)
    );

    return {
      type: "input",
      question: `Count by ${step}s: How many ${name} are there in total?`,
      answer: total.toString(),
      visuals: visualGroups, // 2D array of image URLs
      options: [],
    };
  },

  "Skip-image-count": () => {
    // Illustrations with item count per picture
    const items = [
      {
        name: "cinnamon roll",
        plural: "cinnamon rolls",
        img: "https://storage.googleapis.com/a1aa/image/d9c74b00-ea2b-45ab-19b7-5499a2de36d2.jpg",
        perImage: 10, // one plate has 10 rolls
      },
      {
        name: "donut",
        plural: "donuts",
        img: "https://img.freepik.com/premium-vector/chocolate-donuts-with-sprinkles-cartoon-fast-food-icons-signs-plate-vector-illustration_875663-3.jpg",
        perImage: 3, // one plate has 3 donuts
      },
      {
        name: "apple",
        plural: "apples",
        img: "https://img.freepik.com/premium-vector/vector-illustration-apple-basket_593183-263.jpg?semt=ais_hybrid&w=740&q=80",
        perImage: 5, // one basket has 5 apples
      },
      {
        name: "book",
        plural: "books",
        img: "https://static.vecteezy.com/system/resources/previews/009/871/909/non_2x/five-books-lined-up-cartoon-illustration-vector.jpg",
        perImage: 5, // one stack has 5 books
      },
    ];

    // Pick random item type
    const item = items[Math.floor(Math.random() * items.length)];

    // Randomize number of images (2–6)
    const numImages = Math.floor(Math.random() * 5) + 2;

    // Total = numImages × items per picture
    const total = numImages * item.perImage;

    return {
      type: "input",
      exampleText: "Learn with an example",
      prompt: `How many **${item.name}s** are there in total?`,
      question: `Count the ${item.plural} by ${item.perImage}s.`,
      images: Array(numImages).fill(item.img),
      answer: total.toString(),
      hint: `There are ${numImages} pictures. Each has ${item.perImage} ${item.plural}.`,
    };
  },
  "Skip-Counting-pictures": () => {
    const candies = [
      { emoji: "🍭", name: "lollipops" },
      { emoji: "🍬", name: "candies" },
      { emoji: "🍫", name: "chocolates" },
      { emoji: "🧁", name: "cupcakes" },
      { emoji: "🍩", name: "donuts" },
      { emoji: "🎈", name: "balloons" },
      // { image: BearIcon, name: "bears" }, // inline SVG
      // { image: require("../assets/banana.png"), name: "bananas" }, // local PNG
    ];

    const steps = [1, 2, 3, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const numGroups = Math.floor(Math.random() * 5) + 2; // 2..6 groups
    const item = candies[Math.floor(Math.random() * candies.length)];
    const total = step * numGroups;

    // ✅ Each group contains styled children
    const visualGroups = Array.from({ length: numGroups }, (_, gi) => {
      const children = Array.from({ length: step }, (_, j) => {
        if (item.emoji) {
          return (
            <span key={`${gi}-${j}`} className="text-3xl sm:text-4xl">
              {item.emoji}
            </span>
          );
        }
        if (item.image) {
          return typeof item.image === "string" ? (
            <img
              key={`${gi}-${j}`}
              src={item.image}
              alt={item.name}
              className="w-15 h-15 sm:w-18 sm:h-18 object-contain"
            />
          ) : (
            <item.image
              key={`${gi}-${j}`}
              aria-label={item.name}
              className="w-10 h-10 sm:w-14 sm:h-14"
            />
          );
        }
        return null;
      });

      // ✅ put flex + wrapping here, not on each child
      return (
        <div
          key={gi}
          className="p-2 sm:p-3 border-2 border-dashed border-purple-300 
                 rounded-xl flex flex-wrap gap-2 bg-white shadow-sm"
        >
          {children}
        </div>
      );
    });

    const explanation = [
      `Look at each group of ${item.name}.`,
      `Each group has **${step}** ${item.name}.`,
      `We need to find out how many there are in total.`,
      `Instead of counting one by one, we skip-count by ${step}s.`,
      `Say the numbers out loud: ${Array.from(
        { length: numGroups },
        (_, i) => (i + 1) * step
      ).join(", ")}.`,
      `The last number you say is the total number of ${item.name}.`,
    ];

    const example = [
      "Example: There are 3 groups of cupcakes. Each group has 2 cupcakes.",
      "We count by 2s: 2, 4, 6.",
      "So, there are 6 cupcakes in total.",
    ];

    return {
      type: "input1",
      question: `Count by **${step}s**:`,
      prompt: `How many **${item.name}** are there in total?`,
      answer: total.toString(),
      visuals: visualGroups, // ✅ already styled
      options: [],
      explanation,
      example,
    };
  },

  "Skip-Counting-picture": () => {
    const candies = [
      // { emoji: "🍭", name: "lollipops" },
      // { emoji: "🍬", name: "candies" },
      // { emoji: "🍫", name: "chocolates" },
      // { emoji: "🧁", name: "cupcakes" },
      // { emoji: "🍩", name: "donuts" },
      // { emoji: "🦄", name: "unicorns" },
      // { emoji: "🚁", name: "helicopters" },
      // { emoji: "🛩️", name: "airplanes" },
      // { emoji: "🚀", name: "rockets" },
      // { emoji: "🐶", name: "dogs" },
      // { emoji: "🐱", name: "cats" },
      // { emoji: "⚽", name: "footballs" },
      // { emoji: "🏀", name: "basketballs" },
      // { emoji: "🚗", name: "cars" },
      // { emoji: "🚲", name: "bicycles" },
      // { emoji: "🛴", name: "scooters" },
      // { emoji: "🎈", name: "balloons" },
      // { emoji: "🎉", name: "party poppers" },
      // { emoji: "🎂", name: "birthday cakes" },
      // { emoji: "🍎", name: "apples" },
      // { emoji: "🍊", name: "oranges" },
      { image: require("../assets/banana.png"), name: "banana" },
      { image: require("../assets/bear.svg"), name: "bear" },
    ];

    const steps = [2, 3, 5, 10];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const numGroups = Math.floor(Math.random() * 5) + 2; // 2 to 6 groups
    const item = candies[Math.floor(Math.random() * candies.length)];
    const total = step * numGroups;

    // Create visual groups (emoji repeat OR image repeat)
    const visualGroups = Array.from({ length: numGroups }, () =>
      item.emoji ? item.emoji.repeat(step) : Array(step).fill(item.image)
    );

    // Step-by-step explanation for a 5-year-old
    const explanation = [
      `Look at each group of ${item.name}.`,
      `Each group has **${step}** ${item.name}.`,
      `We need to find out how many there are in total.`,
      `Instead of counting one by one, we skip-count by ${step}s.`,
      `Say the numbers out loud: ${Array.from(
        { length: numGroups },
        (_, i) => (i + 1) * step
      ).join(", ")}.`,
      `The last number you say is the total number of ${item.name}.`,
    ];

    // Example problem & solution
    const example = [
      "Example: There are 3 groups of cupcakes. Each group has 2 cupcakes.",
      "We count by 2s: 2, 4, 6.",
      "So, there are 6 cupcakes in total.",
    ];

    return {
      type: "input",
      question: `Count by **${step}s**:`,
      prompt: `How many **${item.name}** are there in total?`,
      answer: total.toString(),
      visuals: visualGroups,
      options: [],
      explanation, // New field
      example, // New field
    };
  },

  "A.1 Skip-counting-numbers": () => {
    const skip = [2, 5, 10][Math.floor(Math.random() * 3)];
    const start = Math.floor(Math.random() * 5);
    const series = Array.from({ length: 5 }, (_, i) => (start + i) * skip);
    return {
      question: `What number comes next in this skip counting sequence by ${skip}?`,
      type: "input",
      visuals: series.slice(0, 4),
      answer: series[4],
    };
  },
  "Skip-counting sequences": () => {
    const steps = [2, 3, 4, 5, 10, 25];
    const step = steps[Math.floor(Math.random() * steps.length)];
    const start = Math.floor(Math.random() * 10) * step;

    const sequence = Array.from({ length: 5 }, (_, i) => start + i * step);
    const nextNumber = start + 5 * step;

    return {
      type: "input",
      question: `What's the next number in this sequence?\n${sequence.join(
        ", "
      )}, ___`,
      answer: nextNumber.toString(),
      visuals: [],
      options: [],
    };
  },
  "missing number in sequence": () => {
    const stepOptions = [1, 2, 3, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const start = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const length = 7; // total items in sequence

    const fullSequence = Array.from({ length }, (_, i) => start + i * step);

    // Number of blanks: 1 to 3
    const numBlanks = Math.floor(Math.random() * 3) + 1;

    // Random unique blank indices
    const blankIndices = new Set();
    while (blankIndices.size < numBlanks) {
      const index = Math.floor(Math.random() * length);
      blankIndices.add(index);
    }

    // Build question with 'null' as placeholders
    const questionArray = fullSequence.map((num, idx) =>
      blankIndices.has(idx) ? "null" : num
    );

    // Extract correct answers based on blank indices
    const correctAnswers = Array.from(blankIndices)
      .sort((a, b) => a - b)
      .map((i) => fullSequence[i].toString());

    return {
      type: "sequence",
      question: `Fill the ${
        numBlanks > 1 ? "blanks" : "blank"
      } with the correct number${
        numBlanks > 1 ? "s" : ""
      }. \n add **${step}** to next number `,

      sequences: [questionArray.join(" ")],
      correctAnswers,
      stepHint: `Count by ${step}s`,
    };
  },

  "Counting patterns-up to 100": () => {
    const stepOptions = [2, 3, 4, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const start = Math.floor(Math.random() * 50) + 1; // random start from 1–50
    const blanks = 3; // always show 3 missing numbers

    const fullSequence = [start];
    for (let i = 1; i <= blanks; i++) {
      fullSequence.push(start + i * step);
    }

    const questionArray = [fullSequence[0], ...Array(blanks).fill("null")];

    const correctAnswers = fullSequence.slice(1).map((n) => n.toString());

    return {
      type: "sequence",
      question: `Count forward by ${step}s from ${start}.`,
      sequences: [questionArray.join(" ")],
      correctAnswers,
      stepHint: `Add ${step} each time.`,
    };
  },

  "Even or odd": () => {
    const emojis = [
      "🍎",
      "🍊",
      "🍇",
      "🍓",
      "🐶",
      "🐱",
      "⚽",
      "🏀",
      "🚗",
      "🚀",
      "✈️",
    ];
    const count = Math.floor(Math.random() * 10) + 3; // 3 to 12 emojis
    const answer = count % 2 === 0 ? "Even" : "Odd";

    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    const visualEmojis = Array.from({ length: count }, () => randomEmoji);

    return {
      type: "mcq",
      question: `Is the number of **${randomEmoji}s** Even or Odd?`,
      answer: answer,
      visuals: visualEmojis,
      single: true, // Show only one type of emoji
      options: ["Even", "Odd"],
    };
  },
  "Identify numbers as even or odd": () => {
    const count = Math.floor(Math.random() * 20) + 2; // Generates a number from 2 to 99
    const answer = count % 2 === 0 ? "Even" : "Odd";

    return {
      type: "mcq",
      // The question now directly asks about the generated number.
      question: `Is the number **${count}** Even or Odd?`,
      answer: answer,
      visuals: [], // Visuals are not needed for this question type.
      options: ["Even", "Odd"],
    };
  },
  "Skip-counting-stories": () => {
    const rubiesPerBracelet = Math.floor(Math.random() * 8) + 2; // 1 to 4 rubies
    const totalBracelets = Math.floor(Math.random() * 9) + 2;

    const correctAnswer = totalBracelets * rubiesPerBracelet;

    // Table markdown generation
    let tableMarkdown = `| Number of bracelets | Number of rubies |\n|---------------------|------------------|\n`;
    for (let i = 1; i <= totalBracelets; i++) {
      const rubies = i < totalBracelets ? i * rubiesPerBracelet : "?";
      tableMarkdown += `| ${i} | ${rubies} |\n`;
    }

    // Generate wrong options
    const wrongAnswers = new Set();
    while (wrongAnswers.size < 3) {
      const offset = Math.floor(Math.random() * 5) + 1;
      const candidate =
        Math.random() < 0.5 ? correctAnswer + offset : correctAnswer - offset;
      if (candidate > 0 && candidate !== correctAnswer) {
        wrongAnswers.add(candidate);
      }
    }

    const options = [...wrongAnswers, correctAnswer].sort(
      () => Math.random() - 0.5
    );

    // Story + question markdown
    const character = ["Riya", "Amit", "Zoya", "Kabir"][
      Math.floor(Math.random() * 4)
    ];
    const contextLine = `**${character}** is making bracelets to gift to friends.`;
    const detailLine = `Each bracelet has **${rubiesPerBracelet} rub${
      rubiesPerBracelet === 1 ? "y" : "ies"
    }.**`;
    const questionLine = `How many rubies will **${character}** need for **${totalBracelets}** bracelets?`;

    return {
      question: [contextLine, detailLine, questionLine].join("\n\n"),
      table: tableMarkdown.trim(),
      type: "mcq",
      answer: correctAnswer,
      options,
    };
  },
  "Skip-counting-puzzles": () => {
    const start = Math.floor(Math.random() * 20) * 5 + 10; // 10, 15, ..., 105
    const stepOptions = [2, 5, 10];
    const step = stepOptions[Math.floor(Math.random() * stepOptions.length)];

    const maxSteps = 10 + Math.floor(Math.random() * 6); // 10 to 15 steps
    const path = Array.from({ length: maxSteps }, (_, i) => start + i * step);

    const includeTarget = Math.random() < 0.7; // 70% chance of reachable

    let target;
    if (includeTarget) {
      // ✅ Pick an actual number from the sequence
      target = path[Math.floor(Math.random() * path.length)];
    } else {
      // ❌ Force a number that breaks the sequence pattern
      const offset = Math.floor(Math.random() * (step - 1)) + 1; // between 1 and step-1
      target =
        start + step * (maxSteps + Math.floor(Math.random() * 3) + 1) + offset;
    }

    // ✅ Correct formula check
    const isInSequence = (target - start) % step === 0 && target >= start;
    const answer = isInSequence ? "yes" : "no";

    const explanation = [
      `Karen starts at ${start}.`,
      `She skip-counts by ${step}.`,
      `The sequence is: ${path.join(", ")} ... (and it keeps going).`,
      `We check if ${target} fits the pattern using: (target - start) ÷ step.`,
      `${target} ${isInSequence ? "does" : "does not"} fit.`,
      `Therefore, the answer is **${answer}**.`,
    ];

    const example = [
      `Example: If Karen starts at 10 and skip-counts by 5s,\n` +
        `the sequence is 10, 15, 20, 25, ...\n` +
        `If asked whether 35 is in the sequence,\n` +
        `we check (35 - 10) ÷ 5 = 5, which is a whole number.\n` +
        `So the answer is **yes**.`,
    ];

    return {
      type: "mcq",
      question: `Karen began at **${start}**. She skip-counted by **${step}s**. Could she have said the number **${target}?**`,
      answer,
      options: ["yes", "no"],
      explanation,
      example,
    };
  },

  Select_evenorodd_numbers: () => {
    const numbers = [];
    const evenNumbers = [];
    const oddNumbers = [];

    // Randomly decide whether to ask for even or odd
    const askFor = Math.random() < 0.5 ? "even" : "odd";

    // Generate 2 unique even numbers
    while (evenNumbers.length < 2) {
      const num = Math.floor(Math.random() * 20); // 0–19
      if (num % 2 === 0 && !evenNumbers.includes(num)) {
        evenNumbers.push(num);
      }
    }

    // Generate 2 unique odd numbers
    while (oddNumbers.length < 2) {
      const num = Math.floor(Math.random() * 20) + 1; // 1–20
      if (num % 2 !== 0 && !oddNumbers.includes(num)) {
        oddNumbers.push(num);
      }
    }

    const allNumbers = [...evenNumbers, ...oddNumbers].sort(
      () => Math.random() - 0.5
    );

    return {
      type: "mcq-multiple",
      question: `Which of the following numbers are ${askFor}?`,
      answer: (askFor === "even" ? evenNumbers : oddNumbers).map((n) =>
        n.toString()
      ),
      options: allNumbers.map((n) => n.toString()),
      // visuals: allNumbers.map((n) => ({ type: "text", content: n.toString() })),
      questionType: askFor,
    };
  },

  "📊 Counting Patterns": () => {
    const steps = [
      { step: 2, word: "twos" },
      { step: 5, word: "fives" },
      { step: 10, word: "tens" },
    ];
    const { step, word } = steps[Math.floor(Math.random() * steps.length)];
    const isForward = Math.random() > 0.5;
    const start = Math.floor(Math.random() * 10 + 1) * step; // e.g., 2, 4..20 or 5, 10..50

    const sequence = [start];
    for (let i = 0; i < 4; i++) {
      const lastNum = sequence[sequence.length - 1];
      sequence.push(isForward ? lastNum + step : lastNum - step);
    }
    const nextNumber = isForward ? sequence[4] + step : sequence[4] - step;

    return {
      type: "input",
      question: `Count ${
        isForward ? "forward" : "backward"
      } by ${word}. What comes next?\n${sequence.join(", ")}, ___`,
      answer: nextNumber.toString(),
      visuals: [],
      options: [],
    };
  },

  "comparing-numbers-up-to-100": () => {
    // Generate two random numbers
    const num1 = Math.floor(Math.random() * 100) + 1;
    const num2 = Math.floor(Math.random() * 100) + 1;

    // Determine the correct relation
    let correctAnswer = "";
    if (num1 > num2) {
      correctAnswer = "is greater than";
    } else if (num1 < num2) {
      correctAnswer = "is less than";
    } else {
      correctAnswer = "is equal to";
    }

    // Options (always same set)
    const options = ["is greater than", "is less than", "is equal to"];

    // Question statement
    const questionLine = `Which words make this statement true?\n\n**${num1} ____ ${num2}**`;

    return {
      question: questionLine,
      type: "mcq",
      answer: correctAnswer,
      options,
    };
  },

  "word-problems-up-to-100": () => {
    // Context types
    const contexts = [
      {
        character: "Matt",
        title: "Hours of Babysitting",
        unit: "hours",
        questionTemplate: (char) =>
          `In which month did **${char}** babysit the least?`,
        minOrMax: "min",
      },
      {
        character: "Riya",
        title: "Temperature Recordings",
        unit: "°C",
        questionTemplate: (char) =>
          `In which month was the temperature the highest for **${char}**?`,
        minOrMax: "max",
      },
      {
        character: "Kabir",
        title: "Coins Collected",
        unit: "coins",
        questionTemplate: (char) =>
          `In which month did **${char}** collect the most coins?`,
        minOrMax: "max",
      },
      {
        character: "Amit",
        title: "Books Read",
        unit: "books",
        questionTemplate: (char) =>
          `In which month did **${char}** read the fewest books?`,
        minOrMax: "min",
      },
      {
        character: "Zoya",
        title: "Money Saved",
        unit: "₹",
        questionTemplate: (char) =>
          `In which month did **${char}** save the most money?`,
        minOrMax: "max",
      },
    ];

    // Pick a random context
    const context = contexts[Math.floor(Math.random() * contexts.length)];

    // Months & random values
    const months = ["October", "November", "December", "January"];
    const values = months.map(() => Math.floor(Math.random() * 50) + 50); // 50–99 range

    // Find correct answer based on context.minOrMax
    const targetValue =
      context.minOrMax === "min" ? Math.min(...values) : Math.max(...values);

    const correctMonth = months[values.indexOf(targetValue)];

    // Table Markdown
    let tableMarkdown = `| Month | ${context.title} |\n|-------|-----------------|\n`;
    months.forEach((m, i) => {
      tableMarkdown += `| ${m} | ${values[i]} ${context.unit} |\n`;
    });

    // Shuffle options
    const options = [...months].sort(() => Math.random() - 0.5);

    return {
      question: [
        `**${
          context.character
        }** is tracking **${context.title.toLowerCase()}**.`,
        context.questionTemplate(context.character),
      ].join("\n\n"),
      table: tableMarkdown.trim(),
      type: "mcq",
      answer: correctMonth,
      options,
    };
  },

  "ordinal-numbers-upto-10": () => {
    // Emoji pool (can be expanded)
    const emojiPool = [
      "🚂",
      "✈️",
      "🧸",
      "🚗",
      "🐶",
      "🍎",
      "⚽",
      "🐱",
      "🍩",
      "🌟",
    ];

    // Choose a random subset for the pattern
    const patternLength = Math.floor(Math.random() * 3) + 2; // 2–4 items
    const pattern = [];
    for (let i = 0; i < patternLength; i++) {
      const randEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
      if (!pattern.includes(randEmoji)) {
        pattern.push(randEmoji);
      } else {
        i--; // ensure uniqueness
      }
    }

    // Generate sequence
    const sequenceLength = 12;
    const sequence = Array.from(
      { length: sequenceLength },
      (_, i) => pattern[i % pattern.length]
    );

    // Pick a random position
    const position = Math.floor(Math.random() * sequenceLength) + 1;
    const correctAnswer = sequence[position - 1];

    // Options (pick from pattern, shuffle)
    const options = [...pattern].sort(() => Math.random() - 0.5);

    // Question
    const questionLine = `The first picture is ${sequence[0]}. Which picture is **${position}th**?`;

    return {
      question: questionLine,
      visuals: sequence, // 👈 emojis sequence
      type: "mcq",
      answer: correctAnswer,
      options,
      optionStyle: { fontSize: 32, padding: 12 }, // 👈 style hint for rendering
    };
  },

  "nth-letter-in-passage": () => {
    // Pool of sample passages
    const passages = [
      "The Queen of Hearts, she made some Tarts, all on a Summer's Day; The Knave of Hearts, he stole those Tarts, and took them clean away.",
      "Twinkle, twinkle, little star, How I wonder what you are! Up above the world so high, Like a diamond in the sky.",
      "Jack and Jill went up the hill to fetch a pail of water; Jack fell down and broke his crown, and Jill came tumbling after.",
      "Humpty Dumpty sat on a wall, Humpty Dumpty had a great fall. All the king’s horses and all the king’s men couldn’t put Humpty together again.",
    ];

    // Pick a random passage
    const passage = passages[Math.floor(Math.random() * passages.length)];

    // Pick a random letter index (avoid too small or too large)
    const letterIndex = Math.floor(Math.random() * (passage.length - 10)) + 5;

    // Correct answer = that letter
    const correctAnswer = passage[letterIndex - 1];

    // Highlight every 10th letter (for rendering hint)
    const highlightedPassage = passage
      .split("")
      .map((ch, idx) =>
        (idx + 1) % 10 === 0
          ? `<span style="color: orange; font-weight: bold">${ch}</span>`
          : ch
      )
      .join("");

    return {
      question: `What is the **${letterIndex}th** letter in this passage?`,
      hint: "Every 10th letter is orange.",
      passage: highlightedPassage, // use HTML/Markdown render
      type: "input", // user types the letter
      answer: correctAnswer,
    };
  },

  "Add 2 Numbers": () => {
    const a = Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 50);
    return {
      question: `What is ${a} + ${b}?`,
      type: "input",
      answer: a + b,
    };
  },
  "🟰 True or False?": () => {
    const a = Math.floor(Math.random() * 20);
    const b = Math.floor(Math.random() * 20);
    const c = Math.random() > 0.5 ? a + b : a + b + 1;
    const correct = a + b === c ? "True" : "False";
    return {
      question: `Is this true? ${a} + ${b} = ${c}`,
      type: "mcq",
      options: ["True", "False"],
      answer: correct,
    };
  },
  "💡 Guess the Number": () => {
    const numberPool = [2, 4, 6, 8, 10];
    const number = numberPool[Math.floor(Math.random() * numberPool.length)];

    const characters = [
      { emoji: "🤖", name: "Robo" },
      { emoji: "🕵️‍♂️", name: "Detective Dan" },
      { emoji: "🧙‍♂️", name: "Wizard Wally" },
      { emoji: "👩‍🏫", name: "Teacher Tia" },
      { emoji: "🦊", name: "Foxy" },
    ];

    const character = characters[Math.floor(Math.random() * characters.length)];

    const clues = [
      `It's an even number.`,
      `It's exactly ${number - 1} + 1.`,
      `It is divisible by ${number / 2}.`,
    ];

    // Options must include the correct answer and similar distractors
    const distractors = numberPool.filter((n) => n !== number);
    const shuffledOptions = [
      number,
      ...distractors.sort(() => 0.5 - Math.random()).slice(0, 3),
    ].sort(() => 0.5 - Math.random());

    return {
      question: `${character.emoji} ${
        character.name
      } says:\n"Can you guess my secret number?"\n\nHere are your clues:\n${clues.join(
        "\n"
      )}`,
      type: "mcq",
      options: shuffledOptions,
      answer: number,
      hint: "Only one number fits all clues exactly.",
    };
  },

  "🎭 Tricky Guess the Number": () => {
    const numberPool = [2, 4, 6, 8, 10];
    const number = numberPool[Math.floor(Math.random() * numberPool.length)];

    const characters = [
      { emoji: "🧛", name: "Count Clueless" },
      { emoji: "🤹", name: "Jester Jinx" },
      { emoji: "👻", name: "Ghostly Gwen" },
      { emoji: "🧠", name: "Brainy Ben" },
      { emoji: "🐒", name: "Monkey Max" },
    ];

    const character = characters[Math.floor(Math.random() * characters.length)];

    const clues = [
      `I'm not odd — but I act strange!`,
      `I’m more than ${number - 2} but less than ${number + 2}.`,
      `Divide me by 2, and you’ll get a whole number.`,
    ];

    const fakeClue = `One of the options is a trap! Don’t fall for the obvious one! 🙈`;

    // Distractors with similar properties
    const distractors = numberPool.filter((n) => n !== number);
    const shuffledOptions = [
      number,
      ...distractors.sort(() => 0.5 - Math.random()).slice(0, 3),
    ].sort(() => 0.5 - Math.random());

    return {
      question: `${character.emoji} ${
        character.name
      } whispers:\n"I've got a riddle for you..."\n\n${clues.join(
        "\n"
      )}\n\n${fakeClue}`,
      type: "mcq",
      options: shuffledOptions,
      answer: number,
      hint: "Even numbers only. Stay sharp — one choice breaks one clue!",
    };
  },

  "💡 Dynamic Guess the Number with Feedback": () => {
    const numberPool = Array.from({ length: 30 }, (_, i) => i + 1);
    const number = numberPool[Math.floor(Math.random() * numberPool.length)];

    // Dynamic clue logic
    const clues = [];

    // Clue 1: Even or Odd
    const isEven = number % 2 === 0;
    clues.push(isEven ? "I'm even." : "I'm odd.");

    // Clue 2: Range
    const min = number - 2;
    const max = number + 2;
    clues.push(`I'm between ${min} and ${max}.`);

    // Clue 3: Divisibility
    const divisibleBy = [2, 3, 5, 6].find((d) => number % d === 0) || 1;
    clues.push(`I'm divisible by ${divisibleBy}.`);

    // Prepare distractors
    const distractors = numberPool
      .filter((n) => n !== number)
      .filter((n) => Math.abs(n - number) <= 5)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [number, ...distractors].sort(() => 0.5 - Math.random());

    // Feedback per option
    const feedback = {};

    for (let opt of options) {
      if (opt === number) {
        feedback[opt] = "✅ Correct! This number matches all the clues.";
      } else {
        let reasons = [];

        if ((opt % 2 === 0) !== isEven) {
          reasons.push(
            `❌ It's ${
              opt % 2 === 0 ? "even" : "odd"
            }, but the clue says it should be ${isEven ? "even" : "odd"}.`
          );
        }

        if (opt <= min || opt >= max) {
          reasons.push(`❌ It's not between ${min} and ${max}.`);
        }

        if (opt % divisibleBy !== 0) {
          reasons.push(`❌ It's not divisible by ${divisibleBy}.`);
        }

        feedback[opt] = reasons.length
          ? reasons.join(" ")
          : "❌ Doesn't satisfy one or more clues.";
      }
    }

    const characters = [
      { emoji: "🤖", name: "Robo" },
      { emoji: "🧙‍♂️", name: "Wizard Wally" },
      { emoji: "🕵️‍♀️", name: "Detective Dot" },
      { emoji: "👻", name: "Spooky Sue" },
    ];
    const character = characters[Math.floor(Math.random() * characters.length)];

    return {
      question: `${character.emoji} ${
        character.name
      } says:\n"Can you guess my secret number?"\n\nClues:\n${clues.join(
        "\n"
      )}`,
      type: "mcq",
      options,
      answer: number,
      feedbackPerOption: feedback,
      hint: "Only one number fits all the clues.",
    };
  },
  "🎯 Multiple of 3 or 5?": () => {
    const options = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 30)
    );
    const multiples = options.filter((n) => n % 3 === 0 || n % 5 === 0);
    return {
      question: "Select all multiples of 3 or 5",
      type: "mcq-multiple",
      options,
      answer: multiples,
    };
  },
  "📏 What’s the Length?": () => {
    const length = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
    return {
      question: `If this line is ${length} cm long, how many 5 cm segments fit inside?`,
      type: "input",
      answer: length / 5,
    };
  },

  "C1.1 Ordinal Recognition": () => {
    const numbers = [1, 2, 3, 4, 5, 10, 11, 12, 20, 21, 22, 100, 101];
    const num = numbers[Math.floor(Math.random() * numbers.length)];
    let suffix;
    if (num % 100 >= 11 && num % 100 <= 13) suffix = "th";
    else
      switch (num % 10) {
        case 1:
          suffix = "st";
          break;
        case 2:
          suffix = "nd";
          break;
        case 3:
          suffix = "rd";
          break;
        default:
          suffix = "th";
      }
    return {
      question: `What is the correct ordinal form of ${num}?`,
      type: "mcq",
      options: [`${num}st`, `${num}nd`, `${num}rd`, `${num}th`],
      answer: `${num}${suffix}`,
      feedback: `Ordinal numbers ending in 1 use 'st' (except 11), 2 use 'nd' (except 12), 3 use 'rd' (except 13), others use 'th'.`,
    };
  },

  // C2: Writing Numbers up to 1000
  "C2.1 Number to Words (MCQ)": () => {
    // Helper function to convert number to words
    const numberToWords = (num) => {
      if (num === 0) return "zero";

      const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      let result = "";

      if (num >= 100) {
        result += ones[Math.floor(num / 100)] + " hundred";
        num %= 100;
        if (num > 0) result += " ";
      }

      if (num > 0) {
        if (num < 20) {
          result += ones[num];
        } else {
          result += tens[Math.floor(num / 10)];
          if (num % 10 > 0) {
            result += "-" + ones[num % 10];
          }
        }
      }

      return result;
    };

    // Generate a random number between 1 and 999
    const num = Math.floor(Math.random() * 999) + 1;
    const correctWord = numberToWords(num);

    // Generate distractors (plausible incorrect answers)
    const distractors = [];

    // Slight variations: remove hyphen, wrong tens, wrong ones, extra 'and', etc.
    const variations = [
      correctWord.replace("-", ""), // no hyphen
      correctWord.replace(
        /(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)/,
        "ten"
      ),
      correctWord.replace(
        /(one|two|three|four|five|six|seven|eight|nine)$/,
        "zero"
      ),
      correctWord.replace(/hundred/, "thousand"), // replace hundred with thousand
      correctWord.replace(/-/, " "), // space instead of hyphen
      correctWord + " and", // add 'and' (incorrect)
      correctWord.replace(
        /(ninety|eighty|seventy|sixty|fifty|forty|thirty|twenty)/,
        "ten"
      ), // wrong tens
    ];

    // Pick 3 unique distractors
    while (distractors.length < 3) {
      const candidate =
        variations[Math.floor(Math.random() * variations.length)];
      if (candidate !== correctWord && !distractors.includes(candidate)) {
        distractors.push(candidate);
      }
    }

    // Combine and shuffle options
    const options = [correctWord, ...distractors].sort(
      () => Math.random() - 0.5
    );

    return {
      question: `Which is the correct way to write ${num} in words?`,
      type: "mcq",
      options: options,
      answer: correctWord,
      feedback: `Remember: use hyphens from twenty-one to ninety-nine. In American English, 'and' is not typically used (e.g., "one hundred twenty-seven", not "one hundred and twenty-seven").`,
    };
  },

  // C3: Numbers up to 100 in Words
  "C3.1 Word to Number": () => {
    const numbers = {
      twelve: 12,
      "forty-five": 45,
      "eighty-eight": 88,
      "one hundred": 100,
    };
    const entries = Object.entries(numbers);
    const [word, num] = entries[Math.floor(Math.random() * entries.length)];

    return {
      question: `Convert "${word}" to digits:`,
      type: "input",
      answer: num.toString(),
      feedback: `Numbers from 21-99 use hyphens (e.g., forty-five).`,
    };
  },

  "C.3 Writing numbers up to 100 in words": () => {
    const numberToWords = (num) => {
      const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      if (num < 20) return ones[num];
      if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`;
      }
      return "one hundred";
    };

    const num = Math.floor(Math.random() * 81) + 20; // 20 to 100
    const correctWord = numberToWords(num);

    const distractors = [];
    while (distractors.length < 3) {
      const rand = Math.floor(Math.random() * 81) + 20;
      const word = numberToWords(rand);
      if (rand !== num && !distractors.includes(word)) {
        distractors.push(word);
      }
    }

    const options = [correctWord, ...distractors].sort(
      () => 0.5 - Math.random()
    );

    return {
      question: `Which is the correct way to write **${num}** in words?`,
      type: "mcq",
      options,
      answer: correctWord,
      feedback: `Use hyphens for compound numbers like "forty-two", and no 'and'.`,
    };
  },
  // C4: Ordinal vs. Cardinal
  "C.4 Distinguishing ordinal and cardinal numbers": () => {
    const examples = [
      // Easy
      { text: "There are 7 days in a week", type: "cardinal" },
      { text: "She finished in 3rd place", type: "ordinal" },
      { text: "I have 2 siblings", type: "cardinal" },
      { text: "Our anniversary is on the 25th", type: "ordinal" },
      { text: "He has 10 marbles", type: "cardinal" },
      { text: "This is my 1st trip abroad", type: "ordinal" },

      // Medium
      { text: "We ate 4 pizzas at the party", type: "cardinal" },
      { text: "My birthday is on the 9th of September", type: "ordinal" },
      { text: "He bought 8 books and read the 3rd one first", type: "mixed" },
      {
        text: "The elephant was the 5th animal we saw at the zoo",
        type: "ordinal",
      },
      { text: "She won 6 medals in her first tournament", type: "mixed" },

      // Tricky / Mixed
      {
        text: "They reached the 2nd checkpoint after running 3 miles",
        type: "mixed",
      },
      { text: "There were 20 players and he came 1st", type: "mixed" },
      {
        text: "The bus stops at the 6th street and picks up 10 passengers",
        type: "mixed",
      },
      { text: "I scored 95 in the 2nd round", type: "mixed" },
      { text: "The 10th question had only 2 correct answers", type: "mixed" },

      // Extra
      { text: "She drank 3 cups of tea today", type: "cardinal" },
      { text: "He lives on the 11th floor of the building", type: "ordinal" },
      { text: "The 4th chapter has 7 sections", type: "mixed" },
    ];

    const example = examples[Math.floor(Math.random() * examples.length)];

    return {
      question: `Is the number in this sentence cardinal or ordinal? \n **${example.text}**`,
      type: "mcq",
      options: ["cardinal", "ordinal", "mixed"],
      answer: example.type,
      feedback:
        example.type === "cardinal"
          ? "Cardinal numbers tell 'how many'."
          : "Ordinal numbers tell position or order.",
    };
  },

  // Bonus: Crossword Puzzle Generator
  "Crossword Generator": () => {
    const words = {
      ten: "10",
      twenty: "20",
      fifty: "50",
      hundred: "100",
    };
    const wordList = Object.keys(words);
    const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

    return {
      question: `Crossword clue: The number after ${words[selectedWord] - 1} (${
        selectedWord.length
      } letters)`,
      type: "input",
      textType: "text",
      answer: selectedWord,
      visuals: [`_ `.repeat(selectedWord.length).trim()],
      feedback: `Hint: It's how we write ${words[selectedWord]} in words.`,
    };
  },

  "🐻 Ordinal Emoji Challenge": () => {
    const emojiThemes = [
      ["🚂", "🐻", "✈️", "🚗", "🚲", "🚢", "🚀", "🛵"], // Transportation
      ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"], // Animals
      ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓"], // Fruits
      ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🎱", "🏓"], // Sports
    ];

    const theme = emojiThemes[Math.floor(Math.random() * emojiThemes.length)];
    const length = Math.floor(Math.random() * 4) + 5; // 5-8 emojis
    const emojis = theme.slice(0, length);
    const targetPos = Math.floor(Math.random() * (length - 2)) + 3; // 3rd to last-1 position

    // Create visual display with first item labeled
    const visualDisplay = emojis
      .map((emoji, i) => (i === 0 ? `${emoji} (first)` : emoji))
      .join(" → ");

    // Generate plausible wrong answers
    const wrongOptions = [
      emojis[targetPos % emojis.length], // Next in sequence
      emojis[targetPos - 2], // Previous item
      emojis[emojis.length - 1], // Last item
    ].filter((opt) => opt !== emojis[targetPos - 1]);

    return {
      type: "mcq",
      question: `The first item is ${
        emojis[0]
      }. Which is ${targetPos}${getOrdinalSuffix(targetPos)}?`,
      visuals: [visualDisplay],
      options: shuffleArray([emojis[targetPos - 1], ...wrongOptions, "None"]),
      answer: emojis[targetPos - 1],
      feedback: `Counting positions:\n${emojis
        .map((e, i) => `${i + 1}${getOrdinalSuffix(i + 1)}: ${e}`)
        .join("\n")}`,
    };
  },

  "A.1 Tense Fill-in-the-Blank": () => {
    const subjects = ["He", "She", "They", "I", "We"];
    const verbs = {
      eat: {
        past: "ate",
        present: { He: "eats", She: "eats", default: "eat" },
        future: "will eat",
      },
      go: {
        past: "went",
        present: { He: "goes", She: "goes", default: "go" },
        future: "will go",
      },
      play: {
        past: "played",
        present: { default: "play", He: "plays", She: "plays" },
        future: "will play",
      },
      run: {
        past: "ran",
        present: { He: "runs", She: "runs", default: "run" },
        future: "will run",
      },
      read: {
        past: "read",
        present: { default: "read", He: "reads", She: "reads" },
        future: "will read",
      },
    };

    const tenses = ["past", "present", "future"];

    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const verbKey =
      Object.keys(verbs)[Math.floor(Math.random() * Object.keys(verbs).length)];
    const verb = verbs[verbKey];
    const tense = tenses[Math.floor(Math.random() * tenses.length)];

    // Get correct answer form based on subject and tense
    const correct =
      tense === "present"
        ? verb.present[subject] || verb.present.default
        : verb[tense];

    // Generate plausible wrong options
    const wrongOptions = new Set([
      verb.present.default,
      verb.past,
      "will " + verbKey,
      verbKey + "ed",
      verbKey,
      verbKey + "s",
      verbKey + "ing",
    ]);

    wrongOptions.delete(correct); // ensure correct isn't duplicated

    const options = [...Array.from(wrongOptions).slice(0, 3), correct].sort(
      () => Math.random() - 0.5
    );

    return {
      type: "mcq",
      question: `**${subject} ___ every day.** _(Choose the correct form of "${verbKey}" in ${tense} tense)_`,
      options,
      answer: correct,
    };
  },
  "A.2 Synonym Match": () => {
    const synonymPairs = [
      {
        word: "happy",
        synonym: "joyful",
        distractors: ["sad", "angry", "fast"],
      },
      {
        word: "big",
        synonym: "large",
        distractors: ["tiny", "short", "small"],
      },
      {
        word: "smart",
        synonym: "intelligent",
        distractors: ["lazy", "slow", "dumb"],
      },
      {
        word: "cold",
        synonym: "chilly",
        distractors: ["hot", "warm", "burning"],
      },
      {
        word: "fast",
        synonym: "quick",
        distractors: ["slow", "late", "tired"],
      },
      {
        word: "pretty",
        synonym: "beautiful",
        distractors: ["ugly", "bad", "dirty"],
      },
      { word: "angry", synonym: "mad", distractors: ["calm", "kind", "quiet"] },
      {
        word: "start",
        synonym: "begin",
        distractors: ["end", "stop", "finish"],
      },
      {
        word: "strong",
        synonym: "powerful",
        distractors: ["weak", "soft", "tiny"],
      },
      {
        word: "clean",
        synonym: "tidy",
        distractors: ["dirty", "messy", "smelly"],
      },
    ];

    const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const selected =
      synonymPairs[Math.floor(Math.random() * synonymPairs.length)];
    const options = shuffleArray([selected.synonym, ...selected.distractors]);

    return {
      type: "mcq",
      question: `**Which word is a synonym of _${selected.word}_?**`,
      options,
      answer: selected.synonym,
    };
  },
  "A.3 Reading Comprehension (True/False)": () => {
    const passages = [
      {
        passage: "Tom loves painting. He paints every weekend.",
        trueStatement: "Tom paints every weekend.",
        falseStatement: "Tom hates painting.",
      },
      {
        passage: "Lily has a cat named Snowy. Snowy is white and fluffy.",
        trueStatement: "Snowy is white and fluffy.",
        falseStatement: "Lily has a dog named Snowy.",
      },
      {
        passage: "John reads a new book every month. He likes mystery novels.",
        trueStatement: "John reads a new book every month.",
        falseStatement: "John dislikes mystery novels.",
      },
      {
        passage:
          "Emma goes to the park every evening. She jogs for 30 minutes.",
        trueStatement: "Emma jogs every evening.",
        falseStatement: "Emma goes to the library every evening.",
      },
      {
        passage: "Raj is a doctor. He works in a hospital near his house.",
        trueStatement: "Raj works in a hospital.",
        falseStatement: "Raj is a teacher.",
      },
    ];

    // Pick a random passage
    const selected = passages[Math.floor(Math.random() * passages.length)];

    // Randomly decide whether to ask a true or false question
    const isTrue = Math.random() < 0.5;

    const questionText = isTrue
      ? selected.trueStatement
      : selected.falseStatement;
    const correctAnswer = isTrue ? "True" : "False";

    return {
      type: "mcq",
      passage: selected.passage,
      question: `**True or False?** _${questionText}_`,
      options: ["True", "False"],
      answer: correctAnswer,
    };
  },

  "N.1 numberSystem": () => {
    const numberToWords = (num) => {
      const ones = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ];
      const teens = [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      const tens = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];

      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;

      let words = ones[hundred] + " hundred";

      if (remainder > 0) {
        words += " and ";
        if (remainder < 10) {
          words += ones[one];
        } else if (remainder < 20) {
          words += teens[remainder - 10];
        } else {
          words += tens[ten];
          if (one > 0) words += "-" + ones[one];
        }
      }

      return words;
    };

    const num = Math.floor(Math.random() * 900 + 100); // 3-digit number
    const correct = numberToWords(num);

    // Distractors: slightly wrong versions
    const distractors = [
      numberToWords(num + 1),
      numberToWords(num - 1),
      numberToWords(num + 10),
    ];

    // Shuffle options
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);

    return {
      type: "mcq",
      question: `Write the number **${num}** in words.`,
      options,
      answer: correct,
      explanation: `Break ${num} into hundreds, tens, and ones. Then convert each to words. Example: ${num} → ${correct}`,
    };
  },
  "N.4 fractionAscendingOrder": () => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const reduceFraction = (num, den) => {
      const g = gcd(num, den);
      return [num / g, den / g];
    };

    const getLCM = (a, b) => (a * b) / gcd(a, b);

    const generateBar = (num, den) => {
      const filledCount = Math.round((num / den) * 10);
      const filled = "█".repeat(filledCount);
      const empty = "░".repeat(10 - filledCount);
      return `[${filled}${empty}]`;
    };

    // Generate 4 unique reduced proper fractions
    const fractionSet = new Set();
    while (fractionSet.size < 4) {
      const num = Math.floor(Math.random() * 5) + 1;
      const den = Math.floor(Math.random() * 4) + num + 2;
      const [n, d] = reduceFraction(num, den);
      fractionSet.add(`${n}/${d}`);
    }

    const fractions = Array.from(fractionSet).map((f) => {
      const [n, d] = f.split("/").map(Number);
      return {
        n,
        d,
        value: n / d,
        text: `\\frac{${n}}{${d}}`,
        bar: generateBar(n, d),
      };
    });

    // Correct ascending order
    const sorted = [...fractions].sort((a, b) => a.value - b.value);
    const correctOption = sorted.map((f) => f.text).join(" < ");

    // Generate 3 distractors
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    const generateWrongOptions = () => {
      const opts = new Set();
      while (opts.size < 3) {
        const option = shuffle(fractions)
          .map((f) => f.text)
          .join(" < ");
        if (option !== correctOption) opts.add(option);
      }
      return Array.from(opts);
    };

    const wrongOptions = generateWrongOptions();
    const allOptions = shuffle([correctOption, ...wrongOptions]);

    // Hint with visual bar
    const hint = fractions.map((f) => `${f.text}: ${f.bar}`).join("\n");

    // Step-by-step explanation using common denominators
    const denominators = fractions.map((f) => f.d);
    const commonDenominator = denominators.reduce((acc, d) => getLCM(acc, d));

    const equivalentFractions = fractions.map((f) => {
      const multiplier = commonDenominator / f.d;
      return {
        original: `\\frac{${f.n}}{${f.d}}`,
        equivalent: `\\frac{${f.n * multiplier}}{${commonDenominator}}`,
        numerator: f.n * multiplier,
      };
    });

    const sortedEquivalents = [...equivalentFractions].sort(
      (a, b) => a.numerator - b.numerator
    );

    const explanation = [
      `Find LCM of denominators (${denominators.join(
        ", "
      )}): ${commonDenominator}`,
      ...equivalentFractions.map((f) => `${f.original} = ${f.equivalent}`),
      `Now compare the numerators:`,
      sortedEquivalents.map((f) => f.equivalent).join(" < "),
      `So the correct ascending order is:`,
      sortedEquivalents.map((f) => f.original).join(" < "),
    ];

    return {
      type: "mcq",
      question: `Which option shows the fractions arranged in **ascending order**?`,
      options: allOptions,
      answer: correctOption,
      latex: true,
      hint: `Use the bar visuals to estimate each fraction's value:\n\n${hint}`,
      explanation: explanation,
    };
  },
  "N.4a compareTwoFractions": () => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const reduceFraction = (num, den) => {
      const g = gcd(num, den);
      return [num / g, den / g];
    };
    const getLCM = (a, b) => (a * b) / gcd(a, b);
    const generateBar = (num, den) => {
      const filledCount = Math.round((num / den) * 10);
      const filled = "█".repeat(filledCount);
      const empty = "░".repeat(10 - filledCount);
      return `[${filled}${empty}]`;
    };

    // Generate 2 distinct proper reduced fractions
    const fractionSet = new Set();
    while (fractionSet.size < 2) {
      const num = Math.floor(Math.random() * 5) + 1;
      const den = Math.floor(Math.random() * 4) + num + 2;
      const [n, d] = reduceFraction(num, den);
      fractionSet.add(`${n}/${d}`);
    }

    const [f1, f2] = Array.from(fractionSet).map((f) => {
      const [n, d] = f.split("/").map(Number);
      return {
        n,
        d,
        value: n / d,
        text: `\\frac{${n}}{${d}}`,
        bar: generateBar(n, d),
      };
    });

    // Determine correct comparison
    const symbols = ["<", ">", "="];
    let answerSymbol =
      f1.value < f2.value ? "<" : f1.value > f2.value ? ">" : "=";
    const correctAnswer = `${f1.text} ${answerSymbol} ${f2.text}`;

    // Generate distractors
    const distractors = symbols
      .filter((sym) => sym !== answerSymbol)
      .map((sym) => `${f1.text} ${sym} ${f2.text}`);
    const options = [correctAnswer, ...distractors].sort(
      () => Math.random() - 0.5
    );

    // Hint bar
    const hint = `${f1.text}: ${f1.bar}\n${f2.text}: ${f2.bar}`;

    // Explanation using common denominator
    const lcm = getLCM(f1.d, f2.d);
    const f1EqNum = (lcm / f1.d) * f1.n;
    const f2EqNum = (lcm / f2.d) * f2.n;

    const explanation = [
      `Find LCM of denominators (${f1.d}, ${f2.d}): ${lcm}`,
      `${f1.text} = \\frac{${f1EqNum}}{${lcm}}`,
      `${f2.text} = \\frac{${f2EqNum}}{${lcm}}`,
      `Now compare the numerators: ${f1EqNum} ${answerSymbol} ${f2EqNum}`,
      `So, ${f1.text} ${answerSymbol} ${f2.text} is the correct answer.`,
    ];

    return {
      type: "mcq",
      question: `Which of the following is correct?`,
      options,
      answer: correctAnswer,
      latex: true,
      hint: `Use the bar visuals to estimate each fraction's value:\n\n${hint}`,
      explanation,
    };
  },
  "N.4b TwoFractionsDescending": () => {
    const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
    const reduceFraction = (num, den) => {
      const g = gcd(num, den);
      return [num / g, den / g];
    };
    const getLCM = (a, b) => (a * b) / gcd(a, b);
    const generateBar = (num, den) => {
      const filledCount = Math.round((num / den) * 10);
      const filled = "█".repeat(filledCount);
      const empty = "░".repeat(10 - filledCount);
      return `[${filled}${empty}]`;
    };

    // Generate 2 distinct proper reduced fractions
    const fractionSet = new Set();
    while (fractionSet.size < 2) {
      const num = Math.floor(Math.random() * 5) + 1;
      const den = Math.floor(Math.random() * 4) + num + 2;
      const [n, d] = reduceFraction(num, den);
      fractionSet.add(`${n}/${d}`);
    }

    const [f1, f2] = Array.from(fractionSet).map((f) => {
      const [n, d] = f.split("/").map(Number);
      return {
        n,
        d,
        value: n / d,
        text: `\\frac{${n}}{${d}}`,
        bar: generateBar(n, d),
      };
    });

    // Determine correct descending order
    const correctAnswer =
      f1.value > f2.value
        ? `${f1.text} > ${f2.text}`
        : `${f2.text} > ${f1.text}`;

    const distractors = [
      `${f1.text} < ${f2.text}`,
      `${f2.text} < ${f1.text}`,
      `${f1.text} = ${f2.text}`,
    ].filter((option) => option !== correctAnswer);

    const options = [correctAnswer, ...distractors.slice(0, 2)].sort(
      () => Math.random() - 0.5
    );

    // Hint bar
    const hint = `${f1.text}: ${f1.bar}\n${f2.text}: ${f2.bar}`;

    // Explanation using common denominator
    const lcm = getLCM(f1.d, f2.d);
    const f1EqNum = (lcm / f1.d) * f1.n;
    const f2EqNum = (lcm / f2.d) * f2.n;
    const symbol = f1EqNum > f2EqNum ? ">" : f1EqNum < f2EqNum ? "<" : "=";

    const explanation = [
      `Find LCM of denominators (${f1.d}, ${f2.d}): ${lcm}`,
      `${f1.text} = \\frac{${f1EqNum}}{${lcm}}`,
      `${f2.text} = \\frac{${f2EqNum}}{${lcm}}`,
      `Now compare the numerators: ${f1EqNum} ${symbol} ${f2EqNum}`,
      `So the correct descending order is: ${correctAnswer}`,
    ];

    return {
      type: "mcq",
      question: `Which of the following shows the **descending order** between the two fractions?`,
      options,
      answer: correctAnswer,
      latex: true,
      hint: `Use the bar visuals to estimate each fraction's value:\n\n${hint}`,
      explanation,
    };
  },

  "A.1 fractionBasicsUnderstanding": () => {
    const shapes = ["circle", "rectangle", "square", "pizza"];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];

    const denominators = [2, 3, 4, 5, 6];
    const d = denominators[Math.floor(Math.random() * denominators.length)];
    const n = Math.floor(Math.random() * d) + 1;

    const correctAnswer = `${n}/${d}`;

    // Generate 3 unique incorrect options
    const distractors = new Set();
    while (distractors.size < 3) {
      const dn = denominators[Math.floor(Math.random() * denominators.length)];
      const nn = Math.floor(Math.random() * dn) + 1;
      const frac = `${nn}/${dn}`;
      if (frac !== correctAnswer) distractors.add(frac);
    }

    const allOptions = [...distractors, correctAnswer].sort(
      () => Math.random() - 0.5
    );

    const question = `A **${shape}** is divided into **${d} equal parts**. **${n} part(s)** are shaded.\n\n👉 What fraction of the ${shape} is shaded?`;

    // SVG render function
    const svg = (() => {
      const size = 100;

      if (shape === "circle" || shape === "pizza") {
        const slices = Array.from({ length: d }, (_, i) => {
          const angle = (360 / d) * i;
          const largeArc = 360 / d > 180 ? 1 : 0;
          const start = polarToCartesian(size, size, size, angle);
          const end = polarToCartesian(size, size, size, angle + 360 / d);
          const path = `
          M ${size} ${size}
          L ${start.x} ${start.y}
          A ${size} ${size} 0 ${largeArc} 1 ${end.x} ${end.y}
          Z
        `;
          return `<path d="${path}" fill="${
            i < n ? "#7b61ff" : "#e0e0e0"
          }" stroke="#444"/>`;
        }).join("\n");

        return `<svg width="200" height="200" viewBox="0 0 ${size * 2} ${
          size * 2
        }">${slices}</svg>`;
      }

      if (shape === "rectangle") {
        const partWidth = 120 / d;
        const bars = Array.from({ length: d }, (_, i) => {
          return `<rect x="${
            i * partWidth
          }" y="0" width="${partWidth}" height="60" fill="${
            i < n ? "#7b61ff" : "#e0e0e0"
          }" stroke="#444"/>`;
        }).join("\n");
        return `<svg width="120" height="60">${bars}</svg>`;
      }

      if (shape === "square") {
        const cols = Math.ceil(Math.sqrt(d));
        const rows = Math.ceil(d / cols);
        const cellSize = 30;
        const grid = Array.from({ length: d }, (_, i) => {
          const x = (i % cols) * cellSize;
          const y = Math.floor(i / cols) * cellSize;
          return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${
            i < n ? "#7b61ff" : "#e0e0e0"
          }" stroke="#444"/>`;
        }).join("\n");
        return `<svg width="${cols * cellSize}" height="${
          rows * cellSize
        }">${grid}</svg>`;
      }

      return null;
    })();

    return {
      type: "mcq",
      question,
      options: allOptions,
      answer: correctAnswer,
      hint: `Numerator (top): parts shaded = ${n}\nDenominator (bottom): total parts = ${d}`,
      explanation: [
        `A fraction shows how many parts of a whole are selected.`,
        `Numerator = shaded parts (${n}), Denominator = total parts (${d}).`,
        `So the fraction is **${n}/${d}**.`,
      ],
      svg, // raw SVG string (can be rendered with dangerouslySetInnerHTML)
    };
  },
  "A.2 ProperFractionQuestion": () => {
    const denominators = [2, 3, 4, 5, 6, 8];
    const correctAnswers = new Set();

    // Step 1: Generate multiple proper fractions (numerator < denominator)
    while (correctAnswers.size < 2) {
      const d = denominators[Math.floor(Math.random() * denominators.length)];
      const n = Math.floor(Math.random() * (d - 1)) + 1;
      correctAnswers.add(`${n}/${d}`);
    }

    // Step 2: Generate distractors (improper fractions: numerator >= denominator)
    const distractors = new Set();
    while (distractors.size < 2) {
      const d = denominators[Math.floor(Math.random() * denominators.length)];
      const n = Math.floor(Math.random() * (d + 3)) + d; // ensures n >= d
      const frac = `${n}/${d}`;
      if (!correctAnswers.has(frac)) {
        distractors.add(frac);
      }
    }

    const allOptions = [...correctAnswers, ...distractors];
    const [sampleCorrect] = [...correctAnswers]; // use one of them to build SVG

    const [nSvg, dSvg] = sampleCorrect.split("/").map(Number);

    // Step 3: SVG
    const boxWidth = 25;
    const shadedColor = "#4caf50";
    const unshadedColor = "#e0e0e0";

    const svgParts = [];
    for (let i = 0; i < dSvg; i++) {
      const fill = i < nSvg ? shadedColor : unshadedColor;
      svgParts.push(
        `<rect x="${
          i * boxWidth
        }" y="0" width="${boxWidth}" height="20" fill="${fill}" />`
      );
    }

    const svg = `<svg width="${
      dSvg * boxWidth
    }" height="20" xmlns="http://www.w3.org/2000/svg">
    ${svgParts.join("\n")}
    <rect x="0" y="0" width="${
      dSvg * boxWidth
    }" height="20" fill="none" stroke="#000"/>
  </svg>`;

    // Step 4: Return question object
    return {
      type: "mcq-multiple",
      question: "Which of the following are proper fractions? (multi-select)",
      options: allOptions.sort(() => Math.random() - 0.5), // shuffle
      answer: [...correctAnswers],
      hint: "A proper fraction has a numerator smaller than the denominator.",
      explanation: [
        `A **proper fraction** is where the numerator is less than the denominator.`,
        `For example, **${sampleCorrect}** means ${nSvg} parts out of ${dSvg} total.`,
        `Fractions like 5/4 or 8/6 are **improper** because the numerator is not smaller.`,
      ],
      svg,
    };
  },

  ImproperToMixedQuestion: () => {
    const denominators = [2, 3, 4, 5, 6];
    const d = denominators[Math.floor(Math.random() * denominators.length)];

    const n =
      Math.floor(Math.random() * 4 + 1) * d + Math.floor(Math.random() * d); // n ≥ d
    const whole = Math.floor(n / d);
    const remainder = n % d;

    const correctAnswer =
      remainder === 0 ? `${whole}` : `${whole} \\frac{${remainder}}{${d}}`;

    const distractors = new Set();

    while (distractors.size < 3) {
      let fakeWhole = whole + (Math.floor(Math.random() * 3) - 1);
      let fakeRem = (remainder + Math.floor(Math.random() * 3)) % d;
      if (fakeRem === 0 && fakeWhole === whole) continue;
      if (fakeWhole < 0 || (fakeWhole === whole && fakeRem === remainder))
        continue;
      const distractor =
        fakeRem === 0
          ? `${fakeWhole}`
          : `${fakeWhole} \\frac{${fakeRem}}{${d}}`;
      distractors.add(distractor);
    }

    const allOptions = [...distractors];
    allOptions.splice(Math.floor(Math.random() * 4), 0, correctAnswer);

    // SVG Generation 🍰
    const boxWidth = 25;
    const cakeHeight = 25;
    const wholeCakes = Math.floor(n / d);
    const remainderShaded = n % d;

    const svgParts = [];
    for (let i = 0; i < wholeCakes; i++) {
      svgParts.push(
        `<rect x="${i * (d * boxWidth + 5)}" y="0" width="${
          d * boxWidth
        }" height="${cakeHeight}" fill="#4caf50" stroke="#000"/>`
      );
    }

    if (remainderShaded > 0) {
      for (let j = 0; j < d; j++) {
        const fill = j < remainderShaded ? "#4caf50" : "#e0e0e0";
        svgParts.push(
          `<rect x="${
            wholeCakes * (d * boxWidth + 5) + j * boxWidth
          }" y="0" width="${boxWidth}" height="${cakeHeight}" fill="${fill}" stroke="#000" />`
        );
      }
      svgParts.push(
        `<rect x="${wholeCakes * (d * boxWidth + 5)}" y="0" width="${
          d * boxWidth
        }" height="${cakeHeight}" fill="none" stroke="#000"/>`
      );
    }

    const svg = `<svg width="${
      (wholeCakes + 1) * (d * boxWidth + 5)
    }" height="${cakeHeight}" xmlns="http://www.w3.org/2000/svg">
    ${svgParts.join("\n")}
  </svg>`;

    return {
      type: "mcq",
      latex: true,
      question: `What is $\\frac{${n}}{${d}}$ as a mixed number?`,
      options: allOptions.map((o) => `${o}`),
      answer: correctAnswer,
      hint: `Divide numerator by denominator: ${n} ÷ ${d} = ${whole} remainder ${remainder}`,
      explanation: [
        `Improper fraction means numerator ≥ denominator.`,
        `\\( ${n} \\div ${d} = ${whole} \\) remainder \\( ${remainder} \\)`,
        `So, \\( \\frac{${n}}{${d}} = ${whole} \\frac{${remainder}}{${d}} \\)`,
      ],
      svg,
    };
  },

  MixedToImproperQuestion: () => {
    const denominators = [2, 3, 4, 5, 6];
    const d = denominators[Math.floor(Math.random() * denominators.length)];
    const whole = Math.floor(Math.random() * 3 + 1); // 1–3
    const remainder = Math.floor(Math.random() * (d - 1)) + 1; // 1 to d-1

    const n = whole * d + remainder; // Improper numerator

    const correctAnswer = `\\frac{${n}}{${d}}`;

    // 🎯 Distractors
    const distractors = new Set();
    while (distractors.size < 3) {
      const fakeWhole = whole + (Math.floor(Math.random() * 3) - 1);
      const fakeRem = (remainder + Math.floor(Math.random() * 3)) % d;
      const fakeN = fakeWhole * d + fakeRem;
      const option = `\\frac{${fakeN}}{${d}}`;
      if (fakeN !== n && fakeN > 0) distractors.add(option);
    }

    const allOptions = [...distractors];
    allOptions.splice(Math.floor(Math.random() * 4), 0, correctAnswer);

    // 🎨 SVG
    const boxWidth = 25;
    const cakeHeight = 25;

    const svgParts = [];
    for (let i = 0; i < whole; i++) {
      svgParts.push(
        `<rect x="${i * (d * boxWidth + 5)}" y="0" width="${
          d * boxWidth
        }" height="${cakeHeight}" fill="#4caf50" stroke="#000"/>`
      );
    }

    for (let j = 0; j < d; j++) {
      const fill = j < remainder ? "#4caf50" : "#e0e0e0";
      svgParts.push(
        `<rect x="${
          whole * (d * boxWidth + 5) + j * boxWidth
        }" y="0" width="${boxWidth}" height="${cakeHeight}" fill="${fill}" stroke="#000" />`
      );
    }

    svgParts.push(
      `<rect x="${whole * (d * boxWidth + 5)}" y="0" width="${
        d * boxWidth
      }" height="${cakeHeight}" fill="none" stroke="#000"/>`
    );

    const svg = `<svg width="${
      (whole + 1) * (d * boxWidth + 5)
    }" height="${cakeHeight}" xmlns="http://www.w3.org/2000/svg">
    ${svgParts.join("\n")}
  </svg>`;

    return {
      type: "mcq",
      latex: true,

      question: `What is $${whole}\\frac{${remainder}}{${d}}$ as an improper fraction?`,

      options: allOptions,
      answer: correctAnswer,
      hint: `Use formula: (whole × denominator) + numerator = improper numerator → (${whole} × ${d}) + ${remainder} = ${n}`,
      explanation: [
        `To convert a mixed number to improper fraction:`,
        `\\( ${whole} \\frac{${remainder}}{${d}} = \\frac{${whole} \\times ${d} + ${remainder}}{${d}} = \\frac{${n}}{${d}} \\)`,
      ],
      svg,
    };
  },

  getTrainQuestion: () => {
    const trainLength = getRandomFromArray([900, 1000, 1200, 1250, 1500]);
    const distanceCovered = getRandomFromArray([800, 1000, 1200]);
    const time1 = getRandomFromArray([1, 2, 3]); // in minutes
    const time2 = getRandomFromArray([2, 3, 4]); // in minutes

    const speed = distanceCovered / time1; // m/min
    const totalDistanceCovered = speed * time2;
    const stationaryTrainLength = Math.round(
      totalDistanceCovered - trainLength
    );
    const correctAnswer = `${stationaryTrainLength} m`;

    const options = shuffleArray([
      correctAnswer,
      `${stationaryTrainLength + 100} m`,
      `${stationaryTrainLength + 200} m`,
      `${
        stationaryTrainLength - 100 > 0
          ? stationaryTrainLength - 100
          : stationaryTrainLength + 150
      } m`,
    ]);

    return {
      type: "mcq",
      question: `A train of length ${trainLength} m covers a distance of ${distanceCovered} m in ${time1} minute(s). It crosses a stationary train in ${time2} minutes. What is the length of the stationary train?`,
      options,
      answer: correctAnswer,
      hint: `Speed = Distance ÷ Time → Then use: Speed × Time = Total Distance`,
      explanation: [
        `Speed = ${distanceCovered} ÷ ${time1} = ${speed.toFixed(2)} m/min  
Total distance in ${time2} min = ${totalDistanceCovered.toFixed(2)} m  
Stationary train = ${totalDistanceCovered.toFixed(
          2
        )} - ${trainLength} = ${stationaryTrainLength} m`,
      ],
    };
  },

  getSpeedDistanceQuestion: () => {
    const speed = getRandomFromArray([30, 40, 50, 60]); // km/h
    const time = getRandomFromArray([1.5, 2, 2.5, 3]); // hours
    const distance = speed * time;

    const correctAnswer = `${distance} km`;
    const options = shuffleArray([
      correctAnswer,
      `${distance + 10} km`,
      `${distance - 10 > 0 ? distance - 10 : distance + 5} km`,
      `${distance + 5} km`,
    ]);

    return {
      type: "mcq",
      question: `A car is moving at ${speed} km/h. How far will it travel in ${time} hour(s)?`,
      options,
      answer: correctAnswer,
      hint: `Distance = Speed × Time`,
      explanation: [`Distance = ${speed} × ${time} = ${distance} km`],
    };
  },

  generateGroupSwapQuestions: (count = 5) => {
    const generators = [
      getPicnicQuestion,
      getFootballTeamQuestion,
      getClassroomQuestion,
    ];
    const randomGen = getRandomFromArray(generators);
    return randomGen();
  },

  getTrainPassingBridgeQuestion: () => {
    const trainLength = getRandomFromArray([200, 300, 400, 500]); // meters
    const bridgeLength = getRandomFromArray([100, 150, 200]); // meters
    const totalLength = trainLength + bridgeLength;
    const speed = getRandomFromArray([30, 40, 50]); // m/s

    const time = totalLength / speed; // seconds
    const correctAnswer = `${Math.round(time)} sec`;

    const options = shuffleArray([
      correctAnswer,
      `${Math.round(time + 5)} sec`,
      `${
        Math.round(time - 3) > 0 ? Math.round(time - 3) : Math.round(time + 7)
      } sec`,
      `${Math.round(time + 10)} sec`,
    ]);

    return {
      type: "mcq",
      question: `A train ${trainLength} m long is running at a speed of ${speed} m/s. How much time will it take to cross a bridge ${bridgeLength} m long?`,
      options,
      answer: correctAnswer,
      hint: `Total distance = Train + Bridge. Time = Distance / Speed`,
      explanation: [
        `Total distance = ${trainLength} + ${bridgeLength} = ${totalLength} m  
Speed = ${speed} m/s  
Time = ${totalLength} ÷ ${speed} = ${Math.round(time)} sec`,
      ],
    };
  },

  getTwoTrainsCrossingEachOtherQuestion: () => {
    const length1 = getRandomFromArray([100, 150, 200]); // meters
    const speed1 = getRandomFromArray([30, 40]); // m/s

    const length2 = getRandomFromArray([100, 150, 200]); // meters
    const speed2 = getRandomFromArray([20, 30]); // m/s

    const totalLength = length1 + length2;
    const relativeSpeed = speed1 + speed2; // assuming opposite directions

    const time = totalLength / relativeSpeed; // in seconds
    const correctAnswer = `${Math.round(time)} sec`;

    const options = shuffleArray([
      correctAnswer,
      `${Math.round(time + 5)} sec`,
      `${Math.round(time + 10)} sec`,
      `${
        Math.round(time - 3) > 0 ? Math.round(time - 3) : Math.round(time + 7)
      } sec`,
    ]);

    return {
      type: "mcq",
      question: `Two trains of lengths ${length1} m and ${length2} m are moving towards each other at speeds ${speed1} m/s and ${speed2} m/s respectively. How long will they take to cross each other?`,
      options,
      answer: correctAnswer,
      hint: `Relative speed = Speed1 + Speed2. Total length = L1 + L2. Time = Total / Relative`,
      explanation: [
        `Total length = ${totalLength} m  
Relative speed = ${speed1} + ${speed2} = ${relativeSpeed} m/s  
Time = ${totalLength} ÷ ${relativeSpeed} = ${Math.round(time)} sec`,
      ],
    };
  },

  // ✅ 5. Train crosses another moving train in same direction
  trainCrossesMovingTrainSameDirection: () => {
    const length1 = getRandomFromArray([100, 150, 200]);
    const speed1 = getRandomFromArray([50, 60]);

    const length2 = getRandomFromArray([80, 100, 120]);
    const speed2 = getRandomFromArray([30, 40]);

    const relativeSpeed = speed1 - speed2; // in m/s
    const totalLength = length1 + length2; // m
    const time = totalLength / relativeSpeed; // in sec

    const correctAnswer = `${Math.round(time)} sec`;
    const options = shuffleArray([
      correctAnswer,
      `${Math.round(time + 5)} sec`,
      `${
        Math.round(time - 3) > 0 ? Math.round(time - 3) : Math.round(time + 7)
      } sec`,
      `${Math.round(time + 10)} sec`,
    ]);

    return {
      type: "mcq",
      question: `A ${length1} m long train moving at ${speed1} m/s overtakes a ${length2} m long train moving in the same direction at ${speed2} m/s. How much time will it take to completely cross the second train?`,
      options,
      answer: correctAnswer,
      hint: `Relative speed = Speed1 - Speed2`,
      explanation: [
        `Relative speed = ${speed1} - ${speed2} = ${relativeSpeed} m/s\nTotal length = ${length1} + ${length2} = ${totalLength} m\nTime = ${totalLength} / ${relativeSpeed} = ${Math.round(
          time
        )} sec`,
      ],
    };
  },

  // ✅ 6. Person overtaken by train
  personOvertakenByTrain: () => {
    const trainLength = getRandomFromArray([100, 120, 150]);
    const trainSpeed = getRandomFromArray([40, 60]); // m/s
    const personSpeed = getRandomFromArray([5, 10]); // m/s
    const relativeSpeed = trainSpeed - personSpeed;
    const time = trainLength / relativeSpeed;

    const correctAnswer = `${Math.round(time)} sec`;
    const options = shuffleArray([
      correctAnswer,
      `${Math.round(time + 5)} sec`,
      `${Math.round(time + 10)} sec`,
      `${
        Math.round(time - 3) > 0 ? Math.round(time - 3) : Math.round(time + 6)
      } sec`,
    ]);

    return {
      type: "mcq",
      question: `A train ${trainLength} m long moving at ${trainSpeed} m/s overtakes a person walking at ${personSpeed} m/s. How much time will it take to overtake the person?`,
      options,
      answer: correctAnswer,
      hint: `Relative speed = Train speed - Person speed`,
      explanation: [
        `Relative speed = ${trainSpeed} - ${personSpeed} = ${relativeSpeed} m/s\nTime = ${trainLength} / ${relativeSpeed} = ${Math.round(
          time
        )} sec`,
      ],
    };
  },

  // ✅ 7. Boat and Stream (Upstream/Downstream)
  boatStreamQuestion: () => {
    const boatSpeed = getRandomFromArray([10, 12, 15]);
    const streamSpeed = getRandomFromArray([2, 3, 4]);
    const time = getRandomFromArray([1, 2, 3]);
    const direction = getRandomFromArray(["upstream", "downstream"]);
    const effectiveSpeed =
      direction === "upstream"
        ? boatSpeed - streamSpeed
        : boatSpeed + streamSpeed;
    const distance = effectiveSpeed * time;

    const correctAnswer = `${distance} km`;
    const options = shuffleArray([
      correctAnswer,
      `${distance + 5} km`,
      `${distance + 3} km`,
      `${distance - 2 > 0 ? distance - 2 : distance + 6} km`,
    ]);

    return {
      type: "mcq",
      question: `A boat can travel ${direction} at a speed of ${effectiveSpeed} km/h. How far will it go in ${time} hour(s)?`,
      options,
      answer: correctAnswer,
      hint: `Upstream = boat - stream; Downstream = boat + stream`,
      explanation: [
        `Effective speed = ${effectiveSpeed} km/h\nDistance = ${effectiveSpeed} × ${time} = ${distance} km`,
      ],
    };
  },

  // ✅ 8. Average speed over two segments
  averageSpeedQuestion: () => {
    const d1 = getRandomFromArray([30, 40, 50]);
    const d2 = getRandomFromArray([30, 40, 50]);
    const s1 = getRandomFromArray([30, 40, 50]);
    const s2 = getRandomFromArray([60, 70, 80]);

    const t1 = d1 / s1;
    const t2 = d2 / s2;
    const totalDistance = d1 + d2;
    const totalTime = t1 + t2;
    const avgSpeed = Math.round(totalDistance / totalTime);

    const correctAnswer = `${avgSpeed} km/h`;
    const options = shuffleArray([
      correctAnswer,
      `${avgSpeed + 5} km/h`,
      `${avgSpeed - 5} km/h`,
      `${avgSpeed + 10} km/h`,
    ]);

    return {
      type: "mcq",
      question: `A person travels ${d1} km at ${s1} km/h and then ${d2} km at ${s2} km/h. What is their average speed for the whole journey?`,
      options,
      answer: correctAnswer,
      hint: `Average speed = Total distance / Total time`,
      explanation: [
        `Total time = ${d1}/${s1} + ${d2}/${s2} = ${totalTime.toFixed(
          2
        )} hr\nAverage speed = ${totalDistance}/${totalTime.toFixed(
          2
        )} = ${avgSpeed} km/h`,
      ],
    };
  },

  // ✅ 9. Unit conversion (m/s to km/h)
  unitConversionQuestion: () => {
    const ms = getRandomFromArray([5, 10, 15]);
    const kmh = ms * 3.6;
    const correctAnswer = `${kmh} km/h`;
    const options = shuffleArray([
      correctAnswer,
      `${kmh + 10} km/h`,
      `${kmh - 5} km/h`,
      `${kmh + 15} km/h`,
    ]);

    return {
      type: "mcq",
      question: `Convert ${ms} m/s to km/h:`,
      options,
      answer: correctAnswer,
      hint: `Multiply by 3.6`,
      explanation: [`${ms} × 3.6 = ${kmh} km/h`],
    };
  },

  // ✅ 10. Catch-up problem
  catchUpProblem: () => {
    const leadTime = getRandomFromArray([10, 15, 20]); // in minutes
    const speedA = getRandomFromArray([40, 50, 60]); // km/h
    const speedB = speedA + getRandomFromArray([10, 15, 20]); // km/h

    const leadDistance = (speedA * leadTime) / 60; // in km
    const relativeSpeed = speedB - speedA; // in km/h

    const timeToCatchHr = leadDistance / relativeSpeed; // in hours
    const timeToCatchMin = Math.round(timeToCatchHr * 60); // in minutes

    const correctAnswer = `${timeToCatchMin} min`;

    // Generate plausible distractors
    const distractors = new Set();
    while (distractors.size < 3) {
      const variation =
        timeToCatchMin + getRandomFromArray([-20, -10, 10, 20, 30]);
      if (variation > 0 && variation !== timeToCatchMin) {
        distractors.add(`${variation} min`);
      }
    }

    const options = shuffleArray([correctAnswer, ...distractors]);

    return {
      type: "mcq",
      question: `Person A starts ${leadTime} minutes before Person B at ${speedA} km/h. Person B starts at ${speedB} km/h. When will B catch up to A?`,
      options,
      answer: correctAnswer,
      hint: `Lead Distance = Speed × Time\nTime to catch = Lead / (B - A)`,
      explanation: [
        `Lead = ${leadDistance.toFixed(2)} km`,
        `Relative speed = ${relativeSpeed} km/h`,
        `Time = ${leadDistance.toFixed(
          2
        )} ÷ ${relativeSpeed} = ${timeToCatchHr.toFixed(
          2
        )} hr = ${timeToCatchMin} min`,
      ],
    };
  },

  Sorting: () => {
    const items = generateRandomNumbers(5, 1, 99, true);
    const orderType = Math.random() > 0.5 ? "asc" : "desc";

    return {
      type: "sorting",
      question: `Sort the Numbers in ${
        orderType === "asc" ? "Ascending" : "Descending"
      } Order`,
      items,
      orderType,
    };
  },

  "eng-fill-blank": () => {
    return [
      {
        id: 1,
        sentence: "The cat is ___ and the dog is ___.",
        blanks: [{ answer: "black" }, { answer: "white" }],
        options: ["black", "white", "blue", "fast"],
      },
      {
        id: 2,
        sentence: "I ___ to school and I ___ my homework.",
        blanks: [{ answer: "go" }, { answer: "finish" }],
        options: ["run", "finish", "go", "eat"],
      },
      {
        id: 3,
        sentence: "She likes ___ but hates ___.",
        blanks: [{ answer: "apples" }, { answer: "bananas" }],
        options: ["bananas", "cats", "apples", "dogs"],
      },
    ];
  },

  "ways-to-make-a-number-sums-to-10": (numOptions = 4) => {
    // Random target between 1 and 10
    const target = Math.floor(Math.random() * 10) + 1;

    // Helper: random integer in range
    const randomInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    // All correct pairs: a + b = target
    const correctPairs = [];
    for (let a = 0; a <= target; a++) {
      correctPairs.push(`${a} + ${target - a}`);
    }

    // Pick one correct answer at random
    const correctAnswer = correctPairs[randomInt(0, correctPairs.length - 1)];

    // Generate distractors (incorrect but plausible sums)
    const distractors = new Set();
    while (distractors.size < numOptions - 1) {
      // Create a sum close to target ±3, but not equal to target
      const offset = randomInt(1, 3) * (Math.random() < 0.5 ? -1 : 1);
      const sumValue = target + offset;

      // Randomly split sumValue into two parts
      const a = randomInt(0, sumValue);
      const b = sumValue - a;
      const option = `${a} + ${b}`;

      if (!correctPairs.includes(option) && !distractors.has(option)) {
        distractors.add(option);
      }
    }

    // Combine and shuffle
    const options = [...distractors, correctAnswer].sort(
      () => Math.random() - 0.5
    );

    return {
      question: `Which of the following shows a correct way to make ${target}?`,
      options,
      answer: correctAnswer,
      type: "mcq",
    };
  },

  // Example usage:
  // const question = ordinalEmojiGenerator();
  // console.log(question);
};
