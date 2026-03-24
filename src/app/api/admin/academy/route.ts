import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "src/content/academy");

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json({ content });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      // Return a default template if file doesn't exist
      const defaultContent = `# ${slug.replace(/-/g, " ")}\n\nThis article is currently being drafted. Stay tuned for expert insights!`;
      return NextResponse.json({ content: defaultContent, isNew: true });
    }
    return NextResponse.json({ error: "Failed to read file" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { slug, content, title, newSlug } = await req.json();

    if (!slug || content === undefined) {
      return NextResponse.json({ error: "Missing slug or content" }, { status: 400 });
    }

    const jsonPath = path.join(process.cwd(), "src/data/academy_articles.json");
    const jsonRaw = await fs.readFile(jsonPath, "utf-8");
    let articles = JSON.parse(jsonRaw);

    const articleIndex = articles.findIndex((a: any) => a.slug === slug);
    if (articleIndex === -1) {
      return NextResponse.json({ error: "Article not found in database" }, { status: 404 });
    }

    // Update Title if provided
    if (title) {
      articles[articleIndex].title = title;
    }

    let finalSlug = slug;

    // Handle Slug Change
    if (newSlug && newSlug !== slug) {
      // Ensure newSlug is unique
      if (articles.some((a: any) => a.slug === newSlug)) {
        return NextResponse.json({ error: "New slug already exists" }, { status: 400 });
      }

      // Add old slug to redirects
      if (!articles[articleIndex].redirects) {
        articles[articleIndex].redirects = [];
      }
      if (!articles[articleIndex].redirects.includes(slug)) {
        articles[articleIndex].redirects.push(slug);
      }

      // Rename the .md file
      const oldPath = path.join(CONTENT_DIR, `${slug}.md`);
      const newPath = path.join(CONTENT_DIR, `${newSlug}.md`);
      
      try {
        await fs.access(oldPath);
        await fs.rename(oldPath, newPath);
      } catch (e) {
        // Old file might not exist yet if it was just metadata before
      }

      articles[articleIndex].slug = newSlug;
      finalSlug = newSlug;
    }

    // Save JSON
    await fs.writeFile(jsonPath, JSON.stringify(articles, null, 2), "utf-8");

    // Save Content
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    const filePath = path.join(CONTENT_DIR, `${finalSlug}.md`);
    await fs.writeFile(filePath, content, "utf-8");

    return NextResponse.json({ success: true, newSlug: finalSlug !== slug ? finalSlug : undefined });
  } catch (error: any) {
    console.error("[ADMIN ACADEMY API] Save failed:", error.message);
    return NextResponse.json({ error: "Failed to save article" }, { status: 500 });
  }
}
