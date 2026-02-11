import StructuredData from "@/components/Layout/StructuredData";
import Products from "@/components/PagesComponent/Ads/Ads";
import { generateKeywords } from "@/utils/generateKeywords";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({ searchParams }) => {
  try {
    const originalSearchParams = await searchParams;
    const langCode = originalSearchParams?.lang || "en";
    const slug = originalSearchParams?.category || ""; // change to your param name if needed

    let title = process.env.NEXT_PUBLIC_META_TITLE;
    let description = process.env.NEXT_PUBLIC_META_DESCRIPTION;
    let keywords = process.env.NEXT_PUBLIC_META_kEYWORDS;
    let image = "";

    if (slug) {
      // Fetch category-specific SEO
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-categories?slug=${slug}`,
        {
          headers: { "Content-Language": langCode || "en" },
        }
      );

      const data = await response.json();
      const selfCategory = data?.self_category;

      title = selfCategory?.translated_name || title;
      description = selfCategory?.translated_description || description;
      keywords =
        generateKeywords(selfCategory?.translated_description) || keywords;
      image = selfCategory?.image || image;
    } else {
      // Fetch default ad listing SEO
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}seo-settings?page=ad-listing`,
        {
          headers: { "Content-Language": langCode || "en" },
          next: { revalidate: 60 },
        }
      );
      const data = await res.json();
      const adListing = data?.data?.[0];

      title = adListing?.translated_title || title;
      description = adListing?.translated_description || description;
      keywords = adListing?.translated_keywords || keywords;
      image = adListing?.image || image;
    }

    // 👇 Canonical Logic
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL;
    let canonicalUrl = `${baseUrl}/ads`;
    if (slug) {
      canonicalUrl += `?category=${slug}`;
    }

    return {
      title,
      description,
      openGraph: {
        images: image ? [image] : [],
      },
      keywords,
      alternates: {
        canonical: canonicalUrl, // ✅ adds <link rel="canonical">
      },
    };
  } catch (error) {
    console.error("Error fetching MetaData:", error);
    return null;
  }
};

const getAllItems = async (langCode, slug) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_API_URL}${process.env.NEXT_PUBLIC_END_POINT}get-item?page=1`;

    if (slug) {
      url += `&category_slug=${slug}`;
    }

    const res = await fetch(url, {
      headers: {
        "Content-Language": langCode || 'en',
      },
    });

    const data = await res.json();
    return data?.data?.data || [];
  } catch (error) {
    console.error("Error fetching Product Items Data:", error);
    return [];
  }
};

const AdsPage = async ({ searchParams }) => {
  const originalSearchParams = await searchParams;
  const langCode = originalSearchParams?.lang || "en";
  const slug = originalSearchParams?.category || "";
  const AllItems = await getAllItems(langCode, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: AllItems.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1, // Position starts at 1
      item: {
        "@type": "Product",
        productID: product?.id,
        name: product?.translated_item?.name,
        description: product?.translated_item?.description,
        image: product?.image,
        url: `${process.env.NEXT_PUBLIC_WEB_URL}/ad-details/${product?.slug}`,
        category: {
          "@type": "Thing",
          name: product?.category?.translated_name,
        },
        ...(product?.price && {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
          },
        }),
        countryOfOrigin: product?.translated_item?.country,
      },
    })),
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <Products searchParams={originalSearchParams} />
    </>
  );
};
export default AdsPage;
