
(function () {
    var NetConfigNew;
  
    //load tu firebase trong LoadingView và thay doi trong do
    NetConfigNew = (function () {
        var instance;
        var DEFAULT_CONFIG_GAME = {
          TEN_CONG_GAME : 'bitgame88.com',
          HOST_U: "",
          IS_APPSTORE: false,
          PORTAL: "test",
          HOST: "bitgame88.com",
          FB_LOGIN_URL: "http://fbook.xocdia88.tv/Home/FbLogin",
          BASE_SPIN_HUB_LINK: 'https://providerserver.allwinslots.asia/',
          BASE_LOGIN_LINK: 'https://loginspinhub.bitgame88.com/',
          VERSION : '1.0',
          MERCHANT : "3",
          AgentId : 19,
          MAX_GUN_ROOM_1 : 7,
          PING_TIME: 5,
          RECONNECT_TIME: 5,
          MULTI_PLAYER: false,
          TAIXIU_SOI_CAU_URL : "https://txlive.javx.info/api/live/GetListSoiCau",
          XOCDIA_SOI_CAU_URL: "https://xd.bitgame88.com/api/live/GetListSoiCau",
          XOCDIA_BASE_URL: "https://xd.bitgame88.com/api/live/",
          TAIXIU_BASE_URL: "https://txlive.javx.info/api/live/",
          OTP_TELEGRAM_URL : "https://web.telegram.org/k/#@OtpFreeLiveBot",
          XOC_DIA_LIVE: 'xd.bitgame88.com',
          TAI_XIU_LIVE: 'txlive.javx.info',
          noteRefund : "Nếu muốn tiếp tục chọn cược tiếp",
          deposit_note_1 : "Giao dịch tôi thiểu:               100.000 vnd",
          deposit_note_2 : "Giao dịch tối đa:                  200.000.000 vnd",
          deposit_note_3 : "",
          deposit_note_4 : "Người chuyển chịu chi phí.Nhập chính xác số tiền và nội dung chuyển khoản. Nếu sai sẽ không nhận được tiền",
          deposit_note_5 : "(*)Lưu ý: Chỉ chuyển trực tiếp trong nội bộ ngân hàng hoặc chuyển nhanh 24/7. Nếu chọn chuyển thường sẽ không nhận đuợc tiền(Khác ngân hàng) ",
      
          withdraw_note_1 : "Lượt rút miễn phí trong ngày:     2",
          withdraw_note_2 : "Phí rút:  1%  giá trị giao dịch",
          withdraw_note_3 : "Giao dịch tối thiểu: 50.000 vnd",
          withdraw_note_4 : "Giao dịch tối đa:    200.000.000 vnd",
          withdraw_note_5 : "Lưu ý:\n- Tên tài khoản không viết dấu\n- Kiểm tra chính xác thông tin nhập vào",
          transfer_note_1 : "Giao dịch tôi thiểu:               100.000 vnd",
          transfer_note_2 : "Giao dịch tối đa:                  200.000.000 vnd",
          transfer_note_3 : "",
          transfer_note_4 : "Nhập chính xác tên người nhận. Nếu sai sẽ không nhận được tiền",
          transfer_note_5 : "",
          bankout_note_1 : "Rút tối thiểu: 50.000 vnd",
          bankout_note_2 : "Rút tối đa:    200.000.000 vnd",
          bankout_note_3 : "Lưu ý:\n- Miễn phí lần đầu trong ngày\n- Các lần sau sẽ thu phí 1% giao dịch",
          bankout_note_3 : "Lưu ý:\n- Miễn phí lần đầu trong ngày\n- Các lần sau sẽ thu phí 1% giao dịch",
          VersionBundle : '{"versionVN":1,"dic":[{"n":"Slot_AnKhe","v":4},{"n":"Slot_DragonFire","v":4},{"n":"Slot_Maya","v":4},{"n":"Slot_Sweet","v":4},{"n":"Slot_thaiBlosom","v":4},{"n":"Slot_SonTinh","v":4}]}',
          domainBundleUrl : "https://rs.bitgame88.com/bundle/",
          hotUpdateleUrl : "https://rs.bitgame88.com/",
          linkCSKH : "https://t.me/cskh_o",
          linkTelegram : "https://t.me/cskh_o",
          linkBotTelegram : "https://t.me/bot",
          linkMessenger: "https://rs.bitgame88.com/bundle/",
          Momo_in_note_1 : " Giao dịch  tối thiểu: 50.000 vnd,\n Giao dịch  tối đa:    200.000.000 vnd",
          Momo_in_note_2 : "Tỷ giá nạp: 1-1",
          Momo_in_note_3 : "Quy Định:\n - Không lưu lại số tài khoản chuyển tiền.\n Mỗi lần nạp cần kiểm tra lại thông tin. \n- Không hỗ trợ nếu Sai số tài khoản, nội dung.",
          momoout_note_1 : "Rút tối thiểu: 50.000 vnd",
          momoout_note_2 : "Rút tối đa:    200.000.000 vnd",
          timelive_Start_1 : "11:30:00",
          timelive_End_1 : "17:00:00",
          timelive_Start_2 : "21:30:00",
          timelive_End_2 : "02:00:00",
  
          Live_Notification_TaiXiu : "Chào mừng bạn đến với cổng Xóc Đĩa BitClub. Thời gian chơi từ 12h - 17h và 20h - 02h hàng ngày. Chúc bạn may mắn.",
          Live_Notification_XocDia : "Chào mừng bạn đến với cổng Xóc Đĩa BitClub. Thời gian chơi từ 12h - 17h và 20h - 02h hàng ngày. Chúc bạn may mắn.",
          Note_Regis_Phone : "cách xác thực \nbạn truy cập bot\n 📱 XÁC THỰC OTP : click nút lấy otp telegram \n bấm /start \n chia sẻ sdt và được hệ thống gửi cho bạn 1 \n mã otp bạn lấy otp đó xác thực ạ ",
  
          HotLine: "0388.473.718",
        };
        function NetConfigNew() {
          // Sử dụng Object.assign để tạo một bản sao của DEFAULT_CONFIG_GAME
          this.CONFIG_GAME = Object.assign({}, DEFAULT_CONFIG_GAME);
        }
  
        instance = new NetConfigNew(); // Tạo instance ngay khi khởi tạo
    
        NetConfigNew.getInstance = function () {
          return instance;
        };
    
        // Đưa CONFIG_GAME vào prototype để có thể truy xuất từ mọi instance
        NetConfigNew.prototype.CONFIG_GAME = instance.CONFIG_GAME;
  
        NetConfigNew.prototype.updateConfig = function (newConfig) {
       
          // Cập nhật CONFIG_GAME với các giá trị mới từ newConfig
          Object.assign(instance.CONFIG_GAME, newConfig);
        };
  
        return NetConfigNew;
  
    })();
  
    cc.NetConfigNew = NetConfigNew;
  
  }).call(this);
  
  
  