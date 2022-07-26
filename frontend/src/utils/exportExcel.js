import ExcelJs from "exceljs";

const printBookingConfirmation = (booking) => {
  const sheetName = `Booking_${booking._id}.xlsx`;
  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: false }],
  });

  // Thông tin website
  sheet.getRow(1).values = ["RR", "WEBSITE ĐĂNG TIN & ĐẶT PHÒNG", "", ""];
  sheet.getRow(2).values = ["", "Địa chỉ: xx xx xx xx xx", "", ""];
  sheet.getRow(3).values = ["", "Liên hệ: 0123456798", "", ""];
  sheet.mergeCells(`A1:A3`);
  sheet.mergeCells(`B1:D1`);
  sheet.mergeCells(`B2:D2`);
  sheet.mergeCells(`B3:D3`);

  // Thanh thông tiêu đề
  sheet.getCell("A5").value = {
    richText: [
      {
        font: { size: 22, bold: true, color: { argb: "FF0000" } },
        text: `GIẤY XÁC NHẬN ĐẶT PHÒNG`,
      },
    ],
  };
  sheet.mergeCells(`A5:F5`);
  sheet.getRow(5).height = 40;
  sheet.getRow(6).values = ["", "", "", `Booking #${booking._id}`];
  sheet.getRow(7).values = [
    "",
    "",
    "",
    `Ngày xuất: ${new Date(Date.now()).toLocaleString("en-GB")}`,
  ];
  sheet.mergeCells(`D6:E6`);
  sheet.mergeCells(`D7:E7`);

  //Thông tin người đặt
  sheet.getCell("A9").value = {
    richText: [
      {
        font: { size: 16, bold: true },
        text: "Thông tin đặt phòng",
      },
    ],
  };
  sheet.getRow(10).values = ["ID", booking.user?._id];
  sheet.getRow(11).values = ["Email", booking.user?.email];
  sheet.getRow(12).values = ["Họ tên", booking.user?.name];
  sheet.getRow(13).values = ["Số điện thoại", booking.user?.phoneNumber];
  sheet.getRow(14).values = [
    "Ngày đặt",
    new Date(booking.createdAt).toLocaleString("en-GB"),
  ];
  sheet.getRow(15).values = [
    "Ngày nhận",
    new Date(booking.checkInDate).toLocaleString("en-GB"),
  ];

  // Phòng đặt
  sheet.getCell("A17").value = {
    richText: [
      {
        font: { size: 16, bold: true },
        text: "Thông tin chi tiết",
      },
    ],
  };
  sheet.getRow(18).values = [
    "Mã phòng",
    "Loại phòng",
    "Số phòng",
    "Giá phòng",
    "Thành tiền",
  ];

  sheet.columns = [
    { key: "roomID", width: 30 },
    { key: "category", width: 20 },
    { key: "numOfRooms", width: 10 },
    { key: "roomPrice", width: 20 },
    { key: "totalPrice", width: 20 },
  ];

  sheet.addRow({
    roomID: booking.room?._id,
    category: booking.room?.category,
    numOfRooms: booking.numOfRooms,
    roomPrice: booking.roomPrice.toLocaleString("en-us") + " VNĐ",
    totalPrice:
      (booking.roomPrice * booking.numOfRooms).toLocaleString("en-us") + " VNĐ",
  });

  sheet.addRow({
    roomID: "TỔNG CỘNG",
    category: "",
    numOfRooms: "",
    roomPrice: "",
    totalPrice:
      (booking.roomPrice * booking.numOfRooms).toLocaleString("en-us") + " VNĐ",
  });

  sheet.getCell("D22").value = {
    richText: [
      {
        font: { size: 16, bold: true },
        text: "Thông tin thanh toán",
      },
    ],
  };
  sheet.mergeCells(`D22:E22`);

  sheet.addRow({
    roomID: "",
    category: "",
    numOfRooms: "",
    roomPrice: "Thành tiền",
    totalPrice:
      (booking.roomPrice * booking.numOfRooms).toLocaleString("en-us") + " VNĐ",
  });

  sheet.addRow({
    roomID: "",
    category: "",
    numOfRooms: "",
    roomPrice: "Phí",
    totalPrice:
      (booking.roomPrice * booking.numOfRooms * 0.1).toLocaleString("en-us") +
      " VNĐ",
  });

  sheet.addRow({
    roomID: "",
    category: "",
    numOfRooms: "",
    roomPrice: "Tổng",
    totalPrice: booking.totalPrice.toLocaleString("en-us") + " VNĐ",
  });

  sheet.addRow({
    roomID: "",
    category: "",
    numOfRooms: "",
    roomPrice: "Hình thức",
    totalPrice: booking.status,
  });

  if (booking.status === "Thanh toán online") {
    sheet.addRow({
      roomID: "",
      category: "",
      numOfRooms: "",
      roomPrice: "Thanh toán",
      totalPrice: new Date(booking.paidAt).toLocaleString("en-GB"),
    });

    sheet.addRow({
      roomID: "",
      category: "",
      numOfRooms: "",
      roomPrice: "Trạng thái",
      totalPrice: booking.paymentInfo?.status,
    });
  }

  //
  const row = sheet.getRow(18);
  row.eachCell((cell, rowNumber) => {
    sheet.getColumn(rowNumber).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getColumn(rowNumber).font = { size: 12, family: 2 };
  });

  const cellLeft = [
    "B1",
    "B2",
    "B3",
    "D6",
    "D7",
    "A9",
    "B10",
    "B11",
    "B12",
    "B13",
    "B14",
    "B15",
    "A17",
    "D22",
    "D23",
    "D24",
    "D25",
    "D26",
    "D27",
    "D28",
    "E23",
    "E24",
    "E25",
    "E26",
    "E27",
    "E28",
  ];
  cellLeft.forEach(
    (e) =>
      (sheet.getCell(e).alignment = {
        vertical: "middle",
        horizontal: "left",
      })
  );

  const writeFile = (fileName, content) => {
    const link = document.createElement("a");
    const blob = new Blob([content], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  workbook.xlsx.writeBuffer().then((buffer) => {
    writeFile(sheetName, buffer);
  });
};

const exportExcel = (statistic, user, users, rooms, bookings, totalAmount) => {
  const sheetName = statistic.replaceAll(" ", "_") + ".xlsx";

  const workbook = new ExcelJs.Workbook();
  const sheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: false }],
  });

  // Tiêu đề
  sheet.getRow(1).values = ["RR", "WEBSITE ĐĂNG TIN & ĐẶT PHÒNG", "", ""];
  sheet.getRow(2).values = ["", "Địa chỉ: xx xx xx xx xx", "", ""];
  sheet.getRow(3).values = ["", "Liên hệ: 0123456798", "", ""];
  sheet.mergeCells(`A1:A3`);
  sheet.mergeCells(`B1:D1`);
  sheet.mergeCells(`B2:D2`);
  sheet.mergeCells(`B3:D3`);

  // Thanh thông tin (Danh sách phòng/DS dặt phòng/DS người dùng)
  sheet.getCell("A5").value = {
    richText: [
      {
        font: { size: 22, bold: true, color: { argb: "FF0000" } },
        text: statistic,
      },
    ],
  };
  sheet.mergeCells(`A5:I5`);
  sheet.getRow(5).height = 40;

  // Thông tin quản lý
  sheet.getCell("A7").value = {
    richText: [
      {
        font: { size: 16, bold: true },
        text: "Thông tin quản lý",
      },
    ],
  };
  sheet.getRow(8).values = ["Nhóm 01", "Nguyễn Đức Tuệ"];
  sheet.getRow(9).values = ["", "Đỗ Văn Vũ"];
  sheet.getRow(10).values = ["", "Trần Hữu Quang"];
  sheet.getRow(11).values = ["", "Nguyễn Huy Bách"];
  sheet.getRow(12).values = ["Lớp", "IT-LTU K64"];
  sheet.mergeCells(`A8:A11`);

  // Thông tin người xuất
  sheet.getCell("A14").value = {
    richText: [
      {
        font: { size: 16, bold: true },
        text: "Thông tin người thực hiện",
      },
    ],
  };
  sheet.getRow(15).values = ["Email", user.email];
  sheet.getRow(16).values = ["Họ tên", user.name];
  sheet.getRow(17).values = ["Số điện thoại", user.phoneNumber];
  sheet.getRow(18).values = [
    "Thời gian",
    new Date(Date.now()).toLocaleString("en-GB"),
  ];

  sheet.getCell("A20").value = {
    richText: [
      {
        font: { size: 16, bold: true },
        text:
          statistic === "Danh sách phòng"
            ? "Thông tin phòng"
            : statistic === "Danh sách đặt phòng"
            ? "Thông tin đặt phòng"
            : "Thông tin người dùng",
      },
    ],
  };

  // Danh sách Phòng
  if (statistic === "Danh sách phòng") {
    sheet.getRow(21).values = [
      "Mã phòng",
      "Tên phòng",
      "Loại phòng",
      "Mô tả",
      "Giá",
      "Địa chỉ",
      "lat",
      "lng",
      "Diện tích",
      "Người đăng",
      "",
      "",
      "",
      "",
      "",
      "Số phòng",
      "Đối tượng",
      "Trạng thái",
      "Ảnh",
      "Đánh giá",
      "Thời gian đăng",
    ];
    sheet.getRow(22).values = [
      "Mã phòng",
      "Tên phòng",
      "Loại phòng",
      "Mô tả",
      "Giá",
      "Địa chỉ",
      "lat",
      "lng",
      "Diện tích",
      "ID",
      "Avatar",
      "Email",
      "Họ tên",
      "SĐT",
      "TG tạo",
      "Số phòng",
      "Đối tượng",
      "Trạng thái",
      "Ảnh",
      "Đánh giá",
      "Thời gian đăng",
    ];

    sheet.columns = [
      { key: "roomID", width: 30 },
      { key: "roomName", width: 50 },
      { key: "category", width: 15 },
      { key: "description", width: 50 },
      { key: "price", width: 20 },
      { key: "address", width: 50 },
      { key: "lat", width: 10 },
      { key: "lng", width: 10 },
      { key: "area", width: 15 },
      { key: "userID", width: 30 },
      { key: "avatar", width: 30 },
      { key: "email", width: 30 },
      { key: "userName", width: 30 },
      { key: "phoneNumber", width: 15 },
      { key: "userCreatedAt", width: 15 },
      { key: "numOfRooms", width: 10 },
      { key: "tenant", width: 10 },
      { key: "status", width: 15 },
      { key: "images", width: 30 },
      { key: "raing", width: 10 },
      { key: "roomCreatedAt", width: 15 },
    ];

    let roomData = [];
    rooms.map((room) =>
      roomData.push({
        roomID: room._id,
        roomName: room.name,
        description: room.description,
        price: room.price.toLocaleString("en-us") + " VNĐ",
        address: room.address,
        lat: room.lat,
        lng: room.lng,
        area: room.area + " m2",
        category: room.category,
        userID: room.user?._id,
        avatar: room.user?.avatar?.url || "-",
        email: room.user?.email,
        userName: room.user?.name || "-",
        phoneNumber: room.user?.phoneNumber || "-",
        userCreatedAt: room.user?.createdAt
          ? new Date(room.user?.createdAt).toLocaleString("en-GB").split(",")[0]
          : "-",
        numOfRooms: room.numOfRooms,
        tenant: room.tenant,
        status: room.status,
        images: room.images[0]?.url,
        raing: room.rating,
        roomCreatedAt: new Date(room.createdAt)
          .toLocaleString("en-GB")
          .split(",")[0],
      })
    );
    sheet.addRows(roomData);

    sheet.mergeCells(`J21:O21`);
    sheet.mergeCells("A21:A22");
    sheet.mergeCells("B21:B22");
    sheet.mergeCells("C21:C22");
    sheet.mergeCells("D21:D22");
    sheet.mergeCells("E21:E22");
    sheet.mergeCells("F21:F22");
    sheet.mergeCells("G21:G22");
    sheet.mergeCells("H21:H22");
    sheet.mergeCells("I21:I22");
    sheet.mergeCells("P21:P22");
    sheet.mergeCells("Q21:Q22");
    sheet.mergeCells("R21:R22");
    sheet.mergeCells("S21:S22");
    sheet.mergeCells("T21:T22");
    sheet.mergeCells("U21:U22");
  } else if (statistic === "Danh sách đặt phòng") {
    sheet.getRow(21).values = [
      "Mã đặt phòng",
      "Mã phòng",
      "Thông tin người đặt",
      "",
      "",
      "",
      "Ngày đặt",
      "Ngày nhận",
      "Thông tin thanh toán",
      "",
      "",
      "Số phòng",
      "Giá phòng",
      "Tổng giá",
    ];
    sheet.getRow(22).values = [
      "Mã đặt phòng",
      "Mã phòng",
      "ID",
      "Email",
      "Họ tên",
      "SĐT",
      "Ngày đặt",
      "Ngày nhận",
      "Hình thức",
      "Thanh toán",
      "Trạng thái",
      "Số phòng",
      "Giá phòng",
      "Tổng giá",
    ];

    sheet.columns = [
      { key: "_id", width: 30 },
      { key: "roomID", width: 30 },
      { key: "userID", width: 30 },
      { key: "email", width: 30 },
      { key: "name", width: 20 },
      { key: "phoneNumber", width: 20 },
      { key: "createdAt", width: 25 },
      { key: "checkInDate", width: 25 },
      { key: "type", width: 20 },
      { key: "paidAt", width: 25 },
      { key: "status", width: 20 },
      { key: "nor", width: 10 },
      { key: "roomPrice", width: 20 },
      { key: "totalPrice", width: 20 },
    ];

    let bookingData = [];
    bookings.map((book) =>
      bookingData.push({
        _id: book._id,
        roomID: book.room,
        userID: book.user?._id,
        email: book.user?.email,
        name: book.user?.name || "",
        phoneNumber: book.user?.phoneNumber || "",
        createdAt: new Date(book.createdAt).toLocaleString("en-GB"),
        checkInDate: new Date(book.checkInDate).toLocaleString("en-GB"),
        type: book.status,
        paidAt: book.paidAt
          ? new Date(book.paidAt).toLocaleString("en-GB")
          : "",
        status: book.paymentInfo?.status || "",
        nor: book.numOfRooms,
        roomPrice: book.roomPrice.toLocaleString("en-US") + " VNĐ",
        totalPrice: book.totalPrice.toLocaleString("en-US") + " VNĐ",
      })
    );
    sheet.addRows(bookingData);

    // Tổng giá trị
    const index = (23 + bookings.length + 1).toString();
    sheet.getCell(`M${index}`).value = {
      richText: [
        {
          font: { size: 16, bold: true, color: { argb: "FF0000" } },
          text:
            "Tổng giá trị: " + totalAmount?.toLocaleString("en-US") + " VNĐ",
        },
      ],
    };
    sheet.mergeCells(`M${index}:N${index}`);

    sheet.mergeCells(`C21:F21`);
    sheet.mergeCells("A21:A22");
    sheet.mergeCells("B21:B22");
    sheet.mergeCells("G21:G22");
    sheet.mergeCells("H21:H22");
    sheet.mergeCells(`I21:K21`);
    sheet.mergeCells("L21:L22");
    sheet.mergeCells("M21:M22");
    sheet.mergeCells("N21:N22");
  } else {
    sheet.getRow(21).values = [
      "ID",
      "Avatar",
      "",
      "Email",
      "Họ tên",
      "SĐT",
      "Ngày tạo",
      "Vai trò",
    ];
    sheet.getRow(22).values = [
      "ID",
      "Avatar ID",
      "Url",
      "Email",
      "Họ tên",
      "SĐT",
      "Ngày tạo",
      "Vai trò",
    ];

    sheet.columns = [
      { key: "_id", width: 30 },
      { key: "public_id", width: 35 },
      { key: "url", width: 35 },
      { key: "email", width: 30 },
      { key: "name", width: 20 },
      { key: "phoneNumber", width: 20 },
      { key: "createdAt", width: 25 },
      { key: "role", width: 10 },
    ];

    let userData = [];
    users.map((user) =>
      userData.push({
        _id: user._id,
        public_id: user.avatar?.public_id || "-",
        url: user.avatar?.url || "-",
        email: user.email,
        name: user.name || "",
        phoneNumber: user.phoneNumber || "",
        createdAt: new Date(user.createdAt).toLocaleString("en-GB"),
        role: user.role,
      })
    );
    sheet.addRows(userData);

    sheet.mergeCells(`B21:C21`);
    sheet.mergeCells("A21:A22");
    sheet.mergeCells("D21:D22");
    sheet.mergeCells("E21:E22");
    sheet.mergeCells("F21:F22");
    sheet.mergeCells(`G21:G22`);
    sheet.mergeCells("H21:H22");
  }

  const row = sheet.getRow(21);
  row.eachCell((cell, rowNumber) => {
    sheet.getColumn(rowNumber).alignment = {
      vertical: "middle",
      horizontal: "center",
    };
    sheet.getColumn(rowNumber).font = { size: 12, family: 2 };
  });

  const cellLeft = [
    "B1",
    "B2",
    "B3",
    "A7",
    "A14",
    "A20",
    "B8",
    "B9",
    "B10",
    "B15",
    "B16",
    "B17",
    "B18",
    "B11",
    "B12",
  ];
  cellLeft.forEach(
    (e) =>
      (sheet.getCell(e).alignment = {
        vertical: "middle",
        horizontal: "left",
      })
  );

  const writeFile = (fileName, content) => {
    const link = document.createElement("a");
    const blob = new Blob([content], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    link.download = fileName;
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  workbook.xlsx.writeBuffer().then((buffer) => {
    writeFile(sheetName, buffer);
  });
};

export { printBookingConfirmation, exportExcel };
