import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  readTime: string;
  published: boolean;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
  return files
    .map(filename => {
      const slug = filename.replace('.mdx', '');
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
      const { data, content } = matter(raw);
      const words = content.split(/\s+/).length;
      const readTime = `${Math.ceil(words / 200)} min read`;
      return { slug, content, readTime, ...data } as BlogPost;
    })
    .filter(p => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fpath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fpath)) return null;
  const raw = fs.readFileSync(fpath, 'utf-8');
  const { data, content } = matter(raw);
  const words = content.split(/\s+/).length;
  const readTime = `${Math.ceil(words / 200)} min read`;
  return { slug, content, readTime, ...data } as BlogPost;
}
