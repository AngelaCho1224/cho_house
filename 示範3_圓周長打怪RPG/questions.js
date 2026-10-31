// 題目與答案逐題取自《圓周長計算與逆推.docx》；保留來源題號。
window.QUESTIONS = [
  {
    "id": 1,
    "question": "一個圓的直徑是 6 公分，圓周長是多少？",
    "options": [
      "3π 公分",
      "6π 公分",
      "12π 公分",
      "36π 公分"
    ],
    "answer": 1,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝6 × π＝6π 公分。"
  },
  {
    "id": 2,
    "question": "一個圓的直徑是 10 公分，圓周長是多少？",
    "options": [
      "5π 公分",
      "20π 公分",
      "10π 公分",
      "100π 公分"
    ],
    "answer": 2,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝10 × π＝10π 公分。"
  },
  {
    "id": 3,
    "question": "一個圓的直徑是 8 公分，圓周長是多少？",
    "options": [
      "8π 公分",
      "4π 公分",
      "16π 公分",
      "64π 公分"
    ],
    "answer": 0,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝8 × π＝8π 公分。"
  },
  {
    "id": 4,
    "question": "一個圓的直徑是 14 公分，圓周長是多少？",
    "options": [
      "28π 公分",
      "7π 公分",
      "196π 公分",
      "14π 公分"
    ],
    "answer": 3,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝14 × π＝14π 公分。"
  },
  {
    "id": 5,
    "question": "一個圓的直徑是 20 公分，圓周長是多少？",
    "options": [
      "10π 公分",
      "20π 公分",
      "40π 公分",
      "400π 公分"
    ],
    "answer": 1,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝20 × π＝20π 公分。"
  },
  {
    "id": 6,
    "question": "一個圓的直徑是 9 公分，圓周長是多少？",
    "options": [
      "18π 公分",
      "81π 公分",
      "9π 公分",
      "4.5π 公分"
    ],
    "answer": 2,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝9 × π＝9π 公分。"
  },
  {
    "id": 7,
    "question": "一個圓的直徑是 16 公分，圓周長是多少？",
    "options": [
      "32π 公分",
      "8π 公分",
      "256π 公分",
      "16π 公分"
    ],
    "answer": 3,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝16 × π＝16π 公分。"
  },
  {
    "id": 8,
    "question": "一個圓的直徑是 25 公分，圓周長是多少？",
    "options": [
      "50π 公分",
      "625π 公分",
      "12.5π 公分",
      "25π 公分"
    ],
    "answer": 3,
    "kind": "diameter",
    "explanation": "圓周長＝直徑 × π＝25 × π＝25π 公分。"
  },
  {
    "id": 9,
    "question": "一個圓的半徑是 3 公分，圓周長是多少？",
    "options": [
      "3π 公分",
      "9π 公分",
      "6π 公分",
      "12π 公分"
    ],
    "answer": 2,
    "kind": "radius",
    "explanation": "圓周長＝半徑 × 2 × π＝3 × 2 × π＝6π 公分。"
  },
  {
    "id": 10,
    "question": "一個圓的半徑是 5 公分，圓周長是多少？",
    "options": [
      "25π 公分",
      "10π 公分",
      "5π 公分",
      "20π 公分"
    ],
    "answer": 1,
    "kind": "radius",
    "explanation": "圓周長＝半徑 × 2 × π＝5 × 2 × π＝10π 公分。"
  },
  {
    "id": 11,
    "question": "一個圓的半徑是 7 公分，圓周長是多少？",
    "options": [
      "7π 公分",
      "49π 公分",
      "21π 公分",
      "14π 公分"
    ],
    "answer": 3,
    "kind": "radius",
    "explanation": "圓周長＝半徑 × 2 × π＝7 × 2 × π＝14π 公分。"
  },
  {
    "id": 12,
    "question": "一個圓的半徑是 4 公分，圓周長是多少？",
    "options": [
      "8π 公分",
      "4π 公分",
      "16π 公分",
      "12π 公分"
    ],
    "answer": 0,
    "kind": "radius",
    "explanation": "圓周長＝半徑 × 2 × π＝4 × 2 × π＝8π 公分。"
  },
  {
    "id": 13,
    "question": "一個圓的半徑是 9 公分，圓周長是多少？",
    "options": [
      "9π 公分",
      "81π 公分",
      "18π 公分",
      "27π 公分"
    ],
    "answer": 2,
    "kind": "radius",
    "explanation": "圓周長＝半徑 × 2 × π＝9 × 2 × π＝18π 公分。"
  },
  {
    "id": 14,
    "question": "一個圓的半徑是 12 公分，圓周長是多少？",
    "options": [
      "12π 公分",
      "24π 公分",
      "144π 公分",
      "36π 公分"
    ],
    "answer": 1,
    "kind": "radius",
    "explanation": "圓周長＝半徑 × 2 × π＝12 × 2 × π＝24π 公分。"
  },
  {
    "id": 15,
    "question": "一個圓的半徑是 15 公分，圓周長是多少？",
    "options": [
      "15π 公分",
      "225π 公分",
      "45π 公分",
      "30π 公分"
    ],
    "answer": 3,
    "kind": "radius",
    "explanation": "圓周長＝半徑 × 2 × π＝15 × 2 × π＝30π 公分。"
  },
  {
    "id": 16,
    "question": "一個圓的圓周長是 6π 公分，直徑是多少？",
    "options": [
      "3 公分",
      "6 公分",
      "12 公分",
      "18 公分"
    ],
    "answer": 1,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝6π ÷ π＝6 公分。"
  },
  {
    "id": 17,
    "question": "一個圓的圓周長是 10π 公分，直徑是多少？",
    "options": [
      "20 公分",
      "5 公分",
      "10 公分",
      "30 公分"
    ],
    "answer": 2,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝10π ÷ π＝10 公分。"
  },
  {
    "id": 18,
    "question": "一個圓的圓周長是 8π 公分，直徑是多少？",
    "options": [
      "8 公分",
      "16 公分",
      "4 公分",
      "24 公分"
    ],
    "answer": 0,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝8π ÷ π＝8 公分。"
  },
  {
    "id": 19,
    "question": "一個圓的圓周長是 14π 公分，直徑是多少？",
    "options": [
      "28 公分",
      "21 公分",
      "7 公分",
      "14 公分"
    ],
    "answer": 3,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝14π ÷ π＝14 公分。"
  },
  {
    "id": 20,
    "question": "一個圓的圓周長是 20π 公分，直徑是多少？",
    "options": [
      "10 公分",
      "20 公分",
      "40 公分",
      "60 公分"
    ],
    "answer": 1,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝20π ÷ π＝20 公分。"
  },
  {
    "id": 21,
    "question": "一個圓的圓周長是 9π 公分，直徑是多少？",
    "options": [
      "18 公分",
      "4.5 公分",
      "9 公分",
      "27 公分"
    ],
    "answer": 2,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝9π ÷ π＝9 公分。"
  },
  {
    "id": 22,
    "question": "一個圓的圓周長是 16π 公分，直徑是多少？",
    "options": [
      "32 公分",
      "8 公分",
      "48 公分",
      "16 公分"
    ],
    "answer": 3,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝16π ÷ π＝16 公分。"
  },
  {
    "id": 23,
    "question": "一個圓的圓周長是 25π 公分，直徑是多少？",
    "options": [
      "50 公分",
      "12.5 公分",
      "75 公分",
      "25 公分"
    ],
    "answer": 3,
    "kind": "findDiameter",
    "explanation": "直徑＝圓周長 ÷ π＝25π ÷ π＝25 公分。"
  },
  {
    "id": 24,
    "question": "一個圓的圓周長是 6π 公分，半徑是多少？",
    "options": [
      "6 公分",
      "12 公分",
      "3 公分",
      "9 公分"
    ],
    "answer": 2,
    "kind": "findRadius",
    "explanation": "半徑＝圓周長 ÷ π ÷ 2＝6π ÷ π ÷ 2＝3 公分。"
  },
  {
    "id": 25,
    "question": "一個圓的圓周長是 10π 公分，半徑是多少？",
    "options": [
      "10 公分",
      "5 公分",
      "20 公分",
      "15 公分"
    ],
    "answer": 1,
    "kind": "findRadius",
    "explanation": "半徑＝圓周長 ÷ π ÷ 2＝10π ÷ π ÷ 2＝5 公分。"
  },
  {
    "id": 26,
    "question": "一個圓的圓周長是 14π 公分，半徑是多少？",
    "options": [
      "14 公分",
      "28 公分",
      "21 公分",
      "7 公分"
    ],
    "answer": 3,
    "kind": "findRadius",
    "explanation": "半徑＝圓周長 ÷ π ÷ 2＝14π ÷ π ÷ 2＝7 公分。"
  },
  {
    "id": 27,
    "question": "一個圓的圓周長是 8π 公分，半徑是多少？",
    "options": [
      "4 公分",
      "8 公分",
      "16 公分",
      "12 公分"
    ],
    "answer": 0,
    "kind": "findRadius",
    "explanation": "半徑＝圓周長 ÷ π ÷ 2＝8π ÷ π ÷ 2＝4 公分。"
  },
  {
    "id": 28,
    "question": "一個圓的圓周長是 18π 公分，半徑是多少？",
    "options": [
      "18 公分",
      "36 公分",
      "9 公分",
      "27 公分"
    ],
    "answer": 2,
    "kind": "findRadius",
    "explanation": "半徑＝圓周長 ÷ π ÷ 2＝18π ÷ π ÷ 2＝9 公分。"
  },
  {
    "id": 29,
    "question": "一個圓的圓周長是 24π 公分，半徑是多少？",
    "options": [
      "24 公分",
      "12 公分",
      "48 公分",
      "36 公分"
    ],
    "answer": 1,
    "kind": "findRadius",
    "explanation": "半徑＝圓周長 ÷ π ÷ 2＝24π ÷ π ÷ 2＝12 公分。"
  },
  {
    "id": 30,
    "question": "一個圓的圓周長是 30π 公分，半徑是多少？",
    "options": [
      "30 公分",
      "60 公分",
      "45 公分",
      "15 公分"
    ],
    "answer": 3,
    "kind": "findRadius",
    "explanation": "半徑＝圓周長 ÷ π ÷ 2＝30π ÷ π ÷ 2＝15 公分。"
  }
];
