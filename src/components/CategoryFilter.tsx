import { CATEGORIES, type Category } from "../data/products";

export type CategoryChoice = Category | "All";

interface CategoryFilterProps {
  selected: CategoryChoice;
  onSelect: (choice: CategoryChoice) => void;
}

const CHOICES: CategoryChoice[] = ["All", ...CATEGORIES];

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="category-filter" role="tablist" aria-label="Filter by category">
      {CHOICES.map((choice) => (
        <button
          key={choice}
          role="tab"
          aria-selected={selected === choice}
          className={"chip" + (selected === choice ? " chip--active" : "")}
          onClick={() => onSelect(choice)}
        >
          {choice}
        </button>
      ))}
    </div>
  );
}
