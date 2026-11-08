export const postTypeKeys = ["essay", "note", "project"] as const;

export const postTypes = {
  essay: {
    label: "文章",
    description: "经过整理的完整观点与实践复盘",
  },
  note: {
    label: "笔记",
    description: "正在形成中的观察与阅读记录",
  },
  project: {
    label: "项目",
    description: "构建过程、发布记录与阶段总结",
  },
} as const;

export const postCategoryKeys = [
  "engineering",
  "reading",
  "building",
  "life",
] as const;

export const postCategories = {
  engineering: "工程实践",
  reading: "阅读思考",
  building: "持续构建",
  life: "生活记录",
} as const;

export type PostType = (typeof postTypeKeys)[number];
export type PostCategory = (typeof postCategoryKeys)[number];
