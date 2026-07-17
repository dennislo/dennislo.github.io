import { expect, test } from "@playwright/test";

interface MarkdownJourney {
  locale: string;
  htmlPath: string;
  markdownPath: string;
  label: string;
  heading: string;
  distinctiveContent: string;
}

const markdownJourneys: readonly MarkdownJourney[] = [
  {
    locale: "en-GB",
    htmlPath: "/",
    markdownPath: "/index.md",
    label: "As Markdown",
    heading: "# Who is DLO?",
    distinctiveContent: "real-time data visualisation",
  },
  {
    locale: "en-GB alias",
    htmlPath: "/en-GB/",
    markdownPath: "/index.md",
    label: "As Markdown",
    heading: "# Who is DLO?",
    distinctiveContent: "real-time data visualisation",
  },
  {
    locale: "en-GB",
    htmlPath: "/contact-form/",
    markdownPath: "/contact-form.md",
    label: "As Markdown",
    heading: "# Contact Dennis Lo",
    distinctiveContent: "Enquiries about software engineering",
  },
  {
    locale: "en-GB alias",
    htmlPath: "/en-GB/contact-form/",
    markdownPath: "/contact-form.md",
    label: "As Markdown",
    heading: "# Contact Dennis Lo",
    distinctiveContent: "Enquiries about software engineering",
  },
  {
    locale: "en-GB",
    htmlPath: "/404/",
    markdownPath: "/404.md",
    label: "As Markdown",
    heading: "# Page Not Found",
    distinctiveContent: "The requested page does not exist on this site.",
  },
  {
    locale: "en-US",
    htmlPath: "/en-US/",
    markdownPath: "/en-US/index.md",
    label: "As Markdown",
    heading: "# Who is DLO?",
    distinctiveContent: "specialized expertise",
  },
  {
    locale: "en-US",
    htmlPath: "/en-US/contact-form/",
    markdownPath: "/en-US/contact-form.md",
    label: "As Markdown",
    heading: "# Contact Dennis Lo",
    distinctiveContent: "Inquiries about software engineering",
  },
  {
    locale: "en-US",
    htmlPath: "/en-US/404/",
    markdownPath: "/en-US/404.md",
    label: "As Markdown",
    heading: "# Page Not Found",
    distinctiveContent: "[Homepage](/en-US/)",
  },
  {
    locale: "zh-Hans",
    htmlPath: "/zh-Hans/",
    markdownPath: "/zh-Hans/index.md",
    label: "以 Markdown 格式查看",
    heading: "# Dennis Lo — IT 顾问与软件工程师",
    distinctiveContent: "我是 盧偉康 (Dennis Lo)，一名 IT 顾问和软件工程师",
  },
  {
    locale: "zh-Hans",
    htmlPath: "/zh-Hans/contact-form/",
    markdownPath: "/zh-Hans/contact-form.md",
    label: "以 Markdown 格式查看",
    heading: "# 联系我",
    distinctiveContent: "如果您希望与我合作",
  },
  {
    locale: "zh-Hans",
    htmlPath: "/zh-Hans/404/",
    markdownPath: "/zh-Hans/404.md",
    label: "以 Markdown 格式查看",
    heading: "# 页面未找到",
    distinctiveContent: "抱歉，我们找不到您要查找的内容。",
  },
  {
    locale: "es-ES",
    htmlPath: "/es-ES/",
    markdownPath: "/es-ES/index.md",
    label: "Ver como Markdown",
    heading: "# Dennis Lo — Consultor de TI e Ingeniero de Software",
    distinctiveContent:
      "Soy Dennis Lo, consultor de TI e ingeniero de software",
  },
  {
    locale: "es-ES",
    htmlPath: "/es-ES/contact-form/",
    markdownPath: "/es-ES/contact-form.md",
    label: "Ver como Markdown",
    heading: "# Contáctame",
    distinctiveContent: "Si deseas trabajar conmigo",
  },
  {
    locale: "es-ES",
    htmlPath: "/es-ES/404/",
    markdownPath: "/es-ES/404.md",
    label: "Ver como Markdown",
    heading: "# Página no encontrada",
    distinctiveContent:
      "Lo sentimos, no hemos podido encontrar lo que buscabas.",
  },
];

test.describe("As Markdown link", () => {
  for (const journey of markdownJourneys) {
    test(`${journey.locale} ${journey.htmlPath} opens translated Markdown`, async ({
      page,
    }) => {
      const { htmlPath, markdownPath, label, heading, distinctiveContent } =
        journey;
      await page.goto(htmlPath);

      const link = page.getByRole("link", { name: label });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", markdownPath);

      await link.click();

      await expect(page).toHaveURL(new RegExp(`${markdownPath}$`));
      const markdown = await page.locator("body").textContent();
      expect(markdown).toContain(heading);
      expect(markdown).toContain(distinctiveContent);
    });
  }
});
