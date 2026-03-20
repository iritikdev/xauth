import {
  Package,
  Users2,
  ReceiptIndianRupee,
  Settings2,
  Boxes,
  ShieldCheck,
  Wallet,
  History,
  TrendingUp,
  Tags,
  ArrowRightLeft,
  BadgeCheck,
  CoinsIcon,
  Contact2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Network,
  PiggyBank,
  Send,
  UserCircle2,
  Lock,
} from "lucide-react";

export const products = [
  {
    id: "1",
    name: "Amaze Joint Pain Care Juice",
    price: 999,
    mrp: 1299,
    bvPoints: 350,
    rating: 4.6,
    reviews: 124,
    category: "Health Care",
    image: "/products/joint-pain-care.png",
    description:
      "A herbal formulation enriched with Punarnava and other powerful Ayurvedic herbs that helps support joint flexibility, reduce stiffness, and promote overall bone and joint health.",
  },
  {
    id: "2",
    name: "Amaze B.P. Care Juice",
    price: 999,
    mrp: 1299,
    bvAmount: 350,
    rating: 4.4,
    reviews: 98,
    category: "Health Care",
    image: "/products/bp-care.png",
    description:
      "A natural blend of selected herbs designed to help maintain healthy blood pressure levels, support heart health, and improve overall cardiovascular wellness.",
  },
  {
    id: "3",
    name: "Amaze Thyro Balance Juice",
    price: 999,
    mrp: 1299,
    bvAmount: 350,
    rating: 4.5,
    reviews: 76,
    category: "Health Care",
    image: "/products/thyro-balance.png",
    description:
      "A nutrient-rich Ayurvedic juice formulated to support thyroid balance, improve metabolism, and help detoxify the body while providing essential vitamins and minerals.",
  },
  {
    id: "4",
    name: "Amaze Diabic Care Juice",
    price: 999,
    mrp: 1299,
    bvAmount: 350,
    rating: 4.7,
    reviews: 143,
    category: "Health Care",
    image: "/products/diabic-care.png",
    description:
      "A powerful herbal combination including Karela, Jamun, and Methi seeds that helps support healthy blood sugar levels and improves overall metabolic health.",
  },
  {
    id: "5",
    name: "Amaze Liver Re-Live Juice",
    price: 999,
    mrp: 1299,
    bvAmount: 350,
    rating: 4.5,
    reviews: 89,
    category: "Health Care",
    image: "/products/liver-re-live.png",
    description:
      "A natural herbal tonic formulated with multiple Ayurvedic herbs to support liver detoxification, improve digestion, and promote better liver function.",
  },
];

export const DASHBOARD_SIDEBAR = {
  // navMain: [
  //   {
  //     title: "Overview",
  //     icon: "LayoutDashboard",
  //     url: "/dashboard",
  //     isActive: true,
  //   },
  //   {
  //     title: "Identity & Profile",
  //     url: "#",
  //     icon: "UserCircle2",
  //     items: [
  //       {
  //         title: "Personal Profile",
  //         url: "/dashboard/profile",
  //         icon: "Contact2",
  //       },
  //       {
  //         title: "KYC Verification",
  //         url: "/dashboard/kyc",
  //         icon: "BadgeCheck",
  //       },
  //       {
  //         title: "Welcome Letter",
  //         url: "/dashboard/welcome-letter",
  //         icon: "FileText",
  //       },
  //       {
  //         title: "Digital ID Card",
  //         url: "/dashboard/partnerIdentityCard",
  //         icon: "CreditCard",
  //       },
  //       {
  //         title: "Change Password",
  //         url: "/dashboard/updatePassword",
  //         icon: "Lock",
  //       },
  //     ],
  //   },
  //   {
      
  //     title: "Shop",
  //     icon: "ShoppingBag",
  //     url: "/shop",
  //     isActive: true,
  //   },
  //   {
      
  //     title: "My Orders",
  //     icon: "BaggageClaim",
  //     url: "/dashboard/orders",
  //     isActive: true,
  //   },
  //   {
  //     title: "My Network",
  //     url: "#",
  //     icon: "Network",
  //     items: [
  //       { title: "Genealogy Tree", url: "/dashboard/generology" },
  //       // { title: "Direct Referrals", url: "/dashboard/referrals" },
  //       // { title: "Downline Team", url: "/dashboard/team" },
  //     ],
  //   },
  //   {
  //     title: "Finances",
  //     url: "#",
  //     icon: "PiggyBank",
  //     items: [
  //       { title: "E-Wallet", url: "/dashboard/wallet", icon: "ArrowRightLeft" },
  //       {
  //         title: "Business Plan Calculator",
  //         url: "/dashboard/businessPlanCalculator",
  //         icon: "FileText",
  //       },
  //       // { title: "Income Reports", url: "/dashboard/income", icon: "BarChart3" },
  //       // { title: "Payout Summary", url: "/dashboard/payouts" },
  //     ],
  //   },
  // ],
  
  navMain: [
    {
      title: "Overview",
      icon: "LayoutDashboard",
      url: "/dashboard",
      isActive: true,
    },
    /* --- Earning & Business (Sabse Important) --- */
    {
      title: "Business Center",
      url: "#",
      icon: "PiggyBank", // Or "Wallet"
      isActive: true,
      items: [
        { 
          title: "My E-Wallet", 
          url: "/dashboard/wallet", 
          icon: "ArrowRightLeft" 
        },
        {
          title: "Income Reports",
          url: "/dashboard/income",
          icon: "BarChart3",
        },
        {
          title: "Plan Calculator",
          url: "/dashboard/businessPlanCalculator",
          icon: "Calculator",
        },
      ],
    },
    /* --- Network & Growth --- */
    {
      title: "My Network",
      url: "#",
      icon: "Network",
      items: [
        { title: "Genealogy Tree", url: "/dashboard/generology", icon: "GitGraph" },
        { title: "Direct Referrals", url: "/dashboard/referrals", icon: "UserPlus" },
        { title: "Downline Team", url: "/dashboard/team", icon: "Users2" },
      ],
    },
    /* --- Shopping & Commerce --- */
    {
      title: "Shop & Orders",
      url: "#",
      icon: "ShoppingBag",
      items: [
        { title: "Browse Products", url: "/shop", icon: "Store" },
        { title: "My Orders", url: "/dashboard/orders", icon: "BaggageClaim" },
      ],
    },
    /* --- Profile & Compliance (Secondary) --- */
    {
      title: "Identity & KYC",
      url: "#",
      icon: "ShieldCheck",
      items: [
        {
          title: "My Profile",
          url: "/dashboard/profile",
          icon: "User",
        },
        {
          title: "KYC Verification",
          url: "/dashboard/kyc",
          icon: "BadgeCheck",
        },
        {
          title: "Digital ID Card",
          url: "/dashboard/partnerIdentityCard",
          icon: "Contact2",
        },
        {
          title: "Welcome Letter",
          url: "/dashboard/welcome-letter",
          icon: "FileText",
        },
      ],
    },
    /* --- Settings & Security --- */
    {
      title: "Security",
      url: "#",
      icon: "Lock",
      items: [
        {
          title: "Change Password",
          url: "/dashboard/updatePassword",
          icon: "KeyRound",
        },
      ],
    },
  ],
  navSecondary: [
    { title: "Help Center", url: "#", icon: "LifeBuoy" },
    { title: "Send Feedback", url: "#", icon: "Send" },
  ],
  marketing: [{ name: "Marketing Kit", url: "/dashboard/kit", icon: "Coins" }],
};

export const ADMIN_SIDEBAR = {
  navMain: [
    {
      title: "Overview",
      icon: "LayoutDashboard",
      url: "/admin",
      isActive: true,
    },
    {
      title: "Ecommerce",
      url: "#",
      icon: "Package",
      items: [
        { title: "All Products", url: "/admin/products", icon: "Boxes" },
        { title: "Add Product", url: "/admin/products/new", icon: "Boxes" },
        { title: "Categories", url: "/admin/categories", icon: "Tags" },
        {
          title: "Manage Orders",
          url: "/admin/orders",
          icon: "ReceiptIndianRupee",
        },
        
      ],
    },
    {
      title: "Network & Partners",
      url: "#",
      icon: "Users2",
      items: [
        { title: "Partner Registry", url: "/admin/users", icon: "Users2" },
        {
          title: "KYC Approvals",
          url: "/admin/kyc",
          icon: "ShieldCheck",
        },
        { title: "Genealogy Master", url: "/admin/genealogy", icon: "History" },
      ],
    },
    {
      title: "Finances & Payouts",
      url: "#",
      icon: "Wallet",
      items: [
        {
          title: "Payout Requests",
          url: "/admin/payouts",
          icon: "ReceiptIndianRupee",
        },
        {
          title: "Commission Logs",
          url: "/admin/commissions",
          icon: "History",
        },
        { title: "Company Revenue", url: "/admin/revenue", icon: "TrendingUp" },
        { title: "Payouts", url: "/admin/payments", icon: "TrendingUp" },
      ],
    },
    {
      title: "Content Management",
      url: "#",
      icon: "FileText", // Lucide Icon
      items: [
        {
          title: "All Blog Posts",
          url: "/admin/blog",
          icon: "Library",
        },
        {
          title: "Create New Post",
          url: "/admin/blog/create",
          icon: "PlusCircle",
        },
        {
          title: "Categories",
          url: "/admin/blog/categories",
          icon: "Tags",
        },
        {
          title: "Comments",
          url: "/admin/blog/comments",
          icon: "MessageSquare",
        },
      ],
    },
  ],
  navSecondary: [
    { title: "System Settings", url: "/admin/settings", icon: "Settings2" },
    { title: "Support Tickets", url: "/admin/support", icon: "LifeBuoy" },
  ],
  marketing: [
    { name: "Promotional Kits", url: "/admin/marketing", icon: "Send" },
  ],
};

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

export const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "example@gmail.com",
  },
  // ...
];
