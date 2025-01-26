type CardProps = {
  id: string;
  title: string;
  description: string;
  onRemove?: (id: string) => void;
};

export default function Card({ id, title, description, onRemove }: CardProps) {
  return (
    <div className="card">
      <div className="drag-handle">
        <h2>{title}</h2>
      </div>
      {onRemove && (
        <button 
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent event from bubbling to parent
            onRemove(id);
          }}
        >
          ×
        </button>
      )}
      <p>{description}</p>
    </div>
  );
}
