import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withErrorHandler } from "@/lib/errors";
import { themePresets } from "@/data/themes";
import { templateDefinitions } from "@/data/templates";

async function postHandler() {
  // Check if data already exists
  const existingThemes = await prisma.theme.count();
  const existingTemplates = await prisma.template.count();

  if (existingThemes > 0 && existingTemplates > 0) {
    return NextResponse.json({
      data: { message: "Seed data already exists", seeded: false },
    });
  }

  // Seed themes
  const themeIdMap: Record<string, string> = {};

  if (existingThemes === 0) {
    for (const preset of themePresets) {
      const theme = await prisma.theme.create({
        data: {
          name: preset.name,
          background_color: preset.backgroundColor,
          text_color: preset.textColor,
          accent_color: preset.accentColor,
          heading_font: preset.headingFont,
          body_font: preset.bodyFont,
          is_dark: preset.isDark,
        },
      });
      themeIdMap[preset.name] = theme.id;
    }
  } else {
    const themes = await prisma.theme.findMany();
    for (const theme of themes) {
      themeIdMap[theme.name] = theme.id;
    }
  }

  // Seed templates
  if (existingTemplates === 0) {
    for (const tmpl of templateDefinitions) {
      await prisma.template.create({
        data: {
          name: tmpl.name,
          category: tmpl.category,
          description: tmpl.description,
          slides_data: JSON.parse(JSON.stringify(tmpl.slides)),
          theme_id: themeIdMap[tmpl.themeName] ?? null,
        },
      });
    }
  }

  return NextResponse.json({
    data: {
      message: "Seed complete",
      seeded: true,
      themes: themePresets.length,
      templates: templateDefinitions.length,
    },
  });
}

export const POST = withErrorHandler(postHandler);
