"use client";
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";
import CustomLink from "@/components/Common/CustomLink";
import { placeholderImage, t } from "@/utils";

const BlogCard = ({ blog }) => {
  return (
    <div className="p-4 rounded-3xl flex flex-col gap-4 border  h-100 bg-white h-full">
      <Image
        src={blog?.image}
        alt="Blog image"
        className="w-full object-cover rounded-[8px] aspect-[388/200]"
        width={378}
        height={195}
        loading="lazy"
        onErrorCapture={placeholderImage}
      />
      <h5 className="text-lg font-semibold truncate">
        {blog?.translated_title || blog?.title}
      </h5>
      <p
        className="opacity-65 line-clamp-2"
        dangerouslySetInnerHTML={{
          __html: blog?.translated_description || blog?.description,
        }}
      ></p>
      <CustomLink
        href={`/blogs/${blog?.slug}`}
        className="flex items-center gap-3 text-primary text-lg mt-auto"
      >
        <span>{t("readArticle")}</span>
        <FaArrowRight className="rtl:scale-x-[-1]" size={20} />
      </CustomLink>
    </div>
  );
};

export default BlogCard;
