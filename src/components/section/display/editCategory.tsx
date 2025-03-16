import { Category } from "@/App";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { useState } from "react";

type EditCategoryPropsType = {
  categories: Category[];
  category: Category;
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export default function EditCategory({
  categories,
  setCategories,
  category,
}: EditCategoryPropsType) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  // Update an item

  // Update a category
  const updateCategory = () => {
    if (!editingCategory || editingCategory.name.trim() === "") return;

    setCategories(
      categories.map((category) =>
        category.id === editingCategory.id ? editingCategory : category
      )
    );
    setEditingCategory(null);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setEditingCategory(category)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        {editingCategory && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category-time">Time (optional)</Label>
              <Input
                id="edit-category-time"
                type="time"
                value={editingCategory.time || ""}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    time: e.target.value || undefined,
                  })
                }
              />
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button onClick={updateCategory}>Save</Button>
              </DialogClose>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
