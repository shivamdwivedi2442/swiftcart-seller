export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/seller", "/cart", "/checkout", "/profile"],
    },
    sitemap: "https://swiftcart-ashen.vercel.app/sitemap.xml",
  };
}