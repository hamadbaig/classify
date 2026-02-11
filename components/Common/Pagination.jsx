'use client'
import {
    Pagination as PaginationContainer,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";


const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }) => {
    const handlePageChange = (page) => {
            onPageChange(page);
    };

    const generatePaginationItems = () => {
        const items = [];

        if (totalPages <= 5) {
            // Show all pages if there are 5 or fewer
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            // Always show first page
            items.push(1);

            if (currentPage <= 3) {
                // Near the start
                for (let i = 2; i <= 3; i++) {
                    items.push(i);
                }
                items.push(null); // Ellipsis
                items.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Near the end
                items.push(null); // Ellipsis
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    items.push(i);
                }
            } else {
                // Somewhere in the middle
                items.push(null); // Ellipsis
                items.push(currentPage - 1);
                items.push(currentPage);
                items.push(currentPage + 1);
                items.push(null); // Ellipsis
                items.push(totalPages);
            }
        }

        return items;
    };

    // Don't render if there's only 1 page or no pages
    if (totalPages <= 1) return null;

    return (
        <PaginationContainer className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(currentPage - 1);
                        }}
                        className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : ""
                        }
                    />
                </PaginationItem>

                {generatePaginationItems().map((page, index) =>
                    page === null ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handlePageChange(page);
                                }}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(currentPage + 1);
                        }}
                        className={
                            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </PaginationContainer>
    );
};

export default Pagination; 