import { z } from "zod";
import { postCategoryKeys, postTypeKeys } from "@/config/taxonomy";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidDate(value: string) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

const imageSchema = z
  .object({
    src: z.string().startsWith("/images/", "图片必须位于 /images/ 目录"),
    alt: z.string().trim().min(1, "图片说明不能为空").max(160),
  })
  .strict();

export const postFrontmatterSchema = z
  .object({
    title: z.string().trim().min(1).max(80),
    slug: z.string().regex(slugPattern, "slug 只能包含小写字母、数字和连字符"),
    publishedAt: z.string().refine(isValidDate, "publishedAt 必须是有效的 YYYY-MM-DD 日期"),
    updatedAt: z
      .string()
      .refine(isValidDate, "updatedAt 必须是有效的 YYYY-MM-DD 日期")
      .optional(),
    summary: z.string().trim().min(20).max(200),
    type: z.enum(postTypeKeys),
    category: z.enum(postCategoryKeys),
    tags: z
      .array(z.string().trim().min(1).max(32))
      .min(1)
      .max(8)
      .superRefine((tags, context) => {
        if (new Set(tags).size !== tags.length) {
          context.addIssue({
            code: "custom",
            message: "tags 不能重复",
          });
        }
      }),
    draft: z.boolean(),
    featured: z.boolean().default(false),
    image: imageSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.updatedAt && value.updatedAt < value.publishedAt) {
      context.addIssue({
        code: "custom",
        path: ["updatedAt"],
        message: "updatedAt 不能早于 publishedAt",
      });
    }
  });

export type ParsedPostFrontmatter = z.output<typeof postFrontmatterSchema>;

export function parsePostFrontmatter(input: unknown, source: string) {
  const result = postFrontmatterSchema.safeParse(input);
  if (result.success) return result.data;

  const details = result.error.issues
    .map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`)
    .join("；");
  throw new Error(`文章 ${source} 的 frontmatter 无效：${details}`);
}
