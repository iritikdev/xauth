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

 export const baseDashboardUrl = "/distributor/dashboard"

export const DASHBOARD_SIDEBAR = {
  
  
  navMain: [
    {
      title: "Overview",
      icon: "LayoutDashboard",
      url: baseDashboardUrl,
      isActive: true, // Default active page
    },
  
    /* --- Financial Hub (High Priority) --- */
    {
      title: "My E-Wallet",
      url: baseDashboardUrl + "/wallet",
      icon: "Wallet", // Suggestion: Use "Wallet" icon if available
    },
    {
      title: "Passive Wallet",
      url: baseDashboardUrl + "/passive-wallet",
      icon: "Coins", // Suggestion: Use "Wallet" icon if available
    },
  
    /* --- Network & Growth (Core MLM) --- */
    {
      title: "My Network",
      icon: "Network", // Better UX icon for network than "Network"
      url: "#", 
      items: [
        {
          title: "Genealogy Tree",
          url: baseDashboardUrl + "/generology",
          icon: "Network",
        },
        {
          title: "Plan Calculator",
          url: baseDashboardUrl + "/businessPlanCalculator",
          icon: "Calculator",
        },
      ],
    },
  
    /* --- Shopping & Commerce --- */
    {
      title: "Storefront",
      icon: "ShoppingBag",
      url: "#",
      items: [
        {
          title: "Browse Products",
          url: baseDashboardUrl + "/store",
          icon: "Store",
        },
        {
          title: "My Orders",
          url: baseDashboardUrl + "/orders",
          icon: "BaggageClaim",
        },
        {
          title: "Manage Addresses",
          url: baseDashboardUrl + "/manage-address",
          icon: "MapPin",
        },
      ],
    },
  
    /* --- Account & Compliance --- */
    {
      title: "Identity & Profile",
      url: "#",
      icon: "ShieldCheck",
      items: [
        {
          title: "Account Profile",
          url: baseDashboardUrl + "/profile",
          icon: "User",
        },
        {
          title: "KYC Verification",
          url: baseDashboardUrl + "/kyc",
          icon: "BadgeCheck",
        },
        {
          title: "Digital ID Card",
          url: baseDashboardUrl + "/id-card",
          icon: "Contact2",
        },
        {
          title: "Welcome Letter",
          url: baseDashboardUrl + "/welcome-letter",
          icon: "FileText",
        },
      ],
    },
  
    /* --- System Settings --- */
    {
      title: "Settings",
      url: "#",
      icon: "Settings",
      items: [
        {
          title: "Change Password",
          url: baseDashboardUrl + "/updatePassword",
          icon: "KeyRound",
        },
      ],
    },
  ],
  navSecondary: [
    { title: "Help Center", url: "#", icon: "LifeBuoy" },
    { title: "Send Feedback", url: "#", icon: "Send" },
  ],
  marketing: [{ name: "Marketing Kit", url: baseDashboardUrl + "/kit", icon: "Coins" }],
};

export const baseAdminUrl = "/admin/dashboard"

export const ADMIN_SIDEBAR = {
  navMain: [
    {
      title: "Overview",
      icon: "LayoutDashboard",
      url: baseAdminUrl,
      isActive: true,
    },
    {
      title: "Ecommerce",
      url: "#",
      icon: "Package",
      items: [
        { title: "All Products", url: baseAdminUrl + "/products", icon: "Boxes" },
        { title: "Add Product", url: baseAdminUrl + "/products/new", icon: "Boxes" },
        { title: "Categories", url: baseAdminUrl + "/categories", icon: "Tags" },
        {
          title: "Manage Orders",
          url: baseAdminUrl + "/orders",
          icon: "ReceiptIndianRupee",
        },
        
      ],
    },
    {
      title: "Network & Partners",
      url: "#",
      icon: "Users2",
      items: [
        { title: "Distributors", url: baseAdminUrl + "/users", icon: "Users2" },
        {
          title: "KYC Approvals",
          url: baseAdminUrl + "/kyc",
          icon: "ShieldCheck",
        },
        // { title: "Genealogy Master", url: baseAdminUrl + "/genealogy", icon: "History" },
      ],
    },
    {
      title: "Passive Wallet",
      url: "#",
      icon: "Wallet", 
      items: [
        {
          title: "Investor Wallets",
          url: baseAdminUrl + "/investorsWallets",
          icon: "PiggyBank",
        },
        {
          title: "Investment Approvals",
          url: baseAdminUrl + "/investmentApprovals",
          icon: "BadgeCheck",
        },
        {
          title: "Withdrawal Requests",
          url: baseAdminUrl + "/investorWithdrawalRequests",
          icon: "BadgeCheck",
        },
      ]
      
    },
    {
      title: "Finances & Payouts",
      url: "#",
      icon: "Wallet",
      items: [
        {
          title: "Payout Requests",
          url: baseAdminUrl + "/payouts",
          icon: "ReceiptIndianRupee",
        },
        {
          title: "Commission Logs",
          url: baseAdminUrl + "/commissions",
          icon: "History",
        },
        // { title: "Company Revenue", url: baseAdminUrl + "/revenue", icon: "TrendingUp" },
        // { title: "Payouts", url: baseAdminUrl + "/payments", icon: "TrendingUp" },
      ],
    },
    {
      title: "Content Management",
      url: "#",
      icon: "FileText", // Lucide Icon
      items: [
        {
          title: "All Blog Posts",
          url: baseAdminUrl + "/blog",
          icon: "Library",
        },
        {
          title: "Create New Post",
          url: baseAdminUrl + "/blog/create",
          icon: "PlusCircle",
        },
        {
          title: "Categories",
          url: baseAdminUrl + "/blog/categories",
          icon: "Tags",
        },
        {
          title: "Comments",
          url: baseAdminUrl + "/blog/comments",
          icon: "MessageSquare",
        },
      ],
    },
  ],
  navSecondary: [
    { title: "System Settings", url: baseAdminUrl + "/settings", icon: "Settings2" },
    { title: "Support Tickets", url: baseAdminUrl + "/support", icon: "LifeBuoy" },
  ],
  marketing: [
    { name: "Promotional Kits", url: baseAdminUrl + "/marketing", icon: "Send" },
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

export const LOADING_TIPS = [
  "Abhyanga (Self-massage) boosts circulation and calms the nervous system.",
  "Drinking warm water in the morning helps flush out toxins (Ama).",
  "Consuming seasonal fruits aligns your body with nature's rhythm.",
  "Consistent efforts in business lead to compounding success. Keep growing!",
  "Amaze Ayurveda: Bringing the purity of Bihar's herbs to your home.",
  "Daily meditation for 10 minutes improves focus and leadership skills.",
  "Tulsi and Ginger tea is a natural shield for your immunity."
];