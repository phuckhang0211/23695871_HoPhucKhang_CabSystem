# Danh sách kịch bản kiểm thử

| Scenario ID | Test Scenario | FR được bao phủ | Logic gộp |
|---|---|---|---|
| TS01 | Kiểm tra quản lý tài khoản và hồ sơ người dùng | FR01, FR02, FR03 | Đăng ký → đăng nhập → xem/cập nhật hồ sơ thuộc cùng vòng đời tài khoản. |
| TS02 | Kiểm tra quản lý thông tin phương tiện của tài xế | FR04 | Nghiệp vụ riêng của tài xế, không nên nhập chung với hồ sơ cá nhân. |
| TS03 | Kiểm tra tạo và theo dõi yêu cầu đặt xe | FR05, FR06, FR07 | Nhập thông tin → tạo yêu cầu → theo dõi trạng thái là một luồng đặt xe liên tục. |
| TS04 | Kiểm tra tìm kiếm và phân công tài xế cho yêu cầu đặt xe | FR08, FR09 | Tìm tài xế phù hợp → gửi yêu cầu → ghi nhận phản hồi thuộc cùng quá trình phân công. |
| TS05 | Kiểm tra phản hồi và phân công lại tài xế | FR10, FR11 | Chấp nhận/từ chối/không phản hồi quyết định việc xác nhận hoặc tìm tài xế tiếp theo. |
| TS06 | Kiểm tra quá trình thực hiện chuyến đi | FR12, FR13 | Trạng thái sẵn sàng, trạng thái chuyến và vị trí tài xế cùng phục vụ quá trình thực hiện/theo dõi chuyến. |
| TS07 | Kiểm tra tính cước và thanh toán tiền mặt | FR14, FR15 | Sau khi đủ điều kiện tính cước → xác định số tiền → ghi nhận thanh toán tiền mặt. |
| TS08 | Kiểm tra thanh toán điện tử và xử lý kết quả thanh toán | FR16, FR17 | Gửi giao dịch đến nhà cung cấp → nhận kết quả → thành công/thất bại → xử lý lại. |
| TS09 | Kiểm tra gửi thông báo theo các sự kiện của yêu cầu/chuyến đi | FR18 | Các loại thông báo đã được SRS chủ động gộp thành một FR. |
| TS10 | Kiểm tra đánh giá tài xế sau khi hoàn thành chuyến | FR19 | Nghiệp vụ độc lập sau chuyến. |
| TS11 | Kiểm tra quản lý thông tin khách hàng, tài xế và phương tiện của nhân viên vận hành | FR20, FR21 | Cùng nhóm quản lý dữ liệu vận hành, khác đối tượng dữ liệu. |
| TS12 | Kiểm tra giám sát và hỗ trợ xử lý chuyến trong quá trình vận hành | FR22, FR23 | Theo dõi chuyến/tài xế → phát hiện vấn đề → hỗ trợ xử lý sự cố. |
| TS13 | Kiểm tra phân quyền đối với chức năng quản trị | FR24 | Cross-cutting scenario về quyền, cần giữ riêng để kiểm thử authorized/unauthorized. |
| TS14 | Kiểm tra tra cứu lịch sử chuyến đi và giao dịch | FR25 | SRS đã gộp hai loại tra cứu này vào cùng FR. |
| TS15 | Kiểm tra báo cáo hoạt động CAB | FR26 | Số chuyến, doanh thu, hoàn thành, hủy và hiệu quả tài xế đều là các chỉ số của cùng chức năng báo cáo. |
