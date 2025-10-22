<div align="center">

# Rerank

### AI-Powered SEO Article Generator

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

Generate SEO-optimized articles in minutes using advanced AI workflows

[Features](#features) • [Getting Started](#getting-started) • [How It Works](#how-it-works) • [Tech Stack](#tech-stack)

---

### Powered by

<a href="https://retalk.bot">
  <img src="https://xohnubyicmktldyrhmmv.supabase.co/storage/v1/object/public/assets/rerank.png" alt="Retalk" height="300"/>
</a>

---

</div>

## Features

### **Intelligent SERP Analysis**

-   Automatically analyzes top-ranking competitors for your target keyword
-   Scrapes and extracts content structure from top 5 search results
-   Generates comprehensive content plans based on competitor analysis

### **Multi-Stage Content Generation**

-   **Base Article**: AI-generated long-form content using Claude Sonnet
-   **SEO Optimization**: Automatic keyword density and placement optimization
-   **Introduction Enhancement**: Compelling, conversion-focused introductions
-   **Statistics Integration**: Real-time stats insertion via Perplexity API

### **Advanced SEO Features**

-   ✅ Automatic internal linking via sitemap parsing
-   ✅ Meta description and title tag generation
-   ✅ Slug optimization for URLs
-   ✅ Multi-language support (French/English)
-   ✅ Search intent targeting (informational, commercial, transactional, navigational)

### **Modern UI/UX**

-   Real-time progress tracking with 15 workflow stages
-   Dark mode support
-   Auto-save form data
-   Sitemap validation with instant feedback
-   Article library with markdown preview

## Getting Started

### Prerequisites

You'll need API keys from:

-   [Anthropic](https://console.anthropic.com/) (Claude AI)
-   [Firecrawl](https://firecrawl.dev/) (Web scraping)
-   [Perplexity](https://www.perplexity.ai/) (Real-time statistics)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rerank.git
cd rerank

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the app.

### Configuration

1. Click the **Settings** button in the top right
2. Enter your API keys:
    - **Anthropic API Key**
    - **Firecrawl API Key**
    - **Perplexity API Key**
3. Save your settings

API keys are stored locally in your browser's localStorage.

## How It Works

Rerank uses a sophisticated 15-stage AI workflow:

```mermaid
graph LR
    A[SERP Analysis] --> B[Scrape Competitors]
    B --> C[Generate Plans]
    C --> D[Aggregate Plans]
    D --> E[Final Plan]
    E --> F[Base Article]
    F --> G[Translation]
    G --> H[Improve Intro]
    H --> I[SEO Optimization]
    I --> J[Keyword Optimization]
    J --> K[Fetch Sitemap]
    K --> L[Internal Links]
    L --> M[Search Stats]
    M --> N[Insert Stats]
    N --> O[Generate Metadata]
```

### Workflow Stages

1. **SERP Analysis** - Search for top-ranking pages
2. **Scraping Competitors** - Extract content from top 5 results
3. **Plan Generation** - Create content outlines from each competitor
4. **Plan Aggregation** - Combine insights into comprehensive structure
5. **Final Plan** - Generate optimized content blueprint
6. **Base Article** - Create initial long-form content
7. **Translation** - Convert to English if needed
8. **Introduction Improvement** - Enhance opening paragraphs
9. **SEO Optimization** - Optimize for search engines
10. **Keyword Optimization** - Fine-tune keyword placement
11. **Sitemap Fetch** - Parse provided sitemap (optional)
12. **Internal Links** - Add contextual internal linking
13. **Statistics Search** - Find relevant data via Perplexity
14. **Statistics Insertion** - Integrate stats into content
15. **Metadata Generation** - Create SEO meta tags

## Tech Stack

### Frontend

-   **[Next.js 15](https://nextjs.org/)** - React framework with App Router
-   **[React 18](https://react.dev/)** - UI library
-   **[TypeScript](https://www.typescriptlang.org/)** - Type safety
-   **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first styling
-   **[shadcn/ui](https://ui.shadcn.com/)** - Component library
-   **[React Hook Form](https://react-hook-form.com/)** - Form management
-   **[Zod](https://zod.dev/)** - Schema validation

### AI & APIs

-   **[Anthropic Claude](https://www.anthropic.com/)** - LLM for content generation
-   **[Firecrawl](https://firecrawl.dev/)** - Web scraping & SERP analysis
-   **[Perplexity](https://www.perplexity.ai/)** - Real-time statistics

### Dev Tools

-   **[ESLint](https://eslint.org/)** - Code linting
-   **[Prettier](https://prettier.io/)** - Code formatting

## Project Structure

```
rerank/
├── app/
│   ├── api/
│   │   └── validate-sitemap/    # Sitemap validation endpoint
│   ├── articles/                # Article library & viewer
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Main article generator
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── article-card.tsx        # Article preview card
│   ├── markdown-viewer.tsx     # Markdown rendering
│   ├── settings-dialog.tsx     # API key configuration
│   ├── streaming-dialog.tsx    # Real-time AI streaming
│   └── workflow-progress.tsx   # Progress tracking
├── lib/
│   ├── api/
│   │   ├── anthropic.ts       # Claude API integration
│   │   ├── firecrawl.ts       # Firecrawl API integration
│   │   └── perplexity.ts      # Perplexity API integration
│   ├── prompts.ts             # AI prompt templates
│   ├── storage.ts             # LocalStorage utilities
│   ├── types.ts               # TypeScript definitions
│   ├── utils.ts               # Helper functions
│   └── workflow-engine.ts     # Core article generation logic
└── public/                    # Static assets
```

## Use Cases

-   **Content Marketers**: Generate SEO-optimized blog posts at scale
-   **SEO Agencies**: Produce client content with competitive analysis
-   **Bloggers**: Create data-driven articles with proper optimization
-   **E-commerce**: Generate product category pages with internal linking

## Privacy

All API keys are stored locally in your browser. No data is sent to external servers except the required API providers (Anthropic, Firecrawl, Perplexity).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

```bash
# Fork the repository
# Create your feature branch
git checkout -b feature/amazing-feature

# Commit your changes
git commit -m 'Add some amazing feature'

# Push to the branch
git push origin feature/amazing-feature

# Open a Pull Request
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   Built by the [Retalk](https://retalk.bot) team
-   Powered by Anthropic's Claude AI
-   Web scraping by Firecrawl
-   Real-time data by Perplexity

---

<div align="center">

**[Star this repo](https://github.com/yourusername/rerank)** if you find it useful!

<br/>

<a href="https://retalk.bot">
  <img src="https://xohnubyicmktldyrhmmv.supabase.co/storage/v1/object/public/assets/logo-full.png" alt="Retalk" width="180"/>
</a>

<p><i>Made by <a href="https://retalk.bot">Retalk</a></i></p>

</div>
