/* ════════════════════════════════════════
    HELPER FUNCTIONS
   ════════════════════════════════════════ */

function applyThaiSegmentation() {
  const container = document.querySelector(".quiz-landing-container");
  if (!container) return;
  if (typeof Intl === "undefined" || !Intl.Segmenter) return;
  try {
    const segmenter = new Intl.Segmenter("th", { granularity: "word" });
    const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while (node = walk.nextNode()) {
      const parent = node.parentNode;
      if (parent && (parent.tagName === "SCRIPT" || parent.tagName === "STYLE" || parent.tagName === "NOSCRIPT")) {
        continue;
      }
      textNodes.push(node);
    }
    textNodes.forEach(node => {
      const originalText = node.nodeValue;
      if (!originalText || originalText.trim() === "" || originalText.includes("\u200b")) {
        return;
      }
      const segments = segmenter.segment(originalText);
      let newText = "";
      for (const segment of segments) {
        newText += segment.segment;
        if (segment.isWordLike) {
          newText += "\u200b";
        }
      }
      node.nodeValue = newText;
    });
  } catch (e) {
    console.error("Thai segmenter error:", e);
  }
}

function clearCard() {
  document.getElementById("main-title").textContent = "";
  document.getElementById("badge-title").textContent = "";
  document.getElementById("img-box").innerHTML = "";
  document.getElementById("desc-text").innerHTML = "";
  document.getElementById("action-area").innerHTML = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createStartButton(label, onClick, customStyle) {
  const area = document.getElementById("action-area");
  const btn = document.createElement("button");
  btn.className = "btn-start";
  btn.innerHTML = label;
  if (customStyle) {
    btn.style.cssText = customStyle;
  }
  btn.addEventListener("click", onClick);
  area.appendChild(btn);
  applyThaiSegmentation();
}

function cleanThaiTypography(text) {
  let cleanText = text;
  const safeWords = [
    "กลิ่นสาปอสูร",
    "อสูร",
    "เหมือนกันจ้า",
    "พวกเรา",
    "หลบหนี",
    "วิงเวียน",
  ];
  safeWords.forEach((word) => {
    const regex = new RegExp(word, "g");
    cleanText = cleanText.replace(
      regex,
      `<span style="white-space: nowrap;">${word}</span>`,
    );
  });
  return cleanText;
}

function createChoices(choicesArray) {
  const targetArea = document.getElementById("action-area");
  targetArea.innerHTML = "";

  choicesArray.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "btn-choice";
    btn.onclick = choice.go;

    const match = choice.label.match(
      /^([\u{1F300}-\u{1F64F}\u{1F680}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F1E6}-\u{1F1FF}].*?)\s(.*)$/u,
    );

    if (match) {
      const emoji = match[1];
      const textContent = cleanThaiTypography(match[2]);
      btn.innerHTML = `<span>${emoji}</span><span class="text-content-wrapper">${textContent}</span>`;
    } else {
      const textContent = cleanThaiTypography(choice.label);
      btn.innerHTML = `<span class="text-content-wrapper">${textContent}</span>`;
    }

    targetArea.appendChild(btn);
  });
  applyThaiSegmentation();
}

function createImg(src) {
  const img = document.createElement("img");
  img.src = src;
  document.getElementById("img-box").appendChild(img);
}

function createVideo(src) {
  const vid = document.createElement("video");
  vid.src = src;
  vid.autoplay = true;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  document.getElementById("img-box").appendChild(vid);
}

const LINKS = [
  {
    label: "🛒 สั่งซื้อผ่าน Shopee",
    url: " https://s.shopee.co.th/qhR1lHjO3?share_channel_code=6",
  },
  {
    label: "🎵 ดู POV ฮ่าๆได้บน TikTok",
    url: "https://www.tiktok.com/@freshd_official_store?_r=1&_t=ZS-97X8apEjIdr",
  },
  { label: "💬 สอบถามทาง Line OA", url: "https://lin.ee/pwj0Kb6" },
];

function createResultButtons() {
  const targetArea = document.getElementById("action-area");
  targetArea.innerHTML = "";

  LINKS.forEach(function (item) {
    const btn = document.createElement("button");
    btn.className = "btn-choice";
    btn.textContent = item.label;
    btn.style.background = "#fffbfa";
    btn.style.borderColor = "#f3d5cd";
    btn.addEventListener("click", function () {
      window.open(item.url, "_blank");
    });
    targetArea.appendChild(btn);
  });

  createStartButton(
    "📤 แชร์ผลลัพธ์",
    function () {
      if (navigator.share) {
        navigator.share({
          title: "สแกนกรรมกลิ่นเต่า",
          text: "มาลองเช็คกันเถอะ!",
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("คัดลอกลิงก์เรียบร้อยแล้วจ้า!");
      }
    },
    "font-size:18px; padding:10px 30px; background:#e8def8; border-color:#d0bcff; margin-top: 10px;",
  );

  createStartButton(
    "🔄 กลับหน้าแรก",
    function () {
      location.reload();
    },
    "font-size:18px; padding:10px 30px; background:#f0ece1; border-color:#dcd6c5; color:#706253;",
  );
}

/* ════════════════════════════════════════
    🚀 GAME ENGINE & SCENES
   ════════════════════════════════════════ */

function initGame() {
  clearCard();
  document.getElementById("main-title").textContent =
    "คุณเป็นคนประเภทไหนกันแน่นะ?";
  createVideo("video/cover.mp4");

  createStartButton("ลุยดิค้าบ...คุณน้า<br>🫵😎", showPage2);

  document.getElementById("desc-text").innerHTML = `
    <div class="landing-desc-wrapper">
      <div class="landing-paragraph" style="text-align: center; margin-bottom: 0;">
        🤢 ตื่นมาแล้วลืมฉีดสเปรย์... คุณน้าจะทำยังไงในวันนั้น? 
      </div>
      <div class="landing-paragraph" style="text-align: center; margin-bottom: 0;">
        ✨ <strong>มาเล่นเลย แล้วมาดูกันว่าลึกๆ แล้ว คุณน้าคือมนุษย์สายไหนกันแน่!?</strong>
      </div>
    </div>
  `;
}

initGame();

function showPage2() {
  clearCard();
  document.getElementById("main-title").textContent =
    "⏰ ตื่นสายเข้าให้แล้ว!";
  createImg("image_007/ตื่นสาย_png.png");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        <strong>06:58 น.</strong> นาฬิกาปลุกดัง 4 รอบแล้วแต่คุณน้ายังไม่มีทีท่าจะตื่น 😴
      </div>
      <div class="text-line">
        <strong>07:42 น.</strong> สะดุ้งตื่นตาตั้ง!<br>
         <strong>"ฉิบหาย!! สายแล้ววว"</strong><br>อาบน้ำเร็ว แต่งตัวปั้บ วิ่งออกจากบ้านแบบไม่ทันหายใจ<br>
         <strong>โดยที่... ลืมฉีดสเปรย์ระงับกลิ่นกาย!</strong> 🌺
      </div>
    </div>`;

  createStartButton("เดินทางขึ้นรถไฟฟ้า 🚄", showPage3);
}

function showPage3() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🚆ขบวนรถไฟสายระทึกขวัญ";
  createImg("image_007/bts.jpg");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        รถไฟแน่นจนขยับไม่ได้ แอร์ก็ดันเสียพอดี 🥵 จังหวะบังคับให้โหนราว แขนต้องยกขึ้น…<br><br>
        <strong>ทันใดนั้น!!!</strong><br><br>
        <strong>👤 มีพี่ชายข้างๆ สะกิดคุณน้า:</strong><br>
        "น้องครับ... กลิ่นเต่าจากรักแร้น้องโชยแรงมากเลยครับผม 😅"
      </div>
      <div class="text-line">
        <strong>💭 คุณน้า (คิดในใจอย่างเลิ่กลั่ก):</strong><br>
        "จะให้ทำยังไงได้ว่ะ รถมันเต็ม แอร์มันเสีย แล้วกูก็ลืมสเปรย์"<br>
        แต่มือก็ยังโหนต่อ เพราะไม่งั้นล้มแน่ 🙃
      </div>
    </div>
  `;

  createStartButton("วิกฤตนี้ คุณน้าจะแก้เกมยังไง? 😮‍💨", showPage4);
}

function showPage4() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🚨คนในตู้เริ่มหันมามองแล้ว จะเอาไงดี?!";
  document.getElementById("badge-title").textContent =
    "เลือกให้ตรงใจที่สุด";

  createChoices([
    {
      label: '😈 สวนไปดังๆ "กลิ่นเต่าพี่เหมือนกลิ่นสาปอสูรเหมือนกันจ้า!" ',
      go: showPage_2A,
    },
    {
      label:
        '🤝 ชวนหุบแขน "แอร์เสีย กลิ่นเราตีกันหมดแล้วพี่ หุบแขนหน่อยดิ๊!',
      go: showPage_2B,
    },
    {
      label: "🏃 ก้มหน้าแทรกตัวหนีไปโบกี้อื่น",
      go: showPage_2C,
    },
    {
      label: "🎭 แกล้งสลบ ล้มพับทิ้งดิ่งเลย",
      go: showPage_2D,
    },
    {
      label:
        '💰 ตะโกน "กลิ่นเต่าผมเอง! โอน 10 บาทถ้าไม่อยากเหม็น"',
      go: showPage_2E,
    },
  ]);
}

function showPage_2A() {
  clearCard();
  document.getElementById("main-title").textContent = "🔥สายบวกประชดกลับ";
  createImg("image_007/2A_2000x2000px.png");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        <strong>เกิดอะไรขึ้น:</strong><br>
        คุณน้าตอกกลับจนพี่ข้างๆ <strong>ไม่พอใจ ท้าประชันกลิ่นเต่าทันที 💥</strong><br>
        ยกแขนขึ้นพร้อมกันทั้งคู่…<br>
        คนทั้งตู้ได้กลิ่น <strong>ถอยห่าง 2 เมตรโดยอัตโนมัติ 😭</strong>
      </div>
    </div>
  `;

  createStartButton("ไปต่อดิครับน้า...อย่าไปหยอง!🫵😎", showQuiz_2A);
}

function showQuiz_2A() {
  clearCard();
  document.getElementById("main-title").textContent =
    "👁️ เปิดศึกดวลวงแขน! คนรอบข้างจ้องมาแล้ว จะทำไง?";
  document.getElementById("badge-title").textContent =
    "คุณน้าจะทำยังไงดี? ";
  createChoices([
    {
      label: "⚔️ ยอมรับคำท้า ยกแขนสุดชีวิต ปล่อยพลังเต่า!",
      go: showPageOffice,
    },
    {
      label:
        '📱 แถเอาตัวรอด "แฮ่ๆ ล้อเล่นพี่พอดีผมทำคอนเทนต์ TikTok อยู่"',
      go: showPageOffice,
    },
    {
      label: "🧪 ควักยาดมในกระเป๋ายื่นให้พี่เขา แล้วแยกย้าย",
      go: showPageOffice,
    },
    {
      label:
        "🏃 หนีดีกว่า! รอจังหวะประตูรถไฟฟ้า รีบพุ่งตัวออกจากสถานีทันที",
      go: showPageOffice,
    },
    {
      label: "😭 ร้องไห้กลางรถไฟฟ้าให้ทุกคนรู้สึกผิดที่เขามาล้อเลียนเรา",
      go: showPageOffice,
    },
  ]);
}

function showPage_2B() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🤝สายเนียนหาพวกสามัคคี";
  createImg("image_007/2B_2000x2000px.png");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        <strong>เกิดอะไรขึ้น:</strong><br> 
        เงียบกริบ! ทุกคนพร้อมใจสลายตัว ทิ้งผมยืนเด่นเป็นประธานสภาคนเดียวกลางขบวน โคตรว้าเหว่สัส! 🪐
      </div>
    </div>
  `;

  createStartButton(
    "เหงาจัดสัส...วาร์ปไปดูเหตุการณ์ถัดไปดิ๊ 💀",
    showQuiz_2B,
  );
}

function showQuiz_2B() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🪐โดนเทกลางตู้รถไฟ ตอนนี้เหงาจัดๆ จะแก้เขินยังไงดีครับน้า?";
  document.getElementById("badge-title").textContent =
    "ทุกคนหนีไปหมดแล้ว คุณน้ายืนเด่นเป็นดาวกลางตู้";

  createChoices([
    {
      label: "💃 โพสท่าถ่ายแบบโหนราวอย่างมั่นใจต่อไป",
      go: showPageOffice,
    },
    {
      label: "🎒 รีบเอากระเป๋าเป้อุ้มไว้ข้างหน้าเพื่อช่วยบังรักแร้",
      go: showPageOffice,
    },
    {
      label: "🏃 ก้มหน้าหยิบโทรศัพท์มาแกล้งพิมพ์คุยคนเดียวแก้เขิน",
      go: showPageOffice,
    },
    {
      label:
        "🛵 ทนสายตาพิฆาตไม่ไหว กดลงสถานีถัดไปแล้วเปลี่ยนไปนั่งวินแทน",
      go: showPageOffice,
    },
    {
      label:
        '🗣️ ตะโกนลั่น "หนีทำไมวะ! สูดหายใจลึกๆดิ กลิ่นนี้แหละคือความเป็นคน!"',
      go: showPageOffice,
    },
  ]);
}

function showPage_2C() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🏃‍♂️สายหน้าบางวิ่งหนีภัย";
  createImg("image_007/2C_2000x2000px.png");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        <strong>เกิดอะไรขึ้น:</strong><br> 
        หนีมาตู้แอร์เย็นๆ แอบถอดรองเท้ากะจะฟิน แต่ลืมว่าไม่ได้ใส่ถุงเท้า! กลิ่นอับระเบิดตูม คนข้างๆ ดีดตัวหนีทันที 3 คน อายสัส!
      </div>
    </div>
  `;

  createStartButton("เริ่มระยำตำบอนละ.. วาร์ปไปดูต่อดิ!🏃", showQuiz_2C);
}

function showQuiz_2C() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🦨 กรรมตามสนอง! บนก็พัง ล่างก็พัง วินาศสันตะโรขั้นสุด เอายังไงต่อดี!?";
  document.getElementById("badge-title").textContent =
    "กลิ่นเท้าระเบิด คนข้างๆ หนีไปหมดแล้ว!!";

  createChoices([
    {
      label:
        "🥾 แกล้งดมรองเท้าตัวเองแล้วทำหน้าเหม็น โยนขี้ให้รองเท้าผิด!",
      go: showPageOffice,
    },
    {
      label:
        "🗿 รีบยัดเท้ากลับ ขยิบนิ้วให้แน่น แล้วนั่งนิ่งเป็นรูปปั้นหิน!",
      go: showPageOffice,
    },
    {
      label: "🤫 เนียนๆ เตะรองเท้าตัวเองไปซ่อนใต้เบาะคนอื่นซะเลย!",
      go: showPageOffice,
    },
    {
      label:
        "🛵 ยอมแพ้โชคชะตา ใส่รองเท้าแล้วโดดลงไปซบพี่วินด่วน!",
      go: showPageOffice,
    },
    {
      label:
        "🤧 หยิบทิชชู่อุดจมูก แกล้งทำทรง กูก็ดมกลิ่นเท้าคนอื่นอยู่เหมือนกัน!",
      go: showPageOffice,
    },
  ]);
}

function showPage_2D() {
  clearCard();
  document.getElementById("main-title").textContent =
    "💤 สายออสการ์แกล้งสลบ";
  createImg("image_007/2D_2000x2000px.png");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        <strong>เกิดอะไรขึ้น:</strong><br>
        ล้มพับปุ๊บ พลเมืองดีพุ่งมาอุ้มปั๊บ! แต่ท่าไหนไม่รู้ หน้าพี่แกดันมุดเข้าใต้รักแร้เต็มๆ สูดกลิ่นเต่าเข้าไปเฮือกเดียวถึงกับหน้ามืด ตะโกนเรียกหารถพยาบาลด่วน!
      </div>
    </div>
  `;

  createStartButton(
    "สร้างเรื่องถึงขั้นส่งโรงบาล..ไปดูต่อดิ๊! 🏥",
    showQuiz_2D,
  );
}

function showQuiz_2D() {
  clearCard();
  document.getElementById("main-title").textContent =
    "😵 สลบพับคาอ้อมแขน พลเมืองดีกำลังจะผายปอด จังหวะนี้น้าจะยังไงต่อ?";
  document.getElementById("badge-title").textContent =
    ' คุณน้า "สลบ" อยู่ในอ้อมแขนพลเมืองดี...';

  createChoices([
    {
      label: '👀 เด้งตัวตื่นแก้เขิน: "ผมฟื้นแล้วพี่! สบายดีมากกก!"',
      go: showPageOffice,
    },
    {
      label: "🗿 แข็งใจแกล้งสลบต่อ ปล่อยให้รถไฟพาไปไหนก็ไป ",
      go: showPageOffice,
    },
    {
      label: '👻 แกล้งละเมอพึมพำ "กูเหม็นตัวเองจังวะ..."',
      go: showPageOffice,
    },
    {
      label:
        "💨 ลืมตามาสะบัดตัวหลุดจากพลเมืองดี แล้ววิ่งหนีลงรถไฟทันที!",
      go: showPageOffice,
    },
    {
      label:
        "🥴 แกล้งชักกระตุกเบา ๆ โยนขี้ให้โรคประจำตัว ไม่ใช่กลิ่นตัว!",
      go: showPageOffice,
    },
  ]);
}

function showPage_2E() {
  clearCard();
  document.getElementById("main-title").textContent =
    "💸 สายธุรกิจพลิกวิกฤต";
  createImg("image_007/2E_2000x2000px.png");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        <strong>เกิดอะไรขึ้น:</strong><br>
        ได้เงินจริงเฉย! ยินดีด้วยกับรายได้เสริม แต่ต้องแลกกับการโดนขึ้นบัญชีดำ "ผู้ก่อการร้ายทางกลิ่นเต่า" ตลอดชีพ! 💀
      </div>
    </div>
  `;

  createStartButton("รวยเฉย...กดวาร์ปไปนับเงินต่อ💸", showQuiz_2E);
}

function showQuiz_2E() {
  clearCard();
  document.getElementById("main-title").textContent =
    "💵 พ่อค้ากลิ่นเต่ามือทอง ได้เงินมาฉลองความเหม็นแล้ว เอายังไงต่อดีครับน้า?";
  document.getElementById("badge-title").textContent =
    "💰 เงินอยู่ในมือ สายตาพิฆาตปักอยู่ทุกทิศ";

  createChoices([
    {
      label:
        "😎 ยิ้มรับเงินแบบผู้ชนะ หุบแขนลง แล้วยืนเช็กยอดเงินฉ่ำๆ",
      go: showPageOffice,
    },
    {
      label:
        "🧴 โกยเงินวิ่งลงรถไฟ ดิ่งไปหาซื้อน้ำหอมตลาดนัดมาฉีดแก้ขัดด่วน!",
      go: showPageOffice,
    },
    {
      label: "🥷 เนียนเดินไปขู่ตู้ถัดไปต่อ หาเงินเพิ่มระลอกสอง!",
      go: showPageOffice,
    },
    {
      label: "👼 สำนึกผิดกะทันหัน เอาเงินไปหยอดตู้บริจาคล้างบาปซะเลย",
      go: showPageOffice,
    },
    {
      label:
        '🤑 แคปยอดเงินโพสต์เฟซอวด: "งานประจำมันเหนื่อย โชว์รักแร้ 2 นาทีรวยเลย"',
      go: showPageOffice,
    },
  ]);
}

function showPageOffice() {
  clearCard();
  document.getElementById("main-title").textContent =
    "💼 แต่ท้ายสุดคุณน้ารอดตายมาถึงที่ทำงานจนได้";
  createImg("image_007/office_2000x2000px.png");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        <strong>เกิดอะไรขึ้น:</strong><br> 
        ไม่ว่าจะเกิดอะไรขึ้นในตู้รถไฟ...คุณน้าฝ่าทุกสมรภูมิมาได้ เหมือนนักรบที่เพิ่งรอดสงคราม 😤
      </div>
    </div>
  `;

  createStartButton("เดินตัวลีบเข้าห้องประชุมต่อ💀", showPageMeeting);
}

function showPageMeeting() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🎁🆘ไอเทมกู้ชีพจากเพื่อนสนิท";

  document.getElementById("desc-text").innerHTML = `
      <div class="single-perfect-box" style="margin-bottom: 5px;">
          <div class="text-line">
          เข้าห้องประชุมปั้บ <strong>กลิ่นเต่าติดตามมาด้วย 💀</strong><br>
          ทุกคนในห้องประชุมเริ่ม <strong>ขมวดคิ้ว หันหาที่มาของกลิ่น…</strong><br>
          เพื่อนสนิทแอบยื่น <stro ng>FreshD Spray</strong> ให้โดยไม่พูดอะไร 😭
          </div>
      </div>

      <div style="text-align: center; margin: 15px 0;">
          <img src="image_007/freshD.png" style="max-width: 320px; height: auto; border-radius:24px;">
      </div>

      <div class="single-perfect-box">
          <div class="text-line" style="text-align: center;">
              ✨ <strong>FreshD Spray</strong> ✨<br>
              ขวดเดียวจบ ดับกลิ่นเต่า + กลิ่นเท้า บำรุงรักแร้เนียนใส ไม่ทิ้งคราบเหลืองบนเสื้อ อิอิ 💜
          </div>
      </div>
  `;

  createStartButton("ฉีด FreshD สู้ตาย!💨", showPageFreshDChoice);
}

function showPageFreshDChoice() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🚨 นาทีชีวิตกู้ชีพด้วย FreshD 🚨";
  document.getElementById("badge-title").textContent =
    "คุณน้าจะทำอย่างไรกับ FreshD ขวดนี้ดี? ";

  createChoices([
    {
      label:
        "<strong>✨ ฉีดหน้าห้องประชุมรัวๆ:</strong><br> ฉีดแม่งตรงนั้นแหละสัส! ชุบชีวิตเพื่อนร่วมงานให้ฟื้นคืนชีพจากความตายทันที!😅",
      go: showResult1,
    },
    {
      label:
        "<strong>✨ วิ่งหนีไปฉีดในห้องน้ำเงียบๆ:</strong><br> ฉีด FreshD รัวๆ แล้วเดินกลับมาด้วยความมั่นใจ😎",
      go: showResult2,
    },
    {
      label:
        "<strong>✨ เปิดขายให้เพื่อนร่วมงาน!:</strong><br> พลิกวิกฤตเป็นเม็ดเงินเอา FreshD แบ่งขายปั๊มละ 20 บาท💰",
      go: showResult3,
    },
    {
      label:
        "<strong>✨ เออๆ ลองอุดหนุนมึงสักขวดก็ได้วะ!:</strong><br> ยอมใจแบรนด์ FreshD แม่งขยี้ความซวยตั้งแต่รถไฟฟ้ายันเข้าห้องประชุม กดสั่งซื้อประชดโชคชะตาไปเลยดิวะ!",
      go: showResult4,
    },
    {
      label:
        '<strong>✨  เหมา 3 ขวด! ส่งควิซนี้ในกลุ่มไลน์:</strong><br> แท็กเพื่อนสนิททั้งกลุ่มแล้วบอก "กลิ่นเต่าไม่ใช่เรื่องตลกนะพวก!" แล้วเหมาสเปรย์ไปแจกทั้งกลุ่มเลย 😂',
      go: showResult5,
    },
  ]);
}

function showResult(badge, text1, text2, vidSrc) {
  clearCard();
  document.getElementById("main-title").textContent = `${badge}`;
  document.getElementById("badge-title").textContent = "";

  document.getElementById("desc-text").innerHTML = `
      <div class="single-perfect-box" style="margin-bottom: 5px;">
          <div class="text-line">
              📝 <strong>วิเคราะห์ตัวตน:</strong><br> ${text1}
          </div>
      </div>

      <div style="text-align: center; margin: 15px 0;" id="result-video-slot"></div>

      <div class="single-perfect-box">
          <div class="text-line">
              💡 <strong>💜 FreshD บอกว่า:</strong><br>${text2}
          </div>
      </div>
  `;

  const vid = document.createElement("video");
  vid.src = vidSrc;
  vid.autoplay = true;
  vid.loop = true;
  vid.muted = true;
  vid.playsInline = true;
  vid.style.maxWidth = "100%";
  vid.style.borderRadius = "20px";
  document.getElementById("result-video-slot").appendChild(vid);

  createResultButtons();
}

function showResult1() {
  showResult(
    "😇 นักบุญทุนน้อย",
    "คุณ​น้า​เป็น​คน​ใจดี​ ขี้​เกรงใจ​ ยอมรับ​ชะตา​กรรม​เพื่อ​ความ​สุข​สงบ​คุณ​น้า และเป็น​เพื่อน​​ที่​ทุก​คน​ควร​คบ​ไว้​ เพราะ​ถ้า​ไป​เที่ยว​ป่า​แล้ว​โดน​งู​กัด​ คุณ​น้า​จะ​เป็น​คน​แรก​ที่​ยอม​ใช้​ปาก​ดูด​พิษ​ให้​เพื่อน​แน่นอน​!",
    "ใจดีขนาดนี้ ให้ FreshD ช่วยแกบ้างเถอะ",
    "video/saint_1.mp4",
  );
}
function showResult2() {
  showResult(
    "🥷 นินจาสายห่วงสวย",
    "คุณน้าเป็น ทรงหล่อสวยดื้อเงียบ โลกจะพังช่างมัน แต่หลังต้องตรง ลุคต้องเนี๊ยบ! รักศักดิ์ศรี ยอมแอบไปฉีดเต่าดีกว่าให้ใครเห็น ไหวพริบดีเลิศ แต่อย่าให้ฟิวส์ขาดนะ พร้อมกดบล็อก ลบตัวตนหายสาบสูญทันที!",
    "มาดต้องเนี๊ยบ กลิ่นต้องหอม พก FreshD ไว้เลย",
    "video/ninja_1.mp4",
  );
}
function showResult3() {
  showResult(
    "🐯 เสือหิวสายตลบตะแลง",
    "หัวหมอขั้นสุด! ดีเอ็นเอพ่อค้าหน้าเงินเข้าเส้น ขนาดตัวเองทำเรื่องวินาศสันตะโร ยังหาช่องโกยผลประโยชน์ได้! ฉลาดแกมโกง เอาตัวรอดเก่งระดับสิบ ชาตินี้ไม่มีวันอดตาย แต่อาจโดนรุมกระทืบตายก่อนรวย!",
    "ฉลาดขนาดนี้ รู้จักลงทุนกับ FreshD ก่อนใครสิ",
    "video/tiger_1.mp4",
  );
}
function showResult4() {
  showResult(
    "💸 สายเปย์ขี้ใจอ่อน",
    "ปากแซ่บแต่ใจดีเว่อร์! ชอบบ่นแก้เขิน ทำทรงรำคาญ แต่ลึก ๆ คือโคตรเท่ พร้อมเปย์ตบรางวัลให้ความทุ่มเททีมงาน โคตรน่ารัก ซึนเดเระของแท้! (ยิ่งมี FreshD ยิ่งน่ารัก)",
    "เปย์คนอื่นตลอด ถึงเวลาเปย์ตัวเองบ้างแล้ว FreshD ขวดเดียวคุ้มกว่าเสียเพื่อนทั้งชีวิต 💜",
    "video/softpay_1.mp4",
  );
}
function showResult5() {
  showResult(
    "😎 หัวโจกสายปั่น",
    "ตัวตึงสายลากเพื่อนลงนรก! แทนที่จะดมคนเดียว ดันลากทั้งแก๊งมาดมกลิ่นเต่าด้วยกัน รักเพื่อนนะ...แต่รักที่จะแกล้งและประจานเพื่อนมากกว่า! เป็นคนตลกธรรมชาติ มนุษย์สัมพันธ์ดีเลิศ แชร์อะไรลงกลุ่มไลน์คือไฟลุกทันที!🔥",
    "จะปั่นเพื่อน ตัวเองต้องหอมก่อนนะ ไม่งั้นเพื่อนมันปั่นกลับ พก FreshD ไว้ก่อนเลย 🔥",
    "video/boss_1.mp4",
  );
}
