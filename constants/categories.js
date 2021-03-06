export const categories = Object.freeze([
  {
    name: "Android",
    slug: "android",
  },
  {
    name: "Arduino",
    slug: "arduino",
  },
  {
    name: "AWS",
    slug: "aws",
  },
  {
    name: "Blog",
    slug: "blog",
  },
  {
    name: "Cocos2d x",
    slug: "cocos2d-x",
  },
  {
    name: "CSS",
    slug: "css",
  },
  {
    name: "Evernote",
    slug: "evernote",
  },
  {
    name: "Hugo",
    slug: "hugo",
  },
  {
    name: "iOS",
    slug: "ios",
  },
  {
    name: "JavaScript",
    slug: "javascript",
  },
  {
    name: "Mac",
    slug: "mac",
  },
  {
    name: "Objective-C",
    slug: "objective-c",
  },
  {
    name: "OS X",
    slug: "os-x",
  },
  {
    name: "PHP",
    slug: "php",
  },
  {
    name: "Processing",
    slug: "processing",
  },
  {
    name: "Python",
    slug: "python",
  },
  {
    name: "Science",
    slug: "science",
  },
  {
    name: "SQLite",
    slug: "sqlite",
  },
  {
    name: "Web Service",
    slug: "web-service",
  },
  {
    name: "WordPress",
    slug: "wordpress",
  },
  {
    name: "仮想通貨",
    slug: "cryptocurrency",
  },
  {
    name: "投資",
    slug: "investment",
  },
  {
    name: "開発",
    slug: "development",
  },
]);

export function getCategorySlugs() {
  return categories.map((category) => {
    return {
      params: {
        slug: category.slug,
      },
    };
  });
}

export function getCategorySlug(name) {
  return categories.find((category) => category.name == name).slug;
}

export function getCategory(slug) {
  return categories.find((category) => category.slug == slug);
}
