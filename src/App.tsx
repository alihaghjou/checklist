import { useState, useEffect } from "react";
import { Clock, Trash, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import AddItem from "./components/section/addItem";
import AddCategory from "./components/section/addCategory";

// Types
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  time?: string;
}

export default function Home() {
  // State
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedItems = localStorage.getItem("checklist-items");
    const savedCategories = localStorage.getItem("checklist-categories");

    if (savedItems) {
      setItems(JSON.parse(savedItems));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Add a default category if none exists
      const defaultCategory = { id: "default", name: "General" };
      setCategories([defaultCategory]);
      localStorage.setItem(
        "checklist-categories",
        JSON.stringify([defaultCategory])
      );
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("checklist-items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("checklist-categories", JSON.stringify(categories));
  }, [categories]);

  // Add a new item

  // Add a new category

  // Update an item
  const updateItem = () => {
    if (!editingItem || editingItem.text.trim() === "") return;

    setItems(
      items.map((item) => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

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

  // Delete an item
  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

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
    <main className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Smart Checklist</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Add new item */}
        <AddItem categories={categories} items={items} setItems={setItems} />

        {/* Add new category */}
        <AddCategory categories={categories} setCategories={setCategories} />
      </div>

      {/* Categories and their items */}
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
                            <Label htmlFor="edit-category-time">
                              Time (optional)
                            </Label>
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
                                <Label htmlFor="edit-item-category">
                                  Category
                                </Label>
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
                                      <SelectItem
                                        key={category.id}
                                        value={category.id}
                                      >
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteItem(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
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
    </main>
  );
}
