import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Trash } from "lucide-react";
import { Category, ChecklistItem } from "@/App";
import EditItem from "./editItem";
import EditCategory from "./editCategory";

type MainDisplayPropsType = {
  items: ChecklistItem[];
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
};

export default function MainDisplay({
  categories,
  items,
  setItems,
  setCategories,
}: MainDisplayPropsType) {
  // Delete a category
  const deleteCategory = (id: string) => {
    // Move items from this category to the default category
    setItems(
      items.map((item) =>
        item.categoryId === id
          ? { ...item, categoryId: categories[0]?.id || "default" }
          : item
      )
    );
    setCategories(categories.filter((category) => category.id !== id));
  };

  // Toggle item completion
  const toggleItem = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Toggle all items in a category
  const toggleCategory = (categoryId: string, completed: boolean) => {
    setItems(
      items.map((item) =>
        item.categoryId === categoryId ? { ...item, completed } : item
      )
    );
  };

  // Check if all items in a category are completed
  const isCategoryCompleted = (categoryId: string) => {
    const categoryItems = items.filter(
      (item) => item.categoryId === categoryId
    );
    return (
      categoryItems.length > 0 && categoryItems.every((item) => item.completed)
    );
  };

  // Get items for a specific category
  const getItemsByCategory = (categoryId: string) => {
    return items.filter((item) => item.categoryId === categoryId);
  };

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={isCategoryCompleted(category.id)}
                  onCheckedChange={(checked) =>
                    toggleCategory(category.id, checked === true)
                  }
                />
                <CardTitle className="text-xl">
                  <label
                    htmlFor={`category-${category.id}`}
                    className="cursor-pointer"
                  >
                    {category.name}
                  </label>
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {category.time && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-1 h-4 w-4" />
                    {category.time}
                  </div>
                )}

                <EditCategory
                  categories={categories}
                  category={category}
                  setCategories={setCategories}
                />

                {/* Don't allow deleting the last category */}
                {categories.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCategory(category.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {getItemsByCategory(category.id).map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-md",
                    item.completed ? "bg-muted/50" : "hover:bg-muted/20"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`item-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                    <label
                      htmlFor={`item-${item.id}`}
                      className={cn(
                        "cursor-pointer",
                        item.completed && "line-through text-muted-foreground"
                      )}
                    >
                      {item.text}
                    </label>
                  </div>
                  <EditItem
                    categories={categories}
                    item={item}
                    items={items}
                    setItems={setItems}
                  />
                </li>
              ))}
              {getItemsByCategory(category.id).length === 0 && (
                <li className="text-muted-foreground text-center py-4">
                  No items in this category
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
