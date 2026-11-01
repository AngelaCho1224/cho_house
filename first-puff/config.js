// =====================================================
//  第一口之前・設定檔（老師只需要改這個檔案）
// =====================================================
window.GAME_CONFIG = {

  // 1. Google Apps Script 部署後得到的「網頁應用程式網址」（結尾是 /exec）
  //    留空 "" 的話，遊戲照樣能玩，只是不會記錄到後台。
  API_URL: "",

  // 2. 班級：目前是 []，學生自己輸入班級（例如 701）。
  //    如果想改成下拉選單，就把班級寫進來，例如 ["701", "702", "703"]。
  CLASSES: [],

  // 3. 座號最多到幾號
  MAX_SEAT: 35,

  // 4. 換成自己的圖片：把圖片上傳到 GitHub 的 images 資料夾，再把檔名填進來。
  //    留空 "" 的地方會用原本的插圖。檔名大小寫要一模一樣。
  IMAGES: {
    mouth: "images/oral-warning-realistic.png", // 擬真口腔衛教示意圖
    pen: "images/device-clues.webp",
    street: "images/evening-street.webp",
    start: "images/classroom.webp",   // 開始畫面上半部的背景　　　（建議直式，約 1080×900）
    home:  "images/night-home.webp",   // 手機主畫面桌布　　　　　　（直式 9:19.5，約 1080×2340）
    day:   "images/school-hallway.webp",   // 每一天開場卡的背景　　　　（直式 9:19.5，會自動加暗讓字看得清楚）
    cram:  "images/betel-offer.webp",   // 補習班門口，學長遞檳榔　　（直式 4:5，約 1080×1350，人物放中間）
    dorm:  "images/dorm.webp",   // 戶外教育晚上的房間　　　　（直式 4:5，約 1080×1350，人物放中間）
    ad:    "images/social-ad.webp",   // 網紅的電子煙廣告貼文　　　（正方形或 6:5，約 1200×1000）

    // 角色頭像（正方形，約 512×512）
    avatars: {
      zhe:   "",  // 阿哲
      yu:    "",  // 宇恩
      qing:  "",  // 小晴
      lin:   "",  // 林老師（班導）
      mom:   "",  // 媽媽
      gpa:   "",  // 阿公
      kevin: "",  // 凱文學長
      wei:   ""   // 網紅威威
    }
  }

};
