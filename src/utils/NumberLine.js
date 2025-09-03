import { useEffect, useState } from "react";

export const NumberLineQuestion = ({ question, onAnswer, showResult, key }) =>{
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  const handleNumberClick = (number) => {
    if (showResult) return;
    setSelectedNumbers((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number)
        : [...prev, number]
    );
  };

  useEffect(() => {
    if (!showResult) {
      onAnswer(selectedNumbers);
    }
  }, [selectedNumbers, showResult]);

  const width = 400;
  const height = 100;
  const padding = 50;

  const numberPositions = question.numbers.map((num, i) => {
    const x =
      padding + i * ((width - 2 * padding) / (question.numbers.length - 1));
    return { number: num, x };
  });

  return (
    <div className="flex flex-col items-center mt-6">
      <svg width={width} height={height} className="border-b-2 border-gray-400">
        <line
          x1={padding}
          y1={height / 2}
          x2={width - padding}
          y2={height / 2}
          stroke="black"
          strokeWidth="2"
        />

        {numberPositions.map(({ number, x }) => {
          const isTarget = question.answer.includes(number);
          const isSelected = selectedNumbers.includes(number);

          return (
            <g
              key={number}
              onClick={() => handleNumberClick(number)}
              className="cursor-pointer"
            >
              <line
                x1={x}
                y1={height / 2 - 10}
                x2={x}
                y2={height / 2 + 10}
                stroke="black"
                strokeWidth="2"
              />
              <text
                x={x}
                y={height / 2 + 30}
                textAnchor="middle"
                fontSize="16"
                fill={showResult && isTarget ? "green" : "black"}
              >
                {number}
              </text>

              {isSelected && (
                <circle
                  cx={x}
                  cy={height / 2}
                  r="8"
                  fill={showResult ? (isTarget ? "green" : "red") : "blue"}
                />
              )}

              {showResult && isTarget && !isSelected && (
                <circle
                  cx={x}
                  cy={height / 2}
                  r="8"
                  fill="none"
                  stroke="green"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </g>
          );
        })}
      </svg>

      {showResult && (
        <div className="mt-4 text-center space-y-2">
          {selectedNumbers.every((n) => question.answer.includes(n)) &&
          selectedNumbers.length === question.answer.length ? (
            <div className="text-green-600 font-bold">
              Perfect! All {question.questionType} numbers selected correctly!
            </div>
          ) : (
            <>
              {selectedNumbers.some((n) => !question.answer.includes(n)) && (
                <div className="text-red-600">
                  Incorrect selections:{" "}
                  {selectedNumbers
                    .filter((n) => !question.answer.includes(n))
                    .join(", ")}
                </div>
              )}
              {question.answer.some((n) => !selectedNumbers.includes(n)) && (
                <div className="text-yellow-600">
                  Missed {question.questionType} numbers:{" "}
                  {question.answer
                    .filter((n) => !selectedNumbers.includes(n))
                    .join(", ")}
                </div>
              )}
            </>
          )}
          <div className="text-gray-700">
            Remember: {question.questionType} numbers{" "}
            {question.questionType === "even"
              ? "are divisible by 2 (0, 2, 4, etc.)"
              : "are not divisible by 2 (1, 3, 5, etc.)"}
          </div>
        </div>
      )}
    </div>
  );
}