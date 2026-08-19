## Bước 1: Xác định business context và business problem, những khó khăn vấn đề khách hàng đang gặp phải
Business Context

Công ty ABC cung cấp dịch vụ đặt xe trực tuyến thông qua tổng đài và ứng dụng hiện tại. Doanh nghiệp có ba nhóm người dùng chính gồm khách hàng, tài xế và nhân viên vận hành. ABC đang có định hướng xây dựng một nền tảng CAB System mới để quản lý toàn bộ quy trình từ đặt xe, tìm và phân công tài xế, thực hiện chuyến, tính cước, thanh toán, thông báo đến đánh giá. Hệ thống mới cần phục vụ số lượng lớn khách hàng và tài xế, đồng thời có kiến trúc linh hoạt để có thể mở rộng thêm dịch vụ, phương thức thanh toán và các thành phần kỹ thuật trong tương lai. Dự án dự kiến được xây dựng và triển khai trong 7 tuần.

Business Problem

Hệ thống hiện tại của ABC còn nhiều hạn chế trong việc tự động hóa và quản lý tập trung hoạt động đặt xe. Việc tìm và phân công tài xế chủ yếu được thực hiện thủ công, khách hàng khó theo dõi trạng thái chuyến đi, thông tin thanh toán chưa được quản lý tập trung và bộ phận vận hành gặp khó khăn trong việc theo dõi, xử lý và khai thác dữ liệu. Bên cạnh đó, hệ thống hiện tại chưa đáp ứng tốt yêu cầu mở rộng quy mô và chưa có cơ chế đủ linh hoạt để xử lý các vấn đề như tài xế từ chối/không phản hồi, thanh toán thất bại, thông báo lỗi hoặc tải tăng cao. Doanh nghiệp cũng chưa xác định rõ một số quy tắc nghiệp vụ quan trọng như cách tính cước, tiêu chí ưu tiên tài xế, thời gian phản hồi và chính sách hủy chuyến, gây khó khăn cho việc xác định và phát triển giải pháp.

## Bước 2: Xác định stack holders lập bảng (danh sách và vai trò), vẽ stackholders matrix thể hiện sức ảnh hưởng của nhân vật đó với hệ thống

STAKEHOLDER LIST & ROLES

| # | Stakeholder | Vai trò sử dụng hệ thống | Các chức năng chính |
|---|---|---|---|
| ST01 | Khách hàng | Người sử dụng dịch vụ đặt xe | Đăng ký/đăng nhập, cập nhật thông tin, đặt xe, theo dõi chuyến, thanh toán, xem lịch sử, đánh giá tài xế |
| ST02 | Tài xế | Người thực hiện chuyến xe thông qua hệ thống | Quản lý hồ sơ, quản lý phương tiện, bật/tắt trạng thái nhận chuyến, nhận/từ chối chuyến, cập nhật trạng thái chuyến, cập nhật vị trí |
| ST03 | Nhân viên vận hành | Người quản lý và giám sát hoạt động của hệ thống | Quản lý khách hàng, tài xế, phương tiện, chuyến đi, xử lý sự cố, tra cứu giao dịch, theo dõi hoạt động và báo cáo |

Stackholders matrix

| Stakeholder | Mức độ ảnh hưởng | Mức độ sử dụng | Mức độ quan trọng |
|---|---|---|---|
| Khách hàng | Cao | Cao | Cao |
| Tài xế | Cao | Cao | Cao |
| Nhân viên vận hành | Rất cao | Cao | Rất cao |

## Bước 3: Xác định business goal, mục đích của business goal là gì, không cố biến tất cả ý muốn của khách hàng thành chức năng.

BUSINESS GOALS

| Mã BG | Business Goal | Mục đích của Business Goal |
|---|---|---|
| BG01 | **Tự động hóa và nâng cao hiệu quả quy trình đặt xe** | Giảm sự phụ thuộc vào việc phân công tài xế thủ công, rút ngắn thời gian xử lý yêu cầu và nâng cao hiệu quả vận hành |
| BG02 | **Cải thiện trải nghiệm và mức độ hài lòng của khách hàng** | Giúp khách hàng có trải nghiệm đặt xe minh bạch, thuận tiện và có thể nắm được tình trạng chuyến đi |
| BG03 | **Tối ưu hóa việc sử dụng nguồn lực tài xế** | Sử dụng hiệu quả đội ngũ tài xế bằng cách phân bổ chuyến phù hợp và giảm thời gian tài xế chờ chuyến |
| BG04 | **Nâng cao khả năng kiểm soát và quản lý hoạt động vận hành** | Giúp doanh nghiệp theo dõi toàn bộ hoạt động đặt xe, chuyến đi, tài xế và xử lý các vấn đề phát sinh kịp thời |
| BG05 | **Quản lý tập trung dữ liệu và giao dịch** | Tạo nguồn dữ liệu thống nhất để doanh nghiệp dễ dàng tra cứu, đối soát, quản lý doanh thu và hỗ trợ ra quyết định |
| BG06 | **Đảm bảo hệ thống có khả năng mở rộng theo quy mô kinh doanh** | Cho phép hệ thống đáp ứng số lượng khách hàng, tài xế và chuyến đi ngày càng tăng mà không làm suy giảm đáng kể chất lượng dịch vụ |
| BG07 | **Tăng khả năng phát triển và thích ứng của nền tảng** | Cho phép doanh nghiệp bổ sung dịch vụ, phương thức thanh toán và các kênh thông báo mới mà không phải xây dựng lại toàn bộ hệ thống |
| BG08 | **Đảm bảo tính liên tục và ổn định của dịch vụ** | Hạn chế việc lỗi ở một thành phần như thanh toán hoặc thông báo làm ảnh hưởng đến toàn bộ hoạt động đặt xe |
| BG09 | **Đảm bảo an toàn và kiểm soát dữ liệu** | Bảo vệ thông tin khách hàng, tài xế, phương tiện, vị trí và giao dịch; đồng thời tăng khả năng kiểm tra và truy vết khi có sự cố |
| BG10 | **Nâng cao khả năng quản lý và ra quyết định dựa trên dữ liệu** | Cung cấp thông tin về số lượng chuyến, doanh thu, tỷ lệ hoàn thành, tỷ lệ hủy và hiệu quả tài xế để hỗ trợ quản lý doanh nghiệp |

## Bước 4: Xác định scope của project.


| Mã BG | Business Goal | In Scope của Project | Out of Scope của Project |
|---|---|---|---|
| BG01 | Tự động hóa và nâng cao hiệu quả quy trình đặt xe | Đặt xe, tìm kiếm tài xế, tự động phân công tài xế, xử lý tài xế từ chối/không phản hồi, cập nhật trạng thái chuyến | Tối ưu toàn bộ hoạt động kinh doanh ngoài quy trình đặt xe |
| BG02 | Cải thiện trải nghiệm và mức độ hài lòng của khách hàng | Đăng ký/đăng nhập, quản lý thông tin cá nhân, đặt xe, theo dõi chuyến, xem thông tin tài xế, xem lịch sử, đánh giá tài xế | Các chương trình chăm sóc khách hàng hoặc marketing không liên quan trực tiếp đến hệ thống đặt xe |
| BG03 | Tối ưu hóa việc sử dụng nguồn lực tài xế | Quản lý trạng thái tài xế, nhận/từ chối chuyến, tìm tài xế dựa trên vị trí và trạng thái, lưu thông tin vị trí tài xế | Quản lý lương, thưởng, tuyển dụng và đào tạo tài xế |
| BG04 | Nâng cao khả năng kiểm soát và quản lý hoạt động vận hành | Giao diện quản trị, quản lý khách hàng, tài xế, phương tiện, chuyến đi, theo dõi chuyến đang diễn ra, xử lý sự cố | Quản lý các hoạt động nội bộ không liên quan đến vận hành dịch vụ đặt xe |
| BG05 | Quản lý tập trung dữ liệu và giao dịch | Quản lý thông tin khách hàng, tài xế, phương tiện, chuyến đi, lịch sử chuyến và giao dịch thanh toán | Lưu trữ thông tin nhạy cảm của thẻ/tài khoản thanh toán; dữ liệu không phục vụ hoạt động CAB |
| BG06 | Đảm bảo hệ thống có khả năng mở rộng theo quy mô kinh doanh | Thiết kế kiến trúc có khả năng mở rộng, tách biệt các thành phần, hỗ trợ tải cao và mở rộng độc lập | Mở rộng hạ tầng vật lý không nằm trong phạm vi triển khai hiện tại nếu chưa được yêu cầu |
| BG07 | Tăng khả năng phát triển và thích ứng của nền tảng | Thiết kế kiến trúc cho phép bổ sung loại dịch vụ, phương thức thanh toán và nhà cung cấp thông báo trong tương lai | Phát triển tất cả các dịch vụ hoặc phương thức thanh toán mới ngay trong giai đoạn 7 tuần |
| BG08 | Đảm bảo tính liên tục và ổn định của dịch vụ | Xử lý lỗi và ngoại lệ, khả năng hoạt động độc lập giữa các thành phần, xử lý thanh toán/thông báo thất bại, khả năng phục hồi phù hợp | Đảm bảo hệ thống không bao giờ xảy ra lỗi hoặc xây dựng hệ thống dự phòng ở quy mô ngoài yêu cầu dự án |
| BG09 | Đảm bảo an toàn và kiểm soát dữ liệu | Xác thực, phân quyền, bảo vệ dữ liệu cá nhân/vị trí/giao dịch, audit log cho các thao tác quan trọng | Xây dựng hệ thống an ninh mạng toàn doanh nghiệp hoặc quản lý bảo mật của các hệ thống không thuộc CAB |
| BG10 | Nâng cao khả năng quản lý và ra quyết định dựa trên dữ liệu | Báo cáo số lượng chuyến, doanh thu, tỷ lệ hoàn thành, tỷ lệ hủy và hiệu quả tài xế | Các hệ thống BI/DWH toàn doanh nghiệp hoặc các báo cáo không liên quan đến hoạt động CAB |

| # | Scope Area | Nội dung chính |
|---|---|---|
| SC01 | Quản lý tài khoản | Đăng ký, đăng nhập, cập nhật thông tin khách hàng và tài xế |
| SC02 | Đặt xe | Nhập điểm đón, điểm đến, lựa chọn loại xe và tạo yêu cầu đặt xe |
| SC03 | Tìm và phân công tài xế | Xác định tài xế phù hợp, ưu tiên tài xế gần, xử lý từ chối/không phản hồi |
| SC04 | Quản lý chuyến đi | Theo dõi và cập nhật trạng thái từ lúc tạo yêu cầu đến khi hoàn thành |
| SC05 | Quản lý tài xế | Hồ sơ, phương tiện, trạng thái hoạt động và vị trí |
| SC06 | Tính cước và thanh toán | Tính giá chuyến, thanh toán tiền mặt/điện tử, xử lý thanh toán thất bại |
| SC07 | Thông báo | Thông báo cho khách hàng và tài xế về các sự kiện quan trọng của chuyến |
| SC08 | Đánh giá | Khách hàng đánh giá tài xế sau khi hoàn thành chuyến |
| SC09 | Quản trị vận hành | Quản lý khách hàng, tài xế, phương tiện, chuyến đi và xử lý sự cố |
| SC10 | Báo cáo | Báo cáo chuyến đi, doanh thu, tỷ lệ hoàn thành, hủy chuyến và hiệu quả tài xế |
| SC11 | Bảo mật và phân quyền | Xác thực, phân quyền, bảo vệ dữ liệu và lưu vết thao tác |
| SC12 | Khả năng mở rộng và ổn định | Kiến trúc hỗ trợ mở rộng độc lập, xử lý lỗi và hạn chế ảnh hưởng dây chuyền |

## Bước 5: Sau khi gặp khách hàng, chuyển đổi thành business requirement.

| Mã BR | Business Requirement | Mục tiêu liên quan | Phạm vi |
|---|---|---|---|
| BR01 | Doanh nghiệp cần tự động hóa quy trình tiếp nhận và xử lý yêu cầu đặt xe từ khi khách hàng tạo yêu cầu đến khi chuyến được hoàn thành | BG01 | In Scope |
| BR02 | Doanh nghiệp cần nâng cao khả năng tìm kiếm và phân công tài xế phù hợp dựa trên vị trí, trạng thái hoạt động và các tiêu chí vận hành | BG01, BG03 | In Scope |
| BR03 | Doanh nghiệp cần đảm bảo yêu cầu đặt xe tiếp tục được xử lý khi tài xế được đề xuất không phản hồi hoặc từ chối chuyến | BG01, BG03 | In Scope |
| BR04 | Doanh nghiệp cần cung cấp cho khách hàng khả năng theo dõi và nắm được tình trạng của chuyến đi trong suốt quá trình sử dụng dịch vụ | BG02 | In Scope |
| BR05 | Doanh nghiệp cần quản lý tập trung thông tin khách hàng, tài xế, phương tiện, chuyến đi và lịch sử hoạt động | BG04, BG05 | In Scope |
| BR06 | Doanh nghiệp cần quản lý tập trung thông tin và kết quả thanh toán của các chuyến đi | BG05 | In Scope |
| BR07 | Doanh nghiệp cần hỗ trợ nhiều phương thức thanh toán và có khả năng tích hợp với các nhà cung cấp thanh toán bên ngoài | BG05, BG07 | In Scope |
| BR08 | Doanh nghiệp cần đảm bảo thông tin nhạy cảm của phương thức thanh toán không được lưu trực tiếp trong CAB System | BG09 | In Scope |
| BR09 | Doanh nghiệp cần cung cấp cơ chế thông báo cho khách hàng và tài xế về các sự kiện quan trọng trong quá trình đặt và thực hiện chuyến | BG02, BG04 | In Scope |
| BR10 | Doanh nghiệp cần có khả năng mở rộng thêm các kênh thông báo trong tương lai mà không phải thay đổi toàn bộ hệ thống | BG07 | In Scope |
| BR11 | Doanh nghiệp cần cung cấp công cụ để nhân viên vận hành theo dõi và quản lý hoạt động đặt xe, tài xế, phương tiện và chuyến đi | BG04 | In Scope |
| BR12 | Doanh nghiệp cần có cơ chế phân quyền đối với các thao tác quản trị và các chức năng nhạy cảm | BG09 | In Scope |
| BR13 | Doanh nghiệp cần có khả năng theo dõi và xử lý các trường hợp chuyến đi, thanh toán hoặc các thành phần liên quan gặp lỗi | BG04, BG08 | In Scope |
| BR14 | Doanh nghiệp cần có báo cáo về số lượng chuyến, doanh thu, tỷ lệ hoàn thành, tỷ lệ hủy và hiệu quả hoạt động của tài xế | BG10 | In Scope |
| BR15 | Doanh nghiệp cần đảm bảo hệ thống có khả năng phục vụ số lượng lớn khách hàng và tài xế khi nhu cầu tăng cao | BG06, BG08 | In Scope |
| BR16 | Doanh nghiệp cần đảm bảo lỗi xảy ra ở một thành phần như thanh toán hoặc thông báo không làm ngừng toàn bộ quy trình đặt xe | BG08 | In Scope |
| BR17 | Doanh nghiệp cần bảo vệ thông tin cá nhân, thông tin phương tiện, dữ liệu vị trí và dữ liệu giao dịch | BG09 | In Scope |
| BR18 | Doanh nghiệp cần lưu vết các thao tác quan trọng để phục vụ kiểm tra và truy vết khi xảy ra sự cố | BG09 | In Scope |
| BR19 | Doanh nghiệp cần xây dựng nền tảng có khả năng bổ sung các loại dịch vụ mới trong tương lai mà không phải xây dựng lại toàn bộ hệ thống | BG07 | In Scope |
| BR20 | Doanh nghiệp cần xác định rõ các chính sách nghiệp vụ còn chưa thống nhất trước khi triển khai phát triển hệ thống | BG01, BG06, BG07 | In Scope – Cần làm rõ |


## Bước 6: Business process, thể hiện các chuỗi quy trình nghiệp vụ.

| Mã BP | Business Process | Mô tả |
|---|---|---|
| BP01 | Quản lý tài khoản | Quản lý đăng ký, đăng nhập và thông tin của khách hàng, tài xế |
| BP02 | Đặt xe | Tiếp nhận thông tin điểm đón, điểm đến, loại xe và tạo yêu cầu đặt xe |
| BP03 | Tìm kiếm và phân công tài xế | Xác định tài xế phù hợp, gửi yêu cầu và xử lý trường hợp từ chối/không phản hồi |
| BP04 | Thực hiện chuyến đi | Tài xế nhận chuyến, đến điểm đón, đón khách, di chuyển và hoàn thành chuyến |
| BP05 | Tính cước và thanh toán | Xác định số tiền phải trả và xử lý thanh toán tiền mặt hoặc điện tử |
| BP06 | Thông báo | Gửi thông báo cho khách hàng và tài xế về các sự kiện trong quá trình đặt và thực hiện chuyến |
| BP07 | Đánh giá chuyến đi | Khách hàng đánh giá tài xế sau khi chuyến hoàn thành |
| BP08 | Quản lý vận hành | Nhân viên vận hành theo dõi, quản lý và xử lý các vấn đề liên quan đến khách hàng, tài xế và chuyến đi |
| BP09 | Quản lý giao dịch và báo cáo | Tra cứu giao dịch, thống kê chuyến, doanh thu, tỷ lệ hoàn thành, hủy và hiệu quả tài xế |

## Bước 7: Phân rã yêu cầu thành chức năng (SR).

| Mã BP | Business Process | Mã SR | Stakeholder Requirement |
|---|---|---|---|
| BP01 | Quản lý tài khoản | SR01 | Khách hàng cần có khả năng đăng ký tài khoản để sử dụng dịch vụ |
| BP01 | Quản lý tài khoản | SR02 | Khách hàng cần có khả năng đăng nhập vào hệ thống |
| BP01 | Quản lý tài khoản | SR03 | Khách hàng cần có khả năng cập nhật thông tin cá nhân |
| BP01 | Quản lý tài khoản | SR04 | Tài xế cần có khả năng đăng nhập và quản lý hồ sơ cá nhân |
| BP01 | Quản lý tài khoản | SR05 | Tài xế cần có khả năng cập nhật thông tin phương tiện |
| BP02 | Đặt xe | SR06 | Khách hàng cần có khả năng nhập điểm đón và điểm đến |
| BP02 | Đặt xe | SR07 | Khách hàng cần có khả năng lựa chọn loại xe/dịch vụ |
| BP02 | Đặt xe | SR08 | Khách hàng cần có khả năng gửi yêu cầu đặt xe |
| BP02 | Đặt xe | SR09 | Khách hàng cần được biết trạng thái xử lý yêu cầu đặt xe |
| BP03 | Tìm kiếm và phân công tài xế | SR10 | Hệ thống cần xác định các tài xế phù hợp với yêu cầu đặt xe |
| BP03 | Tìm kiếm và phân công tài xế | SR11 | Hệ thống cần ưu tiên tài xế dựa trên các tiêu chí vận hành được doanh nghiệp xác định |
| BP03 | Tìm kiếm và phân công tài xế | SR12 | Tài xế cần nhận được thông báo khi có yêu cầu chuyến phù hợp |
| BP03 | Tìm kiếm và phân công tài xế | SR13 | Tài xế cần có khả năng chấp nhận hoặc từ chối chuyến |
| BP03 | Tìm kiếm và phân công tài xế | SR14 | Hệ thống cần tiếp tục tìm tài xế khác khi tài xế được đề xuất từ chối hoặc không phản hồi |
| BP03 | Tìm kiếm và phân công tài xế | SR15 | Khách hàng cần được thông báo khi không tìm được tài xế |
| BP04 | Thực hiện chuyến đi | SR16 | Tài xế cần có khả năng chuyển sang trạng thái sẵn sàng nhận chuyến |
| BP04 | Thực hiện chuyến đi | SR17 | Tài xế cần có khả năng cập nhật trạng thái đã đến điểm đón |
| BP04 | Thực hiện chuyến đi | SR18 | Tài xế cần có khả năng cập nhật trạng thái đã đón khách |
| BP04 | Thực hiện chuyến đi | SR19 | Tài xế cần có khả năng cập nhật trạng thái đang thực hiện chuyến |
| BP04 | Thực hiện chuyến đi | SR20 | Tài xế cần có khả năng cập nhật trạng thái hoàn thành chuyến |
| BP04 | Thực hiện chuyến đi | SR21 | Hệ thống cần ghi nhận vị trí của tài xế trong quá trình thực hiện chuyến |
| BP05 | Tính cước và thanh toán | SR22 | Khách hàng cần biết số tiền phải thanh toán cho chuyến đi |
| BP05 | Tính cước và thanh toán | SR23 | Khách hàng cần có khả năng thanh toán bằng tiền mặt |
| BP05 | Tính cước và thanh toán | SR24 | Khách hàng cần có khả năng thanh toán bằng phương thức điện tử |
| BP05 | Tính cước và thanh toán | SR25 | Khách hàng cần được thông báo kết quả thanh toán |
| BP05 | Tính cước và thanh toán | SR26 | Hệ thống cần hỗ trợ xử lý lại giao dịch thanh toán điện tử thất bại theo chính sách doanh nghiệp |
| BP06 | Thông báo | SR27 | Khách hàng cần nhận được thông báo khi yêu cầu đặt xe được tiếp nhận |
| BP06 | Thông báo | SR28 | Khách hàng cần nhận được thông báo khi tài xế nhận chuyến |
| BP06 | Thông báo | SR29 | Khách hàng cần nhận được thông báo khi tài xế đến điểm đón |
| BP06 | Thông báo | SR30 | Khách hàng cần nhận được thông báo khi chuyến hoàn thành |
| BP06 | Thông báo | SR31 | Tài xế cần nhận được thông báo về chuyến mới và các thay đổi liên quan đến chuyến đang thực hiện |
| BP07 | Đánh giá chuyến đi | SR32 | Khách hàng cần có khả năng đánh giá tài xế sau khi hoàn thành chuyến |
| BP08 | Quản lý vận hành | SR33 | Nhân viên vận hành cần có khả năng quản lý thông tin khách hàng |
| BP08 | Quản lý vận hành | SR34 | Nhân viên vận hành cần có khả năng quản lý thông tin tài xế |
| BP08 | Quản lý vận hành | SR35 | Nhân viên vận hành cần có khả năng quản lý thông tin phương tiện |
| BP08 | Quản lý vận hành | SR36 | Nhân viên vận hành cần có khả năng theo dõi các chuyến đang diễn ra |
| BP08 | Quản lý vận hành | SR37 | Nhân viên vận hành cần có khả năng kiểm tra trạng thái hoạt động của tài xế |
| BP08 | Quản lý vận hành | SR38 | Nhân viên vận hành cần có khả năng hỗ trợ xử lý các trường hợp chuyến bị lỗi |
| BP08 | Quản lý vận hành | SR39 | Hệ thống cần phân quyền các thao tác quản trị theo vai trò nhân viên |
| BP09 | Quản lý giao dịch và báo cáo | SR40 | Nhân viên vận hành cần có khả năng tra cứu lịch sử chuyến đi |
| BP09 | Quản lý giao dịch và báo cáo | SR41 | Nhân viên có quyền cần có khả năng tra cứu lịch sử giao dịch |
| BP09 | Quản lý giao dịch và báo cáo | SR42 | Ban quản lý cần có báo cáo về số lượng chuyến |
| BP09 | Quản lý giao dịch và báo cáo | SR43 | Ban quản lý cần có báo cáo về doanh thu |
| BP09 | Quản lý giao dịch và báo cáo | SR44 | Ban quản lý cần có báo cáo về tỷ lệ chuyến hoàn thành và tỷ lệ hủy |
| BP09 | Quản lý giao dịch và báo cáo | SR45 | Ban quản lý cần có báo cáo về hiệu quả hoạt động của tài xế |


## Bước 8: Business rules, exception.

| Mã BRL | Business Rule | Trạng thái |
|---|---|---|
| BRL01 | Chỉ khách hàng đã được xác thực mới được sử dụng các chức năng yêu cầu tài khoản như đặt xe và xem lịch sử chuyến | Đã xác định |
| BRL02 | Chỉ tài xế có tài khoản hợp lệ và đủ điều kiện hoạt động mới được nhận chuyến | Đã xác định |
| BRL03 | Tài xế chỉ được nhận chuyến khi đang ở trạng thái sẵn sàng nhận chuyến | Đã xác định |
| BRL04 | Hệ thống phải ưu tiên tài xế phù hợp và gần khách hàng theo các tiêu chí vận hành của doanh nghiệp | Chưa xác định tiêu chí cụ thể |
| BRL05 | Khi tài xế từ chối chuyến hoặc không phản hồi trong thời gian quy định, hệ thống phải tiếp tục tìm tài xế khác | Đã xác định về nghiệp vụ |
| BRL06 | Khi không còn tài xế phù hợp, hệ thống phải thông báo cho khách hàng rằng không tìm được tài xế | Đã xác định |
| BRL07 | Chỉ một tài xế được xác nhận nhận một yêu cầu đặt xe tại một thời điểm | Cần xác nhận chi tiết |
| BRL08 | Chuyến đi phải được thực hiện theo trình tự trạng thái nghiệp vụ: nhận chuyến → đến điểm đón → đón khách → đang di chuyển → hoàn thành | Đã xác định |
| BRL09 | Chỉ chuyến đã hoàn thành mới được thực hiện bước tính cước cuối cùng | Đã xác định |
| BRL10 | Số tiền khách hàng phải thanh toán được xác định dựa trên loại dịch vụ và thông tin chuyến đi | Chưa xác định công thức |
| BRL11 | Khách hàng được phép thanh toán bằng tiền mặt hoặc phương thức thanh toán điện tử được doanh nghiệp hỗ trợ | Đã xác định |
| BRL12 | Thông tin nhạy cảm của thẻ hoặc tài khoản thanh toán không được lưu trực tiếp trong CAB System | Đã xác định |
| BRL13 | Khi thanh toán điện tử thất bại, hệ thống phải thông báo cho khách hàng và xử lý lại theo chính sách doanh nghiệp | Đã xác định về nghiệp vụ |
| BRL14 | Khách hàng chỉ được đánh giá tài xế sau khi chuyến đi hoàn thành | Cần xác nhận chi tiết |
| BRL15 | Các thao tác quản trị nhạy cảm chỉ được thực hiện bởi nhân viên có quyền tương ứng | Đã xác định |
| BRL16 | Các thao tác quan trọng trong hệ thống phải được lưu vết để phục vụ kiểm tra và truy vết | Đã xác định |
| BRL17 | Dữ liệu cá nhân, thông tin phương tiện, vị trí và giao dịch phải được bảo vệ khỏi truy cập trái phép | Đã xác định |
| BRL18 | Hệ thống phải cho phép bổ sung loại dịch vụ mới mà không ảnh hưởng đáng kể đến các chức năng hiện tại | Định hướng kiến trúc |
| BRL19 | Hệ thống phải cho phép tích hợp thêm phương thức thanh toán hoặc nhà cung cấp thanh toán trong tương lai | Định hướng kiến trúc |
| BRL20 | Hệ thống phải cho phép mở rộng thêm các kênh thông báo trong tương lai | Định hướng kiến trúc |

| Mã TBD | Business Rule cần làm rõ | Câu hỏi cần xác nhận |
|---|---|---|
| TBD01 | Công thức tính cước | Giá chuyến được tính dựa trên những yếu tố nào? |
| TBD02 | Tiêu chí ưu tiên tài xế | Khoảng cách, thời gian chờ, loại xe, đánh giá hay yếu tố nào khác? |
| TBD03 | Thời gian tài xế phải phản hồi | Tài xế có bao nhiêu giây/phút để chấp nhận hoặc từ chối chuyến? |
| TBD04 | Chính sách hủy chuyến | Ai được phép hủy, thời điểm nào được hủy và có tính phí hay không? |
| TBD05 | Xử lý mất kết nối | Nếu khách hàng hoặc tài xế mất mạng trong từng trạng thái chuyến thì xử lý như thế nào? |
| TBD06 | Thanh toán thất bại | Cho phép thử lại bao nhiêu lần và trong khoảng thời gian nào? |
| TBD07 | Đánh giá tài xế | Khách hàng được đánh giá bao nhiêu lần và trong thời gian bao lâu sau chuyến? |
| TBD08 | Lưu trữ dữ liệu | Dữ liệu chuyến đi, giao dịch, vị trí và audit log được lưu trong bao lâu? |

| Mã EX | Exception | Xảy ra tại quy trình | Cách xử lý nghiệp vụ |
|---|---|---|---|
| EX01 | Không tìm được tài xế | Tìm kiếm tài xế | Thông báo cho khách hàng rằng hiện không có tài xế phù hợp |
| EX02 | Tài xế từ chối chuyến | Phân công tài xế | Tiếp tục tìm và gửi yêu cầu cho tài xế khác |
| EX03 | Tài xế không phản hồi | Phân công tài xế | Sau thời gian quy định, hệ thống chuyển sang tìm tài xế khác |
| EX04 | Nhiều tài xế cùng phản hồi | Phân công tài xế | Hệ thống phải xác định một tài xế được nhận chuyến theo quy tắc phân công |
| EX05 | Thanh toán điện tử thất bại | Thanh toán | Thông báo lỗi và cho phép xử lý lại theo chính sách |
| EX06 | Nhà cung cấp thanh toán không phản hồi | Thanh toán | Ghi nhận giao dịch ở trạng thái phù hợp và xử lý theo cơ chế được xác định |
| EX07 | Mất kết nối của khách hàng | Đặt/thực hiện chuyến | Duy trì trạng thái chuyến và cho phép tiếp tục xử lý khi kết nối được khôi phục |
| EX08 | Mất kết nối của tài xế | Thực hiện chuyến | Xử lý trạng thái tài xế/chuyến theo chính sách vận hành |
| EX09 | Dịch vụ thông báo không hoạt động | Thông báo | Không để lỗi thông báo làm dừng toàn bộ quy trình đặt xe |
| EX10 | Chuyến đi phát sinh sự cố | Thực hiện chuyến | Cho phép nhân viên vận hành kiểm tra và hỗ trợ xử lý |
| EX11 | Người dùng không có quyền thực hiện thao tác | Quản trị | Từ chối thao tác và ghi nhận sự kiện nếu cần |
| EX12 | Dữ liệu đầu vào không hợp lệ | Đặt xe / tài khoản | Thông báo lỗi và yêu cầu người dùng cung cấp thông tin hợp lệ |

## Bước 9: Mô hình hóa dữ liệu (Xác định thực thể mô hình ERD).

## Bước 10: Xác định các non-requirement, các yêu cầu không phải chức năng.

| Mã NFR | Nhóm | Non-Functional Requirement | Mục đích |
|---|---|---|---|
| NFR01 | Performance | Hệ thống phải có khả năng xử lý số lượng lớn yêu cầu đặt xe đồng thời khi nhu cầu tăng cao | Đảm bảo hệ thống đáp ứng được thời điểm cao điểm |
| NFR02 | Performance | Thời gian phản hồi của các thao tác chính phải đủ nhanh để không ảnh hưởng đến trải nghiệm người dùng | Đảm bảo trải nghiệm khách hàng, tài xế và nhân viên vận hành |
| NFR03 | Scalability | Hệ thống phải có khả năng mở rộng khi số lượng khách hàng, tài xế và chuyến đi tăng | Đáp ứng sự phát triển của doanh nghiệp |
| NFR04 | Scalability | Các thành phần của hệ thống phải có khả năng mở rộng độc lập khi tải tăng | Tránh phải mở rộng toàn bộ hệ thống khi chỉ một thành phần chịu tải cao |
| NFR05 | Availability | Hệ thống phải duy trì khả năng hoạt động ổn định trong thời gian cao điểm | Hạn chế gián đoạn dịch vụ |
| NFR06 | Reliability | Lỗi của một thành phần như thanh toán hoặc thông báo không được làm ngừng toàn bộ hệ thống đặt xe | Tăng khả năng chịu lỗi của hệ thống |
| NFR07 | Security | Người dùng phải được xác thực trước khi truy cập các chức năng yêu cầu tài khoản | Ngăn truy cập trái phép |
| NFR08 | Security | Hệ thống phải kiểm soát quyền truy cập dựa trên vai trò người dùng | Bảo vệ các chức năng quản trị và dữ liệu nhạy cảm |
| NFR09 | Security | Thông tin cá nhân, thông tin phương tiện, dữ liệu vị trí và dữ liệu giao dịch phải được bảo vệ | Đảm bảo an toàn dữ liệu |
| NFR10 | Security | Thông tin nhạy cảm của thẻ hoặc tài khoản thanh toán không được lưu trực tiếp trong CAB System | Giảm rủi ro liên quan đến dữ liệu thanh toán |
| NFR11 | Auditability | Hệ thống phải lưu vết các thao tác quan trọng của người dùng và nhân viên quản trị | Hỗ trợ kiểm tra và truy vết sự cố |
| NFR12 | Maintainability | Hệ thống phải có kiến trúc cho phép thay đổi hoặc nâng cấp một thành phần mà hạn chế ảnh hưởng đến các thành phần khác | Dễ bảo trì và phát triển |
| NFR13 | Extensibility | Hệ thống phải có khả năng bổ sung loại dịch vụ mới trong tương lai | Hỗ trợ mở rộng hoạt động kinh doanh |
| NFR14 | Extensibility | Hệ thống phải có khả năng tích hợp thêm phương thức hoặc nhà cung cấp thanh toán | Tăng tính linh hoạt của nền tảng |
| NFR15 | Extensibility | Hệ thống phải có khả năng tích hợp thêm các kênh thông báo mới | Hỗ trợ mở rộng Notification Service |
| NFR16 | Reliability | Hệ thống phải có khả năng xử lý phù hợp khi kết nối mạng bị gián đoạn | Hạn chế mất trạng thái hoặc dữ liệu trong quá trình sử dụng |
| NFR17 | Compatibility | Hệ thống phải có khả năng tích hợp với các dịch vụ bên ngoài như nhà cung cấp thanh toán và thông báo | Đảm bảo khả năng kết nối với hệ thống bên thứ ba |
| NFR18 | Usability | Giao diện dành cho khách hàng và tài xế phải dễ sử dụng và phù hợp với quy trình đặt/thực hiện chuyến | Giảm thời gian học và thao tác |
| NFR19 | Usability | Giao diện quản trị phải hỗ trợ nhân viên vận hành dễ dàng theo dõi và xử lý các chuyến đang diễn ra | Nâng cao hiệu quả vận hành |
| NFR20 | Data Integrity | Dữ liệu chuyến đi, giao dịch và trạng thái phải được đảm bảo tính nhất quán và chính xác | Tránh sai lệch dữ liệu nghiệp vụ |

| Mã | NFR cần làm rõ | Thông tin cần xác nhận |
|---|---|---|
| TBD-NFR01 | Thời gian phản hồi | Thời gian phản hồi tối đa cho từng chức năng là bao nhiêu? |
| TBD-NFR02 | Concurrent Users | Hệ thống cần phục vụ tối đa bao nhiêu người dùng đồng thời? |
| TBD-NFR03 | Availability | Hệ thống yêu cầu mức độ sẵn sàng bao nhiêu %? |
| TBD-NFR04 | Data Retention | Dữ liệu từng loại phải được lưu trữ trong bao lâu? |
| TBD-NFR05 | Recovery | Khi xảy ra sự cố, thời gian khôi phục hệ thống tối đa là bao lâu? |
| TBD-NFR06 | Scalability | Quy mô dự kiến về khách hàng, tài xế và số chuyến trong 1–3 năm tới là bao nhiêu? |

## Bước 11: Vẽ sơ đồ use case, đặc tả use case.

## Bước 12: Tiêu chí chấp nhận (AC).

| Mã AC | Mã SR | Acceptance Criteria | Điều kiện đạt |
|---|---|---|---|
| AC01 | SR01 | Khách hàng có thể đăng ký tài khoản | Khi nhập đầy đủ thông tin hợp lệ, tài khoản được tạo thành công |
| AC02 | SR02 | Khách hàng có thể đăng nhập | Thông tin xác thực hợp lệ thì khách hàng được đăng nhập; thông tin sai thì hệ thống từ chối |
| AC03 | SR06 | Khách hàng có thể nhập thông tin chuyến đi | Hệ thống cho phép nhập điểm đón và điểm đến hợp lệ |
| AC04 | SR07 | Khách hàng có thể lựa chọn loại xe | Hệ thống hiển thị các loại xe/dịch vụ đang được hỗ trợ và cho phép lựa chọn |
| AC05 | SR08 | Khách hàng có thể tạo yêu cầu đặt xe | Khi thông tin đặt xe hợp lệ, yêu cầu được tạo và chuyển sang trạng thái đang tìm tài xế |
| AC06 | SR09 | Khách hàng có thể theo dõi trạng thái yêu cầu | Hệ thống hiển thị đúng trạng thái hiện tại của yêu cầu |
| AC07 | SR10 | Hệ thống tìm được tài xế phù hợp | Hệ thống chỉ đưa vào danh sách các tài xế đáp ứng điều kiện nghiệp vụ |
| AC08 | SR12 | Tài xế nhận được yêu cầu chuyến phù hợp | Khi có chuyến phù hợp, tài xế được thông báo yêu cầu nhận chuyến |
| AC09 | SR13 | Tài xế có thể chấp nhận hoặc từ chối chuyến | Hệ thống ghi nhận chính xác lựa chọn của tài xế |
| AC10 | SR14 | Hệ thống tiếp tục tìm tài xế khi tài xế từ chối | Khi tài xế từ chối hoặc hết thời gian phản hồi, yêu cầu được chuyển sang tài xế khác |
| AC11 | SR15 | Khách hàng được thông báo khi không tìm được tài xế | Khi không còn tài xế phù hợp, trạng thái yêu cầu được cập nhật và khách hàng nhận được thông báo |
| AC12 | SR17 | Tài xế có thể cập nhật trạng thái đã đến điểm đón | Khi tài xế xác nhận đến nơi, trạng thái chuyến được cập nhật tương ứng |
| AC13 | SR18 | Tài xế có thể cập nhật trạng thái đã đón khách | Khi tài xế xác nhận đã đón khách, trạng thái chuyến được cập nhật |
| AC14 | SR19 | Tài xế có thể cập nhật trạng thái đang thực hiện chuyến | Khi chuyến bắt đầu, trạng thái được chuyển sang đang thực hiện |
| AC15 | SR20 | Tài xế có thể hoàn thành chuyến | Khi tài xế xác nhận hoàn thành, chuyến chuyển sang trạng thái hoàn thành |
| AC16 | SR21 | Hệ thống ghi nhận vị trí tài xế | Khi tài xế đang hoạt động, vị trí được ghi nhận theo cơ chế được doanh nghiệp xác định |
| AC17 | SR22 | Khách hàng biết số tiền phải thanh toán | Sau khi chuyến hoàn thành, hệ thống hiển thị số tiền phải trả |
| AC18 | SR23 | Khách hàng có thể thanh toán bằng tiền mặt | Khi chọn tiền mặt, giao dịch được ghi nhận theo quy trình thanh toán tiền mặt |
| AC19 | SR24 | Khách hàng có thể thanh toán điện tử | Khi chọn phương thức điện tử hợp lệ, hệ thống chuyển yêu cầu đến nhà cung cấp thanh toán |
| AC20 | SR25 | Khách hàng nhận được kết quả thanh toán | Hệ thống hiển thị trạng thái thành công hoặc thất bại của giao dịch |
| AC21 | SR26 | Thanh toán thất bại có thể được xử lý lại | Khi giao dịch thất bại, hệ thống cho phép thực hiện lại theo chính sách doanh nghiệp |
| AC22 | SR27-SR31 | Hệ thống gửi thông báo đúng sự kiện | Khi sự kiện tương ứng xảy ra, người dùng liên quan nhận được thông báo |
| AC23 | SR32 | Khách hàng có thể đánh giá tài xế | Sau khi chuyến hoàn thành, khách hàng có thể gửi đánh giá |
| AC24 | SR33-SR35 | Nhân viên vận hành có thể quản lý dữ liệu | Nhân viên có quyền có thể xem và thực hiện các thao tác được cấp quyền |
| AC25 | SR36 | Nhân viên vận hành có thể theo dõi chuyến đang diễn ra | Hệ thống hiển thị danh sách và trạng thái các chuyến đang hoạt động |
| AC26 | SR37 | Nhân viên vận hành có thể kiểm tra trạng thái tài xế | Hệ thống hiển thị trạng thái hoạt động hiện tại của tài xế |
| AC27 | SR38 | Nhân viên có thể hỗ trợ xử lý chuyến lỗi | Nhân viên có quyền có thể thực hiện các thao tác xử lý được doanh nghiệp quy định |
| AC28 | SR39 | Hệ thống kiểm soát quyền quản trị | Người dùng không có quyền không thể thực hiện thao tác bị hạn chế |
| AC29 | SR40-SR41 | Người có quyền có thể tra cứu lịch sử | Hệ thống trả về dữ liệu lịch sử chuyến và giao dịch theo quyền truy cập |
| AC30 | SR42-SR45 | Hệ thống cung cấp báo cáo quản trị | Báo cáo hiển thị đúng các chỉ số được doanh nghiệp yêu cầu |


| Mã AC | Exception | Điều kiện kiểm tra | Kết quả mong đợi |
|---|---|---|---|
| AC-EX01 | Không tìm được tài xế | Không có tài xế nào đáp ứng điều kiện | Khách hàng được thông báo không tìm được tài xế và yêu cầu được cập nhật trạng thái phù hợp |
| AC-EX02 | Tài xế từ chối | Tài xế chọn từ chối chuyến | Hệ thống ghi nhận từ chối và tiếp tục tìm tài xế khác |
| AC-EX03 | Tài xế không phản hồi | Hết thời gian phản hồi | Hệ thống xem yêu cầu là không được phản hồi và tiếp tục tìm tài xế khác |
| AC-EX04 | Thanh toán thất bại | Nhà cung cấp thanh toán trả về kết quả thất bại | Khách hàng nhận được thông báo và có thể xử lý lại theo chính sách |
| AC-EX05 | Nhà cung cấp thanh toán không phản hồi | Không nhận được phản hồi từ nhà cung cấp | Hệ thống không được tự động xác nhận giao dịch thành công khi chưa có kết quả hợp lệ |
| AC-EX06 | Mất kết nối | Người dùng mất kết nối trong quá trình sử dụng | Trạng thái và dữ liệu phải được xử lý theo chính sách mất kết nối đã thống nhất |
| AC-EX07 | Không có quyền | Người dùng cố truy cập chức năng không được cấp quyền | Hệ thống từ chối thao tác |
| AC-EX08 | Thông báo thất bại | Dịch vụ thông báo không hoạt động | Lỗi thông báo không làm dừng toàn bộ quy trình đặt và thực hiện chuyến |

## Bước 13: Truy xuất nguồn gốc yêu cầu.

| Mã BG | Business Goal | Mã BR | Mã BP | Mã SR | Mã AC |
|---|---|---|---|---|---|
| BG01 | Tự động hóa và nâng cao hiệu quả quy trình đặt xe | BR01 | BP02 | SR08, SR09 | AC05, AC06 |
| BG01 | Tự động hóa và nâng cao hiệu quả quy trình đặt xe | BR02 | BP03 | SR10, SR11, SR12, SR13, SR14 | AC07, AC08, AC09, AC10 |
| BG02 | Cải thiện trải nghiệm khách hàng | BR04 | BP02, BP04 | SR09, SR17, SR18, SR19, SR20 | AC06, AC12, AC13, AC14, AC15 |
| BG02 | Cải thiện trải nghiệm khách hàng | BR09 | BP06 | SR27, SR28, SR29, SR30 | AC22 |
| BG02 | Cải thiện trải nghiệm khách hàng | BR10 | BP06 | SR31 | AC22 |
| BG03 | Tối ưu hóa nguồn lực tài xế | BR02 | BP03 | SR10, SR11, SR12, SR13, SR14 | AC07, AC08, AC09, AC10 |
| BG03 | Tối ưu hóa nguồn lực tài xế | BR03 | BP03 | SR14, SR15 | AC10, AC11 |
| BG04 | Nâng cao khả năng quản lý vận hành | BR05 | BP08 | SR33, SR34, SR35, SR36, SR37, SR38 | AC24, AC25, AC26, AC27 |
| BG04 | Nâng cao khả năng quản lý vận hành | BR11 | BP08 | SR33, SR34, SR35, SR36, SR37 | AC24, AC25, AC26 |
| BG05 | Quản lý tập trung dữ liệu và giao dịch | BR05 | BP08, BP09 | SR33-SR41 | AC24-AC29 |
| BG05 | Quản lý tập trung dữ liệu và giao dịch | BR06 | BP05, BP09 | SR22-SR26, SR41 | AC17-AC21, AC29 |
| BG06 | Đảm bảo khả năng mở rộng theo quy mô | BR15 | BP02-BP09 | NFR01, NFR03, NFR04 | AC-NFR01, AC-NFR02 |
| BG07 | Tăng khả năng phát triển và thích ứng | BR07 | BP05 | SR24 | AC19 |
| BG07 | Tăng khả năng phát triển và thích ứng | BR10 | BP06 | SR31 | AC22 |
| BG07 | Tăng khả năng phát triển và thích ứng | BR19 | Toàn hệ thống | NFR13 | AC-NFR06 |
| BG08 | Đảm bảo tính liên tục và ổn định | BR13 | BP08 | SR38 | AC27 |
| BG08 | Đảm bảo tính liên tục và ổn định | BR16 | BP05, BP06 | NFR06, NFR16 | AC-EX04, AC-EX08 |
| BG09 | Đảm bảo an toàn và kiểm soát dữ liệu | BR08 | BP05 | SR24-SR26 | AC19-AC21 |
| BG09 | Đảm bảo an toàn và kiểm soát dữ liệu | BR12 | BP08 | SR39 | AC28 |
| BG09 | Đảm bảo an toàn và kiểm soát dữ liệu | BR17 | Toàn hệ thống | NFR07-NFR10 | AC-NFR04 |
| BG09 | Đảm bảo an toàn và kiểm soát dữ liệu | BR18 | BP08, BP09 | NFR11 | AC-NFR05 |
| BG10 | Nâng cao khả năng quản lý và ra quyết định | BR14 | BP09 | SR42-SR45 | AC30 |

Link tổng quan hệ thống: https://www.systemdesignhandbook.com/guides/design-uber/?utm_source=chatgpt.com

Link nghiệp vụ đặt xe, hoàn thành chuyến: 
https://www.systemdesigninterview.com/guides/system-design-interview-handbook/89-design-a-ridesharing-service-uber-lyft?utm_source=chatgpt.com

https://www.uber.com/nl/en/marketplace/matching/?utm_source=chatgpt.com