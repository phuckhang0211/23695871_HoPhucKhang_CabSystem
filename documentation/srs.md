# CAB System – Đặc tả yêu cầu hệ thống (bản rà soát logic)

> **Mục tiêu rà soát:** kiểm tra tính nhất quán của chuỗi yêu cầu từ Business Goal → Business Requirement → Business Process → Functional Requirement → Business Rule/Exception → Acceptance Criteria → Traceability; loại bỏ các FR không cần thiết, gộp các FR trùng hoặc chỉ là bước con, và đồng bộ lại các mục liên quan.
>
> **Phạm vi rà soát:** dựa trên nội dung của file đặc tả được cung cấp. Các chính sách mà tài liệu gốc đánh dấu là chưa xác định vẫn được giữ ở dạng **TBD**, không tự suy diễn thành quy tắc mới.

---

## Bước 1: Business Context và Business Problem

### Business Context

Công ty ABC cung cấp dịch vụ đặt xe trực tuyến thông qua tổng đài và ứng dụng hiện tại. Doanh nghiệp có ba nhóm người dùng chính gồm **khách hàng, tài xế và nhân viên vận hành**. ABC định hướng xây dựng nền tảng **CAB System** để quản lý tập trung quy trình từ đặt xe, tìm và phân công tài xế, thực hiện chuyến, tính cước, thanh toán, thông báo đến đánh giá.

Hệ thống mới cần phục vụ số lượng lớn khách hàng và tài xế, đồng thời có kiến trúc đủ linh hoạt để có thể mở rộng thêm dịch vụ, phương thức thanh toán và các thành phần kỹ thuật trong tương lai. Dự án dự kiến được xây dựng và triển khai trong **7 tuần**.

### Business Problem

Hệ thống hiện tại còn nhiều hạn chế trong tự động hóa và quản lý tập trung hoạt động đặt xe. Việc tìm và phân công tài xế chủ yếu được thực hiện thủ công; khách hàng khó theo dõi trạng thái chuyến; thông tin thanh toán chưa được quản lý tập trung; bộ phận vận hành gặp khó khăn khi theo dõi, xử lý và khai thác dữ liệu.

Ngoài ra, hệ thống chưa xử lý tốt các trường hợp tài xế từ chối/không phản hồi, thanh toán thất bại, thông báo lỗi hoặc tải tăng cao. Một số chính sách nghiệp vụ quan trọng như công thức tính cước, tiêu chí ưu tiên tài xế, thời gian phản hồi và chính sách hủy chuyến chưa được xác định rõ.

---

## Bước 2: Stakeholder

### Stakeholder List & Roles

| Mã | Stakeholder | Vai trò sử dụng hệ thống | Chức năng chính |
|---|---|---|---|
| ST01 | Khách hàng | Sử dụng dịch vụ đặt xe | Quản lý tài khoản, đặt xe, theo dõi chuyến, thanh toán, xem lịch sử, đánh giá |
| ST02 | Tài xế | Thực hiện chuyến xe thông qua hệ thống | Quản lý hồ sơ/phương tiện, bật/tắt nhận chuyến, nhận/từ chối chuyến, cập nhật chuyến, cập nhật vị trí |
| ST03 | Nhân viên vận hành | Giám sát và xử lý hoạt động vận hành | Quản lý dữ liệu, theo dõi chuyến, kiểm tra tài xế, xử lý sự cố, tra cứu giao dịch, báo cáo |

### Stakeholder Matrix

| Stakeholder | Mức độ ảnh hưởng | Mức độ sử dụng | Mức độ quan trọng |
|---|---|---|---|
| Khách hàng | Cao | Cao | Cao |
| Tài xế | Cao | Cao | Cao |
| Nhân viên vận hành | Rất cao | Cao | Rất cao |

---

## Bước 3: Business Goals

| Mã BG | Business Goal | Mục đích |
|---|---|---|
| BG01 | Tự động hóa và nâng cao hiệu quả quy trình đặt xe | Giảm phụ thuộc vào phân công tài xế thủ công và rút ngắn thời gian xử lý yêu cầu |
| BG02 | Cải thiện trải nghiệm và mức độ hài lòng của khách hàng | Giúp khách hàng đặt xe thuận tiện, minh bạch và theo dõi được chuyến |
| BG03 | Tối ưu hóa việc sử dụng nguồn lực tài xế | Phân bổ chuyến phù hợp và giảm thời gian tài xế chờ chuyến |
| BG04 | Nâng cao khả năng kiểm soát và quản lý hoạt động vận hành | Giúp vận hành theo dõi và xử lý kịp thời các vấn đề |
| BG05 | Quản lý tập trung dữ liệu và giao dịch | Tập trung dữ liệu khách hàng, tài xế, chuyến đi và thanh toán |
| BG06 | Đảm bảo hệ thống có khả năng mở rộng theo quy mô kinh doanh | Có thể đáp ứng số lượng người dùng và chuyến đi tăng |
| BG07 | Tăng khả năng phát triển và thích ứng của nền tảng | Cho phép mở rộng dịch vụ, thanh toán và kênh thông báo |
| BG08 | Đảm bảo tính liên tục và ổn định của dịch vụ | Hạn chế lỗi của một thành phần ảnh hưởng đến toàn bộ quy trình |
| BG09 | Đảm bảo an toàn và kiểm soát dữ liệu | Bảo vệ dữ liệu cá nhân, vị trí, phương tiện và giao dịch |
| BG10 | Nâng cao khả năng quản lý và ra quyết định dựa trên dữ liệu | Cung cấp các chỉ số phục vụ quản lý hoạt động CAB |

---

## Bước 4: Scope

### Scope theo Business Goal

| Mã BG | In Scope | Out of Scope |
|---|---|---|
| BG01 | Tiếp nhận yêu cầu, tìm và phân công tài xế, xử lý từ chối/không phản hồi, quản lý trạng thái chuyến | Tối ưu toàn bộ hoạt động kinh doanh ngoài dịch vụ đặt xe |
| BG02 | Tài khoản, đặt xe, theo dõi chuyến, thông tin tài xế, lịch sử, đánh giá | Marketing và chăm sóc khách hàng không trực tiếp phục vụ quy trình đặt xe |
| BG03 | Trạng thái nhận chuyến, tìm tài xế theo điều kiện vận hành, vị trí tài xế | Lương, thưởng, tuyển dụng và đào tạo tài xế |
| BG04 | Quản trị khách hàng, tài xế, phương tiện, chuyến, theo dõi và hỗ trợ sự cố | Hoạt động nội bộ không liên quan đến vận hành CAB |
| BG05 | Dữ liệu khách hàng, tài xế, phương tiện, chuyến đi, lịch sử và kết quả thanh toán | Lưu trực tiếp thông tin nhạy cảm của thẻ/tài khoản thanh toán |
| BG06 | Kiến trúc và các thành phần có khả năng mở rộng | Mở rộng hạ tầng vật lý ngoài yêu cầu dự án |
| BG07 | Kiến trúc cho phép bổ sung dịch vụ, phương thức thanh toán và kênh thông báo | Phát triển toàn bộ dịch vụ mới trong giai đoạn 7 tuần |
| BG08 | Xử lý lỗi, ngoại lệ, thanh toán/thông báo thất bại và phục hồi phù hợp | Cam kết hệ thống không bao giờ xảy ra lỗi |
| BG09 | Xác thực, phân quyền, bảo vệ dữ liệu và audit log | Bảo mật toàn bộ hệ thống CNTT của doanh nghiệp |
| BG10 | Báo cáo chuyến, doanh thu, hoàn thành, hủy và hiệu quả tài xế | BI/DWH toàn doanh nghiệp |

### Scope Areas

| Mã | Scope Area | Nội dung chính |
|---|---|---|
| SC01 | Quản lý tài khoản | Đăng ký/đăng nhập và quản lý thông tin người dùng |
| SC02 | Đặt xe | Nhập điểm đón, điểm đến, loại xe và tạo yêu cầu |
| SC03 | Tìm và phân công tài xế | Xác định tài xế phù hợp, gửi yêu cầu, xử lý từ chối/không phản hồi |
| SC04 | Quản lý chuyến đi | Quản lý trạng thái từ khi nhận chuyến đến khi hoàn thành |
| SC05 | Quản lý tài xế | Hồ sơ, phương tiện, trạng thái nhận chuyến và vị trí |
| SC06 | Tính cước và thanh toán | Tính giá chuyến, tiền mặt, điện tử và xử lý thất bại |
| SC07 | Thông báo | Thông báo các sự kiện quan trọng của đặt xe/chuyến |
| SC08 | Đánh giá | Khách hàng đánh giá tài xế sau chuyến |
| SC09 | Quản trị vận hành | Quản lý dữ liệu, theo dõi chuyến và xử lý sự cố |
| SC10 | Giao dịch và báo cáo | Tra cứu lịch sử, giao dịch và báo cáo |
| SC11 | Bảo mật và phân quyền | Xác thực, phân quyền, bảo vệ dữ liệu, audit log |

> **Điều chỉnh:** bỏ `SC12 – Khả năng mở rộng và ổn định` khỏi danh sách scope chức năng vì đây là yêu cầu chất lượng/kiến trúc, không phải một module chức năng trực tiếp. Các yêu cầu này được giữ ở phần NFR.

---

## Bước 5: Business Requirements

| Mã BR | Business Requirement | Mục tiêu liên quan | Phạm vi |
|---|---|---|---|
| BR01 | Doanh nghiệp cần tự động hóa quy trình xử lý yêu cầu đặt xe từ lúc tạo yêu cầu đến khi chuyến hoàn thành | BG01 | In Scope |
| BR02 | Doanh nghiệp cần tìm và phân công tài xế phù hợp dựa trên vị trí, trạng thái và các tiêu chí vận hành | BG01, BG03 | In Scope |
| BR03 | Doanh nghiệp cần tiếp tục xử lý yêu cầu khi tài xế từ chối hoặc không phản hồi | BG01, BG03 | In Scope |
| BR04 | Doanh nghiệp cần cung cấp cho khách hàng khả năng theo dõi trạng thái chuyến trong quá trình sử dụng dịch vụ | BG02 | In Scope |
| BR05 | Doanh nghiệp cần quản lý tập trung thông tin khách hàng, tài xế, phương tiện, chuyến đi và lịch sử | BG04, BG05 | In Scope |
| BR06 | Doanh nghiệp cần quản lý tập trung thông tin và kết quả thanh toán của chuyến đi | BG05 | In Scope |
| BR07 | Doanh nghiệp cần hỗ trợ các phương thức thanh toán điện tử được lựa chọn và có khả năng tích hợp nhà cung cấp bên ngoài | BG05, BG07 | In Scope |
| BR08 | Thông tin nhạy cảm của phương thức thanh toán không được lưu trực tiếp trong CAB System | BG09 | In Scope |
| BR09 | Doanh nghiệp cần thông báo cho khách hàng và tài xế về các sự kiện quan trọng trong quá trình đặt và thực hiện chuyến | BG02, BG04 | In Scope |
| BR10 | Doanh nghiệp cần cung cấp công cụ để nhân viên vận hành theo dõi và quản lý hoạt động đặt xe, tài xế, phương tiện và chuyến đi | BG04 | In Scope |
| BR11 | Doanh nghiệp cần có cơ chế phân quyền đối với các thao tác quản trị và chức năng nhạy cảm | BG09 | In Scope |
| BR12 | Doanh nghiệp cần có khả năng phát hiện và hỗ trợ xử lý các trường hợp chuyến đi, thanh toán hoặc thành phần liên quan gặp lỗi | BG04, BG08 | In Scope |
| BR13 | Doanh nghiệp cần có báo cáo về số lượng chuyến, doanh thu, tỷ lệ hoàn thành, tỷ lệ hủy và hiệu quả tài xế | BG10 | In Scope |
| BR14 | Doanh nghiệp cần bảo vệ thông tin cá nhân, phương tiện, vị trí và giao dịch | BG09 | In Scope |
| BR15 | Doanh nghiệp cần lưu vết các thao tác quan trọng phục vụ kiểm tra và truy vết | BG09 | In Scope |
| BR16 | Doanh nghiệp cần đảm bảo nền tảng có thể mở rộng và bổ sung dịch vụ, phương thức thanh toán, kênh thông báo trong tương lai | BG06, BG07 | In Scope – chủ yếu thuộc NFR/kiến trúc |
| BR17 | Doanh nghiệp cần đảm bảo lỗi ở thành phần như thanh toán hoặc thông báo không làm dừng toàn bộ quy trình đặt xe | BG08 | In Scope |
| BR18 | Doanh nghiệp cần xác định các chính sách nghiệp vụ còn chưa thống nhất trước khi hoàn thiện triển khai | BG01, BG06, BG07 | TBD |

> **Điều chỉnh:** gộp các BR mang cùng một mục tiêu kiến trúc/mở rộng; không biến định hướng kỹ thuật thành FR.

---

## Bước 6: Business Process

| Mã BP | Business Process | Mô tả |
|---|---|---|
| BP01 | Quản lý tài khoản | Đăng ký, đăng nhập và quản lý thông tin khách hàng/tài xế |
| BP02 | Đặt xe | Nhập thông tin chuyến và tạo yêu cầu |
| BP03 | Tìm kiếm và phân công tài xế | Xác định tài xế phù hợp, gửi yêu cầu, xử lý từ chối/không phản hồi |
| BP04 | Thực hiện chuyến đi | Tài xế nhận chuyến, đến điểm đón, đón khách, thực hiện và hoàn thành chuyến |
| BP05 | Tính cước và thanh toán | Xác định số tiền và xử lý thanh toán |
| BP06 | Thông báo | Gửi thông báo về các sự kiện quan trọng |
| BP07 | Đánh giá chuyến đi | Khách hàng đánh giá tài xế sau khi hoàn thành |
| BP08 | Quản lý vận hành | Nhân viên vận hành theo dõi, quản lý và hỗ trợ xử lý sự cố |
| BP09 | Quản lý giao dịch và báo cáo | Tra cứu lịch sử, giao dịch và chỉ số quản trị |

---

# Bước 7: Functional Requirements (FR) – bản đã tinh gọn

## 7.1. Nguyên tắc phân rã

Danh sách FR được xây dựng lại theo nguyên tắc:

- Một FR phải mô tả **một khả năng/chức năng có giá trị nghiệp vụ** của hệ thống.
- Không tạo FR riêng cho từng trạng thái hoặc từng thông báo nếu chúng là một phần của chức năng lớn hơn.
- Không đưa yêu cầu kiến trúc, hiệu năng, bảo mật hoặc khả năng mở rộng vào FR; các yêu cầu này thuộc NFR.
- Không tạo FR chỉ vì một actor thực hiện một nút bấm nhỏ nếu thao tác đó đã nằm trong một chức năng nghiệp vụ lớn hơn.

### 7.2. Danh sách FR

| Mã BP | Business Process | Mã FR | Functional Requirement |
|---|---|---|---|
| BP01 | Quản lý tài khoản | FR01 | Hệ thống phải cho phép khách hàng đăng ký tài khoản bằng thông tin hợp lệ. |
| BP01 | Quản lý tài khoản | FR02 | Hệ thống phải cho phép khách hàng và tài xế đăng nhập để sử dụng các chức năng yêu cầu xác thực. |
| BP01 | Quản lý tài khoản | FR03 | Hệ thống phải cho phép khách hàng và tài xế xem, cập nhật thông tin hồ sơ thuộc quyền của mình. |
| BP01 | Quản lý tài khoản | FR04 | Hệ thống phải cho phép tài xế cập nhật thông tin phương tiện được sử dụng để thực hiện chuyến. |
| BP02 | Đặt xe | FR05 | Hệ thống phải cho phép khách hàng nhập điểm đón, điểm đến và lựa chọn loại xe/dịch vụ đang được hỗ trợ. |
| BP02 | Đặt xe | FR06 | Hệ thống phải cho phép khách hàng tạo yêu cầu đặt xe khi thông tin đặt xe hợp lệ. |
| BP02 | Đặt xe | FR07 | Hệ thống phải hiển thị cho khách hàng trạng thái hiện tại của yêu cầu đặt xe và chuyến đi. |
| BP03 | Tìm kiếm và phân công tài xế | FR08 | Hệ thống phải xác định các tài xế đáp ứng điều kiện nhận chuyến dựa trên trạng thái hoạt động, vị trí và các tiêu chí nghiệp vụ được doanh nghiệp quy định. |
| BP03 | Tìm kiếm và phân công tài xế | FR09 | Hệ thống phải gửi yêu cầu chuyến cho tài xế phù hợp và ghi nhận kết quả phản hồi. |
| BP03 | Tìm kiếm và phân công tài xế | FR10 | Hệ thống phải cho phép tài xế chấp nhận hoặc từ chối yêu cầu chuyến được gửi đến mình. |
| BP03 | Tìm kiếm và phân công tài xế | FR11 | Hệ thống phải tiếp tục tìm tài xế khác khi tài xế đã chọn từ chối hoặc không phản hồi trong thời gian quy định. |
| BP04 | Thực hiện chuyến đi | FR12 | Hệ thống phải cho phép tài xế bật/tắt trạng thái sẵn sàng nhận chuyến và cập nhật trạng thái chuyến theo đúng trình tự nghiệp vụ. |
| BP04 | Thực hiện chuyến đi | FR13 | Hệ thống phải ghi nhận vị trí của tài xế trong thời gian tài xế tham gia hoạt động chuyến theo cơ chế được quy định. |
| BP05 | Tính cước và thanh toán | FR14 | Hệ thống phải xác định và hiển thị số tiền cần thanh toán cho chuyến sau khi có đủ dữ liệu tính cước. |
| BP05 | Tính cước và thanh toán | FR15 | Hệ thống phải ghi nhận và quản lý thanh toán bằng tiền mặt theo quy trình nghiệp vụ. |
| BP05 | Tính cước và thanh toán | FR16 | Hệ thống phải hỗ trợ thanh toán điện tử thông qua nhà cung cấp thanh toán được doanh nghiệp tích hợp. |
| BP05 | Tính cước và thanh toán | FR17 | Hệ thống phải ghi nhận và hiển thị kết quả thanh toán; trường hợp giao dịch điện tử thất bại phải cho phép xử lý lại theo chính sách doanh nghiệp. |
| BP06 | Thông báo | FR18 | Hệ thống phải gửi thông báo cho khách hàng và tài xế khi xảy ra các sự kiện quan trọng của yêu cầu đặt xe hoặc chuyến đi. |
| BP07 | Đánh giá chuyến đi | FR19 | Hệ thống phải cho phép khách hàng đánh giá tài xế sau khi chuyến đi hoàn thành. |
| BP08 | Quản lý vận hành | FR20 | Hệ thống phải cho phép nhân viên vận hành có quyền xem và quản lý thông tin khách hàng theo quyền được cấp. |
| BP08 | Quản lý vận hành | FR21 | Hệ thống phải cho phép nhân viên vận hành có quyền xem và quản lý thông tin tài xế, phương tiện theo quyền được cấp. |
| BP08 | Quản lý vận hành | FR22 | Hệ thống phải cho phép nhân viên vận hành theo dõi các chuyến đang diễn ra và trạng thái hoạt động của tài xế. |
| BP08 | Quản lý vận hành | FR23 | Hệ thống phải cho phép nhân viên vận hành có quyền hỗ trợ xử lý các trường hợp chuyến đi phát sinh lỗi theo chính sách nghiệp vụ. |
| BP08 | Quản lý vận hành | FR24 | Hệ thống phải kiểm soát quyền thực hiện các thao tác quản trị theo vai trò được cấp. |
| BP09 | Quản lý giao dịch và báo cáo | FR25 | Hệ thống phải cho phép người dùng nội bộ có quyền tra cứu lịch sử chuyến đi và giao dịch theo phạm vi được phân quyền. |
| BP09 | Quản lý giao dịch và báo cáo | FR26 | Hệ thống phải cung cấp báo cáo về số lượng chuyến, doanh thu, tỷ lệ hoàn thành, tỷ lệ hủy và hiệu quả hoạt động của tài xế. |

### 7.3. Các SR cũ được loại bỏ/gộp

| SR cũ | Xử lý | Lý do |
|---|---|---|
| SR09 | Gộp vào FR07 | Trạng thái xử lý yêu cầu là một phần của chức năng theo dõi chuyến |
| SR11 | Gộp vào FR08 | Tiêu chí ưu tiên là một phần của cơ chế tìm tài xế, chưa cần là FR độc lập |
| SR16 | Gộp vào FR12 | Trạng thái sẵn sàng là một phần của quản lý trạng thái tài xế/chuyến |
| SR17, SR18, SR19, SR20 | Gộp vào FR12 | Đây là các trạng thái liên tiếp của một chức năng thực hiện chuyến |
| SR22 | Gộp vào FR14 | Việc hiển thị số tiền thuộc chức năng tính cước |
| SR25, SR26 | Gộp vào FR17 | Kết quả và xử lý thanh toán thất bại thuộc cùng một chức năng |
| SR27–SR31 | Gộp vào FR18 | Các FR riêng cho từng loại thông báo gây phân mảnh không cần thiết |
| SR33–SR35 | Gộp thành FR20–FR21 | Nhóm thao tác quản lý dữ liệu vận hành theo đối tượng |
| SR36, SR37 | Gộp vào FR22 | Theo dõi chuyến và trạng thái tài xế phục vụ cùng một nhu cầu giám sát |
| SR40, SR41 | Gộp vào FR25 | Đều là tra cứu dữ liệu lịch sử |
| SR42–SR45 | Gộp vào FR26 | Đều thuộc chức năng báo cáo quản trị |

> **Kết quả:** từ **45 SR** ban đầu còn **26 FR** có ý nghĩa chức năng rõ ràng hơn. Các trạng thái, bước con và loại thông báo cụ thể vẫn được đặc tả trong flow/AC của từng FR/use case, nhưng không được coi là FR độc lập.

---

# Bước 8: Business Rules và Exceptions

## 8.1. Business Rules

| Mã BRL | Business Rule | Trạng thái |
|---|---|---|
| BRL01 | Chỉ người dùng đã được xác thực mới được sử dụng các chức năng yêu cầu tài khoản. | Đã xác định |
| BRL02 | Chỉ tài xế có tài khoản hợp lệ và đủ điều kiện hoạt động mới được nhận chuyến. | Đã xác định |
| BRL03 | Tài xế chỉ được nhận chuyến khi đang ở trạng thái sẵn sàng nhận chuyến. | Đã xác định |
| BRL04 | Việc lựa chọn tài xế phải tuân theo các tiêu chí vận hành do doanh nghiệp xác định. | Chưa xác định đầy đủ |
| BRL05 | Khi tài xế từ chối hoặc không phản hồi trong thời gian quy định, hệ thống phải tiếp tục tìm tài xế khác. | Đã xác định về nghiệp vụ |
| BRL06 | Khi không còn tài xế phù hợp, hệ thống phải thông báo cho khách hàng và cập nhật trạng thái yêu cầu phù hợp. | Đã xác định |
| BRL07 | Một yêu cầu đặt xe chỉ được xác nhận cho một tài xế tại một thời điểm. | Cần xác nhận chi tiết cơ chế đồng thời |
| BRL08 | Chuyến đi phải tuân theo trình tự: nhận chuyến → đến điểm đón → đón khách → đang thực hiện → hoàn thành. | Đã xác định |
| BRL09 | Chỉ chuyến đã hoàn thành mới được thực hiện bước tính cước cuối cùng. | Đã xác định |
| BRL10 | Số tiền thanh toán được xác định dựa trên loại dịch vụ và dữ liệu chuyến đi theo công thức doanh nghiệp quy định. | Chưa xác định công thức |
| BRL11 | Khách hàng được thanh toán bằng tiền mặt hoặc phương thức điện tử mà doanh nghiệp hỗ trợ. | Đã xác định |
| BRL12 | Thông tin nhạy cảm của thẻ/tài khoản thanh toán không được lưu trực tiếp trong CAB System. | Đã xác định |
| BRL13 | Khi thanh toán điện tử thất bại, hệ thống phải thông báo và xử lý lại theo chính sách doanh nghiệp. | Đã xác định về nghiệp vụ |
| BRL14 | Chỉ chuyến đã hoàn thành mới cho phép khách hàng thực hiện đánh giá. | Cần xác nhận chi tiết |
| BRL15 | Chỉ nhân viên có quyền tương ứng mới được thực hiện thao tác quản trị nhạy cảm. | Đã xác định |
| BRL16 | Các thao tác quan trọng phải được lưu vết để phục vụ kiểm tra và truy vết. | Đã xác định |
| BRL17 | Dữ liệu cá nhân, phương tiện, vị trí và giao dịch phải được bảo vệ khỏi truy cập trái phép. | Đã xác định |

> **Điều chỉnh:** các quy tắc về mở rộng dịch vụ, thanh toán và kênh thông báo được chuyển về NFR/kiến trúc thay vì giữ như Business Rule nghiệp vụ.

## 8.2. Business Rule cần làm rõ

| Mã TBD | Nội dung cần xác định | Câu hỏi |
|---|---|---|
| TBD01 | Công thức tính cước | Giá chuyến dựa trên những yếu tố nào? |
| TBD02 | Tiêu chí ưu tiên tài xế | Khoảng cách, thời gian chờ, loại xe hay yếu tố khác? |
| TBD03 | Thời gian phản hồi | Tài xế có bao nhiêu giây/phút để phản hồi? |
| TBD04 | Chính sách hủy chuyến | Ai được hủy, thời điểm nào và có tính phí hay không? |
| TBD05 | Mất kết nối | Xử lý thế nào khi khách hàng/tài xế mất mạng theo từng trạng thái? |
| TBD06 | Thanh toán thất bại | Cho phép thử lại bao nhiêu lần và trong thời gian nào? |
| TBD07 | Đánh giá | Được đánh giá bao nhiêu lần và trong bao lâu sau chuyến? |
| TBD08 | Lưu trữ dữ liệu | Thời gian lưu chuyến, giao dịch, vị trí và audit log là bao lâu? |

## 8.3. Exception

| Mã EX | Exception | Xảy ra tại | Cách xử lý |
|---|---|---|---|
| EX01 | Không tìm được tài xế | BP03 | Thông báo cho khách hàng và cập nhật trạng thái phù hợp |
| EX02 | Tài xế từ chối | BP03 | Ghi nhận từ chối và tiếp tục tìm tài xế khác |
| EX03 | Tài xế không phản hồi | BP03 | Hết thời gian quy định thì tiếp tục tìm tài xế khác |
| EX04 | Nhiều tài xế cùng phản hồi | BP03 | Chọn một tài xế theo quy tắc phân công; các phản hồi còn lại không được xác nhận |
| EX05 | Thanh toán điện tử thất bại | BP05 | Thông báo kết quả và xử lý lại theo chính sách |
| EX06 | Nhà cung cấp thanh toán không phản hồi | BP05 | Không xác nhận thành công khi chưa có kết quả hợp lệ; ghi nhận trạng thái chờ/xử lý theo chính sách |
| EX07 | Mất kết nối người dùng | BP02/BP04 | Duy trì trạng thái đã lưu và cho phép tiếp tục xử lý khi kết nối được khôi phục |
| EX08 | Mất kết nối tài xế | BP04 | Xử lý trạng thái theo chính sách vận hành |
| EX09 | Dịch vụ thông báo lỗi | BP06 | Không để lỗi thông báo làm dừng toàn bộ quy trình |
| EX10 | Chuyến phát sinh sự cố | BP04/BP08 | Cho phép nhân viên vận hành kiểm tra và hỗ trợ |
| EX11 | Không đủ quyền | BP08 | Từ chối thao tác và ghi nhận sự kiện khi cần |
| EX12 | Dữ liệu đầu vào không hợp lệ | BP01/BP02 | Hiển thị lỗi và yêu cầu cung cấp dữ liệu hợp lệ |

---

# Bước 9: Mô hình hóa dữ liệu

Tài liệu nguồn chưa cung cấp ERD hoặc danh sách thực thể chi tiết. Vì vậy không tự bổ sung mô hình dữ liệu vào bản rà soát này.

Các nhóm dữ liệu tối thiểu có thể được suy ra từ yêu cầu gồm:

- Tài khoản/người dùng.
- Hồ sơ khách hàng.
- Hồ sơ tài xế.
- Phương tiện.
- Yêu cầu đặt xe/chuyến đi.
- Trạng thái chuyến.
- Vị trí tài xế.
- Cước chuyến.
- Giao dịch thanh toán.
- Thông báo.
- Đánh giá.
- Audit log.

Các thuộc tính, khóa và quan hệ cụ thể cần được xác định ở bước thiết kế ERD.

---

# Bước 10: Non-Functional Requirements (NFR)

| Mã | Nhóm | Non-Functional Requirement | Mục đích |
|---|---|---|---|
| NFR01 | Performance | Hệ thống phải có khả năng xử lý nhiều yêu cầu đặt xe đồng thời trong thời gian cao điểm. | Đáp ứng tải tăng |
| NFR02 | Performance | Các thao tác chính phải có thời gian phản hồi phù hợp với nhu cầu sử dụng thực tế. | Đảm bảo trải nghiệm |
| NFR03 | Scalability | Hệ thống phải có khả năng mở rộng khi số lượng khách hàng, tài xế và chuyến tăng. | Hỗ trợ tăng trưởng |
| NFR04 | Scalability | Các thành phần chịu tải cao phải có khả năng mở rộng độc lập khi kiến trúc cho phép. | Tránh mở rộng toàn hệ thống không cần thiết |
| NFR05 | Availability | Hệ thống phải duy trì khả năng hoạt động ổn định trong thời gian cao điểm. | Hạn chế gián đoạn |
| NFR06 | Reliability | Lỗi của thành phần như thanh toán hoặc thông báo không được làm dừng toàn bộ quy trình đặt xe. | Tăng khả năng chịu lỗi |
| NFR07 | Security | Người dùng phải được xác thực trước khi truy cập chức năng yêu cầu tài khoản. | Ngăn truy cập trái phép |
| NFR08 | Security | Hệ thống phải kiểm soát quyền truy cập theo vai trò. | Bảo vệ chức năng quản trị |
| NFR09 | Security | Dữ liệu cá nhân, phương tiện, vị trí và giao dịch phải được bảo vệ khỏi truy cập trái phép. | An toàn dữ liệu |
| NFR10 | Security | Thông tin nhạy cảm của thẻ/tài khoản thanh toán không được lưu trực tiếp trong CAB System. | Giảm rủi ro dữ liệu thanh toán |
| NFR11 | Auditability | Các thao tác quan trọng của người dùng và quản trị phải được lưu vết. | Kiểm tra/truy vết |
| NFR12 | Maintainability | Kiến trúc phải cho phép thay đổi/nâng cấp một thành phần với ảnh hưởng hạn chế đến thành phần khác. | Dễ bảo trì |
| NFR13 | Extensibility | Hệ thống phải có khả năng bổ sung loại dịch vụ mới mà không phải xây dựng lại toàn bộ hệ thống. | Hỗ trợ mở rộng |
| NFR14 | Extensibility | Hệ thống phải có khả năng tích hợp thêm phương thức/nhà cung cấp thanh toán. | Hỗ trợ mở rộng |
| NFR15 | Extensibility | Hệ thống phải có khả năng tích hợp thêm kênh thông báo. | Hỗ trợ mở rộng |
| NFR16 | Reliability | Hệ thống phải xử lý phù hợp khi kết nối mạng bị gián đoạn, hạn chế mất trạng thái và dữ liệu. | Duy trì tính nhất quán |
| NFR17 | Compatibility | Hệ thống phải có khả năng tích hợp với các dịch vụ bên ngoài được lựa chọn như thanh toán và thông báo. | Tích hợp |
| NFR18 | Usability | Giao diện khách hàng và tài xế phải phù hợp với quy trình đặt/thực hiện chuyến và dễ sử dụng. | Giảm khó khăn khi thao tác |
| NFR19 | Usability | Giao diện vận hành phải hỗ trợ theo dõi và xử lý các chuyến đang diễn ra. | Nâng cao hiệu quả vận hành |
| NFR20 | Data Integrity | Dữ liệu chuyến, giao dịch và trạng thái phải nhất quán và chính xác. | Tránh sai lệch dữ liệu |

### NFR cần làm rõ

| Mã | NFR cần xác định | Thông tin cần xác nhận |
|---|---|---|
| TBD-NFR01 | Thời gian phản hồi | Ngưỡng tối đa cho từng nhóm chức năng |
| TBD-NFR02 | Concurrent Users | Số người dùng đồng thời tối đa |
| TBD-NFR03 | Availability | Mức độ sẵn sàng yêu cầu (%) |
| TBD-NFR04 | Data Retention | Thời gian lưu từng loại dữ liệu |
| TBD-NFR05 | Recovery | Thời gian khôi phục tối đa khi có sự cố |
| TBD-NFR06 | Scalability | Quy mô khách hàng, tài xế và chuyến dự kiến trong 1–3 năm |

---

# Bước 11: Use Case

Các FR ở trên là cơ sở để xây dựng Use Case. Có thể nhóm FR thành các Use Case chính:

| Use Case | Chức năng chính | FR liên quan |
|---|---|---|
| UC01 – Quản lý tài khoản | Đăng ký, đăng nhập, cập nhật hồ sơ/phương tiện | FR01–FR04 |
| UC02 – Đặt xe | Nhập thông tin và tạo yêu cầu | FR05–FR07 |
| UC03 – Phân công tài xế | Tìm tài xế, gửi yêu cầu, nhận phản hồi, phân công lại | FR08–FR11 |
| UC04 – Thực hiện chuyến | Sẵn sàng nhận chuyến, cập nhật trạng thái, vị trí | FR12–FR13 |
| UC05 – Tính cước và thanh toán | Tính cước, tiền mặt, điện tử, kết quả/thử lại | FR14–FR17 |
| UC06 – Thông báo | Gửi thông báo sự kiện chuyến | FR18 |
| UC07 – Đánh giá | Đánh giá tài xế | FR19 |
| UC08 – Quản lý vận hành | Quản lý dữ liệu, theo dõi chuyến, xử lý lỗi, phân quyền | FR20–FR24 |
| UC09 – Tra cứu và báo cáo | Tra cứu lịch sử/giao dịch, báo cáo | FR25–FR26 |

> **Lưu ý:** Không tạo Use Case riêng cho từng trạng thái như “đến điểm đón”, “đón khách”, “đang di chuyển”, “hoàn thành”; các trạng thái này nằm trong flow của **UC04 – Thực hiện chuyến**.

---

# Bước 12: Acceptance Criteria

| Mã AC | FR | Acceptance Criteria | Điều kiện đạt |
|---|---|---|---|
| AC01 | FR01 | Khách hàng đăng ký được tài khoản | Dữ liệu hợp lệ → tài khoản được tạo; dữ liệu không hợp lệ → từ chối và hiển thị lỗi |
| AC02 | FR02 | Khách hàng/tài xế đăng nhập được | Thông tin đúng → đăng nhập thành công; sai → từ chối |
| AC03 | FR03 | Người dùng cập nhật được hồ sơ | Chỉ cập nhật dữ liệu thuộc quyền; dữ liệu hợp lệ được lưu thành công |
| AC04 | FR04 | Tài xế cập nhật được phương tiện | Dữ liệu phương tiện hợp lệ → được lưu |
| AC05 | FR05 | Khách hàng nhập được thông tin đặt xe | Điểm đón, điểm đến và loại xe hợp lệ được chấp nhận |
| AC06 | FR06 | Tạo được yêu cầu đặt xe | Yêu cầu hợp lệ → được tạo và chuyển sang trạng thái phù hợp |
| AC07 | FR07 | Theo dõi được trạng thái | Hệ thống hiển thị đúng trạng thái hiện tại |
| AC08 | FR08 | Hệ thống tìm đúng nhóm tài xế phù hợp | Chỉ tài xế đáp ứng điều kiện nghiệp vụ được xem xét |
| AC09 | FR09 | Hệ thống gửi yêu cầu và ghi nhận phản hồi | Yêu cầu gửi thành công; phản hồi được ghi nhận |
| AC10 | FR10 | Tài xế chấp nhận/từ chối chuyến | Lựa chọn của tài xế được ghi nhận chính xác |
| AC11 | FR11 | Hệ thống phân công lại khi cần | Từ chối/hết thời gian phản hồi → chuyển sang tìm tài xế khác |
| AC12 | FR12 | Tài xế quản lý trạng thái nhận chuyến và trạng thái chuyến | Chỉ chuyển trạng thái hợp lệ theo trình tự nghiệp vụ |
| AC13 | FR13 | Hệ thống ghi nhận vị trí tài xế | Vị trí được ghi nhận theo cơ chế đã thống nhất |
| AC14 | FR14 | Hệ thống xác định số tiền thanh toán | Khi có đủ dữ liệu → số tiền được tính/hiển thị theo công thức được xác định |
| AC15 | FR15 | Ghi nhận thanh toán tiền mặt | Giao dịch tiền mặt được ghi nhận đúng trạng thái |
| AC16 | FR16 | Thanh toán điện tử hoạt động | Yêu cầu được chuyển tới nhà cung cấp và kết quả được tiếp nhận |
| AC17 | FR17 | Kết quả/thử lại thanh toán được xử lý | Thành công/thất bại được ghi nhận; thất bại được xử lý lại theo chính sách |
| AC18 | FR18 | Thông báo được gửi theo sự kiện | Khi sự kiện tương ứng xảy ra, người nhận phù hợp được thông báo |
| AC19 | FR19 | Khách hàng đánh giá sau chuyến | Chuyến hoàn thành → khách hàng được phép gửi đánh giá |
| AC20 | FR20 | Nhân viên có quyền quản lý dữ liệu khách hàng | Chỉ thao tác được trong phạm vi quyền được cấp |
| AC21 | FR21 | Nhân viên có quyền quản lý tài xế/phương tiện | Chỉ thao tác được trong phạm vi quyền được cấp |
| AC22 | FR22 | Nhân viên theo dõi được chuyến và tài xế | Danh sách, trạng thái chuyến và trạng thái tài xế được hiển thị |
| AC23 | FR23 | Nhân viên xử lý được chuyến lỗi | Chỉ nhân viên có quyền được thực hiện thao tác hỗ trợ |
| AC24 | FR24 | Hệ thống kiểm soát quyền | Người không có quyền bị từ chối thao tác |
| AC25 | FR25 | Người có quyền tra cứu lịch sử | Kết quả chỉ nằm trong phạm vi dữ liệu được phép truy cập |
| AC26 | FR26 | Hệ thống cung cấp báo cáo | Báo cáo hiển thị đúng các chỉ số được doanh nghiệp yêu cầu |

### Acceptance Criteria cho Exception

| Mã | Exception | Điều kiện kiểm tra | Kết quả mong đợi |
|---|---|---|---|
| AC-EX01 | Không tìm được tài xế | Không có tài xế phù hợp | Thông báo cho khách hàng và cập nhật trạng thái |
| AC-EX02 | Tài xế từ chối | Tài xế chọn từ chối | Ghi nhận và tìm tài xế khác |
| AC-EX03 | Tài xế không phản hồi | Hết thời gian quy định | Chuyển sang tài xế khác |
| AC-EX04 | Thanh toán thất bại | Nhà cung cấp trả kết quả thất bại | Thông báo và cho phép xử lý lại theo chính sách |
| AC-EX05 | Nhà cung cấp thanh toán không phản hồi | Không có phản hồi hợp lệ | Không tự động xác nhận thành công |
| AC-EX06 | Mất kết nối | Người dùng mất kết nối | Không làm mất trạng thái đã lưu; xử lý tiếp khi khôi phục kết nối theo chính sách |
| AC-EX07 | Không đủ quyền | Truy cập chức năng bị hạn chế | Hệ thống từ chối |
| AC-EX08 | Thông báo thất bại | Dịch vụ thông báo không hoạt động | Không làm dừng toàn bộ quy trình đặt/thực hiện chuyến |

---

# Bước 13: Traceability Matrix

| BG | BR | BP | FR | AC |
|---|---|---|---|---|
| BG01 | BR01 | BP02 | FR05–FR07 | AC05–AC07 |
| BG01 | BR02 | BP03 | FR08–FR11 | AC08–AC11 |
| BG01/BG03 | BR03 | BP03 | FR11 | AC11, AC-EX01–AC-EX03 |
| BG02 | BR04 | BP02/BP04 | FR07, FR12–FR13 | AC07, AC12–AC13 |
| BG04/BG05 | BR05 | BP08/BP09 | FR20–FR22, FR25 | AC20–AC22, AC25 |
| BG05 | BR06 | BP05/BP09 | FR14–FR17, FR25 | AC14–AC17, AC25 |
| BG05/BG07 | BR07 | BP05 | FR16–FR17 | AC16–AC17 |
| BG09 | BR08 | BP05 | FR16–FR17 | AC16–AC17 |
| BG02/BG04 | BR09 | BP06 | FR18 | AC18 |
| BG04 | BR10 | BP08 | FR20–FR24 | AC20–AC24 |
| BG09 | BR11 | BP08 | FR24 | AC24 |
| BG04/BG08 | BR12 | BP08 | FR23 | AC23 |
| BG10 | BR13 | BP09 | FR26 | AC26 |
| BG09 | BR14 | Toàn hệ thống | NFR07–NFR10 | TBD-NFR |
| BG09 | BR15 | BP08/BP09 | NFR11 | TBD-NFR |
| BG06/BG07 | BR16 | Toàn hệ thống | NFR03–NFR04, NFR12–NFR15 | TBD-NFR |
| BG08 | BR17 | BP05/BP06 | NFR06 | AC-EX04, AC-EX08 |

---

# Tổng kết rà soát logic

## Các vấn đề chính đã sửa

1. **45 SR được tinh gọn thành 26 FR.** Các mục bị phân mảnh theo từng trạng thái hoặc từng loại thông báo đã được gộp vào chức năng nghiệp vụ lớn hơn.
2. **Không còn FR riêng cho từng trạng thái chuyến.** `đến điểm đón`, `đón khách`, `đang thực hiện`, `hoàn thành` là các bước/trạng thái thuộc FR12 và Use Case thực hiện chuyến.
3. **Không còn FR riêng cho từng loại thông báo.** Các thông báo đặt xe, nhận chuyến, đến điểm đón, hoàn thành... nằm trong FR18.
4. **Không còn FR riêng cho “tiêu chí ưu tiên tài xế”.** Đây là một phần của thuật toán/cơ chế tìm tài xế và hiện còn TBD ở cấp Business Rule.
5. **Không đưa yêu cầu kiến trúc, mở rộng, hiệu năng, bảo mật vào FR.** Các nội dung này được giữ ở NFR/Business Rule phù hợp.
6. **Không tạo stakeholder mới ngoài ba nhóm trong tài liệu nguồn.** Các báo cáo và thao tác quản trị được gắn cho “nhân viên vận hành có quyền”, tránh xuất hiện actor “Ban quản lý” nhưng lại không có trong stakeholder list.
7. **Đồng bộ lại AC và Traceability.** Mỗi FR hiện có AC tương ứng; các tham chiếu cũ đến `SR42–SR45`, `AC-NFR...` không còn gây đứt chuỗi.
8. **Giữ nguyên các điểm chưa được xác định thành TBD.** Đặc biệt là công thức cước, tiêu chí ưu tiên tài xế, timeout phản hồi, chính sách hủy, mất kết nối, retry thanh toán và thời gian lưu dữ liệu.

## Danh sách FR cuối cùng

**FR01–FR04:** Tài khoản và hồ sơ  
**FR05–FR07:** Đặt xe và theo dõi  
**FR08–FR11:** Tìm và phân công tài xế  
**FR12–FR13:** Thực hiện chuyến  
**FR14–FR17:** Tính cước và thanh toán  
**FR18:** Thông báo  
**FR19:** Đánh giá  
**FR20–FR24:** Quản lý vận hành và phân quyền  
**FR25–FR26:** Tra cứu và báo cáo
