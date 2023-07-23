import { CategoryForm } from "@/components/forms/CategoriesForm";
import { db } from "@/lib/db";

type CategoryPageProps = {
  params: {
    categoriesId: string;
    storeId: string;
  };
};

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const category = await db.category.findUnique({
    where: {
      id: params.categoriesId,
    },
  });

  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
