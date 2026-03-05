import { useState, useEffect } from "react";
import { HiStar, HiOutlineStar } from "react-icons/hi";

export default function RatingStars({ currentRating = 0, onRate, interactive = true }) {
    const [hover, setHover] = useState(0);
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        setSelected(Math.round(currentRating));
    }, [currentRating]);

    const handleClick = (value) => {
        if (!interactive) return;
        setSelected(value);
        if (onRate) onRate(value);
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= (hover || selected);
                return (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(star)}
                        onMouseEnter={() => interactive && setHover(star)}
                        onMouseLeave={() => interactive && setHover(0)}
                        className={`transition-all duration-150 ${interactive
                                ? "cursor-pointer hover:scale-125"
                                : "cursor-default"
                            }`}
                    >
                        {filled ? (
                            <HiStar className="w-6 h-6 text-amber-400 drop-shadow-sm" />
                        ) : (
                            <HiOutlineStar className="w-6 h-6 text-surface-600 hover:text-amber-400/50" />
                        )}
                    </button>
                );
            })}
            {currentRating > 0 && (
                <span className="ml-2 text-sm font-semibold text-surface-600 dark:text-surface-400">
                    {parseFloat(currentRating).toFixed(1)}
                </span>
            )}
        </div>
    );
}
