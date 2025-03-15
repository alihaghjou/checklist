import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Category, ChecklistItem } from "@/App";
import { useState } from "react";

type AddItemPropsType = {
  categories: Category[];
  items: ChecklistItem[];
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
};

export default function AddItem({
  categories,
  setItems,
  items,
}: AddItemPropsType) {
  const [newItemText, setNewItemText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const addItemFunc = () => {
    if (newItemText.trim() === "") return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
      categoryId: selectedCategory || categories[0]?.id || "default",
    };

    setItems([...items, newItem]);
    setNewItemText("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Item</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-item">Item Text</Label>
            <Input
              id="new-item"
              placeholder="Enter item text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addItemFunc();
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-select">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                    {category.time && ` (${category.time})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={addItemFunc}
            disabled={selectedCategory === ""}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
