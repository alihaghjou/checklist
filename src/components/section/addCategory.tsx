import { Label } from "@radix-ui/react-select";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import type { Category } from "@/App";

type AddCategoryPropsType = {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
};

export default function AddCategory({
  setCategories,
  categories,
}: AddCategoryPropsType) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryTime, setCategoryTime] = useState<string>("");

  const addCategoryFunc = () => {
    if (newCategoryName.trim() === "") return;

    const newCategory: Category = {
      id: Date.now().toString(),
      name: newCategoryName,
      time: categoryTime || undefined,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setCategoryTime("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Category Name</Label>
            <Input
              id="new-category"
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategoryFunc();
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Time (optional)</Label>
            <Input
              id="category-time"
              type="time"
              value={categoryTime}
              onChange={(e) => setCategoryTime(e.target.value)}
            />
          </div>

          <Button onClick={addCategoryFunc} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
