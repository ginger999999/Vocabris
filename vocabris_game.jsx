import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RefreshCw, Volume2, Trophy, Settings, Type, BookOpen, Skull, ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

/**
 * MOCK DATA & CONSTANTS
 * 模擬單字庫與遊戲常數
 */

const WORD_DATABASE = {
  elementary: [
    // --- Animals (動物) ---
    { word: "BEAR", meaning: "熊", options: ["鳥", "豬", "獅子"] },
    { word: "BIRD", meaning: "鳥", options: ["魚", "貓", "狗"] },
    { word: "CAT", meaning: "貓", options: ["老虎", "老鼠", "兔子"] },
    { word: "CHICKEN", meaning: "雞", options: ["鴨子", "鵝", "火雞"] },
    { word: "DOG", meaning: "狗", options: ["貓", "狼", "狐狸"] },
    { word: "ELEPHANT", meaning: "大象", options: ["河馬", "犀牛", "長頸鹿"] },
    { word: "FISH", meaning: "魚", options: ["蝦子", "螃蟹", "烏龜"] },
    { word: "LION", meaning: "獅子", options: ["老虎", "豹", "熊"] },
    { word: "MONKEY", meaning: "猴子", options: ["猩猩", "人類", "松鼠"] },
    { word: "PIG", meaning: "豬", options: ["牛", "羊", "馬"] },
    { word: "RABBIT", meaning: "兔子", options: ["老鼠", "松鼠", "袋鼠"] },
    { word: "SNAKE", meaning: "蛇", options: ["蜥蜴", "鱷魚", "恐龍"] },
    { word: "TIGER", meaning: "老虎", options: ["獅子", "貓", "豹"] },
    { word: "ZEBRA", meaning: "斑馬", options: ["馬", "驢子", "鹿"] },
    
    // --- Food (食物) ---
    { word: "APPLE", meaning: "蘋果", options: ["香蕉", "橘子", "葡萄"] },
    { word: "BANANA", meaning: "香蕉", options: ["鳳梨", "西瓜", "木瓜"] },
    { word: "BREAD", meaning: "麵包", options: ["蛋糕", "餅乾", "糖果"] },
    { word: "CAKE", meaning: "蛋糕", options: ["麵包", "派", "布丁"] },
    { word: "EGG", meaning: "蛋", options: ["肉", "魚", "菜"] },
    { word: "HAMBURGER", meaning: "漢堡", options: ["三明治", "熱狗", "披薩"] },
    { word: "HOTDOG", meaning: "熱狗", options: ["香腸", "火腿", "培根"] },
    { word: "ICECREAM", meaning: "冰淇淋", options: ["冰棒", "雪糕", "聖代"] },
    { word: "JUICE", meaning: "果汁", options: ["牛奶", "咖啡", "茶"] },
    { word: "MILK", meaning: "牛奶", options: ["豆漿", "羊奶", "優酪乳"] },
    { word: "PIZZA", meaning: "披薩", options: ["義大利麵", "燉飯", "千層麵"] },
    { word: "RICE", meaning: "米飯", options: ["麵條", "冬粉", "米粉"] },
    { word: "SANDWICH", meaning: "三明治", options: ["漢堡", "吐司", "貝果"] },
    { word: "SOUP", meaning: "湯", options: ["粥", "火鍋", "燉菜"] },
    { word: "TEA", meaning: "茶", options: ["咖啡", "果汁", "汽水"] },
    { word: "WATER", meaning: "水", options: ["酒", "醋", "油"] },

    // --- Family (家庭) ---
    { word: "FATHER", meaning: "父親", options: ["母親", "兄弟", "姐妹"] },
    { word: "MOTHER", meaning: "母親", options: ["父親", "阿姨", "叔叔"] },
    { word: "BROTHER", meaning: "兄弟", options: ["姐妹", "朋友", "同學"] },
    { word: "SISTER", meaning: "姐妹", options: ["兄弟", "表親", "鄰居"] },
    { word: "GRANDPA", meaning: "爺爺/外公", options: ["奶奶", "爸爸", "叔叔"] },
    { word: "GRANDMA", meaning: "奶奶/外婆", options: ["爺爺", "媽媽", "阿姨"] },

    // --- School (學校) ---
    { word: "BAG", meaning: "袋子/書包", options: ["盒子", "籃子", "箱子"] },
    { word: "BOOK", meaning: "書", options: ["筆記本", "紙", "雜誌"] },
    { word: "CHAIR", meaning: "椅子", options: ["桌子", "沙發", "床"] },
    { word: "CLASS", meaning: "班級/課", options: ["學校", "操場", "辦公室"] },
    { word: "DESK", meaning: "書桌", options: ["椅子", "黑板", "電腦"] },
    { word: "ERASER", meaning: "橡皮擦", options: ["鉛筆", "尺", "膠水"] },
    { word: "MARKER", meaning: "麥克筆", options: ["蠟筆", "色鉛筆", "水彩"] },
    { word: "NOTEBOOK", meaning: "筆記本", options: ["課本", "字典", "聯絡簿"] },
    { word: "PEN", meaning: "原子筆", options: ["鉛筆", "毛筆", "鋼筆"] },
    { word: "PENCIL", meaning: "鉛筆", options: ["原子筆", "蠟筆", "粉筆"] },
    { word: "RULER", meaning: "尺", options: ["圓規", "量角器", "三角板"] },
    { word: "STUDENT", meaning: "學生", options: ["老師", "校長", "家長"] },
    { word: "TEACHER", meaning: "老師", options: ["學生", "教官", "護士"] },

    // --- Body (身體) ---
    { word: "EYE", meaning: "眼睛", options: ["耳朵", "鼻子", "嘴巴"] },
    { word: "HAND", meaning: "手", options: ["腳", "腿", "手臂"] },
    { word: "HEAD", meaning: "頭", options: ["脖子", "肩膀", "背"] },
    { word: "LEG", meaning: "腿", options: ["手", "腳掌", "膝蓋"] },
    { word: "MOUTH", meaning: "嘴巴", options: ["眼睛", "鼻子", "耳朵"] },
    { word: "NOSE", meaning: "鼻子", options: ["嘴巴", "眼睛", "耳朵"] },

    // --- Colors (顏色) ---
    { word: "BLACK", meaning: "黑色", options: ["白色", "灰色", "藍色"] },
    { word: "BLUE", meaning: "藍色", options: ["綠色", "紅色", "黃色"] },
    { word: "GREEN", meaning: "綠色", options: ["藍色", "黃色", "紫色"] },
    { word: "RED", meaning: "紅色", options: ["橘色", "粉紅色", "紫色"] },
    { word: "WHITE", meaning: "白色", options: ["黑色", "灰色", "銀色"] },
    { word: "YELLOW", meaning: "黃色", options: ["橘色", "綠色", "棕色"] },

    // --- Adjectives (形容詞) ---
    { word: "BIG", meaning: "大的", options: ["小的", "高的", "矮的"] },
    { word: "SMALL", meaning: "小的", options: ["大的", "長的", "短的"] },
    { word: "COOL", meaning: "涼爽的/酷", options: ["熱的", "溫暖的", "冷的"] },
    { word: "CUTE", meaning: "可愛的", options: ["醜陋的", "可怕的", "兇猛的"] },
    { word: "HAPPY", meaning: "快樂的", options: ["傷心的", "生氣的", "緊張的"] },
    { word: "HOT", meaning: "熱的", options: ["冷的", "涼的", "冰的"] },

    // --- Nature/Place (地點/自然) ---
    { word: "PARK", meaning: "公園", options: ["花園", "動物園", "遊樂園"] },
    { word: "ZOO", meaning: "動物園", options: ["公園", "博物館", "學校"] },
    { word: "HOME", meaning: "家", options: ["學校", "公司", "商店"] },
    { word: "FLOWER", meaning: "花", options: ["草", "樹", "葉子"] },
    { word: "TREE", meaning: "樹", options: ["花", "草", "森林"] }
  ],
  intermediate: [
    // --- Nouns (General) ---
    { word: "ACTUALLY", meaning: "其實/實際上", options: ["目前", "當然", "通常"] },
    { word: "ANOTHER", meaning: "另一個", options: ["其他的", "全部", "沒有"] },
    { word: "ACTIVITY", meaning: "活動", options: ["行動", "表演", "運動"] },
    { word: "BIRTHDAY", meaning: "生日", options: ["假期", "節日", "紀念日"] },
    { word: "BUSINESS", meaning: "商業/生意", options: ["忙碌", "公司", "工作"] },
    { word: "CHOCOLATE", meaning: "巧克力", options: ["糖果", "餅乾", "蛋糕"] },
    { word: "COMPUTER", meaning: "電腦", options: ["電視", "電話", "計算機"] },
    { word: "DAUGHTER", meaning: "女兒", options: ["兒子", "姐妹", "母親"] },
    { word: "DICTIONARY", meaning: "字典", options: ["課本", "小說", "雜誌"] },
    { word: "DINOSAUR", meaning: "恐龍", options: ["怪獸", "蜥蜴", "鱷魚"] },
    { word: "ENVELOPE", meaning: "信封", options: ["信紙", "郵票", "包裹"] },
    { word: "EVERYONE", meaning: "每個人", options: ["某人", "沒人", "任何人"] },
    { word: "FESTIVAL", meaning: "節日/慶典", options: ["假期", "週末", "派對"] },
    { word: "FOREIGNER", meaning: "外國人", options: ["陌生人", "鄰居", "朋友"] },
    { word: "HISTORY", meaning: "歷史", options: ["地理", "科學", "數學"] },
    { word: "HOLIDAY", meaning: "假期", options: ["週末", "工作日", "生日"] },
    { word: "HOSPITAL", meaning: "醫院", options: ["診所", "藥局", "學校"] },
    { word: "INTERNET", meaning: "網際網路", options: ["電話線", "電視網", "廣播"] },
    { word: "KITCHEN", meaning: "廚房", options: ["客廳", "臥室", "浴室"] },
    { word: "LANGUAGE", meaning: "語言", options: ["文字", "聲音", "溝通"] },
    { word: "MEDICINE", meaning: "藥", options: ["毒藥", "糖果", "維他命"] },
    { word: "MOUNTAIN", meaning: "山", options: ["海", "河", "湖"] },
    { word: "NEIGHBOR", meaning: "鄰居", options: ["朋友", "親戚", "陌生人"] },
    { word: "NEWSPAPER", meaning: "報紙", options: ["雜誌", "書籍", "信件"] },
    { word: "NOTEBOOK", meaning: "筆記本", options: ["課本", "字典", "日記"] },
    { word: "PICTURE", meaning: "圖片/照片", options: ["電影", "畫家", "相機"] },
    { word: "PROBLEM", meaning: "問題/麻煩", options: ["答案", "方法", "計畫"] },
    { word: "QUESTION", meaning: "問題", options: ["答案", "回答", "解釋"] },
    { word: "RESTAURANT", meaning: "餐廳", options: ["廚房", "商店", "市場"] },
    { word: "SANDWICH", meaning: "三明治", options: ["漢堡", "熱狗", "麵包"] },
    { word: "SHOULDER", meaning: "肩膀", options: ["手臂", "膝蓋", "脖子"] },
    { word: "STOMACH", meaning: "胃/肚子", options: ["心臟", "肺", "肝"] },
    { word: "SURPRISE", meaning: "驚喜", options: ["驚嚇", "禮物", "派對"] },
    { word: "TELEPHONE", meaning: "電話", options: ["手機", "電視", "電腦"] },
    { word: "TOMORROW", meaning: "明天", options: ["今天", "昨天", "後天"] },
    { word: "UMBRELLA", meaning: "雨傘", options: ["雨衣", "帽子", "手套"] },
    { word: "VACATION", meaning: "假期", options: ["旅行", "週末", "休息"] },
    { word: "VEGETABLE", meaning: "蔬菜", options: ["水果", "肉類", "穀物"] },
    { word: "YESTERDAY", meaning: "昨天", options: ["今天", "明天", "前天"] },

    // --- Adjectives & Verbs (Abstract) ---
    { word: "BEAUTIFUL", meaning: "美麗的", options: ["醜陋的", "可愛的", "漂亮的"] },
    { word: "BELIEVE", meaning: "相信", options: ["懷疑", "猜測", "知道"] },
    { word: "CELEBRATE", meaning: "慶祝", options: ["舉辦", "參加", "邀請"] },
    { word: "DANGEROUS", meaning: "危險的", options: ["安全的", "可怕的", "困難的"] },
    { word: "DELICIOUS", meaning: "美味的", options: ["噁心的", "難吃的", "普通的"] },
    { word: "DIFFERENT", meaning: "不同的", options: ["相同的", "類似的", "一樣的"] },
    { word: "EXCITING", meaning: "令人興奮的", options: ["無聊的", "有趣的", "可怕的"] },
    { word: "EXERCISE", meaning: "運動/練習", options: ["休息", "睡覺", "工作"] },
    { word: "EXPENSIVE", meaning: "昂貴的", options: ["便宜的", "免費的", "普通的"] },
    { word: "FAVORITE", meaning: "最喜愛的", options: ["討厭的", "普通的", "最好的"] },
    { word: "HEADACHE", meaning: "頭痛", options: ["牙痛", "胃痛", "背痛"] },
    { word: "IMPORTANT", meaning: "重要的", options: ["沒用的", "簡單的", "困難的"] },
    { word: "POPULAR", meaning: "受歡迎的", options: ["有名的", "討厭的", "孤單的"] },
    { word: "PRACTICE", meaning: "練習", options: ["比賽", "表演", "遊戲"] },
    { word: "REMEMBER", meaning: "記得", options: ["忘記", "思考", "學習"] },
    { word: "SWIMMING", meaning: "游泳", options: ["跑步", "跳舞", "爬山"] },
    { word: "TERRIBLE", meaning: "可怕的/糟糕的", options: ["美好的", "幸運的", "快樂的"] }
  ],
  advanced: [
    // --- High School Level (2000-3000 words) ---
    { word: "ACHIEVEMENT", meaning: "成就/達成", options: ["失敗", "嘗試", "起點"] },
    { word: "ADVERTISEMENT", meaning: "廣告", options: ["新聞", "節目", "電影"] },
    { word: "AGRICULTURE", meaning: "農業", options: ["工業", "商業", "科技"] },
    { word: "AMBASSADOR", meaning: "大使", options: ["總統", "將軍", "警察"] },
    { word: "ATMOSPHERE", meaning: "氣氛/大氣", options: ["天氣", "溫度", "濕度"] },
    { word: "BACKGROUND", meaning: "背景", options: ["前景", "地面", "天空"] },
    { word: "BRILLIANT", meaning: "傑出的/燦爛的", options: ["愚蠢的", "黑暗的", "普通的"] },
    { word: "CANDIDATE", meaning: "候選人", options: ["當選者", "投票者", "裁判"] },
    { word: "COLLECTION", meaning: "收集/收藏品", options: ["垃圾", "禮物", "商品"] },
    { word: "COMMERCIAL", meaning: "商業的", options: ["農業的", "工業的", "藝術的"] },
    { word: "COMMUNICATION", meaning: "溝通", options: ["吵架", "沈默", "誤會"] },
    { word: "COMPETITION", meaning: "競爭/比賽", options: ["合作", "和平", "友誼"] },
    { word: "CONCENTRATION", meaning: "專心/濃度", options: ["分心", "睡覺", "休息"] },
    { word: "CONFIDENCE", meaning: "信心", options: ["懷疑", "恐懼", "擔心"] },
    { word: "CONSEQUENCE", meaning: "結果/後果", options: ["原因", "起點", "過程"] },
    { word: "CONSTRUCTION", meaning: "建設/建造", options: ["破壞", "設計", "規劃"] },
    { word: "CONTRIBUTION", meaning: "貢獻", options: ["索取", "浪費", "破壞"] },
    { word: "CONVENIENCE", meaning: "方便/便利", options: ["麻煩", "困難", "阻礙"] },
    { word: "CONVERSATION", meaning: "對話/交談", options: ["演講", "獨白", "沈默"] },
    { word: "ENVIRONMENT", meaning: "環境", options: ["污染", "自然", "城市"] },
    { word: "INTELLIGENT", meaning: "聰明的", options: ["笨拙的", "懶惰的", "邪惡的"] },
    { word: "OPPORTUNITY", meaning: "機會", options: ["命運", "風險", "挑戰"] },
    { word: "PROFESSIONAL", meaning: "專業的", options: ["業餘的", "新手的", "隨便的"] },
    { word: "TECHNOLOGY", meaning: "科技", options: ["藝術", "歷史", "文學"] },
    { word: "TRADITIONAL", meaning: "傳統的", options: ["現代的", "創新的", "奇怪的"] },
    { word: "UNIVERSITY", meaning: "大學", options: ["高中", "國中", "小學"] },
    { word: "VOCABULARY", meaning: "字彙", options: ["文法", "發音", "聽力"] }
  ]
};

const GRID_ROWS = 18;
const GRID_COLS = 12; // Width of the board in "blocks"
const SPEED_SETTINGS = {
  slow: 1200,
  normal: 800,
  fast: 400
};

// Hook for custom intervals that can be paused
function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null) {
      const id = setInterval(() => savedCallback.current(), delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default function VocabrisApp() {
  // --- Game State ---
  const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, GAMEOVER
  const [level, setLevel] = useState('elementary');
  const [speedMode, setSpeedMode] = useState('normal');
  const [score, setScore] = useState(0);
  
  // Board State
  // grid represents the "dead" blocks (stacked). 0 = empty, string = letter content
  const [grid, setGrid] = useState(Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(null)));
  
  // Active Falling Word State
  const [currentWord, setCurrentWord] = useState(null); 
  // currentWord structure: 
  // { 
  //   data: { word, meaning, options }, 
  //   x: number, 
  //   y: number, 
  //   letters: [{char: 'A', status: 'filled'|'missing', input: ''}],
  //   phase: 'A' | 'B',
  //   wrongTimer: 0 // for locking input
  // }

  const [nextWordData, setNextWordData] = useState(null);
  const [inputLocked, setInputLocked] = useState(false);
  const [pauseDrop, setPauseDrop] = useState(false); // Temporary pause when typing

  // New State for Phase B Keyboard Navigation
  const [meaningCursorIndex, setMeaningCursorIndex] = useState(0);

  // Refs for audio and focus
  const gameContainerRef = useRef(null);
  
  // --- Focus Management (確保遊戲容器保持焦點) ---
  useEffect(() => {
    // 當遊戲開始或新單字生成後，確保遊戲容器獲得焦點，以便鍵盤輸入
    if (gameState === 'PLAYING' && gameContainerRef.current) {
        // 使用 setTimeout 確保在 React 渲染後執行，避免焦點被其他元素搶走
        const timeoutId = setTimeout(() => {
            if (gameContainerRef.current) {
                gameContainerRef.current.focus();
            }
        }, 100); 
        return () => clearTimeout(timeoutId);
    }
  }, [gameState, currentWord?.phase, currentWord?.data.word]);

  // --- Helpers ---

  const speakWord = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateWordObj = (lvl) => {
    const list = WORD_DATABASE[lvl];
    const item = list[Math.floor(Math.random() * list.length)];
    
    // Determine missing letters based on level
    let missingCountRange = [1, 2]; // Elementary: 1 or 2
    if (lvl === 'intermediate') missingCountRange = [2, 3]; // Intermediate: 2 or 3
    if (lvl === 'advanced') missingCountRange = [3, 4]; // Advanced: 3 or 4

    const wordLength = item.word.length;
    
    let minMissing = missingCountRange[0];
    let maxMissing = missingCountRange[1];

    // Cap maximum missing letters to ensure at least one letter is visible as a hint
    maxMissing = Math.min(maxMissing, wordLength - 1);
    
    minMissing = Math.min(minMissing, maxMissing);

    minMissing = Math.max(1, minMissing);

    const finalMin = Math.min(minMissing, maxMissing);
    const finalMax = Math.max(minMissing, maxMissing);
    
    const missingCount = finalMin === finalMax 
        ? finalMin 
        : Math.floor(Math.random() * (finalMax - finalMin + 1)) + finalMin;

    const indices = new Set();
    while(indices.size < missingCount && indices.size < wordLength) {
      indices.add(Math.floor(Math.random() * wordLength));
    }

    const letters = item.word.split('').map((char, index) => ({
      char,
      status: indices.has(index) ? 'missing' : 'filled',
      input: indices.has(index) ? '' : char
    }));

    return {
      data: { ...item, 
        // Shuffle options for Phase B
        currentOptions: [...item.options, item.meaning].sort(() => Math.random() - 0.5) 
      },
      x: Math.floor((GRID_COLS - letters.length) / 2),
      y: 0,
      letters,
      phase: 'A',
      wrongTimer: 0
    };
  };

  // --- Game Loop Logic ---

  const startGame = () => {
    setGrid(Array(GRID_ROWS).fill().map(() => Array(GRID_COLS).fill(null)));
    setScore(0);
    setGameState('PLAYING');
    setMeaningCursorIndex(0); // Reset cursor on game start

    // Generate the first word's data immediately for the Next Word panel
    const firstWord = generateWordObj(level);
    setNextWordData(generateWordObj(level)); // Prepare the second word
    spawnNextWord(firstWord);
  };

  const spawnNextWord = (overrideNext = null) => {
    const next = overrideNext || nextWordData;
    
    // Check game over on spawn
    if (checkCollision(next.x, next.y, next.letters.length, grid)) {
      setGameState('GAMEOVER');
      return;
    }

    setCurrentWord(next);
    speakWord(next.data.word);
    setMeaningCursorIndex(0); // Reset cursor when a new word spawns/transitions to phase A
    
    // Prepare subsequent word
    setNextWordData(generateWordObj(level));
  };

  const checkCollision = (x, y, length, currentGrid) => {
    if (y >= GRID_ROWS) return true; // Floor
    
    // Check against stacked blocks
    for (let i = 0; i < length; i++) {
      const checkX = x + i;
      if (checkX < 0 || checkX >= GRID_COLS) continue; 
      
      if (currentGrid[y] && currentGrid[y][checkX] !== null) {
        return true;
      }
    }
    return false;
  };

  // New function to handle horizontal movement
  const moveBlock = (dir) => {
    if (!currentWord || currentWord.phase !== 'A' || inputLocked) return;

    const newX = currentWord.x + dir;
    const length = currentWord.letters.length;

    // 1. Boundary Check
    if (newX < 0 || newX + length > GRID_COLS) return;

    // 2. Collision Check
    if (!checkCollision(newX, currentWord.y, length, grid)) {
        setCurrentWord(prev => ({ ...prev, x: newX }));
    }
  };

  const solidifyWord = () => {
    // Lock word into grid
    const newGrid = [...grid];
    const { x, y, letters } = currentWord;
    
    // If y < 0, it's game over (stacked out of screen)
    if (y < 0) {
      setGameState('GAMEOVER');
      return;
    }

    let isGameOver = false;
    letters.forEach((l, idx) => {
      const gridY = y;
      const gridX = x + idx;
      if (gridY >= 0 && gridY < GRID_ROWS && gridX >= 0 && gridX < GRID_COLS) {
        // Solidified blocks use the actual character
        newGrid[gridY][gridX] = l.char; 
      } else {
        isGameOver = true;
      }
    });

    if (isGameOver) {
      setGameState('GAMEOVER');
    } else {
      setGrid(newGrid);
      spawnNextWord();
    }
  };

  const gameTick = useCallback(() => {
    if (gameState !== 'PLAYING' || !currentWord) return;
    
    // Phase B pauses gravity
    if (currentWord.phase === 'B') return;
    
    // Input Error Penalty Freeze
    if (inputLocked) return;

    // Temporary Typing Pause
    if (pauseDrop) return;

    const nextY = currentWord.y + 1;
    
    if (checkCollision(currentWord.x, nextY, currentWord.letters.length, grid)) {
      // Hit bottom or stack
      solidifyWord();
    } else {
      setCurrentWord(prev => ({ ...prev, y: nextY }));
    }
  }, [gameState, currentWord, grid, inputLocked, pauseDrop, solidifyWord, checkCollision, spawnNextWord]);

  // Main Interval
  useInterval(gameTick, gameState === 'PLAYING' ? SPEED_SETTINGS[speedMode] : null);

  // Resume dropping after typing pause
  useEffect(() => {
    if (pauseDrop) {
      const timer = setTimeout(() => setPauseDrop(false), 2500); // 2.5s pause after typing
      return () => clearTimeout(timer);
    }
  }, [pauseDrop]);

  // Unlock input after penalty
  useEffect(() => {
    if (inputLocked) {
      const timer = setTimeout(() => setInputLocked(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [inputLocked]);

  // --- Interactions ---

  const handleKeyDown = (e) => {
    if (gameState !== 'PLAYING' || !currentWord || inputLocked) return;

    // 1. Movement Controls (Phase A only)
    if (currentWord.phase === 'A') {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        moveBlock(-1);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        moveBlock(1);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Soft drop: move down one step immediately
        gameTick(); 
        return;
      }
    }

    // 2. Spelling Controls (Phase A only)
    if (currentWord.phase === 'A') {
      const charCode = e.key.toUpperCase();
      // Only process A-Z key presses
      if (!/^[A-Z]$/.test(charCode)) return; 
      
      e.preventDefault(); // Prevent default browser behavior (like scrolling with space/keys)

      // Find first missing letter
      const firstMissingIndex = currentWord.letters.findIndex(l => l.status === 'missing' && l.input === '');
      
      if (firstMissingIndex !== -1) {
        const targetChar = currentWord.letters[firstMissingIndex].char;
        
        // Case-insensitive check (charCode is already uppercase)
        if (charCode === targetChar) { 
          const newLetters = [...currentWord.letters];
          newLetters[firstMissingIndex].input = charCode;
          
          // Trigger pause logic to give player time to type the next char
          setPauseDrop(true);

          // Check if Phase A Complete
          const isComplete = newLetters.every(l => l.input !== '');
          
          setCurrentWord(prev => ({
            ...prev,
            letters: newLetters,
            phase: isComplete ? 'B' : 'A'
          }));

          // If Phase A is complete, ensure the meaning cursor is set to the first option (0)
          if (isComplete) {
            setMeaningCursorIndex(0);
          }

        } else {
          // Wrong Input
          setInputLocked(true); // Red flash / freeze
          // Optional: Play error sound
        }
      }
    }

    // 3. Meaning Selection Controls (Phase B only)
    if (currentWord.phase === 'B' && currentWord.data.currentOptions) {
      const optionCount = currentWord.data.currentOptions.length;
      
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Cycle up: (0 - 1 + 4) % 4 = 3 (moves from 0 to last)
        setMeaningCursorIndex(prev => (prev - 1 + optionCount) % optionCount);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Cycle down: (0 + 1) % 4 = 1
        setMeaningCursorIndex(prev => (prev + 1) % optionCount);
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const selectedMeaning = currentWord.data.currentOptions[meaningCursorIndex];
        if (selectedMeaning) {
          handlePhaseBAnswer(selectedMeaning);
          // Reset cursor index after selection
          setMeaningCursorIndex(0);
        }
        return;
      }
    }
  };

  const handlePhaseBAnswer = (selectedMeaning) => {
    if (selectedMeaning === currentWord.data.meaning) {
      // Success!
      setScore(prev => prev + (currentWord.letters.length * 100));
      // Word disappears (Cleared) instead of stacking
      spawnNextWord();
    } else {
      // Failed Phase B -> Solidify as punishment
      solidifyWord();
    }
    // Always reset cursor on answer
    setMeaningCursorIndex(0);
  };

  // --- Rendering Helpers ---

  const renderGrid = () => {
    const displayGrid = grid.map(row => [...row]);

    // Overlay active word
    if (currentWord && gameState === 'PLAYING') {
      const { x, y, letters, phase } = currentWord;
      
      // (計算遊標位置的索引)
      const currentInputIndex = phase === 'A' 
          ? letters.findIndex(l => l.status === 'missing' && l.input === '') 
          : -1;

      // Render the word block even if y is negative (above the grid)
      letters.forEach((l, idx) => {
        const gridY = y;
        const gridX = x + idx;

        if (gridY >= 0 && gridY < GRID_ROWS && gridX >= 0 && gridX < GRID_COLS) {
          
          // (判斷是否為遊標位置)
          const isCursorPosition = (phase === 'A' && idx === currentInputIndex);

          displayGrid[gridY][gridX] = { 
            type: 'active', 
            char: l.status === 'filled' ? l.char : (l.input || '_'),
            isError: inputLocked && l.status === 'missing' && !l.input, // Visualize error on current hole
            isMissing: l.status === 'missing',
            isFilled: l.input !== '',
            isCursor: isCursorPosition // <-- 傳遞遊標狀態
          };
        }
      });
    }

    return (
      <div className="bg-gray-900 border-4 border-gray-700 p-1 relative"
           style={{ 
             display: 'grid', 
             gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
             gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
             aspectRatio: `${GRID_COLS}/${GRID_ROWS}`,
             height: '100%',
             maxHeight: '80vh'
           }}>
        {displayGrid.map((row, rIdx) => (
          row.map((cell, cIdx) => {
            let cellClass = "border border-gray-800 flex items-center justify-center text-sm font-bold ";
            
            if (cell === null) {
              cellClass += "bg-gray-950";
            } else if (typeof cell === 'string') {
              // Solidified Block (Garbage)
              cellClass += "bg-gray-600 text-gray-300 shadow-inner";
            } else if (cell.type === 'active') {
              // Active Falling Block
              if (cell.isError) {
                 cellClass += "bg-red-500 text-white animate-pulse";
              } else if (cell.isCursor) { // <-- 應用遊標樣式
                 cellClass += "bg-yellow-500 text-black ring-2 ring-offset-1 ring-offset-gray-950 ring-yellow-300 transition-all duration-150"; 
              } else if (cell.isMissing && !cell.isFilled) {
                 cellClass += "bg-yellow-900 text-yellow-300 border-yellow-500";
              } else if (cell.isFilled && cell.isMissing) {
                 cellClass += "bg-green-600 text-white"; // Just filled
              } else {
                 cellClass += "bg-blue-600 text-white"; // Default filled
              }
            }

            return (
              <div key={`${rIdx}-${cIdx}`} className={cellClass}>
                {cell && typeof cell !== 'string' ? cell.char : cell}
              </div>
            );
          })
        ))}
        
        {/* Helper Line for Phase B */}
        {currentWord?.phase === 'B' && (
           <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
             <div className="text-white text-xl font-bold tracking-widest animate-bounce">
               CHOOSE MEANING &rarr; (選擇釋義)
             </div>
           </div>
        )}
      </div>
    );
  };

  // --- UI Components ---

  const MenuScreen = () => (
    <div className="absolute inset-0 z-50 bg-gray-900 text-white flex flex-col items-center justify-center space-y-8 p-6">
      <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 tracking-tighter mb-4">
        VOCABRIS
      </h1>
      
      <div className="w-full max-w-md space-y-6 bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
        {/* Level Selection */}
        <div>
          <label className="flex items-center gap-2 text-blue-400 font-bold mb-3 uppercase text-sm tracking-wider">
            <BookOpen size={16} /> Select Difficulty (選擇難度)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['elementary', 'intermediate', 'advanced'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevel(lvl)}
                className={`p-2 text-sm rounded-lg border-2 transition-all ${
                  level === lvl 
                  ? 'border-blue-500 bg-blue-500/20 text-white' 
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Speed Selection */}
        <div>
          <label className="flex items-center gap-2 text-purple-400 font-bold mb-3 uppercase text-sm tracking-wider">
            <Settings size={16} /> Game Speed (遊戲速度)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['slow', 'normal', 'fast'].map((s) => (
              <button
                key={s}
                onClick={() => setSpeedMode(s)}
                className={`p-2 text-sm rounded-lg border-2 transition-all ${
                  speedMode === s 
                  ? 'border-purple-500 bg-purple-500/20 text-white' 
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={startGame}
          className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-black text-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-purple-900/50"
        >
          <Play fill="currentColor" /> START GAME
        </button>
      </div>
    </div>
  );

  const GameOverScreen = () => (
    <div className="absolute inset-0 z-50 bg-black/90 text-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <Skull size={64} className="text-red-500 mb-4" />
      <h2 className="text-4xl font-bold mb-2">GAME OVER (遊戲結束)</h2>
      <p className="text-gray-400 mb-8">The stack reached the top! (方塊堆到頂了!)</p>
      
      <div className="bg-gray-800 rounded-xl p-6 mb-8 w-64 border border-gray-700">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">Final Score (最終分數)</p>
        <p className="text-5xl font-mono text-yellow-400">{score}</p>
      </div>

      <button 
        onClick={() => setGameState('MENU')}
        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
      >
        <RefreshCw size={20} /> Play Again (再玩一次)
      </button>
    </div>
  );

  const VirtualKeyboard = () => (
    <div className="md:hidden w-full max-w-lg mx-auto mt-2">
       {/* Mobile Movement Controls */}
       <div className="flex justify-center gap-6 mb-3">
          <button 
             className="bg-gray-700 p-4 rounded-full active:bg-blue-600 active:scale-95 transition-all shadow-lg border border-gray-600"
             onTouchStart={(e) => { e.preventDefault(); moveBlock(-1); }}
             onClick={() => moveBlock(-1)}
          >
             <ArrowLeft size={24} className="text-white"/>
          </button>
          
          <button 
             className="bg-gray-700 p-4 rounded-full active:bg-blue-600 active:scale-95 transition-all shadow-lg border border-gray-600"
             onTouchStart={(e) => { e.preventDefault(); gameTick(); }}
             onClick={() => gameTick()}
          >
             <ArrowDown size={24} className="text-white"/>
          </button>

          <button 
             className="bg-gray-700 p-4 rounded-full active:bg-blue-600 active:scale-95 transition-all shadow-lg border border-gray-600"
             onTouchStart={(e) => { e.preventDefault(); moveBlock(1); }}
             onClick={() => moveBlock(1)}
          >
             <ArrowRight size={24} className="text-white"/>
          </button>
       </div>

       {/* Letter Keys */}
       <div className="grid grid-cols-10 gap-1">
          {"QWERTYUIOPASDFGHJKLZXCVBNM".split("").map((char) => (
            <button
              key={char}
              onClick={() => handleKeyDown({ key: char, preventDefault: () => {} })} // Mimic event object
              className="bg-gray-700 text-white p-2 rounded text-xs font-bold active:bg-blue-500 shadow border border-gray-600"
            >
              {char}
            </button>
          ))}
       </div>
    </div>
  );

  // --- Main Render ---

  return (
    <div 
      className="min-h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden select-none flex flex-col items-center justify-center"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      ref={gameContainerRef}
    >
      {gameState === 'MENU' && <MenuScreen />}
      {gameState === 'GAMEOVER' && <GameOverScreen />}

      {/* Main Game Layout */}
      <div className="w-full max-w-5xl h-[95vh] flex flex-col md:flex-row gap-4 p-4">
        
        {/* LEFT: Game Board (65%) */}
        <div className="flex-1 relative flex flex-col items-center justify-center bg-gray-900 rounded-xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Top Bar inside Board */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
             <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${inputLocked ? 'bg-red-500' : 'bg-green-500'}`}></span>
                <span className="text-xs font-mono text-gray-400">STATUS: {gameState}</span>
             </div>
             {gameState === 'PLAYING' && (
                <button onClick={() => setGameState('MENU')} className="text-xs border border-gray-600 px-2 py-1 rounded hover:bg-gray-800">EXIT</button>
             )}
          </div>
          
          {renderGrid()}
          
          {/* Mobile Keyboard below grid inside container if space permits, or outside */}
          <div className="md:hidden w-full px-2 pb-2">
             <VirtualKeyboard />
          </div>
        </div>

        {/* RIGHT: Sidebar (35%) */}
        <div className="w-full md:w-80 flex flex-col gap-4">
          
          {/* Stats Panel */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col gap-4">
            <div className="flex justify-between items-end border-b border-gray-800 pb-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Score (分數)</p>
                <div className="text-4xl font-mono text-blue-400">{score}</div>
              </div>
              <Trophy className="text-yellow-600 opacity-50" size={32} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Level (難度)</p>
                <div className="text-sm font-semibold text-gray-300 capitalize">{level}</div>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Speed (速度)</p>
                <div className="text-sm font-semibold text-gray-300 capitalize">{speedMode}</div>
              </div>
            </div>
          </div>

          {/* Next Word Panel */}
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl">
             <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Next Word (下一個單字)</p>
             <div className="bg-gray-950 p-4 rounded-lg border border-gray-800 text-center">
               <p className="text-xl font-bold text-gray-400 tracking-widest">
                 {nextWordData ? nextWordData.data.word.replace(/[A-Z]/g, '?') : '???'}
               </p>
               <p className="text-xs text-gray-600 mt-2">({nextWordData?.data.word.length} letters)</p>
             </div>
          </div>

          {/* Controls / Phase B Quiz Panel */}
          <div className="flex-1 bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-xl flex flex-col relative overflow-hidden">
            
            {/* Phase Indicator */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
               <div className={`h-full transition-all duration-300 ${currentWord?.phase === 'A' ? 'w-1/2 bg-blue-500' : 'w-full bg-green-500'}`}></div>
            </div>

            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2 mt-2">
               {currentWord?.phase === 'A' ? <Type size={16}/> : <BookOpen size={16}/>}
               {currentWord?.phase === 'A' ? 'Phase A: Spelling (階段 A: 拼字)' : 'Phase B: Meaning (階段 B: 釋義)'}
            </h3>

            <div className="flex-1 flex flex-col justify-center">
              {currentWord?.phase === 'A' ? (
                <div className="text-center space-y-4">
                  <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <p className="text-blue-300 text-sm">Type the missing letters! (輸入缺少的字母!)</p>
                    <p className="text-xs text-gray-500 mt-1">(Use Arrow Keys to Move - 使用方向鍵移動)</p>
                  </div>
                  {/* Visualizer for current word */}
                  <div className="flex flex-wrap justify-center gap-1">
                    {currentWord?.letters.map((l, i) => (
                      <span key={i} className={`w-6 h-8 flex items-center justify-center rounded ${l.status === 'missing' && l.input === '' ? 'bg-yellow-900/50 border border-yellow-500' : 'bg-gray-800 text-gray-400'}`}>
                        {l.status === 'filled' ? l.char : (l.input || '_')}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => speakWord(currentWord?.data.word)} className="text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto text-sm">
                    <Volume2 size={16}/> Replay Audio (重播發音)
                  </button>
                </div>
              ) : currentWord?.phase === 'B' ? (
                <div className="space-y-3 animate-in slide-in-from-right duration-300">
                  <p className="text-center text-xl font-bold text-white mb-4 tracking-widest">{currentWord.data.word}</p>
                  {currentWord.data.currentOptions.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handlePhaseBAnswer(opt)}
                      // Keyboard navigation highlight
                      className={`w-full p-4 text-left bg-gray-800 rounded transition-all text-sm md:text-base font-medium text-gray-200 border-l-4 
                        ${idx === meaningCursorIndex 
                          ? 'bg-purple-700/50 border-purple-400 ring-2 ring-purple-400' 
                          : 'hover:bg-gray-700 hover:border-l-4 hover:border-green-500 border-transparent'
                        }`}
                    >
                      {idx + 1}. {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-600 text-sm italic">
                  Waiting for game start... (等待遊戲開始...)
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}