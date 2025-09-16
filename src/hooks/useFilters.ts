import { usePathname, useRouter } from "next/navigation";
import { useEffect, ChangeEvent, useTransition } from "react";
import { FaMale, FaFemale } from "react-icons/fa";
import useFilterStore from "./useFilterStore";
import usePaginationStore from "./usePaginationStore";

export const useFilters = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { filters, setFilters } = useFilterStore();

    const pageNumber = usePaginationStore((state) => state.pagination.pageNumber);
    const pageSize = usePaginationStore((state) => state.pagination.pageSize);
    const setPage = usePaginationStore((state) => state.setPage);
    const totalCount = usePaginationStore((state) => state.pagination.totalCount);

  const { gender, ageRange, orderBy, withPhoto } = filters;

  const [isPending, startTransition] = useTransition();

  // Reset to page 1 if filters change
  useEffect(() => {
    if (gender || ageRange || orderBy || withPhoto) {
      setPage(1);
    }
  }, [gender, ageRange, orderBy, withPhoto, setPage]);

  // Sync filters to query params
  useEffect(() => {
    startTransition(() => {
      const searchParams = new URLSearchParams();

      if (gender.length) searchParams.set("gender", gender.join(","));
      if (ageRange) searchParams.set("ageRange", ageRange.toString());
      if (orderBy) searchParams.set("orderBy", orderBy);
      if (pageSize) searchParams.set("pageSize", pageSize.toString());
      if (pageNumber) searchParams.set("pageNumber", pageNumber.toString());
      searchParams.set("withPhoto", withPhoto.toString());

      router.replace(`${pathname}?${searchParams.toString()}`);
    });
  }, [gender, ageRange, orderBy, withPhoto, pageSize, pageNumber, router, pathname]);

  // Filter options
  const orderByList = [
    { label: "Last active", value: "updated" },
    { label: "Newest members", value: "created" },
  ];

  const genderList = [
    { value: "male", icon: FaMale },
    { value: "female", icon: FaFemale },
  ];

  // Handlers
  const handleAgeSelect = (value: number[]) => {
    setFilters("ageRange", value);
  };

  const handleOrderSelect = (value: string) => {
    setFilters("orderBy", value);
  };

  const handleGenderSelect = (value: string) => {
    if (gender.includes(value)) {
      setFilters(
        "gender",
        gender.filter((g) => g !== value)
      );
    } else {
      setFilters("gender", [...gender, value]);
    }
  };

 const handleWithPhotoToggle = (checked: boolean) => {
    setFilters("withPhoto", checked);
    };

  return {
    orderByList,
    genderList,
    selectAge: handleAgeSelect,
    selectGender: handleGenderSelect,
    selectOrder: handleOrderSelect,
    selectWithPhoto: handleWithPhotoToggle,
    filters,
    totalCount,
    isPending,
  };
};
