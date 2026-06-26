/* ════════════════════════════════════════
    HELPER FUNCTIONS
   ════════════════════════════════════════ */

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
      <div class="landing-paragraph">
        🤢 <strong>หากคุณน้าตื่นมาในเช้าวันหนึ่ง... แล้วพบว่าชีวิตต้องเผชิญกับวิกฤตกลิ่นตัว?</strong>
      </div>
      <div class="landing-paragraph">
        เกมแนวคิดแบบขำขันนี้ จะพาทุกคนไปสมมติตัวเองในสถานการณ์จำลองสุดระทึกขวัญบนรถไฟฟ้าที่แน่นขนัด ขยับตัวไปไหนไม่ได้ แถมยังมีสายตาพิฆาตคอยจ้องมอง!
      </div>
      <div class="landing-paragraph">
        ผ่านคำถามสถานการณ์น่ารักปนฮา ที่จะช่วยขุดค้นสันดานดิบและตัวตนในมุมมืดมุมสว่างของคุณน้าออกมาอย่างละเอียดยิบ พร้อมจับคู่บุคลิกภาพของคุณน้าเข้ากับคาแรคเตอร์สุดน่ารักหรือยัง!!!
      </div>
      <div class="landing-paragraph" style="text-align: center; margin-bottom: 0;">
        ✨ <strong>มาเล่นเลย แล้วมาดูกันว่าลึก ๆ แล้ว คุณน้าคือมนุษย์สายไหนกันแน่!?</strong>
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
        <strong>06:58 น.</strong> นาฬิกาปลุกดังมาแล้ว 4 รอบ แต่คุณน้ายังคงนอนนิ่งประหนึ่งหินผาจำศีล 💭
      </div>
      <div class="text-line">
        <strong>07:42 น.</strong> สะดุ้งตื่นตาตั้ง!<br>
         <strong>"ฉิบหาย!! สายแล้ววว"</strong><br>คุณน้าอาบน้ำด้วยความเร็วแสง แต่งตัวลุกลี้ลุกลนเหมือนคนตาบอด แล้ววิ่งออกจากบ้านทันที<br>
         <strong>โดยที่... ลืมฉีดสเปรย์ระงับกลิ่นกาย!</strong> 🌺
      </div>
    </div>`;

  createStartButton("เดินทางขึ้นรถไฟฟ้า 🚄", showPage3);
}

function showPage3() {
  clearCard();
  document.getElementById("main-title").textContent =
    "ขบวนรถไฟสายระทึกขวัญ";
  createImg("image_007/bts.jpg");

  document.getElementById("desc-text").innerHTML = `
    <div class="single-perfect-box">
      <div class="text-line">
        ก้าวขาขึ้นรถไฟฟ้าปุ๊บ.. ช็อตฟีลปั๊บ!แอร์ดันมาเสียในวันที่คนแน่นเป็นปลากระป๋อง ขยับไม่ได้ แถมสเต็ปบังคับต้องชูแขนโหนราวระทึกขวัญไปอีกสัส!!<br><br>
        <strong>ทันใดนั้น!!!</strong><br><br>
        <strong>👤 มีพี่ชายข้างๆ สะกิดคุณน้า:</strong><br>
        "น้องครับ... กลิ่นเต่าจากรักแร้น้องโชยแรงมากเลยครับผม 😅"
      </div>
      <div class="text-line">
        <strong>💭 คุณน้า (คิดในใจอย่างเลิ่กลั่ก):</strong><br>
        "อ้าวพี่... แต่กลิ่นเต่าพี่และทุกคนรอบตัวก็โชยสวนกลับมาแรงไม่แพ้กันเลยนิหว่า เหม็นเหมือนกันทั้งขบวนนั้นแหละ! 💀"
      </div>
    </div>
  `;

  createStartButton("วิกฤตนี้ คุณน้าจะแก้เกมยังไง? 😮‍💨", showPage4);
}

function showPage4() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🚨 สถานการณ์บีบคั้น คนเริ่มหันมามองคุณน้าเป็นตาเดียวแล้ว เอาไงดีครับน้า!";
  document.getElementById("badge-title").textContent =
    "เลือกข้อที่ตรงใจคุณน้ามากที่สุดและเป็นตัวเองสุดๆ";

  createChoices([
    {
      label: '😈 สวนไปดังๆ "กลิ่นเต่าพี่เหมือนกลิ่นสาปอสูรหมือนกันจ้า!" ',
      go: showPage_2A,
    },
    {
      label:
        '🤝 หันไปคุยกับคนรอบข้าง "เห็นไหมแอร์เสียจนกลิ่นพวกเราตีกันหมดแล้ว มาหุบแขนเถอะพี่"',
      go: showPage_2B,
    },
    {
      label: "🏃 รีบหุบรักแร้ ก้มหน้าเดินแทรกตัวหนีไปโบกี้อื่นทันที",
      go: showPage_2C,
    },
    {
      label: "🎭 แกล้งทำเป็นหน้ามืดวิงเวียน ทิ้งดิ่งล้มพับสลบไปเลย",
      go: showPage_2D,
    },
    {
      label:
        '💰 ตะโกนบอกคนทั้งตู้ "ใช่ครับกลิ่นเต่าผมเอง! ใครไม่อยากเหม็นโอนตังมา 10 บาท"',
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
        <strong>ผลลัพธ์:</strong> 
        คุณน้าตอกกลับจนพี่ชายท้าเปิดศึกดวลวงแขนพิฆาต! คนรอบตัวนี่ถึงกับผงะหนีแตกตื่น ทิ้งระยะห่างทำเป็นพื้นที่เซฟโซนโล่ง ๆ รัศมี 2 เมตรโดยมิได้นัดหมาย... อานุภาพโคตรทรงพลัง
      </div>
    </div>
  `;

  createStartButton("ไปต่อดิครับน้า..>อย่าไปหยอง!🫵😎", showQuiz_2A);
}

function showQuiz_2A() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🥊เปิดศึกดวลวงแขน! คนรอบข้างจ้องตาแป๋ว สถานการณ์นี้คุณน้าจะทำอย่างไรดี?";
  document.getElementById("badge-title").textContent =
    "เลือกตอบโต้พี่ชายคนนั้นด่วนเลยครับ! ";
  createChoices([
    {
      label: "⚔️ ยอมรับคำท้า ยกแขนสุดชีวิต ปล่อยพลังเต่า!",
      go: showPageOffice,
    },
    {
      label:
        '📱 แถเอาตัวรอด "แฮ่ๆ ล้อเล่นพี่ พอดีผมทำคอนเทนต์ TikTok อยู่"',
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
        <strong>ผลลัพธ์:</strong> 
        เงียบกริบ... ไม่มีใครร่วมมือด้วยเลยสัส! ทุกคนพร้อมใจกันวาร์ปเบียดหนีห่างจนคุณน้ายืนเด่นเป็นประธานสภาเดี่ยวกลางตู้ขบวนรถไฟ โคตรว้าเหว่จัด ๆ !! 🪐
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
    "🪐โดนเทกลางตู้รถไฟ ตอนนี้เหงาจัด ๆ จะแก้เขินยังไงดีครับน้า?";
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
        '🗣️ ตะโกนเรียกสติทุกคน "หนีทำไม! สูดหายใจลึกๆดิ กลิ่นนี้แหละคือความเป็นคน!"',
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
        <strong>ผลลัพธ์:</strong> 
        ย้ายมาตู้ใหม่แอร์เย็นฉ่ำ เลยแอบถอดรองเท้าหวังระบายลม แต่ลืมไปว่าไม่ได้ใส่ถุงเท้ามา! กลิ่นเท้าเลยระเบิดซ้ำสอง คนลุกหนีทันที 3 คน!
      </div>
    </div>
  `;

  createStartButton("เริ่มระยำตำบอนละ.. วาร์ปไปดูต่อดิ!🏃", showQuiz_2C);
}

function showQuiz_2C() {
  clearCard();
  document.getElementById("main-title").textContent =
    "🦨 กรรมตามสนองระเบิดสอง สถานการณ์เลวร้ายขั้นสุด กลิ่นล่างก็มา กลิ่นบนก็มี ดับเครื่องชนยังไงต่อดี!";
  document.getElementById("badge-title").textContent =
    "กลิ่นเท้าระเบิด คนข้างๆ หนีไปหมดแล้ว!!";

  createChoices([
    {
      label:
        "🥾 แกล้งดมรองเท้าตัวเองแล้วทำหน้าเหม็น โยนขี้ให้เป็นความผิดของรองเท้า",
      go: showPageOffice,
    },
    {
      label:
        "🗿 รีบยัดเท้ากลับรองเท้า ขยับนิ้วเท้าแน่นๆ นั่งนิ่งเหมือนหิน",
      go: showPageOffice,
    },
    {
      label: "🤫 แกล้งเฉไฉเตะรองเท้าตัวเองไปซ่อนใต้เบาะคนอื่น",
      go: showPageOffice,
    },
    {
      label:
        "🛵 ยอมแพ้กับโชคชะตา รีบใส่รองเท้าแล้วเดินลงรถไฟฟ้าไปหาวินมอเตอร์ไซค์",
      go: showPageOffice,
    },
    {
      label:
        "🤧 หยิบทิชชู่มาอุดจมูกตัวเอง แกล้งทำเป็นว่ากูก็ดมกลิ่นเท้าคนอื่นอยู่เหมือนกัน",
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
        <strong>ผลลัพธ์:</strong> 
        ล้มพับไปปุ๊บพลเมืองดีรีบพุ่งมาอุ้มทันที! แต่อุ้มท่าไหนไม่รู้ หน้าพี่แกดันมาฝังอยู่ใต้รักแร้คุณน้าเต็มๆ สูดเข้าไปเฮือกเดียวถึงกับหน้ามืด ตะโกนเรียกหารถพยาบาลด่วน!
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
      label: '👀 เด้งตัวตื่นตระหนกแก้เขิน "ผมฟื้นแล้วพี่! สบายดีมากก!" ',
      go: showPageOffice,
    },
    {
      label: "🗿 แข็งใจแกล้งสลบต่อ ปล่อยให้รถไฟพาไปไหนก็ไป ",
      go: showPageOffice,
    },
    {
      label: '👻 แกล้งละเมอพูดพึมพำ "กูเหม็นตัวเองจังวะ..."',
      go: showPageOffice,
    },
    {
      label:
        "💨 ลืมตาขึ้นมาสะบัดตัวหลุดจากพลเมืองดี แล้ววิ่งหนีลงรถไฟทันที ",
      go: showPageOffice,
    },
    {
      label:
        "🥴 แกล้งชักกระตุกเบาๆ เพื่อให้คนคิดว่าเป็นโรคประจำตัว ไม่ใช่กลิ่นตัว",
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
        <strong>ผลลัพธ์:</strong> 
        มีคนยอมโอนจริงได้มาหลายบาท! ยินดีด้วยคุณน้ามีรายได้เสริมแล้ว แต่ต้องแลกกับการโดนคนทั้งขบวนจดจำใบหน้าในฐานะผู้ก่อการร้ายทางกลิ่นเต่า
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
        "😎 ยิ้มรับเงินอย่างผู้ชนะ หุบแขนลง แล้วยืนมองยอดเงินอย่างมีความสุข ",
      go: showPageOffice,
    },
    {
      label:
        "🧴 เอาเงินที่ได้ วิ่งลงรถไฟไปหาซื้อน้ำหอมตลาดนัดมาฉีดแก้ขัด",
      go: showPageOffice,
    },
    {
      label: "🥷 แกล้งทำเนียนเดินไปขู่ตู้ถัดไปต่อเพื่อหาเงินเพิ่ม",
      go: showPageOffice,
    },
    {
      label: "👼 รู้สึกผิดทันทีเอาเงินนั้นหยอดตู้บริจาคเพื่อล้างบาป",
      go: showPageOffice,
    },
    {
      label:
        '🤑 ควักโทรศัพท์ขึ้นมาอวดรูปเงินโชว์ลงเฟซบุ๊ก "ทำงานประจำมันเหนื่อย โชว์รักแร้ 2 นาทีรวยเลย" ',
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
        <strong>ผลลัพธ์:</strong> 
        ไม่ว่าจะเกิดอะไรขึ้นก็ตาม... ในที่สุดคุณน้าก็ลากสังขารอันสะบักสะบอม ผ่านสมรภูมิกลิ่นชีวภาพมาถึงโต๊ะทำงานจนได้ สภาพเหมือนเพิ่งรอดมาจากสงครามโลก 🫠
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
              ในที่สุดคุณน้าก็โดนบอสลากเข้าห้องประชุมแอร์ปิดทึบจนได้! จังหวะนี้กลิ่นรวมมิตรคอมโบ้นรกทั้ง <strong>รักแร้เหงื่อโชก</strong> + <strong>กลิ่นเท้าลืมใส่ถุงเท้า</strong> มันเริ่มระเบิดอบอวลจนบอสหน้ามืด หน้าสลับสี ทนไม่ไหวอ้าปากจะไล่คุณน้าออกนอกห้องสัสๆ! แต่ทันใดนั้น.. ไอ้มิตรแท้เพื่อนสนิทก็ทำทรงเท่ โยนสเปรย์ขวดหนึ่งข้ามโต๊ะมาให้คุณน้านิ่งๆ! มันคือ <strong>FreshD</strong>
          </div>
      </div>

      <div style="text-align: center; margin: 15px 0;">
          <img src="image_007/freshD.png" style="max-width: 320px; height: auto; border-radius:24px;">
      </div>

      <div class="single-perfect-box">
          <div class="text-line" style="text-align: center;">
              ✨ <strong>FreshD Spray</strong> ✨<br>
              ขวดเดียวจบ ดับกลิ่นเต่า + กลิ่นเท้า บำรุงรักแร้เนียนใส ไม่ทิ้งคราบเหลืองบนเสื้อ 💜
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
        "<strong>✨ ฉีดหน้าห้องประชุมรัวๆ:</strong><br> ฉีดแม่งตรงนั้นแหละสัส! ดับเบิ้ลแท็บทั้งรักแร้ ทั้งเท้า ทั้งอากาศรอบตัว ชุบชีวิตเพื่อนร่วมงานและบอสให้ฟื้นคืนชีพจากความตายทันที!",
      go: showResult1,
    },
    {
      label:
        "<strong>✨ วิ่งหนีไปฉีดในห้องน้ำเงียบๆ:</strong><br> ขอหลบไปซับน้ำตาบวกตั้งหลักในเซฟโซนแป๊บ เช็ดเหงื่อ เช็ดซากเท้า แล้วกดยัด FreshD รัว ๆ ให้มั่นใจหน้าเด้งไข่สั่น ค่อยกลับมาสู้ใหม่!",
      go: showResult2,
    },
    {
      label:
        "<strong>✨ เปิดขายให้เพื่อนร่วมงาน!:</strong><br> ในเมื่อตอนนี้พวกมึงกำลังจะตายเพราะกลิ่นกู งั้นกูพลิกวิกฤตเป็นเม็ดเงิน เอา FreshD มาเปิดฉีดพ่นแบ่งขายในห้องประชุมซะเลย สูดดมทีละปั๊ม ปั๊มละ 20 โอนไวตู้ไม่แตก รวยซ้ำรวยซ้อนสัส ๆ!",
      go: showResult3,
    },
    {
      label:
        "<strong>✨ เออๆ ลองซื้ออุดหนุนมึงสักขวดก็ได้วะ!:</strong><br> ยอมใจแบรนด์ FreshD ที่แม่งอุตส่าห์เขียนเนื้อเรื่องแตกแขนง ขยี้ความซวยกูตั้งแต่นั่งรถไฟฟ้ายันเข้าห้องประชุมขนาดนี้ กดสั่งซื้อในตะกร้าประชดโชคชะตาไปเลยดิวะ!",
      go: showResult4,
    },
    {
      label:
        '<strong>✨ เหมา 3 ขวด! ส่งควิซนี้ประจานในกลุ่มไลน์เพื่อนด่วน!:</strong><br> แท็กเพื่อนสนิททั้งกลุ่มแล้วตะโกนบอก "พวกมึงมาเล่นด่านนี้เลยสัส กลิ่นเท้าในเรื่องเหมือนของมึงเป๊ะ!" พร้อมเหมาสเปรย์ไปแจกพวกมันอุดรูจมูกคนละขวด!',
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
              📝 <strong>วิเคราะห์ตัวตน:</strong> ${text1}
          </div>
      </div>

      <div style="text-align: center; margin: 15px 0;" id="result-video-slot"></div>

      <div class="single-perfect-box">
          <div class="text-line">
              💡 <strong>คำแนะนำกรรมกลิ่น:</strong> ${text2}
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
    "คุณน้าเป็นคนใจดี ขี้เกรงใจ ยอมรับชะตากรรมเพื่อความสุขสงบคุณน้าเป็นคนดีศรีสังคม มีสัญชาตญาณนักกู้ภัยสูงมาก เอะอะชอบเอาความทุกข์ของคนอื่นมาแบกไว้เอง ตัวเองซวยอยู่แท้ๆ แต่พอได้ของดีมาปุ๊บ รีบแผ่เมตตาฉีดแจกจ่ายทันที เป็นเพื่อนประเภทที่ทุกคนควรคบไว้ เพราะถ้าไปเที่ยวป่าแล้วโดนงูกัด คุณน้าจะเป็นคนแรกที่ยอมใช้ปากดูดพิษให้เพื่อนแน่นอน!",
    "ควรพก FreshD ไว้ฉีดเพื่อเพิ่มความมั่นใจเต็มร้อยในชีวิตประจำวัน",
    "video/saint_1.mp4",
  );
}
function showResult2() {
  showResult(
    "🥷 นินจาสายห่วงสวย",
    "คุณน้าเป็นพวกสมบูรณ์แบบ (Perfectionist) ที่แอบดื้อเงียบ ต่อให้สถานการณ์รอบตัวจะวินาศสันตะโรแค่ไหน สันหลังคุณน้าต้องตรง และภาพลักษณ์คุณต้องเป๊ะ! คุณน้ายอมเสียเวลาวิ่งไปแอบดีกว่าให้ใครเห็นตอนกำลังฉีดรักแร้ เป็นคนไหวพริบดี เอาตัวรอดในสังคมเก่ง แต่อย่าให้ฟิวส์ขาดนะ เพราะคุณน้าพร้อมจะบล็อกทุกคนหายไปในกลีบเมฆทันที",
    "ฉีดระงับกลิ่นก่อนออกจากบ้านทุกเช้าจะช่วยรักษามาดนินจาของคุณไว้ได้",
    "video/ninja_1.mp4",
  );
}
function showResult3() {
  showResult(
    "🐯 เสือหิวสายตลบตะแลง",
    "หัวหมอขั้นสุดยอด! คุณน้าคือมนุษย์ประเภทที่มีดีเอ็นเอของพ่อค้าหน้าเงินไหลเวียนอยู่ในกระแสเลือด ขนาดตัวเองเป็นต้นเหตุของมหันตภัยกลิ่น ยังมีหน้าจะมาหาผลประโยชน์จากลมหายใจเพื่อนอีก! เป็นคนฉลาดแกมโกง เอาตัวรอดเก่งระดับสิบ ไม่มีวันอดตาย แต่อาจจะโดนเพื่อนรุมสกรัมตายก่อนได้รวย",
    "ลองแนะนำ FreshD ให้เพื่อน ๆ ด้วยความจริงใจ จะเพิ่มเสน่ห์ขึ้นอีกเป็นกอง",
    "video/tiger_1.mp4",
  );
}
function showResult4() {
  showResult(
    "💸 สายเปย์ขี้ใจอ่อน",
    "ปากแข็งแต่ใจดีมาก! คุณน้าชอบบ่นโน่นบ่นนี่ ทำเป็นเหมือนจะรำคาญ แต่ลึกๆ คุณเป็นคนโคตรเท่ อารมณ์ดี และแพ้ทางความพยายามของคนอื่น คุณน้ามองว่าการซื้อครั้งนี้ไม่ใช่แค่ซื้อสเปรย์ฉีดรักแร้ แต่เป็นการซื้อความบันเทิงและให้รางวัลความทุ่มเทของทีมงาน เป็นคนน่ารักที่ใครอยู่ด้วยก็สบายใจ (โดยเฉพาะถ้ามี FreshD อยู่ในมือ)",
    "เปย์ตัวเองด้วยสเปรย์ดี ๆ สักขวด รับรองวงแขนหอมฟุ้งจนใคร ๆ ก็อยากใกล้",
    "video/softpay_1.mp4",
  );
}
function showResult5() {
  showResult(
    "😎 หัวโจกสายปั่น",
    "คุณน้ามันตัวร้าย! แทนที่จะสำนึกผิดคนเดียว คุณน้าเลือกที่จะลากเพื่อนทั้งแก๊งมาลงนรก (และดมกลิ่น) ไปพร้อมกัน คุณน้ารักเพื่อนมากนะ แต่รักในการได้แกล้งและได้ประจานเพื่อนมากกว่า เป็นคนตลกธรรมชาติ มนุษยสัมพันธ์ดีเลิศ และคลิปไหนที่คุณแชร์ กลุ่มไลน์นั้นจะไฟลุกทันที!",
    "ตลกแล้วต้องตัวหอมด้วยนะ พกติดกระเป๋าไว้ลุยได้ทุกสถานการณ์คอนเทนต์เลย",
    "video/boss_1.mp4",
  );
}
