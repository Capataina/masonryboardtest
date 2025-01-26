import { useState, useEffect, useContext, useMemo } from 'react';
import './MasonryBoard.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GridLayout from 'react-grid-layout';
import { potentialCards } from '../store/PotentialCards';
import { CardContext } from '../store/CardStore';
import Card from './Card';

export default function MasonryBoard() {
  const [width, setWidth] = useState(window.innerWidth - 50);
  const [layoutRefresh, setLayoutRefresh] = useState(0);
  const cardContext = useContext(CardContext);

  if (!cardContext) {
    throw new Error('MasonryBoard must be used within a CardProvider');
  }

  const { cards, removeCard } = cardContext;

  // Move layout generation to a separate function
  const generateLayout = (cards: Array<any>, refresh: number) => {
    // Add some randomization based on refresh count
    const randomOffset = refresh % 2 === 0 ? 0 : Math.floor(Math.random() * 5);
    
    return cards.reduce((acc, card, index) => {
      const width = card.width;
      
      if (index === 0) {
        return [...acc, { i: card.id, x: randomOffset, y: 0, w: width, h: card.height }];
      }

      const occupiedSpaces = acc.flatMap((item: { x: number; y: number; w: number; h: number }) => {
        const spaces = [];
        for (let x = item.x; x < item.x + item.w; x++) {
          for (let y = item.y; y < item.y + item.h; y++) {
            spaces.push({ x, y });
          }
        }
        return spaces;
      });

      let bestPosition = { x: randomOffset, y: 0 };
      let minY = Infinity;

      for (let x = 0; x <= 10 - width; x++) {
        let y = 0;
        let positionValid = false;

        while (!positionValid && y < 50) {
          positionValid = true;
          for (let checkX = x; checkX < x + width; checkX++) {
            if (occupiedSpaces.some((space: {x: number, y: number}) => space.x === checkX && space.y === y)) {
              positionValid = false;
              y++;
              break;
            }
          }

          if (positionValid && y < minY) {
            minY = y;
            bestPosition = { x, y };
          }
        }
      }

      return [...acc, { 
        i: card.id, 
        x: bestPosition.x, 
        y: bestPosition.y, 
        w: width, 
        h: card.height 
      }];
    }, [] as Array<{ i: string; x: number; y: number; w: number; h: number }>);
  };

  // Generate layout whenever cards change
  const layout = useMemo(() => generateLayout(cards, layoutRefresh), [cards, layoutRefresh]);
 
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth - 50);
    const handleKeyPress = (e: KeyboardEvent) => {

      // Check if we're not in an input field or textarea
      if (e.code === 'Space' && !e.repeat && 
          !(e.target instanceof HTMLInputElement) && 
          !(e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault(); // Prevent page scroll
        setLayoutRefresh(prev => prev + 1); // Force layout regeneration
      }

      if (e.code === 'KeyN' && !e.repeat) {
        e.preventDefault();
        const randomIndex = Math.floor(Math.random() * potentialCards.length);
        const newCard = potentialCards[randomIndex];
        cardContext.addCard(newCard.title, newCard.description, 0, 0);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="masonry-board">
      <GridLayout
        className="masonry-grid"
        autoSize={true}
        layout={layout}
        cols={10}
        rowHeight={100}
        width={width}
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        margin={[50, 50]}
        draggableHandle=".drag-handle"
      >
        {cards.map((card) => (
          <div key={card.id}>
            <Card
              id={card.id}
              title={card.title}
              description={card.description}
              onRemove={removeCard}
            />
          </div>
        ))}
      </GridLayout>
    </div>
  );
}
