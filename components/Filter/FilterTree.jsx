import { cn } from "@/lib/utils";
import { categoryApi } from "@/utils/api";
import { Loader2, Minus, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { t } from "@/utils";
import { useSelector } from "react-redux";
import { BreadcrumbPathData } from "@/redux/reducer/breadCrumbSlice";
import { CurrentLanguageData } from "@/redux/reducer/languageSlice";

const FilterTree = ({ extraDetails }) => {
  const CurrentLanguage = useSelector(CurrentLanguageData);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState({
    data: [],
    currentPage: 1,
    hasMore: false,
    isLoading: false,
    isLoadMore: false,
    expanded: false,
  });

  const selectedSlug = searchParams.get("category") || "";
  const isSelected = !selectedSlug; // "All" category is selected when no category is selected

  useEffect(() => {
    fetchCategories();
  }, [CurrentLanguage.id]);

  const fetchCategories = async (page = 1) => {
    try {
      page > 1
        ? setCategories((prev) => ({ ...prev, isLoadMore: true }))
        : setCategories((prev) => ({ ...prev, isLoading: true }));

      const response = await categoryApi.getCategory({ page: page });
      const newData = response?.data?.data?.data ?? [];
      const currentPage = response?.data?.data?.current_page;
      const lastPage = response?.data?.data?.last_page;
      setCategories((prev) => ({
        ...prev,
        data: page > 1 ? [...prev.data, ...newData] : newData,
        currentPage,
        hasMore: lastPage > currentPage,
        expanded: true,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setCategories((prev) => ({
        ...prev,
        isLoading: false,
        isLoadMore: false,
      }));
    }
  };
  const handleToggleExpand = () => {
    setCategories((prev) => ({ ...prev, expanded: !prev.expanded }));
  };

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    Object.keys(extraDetails || {})?.forEach((key) => {
      params.delete(key);
    });
    router.push(`/ads?${params.toString()}`, { scroll: false });
  };

  return (
    <ul>
      <li>
        <div className="flex items-center rounded text-sm">
          {categories?.isLoading ? (
            <Loader2 className="size-[14px] animate-spin text-muted-foreground" />
          ) : (
            <button
              className="text-sm p-1 hover:bg-muted rounded-sm"
              onClick={handleToggleExpand}
            >
              {categories.expanded ? <Minus size={14} /> : <Plus size={14} />}
            </button>
          )}

          <button
            onClick={handleClick}
            className={cn(
              "flex-1 ltr:text-left rtl:text-right py-1 px-2 rounded-sm",
              isSelected && "border bg-muted"
            )}
          >
            {t("allCategories")}
          </button>
        </div>
        {categories.expanded && categories.data.length > 0 && (
          <ul className="ltr:ml-3 rtl:mr-3 ltr:border-l rtl:border-r ltr:pl-2 rtl:pr-2 space-y-1">
            {categories.data.map((category) => (
              <CategoryNode
                key={category.id}
                category={category}
                extraDetails={extraDetails}
              />
            ))}

            {categories.hasMore && (
              <button
                onClick={() => fetchCategories(categories.currentPage + 1)}
                className="text-primary text-center text-sm py-1 px-2"
                disabled={categories.isLoadMore}
              >
                {categories.isLoadMore ? t("loading") : t("loadMore")}
              </button>
            )}
          </ul>
        )}
      </li>
    </ul>
  );
};

export default FilterTree;

const CategoryNode = ({ category, extraDetails }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const breadcrumbPath = useSelector(BreadcrumbPathData);

  const selectedSlug = searchParams.get("category") || "";
  const isSelected = category.slug === selectedSlug;

  const shouldExpand = useMemo(() => {
    if (!Array.isArray(breadcrumbPath) || breadcrumbPath.length <= 2)
      return false;
    // Skip the first (All Categories) and last (leaf node)
    const keysToCheck = breadcrumbPath.slice(1, -1).map((crumb) => crumb.key);
    return keysToCheck.includes(category.slug);
  }, []);

  // 📦 Auto-expand if it's in the path
  useEffect(() => {
    if (shouldExpand && !expanded) {
      // If not already expanded and part of the path, expand and load children
      setExpanded(true);
      fetchSubcategories();
    }
  }, [shouldExpand]);
  const fetchSubcategories = async (page = 1, append = false) => {
    setIsLoading(true);
    try {
      const response = await categoryApi.getCategory({
        category_id: category.id,
        page,
      });
      const data = response.data.data.data;
      const hasMore =
        response.data.data.last_page > response.data.data.current_page;
      setSubcategories((prev) => (append ? [...prev, ...data] : data));
      setHasMore(hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleExpand = async () => {
    if (!expanded && subcategories.length === 0) {
      await fetchSubcategories();
    }
    setExpanded((prev) => !prev);
  };

  const handleClick = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("category", category.slug);
    Object.keys(extraDetails || {}).forEach((key) => {
      newSearchParams.delete(key);
    });
    router.push(`/ads?${newSearchParams.toString()}`, { scroll: false });
  };

  const loadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchSubcategories(nextPage, true);
  };

  return (
    <li>
      <div className="flex items-center rounded text-sm">
        {category.subcategories_count > 0 &&
          (isLoading ? (
            <Loader2 className="size-[14px] animate-spin text-muted-foreground" />
          ) : (
            <button
              className="text-sm p-1 hover:bg-muted rounded-sm"
              onClick={handleToggleExpand}
            >
              {expanded ? <Minus size={14} /> : <Plus size={14} />}
            </button>
          ))}

        <button
          onClick={handleClick}
          className={cn(
            "flex-1 ltr:text-left rtl:text-right py-1 px-2 rounded-sm flex items-center justify-between gap-2",
            isSelected && "border bg-muted"
          )}
        >
          <span className="break-all">{category.translated_name}</span>
          <span>({category.all_items_count})</span>
        </button>
      </div>

      {expanded && (
        <ul className="ltr:ml-3 rtl:mr-3 ltr:border-l rtl:border-r ltr:pl-2 rtl:pr-2 space-y-1">
          {subcategories.map((sub) => (
            <CategoryNode
              key={sub.id}
              category={sub}
              selectedSlug={selectedSlug}
            />
          ))}

          {hasMore && (
            <button
              onClick={loadMore}
              className="text-primary text-center text-sm py-1 px-2"
            >
              {t("loadMore")}
            </button>
          )}
        </ul>
      )}
    </li>
  );
};
