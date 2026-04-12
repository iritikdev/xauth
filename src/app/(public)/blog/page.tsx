import prisma from "@/lib/prisma";
import { BlogCard } from "@/components/blog/BlogCard";
// import { SearchBar } from "@/components/blog/SearchBar"; // Client Component for Search
// import { CategoryFilter } from "@/components/blog/CategoryFilter"; // Client Component for Tabs

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { query?: string; category?: string };
}) {
  // 1. Get filter values from URL
  const query = searchParams?.query || "";
  const activeCategory = searchParams?.category || "All";

  // 2. Fetch posts from MongoDB based on filters
  const posts = await prisma.post.findMany({
    where: {
      published: true, // Only show live posts
      AND: [
        // Filter by Search Term
        query ? { 
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } }
          ] 
        } : {},
        // Filter by Category
        activeCategory !== "All" ? { category: activeCategory } : {},
      ],
    },
    orderBy: { createdAt: "desc" }, // Newest first
  });

  const categories = ["All", "Network Marketing", "Business Tips", "Success Stories", "Training"];

  return (
    <main className="min-h-screen mx-auto max-w-7xl bg-slate-50/50 dark:bg-black pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
            Amaze <span className="text-emerald-600">Ayurveda</span> Insights
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Master the art of network marketing and explore the power of Ayurveda. 
            Practical training and real success stories for every Associate.
          </p>
        </div>

        {/* Filters & Search Component */}
        {/* <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
          {/* We pass the active category so the component knows which button to highlight */}
          {/* <CategoryFilter categories={categories} activeCategory={activeCategory} /> */}
          {/* <SearchBar defaultValue={query} /> */}
        {/* </div> */} 

        {/* Blog Grid Layout */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
             <p className="text-slate-400 font-bold uppercase tracking-widest italic">
               No insights found matching your criteria.
             </p>
          </div>
        )}
      </div>
    </main>
  );
}