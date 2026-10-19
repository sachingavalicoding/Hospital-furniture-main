export function breadcrumbSchema(site: URL | undefined, crumbs: { href: string; label: string }[]) {
  const all = [{ href: '/', label: 'Home' }, ...crumbs];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.label,
      item: new URL(c.href, site).href,
    })),
  };
}
