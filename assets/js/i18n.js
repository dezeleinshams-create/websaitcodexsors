/**
 * CODEXSORS — Bilingual System (Arabic & English)
 * Arabic is primary; English is fully supported.
 */

const translations = {
  ar: {
    brand_tagline: "Build Your Digital Future",
    nav_home: "الرئيسية",
    nav_services: "خدماتنا",
    nav_calc: "حاسبة المشروع",
    nav_process: "خطوات العمل",
    nav_why: "لماذا CODEXSORS",
    nav_faq: "الأسئلة الشائعة",
    nav_contact: "تواصل معنا",
    nav_cta: "طلب عرض سعر",
    
    hero_badge: "شريكك التقني الموثوق في المملكة العربية السعودية",
    hero_title: "نحوّل أفكارك إلى حلول رقمية تصنع الفرق",
    hero_subtitle: "CODEXSORS علامة متخصصة في تقديم الحلول والخدمات البرمجية للشركات، المتاجر، والمشروعات الناشئة. نبني منصاتك وتطبيقاتك بأعلى معايير الجودة والأمان.",
    hero_btn_quote: "اطلب عرض سعر لمشروعك",
    hero_btn_whatsapp: "محادثة فورية عبر واتساب",

    hl_clean_code: "كود مخصص ونظيف",
    hl_clean_code_sub: "بدون قوالب مكررة أو بطيئة",
    hl_contracts: "اتفاقيات ومواعيد دقيقة",
    hl_contracts_sub: "التزام كامل بخطة العمل",
    hl_saudi_market: "مهيأ للسوق السعودي",
    hl_saudi_market_sub: "تكامل مع الدفع والشحن المعتمد",
    hl_support: "دعم فني وضمان شامل",
    hl_support_sub: "متابعة مستمرة بعد الإطلاق",

    services_title: "خدماتنا الرقمية المتكاملة",
    services_desc: "نقدّم 8 خدمات رئيسية مدروسة بعناية لتغطية احتياجات المشروعات من مرحلة الفكرة والتصميم وحتى الإطلاق والنمو في السوق.",
    service_deliverables_head: "ما الذي ستحصل عليه:",
    service_btn_quote: "طلب عرض سعر",
    service_btn_wa: "واتساب مباشر",

    // 8 Services Titles & Descriptions
    s1_title: "تصميم وتطوير المواقع الإلكترونية",
    s1_desc: "بناء مواقع تعريفية ومواقع شركات احترافية تعكس هوية علامتك التجارية، سريعة التصفح، ومتوافقة بنسبة 100% مع جميع الأجهزة ومحركات البحث.",
    s1_d1: "تصميم واجهات عصري يعبر عن هوية الشركة وقيمها.",
    s1_d2: "سرعة تحميل فائقة وتوافق كامل مع شاشات الجوال والتابلت.",
    s1_d3: "لوحة تحكم ديناميكية وسهلة لإدارة وتحديث محتوى الموقع.",
    s1_d4: "تأمين شامل وحماية بشهادات SSL وممارسات أمان متقدمة.",

    s2_title: "إنشاء وتصميم المتاجر الإلكترونية",
    s2_desc: "متجرك هو واجهتك البيعية على مدار 24 ساعة. نبني متاجر سريعة ومصممة لزيادة معدل التحويل وسهولة الشراء مع تجربة مستخدم سلسة خالية من التعقيد.",
    s2_d1: "تكامل سلس مع بوابات الدفع المعتمدة في السعودية (مدى، Apple Pay، تمارا، تابي).",
    s2_d2: "ربط مع شركات الشحن وإدارة المخزون والتنبيهات التلقائية.",
    s2_d3: "تصميم صفحات المنتجات وسلة الشراء لتحقيق أعلى نسبة إتمام للطلبات.",
    s2_d4: "لوحة تحكم تفصيلية لمتابعة المبيعات والطلبات والتقارير المالية.",

    s3_title: "تطوير تطبيقات Android و iOS",
    s3_desc: "تطوير تطبيقات جوال أصلية (Native & Cross-Platform) فائقة الأداء، تقدم تجربة مستخدم متميزة، وتعمل باستقرار تام على منصتي Google Play و Apple App Store.",
    s3_d1: "بنية برمجية قوية وقابلة للتوسع لاستيعاب آلاف المستخدمين.",
    s3_d2: "تصميم شاشات تفاعلية ومريحة تناسب سلوك المستخدمين في السعودية.",
    s3_d3: "نظام إشعارات ذكية مخصص، وربط مع بوابات الدفع الإلكتروني والخرائط.",
    s3_d4: "إشراف كامل على تجهيز التطبيق ورفعه وقبوله في المتاجر الرسمية.",

    s4_title: "تصميم واجهات وتجربة المستخدم UI/UX",
    s4_desc: "نحوّل العمليات المعقدة إلى واجهات بصرية أنيقة وتجربة استخدام بديهية تعتمد على دراسة سلوك العميل وتضمن بقاء الزائر وسهولة وصوله لأهدافه.",
    s4_d1: "دراسة وتحليل رحلة العميل وسلوكه قبل البدء بالتصميم.",
    s4_d2: "تصميم نماذج أولية تفاعلية (Interactive Wireframes & Prototypes).",
    s4_d3: "نظام تصميم متكامل (Design System) موحد لكل مكونات المنصة.",
    s4_d4: "اختبارات قابلية الاستخدام لضمان أعلى مستويات السلاسة.",

    s5_title: "تطوير الأنظمة والبرمجيات الخاصة ولوحات التحكم",
    s5_desc: "حلول برمجية مخصصة للشركات لأتمتة العمليات اليومية وإدارة الأعمال، مثل أنظمة إدارة علاقات العملاء (CRM)، وإدارة الموارد (ERP)، ولوحات التحكم اللحظية.",
    s5_d1: "هندسة برمجية مفصلة خصيصاً لتناسب دورة عمل منشأتك بدقة.",
    s5_d2: "صلاحيات دقيقة للمستخدمين والموظفين مع حماية مشددة للبيانات.",
    s5_d3: "تقارير بيانية وإحصائيات فورية تدعم اتخاذ القرارات الإدارية.",
    s5_d4: "واجهات برمجة تطبيقات (APIs) للربط مع أي منصات أو خدمات خارجية.",

    s6_title: "صيانة المواقع وتحسين أدائها",
    s6_desc: "نضمن بقاء منصتك الإلكترونية تعمل بأقصى سرعة واستقرار، مع التحديثات الأمنية الدورية، والنسخ الاحتياطي، وحل المشكلات التقنية قبل أن يشعر بها عملاؤك.",
    s6_d1: "مراقبة مستمرة للأداء وسرعة الاستجابة على مدار الساعة.",
    s6_d2: "فحص أمني دوري وسد الثغرات وتحديث البرمجيات ومكتبات الكود.",
    s6_d3: "نسخ احتياطي منتظم لقواعد البيانات والملفات في بيئة معزولة.",
    s6_d4: "فريق دعم فني سريع الاستجابة للتعامل مع أي طوارئ تقنية.",

    s7_title: "تحسين محركات البحث SEO",
    s7_desc: "نساعد موقعك ومتجرك على تصدر نتائج البحث الأولى في Google للكلمات المفتاحية الأكثر ربحية واستهدافاً للعملاء داخل المملكة العربية السعودية.",
    s7_d1: "تهيئة تقنية شاملة للموقع (سرعة، هيكل الروابط، ملفات الروبوت، خريطة الموقع).",
    s7_d2: "استهداف كلمات مفتاحية دقيقة يطلبها الجمهور السعودي الفعلي.",
    s7_d3: "تحسين المحتوى وبناء تجربة تصفح تدعم ثقة محركات البحث.",
    s7_d4: "تقارير شهرية شفافة توضح تطور الترتيب وزيادة عدد الزوار والعملاء.",

    s8_title: "إعداد وإدارة الحملات الإعلانية على Google Ads",
    s8_desc: "إدارة حملات إعلانية احترافية مدروسة على شبكة البحث ويوتيوب، تضمن وصولك للعميل المستعد للشراء، مع مراقبة يومية لتحقيق أعلى عائد على الإنفاق الإعلاني (ROAS).",
    s8_d1: "هيكلة احترافية للحملات الإعلانية تستهدف نية الشراء الحقيقية.",
    s8_d2: "كتابة نصوص إعلانية مقنعة واختبار نسخ متعددة للوصول لأفضل أداء.",
    s8_d3: "ضبط دقيق لتتبع التحويلات (Conversion Tracking) وربط Google Analytics.",
    s8_d4: "إدارة وتوزيع الميزانية لتفادي الهدر وتحقيق أقل تكلفة للاستحواذ على العميل.",

    // Calculator Section
    calc_title: "حدّد نطاق مشروعك واحصل على تقدير فوري",
    calc_desc: "اختر نوع المشروع والخصائص التي تحتاجها لنقوم بتجهيز خطة العمل المناسبة والتواصل معك لمناقشة التفاصيل وعرض السعر المخصص.",
    calc_step1: "1. اختر نوع المشروع الأساسي",
    calc_step2: "2. الميزات والخدمات الإضافية المطلوبة",
    calc_summary_title: "ملخص مواصفات مشروعك",
    calc_summary_btn_wa: "إرسال المواصفات عبر واتساب",
    calc_summary_btn_quote: "طلب عرض سعر رسمي",

    // Process
    process_title: "منهجية عمل واضحة من الفكرة إلى الإطلاق",
    process_desc: "نتبع خطوات منهجية مدروسة تضمن لك الشفافية التامة، وتسلّمك مشروعك بجودة عالية وفي الموعد المتفق عليه دون مفاجآت.",
    p1_title: "1. دراسة وتحليل المتطلبات",
    p1_desc: "نجلس معك ونستمع لأهداف مشروعك وجمهورك المستهدف لنضع وثيقة مواصفات فنية واضحة ومحددة.",
    p2_title: "2. هندسة وتخطيط الحل",
    p2_desc: "تحديد أفضل التقنيات المناسبة، رسم هيكلية قواعد البيانات، وتوزيع مراحل التنفيذ الزمنية بدقة.",
    p3_title: "3. تصميم واجهات المستخدم UI/UX",
    p3_desc: "رسم واجهات المشروع خطوة بخطوة ومشاركتها معك للتأكد من ملاءمتها لتطلعاتك قبل كتابة الكود.",
    p4_title: "4. البرمجة والتطوير الفعلي",
    p4_desc: "كتابة كود برمجي نظيف وقوي وسريع مع مراعاة أعلى معايير الأمان وقابلية التوسع مستقبلاً.",
    p5_title: "5. الفحص وضمان الجودة (QA)",
    p5_desc: "اختبار وظائف المشروع تحت ظروف استخدام مختلفة وعلى جميع مقاسات الشاشات لضمان انعدام الأخطاء.",
    p6_title: "6. الإطلاق والدعم المستمر",
    p6_desc: "رفع المشروع على السيرفرات الرسمية، وتدريب فريقك على لوحة التحكم، مع توفير دعم فني دائم.",

    // Why Us
    why_title: "لماذا يختار رواد الأعمال CODEXSORS؟",
    why_desc: "نحن لسنا مجرد منفذين تقنيين، بل شركاء نجاح نستثمر خبراتنا لضمان تفوق مشروعك في السوق السعودي.",
    w1_title: "تطوير مخصص بدون قوالب جاهزة",
    w1_desc: "كل سطر برمجي يُكتب خصيصاً لخدمة أهداف عملك، مما يضمن سرعة فائقة وحماية من ثغرات القوالب المستهلكة.",
    w2_title: "فهم عميق للسوق السعودي",
    w2_desc: "ندرك متطلبات السوق المحلي واحتياجات المستهلك السعودي وتكامل المنصات مع بوابات الدفع والشحن المعتمدة.",
    w3_title: "التزام كامل بالمواعيد والمخرجات",
    w3_desc: "نعمل بخطط زمنية محددة وعقود واضحة تضمن تسليم كل مرحلة في موعدها الدقيق دون تسويف.",
    w4_title: "أمان متقدم وحماية للبيانات",
    w4_desc: "نطبق أفضل الممارسات البرمجية العالمية لحماية بياناتك وبيانات عملائك من أي تسريب أو هجمات.",

    // FAQ
    faq_title: "الأسئلة الأكثر شيوعاً",
    faq_desc: "إجابات شفافة ومباشرة على أكثر الاستفسارات التي تهم أصحاب المشروعات قبل بدء العمل معنا.",
    q1: "كيف يتم تحديد تكلفة المشروع؟",
    a1: "يتم تحديد التكلفة بناءً على دراسة دقيقة للمتطلبات الفنية، عدد الشاشات، الميزات المطلوبة، والأنظمة المراد ربطها. نقدم لكل عميل عرض سعر مخصص ومفصل يوضح كل بند دون أي تكاليف خفية.",
    q2: "كم تستغرق مدة تنفيذ وتسليم المشروع؟",
    a2: "تعتمد المدة على حجم المشروع وطبيعته؛ فالمواقع التعريفية والمتاجر تستغرق عادة من 7 إلى 20 يوم عمل، بينما التطبيقات والأنظمة الخاصة تُحدد مدتها حسب جدول زمني مفصل يُعتمد قبل توقيع العقد.",
    q3: "هل يحصل العميل على حقوق ملكية الكود ولوحة تحكم كاملة؟",
    a3: "نعم تماماً، عند تسليم المشروع واستيفاء بنود العقد، يحصل العميل على كافة صلاحيات لوحة التحكم وبيانات السيرفرات وتكون ملكية المنصة له بنسبة 100%.",
    q4: "هل تقدمون دعماً فنياً بعد تسليم المشروع؟",
    a4: "بالتأكيد، نوفر فترة ضمان ودعم فني مجاني بعد الإطلاق لضمان استقرار العمل وتدريب العميل على الإدارة، بالإضافة إلى باقات صيانة دورية متقدمة.",

    // Contact Form
    contact_title: "جاهز لبدء مشروعك الرقمي؟",
    contact_desc: "تواصل معنا مباشرة عبر واتساب أو املأ النموذج وسنقوم بدراسة متطلباتك والرد عليك بعرض سعر مخصص في أسرع وقت.",
    contact_phone_label: "رقم التواصل الرسمي عبر واتساب",
    form_name: "الاسم الكامل",
    form_phone: "رقم الجوال / الواتساب",
    form_service: "الخدمة المطلوبة",
    form_budget: "الميزانية المتوقعة (اختياري)",
    form_details: "نبذة عن فكرة المشروع ومتطلباته",
    form_submit: "إرسال طلب عرض السعر",
    form_wa_btn: "إرسال البيانات مباشرة عبر واتساب",

    // Footer
    footer_about: "CODEXSORS — علامة متخصصة في تقديم الحلول والخدمات الرقمية للمؤسسات والشركات والمتاجر والمشروعات الناشئة في المملكة العربية السعودية.",
    footer_quick_links: "روابط سريعة",
    footer_services: "الخدمات",
    footer_contact: "قنوات التواصل",
    footer_rights: "جميع الحقوق محفوظة لشركة CODEXSORS © 2026",
    footer_admin: "لوحة الإدارة"
  },

  en: {
    brand_tagline: "Build Your Digital Future",
    nav_home: "Home",
    nav_services: "Services",
    nav_calc: "Project Calculator",
    nav_process: "Process",
    nav_why: "Why CODEXSORS",
    nav_faq: "FAQ",
    nav_contact: "Contact Us",
    nav_cta: "Request a Quote",
    
    hero_badge: "Your Trusted Digital Partner in Saudi Arabia",
    hero_title: "Transforming Your Ideas Into Digital Solutions That Make An Impact",
    hero_subtitle: "CODEXSORS is a premier digital solutions and software development company serving enterprises, e-commerce stores, and ambitious startups across Saudi Arabia.",
    hero_btn_quote: "Request a Project Quote",
    hero_btn_whatsapp: "Chat on WhatsApp",

    hl_clean_code: "Clean & Custom Code",
    hl_clean_code_sub: "Zero bloated, generic templates",
    hl_contracts: "Punctual Delivery",
    hl_contracts_sub: "Strict commitment to project scope",
    hl_saudi_market: "Saudi Market Ready",
    hl_saudi_market_sub: "Integrated with local gateways",
    hl_support: "Dedicated Support",
    hl_support_sub: "Continuous maintenance post-launch",

    services_title: "Our Comprehensive Digital Services",
    services_desc: "8 core tailored services engineered to cover your project lifecycle from concept and UI/UX design to robust development and market scaling.",
    service_deliverables_head: "Key Deliverables:",
    service_btn_quote: "Request Quote",
    service_btn_wa: "Direct WhatsApp",

    s1_title: "Web Design & Development",
    s1_desc: "Crafting bespoke corporate websites and modern digital platforms that embody your brand identity with ultra-fast speed and complete responsiveness.",
    s1_d1: "Modern bespoke UI reflecting your corporate identity.",
    s1_d2: "High-speed loading with 100% mobile and tablet responsiveness.",
    s1_d3: "Intuitive dynamic CMS dashboard for effortless content management.",
    s1_d4: "Enterprise-grade SSL security and bulletproof coding standards.",

    s2_title: "E-Commerce Development",
    s2_desc: "Your 24/7 digital storefront engineered for conversion. We build high-performance e-commerce platforms designed for seamless buying journeys.",
    s2_d1: "Full integration with authorized Saudi payment gateways (Mada, Apple Pay, Tamara, Tabby).",
    s2_d2: "Seamless connection with logistics, courier shipping APIs, and inventory alerts.",
    s2_d3: "High-converting product and checkout pages optimized to minimize cart abandonment.",
    s2_d4: "Comprehensive admin dashboard for sales tracking, order fulfillment, and analytics.",

    s3_title: "Android & iOS App Development",
    s3_desc: "Building high-performance native and cross-platform mobile applications engineered to deliver fluid user experiences across Google Play and Apple App Store.",
    s3_d1: "Scalable backend architecture designed to handle thousands of concurrent users.",
    s3_d2: "Tailored UI optimized specifically for Saudi consumer behavior.",
    s3_d3: "Push notifications engine, payment gateways, and live map integrations.",
    s3_d4: "Complete store deployment, review compliance, and official release management.",

    s4_title: "UI/UX Design",
    s4_desc: "Translating complex workflows into intuitive, visually stunning interfaces backed by real user research to ensure maximum engagement and retention.",
    s4_d1: "In-depth user journey analysis and persona mapping before wireframing.",
    s4_d2: "Interactive wireframes and high-fidelity click-through prototypes.",
    s4_d3: "Scalable, reusable Design System for design consistency.",
    s4_d4: "Rigorous usability testing to guarantee frictionless user flows.",

    s5_title: "Custom Systems & Dashboards",
    s5_desc: "Bespoke internal software solutions and cloud platforms designed to automate business operations, CRM, ERP, and real-time operational analytics.",
    s5_d1: "Architected strictly around your organization's unique operational workflow.",
    s5_d2: "Granular role-based user access controls with military-grade data protection.",
    s5_d3: "Real-time interactive data analytics to empower strategic executive decisions.",
    s5_d4: "Secure RESTful APIs for integration with third-party software and systems.",

    s6_title: "Website Maintenance & Optimization",
    s6_desc: "Ensuring your digital platform operates with peak speed, 99.9% uptime, regular automated security patches, and proactive bug prevention.",
    s6_d1: "24/7 uptime monitoring and automated response time checks.",
    s6_d2: "Routine vulnerability scans, software patching, and security audits.",
    s6_d3: "Automated off-site scheduled database and media backups.",
    s6_d4: "Rapid-response technical support for immediate issue resolution.",

    s7_title: "Search Engine Optimization (SEO)",
    s7_desc: "Propelling your website to top Google rankings for high-intent, commercially valuable keywords across the Kingdom of Saudi Arabia.",
    s7_d1: "Comprehensive technical SEO audit (speed, crawlability, schema, sitemaps).",
    s7_d2: "High-intent keyword research customized for local Saudi search demand.",
    s7_d3: "On-page content optimization to build domain authority.",
    s7_d4: "Transparent monthly performance and keyword ranking reports.",

    s8_title: "Google Ads Campaign Management",
    s8_desc: "Laser-focused Search, Display, and YouTube campaigns that capture high-intent buyers while minimizing ad spend waste for maximum ROAS.",
    s8_d1: "Strategic campaign structuring targeting high-intent commercial keywords.",
    s8_d2: "Compelling ad copy with continuous A/B multivariate testing.",
    s8_d3: "Precise Google Analytics and Conversion Tracking configuration.",
    s8_d4: "Active budget optimization to lower your customer acquisition cost (CAC).",

    calc_title: "Scope Your Project & Get an Instant Estimate",
    calc_desc: "Select your project type and desired features to receive a customized action plan and tailored quote.",
    calc_step1: "1. Select Project Type",
    calc_step2: "2. Key Features & Additional Modules",
    calc_summary_title: "Project Scope Summary",
    calc_summary_btn_wa: "Send Scope via WhatsApp",
    calc_summary_btn_quote: "Submit Formal Request",

    process_title: "Clear Methodology From Concept to Launch",
    process_desc: "A battle-tested 6-stage engineering process guaranteeing complete transparency, punctuality, and zero surprises.",
    p1_title: "1. Requirements Analysis",
    p1_desc: "Deep-dive stakeholder discovery to define technical specifications and measurable business goals.",
    p2_title: "2. Architecture & Planning",
    p2_desc: "Selecting the optimal tech stack, designing database schemas, and mapping milestones.",
    p3_title: "3. UI/UX Design",
    p3_desc: "Creating interactive prototypes and validating screen flows before writing a single line of code.",
    p4_title: "4. Development & Coding",
    p4_desc: "Engineering clean, secure, and scalable code following international software best practices.",
    p5_title: "5. QA & Stress Testing",
    p5_desc: "Rigorous cross-device testing, security vulnerability scans, and performance benchmarking.",
    p6_title: "6. Deployment & Support",
    p6_desc: "Production server deployment, team onboarding, and ongoing technical maintenance.",

    why_title: "Why Ambitious Businesses Choose CODEXSORS",
    why_desc: "We are more than developers; we are technical partners invested in driving your business growth in Saudi Arabia.",
    w1_title: "100% Custom Engineering",
    w1_desc: "Every line of code is written specifically for your needs, eliminating generic template vulnerabilities and lag.",
    w2_title: "Saudi Market Mastery",
    w2_desc: "Deep knowledge of Saudi consumer behavior, local regulations, and local payment and courier APIs.",
    w3_title: "Rigorous Punctuality",
    w3_desc: "Transparent contractual milestones and guaranteed sprint deliveries with strict accountability.",
    w4_title: "Enterprise-Grade Security",
    w4_desc: "Industry-standard cryptographic protocols and secure architecture protecting your valuable business assets.",

    faq_title: "Frequently Asked Questions",
    faq_desc: "Direct, transparent answers to essential questions before we begin collaborating.",
    q1: "How is project pricing determined?",
    a1: "Pricing is calculated based on exact technical requirements, screen counts, system integrations, and timeline. We provide a transparent, itemized proposal with zero hidden costs.",
    q2: "What is the typical project delivery timeline?",
    a2: "Timelines depend on complexity; corporate websites and stores typically range from 7 to 20 business days, while custom apps and systems follow structured multi-phase milestones.",
    q3: "Does the client retain full ownership of the source code?",
    a3: "Yes, 100%. Upon project completion and contract fulfillment, all source code, administrative credentials, and digital assets belong entirely to you.",
    q4: "Do you offer post-launch technical support?",
    a4: "Yes, every project includes complimentary post-launch warranty and monitoring, along with optional long-term proactive maintenance packages.",

    contact_title: "Ready to Build Your Digital Future?",
    contact_desc: "Reach out directly via WhatsApp or submit the form below. We will review your project requirements and respond promptly with a tailored proposal.",
    contact_phone_label: "Official WhatsApp Contact",
    form_name: "Full Name",
    form_phone: "Phone / WhatsApp Number",
    form_service: "Desired Service",
    form_budget: "Estimated Budget (Optional)",
    form_details: "Project Description & Requirements",
    form_submit: "Submit Quote Request",
    form_wa_btn: "Send Direct via WhatsApp",

    footer_about: "CODEXSORS — Digital solutions and software development company empowering enterprises, businesses, and startups across Saudi Arabia.",
    footer_quick_links: "Quick Links",
    footer_services: "Services",
    footer_contact: "Contact Channels",
    footer_rights: "All Rights Reserved to CODEXSORS © 2026",
    footer_admin: "Admin Dashboard"
  }
};

window.i18n = {
  currentLang: 'ar',

  init() {
    const saved = localStorage.getItem('codexsors_lang') || 'ar';
    this.setLanguage(saved);
  },

  setLanguage(lang) {
    if (!translations[lang]) lang = 'ar';
    this.currentLang = lang;
    localStorage.setItem('codexsors_lang', lang);

    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translations[lang][key];
        } else {
          el.textContent = translations[lang][key];
        }
      }
    });

    const switcher = document.getElementById('langSwitcher');
    if (switcher) {
      switcher.innerHTML = (lang === 'ar') 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> English`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> العربية`;
    }
  },

  toggle() {
    this.setLanguage(this.currentLang === 'ar' ? 'en' : 'ar');
  },

  t(key) {
    return (translations[this.currentLang] && translations[this.currentLang][key]) || key;
  }
};
