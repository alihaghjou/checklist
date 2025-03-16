import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Category, ChecklistItem } from "@/App";
import { Label } from "@/components/ui/label";

type EditItemPropsType = {
  items: ChecklistItem[];
  item: ChecklistItem;
  setItems: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
  categories: Category[];
};

export default function EditItem({
  items,
  setItems,
  item,
  categories,
}: EditItemPropsType) {
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);

  const updateItem = () => {
    if (!editingItem || editingItem.text.trim() === "") return;

    setItems(
      items.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="flex items-center gap-1">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingItem(item)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-item-text">Text</Label>
                <Input
                  id="edit-item-text"
                  value={editingItem.text}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      text: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-item-category">Category</Label>
                <Select
                  value={editingItem.categoryId}
                  onValueChange={(value) =>
                    setEditingItem({
                      ...editingItem,
                      categoryId: value,
                    })
                  }
                >
                  <SelectTrigger id="edit-item-category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={updateItem}>Save</Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
