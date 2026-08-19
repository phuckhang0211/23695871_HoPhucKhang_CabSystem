## Bước 1: Xác định business context và business problem, những khó khăn vấn đề khách hàng đang gặp phải
Business Context:

Công ty ABC cung cấp dịch vụ đặt xe trực tuyến thông qua tổng đài và ứng dụng đơn giản. Do hệ thống hiện tại còn nhiều hạn chế, công ty muốn xây dựng nền tảng CAB mới để quản lý toàn bộ quy trình đặt xe và phục vụ số lượng lớn khách hàng, tài xế.

Business Problem:

Hệ thống hiện tại còn phụ thuộc vào phân công tài xế thủ công, khách hàng khó theo dõi trạng thái chuyến đi, thông tin thanh toán chưa được quản lý tập trung và doanh nghiệp gặp khó khăn trong việc mở rộng hệ thống.

Customer Problems:

Khách hàng gặp khó khăn trong việc theo dõi trạng thái đặt xe và chuyến đi, biết tài xế và thời gian tài xế đến, xử lý trường hợp tài xế không nhận chuyến, nhận thông báo kịp thời và nắm bắt thông tin thanh toán.

## Bước 2: Xác định stack holders lập bảng (danh sách và vai trò), vẽ stackholders matrix thể hiện sức ảnh hưởng của nhân vật đó với hệ thống

Stakeholders trong hệ thống CAB:

STAKEHOLDER LIST & ROLES

┌───────────────────────┬──────────────────────────────────────────────────────────────┐
│ STAKEHOLDER           │ ROLE                                                         │
├───────────────────────┼──────────────────────────────────────────────────────────────┤
│ CUSTOMER              │ Sử dụng hệ thống để đăng ký, đăng nhập, đặt xe, theo dõi     │
│                       │ chuyến đi, xem lịch sử, thanh toán và đánh giá tài xế.       │
├───────────────────────┼──────────────────────────────────────────────────────────────┤
│ DRIVER                │ Sử dụng hệ thống để quản lý hồ sơ, phương tiện, trạng thái   │
│                       │ hoạt động, nhận/từ chối chuyến và cập nhật trạng thái chuyến │
├───────────────────────┼──────────────────────────────────────────────────────────────┤
│ OPERATION STAFF       │ Quản lý khách hàng, tài xế, phương tiện và chuyến đi; theo   │
│                       │ dõi hoạt động và xử lý các chuyến bị lỗi.                    │
└───────────────────────┴──────────────────────────────────────────────────────────────┘

Stackholders matrix:

                    STAKEHOLDER MATRIX
                  POWER / INTEREST MATRIX

                         INTEREST
                LOW                    HIGH
          ┌────────────────────┬────────────────────┐
 HIGH     │                    │                    │
          │                    │  CUSTOMER          │
          │                    │  DRIVER            │
 POWER    │                    │  OPERATION STAFF   │
          │                    │                    │
          ├────────────────────┼────────────────────┤
 LOW      │                    │                    │
          │                    │                    │
          │                    │                    │
          └────────────────────┴────────────────────┘

## Bước 3: Xác định business goal, mục đích của business goal là gì, không cố biến tất cả ý muốn của khách hàng thành chức năng.

BUSINESS GOALS

BG1: Nâng cao hiệu quả vận hành và tự động hóa quy trình đặt xe
Công ty ABC muốn giảm sự phụ thuộc vào các thao tác thủ công trong quá trình vận hành dịch vụ đặt xe, đặc biệt là việc tìm kiếm và phân công tài xế. Hệ thống cần hỗ trợ doanh nghiệp quản lý tập trung quá trình từ khi khách hàng tạo yêu cầu đến khi tài xế được phân công và chuyến đi hoàn thành. Mục tiêu là giúp nhân viên vận hành giảm công việc thủ công, xử lý yêu cầu nhanh hơn và giảm các vấn đề phát sinh trong quá trình điều phối chuyến đi.


BG2: Cải thiện trải nghiệm và khả năng theo dõi chuyến đi của khách hàng
Công ty muốn nâng cao trải nghiệm của khách hàng bằng cách cung cấp thông tin rõ ràng và kịp thời trong toàn bộ quá trình sử dụng dịch vụ. Khách hàng cần có khả năng biết yêu cầu đặt xe đã được tiếp nhận hay chưa, hệ thống đang tìm tài xế, tài xế nào đã nhận chuyến, thời gian dự kiến tài xế đến và trạng thái hiện tại của chuyến đi. Mục tiêu là giảm sự không rõ ràng và giúp khách hàng chủ động hơn trong quá trình sử dụng dịch vụ.


BG3: Nâng cao tính minh bạch và hiệu quả trong quản lý thanh toán
Công ty muốn cải thiện việc quản lý cước phí và thanh toán bằng cách quản lý thông tin giao dịch một cách tập trung và có khả năng xử lý các trường hợp thanh toán không thành công. Hệ thống cần hỗ trợ nhiều phương thức thanh toán và kết nối với nhà cung cấp thanh toán bên ngoài mà không lưu trực tiếp thông tin nhạy cảm của khách hàng. Mục tiêu là tạo ra quy trình thanh toán rõ ràng, an toàn và đáng tin cậy cho cả khách hàng và doanh nghiệp.


BG4: Tăng khả năng mở rộng và phát triển lâu dài của nền tảng
Công ty ABC muốn xây dựng một nền tảng có thể đáp ứng số lượng lớn khách hàng và tài xế khi hoạt động kinh doanh phát triển. Hệ thống cần có kiến trúc đủ linh hoạt để doanh nghiệp có thể bổ sung các loại dịch vụ mới, phương thức thanh toán mới, kênh thông báo mới hoặc thay đổi một số thành phần kỹ thuật mà không phải xây dựng lại toàn bộ ứng dụng. Mục tiêu là đảm bảo hệ thống có thể phát triển cùng với quy mô và nhu cầu kinh doanh của doanh nghiệp.


BG5: Đảm bảo tính ổn định và khả năng duy trì hoạt động của dịch vụ
Doanh nghiệp muốn đảm bảo hệ thống đặt xe vẫn hoạt động ổn định trong những thời điểm nhu cầu tăng cao. Một lỗi xảy ra ở một thành phần như thanh toán hoặc thông báo không được làm cho toàn bộ hệ thống đặt xe ngừng hoạt động. Mục tiêu là hạn chế ảnh hưởng của sự cố đến hoạt động kinh doanh và đảm bảo các chức năng quan trọng của dịch vụ có thể tiếp tục hoạt động.


BG6: Tăng khả năng kiểm soát và đánh giá hoạt động kinh doanh
Ban lãnh đạo muốn có đầy đủ dữ liệu để theo dõi và đánh giá hiệu quả hoạt động của dịch vụ đặt xe. Doanh nghiệp cần theo dõi các chỉ số như số lượng chuyến, doanh thu, tỷ lệ chuyến hoàn thành, tỷ lệ hủy và hiệu quả hoạt động của tài xế. Mục tiêu là cung cấp cơ sở dữ liệu và thông tin cần thiết để doanh nghiệp kiểm soát hoạt động, đánh giá hiệu quả và hỗ trợ việc ra quyết định.


BG7: Nâng cao khả năng quản lý và kiểm soát dữ liệu
Công ty muốn đảm bảo thông tin của khách hàng, tài xế, phương tiện, vị trí và giao dịch được quản lý an toàn. Các chức năng quản trị cần được kiểm soát quyền truy cập và những thao tác quan trọng cần được lưu vết để có thể kiểm tra khi xảy ra sự cố. Mục tiêu là giảm rủi ro liên quan đến dữ liệu và tăng khả năng kiểm soát hoạt động của hệ thống.

## Bước 4: Xác định scope của project.

Phạm vi dự án (Project Scope)

1. Trong phạm vi (In Scope)

- **Quản lý khách hàng:** Đăng ký, đăng nhập, cập nhật thông tin và quản lý lịch sử chuyến đi.

- **Đặt xe:** Nhập điểm đón, điểm đến, lựa chọn loại xe và gửi yêu cầu đặt xe.

- **Tìm và phân công tài xế:** Tìm tài xế phù hợp dựa trên vị trí và trạng thái; tự động tìm tài xế khác nếu tài xế từ chối hoặc không phản hồi.

- **Quản lý chuyến đi:** Theo dõi và cập nhật trạng thái chuyến đi, lưu vị trí tài xế.

- **Quản lý tài xế và phương tiện:** Quản lý hồ sơ, phương tiện và trạng thái hoạt động của tài xế.

- **Thanh toán:** Tính cước, hỗ trợ tiền mặt và thanh toán điện tử, tích hợp với nhà cung cấp thanh toán bên ngoài.

- **Thông báo:** Gửi thông báo về trạng thái đặt xe, chuyến đi và thanh toán cho khách hàng và tài xế.

- **Quản lý vận hành:** Quản lý khách hàng, tài xế, phương tiện, chuyến đi và xử lý các trường hợp lỗi.

- **Báo cáo:** Theo dõi số lượng chuyến, doanh thu, tỷ lệ hoàn thành, tỷ lệ hủy và hiệu quả tài xế.

- **Bảo mật và mở rộng:** Xác thực, phân quyền, bảo vệ dữ liệu và đảm bảo hệ thống có khả năng mở rộng.

2. Các vấn đề cần làm rõ

- Cách tính cước chi tiết.
- Tiêu chí ưu tiên tài xế.
- Thời gian tài xế phải phản hồi.
- Chính sách hủy chuyến.
- Xử lý khi mất kết nối mạng.
- Thời gian lưu trữ dữ liệu.

## Bước 5: Sau khi gặp khách hàng, chuyển đổi thành business requirement.

Business Requirements: 

BR1: Tự động hóa quy trình tìm và phân công tài xế

Hệ thống phải hỗ trợ doanh nghiệp tự động tìm và phân công tài xế phù hợp dựa trên vị trí, trạng thái sẵn sàng và các tiêu chí vận hành, đồng thời tiếp tục tìm tài xế khác khi tài xế không phản hồi hoặc từ chối chuyến.

BR2: Cải thiện khả năng theo dõi chuyến đi

Hệ thống phải cung cấp thông tin trạng thái chuyến đi rõ ràng và kịp thời để khách hàng có thể theo dõi quá trình từ khi yêu cầu đặt xe được tạo cho đến khi chuyến hoàn thành.

BR3: Quản lý tập trung quy trình thanh toán

Hệ thống phải hỗ trợ doanh nghiệp quản lý và theo dõi quá trình tính cước, thanh toán và kết quả giao dịch, bao gồm cả trường hợp thanh toán điện tử thất bại.

BR4: Hỗ trợ quản lý và giám sát hoạt động vận hành

Hệ thống phải cung cấp khả năng quản lý tập trung khách hàng, tài xế, phương tiện và chuyến đi, đồng thời hỗ trợ nhân viên vận hành theo dõi và xử lý các trường hợp phát sinh.

BR5: Cung cấp dữ liệu phục vụ quản lý và ra quyết định

Hệ thống phải cung cấp các thông tin và báo cáo cần thiết để doanh nghiệp theo dõi số lượng chuyến, doanh thu, tỷ lệ hoàn thành, tỷ lệ hủy và hiệu quả hoạt động của tài xế.

BR6: Đảm bảo khả năng mở rộng của nền tảng

Hệ thống phải có khả năng phục vụ số lượng lớn khách hàng và tài xế, đồng thời cho phép doanh nghiệp mở rộng thêm dịch vụ, phương thức thanh toán và các kênh thông báo trong tương lai.

BR7: Đảm bảo an toàn và kiểm soát dữ liệu

Hệ thống phải đảm bảo việc xác thực người dùng, phân quyền quản trị và bảo vệ thông tin cá nhân, phương tiện, vị trí và giao dịch của khách hàng và tài xế.


## Bước 6: Business process, thể hiện các chuỗi quy trình nghiệp vụ.



## Bước 7: Phân rã yêu cầu thành chức năng (SR).

Link tổng quan hệ thống: https://www.systemdesignhandbook.com/guides/design-uber/?utm_source=chatgpt.com

Link nghiệp vụ đặt xe, hoàn thành chuyến: 
https://www.systemdesigninterview.com/guides/system-design-interview-handbook/89-design-a-ridesharing-service-uber-lyft?utm_source=chatgpt.com

https://www.uber.com/nl/en/marketplace/matching/?utm_source=chatgpt.com

## Bước 8: Business rules, exception.

## Bước 9: Mô hình hóa dữ liệu (Xác định thực thể mô hình ERD).

## Bước 10: Xác định các non-requirement, các yêu cầu không phải chức năng.

## Bước 11: Vẽ sơ đồ use case, đặc tả use case.

## Bước 12: Tiêu chí chấp nhận (AC).

## Bước 13: Truy xuất nguồn gốc yêu cầu.