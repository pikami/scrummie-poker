import classNames from 'classnames';

interface GridListProps<T> {
  items: T[];
  colNum: number;
  className?: string;
  addItemLabel?: string;
  onAddItem?: () => void;
  itemComponent: React.ComponentType<{ item: T }>;
}

const AddItemButton = ({
  label,
  onAddItem,
}: {
  label: string;
  onAddItem: () => void;
}) => {
  return (
    <div
      onClick={onAddItem}
      className="flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-400 hover:border-gray-600"
    >
      <span className="text-gray-500">{label}</span>
    </div>
  );
};

const GridList = <T,>({
  items,
  colNum,
  className,
  addItemLabel = '+ Add Item',
  onAddItem,
  itemComponent: ItemComponent,
}: GridListProps<T>) => {
  const containerClassName = classNames('grid gap-4', className);

  return (
    <div
      className={containerClassName}
      style={{
        gridTemplateColumns: `repeat(${colNum}, minmax(0, 1fr))`,
      }}
    >
      {onAddItem && (
        <AddItemButton label={addItemLabel} onAddItem={onAddItem} />
      )}

      {items.map((item, index) => (
        <ItemComponent key={index} item={item} />
      ))}
    </div>
  );
};

export default GridList;
