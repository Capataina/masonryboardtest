import { createContext, useContext, useState, ReactNode } from 'react';

// Define the Card type
export type Card = {
  id: string;
  title: string;
  description: string;
  width: number;
  height: number;
};

// Define the context type
type CardContextType = {
  cards: Card[];
  addCard: (title: string, description: string, width: number, height: number) => void;
  removeCard: (id: string) => void;
};

// Create the context
export const CardContext = createContext<CardContextType | undefined>(undefined);

const calculateCardSize = (title: string, description: string, cards: Card[]): { width: number, height: number } => {
  const totalChars = title.length + description.length;

  // If there are no other cards, return default size
  if (cards.length === 0) {
    return { width: 2, height: 2 };
  }

  const charCounts = cards.map(card => card.title.length + card.description.length);
  const minChars = Math.min(...charCounts, totalChars);
  const maxChars = Math.max(...charCounts, totalChars);

  // Linear interpolation between 1 and 4 based on character count
  const normalizedSize = 2 + 1 * (totalChars - minChars) / (maxChars - minChars || 1); // Avoid division by zero
  const size = Math.max(2, Math.min(3, Math.round(normalizedSize)));

  return { width: size, height: size };
};

// Add this new function after calculateCardSize
const recalculateAllCardSizes = (cardsToRecalculate: Card[]) => {
  // First pass: create cards without sizes for baseline calculation
  const cardsWithoutSizes = cardsToRecalculate.map(card => ({
    ...card,
    width: 0,
    height: 0
  }));

  // Second pass: calculate new sizes using all cards
  return cardsToRecalculate.map(card => ({
    ...card,
    ...calculateCardSize(card.title, card.description, cardsWithoutSizes)
  }));
};

// Create the provider component
type CardProviderProps = {
  children: ReactNode;
};

export function CardProvider({ children }: CardProviderProps) {
  const [cards, setCards] = useState<Card[]>(() => {
    const initialCards = [
      {
        id: crypto.randomUUID(),
        title: "Welcome to Card Board",
        description: "This is an example card to show you how things work. You can add and remove cards as needed.",
      },
      {
        id: crypto.randomUUID(),
        title: "Recipe: Chocolate Cake",
        description: "Mix flour, cocoa powder, eggs, and sugar. Bake at 350°F for 30 minutes. Enjoy your delicious chocolate cake!",
      },
      {
        id: crypto.randomUUID(),
        title: "Weekend Project Ideas",
        description: "1. Plant a small herb garden\n2. Learn a new programming language\n3. Organize your digital photos",
      },
      {
        id: crypto.randomUUID(),
        title: "Daily Exercise Routine",
        description: "Morning: 20 min jog\nNoon: 10 min stretching\nEvening: 30 min strength training\nStay consistent and track your progress!",
      },
      {
        id: crypto.randomUUID(),
        title: "Book Notes: The Alchemist",
        description: "Key themes: Personal Legend, following your dreams, universal language of the world. Beautiful story about a shepherd boy's journey across the desert.",
      },
      {
        id: crypto.randomUUID(),
        title: "Photography Tips",
        description: "1. Rule of thirds\n2. Leading lines\n3. Natural lighting\n4. Depth of field\n5. Practice composition",
      },
      {
        id: crypto.randomUUID(),
        title: "Travel Bucket List",
        description: "- Northern Lights in Iceland\n- Cherry blossoms in Japan\n- Great Barrier Reef\n- Machu Picchu\n- African Safari",
      },
      {
        id: crypto.randomUUID(),
        title: "Meditation Guide",
        description: "Find a quiet space. Sit comfortably. Focus on your breath. Start with 5 minutes daily. Gradually increase duration. Notice thoughts without judgment.",
      },
      {
        id: crypto.randomUUID(),
        title: "Quick Pasta Recipe",
        description: "Ingredients: pasta, olive oil, garlic, cherry tomatoes, basil. Boil pasta, sauté garlic, add tomatoes, toss with pasta, garnish with basil.",
      },
      {
        id: crypto.randomUUID(),
        title: "Home Office Setup",
        description: "Ergonomic chair, proper desk height, external monitor, good lighting, plants for better air quality, noise-canceling headphones.",
      },
      {
        id: crypto.randomUUID(),
        title: "Language Learning Progress",
        description: "Spanish:\n- Basic conversations ✓\n- Present tense ✓\n- Past tense (in progress)\n- 500 common words ✓\nNext goal: Read short stories",
      },
      {
        id: crypto.randomUUID(),
        title: "Garden Planning",
        description: "Spring: Plant tomatoes, herbs\nSummer: Regular watering schedule\nFall: Harvest and prepare for winter\nWinter: Plan next year's layout",
      },
      {
        id: crypto.randomUUID(),
        title: "Weekly Goals",
        description: "1. Complete project presentation\n2. Read two chapters\n3. Gym three times\n4. Call family\n5. Organize desk",
      }
    ];

    // First pass: create cards without sizes
    const cardsWithoutSizes = initialCards.map(card => ({
      ...card,
      width: 0,
      height: 0
    }));

    // Second pass: calculate sizes using all cards
    return initialCards.map(card => ({
      ...card,
      ...calculateCardSize(card.title, card.description, cardsWithoutSizes)
    }));
  });

  const addCard = (title: string, description: string) => {
    const newCard: Card = {
      id: crypto.randomUUID(),
      title,
      description,
      width: 0,  // Temporary values
      height: 0
    };
    
    setCards((prevCards) => {
      const updatedCards = [...prevCards, newCard];
      return recalculateAllCardSizes(updatedCards);
    });
  };

  const removeCard = (id: string) => {
    setCards((prevCards) => {
      const filteredCards = prevCards.filter((card) => card.id !== id);
      return recalculateAllCardSizes(filteredCards);
    });
  };

  const value = {
    cards,
    addCard,
    removeCard,
  };

  return <CardContext.Provider value={value}>{children}</CardContext.Provider>;
}

// Create a custom hook to use the card context
export function useCards() {
  const context = useContext(CardContext);
  if (context === undefined) {
    throw new Error('useCards must be used within a CardProvider');
  }
  return context;
}
