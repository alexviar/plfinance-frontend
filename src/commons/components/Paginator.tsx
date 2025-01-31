import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { Paginated } from "../api/types"
import { PropsWithChildren } from "react"

const baseClass =
  "flex items-center justify-center px-4 h-10 leading-tight border transition-all";

const disabledClass = "opacity-50 cursor-not-allowed";

const activeClass =
  "text-white bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700";

const defaultClass =
  "text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

type PreviousProps = {
  onClick(): void;
  isDisabled: boolean;
};
const Previous = ({ onClick, isDisabled }: PreviousProps) => (
  <li>
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClass} rounded-s-lg ${isDisabled ? disabledClass : defaultClass
        }`}
      aria-label="Página anterior"
    >
      <FaChevronLeft size="1.5rem" />
    </button>
  </li>
);

type PageProps = PropsWithChildren<{
  isActive: boolean;
  onClick(): void;
}>;
const Page = ({ isActive, onClick, children }: PageProps) => (
  <li>
    <button
      onClick={onClick}
      className={`${baseClass} ${isActive ? activeClass : defaultClass}`}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </button>
  </li>
);

type NextProps = {
  onClick(): void;
  isDisabled: boolean;
};
const Next = ({ onClick, isDisabled }: NextProps) => (
  <li>
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClass} rounded-e-lg ${isDisabled ? disabledClass : defaultClass
        }`}
      aria-label="Página siguiente"
    >
      <FaChevronRight size="1.5rem" />
    </button>
  </li>
);

type BasePaginationProps = PropsWithChildren;
const BasePagination = ({ children }: BasePaginationProps) => (
  <nav aria-label="Paginación">
    <ul className="flex items-center -space-x-px h-10 text-base">{children}</ul>
  </nav>
);

type Props = {
  pageInfo: Paginated<any>;
  onChange(page: number): void;
};

export const Paginator = ({ pageInfo, onChange }: Props) => {
  if (!pageInfo || pageInfo.lastPage === 1) return null;

  return (
    <BasePagination>
      {pageInfo.links.map((link, index) => {
        if (index === 0)
          return (
            <Previous
              key={link.label}
              isDisabled={!link.url}
              onClick={() => link.url && onChange(pageInfo.currentPage - 1)}
            />
          );

        if (index === pageInfo.links.length - 1)
          return (
            <Next
              key={link.label}
              isDisabled={!link.url}
              onClick={() => link.url && onChange(pageInfo.currentPage + 1)}
            />
          );

        return (
          <Page
            key={link.label}
            isActive={link.active}
            onClick={() => link.url && onChange(Number(link.label))}
          >
            {link.label}
          </Page>
        );
      })}
    </BasePagination>
  );
};
