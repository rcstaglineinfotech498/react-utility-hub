import { Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card } from "./UI";
import { toggleFavorite } from "../store";

export function PageHeader({ eyebrow, title, description, toolId }) {
  const dispatch = useDispatch();
  const favorite = useSelector((state) => state.app.favorites.includes(toolId));
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {toolId && (
        <button
          className={`favorite ${favorite ? "is-favorite" : ""}`}
          onClick={
                    () => dispatch(toggleFavorite(toolId))
                  }
          aria-label="Favorite tool"
        >
          <Heart size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
}

export function ToolFrame({ children, eyebrow, title, description, toolId }) {
  return (
    <>
      <PageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        toolId={toolId}
      />
      {children}
    </>
  );
}

export function ToolCard({ children, className = "" }) {
  return <Card className={className}>{children}</Card>;
}
