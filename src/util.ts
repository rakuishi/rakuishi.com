import { SITE_CATEGORIES } from './config';

export function requireCategory(slug: string) {
  const category = SITE_CATEGORIES.find((category) => category.slug === slug);
  if (category) {
    return category;
  } else {
    throw new Error(`${slug} is not defined.`);
  }
}

export function getCategoryOrNull(names: string[]) {
  const name = firstOrNull(names);
  const slug = SITE_CATEGORIES.find((category) => category.name === name)?.slug;
  if (name && slug) {
    return { name, slug }
  } else {
    return null;
  }
}

function firstOrNull(array: any[]) {
  if (array && array.length > 0) {
    return array[0];
  } else {
    return null;
  }
}