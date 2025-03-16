import { useState, useEffect } from "react";
import AddItem from "./components/section/addItem";
import AddCategory from "./components/section/addCategory";
import MainDisplay from "./components/section/display/mainDisplay";

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
      <MainDisplay
        categories={categories}
        items={items}
        setCategories={setCategories}
        setItems={setItems}
      />
    </main>
  );
}
