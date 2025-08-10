# Gold-Backed Bank Account Landing Page

A premium, mobile-first landing page for a modern gold-backed bank account. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Ultra-minimal, premium design** inspired by Apple product pages
- **Mobile-first responsive design** with generous whitespace
- **Smooth scroll-triggered animations** with reduced motion support
- **Delightful micro-interactions** and hover effects
- **Accessibility-focused** with proper focus states and semantic HTML
- **Email waitlist integration** with Google Forms
- **SEO optimized** with proper meta tags and structured data

## Design System

### Color Palette

- **Primary**: Black (#000000) and near-white (#ffffff)
- **Accent**: Gold (#C5A572) for highlights and buttons
- **Typography**: System fonts (San Francisco, Inter) for clean, premium feel

### Sections

1. **Hero** - Above the fold with compelling headline and CTA
2. **Product Highlights** - Four key features with icons
3. **How It Works** - Three-step process flow
4. **Security & Transparency** - Trust-building content
5. **Email Waitlist** - Google Form integration
6. **FAQ** - Expandable questions and answers
7. **Footer** - Legal links and company information

## Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Google Form Integration

The email waitlist form is configured to submit to a Google Form. To set this up:

1. **Create a Google Form** with an email field
2. **Get the form action URL** from the form's source code
3. **Get the entry ID** for the email field
4. **Update the form configuration** in `app/page.tsx`:

```typescript
// Replace these values in the handleEmailSubmit function:
const formData = new FormData();
formData.append("entry.123456789", email); // Replace with your actual entry ID

const response = await fetch(
  "https://docs.google.com/forms/d/YOUR_FORM_ID/formResponse",
  {
    method: "POST",
    body: formData,
    mode: "no-cors",
  }
);
```

### Finding Your Google Form Details

1. **Form Action URL**: Right-click on your Google Form → "View Page Source" → Search for `action="`
2. **Entry ID**: In the form source, find the input field for email and look for `name="entry.XXXXXXXXX"`

## Customization

### Colors

Update the gold color palette in `tailwind.config.ts` and `app/globals.css`

### Content

Modify the content in `app/page.tsx` to match your brand and messaging

### Animations

Customize animations in `app/globals.css` and `tailwind.config.ts`

## Performance

- **Lazy loading** for heavy media
- **Minimal JavaScript** with efficient animations
- **Optimized images** and assets
- **Semantic HTML** for better SEO

## Accessibility

- **Keyboard navigation** support
- **Screen reader** friendly
- **High contrast** design
- **Reduced motion** support
- **Focus indicators** for all interactive elements

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - All rights reserved
