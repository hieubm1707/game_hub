export const LEGAL_MESSAGES = {
  en: {
    'legal.badge': 'Legal Document',
    'legal.lastUpdatedValue': 'November 2026',
    'legal.lastUpdatedLabel': 'Last Updated: {date}',
    'legal.privacyLink': 'Privacy Policy',
    'legal.termsLink': 'Terms of Use',
    'legal.aboutLink': 'About Game Hub',
    'legal.contactLink': 'Contact Us',

    // PrivacyPage
    'privacy.docTitle': 'Privacy Policy',
    'privacy.docDesc':
      'Learn how Game Hub handles browser storage, technical data, third-party links, and user privacy.',
    'privacy.title': 'Privacy Policy',
    'privacy.intro':
      'This Privacy Policy explains how Game Hub (“we,” “our,” or “the Platform”) collects, uses, stores, and protects information when you visit our website, browse our catalog, or play games accessible through Game Hub.',
    'privacy.s1.title': 'Scope & Platform Access',
    'privacy.s1.p1':
      'Game Hub provides browser-based access to a curated catalog of games and optional links to native mobile applications. Public visitors may browse the catalog and launch available web games without creating an account.',
    'privacy.s1.p2':
      'This policy applies to the Game Hub website and web player shell. Individual games or native mobile applications distributed via third-party app stores (such as Google Play or the Apple App Store) may be governed by additional privacy disclosures provided by their respective developers or store platforms.',
    'privacy.s2.title': 'Information We Collect',
    'privacy.s2.intro':
      'Depending on how you interact with Game Hub, the following categories of data may be processed:',
    'privacy.s2.item1Title': 'Browser & Local Storage Data:',
    'privacy.s2.item1Body':
      'Preferences such as selected visual theme, cached catalog entries, prompt dismissals, and local gameplay progress (e.g., high scores or session settings) may be saved directly on your device using {localStorage} or {indexedDb}.',
    'privacy.s2.item2Title': 'Technical & Diagnostic Data:',
    'privacy.s2.item2Body':
      'Standard web hosting and delivery infrastructure may process technical metadata—such as IP address, browser type, operating system, screen viewport, referring URL, and error logs—to deliver content reliably and protect against abuse.',
    'privacy.s2.item3Title': 'Online Features & Accounts (Where Applicable):',
    'privacy.s2.item3Body':
      'Certain games or future platform features (such as leaderboards, multiplayer sessions, cloud saves, or administrator sign-in) may require authentication or network communication to function.',
    'privacy.s3.title': 'Cookies, Analytics & Google AdSense',
    'privacy.s3.p1':
      'We use essential browser storage to remember your interface preferences and keep the platform responsive. To support hosting and ongoing development, Game Hub ({siteDomain}) displays third-party advertisements served by {googleAdSense}.',
    'privacy.s3.item1':
      "Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to {siteDomain} or other websites on the Internet.",
    'privacy.s3.item2':
      "Google's use of advertising cookies enables Google and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.",
    'privacy.s3.item3':
      'You may opt out of personalized advertising at any time by visiting {adsSettingsLink}, or opt out of third-party vendor cookies for personalized advertising at {aboutAdsLink}.',
    'privacy.s3.adsSettingsLabel': 'Google Ads Settings',
    'privacy.s3.aboutAdsLabel': 'www.aboutads.info',
    'privacy.s3.item4': 'Learn more about how Google uses data from partner sites in {googleAdsPolicyLink}.',
    'privacy.s3.googleAdsPolicyLabel': 'Google Advertising Privacy & Terms',
    'privacy.s3.p2':
      'Where required by regional privacy regulations (such as in the EEA, UK, or Switzerland), consent choices are presented before personalized ad cookies are used.',
    'privacy.s4.title': 'Embedded Games & Third-Party Links',
    'privacy.s4.p1':
      'Games played on Game Hub may be loaded from trusted external origins inside a sandboxed iframe, and game detail pages may link to external app stores or developer websites. We do not control the privacy practices of third-party websites or app stores and encourage you to review their policies before sharing personal information.',
    'privacy.s5.title': 'Data Retention & Your Controls',
    'privacy.s5.p1':
      'Data stored locally in your browser remains on your device until you clear your browser storage or site data. You can manage or block cookies and site storage at any time through your browser settings, though disabling local storage may reset saved game progress or interface preferences.',
    'privacy.s6.title': "Children's Privacy",
    'privacy.s6.p1':
      'Game Hub is designed for a general audience. We do not knowingly collect personally identifiable contact information from children under the age of 13 (or the minimum age of digital consent in your jurisdiction) without verifiable parental consent. If you believe personal data has been provided inadvertently, please contact the platform administrator for prompt removal.',
    'privacy.s7.title': 'Security & Policy Updates',
    'privacy.s7.p1':
      'We implement reasonable technical and organizational safeguards—including HTTPS transport, strict origin validation for embedded games, and role-based access controls for administrative tools—to protect the platform.',
    'privacy.s7.p2':
      'We may revise this Privacy Policy periodically to reflect new features, games, or legal requirements. Updates take effect when posted on this page with a revised “Last Updated” date.',

    // TermsPage
    'terms.docTitle': 'Terms of Use',
    'terms.docDesc':
      'Terms and conditions governing your access to and use of the Game Hub platform and games.',
    'terms.title': 'Terms of Use',
    'terms.intro':
      'Please read these Terms of Use carefully before accessing or using Game Hub. By browsing the site or launching any game on the platform, you agree to be bound by these Terms and our {privacyLink}.',
    'terms.s1.title': 'Use of the Platform',
    'terms.s1.p1':
      'Game Hub grants you a limited, non-exclusive, non-transferable, and revocable license to access the website and play available games for your personal use. We reserve the right to add, modify, suspend, or discontinue any game, feature, or section of the platform at any time without liability or prior notice.',
    'terms.s2.title': 'Acceptable Conduct',
    'terms.s2.intro': 'When using Game Hub, you agree not to:',
    'terms.s2.item1':
      'Attempt to bypass security controls, probe administrative endpoints, or gain unauthorized access to platform infrastructure or accounts.',
    'terms.s2.item2':
      'Use automated bots, scrapers, or denial-of-service techniques that degrade platform availability for other users.',
    'terms.s2.item3':
      'Exploit bugs, tamper with game clients or multiplayer services, or inject malicious scripts into embedded sessions.',
    'terms.s2.item4':
      'Redistribute, resell, or frame the Game Hub platform or hosted game assets without explicit authorization from the respective rights holders.',
    'terms.s3.title': 'Intellectual Property',
    'terms.s3.p1':
      'All platform interfaces, branding, text, graphics, and software are owned by Game Hub or its licensors. Individual games, titles, artwork, audio, and trademarks remain the intellectual property of their respective developers and publishers. Nothing in these Terms transfers ownership of any intellectual property rights to you.',
    'terms.s4.title': 'Third-Party Services, Stores & Monetization',
    'terms.s4.p1':
      'Game Hub may display advertisements, promotional placements, or links to third-party app stores (including Google Play and the Apple App Store) and external services. Any downloads, in-app purchases, subscriptions, or interactions conducted through third-party platforms are governed solely by the terms and policies of those third parties.',
    'terms.s5.title': 'Disclaimer of Warranties',
    'terms.s5.p1':
      'Game Hub and all games accessible through the platform are provided on an “AS IS” and “AS AVAILABLE” basis without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, or non-infringement.',
    'terms.s5.p2':
      'We do not guarantee uninterrupted availability, error-free gameplay, or the permanent preservation of locally stored browser progress or scores.',
    'terms.s6.title': 'Limitation of Liability',
    'terms.s6.p1':
      'To the fullest extent permitted by applicable law, Game Hub and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages—or any loss of data, scores, or device functionality—arising out of or related to your use of, or inability to use, the platform or any linked third-party games.',
    'terms.s7.title': 'Changes to These Terms',
    'terms.s7.p1':
      'We may update these Terms of Use from time to time. Any revisions will be posted on this page with an updated effective date. Your continued use of Game Hub after changes are posted constitutes acceptance of the revised Terms.',

    // AboutPage
    'about.docTitle': 'About Game Hub',
    'about.docDesc':
      'About Game Hub ({siteDomain}) — handcrafted offline-first puzzle and strategy games playable directly in your browser.',
    'about.badge': 'About',
    'about.title': 'About Game Hub',
    'about.intro':
      'Game Hub ({siteDomain}) is an independent browser gaming portal dedicated to original, thoughtfully designed puzzle, logic, and strategy games built with Flutter for the web and mobile devices.',
    'about.s1.title': 'Our Mission',
    'about.s1.p1':
      'We focus on clean, focused gameplay sessions that start immediately in any modern desktop or mobile browser. Every game in our catalog is crafted to be easy to learn, challenging to master, and playable without mandatory registration or login walls.',
    'about.s2.title': 'Offline-First & Local Progress',
    'about.s2.p1':
      'Our titles are engineered with an offline-first architecture: levels and core puzzle packs are bundled directly with each game, and your progress, scores, and visual preferences are saved locally on your device. Many games also offer companion native apps on Google Play and the Apple App Store for full offline mobile play.',
    'about.s3.title': 'How We Keep Game Hub Free',
    'about.s3.p1':
      'All browser games on {siteDomain} are free to play. To cover static hosting, domain maintenance, and ongoing game development, the portal may display clearly separated advertising through Google AdSense in accordance with our {privacyLink}.',
    'about.exploreGames': 'Explore All Games',
    'about.getInTouch': 'Get in Touch',

    // ContactPage
    'contact.docTitle': 'Contact Us',
    'contact.docDesc':
      'Contact the Game Hub team at {siteDomain} for player support, bug reports, privacy questions, or copyright inquiries.',
    'contact.badge': 'Support & Inquiries',
    'contact.title': 'Contact Us',
    'contact.intro':
      'Have feedback on a game, found a bug, or need to reach us regarding privacy, advertising, or intellectual property on {siteDomain}? We welcome your message.',
    'contact.s1.title': 'Direct Email',
    'contact.s1.p1': 'You can reach the Game Hub team directly by email at: {emailLink}',
    'contact.s1.p2':
      'We typically respond to player support and policy inquiries within 2–3 business days.',
    'contact.s2.title': 'What to Include in Your Message',
    'contact.s2.item1Title': 'Bug Reports:',
    'contact.s2.item1Body':
      'The game title, your browser/device type, and a short description of what happened.',
    'contact.s2.item2Title': 'Privacy & Ad Preferences:',
    'contact.s2.item2Body':
      'Questions regarding our {privacyLink} or cookie/advertising disclosures.',
    'contact.s2.item3Title': 'Copyright / DMCA Notices:',
    'contact.s2.item3Body':
      'The exact page URL on {siteDomain}, details of the content in question, and your contact information.',
  },
  vi: {
    'legal.badge': 'Văn bản pháp lý',
    'legal.lastUpdatedValue': 'Tháng 11, 2026',
    'legal.lastUpdatedLabel': 'Cập nhật lần cuối: {date}',
    'legal.privacyLink': 'Chính sách quyền riêng tư',
    'legal.termsLink': 'Điều khoản sử dụng',
    'legal.aboutLink': 'Giới thiệu Game Hub',
    'legal.contactLink': 'Liên hệ',

    // PrivacyPage
    'privacy.docTitle': 'Chính sách quyền riêng tư',
    'privacy.docDesc':
      'Tìm hiểu cách Game Hub xử lý bộ nhớ trình duyệt, dữ liệu kỹ thuật, liên kết bên thứ ba và quyền riêng tư người dùng.',
    'privacy.title': 'Chính sách quyền riêng tư',
    'privacy.intro':
      'Chính sách quyền riêng tư này giải thích cách Game Hub (“chúng tôi” hoặc “Nền tảng”) thu thập, sử dụng, lưu trữ và bảo vệ thông tin khi bạn truy cập trang web, duyệt danh mục hoặc chơi các trò chơi trên Game Hub.',
    'privacy.s1.title': 'Phạm vi & Quyền truy cập nền tảng',
    'privacy.s1.p1':
      'Game Hub cung cấp quyền truy cập trên trình duyệt tới danh mục trò chơi được tuyển chọn và các liên kết tùy chọn tới ứng dụng di động gốc. Khách truy cập công khai có thể duyệt danh mục và chơi các game web khả dụng mà không cần tạo tài khoản.',
    'privacy.s1.p2':
      'Chính sách này áp dụng cho trang web Game Hub và trình chơi web. Các trò chơi riêng lẻ hoặc ứng dụng di động gốc được phân phối qua cửa hàng ứng dụng bên thứ ba (như Google Play hoặc Apple App Store) có thể tuân theo các thông báo quyền riêng tư bổ sung do nhà phát triển hoặc nền tảng cửa hàng đó cung cấp.',
    'privacy.s2.title': 'Thông tin chúng tôi thu thập',
    'privacy.s2.intro':
      'Tùy thuộc vào cách bạn tương tác với Game Hub, các nhóm dữ liệu sau có thể được xử lý:',
    'privacy.s2.item1Title': 'Dữ liệu trình duyệt & bộ nhớ cục bộ:',
    'privacy.s2.item1Body':
      'Các tùy chọn như giao diện đã chọn, dữ liệu danh mục được lưu đệm, trạng thái ẩn hộp thoại và tiến trình chơi cục bộ (ví dụ: điểm cao hoặc cài đặt phiên chơi) có thể được lưu trực tiếp trên thiết bị của bạn bằng {localStorage} hoặc {indexedDb}.',
    'privacy.s2.item2Title': 'Dữ liệu kỹ thuật & chẩn đoán:',
    'privacy.s2.item2Body':
      'Hạ tầng lưu trữ và phân phối web tiêu chuẩn có thể xử lý siêu dữ liệu kỹ thuật — như địa chỉ IP, loại trình duyệt, hệ điều hành, kích thước màn hình, URL giới thiệu và nhật ký lỗi — nhằm phân phối nội dung ổn định và bảo vệ khỏi hành vi lạm dụng.',
    'privacy.s2.item3Title': 'Tính năng trực tuyến & tài khoản (khi áp dụng):',
    'privacy.s2.item3Body':
      'Một số trò chơi hoặc tính năng nền tảng trong tương lai (như bảng xếp hạng, chế độ nhiều người chơi, lưu đám mây hoặc đăng nhập quản trị viên) có thể yêu cầu xác thực hoặc kết nối mạng để hoạt động.',
    'privacy.s3.title': 'Cookie, Phân tích & Google AdSense',
    'privacy.s3.p1':
      'Chúng tôi sử dụng bộ nhớ trình duyệt thiết yếu để ghi nhớ tùy chọn giao diện và giữ nền tảng phản hồi mượt mà. Để hỗ trợ chi phí lưu trữ và phát triển liên tục, Game Hub ({siteDomain}) hiển thị quảng cáo của bên thứ ba được phân phối bởi {googleAdSense}.',
    'privacy.s3.item1':
      'Các nhà cung cấp bên thứ ba, bao gồm Google, sử dụng cookie để phân phối quảng cáo dựa trên các lượt truy cập trước đây của người dùng vào {siteDomain} hoặc các trang web khác trên Internet.',
    'privacy.s3.item2':
      'Việc Google sử dụng cookie quảng cáo cho phép Google và các đối tác hiển thị quảng cáo cho bạn dựa trên lượt truy cập vào trang web này và/hoặc các trang web khác trên Internet.',
    'privacy.s3.item3':
      'Bạn có thể tắt quảng cáo được cá nhân hóa bất kỳ lúc nào bằng cách truy cập {adsSettingsLink}, hoặc tắt cookie của nhà cung cấp bên thứ ba cho quảng cáo cá nhân hóa tại {aboutAdsLink}.',
    'privacy.s3.adsSettingsLabel': 'Cài đặt quảng cáo của Google',
    'privacy.s3.aboutAdsLabel': 'www.aboutads.info',
    'privacy.s3.item4':
      'Tìm hiểu thêm về cách Google sử dụng dữ liệu từ các trang đối tác tại {googleAdsPolicyLink}.',
    'privacy.s3.googleAdsPolicyLabel': 'Quyền riêng tư & Điều khoản quảng cáo của Google',
    'privacy.s3.p2':
      'Khi quy định quyền riêng tư theo khu vực yêu cầu (chẳng hạn tại EEA, Vương quốc Anh hoặc Thụy Sĩ), lựa chọn đồng ý sẽ được hiển thị trước khi sử dụng cookie quảng cáo cá nhân hóa.',
    'privacy.s4.title': 'Trò chơi nhúng & Liên kết bên thứ ba',
    'privacy.s4.p1':
      'Các trò chơi trên Game Hub có thể được tải từ các nguồn bên ngoài đáng tin cậy bên trong iframe cách ly (sandbox), và trang chi tiết trò chơi có thể liên kết tới cửa hàng ứng dụng hoặc trang web của nhà phát triển. Chúng tôi không kiểm soát các thực tiễn quyền riêng tư của trang web hoặc cửa hàng ứng dụng bên thứ ba và khuyến khích bạn xem xét chính sách của họ trước khi chia sẻ thông tin cá nhân.',
    'privacy.s5.title': 'Lưu trữ dữ liệu & Quyền kiểm soát của bạn',
    'privacy.s5.p1':
      'Dữ liệu được lưu cục bộ trong trình duyệt sẽ ở lại trên thiết bị của bạn cho đến khi bạn xóa bộ nhớ trình duyệt hoặc dữ liệu trang web. Bạn có thể quản lý hoặc chặn cookie và bộ nhớ trang web bất kỳ lúc nào trong cài đặt trình duyệt, tuy nhiên việc tắt bộ nhớ cục bộ có thể đặt lại tiến trình trò chơi đã lưu hoặc tùy chọn giao diện.',
    'privacy.s6.title': 'Quyền riêng tư của trẻ em',
    'privacy.s6.p1':
      'Game Hub được thiết kế cho khán giả đại chúng. Chúng tôi không cố ý thu thập thông tin liên hệ định danh cá nhân từ trẻ em dưới 13 tuổi (hoặc độ tuổi đồng ý kỹ thuật số tối thiểu tại khu vực của bạn) nếu không có sự đồng ý có thể xác minh của phụ huynh. Nếu bạn tin rằng dữ liệu cá nhân đã vô tình được cung cấp, vui lòng liên hệ quản trị viên nền tảng để được xóa kịp thời.',
    'privacy.s7.title': 'Bảo mật & Cập nhật chính sách',
    'privacy.s7.p1':
      'Chúng tôi áp dụng các biện pháp bảo vệ kỹ thuật và tổ chức hợp lý — bao gồm truyền tải HTTPS, xác thực nguồn gốc nghiêm ngặt đối với trò chơi nhúng và kiểm soát truy cập theo vai trò cho công cụ quản trị — nhằm bảo vệ nền tảng.',
    'privacy.s7.p2':
      'Chúng tôi có thể sửa đổi Chính sách quyền riêng tư này định kỳ để phản ánh các tính năng, trò chơi hoặc yêu cầu pháp lý mới. Các bản cập nhật có hiệu lực khi được đăng trên trang này với ngày “Cập nhật lần cuối” mới.',

    // TermsPage
    'terms.docTitle': 'Điều khoản sử dụng',
    'terms.docDesc':
      'Các điều khoản và điều kiện điều chỉnh việc bạn truy cập và sử dụng nền tảng cùng các trò chơi trên Game Hub.',
    'terms.title': 'Điều khoản sử dụng',
    'terms.intro':
      'Vui lòng đọc kỹ các Điều khoản sử dụng này trước khi truy cập hoặc sử dụng Game Hub. Bằng việc duyệt trang web hoặc mở bất kỳ trò chơi nào trên nền tảng, bạn đồng ý bị ràng buộc bởi các Điều khoản này và {privacyLink} của chúng tôi.',
    'terms.s1.title': 'Sử dụng nền tảng',
    'terms.s1.p1':
      'Game Hub cấp cho bạn giấy phép có giới hạn, không độc quyền, không thể chuyển nhượng và có thể thu hồi để truy cập trang web và chơi các trò chơi khả dụng cho mục đích cá nhân. Chúng tôi có quyền thêm, sửa đổi, tạm ngừng hoặc ngừng cung cấp bất kỳ trò chơi, tính năng hoặc phần nào của nền tảng bất kỳ lúc nào mà không chịu trách nhiệm pháp lý hay cần thông báo trước.',
    'terms.s2.title': 'Hành vi được chấp nhận',
    'terms.s2.intro': 'Khi sử dụng Game Hub, bạn đồng ý không thực hiện các hành vi sau:',
    'terms.s2.item1':
      'Tìm cách vượt qua các biện pháp kiểm soát bảo mật, thăm dò các điểm cuối quản trị hoặc truy cập trái phép vào hạ tầng hoặc tài khoản của nền tảng.',
    'terms.s2.item2':
      'Sử dụng bot tự động, công cụ thu thập dữ liệu hoặc kỹ thuật từ chối dịch vụ làm suy giảm khả năng hoạt động của nền tảng đối với người dùng khác.',
    'terms.s2.item3':
      'Khai thác lỗ hổng, can thiệp vào trình chơi game hoặc dịch vụ nhiều người chơi, hoặc chèn mã độc vào các phiên nhúng.',
    'terms.s2.item4':
      'Phân phối lại, bán lại hoặc nhúng khung (frame) nền tảng Game Hub hay tài nguyên trò chơi được lưu trữ khi chưa có sự cho phép rõ ràng từ chủ sở hữu quyền tương ứng.',
    'terms.s3.title': 'Quyền sở hữu trí tuệ',
    'terms.s3.p1':
      'Mọi giao diện nền tảng, thương hiệu, văn bản, đồ họa và phần mềm đều thuộc quyền sở hữu của Game Hub hoặc các bên cấp phép. Từng trò chơi, tiêu đề, hình ảnh minh họa, âm thanh và nhãn hiệu vẫn thuộc quyền sở hữu trí tuệ của nhà phát triển và nhà phát hành tương ứng. Không có nội dung nào trong Điều khoản này chuyển giao quyền sở hữu trí tuệ cho bạn.',
    'terms.s4.title': 'Dịch vụ bên thứ ba, Cửa hàng & Doanh thu',
    'terms.s4.p1':
      'Game Hub có thể hiển thị quảng cáo, vị trí quảng bá hoặc liên kết tới các cửa hàng ứng dụng bên thứ ba (bao gồm Google Play và Apple App Store) cùng các dịch vụ bên ngoài. Mọi lượt tải xuống, mua hàng trong ứng dụng, gói đăng ký hoặc tương tác được thực hiện qua nền tảng bên thứ ba chỉ chịu sự điều chỉnh của điều khoản và chính sách của các bên thứ ba đó.',
    'terms.s5.title': 'Tuyên bố miễn trừ bảo đảm',
    'terms.s5.p1':
      'Game Hub và toàn bộ trò chơi truy cập qua nền tảng được cung cấp trên cơ sở “NGUYÊN TRẠNG” và “THEO KHẢ NĂNG SẴN CÓ” mà không có bất kỳ bảo đảm nào, dù rõ ràng hay ngụ ý, bao gồm các bảo đảm ngụ ý về khả năng thương mại, sự phù hợp cho một mục đích cụ thể hoặc không vi phạm.',
    'terms.s5.p2':
      'Chúng tôi không bảo đảm tính khả dụng liên tục không gián đoạn, trải nghiệm chơi không lỗi hoặc việc lưu giữ vĩnh viễn tiến trình hay điểm số được lưu cục bộ trên trình duyệt.',
    'terms.s6.title': 'Giới hạn trách nhiệm',
    'terms.s6.p1':
      'Trong phạm vi tối đa được pháp luật hiện hành cho phép, Game Hub và đơn vị vận hành sẽ không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hệ quả hoặc mang tính trừng phạt nào — hay bất kỳ tổn thất nào về dữ liệu, điểm số hoặc chức năng thiết bị — phát sinh từ hoặc liên quan đến việc bạn sử dụng hoặc không thể sử dụng nền tảng hay bất kỳ trò chơi bên thứ ba được liên kết nào.',
    'terms.s7.title': 'Thay đổi đối với Điều khoản này',
    'terms.s7.p1':
      'Chúng tôi có thể cập nhật các Điều khoản sử dụng này theo thời gian. Mọi bản sửa đổi sẽ được đăng trên trang này kèm ngày hiệu lực mới. Việc bạn tiếp tục sử dụng Game Hub sau khi các thay đổi được đăng đồng nghĩa với việc bạn chấp nhận các Điều khoản đã sửa đổi.',

    // AboutPage
    'about.docTitle': 'Giới thiệu Game Hub',
    'about.docDesc':
      'Giới thiệu Game Hub ({siteDomain}) — các trò chơi giải đố và chiến thuật offline-first được chế tác tỉ mỉ, chơi trực tiếp trên trình duyệt của bạn.',
    'about.badge': 'Giới thiệu',
    'about.title': 'Giới thiệu về Game Hub',
    'about.intro':
      'Game Hub ({siteDomain}) là cổng game trình duyệt độc lập dành riêng cho các trò chơi giải đố, logic và chiến thuật nguyên bản được xây dựng bằng Flutter cho web và thiết bị di động.',
    'about.s1.title': 'Sứ mệnh của chúng tôi',
    'about.s1.p1':
      'Chúng tôi tập trung vào những phiên chơi gọn gàng, tập trung và khởi chạy ngay lập tức trên mọi trình duyệt máy tính hoặc di động hiện đại. Mỗi trò chơi trong danh mục đều được thiết kế dễ làm quen, giàu thử thách để chinh phục và có thể chơi ngay mà không cần đăng ký hay đăng nhập.',
    'about.s2.title': 'Ưu tiên Offline & Lưu tiến trình cục bộ',
    'about.s2.p1':
      'Các tựa game của chúng tôi được xây dựng theo kiến trúc offline-first: màn chơi và gói câu đố cốt lõi được đóng gói sẵn trong từng trò chơi, còn tiến trình, điểm số và tùy chọn hiển thị của bạn được lưu cục bộ ngay trên thiết bị. Nhiều trò chơi cũng có ứng dụng di động đi kèm trên Google Play và Apple App Store để chơi offline trọn vẹn.',
    'about.s3.title': 'Cách chúng tôi duy trì Game Hub miễn phí',
    'about.s3.p1':
      'Tất cả trò chơi trình duyệt trên {siteDomain} đều miễn phí. Để trang trải chi phí lưu trữ tĩnh, duy trì tên miền và tiếp tục phát triển game, cổng game có thể hiển thị quảng cáo được tách biệt rõ ràng thông qua Google AdSense theo đúng {privacyLink} của chúng tôi.',
    'about.exploreGames': 'Khám phá tất cả game',
    'about.getInTouch': 'Liên hệ ngay',

    // ContactPage
    'contact.docTitle': 'Liên hệ',
    'contact.docDesc':
      'Liên hệ đội ngũ Game Hub tại {siteDomain} để được hỗ trợ người chơi, báo lỗi, giải đáp quyền riêng tư hoặc bản quyền.',
    'contact.badge': 'Hỗ trợ & Liên hệ',
    'contact.title': 'Liên hệ với chúng tôi',
    'contact.intro':
      'Bạn có góp ý về trò chơi, phát hiện lỗi, hoặc cần liên hệ về quyền riêng tư, quảng cáo hay sở hữu trí tuệ trên {siteDomain}? Chúng tôi luôn sẵn sàng lắng nghe.',
    'contact.s1.title': 'Email trực tiếp',
    'contact.s1.p1': 'Bạn có thể liên hệ trực tiếp với đội ngũ Game Hub qua email: {emailLink}',
    'contact.s1.p2':
      'Chúng tôi thường phản hồi các yêu cầu hỗ trợ người chơi và câu hỏi chính sách trong vòng 2–3 ngày làm việc.',
    'contact.s2.title': 'Thông tin nên đính kèm trong tin nhắn',
    'contact.s2.item1Title': 'Báo lỗi:',
    'contact.s2.item1Body':
      'Tên trò chơi, loại trình duyệt/thiết bị bạn đang dùng và mô tả ngắn gọn sự cố đã xảy ra.',
    'contact.s2.item2Title': 'Quyền riêng tư & Tùy chọn quảng cáo:',
    'contact.s2.item2Body':
      'Các câu hỏi liên quan đến {privacyLink} hoặc thông tin công bố về cookie/quảng cáo.',
    'contact.s2.item3Title': 'Thông báo bản quyền / DMCA:',
    'contact.s2.item3Body':
      'Đường dẫn URL chính xác trên {siteDomain}, chi tiết về nội dung liên quan và thông tin liên hệ của bạn.',
  },
  ja: {
    'legal.badge': '法的文書',
    'legal.lastUpdatedValue': '2026年11月',
    'legal.lastUpdatedLabel': '最終更新: {date}',
    'legal.privacyLink': 'プライバシーポリシー',
    'legal.termsLink': '利用規約',
    'legal.aboutLink': 'Game Hubについて',
    'legal.contactLink': 'お問い合わせ',

    // PrivacyPage
    'privacy.docTitle': 'プライバシーポリシー',
    'privacy.docDesc':
      'Game Hubにおけるブラウザ保存領域、技術データ、外部リンク、およびユーザープライバシーの取り扱いについて説明します。',
    'privacy.title': 'プライバシーポリシー',
    'privacy.intro':
      '本プライバシーポリシーは、お客様がGame Hub（以下「当プラットフォーム」）のウェブサイトを訪問し、カタログを閲覧し、またはGame Hubを通じて提供されるゲームをプレイする際に、当プラットフォームがどのように情報を収集、利用、保存、保護するかを説明するものです。',
    'privacy.s1.title': '適用範囲とプラットフォームへのアクセス',
    'privacy.s1.p1':
      'Game Hubは、厳選されたゲームカタログへのブラウザベースでのアクセスおよびネイティブモバイルアプリへの任意リンクを提供します。一般の訪問者は、アカウントを作成することなくカタログを閲覧し、利用可能なWebゲームを起動できます。',
    'privacy.s1.p2':
      '本ポリシーはGame HubのウェブサイトおよびWebプレイヤーシェルに適用されます。サードパーティのアプリストア（Google PlayやApple App Storeなど）を通じて配信される個別のゲームまたはネイティブモバイルアプリには、それぞれの開発者またはストアプラットフォームが提供する追加のプライバシー開示が適用される場合があります。',
    'privacy.s2.title': '収集する情報',
    'privacy.s2.intro':
      'Game Hubのご利用方法に応じて、以下のカテゴリのデータが処理される場合があります：',
    'privacy.s2.item1Title': 'ブラウザおよびローカルストレージデータ：',
    'privacy.s2.item1Body':
      '選択された表示テーマ、キャッシュされたカタログ情報、案内ダイアログの非表示状態、ローカルのゲーム進行状況（ハイスコアやセッション設定など）といった設定は、{localStorage}や{indexedDb}を使用してご利用のデバイス上に直接保存される場合があります。',
    'privacy.s2.item2Title': '技術・診断データ：',
    'privacy.s2.item2Body':
      '標準的なWebホスティングおよび配信インフラストラクチャでは、コンテンツを安定して提供し不正利用から保護するため、IPアドレス、ブラウザの種類、OS、画面ビューポート、参照元URL、エラーログなどの技術メタデータを処理する場合があります。',
    'privacy.s2.item3Title': 'オンライン機能およびアカウント（該当する場合）：',
    'privacy.s2.item3Body':
      '特定のゲームや今後のプラットフォーム機能（ランキング、マルチプレイヤーセッション、クラウドセーブ、管理者ログインなど）では、動作のために認証やネットワーク通信が必要となる場合があります。',
    'privacy.s3.title': 'Cookie、アクセス解析およびGoogle AdSense',
    'privacy.s3.p1':
      '当プラットフォームでは、画面設定を記憶し快適な応答性を維持するために必要なブラウザ保存領域を使用します。ホスティングおよび継続的な開発を支えるため、Game Hub（{siteDomain}）では{googleAdSense}によって配信される第三者広告を表示しています。',
    'privacy.s3.item1':
      'Googleを含む第三者配信事業者は、ユーザーが{siteDomain}やインターネット上の他のウェブサイトに過去にアクセスした際の情報に基づいて広告を配信するためCookieを使用します。',
    'privacy.s3.item2':
      'Googleが広告Cookieを使用することにより、お客様が本サイトやインターネット上の他のサイトにアクセスした際の情報に基づいて、Googleやそのパートナーが適切な広告をお客様に表示できるようになります。',
    'privacy.s3.item3':
      'パーソナライズ広告は{adsSettingsLink}からいつでもオプトアウトできます。また、第三者配信事業者のCookieについては{aboutAdsLink}から無効にできます。',
    'privacy.s3.adsSettingsLabel': 'Google広告設定',
    'privacy.s3.aboutAdsLabel': 'www.aboutads.info',
    'privacy.s3.item4':
      'Googleがパートナーサイトからのデータをどのように使用するかについては、{googleAdsPolicyLink}をご覧ください。',
    'privacy.s3.googleAdsPolicyLabel': 'Google 広告のプライバシーと規約',
    'privacy.s3.p2':
      '地域のプライバシー法規制（EEA、英国、スイスなど）で求められる場合、パーソナライズ広告Cookieを使用する前に同意選択画面が表示されます。',
    'privacy.s4.title': '埋め込みゲームと第三者リンク',
    'privacy.s4.p1':
      'Game Hub上でプレイされるゲームは、サンドボックス化されたiframe内の信頼できる外部オリジンから読み込まれる場合があり、ゲーム詳細ページには外部のアプリストアや開発者ウェブサイトへのリンクが含まれる場合があります。当プラットフォームは第三者のウェブサイトやアプリストアのプライバシー慣行を管理しておらず、個人情報を共有する前に各社のポリシーを確認されることを推奨します。',
    'privacy.s5.title': 'データの保持とお客様の管理手段',
    'privacy.s5.p1':
      'ブラウザ内にローカル保存されたデータは、ブラウザのストレージまたはサイトデータを消去するまでデバイス上に残ります。ブラウザ設定からいつでもCookieやサイトストレージを管理またはブロックできますが、ローカルストレージを無効にすると保存されたゲーム進行状況や表示設定がリセットされる場合があります。',
    'privacy.s6.title': 'お子様のプライバシー',
    'privacy.s6.p1':
      'Game Hubは一般向けとして設計されています。当プラットフォームは、検証可能な保護者の同意なしに13歳未満（またはお住まいの地域のデジタル同意最低年齢未満）のお子様から個人を特定できる連絡先情報を意図的に収集することはありません。誤って個人データが提供されたと思われる場合は、速やかに削除するためプラットフォーム管理者までご連絡ください。',
    'privacy.s7.title': 'セキュリティとポリシーの更新',
    'privacy.s7.p1':
      '当プラットフォームを保護するため、HTTPS通信、埋め込みゲームの厳格なオリジン検証、管理ツールに対するロールベースのアクセス制御など、合理的な技術的および組織的保護措置を講じています。',
    'privacy.s7.p2':
      '新機能、ゲーム、または法的要件を反映するため、本プライバシーポリシーを定期的に改定する場合があります。更新は改定後の「最終更新」日とともに本ページに掲載された時点で効力を生じます。',

    // TermsPage
    'terms.docTitle': '利用規約',
    'terms.docDesc': 'Game Hubプラットフォームおよびゲームへのアクセスと利用に適用される規約と条件。',
    'terms.title': '利用規約',
    'terms.intro':
      'Game Hubにアクセスまたは利用する前に、本利用規約をよくお読みください。本サイトを閲覧し、またはプラットフォーム上のゲームを起動することで、お客様は本規約および当プラットフォームの{privacyLink}に拘束されることに同意したものとみなされます。',
    'terms.s1.title': 'プラットフォームの利用',
    'terms.s1.p1':
      'Game Hubは、個人的な利用を目的としてウェブサイトにアクセスし提供中のゲームをプレイするための、限定的、非独占的、譲渡不可かつ取消可能なライセンスをお客様に付与します。当プラットフォームは、事前の通知や責任を負うことなく、いつでもゲーム、機能、またはプラットフォームの一部を追加、変更、停止、または終了する権利を留保します。',
    'terms.s2.title': '禁止事項',
    'terms.s2.intro': 'Game Hubをご利用の際、お客様は以下の行為を行わないことに同意するものとします：',
    'terms.s2.item1':
      'セキュリティ制御を回避しようとすること、管理用エンドポイントを探索すること、またはプラットフォームのインフラやアカウントへ不正アクセスすること。',
    'terms.s2.item2':
      '他のユーザーに対するプラットフォームの可用性を低下させる自動ボット、スクレイパー、またはサービス妨害手法を使用すること。',
    'terms.s2.item3':
      'バグを悪用すること、ゲームクライアントやマルチプレイヤーサービスを改ざんすること、または埋め込みセッションへ悪意のあるスクリプトを注入すること。',
    'terms.s2.item4':
      '各権利者の明示的な許可なく、Game Hubプラットフォームまたはホストされているゲームアセットを再配布、再販売、またはフレーム埋め込みすること。',
    'terms.s3.title': '知的財産権',
    'terms.s3.p1':
      'プラットフォームのすべてのインターフェース、ブランド、テキスト、グラフィック、およびソフトウェアはGame Hubまたはそのライセンサーに帰属します。個々のゲーム、タイトル、アートワーク、音声、および商標はそれぞれの開発者およびパブリッシャーの知的財産であり続けます。本規約のいかなる規定も、知的財産権の所有権をお客様へ移転するものではありません。',
    'terms.s4.title': '第三者サービス、ストアおよび収益化',
    'terms.s4.p1':
      'Game Hubでは、広告、プロモーション枠、または第三者のアプリストア（Google PlayおよびApple App Storeを含む）や外部サービスへのリンクが表示される場合があります。第三者プラットフォームを通じて行われるダウンロード、アプリ内課金、サブスクリプション、またはやり取りには、当該第三者の規約およびポリシーのみが適用されます。',
    'terms.s5.title': '保証の否認',
    'terms.s5.p1':
      'Game Hubおよびプラットフォームを通じてアクセス可能なすべてのゲームは、「現状有姿」かつ「提供可能な範囲」で提供され、商品性、特定目的への適合性、または非侵害の黙示的保証を含め、明示・黙示を問わずいかなる種類の保証も伴いません。',
    'terms.s5.p2':
      '当プラットフォームは、中断のない可用性、エラーのないゲームプレイ、またはブラウザ内にローカル保存された進行状況やスコアの永続的な保持を保証しません。',
    'terms.s6.title': '責任の制限',
    'terms.s6.p1':
      '適用法で許容される最大限の範囲において、Game Hubおよびその運営者は、本プラットフォームまたはリンクされた第三者ゲームの利用もしくは利用不能に起因または関連して生じた、いかなる間接的、付随的、特別、結果的または懲罰的損害、ならびにデータ、スコア、またはデバイス機能の喪失についても責任を負いません。',
    'terms.s7.title': '本規約の変更',
    'terms.s7.p1':
      '本利用規約は随時更新される場合があります。改定内容は更新後の発効日とともに本ページに掲載されます。変更の掲載後もGame Hubを継続して利用された場合、改定後の規約に同意したものとみなされます。',

    // AboutPage
    'about.docTitle': 'Game Hubについて',
    'about.docDesc':
      'Game Hub（{siteDomain}）について — ブラウザでそのまま遊べる、こだわりのオフライン対応パズル＆ストラテジーゲーム。',
    'about.badge': '概要',
    'about.title': 'Game Hubについて',
    'about.intro':
      'Game Hub（{siteDomain}）は、Webおよびモバイルデバイス向けにFlutterで構築された、オリジナルのパズル・ロジック・ストラテジーゲームをお届けする独立系ブラウザゲームポータルです。',
    'about.s1.title': '私たちのミッション',
    'about.s1.p1':
      '私たちは、現代のデスクトップやモバイルのブラウザですぐに始められる、シンプルで集中できるゲーム体験を重視しています。カタログ内のすべてのゲームは、覚えやすく奥深い楽しさを持ち、会員登録やログイン不要で遊べるように作られています。',
    'about.s2.title': 'オフラインファーストとローカル保存',
    'about.s2.p1':
      '各タイトルはオフラインファーストの設計で作られており、ステージや主要なパズルパックはゲーム本体に同梱され、進行状況・スコア・表示設定はお使いのデバイスにローカル保存されます。多くのタイトルでは、完全オフラインで遊べるGoogle PlayおよびApple App Store向けのコンパニオンアプリも提供しています。',
    'about.s3.title': 'Game Hubを無料で提供できる理由',
    'about.s3.p1':
      '{siteDomain}のブラウザゲームはすべて無料でプレイできます。静的ホスティングやドメイン維持、継続的なゲーム開発の費用を賄うため、ポータル内では当プラットフォームの{privacyLink}に従い、ゲーム画面とは明確に分離された形でGoogle AdSenseによる広告を表示する場合があります。',
    'about.exploreGames': 'すべてのゲームを見る',
    'about.getInTouch': 'お問い合わせ',

    // ContactPage
    'contact.docTitle': 'お問い合わせ',
    'contact.docDesc':
      'プレイヤーサポート、不具合報告、プライバシーや著作権に関するお問い合わせは、{siteDomain}のGame Hubチームまでご連絡ください。',
    'contact.badge': 'サポート・お問い合わせ',
    'contact.title': 'お問い合わせ',
    'contact.intro':
      '{siteDomain}のゲームに関するご感想、不具合のご報告、またはプライバシー、広告、知的財産に関するお問い合わせがございましたら、お気軽にご連絡ください。',
    'contact.s1.title': 'メールでのお問い合わせ',
    'contact.s1.p1': 'Game Hubチームへ直接メールでご連絡いただけます：{emailLink}',
    'contact.s1.p2':
      'プレイヤーサポートおよびポリシーに関するお問い合わせには、通常2〜3営業日以内にご返信いたします。',
    'contact.s2.title': 'お問い合わせ時にご記載いただきたい内容',
    'contact.s2.item1Title': '不具合の報告：',
    'contact.s2.item1Body': 'ゲームタイトル、ご利用のブラウザ／デバイスの種類、発生した事象の簡単な説明。',
    'contact.s2.item2Title': 'プライバシーおよび広告設定：',
    'contact.s2.item2Body': '当プラットフォームの{privacyLink}やCookie／広告開示に関するご質問。',
    'contact.s2.item3Title': '著作権／DMCAに関する通知：',
    'contact.s2.item3Body':
      '{siteDomain}上の該当ページの正確なURL、対象コンテンツの詳細、およびお客様のご連絡先情報。',
  },
} as const;
