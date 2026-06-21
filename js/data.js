/**
 * مصفوفة الكورسات الوهمية - مصدر البيانات الرئيسي للمنصة
 * تحتوي على 6 كورسات متنوعة في التصنيفات المختلفة
 */
const coursesData = [
  {
    id: 1,
    title: "تعلم JavaScript من الصفر",
    instructor: "أحمد محمد",
    price: 299,
    rating: 4.8,
    category: "برمجة",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
    progress: 0,
    description: "أتقن أساسيات JavaScript الحديثة وبناء تطبيقات تفاعلية من الصفر.",
    duration: "8 ساعات",
    lessons: 45,
    level: "مبتدئ"
  },
  {
    id: 2,
    title: "React.js للمبتدئين",
    instructor: "سارة علي",
    price: 399,
    rating: 4.9,
    category: "برمجة",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    progress: 0,
    description: "تعلّم بناء واجهات مستخدم حديثة باستخدام React.js خطوة بخطوة.",
    duration: "12 ساعة",
    lessons: 60,
    level: "متوسط"
  },
  {
    id: 3,
    title: "تصميم UI/UX احترافي",
    instructor: "ليلى حسن",
    price: 349,
    rating: 4.7,
    category: "تصميم",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    progress: 0,
    description: "اكتشف مبادئ التصميم وتجربة المستخدم لإنشاء واجهات جذابة.",
    duration: "10 ساعات",
    lessons: 50,
    level: "مبتدئ"
  },
  {
    id: 4,
    title: "التسويق الرقمي المتقدم",
    instructor: "خالد إبراهيم",
    price: 279,
    rating: 4.6,
    category: "تسويق",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    progress: 0,
    description: "استراتيجيات التسويق عبر وسائل التواصل والإعلانات الرقمية.",
    duration: "6 ساعات",
    lessons: 35,
    level: "متقدم"
  },
  {
    id: 5,
    title: "إدارة المشاريع الاحترافية",
    instructor: "نور الدين",
    price: 249,
    rating: 4.5,
    category: "أعمال",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    progress: 0,
    description: "تعلّم منهجيات إدارة المشاريع وأدوات التخطيط والتنفيذ.",
    duration: "7 ساعات",
    lessons: 40,
    level: "متوسط"
  },
  {
    id: 6,
    title: "Figma للمصممين",
    instructor: "مريم أحمد",
    price: 199,
    rating: 4.8,
    category: "تصميم",
    image: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80",
    progress: 0,
    description: "أتقن أداة Figma لتصميم واجهات وتجربة مستخدم احترافية.",
    duration: "5 ساعات",
    lessons: 30,
    level: "مبتدئ"
  }
];
