interface GridListProps<T> {
  items: T[];
  colNum: number;
  onAddItem: () => void;
  itemComponent: React.ComponentType<{ item: T }>;
}

const AddItemButton = ({ onAddItem }: { onAddItem: () => void }) => {
  return (
    <div
      onClick={onAddItem}
      className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-400 hover:border-gray-600"
    >
      <span className="text-gray-500">+ Add Item</span>
    </div>
  );
};

const GridList = <T,>({
  items,
  colNum,
  onAddItem,
  itemComponent: ItemComponent,
}: GridListProps<T>) => {
  return (
    <div
      className={`grid gap-4`}
      style={{
        gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))`,
      }}
    >
      {onAddItem && <AddItemButton onAddItem={onAddItem} />}

      {items.map((item, index) => (
        <ItemComponent key={index} item={item} />
      ))}
    </div>
  );
};

export default GridList;
