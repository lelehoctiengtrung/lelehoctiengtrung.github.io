// ============================================================
// media.js — Video Lessons Page Logic
// Predefined local video database, inline player & pagination
// ============================================================

const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'media';
const BLACKLISTED_YOUTUBE_IDS = ['Vz52s5wXhR4']; // Skip unavailable/broken videos (e.g. "chữ AN")
const PAGE_SIZE = 8; // Số lượng video trên mỗi trang (2 hàng, mỗi hàng 4 video trên desktop)

// ---- Predefined Video Database (Offline & Instant Load) ----
const ALL_VIDEOS = [
  {
    "id": "Fj79PruA8j8",
    "title_zh": "好",
    "title_vi": "Hảo - Bí ẩn đằng sau chữ Hảo",
    "youtube_url": "https://www.youtube.com/shorts/Fj79PruA8j8",
    "category": "Lê Lê kể chữ",
    "desc": "Giải thích nguồn gốc thú vị của chữ Hảo - ghép từ bộ Nữ và bộ Tử.",
    "thumbnail": "POSTS/images/hao_thumbnail.png",
    "order": 1
  },
  {
    "id": "ycoBAmSHaIk",
    "title_zh": "老",
    "title_vi": "Lão - Người già chống gậy bước đi",
    "youtube_url": "https://www.youtube.com/shorts/ycoBAmSHaIk",
    "category": "Lê Lê kể chữ",
    "desc": "Giải thích nguồn gốc chữ Lão hình ảnh người già chống gậy.",
    "order": 2
  },
  {
    "id": "GRCVyX1NVKc",
    "title_zh": "汉",
    "title_vi": "Hán - Đôi tay xây nghiệp bên dòng Hán",
    "youtube_url": "https://www.youtube.com/shorts/GRCVyX1NVKc",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa chữ Hán từ đôi tay đắp đê sông Hán.",
    "order": 3
  },
  {
    "id": "DrGtgLX5B38",
    "title_zh": "尖",
    "title_vi": "Tiêm - Đầu nhỏ thân to tạo mũi nhọn",
    "youtube_url": "https://www.youtube.com/shorts/DrGtgLX5B38",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Tiêm ghép từ chữ Tiểu (nhỏ) và Đại (to).",
    "order": 4
  },
  {
    "id": "yPB0kkFBfDA",
    "title_zh": "喜",
    "title_vi": "Hỷ - Kẻ sĩ mở miệng ca hát mừng hỷ",
    "youtube_url": "https://www.youtube.com/shorts/yPB0kkFBfDA",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Hỷ tượng trưng cho niềm vui và may mắn.",
    "order": 5
  },
  {
    "id": "LRSlWafLcdc",
    "title_zh": "名",
    "title_vi": "Danh - Gọi tên nhau trong đêm tối",
    "youtube_url": "https://www.youtube.com/shorts/LRSlWafLcdc",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Danh ghép từ chữ Tịch (tối) và Khẩu (miệng).",
    "order": 6
  },
  {
    "id": "gcdxpViyblE",
    "title_zh": "衣",
    "title_vi": "Y - Chiếc áo dài cổ xòe rộng tà",
    "youtube_url": "https://www.youtube.com/shorts/gcdxpViyblE",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc tượng hình của chữ Y (trang phục).",
    "order": 7
  },
  {
    "id": "q_9fy1F5vbE",
    "title_zh": "家",
    "title_vi": "Gia - Nuôi lợn dưới mái nhà ấm no",
    "youtube_url": "https://www.youtube.com/shorts/q_9fy1F5vbE",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Gia gồm bộ Miên (mái nhà) và chữ Thỉ (con heo).",
    "order": 8
  },
  {
    "id": "jMB51QqslDU",
    "title_zh": "女",
    "title_vi": "Nữ - Người phụ nữ quỳ gối cung kính",
    "youtube_url": "https://www.youtube.com/shorts/jMB51QqslDU",
    "category": "Lê Lê kể chữ",
    "desc": "Hình ảnh tượng hình chữ Nữ thời cổ đại.",
    "thumbnail": "POSTS/images/nu_thumbnail.png",
    "order": 9
  },
  {
    "id": "OqhxB504-u8",
    "title_zh": "休",
    "title_vi": "Hưu - Người mệt mỏi tựa gốc cây nghỉ mát",
    "youtube_url": "https://www.youtube.com/shorts/OqhxB504-u8",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Hưu ghép từ chữ Nhân (người) và Mộc (cây).",
    "order": 10
  },
  {
    "id": "tSqPD1uCg2Y",
    "title_zh": "水",
    "title_vi": "Thủy - Dòng sông chảy xiết tung bọt trắng",
    "youtube_url": "https://www.youtube.com/shorts/tSqPD1uCg2Y",
    "category": "Lê Lê kể chữ",
    "desc": "Hình tượng dòng chảy nước tự nhiên của chữ Thủy.",
    "order": 11
  },
  {
    "id": "s1WhwmGbo_s",
    "title_zh": "不",
    "title_vi": "Bất - Rễ cây bị nhổ không thể mọc",
    "youtube_url": "https://www.youtube.com/shorts/s1WhwmGbo_s",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc hình tượng chữ Bất thời cổ đại.",
    "order": 12
  },
  {
    "id": "5i27wCursTA",
    "title_zh": "东",
    "title_vi": "Đông - Mặt trời mọc sau bao tải hàng",
    "youtube_url": "https://www.youtube.com/shorts/5i27wCursTA",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Đông tượng trưng cho hướng mặt trời mọc.",
    "order": 13
  },
  {
    "id": "Mx6Svocgil4",
    "title_zh": "车",
    "title_vi": "Xa - Chiếc xe cổ nhìn từ trên cao",
    "youtube_url": "https://www.youtube.com/shorts/Mx6Svocgil4",
    "category": "Lê Lê kể chữ",
    "desc": "Hình dáng chiếc xe ngựa cổ nhìn từ trên xuống.",
    "order": 14
  },
  {
    "id": "DBvjz-UjKcs",
    "title_zh": "对",
    "title_vi": "Đối - Dùng tay đo đạc chuẩn xác",
    "youtube_url": "https://www.youtube.com/shorts/DBvjz-UjKcs",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc chữ Đối trong tiếng Trung.",
    "order": 15
  },
  {
    "id": "lg4m_lqlQac",
    "title_zh": "机",
    "title_vi": "Cơ - Cỗ máy gỗ vận hành thời cơ",
    "youtube_url": "https://www.youtube.com/shorts/lg4m_lqlQac",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Cơ ghép từ bộ Mộc và chữ Kỷ.",
    "order": 16
  },
  {
    "id": "yVobRj4s42M",
    "title_zh": "会",
    "title_vi": "Hội - Mọi người tụ họp bàn luận kiến thức",
    "youtube_url": "https://www.youtube.com/shorts/yVobRj4s42M",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc cấu tạo chữ Hội thời cổ đại.",
    "order": 17
  },
  {
    "id": "sK3g_j5PN3A",
    "title_zh": "服",
    "title_vi": "Phục - Đôi tay khoác áo cho người quỳ",
    "youtube_url": "https://www.youtube.com/shorts/sK3g_j5PN3A",
    "category": "Lê Lê kể chữ",
    "desc": "Hình tượng mặc phục trang cung kính thời cổ.",
    "order": 18
  },
  {
    "id": "GTXKMZugW-M",
    "title_zh": "谁",
    "title_vi": "Thùy - Cất tiếng hỏi tên chú chim nhỏ",
    "youtube_url": "https://www.youtube.com/shorts/GTXKMZugW-M",
    "category": "Lê Lê kể chữ",
    "desc": "Giải thích nguồn gốc chữ Thùy dùng để hỏi.",
    "order": 19
  },
  {
    "id": "EXHGG43gVlk",
    "title_zh": "馆",
    "title_vi": "Quán - Nơi quan dừng chân ăn uống",
    "youtube_url": "https://www.youtube.com/shorts/EXHGG43gVlk",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Quán (nơi ăn ở, hội quán).",
    "order": 20
  },
  {
    "id": "cJ7U9Olpx7U",
    "title_zh": "晶",
    "title_vi": "Tinh - Ba mặt trời cùng tỏa sáng lấp lánh",
    "youtube_url": "https://www.youtube.com/shorts/cJ7U9Olpx7U",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Tinh gồm ba chữ Nhật xếp lại.",
    "order": 21
  },
  {
    "id": "0vVPcmv9sZo",
    "title_zh": "些",
    "title_vi": "Ta - Chỉ tay gom nhặt một vài thứ",
    "youtube_url": "https://www.youtube.com/shorts/0vVPcmv9sZo",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa chữ Ta (些) dùng để chỉ một vài, một số lượng ít.",
    "order": 22
  },
  {
    "id": "XznUKXARWeA",
    "title_zh": "人",
    "title_vi": "Nhân - Người đứng vững chãi trên mặt đất",
    "youtube_url": "https://www.youtube.com/shorts/XznUKXARWeA",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Nhân (人) hình ảnh người đứng nghiêng vững chãi.",
    "order": 23
  },
  {
    "id": "ukbAYcmktm8",
    "title_zh": "他",
    "title_vi": "Tha - Người đàn ông khác cũng ở đó",
    "youtube_url": "https://www.youtube.com/shorts/ukbAYcmktm8",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Tha (他) chỉ người nam khác, ghép từ bộ Nhân đứng.",
    "order": 24
  },
  {
    "id": "zrRg18tXyxI",
    "title_zh": "众",
    "title_vi": "Chúng - Ba người tụ họp thành đám đông",
    "youtube_url": "https://www.youtube.com/shorts/zrRg18tXyxI",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Chúng (众) gồm ba chữ Nhân (人) ghép lại.",
    "order": 25
  },
  {
    "id": "5t9w_awJZUk",
    "title_zh": "六",
    "title_vi": "Lục - Ngôi nhà nhỏ mang lại bình an",
    "youtube_url": "https://www.youtube.com/shorts/5t9w_awJZUk",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa tượng hình chữ Lục (六) xuất phát từ ngôi nhà vững chãi.",
    "order": 26
  },
  {
    "id": "lCTp91wuBGA",
    "title_zh": "几",
    "title_vi": "Kỷ - Chiếc bàn nhỏ kê sát vách tường",
    "youtube_url": "https://www.youtube.com/shorts/lCTp91wuBGA",
    "category": "Lê Lê kể chữ",
    "desc": "Tìm hiểu nguồn gốc chữ Kỷ (几) tượng hình chiếc ghế hoặc bàn nhỏ.",
    "order": 27
  },
  {
    "id": "ErVxrJVrvXc",
    "title_zh": "出",
    "title_vi": "Xuất - Mầm cây vượt hai ngọn núi",
    "youtube_url": "https://www.youtube.com/shorts/ErVxrJVrvXc",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc chữ Xuất (出) tượng trưng cho việc đi ra, vượt ra ngoài.",
    "order": 28
  },
  {
    "id": "3t8i3Zt-bKg",
    "title_zh": "北",
    "title_vi": "Bắc - Hai người tựa lưng tránh gió lạnh",
    "youtube_url": "https://www.youtube.com/shorts/3t8i3Zt-bKg",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa chữ Bắc (北) mô tả hai người quay lưng vào nhau.",
    "order": 29
  },
  {
    "id": "r--MW0Qj5H8",
    "title_zh": "卡",
    "title_vi": "Tạp - Vật bị kẹt giữa trên và dưới",
    "youtube_url": "https://www.youtube.com/shorts/r--MW0Qj5H8",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Tạp (卡) ghép từ chữ Thượng (上 - trên) và Hạ (下 - dưới).",
    "order": 30
  },
  {
    "id": "CBXwISkgwHE",
    "title_zh": "吗",
    "title_vi": "Ma - Dùng miệng hỏi thăm con ngựa",
    "youtube_url": "https://www.youtube.com/shorts/CBXwISkgwHE",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Ma (吗) dùng để hỏi cuối câu, ghép từ Khẩu và Mã.",
    "order": 31
  },
  {
    "id": "y_nLw3euYQk",
    "title_zh": "和",
    "title_vi": "Hòa - Miệng có lúa ăn, đời thái bình",
    "youtube_url": "https://www.youtube.com/shorts/y_nLw3euYQk",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Hòa (和) ghép từ chữ Hòa (禾 - lúa) và Khẩu (口 - miệng).",
    "order": 32
  },
  {
    "id": "8MEt2ZkrGMU",
    "title_zh": "商",
    "title_vi": "Thương - Thương nhân đội mũ đi buôn khắp nơi",
    "youtube_url": "https://www.youtube.com/shorts/8MEt2ZkrGMU",
    "category": "Lê Lê kể chữ",
    "desc": "Giải thích nguồn gốc chữ Thương (商) hình ảnh người đội mũ đi buôn.",
    "order": 33
  },
  {
    "id": "Kapx7qHDQzM",
    "title_zh": "在",
    "title_vi": "Tại - Cánh tay cắm cọc định vị trên đất",
    "youtube_url": "https://www.youtube.com/shorts/Kapx7qHDQzM",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc chữ Tại (在) tượng trưng cho sự tồn tại, ở đâu đó.",
    "order": 34
  },
  {
    "id": "OBu4HxmACaw",
    "title_zh": "坐",
    "title_vi": "Tọa - Hai người ngồi đối diện trên gò đất",
    "youtube_url": "https://www.youtube.com/shorts/OBu4HxmACaw",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc chữ Tọa (坐) mô tả hai người ngồi trên đất đối diện nhau.",
    "order": 35
  },
  {
    "id": "j2myKWgjbYI",
    "title_zh": "太",
    "title_vi": "Thái - Đã to lớn còn thêm một điểm dư",
    "youtube_url": "https://www.youtube.com/shorts/j2myKWgjbYI",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Thái (太) từ chữ Đại (大) thêm dấu chấm.",
    "order": 36
  },
  {
    "id": "jsj0YX3iTz0",
    "title_zh": "少",
    "title_vi": "Thiểu - Vật nhỏ bị cắt bớt thành ít",
    "youtube_url": "https://www.youtube.com/shorts/jsj0YX3iTz0",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc chữ Thiểu (少) tượng trưng cho việc chia nhỏ cát.",
    "order": 37
  },
  {
    "id": "4V2sohAIBbI",
    "title_zh": "年",
    "title_vi": "Niên - Người vác bó lúa mừng mùa vụ",
    "youtube_url": "https://www.youtube.com/shorts/4V2sohAIBbI",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc chữ Niên (年) tượng hình người gánh lúa mừng vụ mùa.",
    "order": 38
  },
  {
    "id": "TcKDmAP-HVs",
    "title_zh": "日",
    "title_vi": "Nhật - Mặt trời tỏa sáng giữa bầu trời",
    "youtube_url": "https://www.youtube.com/shorts/TcKDmAP-HVs",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc tượng hình chữ Nhật (日) đại diện cho mặt trời.",
    "order": 39
  },
  {
    "id": "2WaXAJrvP3c",
    "title_zh": "日",
    "title_vi": "Nhật - Mặt trời tỏa sáng giữa bầu trời",
    "youtube_url": "https://www.youtube.com/shorts/2WaXAJrvP3c",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc tượng hình chữ Nhật (日) đại diện cho mặt trời.",
    "order": 40
  },
  {
    "id": "q-TwRb12JxU",
    "title_zh": "期",
    "title_vi": "Kỳ - Đợi trăng lên đúng kỳ hẹn ước",
    "youtube_url": "https://www.youtube.com/shorts/q-TwRb12JxU",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa chữ Kỳ (期) từ hình ảnh chờ trăng lên đúng hẹn.",
    "order": 41
  },
  {
    "id": "zH4vIE5vCU0",
    "title_zh": "杯",
    "title_vi": "Bôi - Chén gỗ mộc mạc không làm đổ",
    "youtube_url": "https://www.youtube.com/shorts/zH4vIE5vCU0",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Bôi (杯) chỉ chiếc cốc uống nước, chén gỗ cổ.",
    "order": 42
  },
  {
    "id": "ddwbrAlJwbQ",
    "title_zh": "样",
    "title_vi": "Dạng - Tạc tượng cừu gỗ làm khuôn mẫu",
    "youtube_url": "https://www.youtube.com/shorts/ddwbrAlJwbQ",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Dạng (样) tượng trưng cho hình mẫu, khuôn mẫu.",
    "order": 43
  },
  {
    "id": "y3gX36hb-bQ",
    "title_zh": "没",
    "title_vi": "Một - Vật rơi xuống nước biến mất hút",
    "youtube_url": "https://www.youtube.com/shorts/y3gX36hb-bQ",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Một (没) chỉ việc không có, chìm vào trong nước.",
    "order": 44
  },
  {
    "id": "Pw8odtts1h4",
    "title_zh": "火",
    "title_vi": "Hỏa - Ngọn lửa bùng cháy rực rỡ",
    "youtube_url": "https://www.youtube.com/shorts/Pw8odtts1h4",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa tượng hình chữ Hỏa (火) mô phỏng ngọn lửa đang cháy.",
    "order": 45
  },
  {
    "id": "v7icfPBTn1k",
    "title_zh": "爱",
    "title_vi": "Ái - Đôi tay che chở người tri kỷ",
    "youtube_url": "https://www.youtube.com/shorts/v7icfPBTn1k",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Ái (爱) thể hiện tình yêu qua đôi tay che chở con tim.",
    "order": 46
  },
  {
    "id": "24RscCfC5dM",
    "title_zh": "米",
    "title_vi": "Mễ - Hạt gạo vãi ra từ bông lúa",
    "youtube_url": "https://www.youtube.com/shorts/24RscCfC5dM",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc chữ Mễ (米) tượng hình những hạt gạo rời.",
    "order": 47
  },
  {
    "id": "v6-uJwe3GYY",
    "title_zh": "菜",
    "title_vi": "Thái - Tay hái rau xanh trên cành cây",
    "youtube_url": "https://www.youtube.com/shorts/v6-uJwe3GYY",
    "category": "Lê Lê kể chữ",
    "desc": "Giải thích chữ Thái (菜) gồm bộ Thảo, bộ Trảo và bộ Mộc.",
    "order": 48
  },
  {
    "id": "NF10Doada1g",
    "title_zh": "见",
    "title_vi": "Kiến - Đôi mắt dõi theo bước chân đi",
    "youtube_url": "https://www.youtube.com/shorts/NF10Doada1g",
    "category": "Lê Lê kể chữ",
    "desc": "Nguồn gốc tượng hình chữ Kiến (见) thể hiện qua đôi mắt dõi theo.",
    "order": 49
  },
  {
    "id": "EWxYnBFH44s",
    "title_zh": "里",
    "title_vi": "Lý - Dặm đường đất giữa cánh đồng",
    "youtube_url": "https://www.youtube.com/shorts/EWxYnBFH44s",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Lý (里) ghép từ bộ Điền (ruộng) và bộ Thổ (đất).",
    "order": 50
  },
  {
    "id": "1YH2H-HPPaQ",
    "title_zh": "院",
    "title_vi": "Viện - Tường cao bao quanh viện học",
    "youtube_url": "https://www.youtube.com/shorts/1YH2H-HPPaQ",
    "category": "Lê Lê kể chữ",
    "desc": "Giải nghĩa chữ Viện (院) chỉ khoảng sân, tòa nhà có tường bao.",
    "order": 51
  },
  {
    "id": "p1cP_bUs41o",
    "title_zh": "零",
    "title_vi": "Linh - Giọt mưa nhỏ rơi theo lệnh",
    "youtube_url": "https://www.youtube.com/shorts/p1cP_bUs41o",
    "category": "Lê Lê kể chữ",
    "desc": "Giải thích chữ Linh (零) tượng hình những giọt mưa rơi tí tách.",
    "order": 52
  },
  {
    "id": "ligtDefdack",
    "title_zh": "面",
    "title_vi": "Diện - Ngũ quan hiện rõ trên mặt",
    "youtube_url": "https://www.youtube.com/shorts/ligtDefdack",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa tượng hình chữ Diện (面) phác họa khuôn mặt người.",
    "order": 53
  },
  {
    "id": "KcpcsVDNOzg",
    "title_zh": "飞",
    "title_vi": "Phi - Chim tung cánh vút lên trời",
    "youtube_url": "https://www.youtube.com/shorts/KcpcsVDNOzg",
    "category": "Lê Lê kể chữ",
    "desc": "Ý nghĩa tượng hình chữ Phi (飞) mô phỏng chú chim đang bay.",
    "order": 54
  },
  {
    "id": "TaHKq_2wdNE",
    "title_zh": "鸣",
    "title_vi": "Minh - Con chim mở miệng hót vang",
    "youtube_url": "https://www.youtube.com/shorts/TaHKq_2wdNE",
    "category": "Lê Lê kể chữ",
    "desc": "Chữ Minh (鸣) gồm chữ Điểu (chim) và Khẩu (miệng) đang hót.",
    "order": 55
  },
  {
    "id": "K-vukz9rtow",
    "title_zh": "破防",
    "title_vi": "Phá phòng - Phá vỡ phòng ngự tâm lý",
    "youtube_url": "https://www.youtube.com/shorts/K-vukz9rtow",
    "category": "Tiếng lóng",
    "desc": "Từ lóng chỉ trạng thái tâm lý bị tổn thương, sụp đổ.",
    "order": 1
  },
  {
    "id": "IpskgDTghTI",
    "title_zh": "社牛",
    "title_vi": "Xã ngưu - Hội chứng tự tin giao tiếp",
    "youtube_url": "https://www.youtube.com/shorts/IpskgDTghTI",
    "category": "Tiếng lóng",
    "desc": "Từ lóng khen người cực kỳ tự tin, hoạt bát chốn đông người.",
    "order": 2
  },
  {
    "id": "2K3oyBG6K3A",
    "title_zh": "内卷",
    "title_vi": "Nội quyển - Cạnh tranh khốc liệt vô nghĩa",
    "youtube_url": "https://www.youtube.com/shorts/2K3oyBG6K3A",
    "category": "Tiếng lóng",
    "desc": "Thuật ngữ lóng 'Nội quyển' chỉ sự cạnh tranh tiêu cực, tự bào mòn lẫn nhau.",
    "order": 3
  },
  {
    "id": "_sf7WsNAjvw",
    "title_zh": "凡尔赛",
    "title_vi": "Phàm nhĩ sài - Khoe mẽ một cách khiêm tốn",
    "youtube_url": "https://www.youtube.com/shorts/_sf7WsNAjvw",
    "category": "Tiếng lóng",
    "desc": "Tìm hiểu phong cách từ lóng 'Phàm nhĩ sài' (Versailles) khoe khoang gián tiếp.",
    "order": 4
  },
  {
    "id": "jSX5WKL2DQ8",
    "title_zh": "剁手",
    "title_vi": "Đoạt thủ - Chặt tay vì cuồng mua sắm online",
    "youtube_url": "https://www.youtube.com/shorts/jSX5WKL2DQ8",
    "category": "Tiếng lóng",
    "desc": "Ý nghĩa từ lóng vui nhộn 'Chặt tay' tự hứa không mua sắm trực tuyến vô tội vạ nữa.",
    "order": 5
  },
  {
    "id": "E1H94KocfQo",
    "title_zh": "吃瓜",
    "title_vi": "Ăn dưa - Hóng biến, hóng phốt mạng xã hội",
    "youtube_url": "https://www.youtube.com/shorts/E1H94KocfQo",
    "category": "Tiếng lóng",
    "desc": "Nguồn gốc từ lóng 'Ăn dưa quần chúng' chỉ những người hóng drama.",
    "order": 6
  },
  {
    "id": "3FmBZdbRPOY",
    "title_zh": "带货",
    "title_vi": "Đới hóa - Livestream bán hàng",
    "youtube_url": "https://www.youtube.com/shorts/3FmBZdbRPOY",
    "category": "Tiếng lóng",
    "desc": "Tìm hiểu từ lóng 'Đới hóa' chỉ trào lưu livestream bán hàng tại Trung Quốc.",
    "order": 7
  },
  {
    "id": "wlhCQ54T-nY",
    "title_zh": "柠檬精",
    "title_vi": "Chanh tinh - Kẻ hay ghen tị, chua ngoa",
    "youtube_url": "https://www.youtube.com/shorts/wlhCQ54T-nY",
    "category": "Tiếng lóng",
    "desc": "Giải thích từ lóng 'Chanh tinh' ví những người hay ghen tị với hạnh phúc của người khác.",
    "order": 8
  },
  {
    "id": "M6En9Z-R_Ho",
    "title_zh": "社恐",
    "title_vi": "Xã khủng - Hội chứng sợ giao tiếp xã hội",
    "youtube_url": "https://www.youtube.com/shorts/M6En9Z-R_Ho",
    "category": "Tiếng lóng",
    "desc": "Tìm hiểu từ lóng 'Xã khủng' viết tắt của chứng sợ giao tiếp đám đông.",
    "order": 9
  },
  {
    "id": "5NS9Pa7MvAU",
    "title_zh": "芭比Q了",
    "title_vi": "Ba tỷ Q liễu - Toang rồi, xong đời",
    "youtube_url": "https://www.youtube.com/shorts/5NS9Pa7MvAU",
    "category": "Tiếng lóng",
    "desc": "Nguồn gốc từ lóng mạng cực hot 'Barbecue le' chỉ sự bất lực, thất bại.",
    "order": 10
  },
  {
    "id": "s_uES_h9c1I",
    "title_zh": "躺平",
    "title_vi": "Thảng bình - Trào lưu nằm phẳng, mặc kệ đời",
    "youtube_url": "https://www.youtube.com/shorts/s_uES_h9c1I",
    "category": "Tiếng lóng",
    "desc": "Giải thích từ lóng 'Thảng bình' thể hiện lối sống tối giản, từ chối áp lực xã hội.",
    "order": 11
  },
  {
    "id": "kLQ1e0Jb-1M",
    "title_zh": "割韭菜",
    "title_vi": "Luộc rau (Cắt hẹ) - Trục lợi, lùa gà",
    "youtube_url": "https://www.youtube.com/watch?v=kLQ1e0Jb-1M",
    "category": "Tiếng lóng",
    "desc": "Tìm hiểu từ lóng 割韭菜 chỉ việc bị doanh nghiệp hoặc khóa học kém chất lượng trục lợi.",
    "thumbnail": "POSTS/images/luoc_rau_thumbnail.png",
    "order": 12
  },
  {
    "id": "pM9mY3c7aM0",
    "title_zh": "海王",
    "title_vi": "Thả thính - Chúa tể đại dương, bắt cá nhiều tay",
    "youtube_url": "https://www.youtube.com/watch?v=pM9mY3c7aM0",
    "category": "Tiếng lóng",
    "desc": "Tìm hiểu từ lóng 海王 chỉ những kẻ lăng nhăng, thích tán tỉnh nhiều người cùng lúc.",
    "thumbnail": "POSTS/images/tha_thinh_thumbnail.png",
    "order": 13
  },
  {
    "id": "BoXL0hnHSZo",
    "title_zh": "一点儿 vs 有点儿",
    "title_vi": "Phân biệt cách nói Một chút",
    "youtube_url": "https://www.youtube.com/shorts/BoXL0hnHSZo",
    "category": "Song đấu từ vựng",
    "desc": "Mẹo cực nhanh để phân biệt hai từ chỉ mức độ '一点儿' và '有点儿'.",
    "order": 1
  },
  {
    "id": "r-XLeTWWKao",
    "title_zh": "二 vs 两",
    "title_vi": "Phân biệt cách dùng Nhị và Lưỡng khi đếm số",
    "youtube_url": "https://www.youtube.com/shorts/r-XLeTWWKao",
    "category": "Song đấu từ vựng",
    "desc": "Khi nào dùng '二' và khi nào dùng '两'? Tìm hiểu ngay mẹo nhớ cực nhanh.",
    "order": 2
  },
  {
    "id": "nRr3vt2G12s",
    "title_zh": "刚 vs 刚才",
    "title_vi": "Phân biệt phó từ Vừa và danh từ Vừa nãy",
    "youtube_url": "https://www.youtube.com/shorts/nRr3vt2G12s",
    "category": "Song đấu từ vựng",
    "desc": "Phân biệt cách dùng ngữ pháp phó từ '刚' và danh từ chỉ thời gian '刚才'.",
    "order": 3
  },
  {
    "id": "qAoS_7LxJe0",
    "title_zh": "想 vs 觉得",
    "title_vi": "Phân biệt cách nói Nghĩ, Cảm thấy",
    "youtube_url": "https://www.youtube.com/shorts/qAoS_7LxJe0",
    "category": "Song đấu từ vựng",
    "desc": "Phân biệt chi tiết sự khác nhau giữa hai từ '想' và '觉得' dễ nhầm lẫn.",
    "order": 4
  },
  {
    "id": "dPbXeQYc-4E",
    "title_zh": "能 vs 会",
    "title_vi": "Phân biệt cách nói Có thể, Biết làm",
    "youtube_url": "https://www.youtube.com/shorts/dPbXeQYc-4E",
    "category": "Song đấu từ vựng",
    "desc": "Phân biệt hai động từ năng nguyện chỉ khả năng hành động '能' và '会'.",
    "order": 5
  },
  {
    "id": "IppkMx_ep6g",
    "title_zh": "健身房登记",
    "title_vi": "Giao tiếp Đăng ký tập gym",
    "youtube_url": "https://www.youtube.com/shorts/IppkMx_ep6g",
    "category": "Tiếng Trung thực chiến",
    "desc": "Mẫu câu đàm thoại đăng ký tại phòng gym.",
    "order": 1
  },
  {
    "id": "2QZ4Sw0hrUI",
    "title_zh": "兑换外币",
    "title_vi": "Giao tiếp Đổi tiền ngoại tệ",
    "youtube_url": "https://www.youtube.com/shorts/2QZ4Sw0hrUI",
    "category": "Tiếng Trung thực chiến",
    "desc": "Hội thoại giao tiếp thực tế khi đổi tiền.",
    "order": 2
  },
  {
    "id": "Kp1j5TqeI38",
    "title_zh": "请假",
    "title_vi": "Giao tiếp Xin nghỉ phép",
    "youtube_url": "https://www.youtube.com/shorts/Kp1j5TqeI38",
    "category": "Tiếng Trung thực chiến",
    "desc": "Mẫu câu xin nghỉ phép văn phòng lịch sự.",
    "order": 3
  },
  {
    "id": "hizk3Fro9JQ",
    "title_zh": "退货退款",
    "title_vi": "Giao tiếp Trả hàng hoàn tiền",
    "youtube_url": "https://www.youtube.com/shorts/hizk3Fro9JQ",
    "category": "Tiếng Trung thực chiến",
    "desc": "Mẫu câu khiếu nại trả hàng mua sắm.",
    "order": 4
  },
  {
    "id": "ys2Qxpz9cPM",
    "title_zh": "帮忙拍照",
    "title_vi": "Giao tiếp Nhờ chụp ảnh giúp",
    "youtube_url": "https://www.youtube.com/shorts/ys2Qxpz9cPM",
    "category": "Tiếng Trung thực chiến",
    "desc": "Hội thoại nhờ vả chụp ảnh khi đi du lịch.",
    "order": 5
  },
  {
    "id": "Pkj1cLfuhGg",
    "title_zh": "打车",
    "title_vi": "Giao tiếp Đón taxi trên đường",
    "youtube_url": "https://www.youtube.com/shorts/Pkj1cLfuhGg",
    "category": "Tiếng Trung thực chiến",
    "desc": "Hội thoại giao tiếp đón xe taxi phổ thông.",
    "order": 6
  },
  {
    "id": "dxyWVUi7YdQ",
    "title_zh": "遇到老朋友",
    "title_vi": "Giao tiếp Gặp gỡ bạn cũ lâu năm",
    "youtube_url": "https://www.youtube.com/shorts/dxyWVUi7YdQ",
    "category": "Tiếng Trung thực chiến",
    "desc": "Hội thoại xã giao khi vô tình gặp lại bạn cũ.",
    "order": 7
  },
  {
    "id": "aUMowaLuS3Y",
    "title_zh": "问候身体",
    "title_vi": "Giao tiếp Hỏi thăm sức khỏe",
    "youtube_url": "https://www.youtube.com/shorts/aUMowaLuS3Y",
    "category": "Tiếng Trung thực chiến",
    "desc": "Cách hỏi thăm sức khỏe thông thường và lịch sự.",
    "order": 8
  },
  {
    "id": "S4v2kkTVGHk",
    "title_zh": "预订酒店",
    "title_vi": "Giao tiếp Đặt phòng khách sạn",
    "youtube_url": "https://www.youtube.com/shorts/S4v2kkTVGHk",
    "category": "Tiếng Trung thực chiến",
    "desc": "Mẫu câu hội thoại nhận phòng và đặt phòng.",
    "order": 9
  },
  {
    "id": "zcFH0pis5HU",
    "title_zh": "点奶茶",
    "title_vi": "Giao tiếp Gọi trà sữa",
    "youtube_url": "https://www.youtube.com/shorts/zcFH0pis5HU",
    "category": "Tiếng Trung thực chiến",
    "desc": "Mẫu câu thực chiến gọi trà sữa, lựa chọn đường đá và các loại topping.",
    "order": 10
  },
  {
    "id": "_saPWt75YKI",
    "title_zh": "问路",
    "title_vi": "Giao tiếp Hỏi đường đi ga tàu",
    "youtube_url": "https://www.youtube.com/shorts/_saPWt75YKI",
    "category": "Tiếng Trung thực chiến",
    "desc": "Mẫu câu giao tiếp thực tế khi bạn cần hỏi đường tại ga tàu.",
    "order": 11
  },
  {
    "id": "q4RitAE5OWI",
    "title_zh": "砍价",
    "title_vi": "Giao tiếp Mặc cả khi mua quần áo",
    "youtube_url": "https://www.youtube.com/shorts/q4RitAE5OWI",
    "category": "Tiếng Trung thực chiến",
    "desc": "Mẫu câu hội thoại đàm thoại thực tế giúp bạn mặc cả mua đồ tại Trung Quốc.",
    "order": 12
  },
  {
    "id": "BxC4vGPwt6s",
    "title_zh": "胸有成竹",
    "title_vi": "Hung hữu thành trúc - Trong lòng đã có tre",
    "youtube_url": "https://www.youtube.com/shorts/BxC4vGPwt6s",
    "category": "Thành ngữ",
    "desc": "Thành ngữ ví von việc đã có kế hoạch sẵn sàng và tự tin.",
    "order": 1
  },
  {
    "id": "lwiZmQ04gWI",
    "title_zh": "叶公好龙",
    "title_vi": "Diệp Công hiếu long - Yêu thích giả tạo",
    "youtube_url": "https://www.youtube.com/shorts/lwiZmQ04gWI",
    "category": "Thành ngữ",
    "desc": "Câu chuyện châm biếm người ngoài miệng thì thích nhưng thực tế lại sợ.",
    "order": 2
  },
  {
    "id": "E9XS8J52fjo",
    "title_zh": "刻舟求剑",
    "title_vi": "Khắc chu cầu kiếm - Khắc thuyền tìm kiếm",
    "youtube_url": "https://www.youtube.com/shorts/E9XS8J52fjo",
    "category": "Thành ngữ",
    "desc": "Bài học phê phán những người ngoan cố, cứng nhắc không biết biến đổi.",
    "order": 3
  },
  {
    "id": "ebPSABEdUMI",
    "title_zh": "掩耳盗铃",
    "title_vi": "Yểm nhĩ đạo linh - Bịt tai trộm chuông",
    "youtube_url": "https://www.youtube.com/shorts/ebPSABEdUMI",
    "category": "Thành ngữ",
    "desc": "Chỉ hành vi tự lừa mình dối người, trốn tránh thực tại.",
    "order": 4
  },
  {
    "id": "A0VwRz8IGno",
    "title_zh": "自相矛盾",
    "title_vi": "Tự tương mâu thuẫn - Tự mâu thuẫn",
    "youtube_url": "https://www.youtube.com/shorts/A0VwRz8IGno",
    "category": "Thành ngữ",
    "desc": "Chỉ lời nói hoặc hành động trước sau không nhất quán.",
    "order": 5
  },
  {
    "id": "Xxzo0rprdQc",
    "title_zh": "井底之蛙",
    "title_vi": "Tỉnh để chi oa - Con ếch ngồi đáy giếng",
    "youtube_url": "https://www.youtube.com/shorts/Xxzo0rprdQc",
    "category": "Thành ngữ",
    "desc": "Chỉ những người tầm nhìn hạn hẹp nhưng lại tự phụ.",
    "order": 6
  },
  {
    "id": "eDap3fEhWrA",
    "title_zh": "指鹿为马",
    "title_vi": "Chỉ lộc vi mã - Chỉ hươu bảo ngựa",
    "youtube_url": "https://www.youtube.com/shorts/eDap3fEhWrA",
    "category": "Thành ngữ",
    "desc": "Chỉ hành vi đổi trắng thay đen, uy quyền ép bức người khác.",
    "order": 7
  },
  {
    "id": "55PH0e1jm2w",
    "title_zh": "愚公移山",
    "title_vi": "Ngu Công di sơn - Ngu Công dời núi",
    "youtube_url": "https://www.youtube.com/shorts/55PH0e1jm2w",
    "category": "Thành ngữ",
    "desc": "Biểu trưng cho ý chí kiên trì, bền bỉ vượt qua khó khăn.",
    "order": 8
  },
  {
    "id": "2JoOBSlNib4",
    "title_zh": "狐假虎威",
    "title_vi": "Hồ giả hổ uy - Cáo mượn oai hùm",
    "youtube_url": "https://www.youtube.com/shorts/2JoOBSlNib4",
    "category": "Thành ngữ",
    "desc": "Chỉ kẻ dựa hơi người có quyền thế để bắt nạt kẻ yếu.",
    "order": 9
  },
  {
    "id": "NLkHvt7Wu5A",
    "title_zh": "亡羊补牢",
    "title_vi": "Mất cừu mới sửa chuồng - Sửa sai kịp thời",
    "youtube_url": "https://www.youtube.com/shorts/NLkHvt7Wu5A",
    "category": "Thành ngữ",
    "desc": "Khám phá bài học sâu sắc từ câu chuyện mất cừu đắp lại chuồng vẫn chưa muộn.",
    "order": 10
  },
  {
    "id": "vtL-7_lONnM",
    "title_zh": "塞翁失马",
    "title_vi": "Tái ông thất mã - Trong họa có phúc",
    "youtube_url": "https://www.youtube.com/shorts/vtL-7_lONnM",
    "category": "Thành ngữ",
    "desc": "Triết lý sâu sắc về việc phúc họa khôn lường, nên giữ tâm bình thản trước biến cố.",
    "order": 11
  },
  {
    "id": "BgmL-8aKnaA",
    "title_zh": "守株待兔",
    "title_vi": "Ôm cây đợi thỏ - Siêng ăn nhác làm",
    "youtube_url": "https://www.youtube.com/shorts/BgmL-8aKnaA",
    "category": "Thành ngữ",
    "desc": "Phê phán lối sống trông chờ vào may mắn bất ngờ mà không tự lao động.",
    "order": 12
  },
  {
    "id": "M4VYa6BEsOY",
    "title_zh": "对牛弹琴",
    "title_vi": "Đàn gảy tai trâu - Không đúng đối tượng",
    "youtube_url": "https://www.youtube.com/shorts/M4VYa6BEsOY",
    "category": "Thành ngữ",
    "desc": "Châm biếm hành vi giải thích lý lẽ cao siêu cho người không hiểu biết.",
    "order": 13
  },
  {
    "id": "4VE-eeXsCOE",
    "title_zh": "画蛇添足",
    "title_vi": "Vẽ rắn thêm chân - Làm việc thừa thãi",
    "youtube_url": "https://www.youtube.com/shorts/4VE-eeXsCOE",
    "category": "Thành ngữ",
    "desc": "Câu chuyện châm biếm người vẽ rắn vẽ thêm chân, làm hỏng việc chính.",
    "order": 14
  },
  {
    "id": "xJwB52xBYwc",
    "title_zh": "画龙点睛",
    "title_vi": "Vẽ rồng điểm mắt - Thêm nét quyết định",
    "youtube_url": "https://www.youtube.com/shorts/xJwB52xBYwc",
    "category": "Thành ngữ",
    "desc": "Nguồn gốc thành ngữ 'Vẽ rồng vẽ thêm con mắt' giúp bức tranh sinh động xuất thần.",
    "order": 15
  },
  {
    "id": "H3lmJfw8K3E",
    "title_zh": "盲人摸象",
    "title_vi": "Thầy bói xem voi - Nhìn nhận phiến diện",
    "youtube_url": "https://www.youtube.com/shorts/H3lmJfw8K3E",
    "category": "Thành ngữ",
    "desc": "Câu chuyện ngụ ngôn phê phán những người đánh giá sự việc một chiều.",
    "order": 16
  },
  {
    "id": "LPKHs2v7ar8",
    "title_zh": "破釜沉舟",
    "title_vi": "Đập nồi dìm thuyền - Quyết tâm không lùi bước",
    "youtube_url": "https://www.youtube.com/shorts/LPKHs2v7ar8",
    "category": "Thành ngữ",
    "desc": "Thành ngữ chỉ ý chí quyết thắng, tự cắt đường lui để tiến lên phía trước.",
    "order": 17
  },
  {
    "id": "rPLRT1uPd30",
    "title_zh": "舍己为人",
    "title_vi": "Xả thân vì người khác - Hy sinh lợi ích riêng",
    "youtube_url": "https://www.youtube.com/shorts/rPLRT1uPd30",
    "category": "Thành ngữ",
    "desc": "Câu chuyện thành ngữ 'Xả thân cứu người', quên đi lợi ích bản thân.",
    "order": 18
  }
];

const CATEGORIES = ['Lê Lê kể chữ', 'Tiếng lóng', 'Song đấu từ vựng', 'Tiếng Trung thực chiến', 'Thành ngữ'];
const thumbCache = {}; // Cache loaded thumbnails

let currentCategory = CATEGORIES[0];
let currentPage = 1;
let activePlayingCard = null; // Store currently playing inline card

// --- Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  renderGrid();
  loadVideosFromSheet(); // Sync from Sheet in background

  window.addEventListener('langChanged', () => {
    setupTabs();
    renderGrid();
  });
});

// --- Category Normalizer to map sheet values to exact tabs ─
function normalizeCategory(cat) {
  if (!cat) return 'Tiếng Trung thực chiến';
  const c = cat.toLowerCase();
  if (c.includes('kể chữ') || c.includes('câu chuyện chữ') || c.includes('bộ thủ')) {
    return 'Lê Lê kể chữ';
  }
  if (c.includes('slang') || c.includes('tiếng lóng') || c.includes('lóng')) {
    return 'Tiếng lóng';
  }
  if (c.includes('vs') || c.includes('phân biệt') || c.includes('song đấu')) {
    return 'Song đấu từ vựng';
  }
  if (c.includes('thực chiến') || c.includes('giao tiếp') || c.includes('thực tế')) {
    return 'Tiếng Trung thực chiến';
  }
  if (c.includes('thành ngữ') || c.includes('idiom')) {
    return 'Thành ngữ';
  }
  return 'Tiếng Trung thực chiến';
}

// --- Title Parser to split Chinese (top) and Vietnamese (bottom) ───
function parseTitle(rawTitle) {
  if (!rawTitle) return { zh: '', vi: '' };

  let title = rawTitle;

  // Extract Chinese characters (excluding standard punctuation and Latin alphabet)
  const zhMatch = title.match(/[\u4e00-\u9fa5]+/g);
  let zh = '';
  if (zhMatch) {
    zh = zhMatch.join(' ');
  }

  // Strip hashtags
  title = title.replace(/#\w+/g, '');

  // Remove parentheses characters but keep contents
  title = title.replace(/[\(\)\[\]\{\}（）]/g, '');

  // Remove common prefixes
  title = title.replace(/(Câu chuyện chữ|Hội thoại|Giải nghĩa|Giới thiệu câu chuyện|Học chữ Hán qua chữ|Ngữ cảnh)\s*[\-\:]\s*/gi, '');

  // Remove extracted Chinese characters from Vietnamese title
  if (zhMatch) {
    zhMatch.forEach(c => {
      title = title.replace(new RegExp(c, 'g'), '');
    });
  }

  // Remove quotes
  title = title.replace(/[\"\'“”‘’«»]/g, '');

  // Clean up dashes, colons, and spaces
  title = title.replace(/\s*[\-\:]\s*$/, ''); // trailing dashes
  title = title.replace(/^\s*[\-\:]\s*/, ''); // leading dashes
  title = title.replace(/\s+/g, ' ').trim();

  // Capitalize first letter
  if (title) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  // Edge cases adjustment
  if (rawTitle.includes('二') && rawTitle.includes('两')) {
    zh = '二 vs 两';
    title = 'Phân biệt Nhị và Lưỡng khi đếm số';
  }
  if (rawTitle.includes('一点儿') && rawTitle.includes('有点儿')) {
    zh = '一点儿 vs 有点儿';
    title = 'Phân biệt cách nói Một chút';
  }

  return { zh, vi: title };
}

// --- Fetch from Google Sheets dynamically ──────────────────
async function loadVideosFromSheet() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
    const res = await fetch(url);
    const raw = await res.text();

    const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('Invalid response format');
    const data = JSON.parse(match[1]);

    const rows = data.table.rows;
    if (!rows || rows.length === 0) return;

    const cols = data.table.cols || [];
    const colMap = { id: 0, title: 1, youtube_url: 2, category: 3, desc: 4, order: 5 };

    cols.forEach((col, index) => {
      const label = (col.label || '').toLowerCase();
      if (label.includes('id')) colMap.id = index;
      else if (label.includes('title') || label.includes('tiêu đề')) colMap.title = index;
      else if (label.includes('youtube') || label.includes('đường dẫn')) colMap.youtube_url = index;
      else if (label.includes('category') || label.includes('chủ đề')) colMap.category = index;
      else if (label.includes('desc') || label.includes('mô tả')) colMap.desc = index;
      else if (label.includes('order') || label.includes('thứ tự')) colMap.order = index;
    });

    const sheetVideos = rows.map((r, rowIndex) => {
      const getVal = (colIdx, fallbackVal = '') => {
        if (colIdx === undefined || colIdx < 0 || !r.c) return fallbackVal;
        const cell = r.c[colIdx];
        const val = (cell && cell.v != null) ? String(cell.v).trim() : '';
        return val || fallbackVal;
      };

      const title = getVal(colMap.title);
      if (!title) return null;

      const id = getVal(colMap.id, `VID-ROW-${rowIndex}`);
      const youtube_url = getVal(colMap.youtube_url);
      const rawCategory = getVal(colMap.category, 'Tiếng Trung thực chiến');
      const category = normalizeCategory(rawCategory);
      const desc = getVal(colMap.desc);
      const order = parseInt(getVal(colMap.order, String(rowIndex))) || rowIndex;

      return { id, title, youtube_url, category, desc, order };
    }).filter(v => {
      if (!v) return false;
      const ytId = getYouTubeId(v.youtube_url);
      return !BLACKLISTED_YOUTUBE_IDS.includes(ytId);
    });

    if (sheetVideos.length > 0) {
      // Merge sheet videos with the predefined local database by youtube_url
      sheetVideos.forEach(sv => {
        const svId = getYouTubeId(sv.youtube_url);
        if (!svId) return;
        const idx = ALL_VIDEOS.findIndex(v => getYouTubeId(v.youtube_url) === svId);
        if (idx !== -1) {
          // Update keeping the local details if sheet has placeholders
          ALL_VIDEOS[idx] = { ...ALL_VIDEOS[idx], ...sv };
        } else {
          ALL_VIDEOS.push(sv);
        }
      });
      
      const categoriesPresent = [...new Set(ALL_VIDEOS.map(v => v.category))];
      if (!categoriesPresent.includes(currentCategory) && categoriesPresent.length > 0) {
        currentCategory = categoriesPresent[0];
      }
      
      setupTabs();
      renderGrid();
    }
  } catch (err) {
    console.warn('Could not sync latest videos from Google Sheets, using offline video database.', err);
  }
}

// --- Helper to extract YouTube ID ────────────────────────
function getYouTubeId(url) {
  if (!url) return '';
  url = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const shortsMatch = url.match(shortsReg);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }
  if (url.length === 11) {
    return url;
  }
  return '';
}

// --- High-resolution Thumbnail Loader Script ──────────────
function getYouTubeThumbnail(videoId) {
  if (thumbCache[videoId]) {
    return Promise.resolve(thumbCache[videoId]);
  }
  return new Promise((resolve) => {
    const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const img = new Image();
    img.onload = () => {
      // YouTube returns a 120x90 image if maxresdefault doesn't exist
      if (img.width === 120 && img.height === 90) {
        thumbCache[videoId] = hq;
        resolve(hq);
      } else {
        thumbCache[videoId] = maxres;
        resolve(maxres);
      }
    };
    img.onerror = () => {
      thumbCache[videoId] = hq;
      resolve(hq);
    };
    img.src = maxres;
  });
}

// --- Setup category tabs ──────────────────────────
function setupTabs() {
  const tabsContainer = document.getElementById('media-tabs');
  const loading = document.getElementById('media-loading');
  if (loading) loading.classList.add('hidden');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const count = ALL_VIDEOS.filter(v => v.category === cat).length;
    const tab = document.createElement('button');
    tab.className = `filter-tab ${currentCategory === cat ? 'active' : ''}`;
    tab.dataset.filter = cat;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', currentCategory === cat ? 'true' : 'false');
    tab.innerHTML = `${cat} <span class="tab-count">${count}</span>`;
    
    tab.addEventListener('click', () => {
      if (currentCategory === cat) return;
      currentCategory = cat;
      currentPage = 1;
      
      // Update tab UI state
      tabsContainer.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      renderGrid();
    });

    tabsContainer.appendChild(tab);
  });
}

// --- Render Video Grid & Pagination ───────────────────────
async function renderGrid() {
  const grid = document.getElementById('media-grid');
  const emptyState = document.getElementById('media-empty');
  if (!grid) return;

  grid.innerHTML = '';
  activePlayingCard = null; // Reset playing card state

  const filtered = ALL_VIDEOS.filter(v => v.category === currentCategory);

  if (filtered.length === 0) {
    grid.classList.add('hidden');
    renderPagination(0);
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  grid.classList.remove('hidden');

  // Sort by order ascending
  filtered.sort((a, b) => a.order - b.order);

  // Pagination bounds
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pageItems = filtered.slice(startIndex, endIndex);

  // Render cards
  for (const video of pageItems) {
    const youtubeId = getYouTubeId(video.youtube_url);
    const card = document.createElement('div');
    card.className = 'video-card';
    card.id = `video-card-${video.id}`;

    const thumbWrapId = `thumb-wrap-${video.id}`;
    // Draw hqdefault immediately to avoid empty/spinner state
    const cachedThumb = video.thumbnail || thumbCache[youtubeId] || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    let zh = video.title_zh || '';
    let vi = video.title_vi || '';
    if (!zh && video.title) {
      const parsed = parseTitle(video.title);
      zh = parsed.zh;
      vi = parsed.vi;
    }

    card.innerHTML = `
      <div class="video-thumb-wrap" id="${thumbWrapId}">
        <img src="${cachedThumb}" alt="${zh}" loading="lazy" />
        <div class="video-play-overlay">
          <div class="play-btn-circle" aria-label="Phát video">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div class="video-info">
        <h3 class="video-card-title-zh">${zh}</h3>
        <p class="video-card-title-vi">${vi}</p>
      </div>
    `;

    grid.appendChild(card);

    const thumbWrap = document.getElementById(thumbWrapId);
    if (thumbWrap) {
      // Inline playing trigger
      thumbWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideoInline(video, youtubeId, card, thumbWrap);
      });
    }

    // Asynchronously check and upgrade to maxresdefault if available
    if (!video.thumbnail) {
      upgradeToMaxResThumbnail(youtubeId, thumbWrapId);
    }
  }

  renderPagination(totalPages);
}

// --- Asynchronously upgrade thumbnail to maxresdefault if available ───
function upgradeToMaxResThumbnail(videoId, wrapId) {
  if (!videoId) return;
  if (thumbCache[videoId]) return; // already upgraded/checked
  
  const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const img = new Image();
  img.onload = () => {
    if (img.width !== 120 || img.height !== 90) {
      const wrap = document.getElementById(wrapId);
      if (wrap) {
        const imgEl = wrap.querySelector('img');
        if (imgEl) {
          imgEl.src = maxres;
          thumbCache[videoId] = maxres;
        }
      }
    }
  };
  img.src = maxres;
}

// --- Play video inline in-place ───────────────────────────
function playVideoInline(video, youtubeId, card, thumbWrap) {
  if (activePlayingCard && activePlayingCard !== card) {
    restoreCardToThumbnail(activePlayingCard);
  }

  activePlayingCard = card;
  card.classList.add('is-playing');

  thumbWrap.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
}

// --- Restore previously playing card back to static thumbnail ────
function restoreCardToThumbnail(card) {
  if (!card) return;
  card.classList.remove('is-playing');

  const videoId = card.id.replace('video-card-', '');
  const video = ALL_VIDEOS.find(v => v.id === videoId);
  if (!video) return;

  const youtubeId = getYouTubeId(video.youtube_url);
  const thumbWrapId = `thumb-wrap-${video.id}`;
  const thumbWrap = document.getElementById(thumbWrapId);
  if (!thumbWrap) return;

  const cachedThumb = video.thumbnail || thumbCache[youtubeId] || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  let zh = video.title_zh || '';
  if (!zh && video.title) {
    const parsed = parseTitle(video.title);
    zh = parsed.zh;
  }

  thumbWrap.innerHTML = `
    <img src="${cachedThumb}" alt="${zh}" loading="lazy" />
    <div class="video-play-overlay">
      <div class="play-btn-circle" aria-label="Phát video">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
  `;

  // Re-attach play inline click handler
  thumbWrap.addEventListener('click', (e) => {
    e.stopPropagation();
    playVideoInline(video, youtubeId, card, thumbWrap);
  });
}

// --- Render pagination buttons ────────────────────────────
function renderPagination(totalPages) {
  const pagination = document.getElementById('media-pagination');
  if (!pagination) return;

  if (totalPages <= 1) {
    pagination.classList.add('hidden');
    return;
  }

  pagination.classList.remove('hidden');
  pagination.innerHTML = '';

  // Prev Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn page-btn-text';
  prevBtn.disabled = currentPage === 1;
  prevBtn.innerHTML = '←';
  prevBtn.addEventListener('click', () => {
    currentPage--;
    renderGrid();
    scrollToTop();
  });
  pagination.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderGrid();
      scrollToTop();
    });
    pagination.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn page-btn-text';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.innerHTML = '→';
  nextBtn.addEventListener('click', () => {
    currentPage++;
    renderGrid();
    scrollToTop();
  });
  pagination.appendChild(nextBtn);
}

// --- Scroll mượt về vị trí menu tabs khi chuyển trang ──────
function scrollToTop() {
  const tabs = document.getElementById('media-tabs');
  if (tabs) {
    tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
